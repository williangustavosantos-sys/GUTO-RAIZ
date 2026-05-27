# Parte 1 — Abertura, Idioma e Login (ponteiro)

> **Esta série `PARTE_x` virou ponteiro.** A leitura narrativa do fluxo está consolidada nos documentos **`*_DETALHADA`** (fonte de verdade). Este arquivo só aponta o caminho, para evitar duplicação.

## Onde está o conteúdo desta parte

| Tema | Documento canônico |
|---|---|
| Fluxo página por página (abertura → idioma → login/convite) | `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 1–3) |
| Login do aluno, convite/claim, Stage Router, estados de acesso, segurança | `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` |
| Login do painel (super admin / empresa / coach) + idiomas do painel | `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (§5) |

## Resumo (a porta de entrada em 3 linhas)

- Vídeo/intro (4 s, com timer de segurança) → **seleção de idioma** (PT-BR / EN-US / IT-IT; idioma é lei) → **login ou claim de convite**.
- O `presetName` do convite é só sugestão; a identidade da dupla `GUTO & [Nome]` só nasce no **Nome Soberano** (Parte 2). Convite nunca rouba identidade.
- **País ≠ idioma.** Acesso bloqueado → `/acesso-pausado?reason=` (`ACCESS_PAUSED` / `SUBSCRIPTION_EXPIRED` / `GUTO_DECEASED`).

> **Nota:** os anexos de engenharia que viviam aqui (tabela de chaves de `localStorage`, "arquivos-chave", "como rodar localmente") permanecem no **histórico do git** e podem ser migrados para `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` se desejado.
