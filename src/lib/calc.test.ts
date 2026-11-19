import { describe, it, expect } from "vitest";
import { estimarIRC, calcularIVA } from "./calc";

describe("cálculos determinísticos", () => {
  it("PME: taxa reduzida até ao limite, geral no excedente", () => {
    expect(estimarIRC(100000, true)).toBe(50000 * 0.15 + 50000 * 0.19);
  });
  it("Grande empresa: taxa geral sobre tudo", () => {
    expect(estimarIRC(100000, false)).toBe(19000);
  });
  it("Prejuízo não gera IRC", () => {
    expect(estimarIRC(-5000, true)).toBe(0);
  });
  it("IVA a 23%", () => {
    expect(calcularIVA(1000, 23)).toBe(230);
  });
});
