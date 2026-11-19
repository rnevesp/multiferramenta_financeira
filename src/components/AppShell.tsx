import { Link } from "@tanstack/react-router";
import { LayoutGrid, ShieldAlert, Scale, BadgePercent, History, Users, Settings } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Painel", icon: LayoutGrid },
  { to: "/ferramenta/$toolId", params: { toolId: "diagnostico-fiscal" }, label: "Diagnóstico Fiscal", icon: ShieldAlert },
  { to: "/ferramenta/$toolId", params: { toolId: "enquadramento-fiscal" }, label: "Enquadramento Fiscal", icon: Scale },
  { to: "/ferramenta/$toolId", params: { toolId: "beneficios-fiscais" }, label: "Benefícios Fiscais", icon: BadgePercent },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/definicoes", label: "Definições", icon: Settings },
] as const;

const paramsOf = (n: (typeof nav)[number]) => ("params" in n ? n.params : undefined);

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="no-print hidden w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
        <div className="mb-8">
          <div className="font-serif text-xl text-sidebar-primary">Gabinete RAG</div>
          <div className="text-xs opacity-70">Contabilidade &amp; Fiscalidade</div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              params={paramsOf(n) as never}
              activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto text-xs opacity-60">Recomendações sujeitas a validação por contabilista certificado.</p>
      </aside>
      <div className="flex-1">
        <nav className="no-print flex gap-3 overflow-x-auto border-b bg-sidebar p-3 text-sm text-sidebar-foreground md:hidden">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} params={paramsOf(n) as never} className="whitespace-nowrap">{n.label}</Link>
          ))}
        </nav>
        <main className="mx-auto max-w-5xl p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
