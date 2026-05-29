# Parte 5 — Painel Admin e Coach (ponteiro)

> **Esta série `PARTE_x` virou ponteiro.** A fonte canônica do painel é **`GUTO_PAINEL_ADMIN_CANONICO_V1.md`**. Este arquivo só aponta o caminho.

## Onde está o conteúdo desta parte

| Tema | Documento canônico |
|---|---|
| **Painel completo** (papéis, telas, fluxos, endpoints, idioma, conexão com o app, GAPs) | `GUTO_PAINEL_ADMIN_CANONICO_V1.md` |
| Visão página 16 (retaguarda B2B2C) | `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 16) |
| Design canônico do painel (protótipo visual) | `design_handoff_guto_coach_panel/` |

## Resumo (o painel em 4 linhas)

- Hierarquia estrita: **Super Admin → Empresa (`teamId`) → Coach (`coachId`) → Aluno → Dados**. Não existe aluno sem empresa e coach (exceção interna `GUTO_CORE`).
- Painel é **rota única `/coach`** (cockpit role-aware); `/admin` e `/empresa` redirecionam. API canônica: `/admin/*`.
- Coach vive **dentro da empresa**; treino/dieta vivem **dentro do aluno**. Arena Semanal/Mensal por empresa; Geral global.
- **XP, streak e Nome Soberano são imutáveis** pelo painel. Calibragem editável só por campos validados. 3 idiomas (PT/EN/IT), nada hardcoded.
