import type { Resultado } from "./store";

export const DEMO: Record<string, Resultado> = {
  "diagnostico-fiscal": {
    resumo: "Exemplo de demonstração. A empresa apresenta risco moderado em tributações autónomas e oportunidade de dedução de prejuízos fiscais.",
    itens: [
      { tipo: "risco", titulo: "Tributações autónomas em viaturas", detalhe: "Encargos com viaturas ligeiras de passageiros sujeitos a taxas autónomas." },
      { tipo: "oportunidade", titulo: "Dedução de prejuízos fiscais", detalhe: "Verificar reporte de prejuízos de períodos anteriores." },
      { tipo: "beneficio", titulo: "Incentivo à capitalização", detalhe: "Avaliar aplicabilidade do ICE a aumentos de capitais próprios." },
    ],
    fontes: [{ referencia: "CIRC, art. 88.º" }, { referencia: "CIRC, art. 52.º" }, { referencia: "EBF, art. 43.º-D" }],
  },
  "enquadramento-fiscal": {
    resumo: "Exemplo de demonstração. A operação parece enquadrar-se como gasto dedutível, condicionado a documentação adequada.",
    itens: [
      { tipo: "nota", titulo: "Dedutibilidade do gasto", detalhe: "Gasto dedutível se comprovado e indispensável à atividade." },
      { tipo: "risco", titulo: "Documentação de suporte", detalhe: "Exigir fatura com NIF do adquirente." },
    ],
    fontes: [{ referencia: "CIRC, art. 23.º" }, { referencia: "CIVA, art. 36.º" }],
  },
  "beneficios-fiscais": {
    resumo: "Exemplo de demonstração. Identificados incentivos potencialmente aplicáveis ao investimento e à I&D.",
    itens: [
      { tipo: "beneficio", titulo: "RFAI", detalhe: "Dedução à coleta por investimento em ativos elegíveis." },
      { tipo: "beneficio", titulo: "SIFIDE II", detalhe: "Dedução de despesas com I&D, se aplicável." },
    ],
    fontes: [{ referencia: "CFI, arts. 22.º a 26.º" }, { referencia: "CFI, arts. 35.º a 42.º" }],
  },
};
