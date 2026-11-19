import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const urlSchema = z.string().url().refine((u) => u.startsWith("https://") || u.startsWith("http://"));

function normalizar(raw: unknown) {
  // Accept several common n8n output shapes and map to {resumo, itens, fontes}.
  let obj: any = Array.isArray(raw) ? raw[0] : raw;
  if (obj && typeof obj.output === "string") {
    try { obj = JSON.parse(obj.output); } catch { obj = { resumo: obj.output }; }
  } else if (obj?.output && typeof obj.output === "object") obj = obj.output;
  if (typeof obj === "string") obj = { resumo: obj };
  return {
    resumo: String(obj?.resumo ?? obj?.summary ?? obj?.text ?? ""),
    itens: Array.isArray(obj?.itens) ? obj.itens : [],
    fontes: Array.isArray(obj?.fontes) ? obj.fontes : [],
  };
}

export const enviarFormulario = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      url: urlSchema,
      campos: z.record(z.string()),
      ficheiros: z.array(z.object({ nome: z.string(), tipo: z.string(), base64: z.string() })).max(5),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(data.campos)) fd.append(k, v);
    for (const f of data.ficheiros) {
      const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
      fd.append("documentos", new Blob([bytes], { type: f.tipo }), f.nome);
    }
    try {
      const res = await fetch(data.url, { method: "POST", body: fd });
      const text = await res.text();
      if (!res.ok) return { ok: false as const, erro: `n8n respondeu ${res.status}: ${text.slice(0, 300)}` };
      let json: unknown = text;
      try { json = JSON.parse(text); } catch {}
      return { ok: true as const, resultado: normalizar(json) };
    } catch (e) {
      return { ok: false as const, erro: `Não foi possível contactar o n8n: ${(e as Error).message}` };
    }
  });

export const enviarChat = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ url: urlSchema, sessionId: z.string(), mensagem: z.string().min(1).max(4000), contexto: z.string().max(20000) }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const res = await fetch(data.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sendMessage", sessionId: data.sessionId, chatInput: data.mensagem, contexto: data.contexto }),
      });
      const text = await res.text();
      if (!res.ok) return { ok: false as const, erro: `n8n respondeu ${res.status}: ${text.slice(0, 300)}` };
      let out = text;
      try { const j = JSON.parse(text); out = (Array.isArray(j) ? j[0] : j)?.output ?? (Array.isArray(j) ? j[0] : j)?.text ?? text; } catch {}
      return { ok: true as const, resposta: String(out) };
    } catch (e) {
      return { ok: false as const, erro: `Não foi possível contactar o n8n: ${(e as Error).message}` };
    }
  });
