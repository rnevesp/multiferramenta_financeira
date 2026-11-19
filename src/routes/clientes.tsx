import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [
    { title: "Clientes — Gabinete RAG" }, { name: "description", content: "Gestão de clientes." },
    { property: "og:title", content: "Clientes — Gabinete RAG" }, { property: "og:description", content: "Gestão de clientes." },
  ] }),
  component: Clientes,
});

function Clientes() {
  const clientes = useStore((s) => s.clientes);
  const [nome, setNome] = useState("");
  const [nif, setNif] = useState("");
  return (
    <div>
      <h1 className="text-3xl">Clientes</h1>
      <form className="mt-6 flex flex-wrap gap-2" onSubmit={(e) => {
        e.preventDefault();
        if (!nome.trim()) return;
        setState((s) => ({ ...s, clientes: [...s.clientes, { id: uid(), nome: nome.trim(), nif: nif.trim() }] }));
        setNome(""); setNif("");
      }}>
        <Input className="max-w-xs" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input className="max-w-[10rem]" placeholder="NIF" value={nif} onChange={(e) => setNif(e.target.value)} />
        <Button type="submit">Adicionar</Button>
      </form>
      <ul className="mt-6 divide-y rounded-lg border bg-card">
        {clientes.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4 text-sm">
            <span>{c.nome} <span className="text-muted-foreground">· {c.nif}</span></span>
            <Button variant="ghost" size="sm" onClick={() => setState((s) => ({ ...s, clientes: s.clientes.filter((x) => x.id !== c.id) }))}>Remover</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
