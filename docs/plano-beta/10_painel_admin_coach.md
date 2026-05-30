# 10 — Painel Admin / Empresa / Coach

> Spec: `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (canônico único) · Código: `guto-backend/src/admin-router.ts`, `auth-router.ts`, `team-store.ts`, `team-plans.ts`, `invite-store.ts`, `log-store.ts`; `guto-app-v0/app/coach/*`, `app/admin/*`, `app/empresa/*`, `lib/panel-rules.ts`, `lib/api/admin.ts`
>
> **Veredito: 🟠 funcional e com backend real (cria empresa/coach/aluno/convite), isolamento de time testado; falta tirar o mock e fechar uma lista de gaps conhecida (G-01..G-13).**

---

## O que a spec manda
Painel **único** = `/coach` (cockpit role-aware); `/admin` e `/empresa` redirecionam; `/admin/login` é a porta. Hierarquia estrita: Super Admin → Empresa → Coach → Aluno → Dados. Todo aluno tem `teamId` + `coachId` (sem aluno solto). **Isolamento forte**: coach não vê aluno de outro time; admin vê seu escopo; super vê tudo. Coach vê calibragem, edita treino, monta dieta, gera convite, vê histórico/risco/ranking. **XP/streak/Nome Soberano imutáveis pelo painel**; calibragem só por campos validados (nunca JSON cru). 3 idiomas oficiais. Mudança do coach chega ao app na próxima sincronização.

## O que existe no código
- `admin-router.ts`: CRUD de aluno/coach/empresa, convites, lock/unlock de treino/dieta, aprovações.
- `auth-middleware`: roles (super_admin/admin/coach/student) + escopo por `teamId`.
- Frontend `/coach` cockpit role-aware; `/admin` e `/empresa` redirecionam.

## ✅ O que está certo
- Backend **cria de verdade** empresa/coach/aluno/convite (corrige o mito "não cria empresa real").
- **Isolamento de time testado** (`guto-team-isolation`, `guto-panel-student-create`, `guto-panel-empresa-ops`, `guto-team-limits`, `guto-team-plans`).
- XP/streak/Nome não editáveis pelo painel; e-mail duplicado já retorna `409 GUTO_EMAIL_DUPLICATE`.
- Roteamento real: 3 papéis vão para `/coach`.

## ❌ O que está errado / quebra (gaps canônicos §15/§17 do doc)
- **G-P1 (P1) — painel em mock por padrão.** `/admin`/`/empresa` (e dados) usam mock até `NEXT_PUBLIC_USE_MOCKS=false`. Para testar o painel real, desligar o mock no Vercel.
- **G-06 (P1) — threshold de risco errado.** Código usa **≥7 dias**; decisão canônica é **Verde ≤48h / Atenção 3–5d / Crítico ≥6d**. Corrigir em `app/coach/_components/utils.ts` (1 linha, só display).
- **G-08 — i18n do cockpit.** `/coach` é **PT-first hardcoded** (só o login é i18n). Doc exige 3 idiomas. Garantir que **nenhum texto novo entre hardcoded** e migrar para chaves.
- **G-09 — abas do aluno: 6 vs 9.** Hoje Resumo/Calibragem/Treino/Dieta/Histórico/Acesso; alvo são 9.
- **G-02 — recuperação de senha** (compartilhado com [01 L-6](01_login_e_acesso.md)).
- **G-05 — calibragem validada por endpoint** (compartilhado com [02 C-5](02_calibragem_e_memoria.md)).
- **G-07 — morte/lockdown** no backend (compartilhado com [08](08_validacao_xp_evolucao_morte.md)).
- **G-01 (role de empresa `company_admin`), G-04 (`onboardingStage`), G-11 (telas órfãs), G-13 (foto de validação obrigatória)** — itens menores/decisão.

## ➕ O que falta adicionar
- Variável `NEXT_PUBLIC_USE_MOCKS=false` no ambiente para o painel operar com dados reais.
- Migração i18n do cockpit; abas 6→9; endpoint de calibragem validada; demais gaps por prioridade.

## 🛠 Plano de ação
1. **(P1) Tirar o mock** (`NEXT_PUBLIC_USE_MOCKS=false`) e validar o painel real: criar empresa → coach → aluno → convite → o app do aluno recebe.
2. **(P1) G-06 threshold de risco** (≥7 → ≥6) — correção de 1 linha.
3. **(P1) Fechar fluxo coach→aluno**: coach edita treino/dieta (lock) → app do aluno reflete na próxima leitura.
4. **(P2) i18n cockpit (G-08), abas 6→9 (G-09), calibragem validada (G-05), morte (G-07).**

## Como verificar
Login `/admin/login` com cada papel → confirmar que os 3 caem em `/coach` com escopo correto; criar aluno e confirir isolamento (coach B não vê aluno do coach A); editar treino travado e confirmar que o app do aluno mostra o novo plano.
