# Testes e baseline

Use os scripts que existem nos `package.json`; não invente um gate novo para declarar sucesso.

## Backend / CEREBROGUTO

| Objetivo | Comando real |
|---|---|
| Suite backend completa | `npm test` |
| Suite V3 | `npm run test:v3` |
| TypeScript | `npm run typecheck` |
| Cenários do fundador | `npm run founder-scenarios` |
| Gate de release | `npm run release:gate` |
| Verificação de integrações V3 reais | `npm run verify:v3:real` |
| Evals V3 | `npm run eval:v3` |
| Evals gerais | `npm run eval:guto` |

`verify:v3:real`, cenários reais e gates que usam serviços externos exigem ambiente isolado, credenciais próprias e autorização para escrita. Não apontar esses comandos para uma conta real ou Production por conveniência.

DeepEval está versionado em `evals/deepeval/`. A instrução real é executar `uv run pytest` dentro dessa pasta. A suite é determinística e não torna um judge LLM autoridade clínica ou operacional.

## Frontend / CORPOGUTO

| Objetivo | Comando real |
|---|---|
| Testes | `npm test` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| E2E Playwright | `npx playwright test` |

Não há script `typecheck` nomeado no package frontend. Quando necessário, use o compilador instalado: `npx tsc --noEmit`.

## Baseline do handoff

O baseline seguro foi executado nas worktrees limpas Freebuff em 2026-08-28. Resultados registrados no commit de handoff:

- BACKEND_TESTS: `PASS` — `npm test`, exit 0 em todos os arquivos descobertos pelo runner.
- V3_TESTS: `PASS` — 56 testes, 56 pass, 0 fail.
- BACKEND_TYPECHECK: `PASS` — `npm run typecheck`.
- FRONTEND_TESTS: `PASS` — 161 testes, 161 pass, 0 fail.
- FRONTEND_TYPECHECK: `PASS` — `npx tsc --noEmit`.
- FRONTEND_BUILD: `PASS` — `npm run build`, Next.js compilado e 17 páginas geradas.
- DEEPEVAL: `PASS` — 1 teste, 1 pass; um warning de depreciação do event loop no teardown.
- E2E_BROWSER: Founder Smoke anterior `PASS`; Founder Manual Test `IN_PROGRESS`. Playwright não substitui esse gate humano.

Observações não bloqueantes do baseline: o runner Node emitiu `DEP0205` para `module.register()`; a instalação backend reportou dependências com vulnerabilidades conhecidas. Isso não foi corrigido nesta missão documental e não deve ser confundido com aceite de segurança ou com os quatro achados do Founder Test.

## Regra de evidência

`UNIT TEST PASS != FOUNDER TEST PASS`.

Jornadas críticas exigem navegador real, resposta da API, persistência oficial e continuidade. O fundador mantém o aceite final; nenhum agente pode declarar Beta com base apenas em testes automatizados.
