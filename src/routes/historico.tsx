import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ResultView } from "@/components/ResultView";
import { useStore } from "@/lib/store";
import { getTool } from "@/lib/tools";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [
    { title: "Histórico — Gabinete RAG" }, { name: "description", content: "Histórico de análises por cliente." },
    { property: "og:title", content: "Histórico — Gabinete RAG" }, { property: "og:description", content: "Histórico de análises por cliente." },
  ] }),
  component: Historico,
});

function Historico() {
  const analises = useStore((s) => s.analises);
  const clientes = useStore((s) => s.clientes);
  const [filtro, setFiltro] = useState("");
  const [aberta, setAberta] = useState<string | null>(null);
  const lista = analises.filter((a) => !filtro || a.clienteId === filtro);
  const sel = analises.find((a) => a.id === aberta);
  return (
    <div>
      <h1 className="text-3xl">Histórico</h1>
      <select className="no-print mt-4 h-9 rounded-md border border-input bg-card px-3 text-sm" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="">Todos os clientes</option>
        {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <ul className="no-print mt-4 divide-y rounded-lg border bg-card">
        {lista.length === 0 && <li className="p-4 text-sm text-muted-foreground">Sem análises.</li>}
        {lista.map((a) => (
          <li key={a.id}>
            <button className="flex w-full justify-between p-4 text-left text-sm hover:bg-muted" onClick={() => setAberta(a.id)}>
              <span>{getTool(a.ferramenta)?.nome} · {clientes.find((c) => c.id === a.clienteId)?.nome}</span>
              <span className="text-muted-foreground">{a.validada ? "Validada" : "Pendente"} · {new Date(a.data).toLocaleDateString("pt-PT")}</span>
            </button>
          </li>
        ))}
      </ul>
      {sel && <div className="mt-8"><ResultView analise={sel} /></div>}
    </div>
  );
}
