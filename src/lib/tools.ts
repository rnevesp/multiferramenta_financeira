export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
};

export type ToolDef = {
  id: "diagnostico-fiscal" | "enquadramento-fiscal" | "beneficios-fiscais";
  nome: string;
  curto: string;
  descricao: string;
  campos: FieldDef[];
};

const dimensao = ["Micro", "Pequena", "Média", "Grande"];
const regioes = ["Norte", "Centro", "Área Metropolitana de Lisboa", "Alentejo", "Algarve", "Açores", "Madeira"];

export const TOOLS: ToolDef[] = [
  {
    id: "diagnostico-fiscal",
    nome: "Diagnóstico Fiscal",
    curto: "Riscos, oportunidades e benefícios",
    descricao: "Identifica riscos, oportunidades e benefícios fiscais com base no perfil e nos documentos da empresa.",
    campos: [
      { name: "cae", label: "CAE principal", type: "text", placeholder: "ex.: 62010" },
      { name: "dimensao", label: "Dimensão", type: "select", options: dimensao },
      { name: "volume_negocios", label: "Volume de negócios (€)", type: "number" },
      { name: "resultado_antes_impostos", label: "Resultado antes de impostos (€)", type: "number" },
      { name: "observacoes", label: "Observações", type: "textarea", placeholder: "Contexto relevante, dúvidas específicas…" },
    ],
  },
  {
    id: "enquadramento-fiscal",
    nome: "Consultor de Enquadramento Fiscal",
    curto: "Operações, investimentos e despesas",
    descricao: "Analisa o enquadramento fiscal de operações comerciais, investimentos e despesas.",
    campos: [
      { name: "tipo_operacao", label: "Tipo de operação", type: "select", options: ["Operação comercial", "Investimento", "Despesa"] },
      { name: "descricao_operacao", label: "Descrição da operação", type: "textarea", placeholder: "Descreva a operação, contraparte, país…" },
      { name: "montante", label: "Montante (€)", type: "number" },
      { name: "taxa_iva", label: "Taxa de IVA aplicável (%)", type: "number", placeholder: "23" },
    ],
  },
  {
    id: "beneficios-fiscais",
    nome: "Consultor de Benefícios Fiscais",
    curto: "Incentivos para o perfil da empresa",
    descricao: "Identifica incentivos e benefícios fiscais aplicáveis ao perfil da empresa (EBF, CFI, SIFIDE, RFAI…).",
    campos: [
      { name: "cae", label: "CAE principal", type: "text" },
      { name: "dimensao", label: "Dimensão", type: "select", options: dimensao },
      { name: "regiao", label: "Região (NUTS II)", type: "select", options: regioes },
      { name: "investimento_previsto", label: "Investimento previsto (€)", type: "number" },
      { name: "n_trabalhadores", label: "N.º de trabalhadores", type: "number" },
      { name: "atividade_id", label: "Atividade de I&D / inovação", type: "select", options: ["Sim", "Não"] },
    ],
  },
];

export const getTool = (id: string) => TOOLS.find((t) => t.id === id);
