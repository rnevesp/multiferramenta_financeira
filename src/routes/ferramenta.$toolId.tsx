import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ResultView } from "@/components/ResultView";
import { getTool } from "@/lib/tools";
import { DEMO } from "@/lib/demo";
import { enviarFormulario } from "@/lib/n8n.functions";
import { setState, uid, useStore, type Analise, type Resultado } from "@/lib/store";
import { calcularIVA, estimarIRC, eur, isPme } from "@/lib/calc";

export const Route = createFileRoute("/ferramenta/$toolId")({
  loader: ({ params }) => {
    const t = getTool(params.toolId);
    if (!t) throw notFound();
    return { nome: t.nome, descricao: t.descricao };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.nome ?? "Ferramenta"} — Gabinete RAG` },
      { name: "description", content: loaderData?.descricao ?? "Ferramenta de contabilidade." },
      { property: "og:title", content: `${loaderData?.nome ?? "Ferramenta"} — Gabinete RAG` },
      { property: "og:description", content: loaderData?.descricao ?? "Ferramenta de contabilidade." },
    ],
  }),
  component: ToolPage,
});

const toB64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] ?? "");
    r.onerror = rej;
    r.readAsDataURL(f);
  });

function ToolPage() {
  const { toolId } = Route.useParams();
  // Remount per tool so form state and the shown result don't leak between tools.
  return <ToolForm key={toolId} toolId={toolId} />;
}

function ToolForm({ toolId }: { toolId: string }) {
  const tool = getTool(toolId)!;
  const clientes = useStore((s) => s.clientes);
  const settings = useStore((s) => s.settings);
  const analises = useStore((s) => s.analises);
  const send = useServerFn(enviarFormulario);
  const [clienteId, setClienteId] = useState("");
  const [dados, setDados] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [atualId, setAtualId] = useState<string | null>(null);
  const atual = analises.find((a) => a.id === atualId);
  const cid = clienteId || clientes[0]?.id || "";

  function calculos() {
    const out: Analise["calculos"] = [];
    const n = (k: string) => Number(dados[k] || 0);
    if (dados["resultado_antes_impostos"])
      out.push({ label: "IRC estimado (sem ajustamentos)", valor: eur(estimarIRC(n("resultado_antes_impostos"), isPme(dados["dimensao"]), settings.rates)) });
    if (dados["montante"] && dados["taxa_iva"])
      out.push({ label: "IVA da operação", valor: eur(calcularIVA(n("montante"), n("taxa_iva"))) });
    return out;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cid) {
      toast.error("Crie primeiro um cliente.");
      return;
    }
    setBusy(true);
    let resultado: Resultado = DEMO[tool.id] ?? { resumo: "", itens: [], fontes: [] };
    let demo = true;
    if (settings.formUrl) {
      const ficheiros = await Promise.all(files.slice(0, 5).map(async (f) => ({ nome: f.name, tipo: f.type || "application/octet-stream", base64: await toB64(f) })));
      const res = await send({ data: { url: settings.formUrl, campoFicheiros: settings.campoFicheiros || "field-0", campos: { ferramenta: tool.id, cliente_id: cid, ...dados }, ficheiros } });
      if (!res.ok) {
        setBusy(false);
        toast.error(res.erro);
        return;
      }
      resultado = res.resultado as Resultado;
      demo = false;
    }
    const a: Analise = { id: uid(), ferramenta: tool.id, clienteId: cid, data: new Date().toISOString(), dados, calculos: calculos(), resultado, demo, validada: false, sessionId: uid() };
    setState((s) => ({ ...s, analises: [a, ...s.analises] }));
    setAtualId(a.id);
    setBusy(false);
  }

  const sel = "h-9 w-full rounded-md border border-input bg-card px-3 text-sm";
  return (
    <div>
      <h1 className="text-3xl">{tool.nome}</h1>
      <p className="mt-2 text-muted-foreground">{tool.descricao}</p>
      <form onSubmit={submit} className="no-print mt-6 grid gap-4 rounded-lg border bg-card p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Cliente</Label>
          <select className={sel} value={cid} onChange={(e) => setClienteId(e.target.value)}>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome} ({c.nif})</option>)}
          </select>
        </div>
        {tool.campos.map((f) => (
          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
            <Label>{f.label}</Label>
            {f.type === "select" ? (
              <select className={sel} value={dados[f.name] ?? ""} onChange={(e) => setDados({ ...dados, [f.name]: e.target.value })}>
                <option value="">—</option>
                {f.options!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <Textarea value={dados[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setDados({ ...dados, [f.name]: e.target.value })} />
            ) : (
              <Input type={f.type} value={dados[f.name] ?? ""} placeholder={f.placeholder} onChange={(e) => setDados({ ...dados, [f.name]: e.target.value })} />
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          <Label>Documentos (PDF, Excel — opcional, máx. 5)</Label>
          <Input type="file" multiple accept=".pdf,.xls,.xlsx,.csv" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>{busy ? "A analisar…" : settings.formUrl ? "Analisar" : "Analisar (demonstração)"}</Button>
        </div>
      </form>
      {atual && <div className="mt-8"><ResultView analise={atual} /></div>}
    </div>
  );
}
