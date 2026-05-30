# 08 — Validação, XP, Evolução e Morte do GUTO

> Spec: `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` · Código: `guto-backend/server.ts` (rota de validação, uploads), `src/guto-evolution.ts`, `arena-store.ts`, `user-access-store.ts`, `auth-middleware.ts`; `guto-app-v0/components/guto/validation/workout-validation-flow.tsx`
>
> **Veredito: 🟢 XP/evolução sólidos; o P0 de segurança (selfies públicas) foi FECHADO — PR #46, verificado — e a selfie obrigatória (X-7) está implementada. Resta (P2 produto) a Morte do GUTO e o storage persistente das selfies.**

---

## O que a spec manda
GUTO mede **presença validada**: pós-treino → câmera + contagem + frase + envio. Aceito → registra, XP, alimenta Arena/Percurso/avatar. XP = consistência (+100 treino, +50 missão adaptada), nunca negativo, clamp a 0; XP do pacto é buffer (não vira streak). Estágios Baby/Teen/Adult/Elite. **Selfie obrigatória** para creditar XP. **Morte**: XP→0 → `gutoLifeStatus:"dead"`, `accessLocked`, guard 403 `GUTO_DECEASED` em todas as rotas, blackout no app, Percurso read-only, sem auto-revive (só liberação comercial).

## O que existe no código
- Rota de validação + `express.static` para servir as imagens.
- `guto-evolution.ts`: thresholds (baby 0 / teen 1500 / adult 5000 / elite 12000); `clampXp`; `applyDailyMissPenalty`.
- `user-access-store`/`auth-middleware`: `ACCESS_PAUSED`/`SUBSCRIPTION_EXPIRED` (sem morte).

## ✅ O que está certo
- **X-1..X-6 ✅**: XP total/semanal/mensal, +100/+50, clamp ≥0, pacto não vira streak, estágios por XP, painel não edita XP à mão.
- Avatar evolui por XP real.

## ❌ O que está errado / quebra
- **VX-1 — ✅ RESOLVIDO (PR #46, P0 segurança).** Selfies não são mais públicas: a rota `GET /uploads/validation-images/:filename` agora exige **URL assinada (HMAC)** — funciona com `<img src>` (token na query, sem header Authorization) e mata o acesso público/enumerável. Nua/adulterada/expirada → 403; inexistente → 404. Coach segue vendo a do aluno (assinatura viewer-agnóstica). Travado por `tests/guto-selfie-access.test.ts`. **Follow-up (escolha do fundador):** storage persistente (S3/Cloudinary) fora do `tmp/` efêmero — hoje as selfies ainda somem no redeploy do Render.
- **X-7 — ✅ confirmado implementado.** XP só é creditado com selfie: `if (hasSelfieEvidence) completeWorkout(memory)` (`server.ts:8484`) e Arena XP idem (`8502`); sem foto → record `pending`, sem XP pleno. A memória estava certa, o doc estava desatualizado.
- **X-8/X-9/X-10 (P2 produto) — Morte do GUTO não existe.** Sem `gutoLifeStatus`/`accessLocked`/`deadAt`/`deathReason`; **nenhum guard 403 `GUTO_DECEASED`**; blackout é só opacidade cosmética. É a **maior divergência doc×código** do projeto (Parte 2).

## ➕ O que falta adicionar
- Auth + ownership no serving das selfies; storage persistente (S3/Cloudinary/disco persistente) fora do `tmp/`.
- (Parte 2) Campos de morte + guard 403 + tela de blackout real + Percurso read-only.

## 🛠 Plano de ação
1. ~~**(P0) Proteger as selfies.**~~ **FEITO** (PR #46) — URL assinada (HMAC) na rota de serving; acesso público morto. **Follow-up:** storage persistente (S3/Cloudinary) fora do `tmp/` efêmero — precisa da escolha de infra do fundador.
2. ~~**(P0 verificar) Confirmar `SELFIE_REQUIRED`.**~~ **CONFIRMADO** implementado (XP=0 sem foto).
3. **(P2) Morte do GUTO** (X-8/X-9/X-10): adicionar campos + guard 403 `GUTO_DECEASED` + blackout + Percurso read-only. Coordenar com [01 L-5](01_login_e_acesso.md).
4. **(verificação)** Validar treino com selfie → conferir +100 XP, avatar evoluindo, Arena/Percurso refletindo o mesmo número.

## Como verificar
Validar um treino com foto e sem foto: confirmar credita só com foto (X-7 ✅). Tentar abrir a URL de uma selfie **sem a assinatura** → **403** (corrigido, PR #46 + teste). Conferir XP igual em Arena, Evoluir, Percurso e memória.
