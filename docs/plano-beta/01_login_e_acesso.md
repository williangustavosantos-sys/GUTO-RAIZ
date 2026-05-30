# 01 — Login, Acesso e Convite

> Spec: `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` · Código: `guto-backend/src/auth-router.ts`, `auth-middleware.ts`, `user-access-store.ts`; `guto-app-v0/app/login`, `app/convite/[token]`, `components/guto/guto-app.tsx` (Stage Router)
>
> **Veredito: 🟢 sólido.** É a parte mais madura. Lacunas são pontuais (recuperação de senha, code de morte) e um ponto de atenção operacional (grant de acesso).

---

## O que a spec manda
Login resolve 4 coisas em ordem: identidade (bcrypt+JWT) → acesso válido (billing/vínculo) → memória correta → **Stage Router** (consent → naming → calibração → pacto → sistema). 4 portas: convite, conta manual, retorno, reativação. Nome do convite (`presetName`) é só sugestão; identidade oficial nasce no `naming`. Erro genérico ("e-mail ou senha inválidos"). Idioma herdado do `localStorage`. Aluno nunca entra no painel.

## O que existe no código
- `auth-router.ts`: login bcrypt + JWT; claim de convite `/auth/invite/:token/claim`.
- `auth-middleware.ts`: `parseAuth`, `requireActiveUser`, `resolveBlockedAccessCode` → `ACCESS_PAUSED` / `SUBSCRIPTION_EXPIRED`.
- `user-access-store.ts`: `requireActiveUserAccess`, `getEffectiveUserAccess`; bypass dev (`GUTO_ALLOW_DEV_ACCESS`).
- Frontend: Stage Router `resolveAuthenticatedStage` em `guto-app.tsx`; `/acesso-pausado` trata os 3 motivos (paused/expired/dead).

## ✅ O que está certo
- bcrypt + JWT; ID extraído do token (anti-spoofing) — alinhado à spec §8.
- Stage Router completo (máquina de estados de onboarding).
- Nome soberano não sobrescrito pelo convite.
- Separação de papéis (aluno ≠ painel); cliente força `/coach` se role ≠ student.
- Erro neutro de credenciais; guards P0 de prod no `config.ts` (JWT forte, sem dev-access em prod).

## ❌ O que está errado / quebra
- **L-A (atenção operacional) — usuário sem grant de acesso = `ACCESS_PAUSED` na cara.** Verifiquei ao vivo: um `userId` novo, com JWT válido, recebe **403 `ACCESS_PAUSED`** em todas as rotas até ter registro de acesso ativo (`requireActiveUserAccess` retorna null). O fluxo de convite/claim **precisa** chamar `upsertUserAccess` para `active`/`invited`. Se algum caminho de entrada (ex.: cadastro direto) **não** conceder acesso, o usuário entra e trava na hora. → **validar o claim de ponta a ponta em conta nova.**
- **L-5 (spec) — backend não emite `GUTO_DECEASED`.** Só `ACCESS_PAUSED`/`SUBSCRIPTION_EXPIRED`. Frontend já trata os 3, mas a morte nunca chega (depende de [08](08_validacao_xp_evolucao_morte.md)).
- **L-6 (spec) — recuperação de senha não existe.** UI é honesta (orienta procurar coach), mas é fricção real para beta com usuários que esquecem a senha.

## ➕ O que falta adicionar
- Endpoint real de recuperação de senha (ou um caminho admin de reset claro) antes de abrir beta amplo.
- Emissão de `GUTO_DECEASED` (quando a morte do GUTO existir).

## 🛠 Plano de ação
1. **(P0 operacional) Testar o claim de convite em conta nova** até o app abrir no stage `system` sem 403. Confirmar que `upsertUserAccess` roda no claim e na reativação.
2. **(P1) Recuperação de senha**: implementar endpoint + e-mail real, OU manter o caminho honesto e documentar o processo de reset via admin para o beta.
3. **(P2) `GUTO_DECEASED`**: adicionar o code quando a morte existir ([08](08_validacao_xp_evolucao_morte.md), L-5).

## Como verificar
Criar convite no painel → abrir `/convite/[token]` → criar senha → confirir que autologa e cai no onboarding correto; depois logout/login e confirmar Stage Router. Testar conta pausada → `/acesso-pausado?reason=paused`.
