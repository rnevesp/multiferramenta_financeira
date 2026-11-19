import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — Gabinete RAG" },
      { name: "description", content: "Diagnóstico Fiscal, Enquadramento Fiscal e Benefícios Fiscais num só painel." },
      { property: "og:title", content: "Painel — Gabinete RAG" },
      { property: "og:description", content: "Ferramentas de contabilidade com RAG ligado ao n8n." },
    ],
  }),
  component: Index,
});

function Index() {
  const analises = useStore((s) => s.analises);
  const settings = useStore((s) => s.settings);
  return (
    <div>
      <p className="text-sm uppercase tracking-widest text-muted-foreground">Ferramentas de contabilidade</p>
      <h1 className="mt-2 text-4xl">Bom trabalho começa com boas fontes.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Escolha uma ferramenta. Todas usam o mesmo motor RAG em n8n — legislação fiscal, SNC/NCRF, OCC/AT e documentos do cliente.</p>
      {!settings.formUrl && (
        <div className="mt-6 rounded-md border border-warning bg-accent/40 p-3 text-sm">
          Modo de demonstração ativo. <Link to="/definicoes" className="underline">Configure os URLs do n8n</Link> para respostas reais.
        </div>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TOOLS.map((t, i) => (
          <Link key={t.id} to="/ferramenta/$toolId" params={{ toolId: t.id }}
            className="group flex flex-col rounded-lg border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <span className="font-serif text-3xl text-accent-foreground/40">0{i + 1}</span>
            <h2 className="mt-3 text-xl">{t.nome}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.descricao}</p>
            <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">Abrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">{analises.length} análise(s) no histórico.</p>
    </div>
  );
}
