import { useSyncExternalStore } from "react";
import { DEFAULT_RATES, type Rates } from "./calc";

export type Cliente = { id: string; nome: string; nif: string };
export type Item = { tipo: "risco" | "oportunidade" | "beneficio" | "nota"; titulo: string; detalhe: string };
export type Fonte = { referencia: string; excerto?: string };
export type Resultado = { resumo: string; itens: Item[]; fontes: Fonte[] };
export type Analise = {
  id: string;
  ferramenta: string;
  clienteId: string;
  data: string;
  dados: Record<string, string>;
  calculos: { label: string; valor: string }[];
  resultado: Resultado;
  demo: boolean;
  validada: boolean;
  sessionId: string;
};
export type Settings = { formUrl: string; chatUrl: string; rates: Rates };
type State = { clientes: Cliente[]; analises: Analise[]; settings: Settings };

const KEY = "contab-rag-v1";

/** Default n8n form trigger URL (can be changed in Definições). */
export const DEFAULT_FORM_URL =
  "https://n8n.srv1203601.hstgr.cloud/form-test/97b0c0c6-26fd-443d-895c-c1faae460a01";
const initial: State = {
  clientes: [{ id: "c1", nome: "Exemplo, Lda.", nif: "509999999" }],
  analises: [],
  settings: { formUrl: DEFAULT_FORM_URL, chatUrl: "", rates: DEFAULT_RATES },
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      const settings = { ...initial.settings, ...saved.settings };
      // Browsers that saved settings before a default existed keep an empty URL; use the default.
      if (!settings.formUrl) settings.formUrl = DEFAULT_FORM_URL;
      state = { ...initial, ...saved, settings };
    }
  } catch {}
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      load();
      listeners.add(l);
      l();
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(initial),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);
