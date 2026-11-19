import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/definicoes")({
  head: () => ({ meta: [
    { title: "Definições — Gabinete RAG" }, { name: "description", content: "Ligação ao n8n e taxas." },
    { property: "og:title", content: "Definições — Gabinete RAG" }, { property: "og:description", content: "Ligação ao n8n e taxas." },
  ] }),
  component: Definicoes,
});

function Definicoes() {
  const s = useStore((x) => x.settings);
  const [f, setF] = useState(s);
  useEffect(() => setF(s), [s]);
  return (
    <div>
      <h1 className="text-3xl">Definições</h1>
      <form className="mt-6 grid max-w-xl gap-4 rounded-lg border bg-card p-6" onSubmit={(e) => {
        e.preventDefault();
        setState((st) => ({ ...st, settings: f }));
        toast.success("Definições guardadas");
      }}>
        <div><Label>URL do formulário n8n</Label><Input value={f.formUrl} onChange={(e) => setF({ ...f, formUrl: e.target.value })} placeholder="https://…/form/…" /></div>
        <div><Label>URL do chat n8n</Label><Input value={f.chatUrl} onChange={(e) => setF({ ...f, chatUrl: e.target.value })} placeholder="https://…/webhook/…/chat" /></div>
        <div><Label>Nome do campo de ficheiros no formulário n8n</Label><Input value={f.campoFicheiros} onChange={(e) => setF({ ...f, campoFicheiros: e.target.value })} placeholder="field-0" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>IRC geral (%)</Label><Input type="number" value={f.rates.ircGeral} onChange={(e) => setF({ ...f, rates: { ...f.rates, ircGeral: Number(e.target.value) } })} /></div>
          <div><Label>IRC PME (%)</Label><Input type="number" value={f.rates.ircPme} onChange={(e) => setF({ ...f, rates: { ...f.rates, ircPme: Number(e.target.value) } })} /></div>
          <div><Label>Limite PME (€)</Label><Input type="number" value={f.rates.limitePme} onChange={(e) => setF({ ...f, rates: { ...f.rates, limitePme: Number(e.target.value) } })} /></div>
        </div>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
