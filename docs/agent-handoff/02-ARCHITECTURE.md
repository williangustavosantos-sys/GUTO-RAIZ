# Arquitetura V3 ativa

## Fluxo principal — IMPLEMENTED

```text
FRONTEND
  -> GUTO V3 API
  -> ContextBuilder
  -> Genkit / Gemini
  -> DecisionEnvelope
  -> Policy Gate
  -> Deterministic Executors
  -> PostgreSQL / Supabase
```

- **Frontend (IMPLEMENTED):** cliente Next.js; usa as rotas `/guto/v3/*` quando a flag V3 está ativa e bloqueia superfícies Companion legadas.
- **GUTO V3 API (IMPLEMENTED):** router Express com auth V3, validação de contratos, locks, idempotência e rotas de estado, First Contact, treino, dieta, chat e contexto ativo.
- **ContextBuilder (IMPLEMENTED):** combina snapshot oficial, contexto ativo operacional, memória relacional e candidatos permitidos. Rejeita contexto não confirmado ou versões inconsistentes.
- **Genkit/Gemini (IMPLEMENTED):** produz saída estruturada para interpretação, decisão proposta e linguagem. A implementação ativa usa Gemini Interactions; Genkit registra o flow e avaliadores.
- **DecisionEnvelope (IMPLEMENTED):** contrato estruturado da decisão proposta, com ação, fala, fatos e metadados de correlação.
- **Policy Gate (IMPLEMENTED):** autoriza ou rejeita a ação proposta conforme o snapshot e os limites do contrato.
- **Deterministic Executors (IMPLEMENTED):** executam mutações oficiais, geração de planos, swaps, fatos e efeitos. A LLM não grava estado oficial diretamente.
- **PostgreSQL/Supabase (IMPLEMENTED):** verdade durável, oficial, versionada e isolada por tenant/usuário; runtime usa papéis restritos e RLS.

## Sistemas complementares

- **Redis (IMPLEMENTED):** contexto ativo transitório, locks e idempotência/retry, com chaves isoladas por `tenantId:userId`. Não é verdade oficial do usuário.
- **Mem0 (IMPLEMENTED):** busca e grava memória de relacionamento. O sync assíncrono aceita apenas candidatos classificados como `RELATIONSHIP`.
- **Langfuse (IMPLEMENTED):** observabilidade via OpenTelemetry; correlação e spans V3. Não é storage oficial.
- **Inngest (IMPLEMENTED):** entrega durável do sync de memória relacional, com retries e idempotência por tenant, usuário e correlation ID.

## Domínios

- **Workout Engine (IMPLEMENTED):** geração e evolução determinísticas a partir do contexto confirmado, com catálogo e restrições. Alterações oficiais são persistidas pelo executor/repositório.
- **Nutrition Engine (PARTIAL):** geração, soma e validação aritmética determinísticas existem, assim como persistência por versão de contexto. A individualização de meta energética, macros, porções e otimização ainda não é robusta; o plano atual usa alimentos e quantidades quase fixos. A evolução para solver/constraints é `PLANNED`, não arquitetura implementada.
- **Exercise/Food substitution (PARTIAL):** execução e persistência existem. O swap de alimento ainda não preserva adequadamente papel nutricional, macros, refeição e meta diária.

## Limite de autoridade

Gemini pode propor e explicar. Policy Gate e executors decidem o que pode ocorrer. PostgreSQL confirma o que ocorreu. Redis, Mem0, Langfuse e Inngest nunca substituem essa cadeia.
