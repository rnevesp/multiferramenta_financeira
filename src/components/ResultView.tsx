import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, CheckCircle2, Printer, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { enviarChat } from "@/lib/n8n.functions";
import { setState, useStore, type Analise } from "@/lib/store";
import { getTool } from "@/lib/tools";

const tipoLabel = { risco: "Risco", oportunidade: "Oportunidade", beneficio: "Benefício", nota: "Nota" } as const;
const tipoClass = {
  risco: "border-l-destructive",
  oportunidade: "border-l-success",
  beneficio: "border-l-warning",
  nota: "border-l-primary",
} as const;

export function ResultView({ analise }: { analise: Analise }) {
  const clientes = useStore((s) => s.clientes);
  const chatUrl = useStore((s) => s.settings.chatUrl);
  const chat = useServerFn(enviarChat);
  const [msgs, setMsgs] = useState<{ de: "eu" | "ia"; texto: string }[]>([]);
  const [txt, setTxt] = useState("");
  const [busy, setBusy] = useState(false);
  const { resultado: r } = analise;
  const cliente = clientes.find((c) => c.id === analise.clienteId);

  const validar = () =>
    setState((s) => ({ ...s, analises: s.analises.map((a) => (a.id === analise.id ? { ...a, validada: true } : a)) }));

  async function enviar() {
    if (!txt.trim()) return;
    const m = txt.trim();
    setTxt("");
    setMsgs((x) => [...x, { de: "eu", texto: m }]);
    if (!chatUrl) {
      setMsgs((x) => [...x, { de: "ia", texto: "(Demonstração) Configure o URL do chat n8n em Definições para obter respostas reais." }]);
      return;
    }
    setBusy(true);
    const res = await chat({ data: { url: chatUrl, sessionId: analise.sessionId, mensagem: m, contexto: JSON.stringify({ ferramenta: analise.ferramenta, dados: analise.dados, resumo: r.resumo }) } });
    setBusy(false);
    if (res.ok) setMsgs((x) => [...x, { de: "ia", texto: res.resposta }]);
    else toast.error(res.erro);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">{getTool(analise.ferramenta)?.nome} · {cliente?.nome ?? "—"} · {new Date(analise.data).toLocaleString("pt-PT")}</div>
          <div className="mt-2 flex gap-2">
            {analise.demo && <Badge variant="secondary">Demonstração</Badge>}
            {analise.validada ? (
              <Badge className="bg-success text-primary-foreground"><CheckCircle2 className="mr-1 h-3 w-3" />Validada pelo contabilista certificado</Badge>
            ) : (
              <Badge className="bg-warning text-foreground">Pendente de validação pelo contabilista certificado</Badge>
            )}
          </div>
        </div>
        <div className="no-print flex gap-2">
          {!analise.validada && <Button onClick={validar}>Validar</Button>}
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Exportar PDF</Button>
        </div>
      </div>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl">Resumo</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{r.resumo || "Sem resumo."}</p>
      </section>

      {analise.calculos.length > 0 && (
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-3 text-xl">Cálculos (determinísticos)</h2>
          <dl className="grid gap-2 sm:grid-cols-2">
            {analise.calculos.map((c) => (
              <div key={c.label} className="flex justify-between rounded bg-muted px-3 py-2 text-sm">
                <dt className="text-muted-foreground">{c.label}</dt><dd className="font-medium">{c.valor}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {r.itens.length > 0 && (
        <section className="space-y-3">
          {r.itens.map((i, k) => (
            <div key={k} className={`rounded-lg border border-l-4 bg-card p-4 ${tipoClass[i.tipo] ?? tipoClass.nota}`}>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{tipoLabel[i.tipo] ?? "Nota"}</div>
              <div className="font-medium">{i.titulo}</div>
              <p className="text-sm text-muted-foreground">{i.detalhe}</p>
            </div>
          ))}
        </section>
      )}

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-3 text-xl">Fontes citadas</h2>
        {r.fontes.length === 0 ? (
          <div className="flex items-center gap-2 rounded bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />Resposta sem fontes — não utilizar sem verificação.
          </div>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {r.fontes.map((f, k) => <li key={k}><span className="font-medium">{f.referencia}</span>{f.excerto && ` — ${f.excerto}`}</li>)}
          </ul>
        )}
      </section>

      <section className="no-print rounded-lg border bg-card p-6">
        <h2 className="mb-3 text-xl">Perguntas de seguimento</h2>
        <div className="mb-3 max-h-80 space-y-2 overflow-y-auto">
          {msgs.map((m, k) => (
            <div key={k} className={`rounded-md p-3 text-sm ${m.de === "eu" ? "ml-10 bg-primary text-primary-foreground" : "mr-10 bg-muted"}`}>{m.texto}</div>
          ))}
          {busy && <div className="text-sm text-muted-foreground">A pensar…</div>}
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); enviar(); }}>
          <Input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Ex.: Que documentação devo pedir ao cliente?" />
          <Button type="submit" disabled={busy}><Send className="h-4 w-4" /></Button>
        </form>
      </section>
    </div>
  );
}
