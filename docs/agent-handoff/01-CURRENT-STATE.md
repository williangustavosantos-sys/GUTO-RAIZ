# Estado atual

Snapshot operacional: 2026-08-28, Europe/Rome.

```text
CURRENT_ROOT_SHA=ac669c75271a89ee92361f17bd7a2ef7105e8e01
CURRENT_FRONTEND_SHA=6ccb42bae63b4024abb81665bd45003446339d2c
CURRENT_BACKEND_SHA=bc48aeaf43123e4929eb233a10095d06bec64a96
```

Esses são os SHAs de código validados entregues ao Freebuff. O root ganhará um commit documental adicional sem mudar os gitlinks ou o código de produto.

## Fontes V3 validadas

| Componente | Branch validada | SHA validado |
|---|---|---|
| ROOT / GUTO-RAIZ | `codex/guto-cerebro-v3` | `ac669c75271a89ee92361f17bd7a2ef7105e8e01` |
| FRONTEND / CORPOGUTO | `codex/guto-cerebro-v3` | `6ccb42bae63b4024abb81665bd45003446339d2c` |
| BACKEND / CEREBROGUTO | `codex/guto-cerebro-v3` | `bc48aeaf43123e4929eb233a10095d06bec64a96` |

As branches `freebuff/guto-v3` nasceram exatamente desses três SHAs. O commit de documentação do root será posterior a `ac669c7`; use `git rev-parse HEAD` no root para obter o SHA do próprio handoff.

## Estado publicado

- Frontend Production: https://corpoguto.vercel.app
- Backend Production: https://cerebroguto-sovereign-smoke.vercel.app
- Production V3: alinhado com as fontes validadas acima.
- `GET /health/v3`: HTTP 200 e `ready=true`, reconfirmado em 2026-08-28.
- Panel -> V3: funcionando.
- `FOUNDER_SMOKE: PASS`.
- `FOUNDER_MANUAL_TEST: IN_PROGRESS`.
- `BETA_READY: NÃO DECLARADO`.

O Founder Smoke cobriu provisionamento Panel -> aluno, login V3, consentimento, calibragem, First Contact, confirmação, treino, dieta, contexto compartilhado e continuidade após reload. O Founder Manual Test começou depois e encontrou quatro problemas reais descritos em `08-KNOWN-ISSUES.md`.

## Estado local que não pertence à base validada

A worktree histórica do backend `worktrees/guto-cerebro-v3-backend` permanece em `bc48aea`, mas contém implementação parcial e não validada iniciada antes deste handoff:

- modificados: `src/v3/candidate-provider.ts`, `src/v3/repository.ts`, `src/v3/types.ts`;
- untracked: `src/v3/nutrition-target.ts` e `.deepeval/`;
- nenhum teste foi usado para validar esse trabalho parcial;
- não incorporar, descartar ou apresentar essas mudanças como código validado sem uma decisão explícita.

A worktree principal `/Users/williandossantos/GUTOO` também já estava suja, com arquivos staged/untracked, gitlinks modificados, cinco stashes e `main` quatro commits atrás de `origin/main`. Ela não é a base do Freebuff.

## Divergência conhecida de gitlink

O root validado `ac669c7` registra o frontend em `6ccb42b`, mas registra o backend em `83eb228`. O patch validado do backend `bc48aea` foi publicado depois sem novo bump do gitlink do root. Portanto:

- para o backend V3 use `freebuff/guto-v3` em CEREBROGUTO, SHA `bc48aea`;
- não execute `git submodule update` no root e conclua que `83eb228` é o backend atual;
- não corrija esse gitlink dentro de uma missão de bug sem tratar a mudança separadamente.
