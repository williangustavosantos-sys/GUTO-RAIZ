# Repositórios, branches e worktrees

## Repositórios GitHub

| Papel | Repositório | Remote |
|---|---|---|
| Root/orquestração | GUTO-RAIZ | `https://github.com/williangustavosantos-sys/GUTO-RAIZ.git` |
| Frontend | CORPOGUTO | `https://github.com/williangustavosantos-sys/CORPOGUTO.git` |
| Backend | CEREBROGUTO | `https://github.com/williangustavosantos-sys/CEREBROGUTO.git` |

O root contém `guto-app-v0` e `guto-backend` como submodules. Eles são repositórios independentes e têm branches próprias.

## Branch de trabalho do Freebuff

Use `freebuff/guto-v3` nos três repositórios:

| Worktree limpa | Base exata |
|---|---|
| `/Users/williandossantos/GUTOO/worktrees/freebuff-guto-v3-root` | root `ac669c7` + commit de handoff |
| `/Users/williandossantos/GUTOO/worktrees/freebuff-guto-v3-frontend` | frontend `6ccb42b` |
| `/Users/williandossantos/GUTOO/worktrees/freebuff-guto-v3-backend` | backend `bc48aea` |

Antes de trabalhar, confirme `git status --short --branch`, `git branch --show-current`, `git rev-parse HEAD` e upstream. Não comece em `main` antigo nem na worktree backend parcial.

## Gitlinks do root

No commit root `ac669c7`:

- `guto-app-v0` -> `6ccb42bff7681398261ca4348905482241ee8454`;
- `guto-backend` -> `83eb228c6a31501bf6f0463c125c120f0d37bf35`.

O backend validado atual é `bc48aea`, um commit posterior ao gitlink. Essa diferença é conhecida e deve ser verificada conscientemente; não use o gitlink antigo como autoridade para escolher o backend.

## Inventário de pendências preservadas

| Local | Estado em 2026-08-28 |
|---|---|
| `/Users/williandossantos/GUTOO` | `main` em `acd9b96`, atrás de `origin/main` por 4; sete arquivos staged, vários untracked, dois gitlinks modificados, cinco stashes |
| `worktrees/guto-cerebro-v3-root` | `codex/guto-cerebro-v3`, limpo, upstream 0/0 |
| `worktrees/guto-cerebro-v3-frontend` | `codex/guto-cerebro-v3`, limpo, upstream 0/0, sem stash |
| `worktrees/guto-cerebro-v3-backend` | `codex/guto-cerebro-v3`, upstream 0/0; três modificados e dois untracked; três stashes no repositório backend |

O trabalho parcial backend está listado em `01-CURRENT-STATE.md`. Não foi movido, limpo, resetado ou incluído na branch Freebuff. Os stashes pertencem a trabalhos antigos e também não devem ser aplicados sem solicitação explícita.
