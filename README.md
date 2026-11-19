# Gabinete RAG — Ferramentas de Contabilidade

Interface multifuncional para três ferramentas fiscais ligadas a um motor RAG em n8n:

1. **Diagnóstico Fiscal** — riscos, oportunidades e benefícios fiscais.
2. **Consultor de Enquadramento Fiscal** — operações, investimentos e despesas.
3. **Consultor de Benefícios Fiscais** — incentivos aplicáveis ao perfil da empresa.

Inclui seletor de cliente, carregamento de documentos, resultado com fontes citadas,
chat de seguimento, validação pelo contabilista certificado, exportação para PDF,
histórico e clientes. Cálculos de IRC/IVA são determinísticos (`src/lib/calc.ts`).

## Utilização

```sh
npm install
npm run dev        # http://127.0.0.1:3000
npm run build      # gera servidor Node em .output/
npm start          # corre o build de produção (PORT, HOST)
npm test
```

## Ligação ao n8n

Em **Definições**, cole o URL do trigger de formulário e o URL do chat do n8n.
Sem URLs, a aplicação funciona em modo de demonstração.

- Formulário: `POST multipart` com `ferramenta`, `cliente_id`, campos do formulário e
  `documentos` (ficheiros). Resposta esperada: `{ resumo, itens: [{tipo, titulo, detalhe}], fontes: [{referencia, excerto?}] }`
  (também aceita `{ output: "<json>" }` ou um array).
- Chat: `POST JSON { action: "sendMessage", sessionId, chatInput, contexto }` → `{ output }`.

## Notas

- Sem autenticação: clientes e análises ficam no `localStorage` do navegador.
- O servidor faz o pedido ao URL configurado (evita CORS). Numa instalação pública,
  restrinja os URLs permitidos ao seu domínio n8n.
