// Deterministic calculations — never delegated to the AI.
export type Rates = { ircGeral: number; ircPme: number; limitePme: number };

export const DEFAULT_RATES: Rates = { ircGeral: 19, ircPme: 15, limitePme: 50000 };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** IRC estimate on taxable profit. SMEs pay the reduced rate up to the limit. */
export function estimarIRC(materiaColetavel: number, pme: boolean, r: Rates = DEFAULT_RATES) {
  const mc = Math.max(0, materiaColetavel || 0);
  if (!pme) return round2((mc * r.ircGeral) / 100);
  const reduzida = Math.min(mc, r.limitePme);
  return round2((reduzida * r.ircPme) / 100 + ((mc - reduzida) * r.ircGeral) / 100);
}

/** VAT amount on a net amount. */
export function calcularIVA(montante: number, taxa: number) {
  return round2(((montante || 0) * (taxa || 0)) / 100);
}

export const isPme = (dimensao?: string) => !!dimensao && dimensao !== "Grande";

export const eur = (n: number) =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(n);
