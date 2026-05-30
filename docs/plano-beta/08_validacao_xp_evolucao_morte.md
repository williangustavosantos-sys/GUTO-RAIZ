# 08 — Validação, XP, Evolução e Morte do GUTO

> Spec: `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` · Código: `guto-backend/server.ts` (rota de validação, uploads), `src/guto-evolution.ts`, `arena-store.ts`, `user-access-store.ts`, `auth-middleware.ts`; `guto-app-v0/components/guto/validation/workout-validation-flow.tsx`
>
> **Veredito: 🟠 XP/evolução sólidos; mas há um P0 de segurança (selfies públicas) e a Morte do GUTO não existe.**

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
- **VX-1 (P0 SEGURANÇA, novo — não na spec) — selfies servidas publicamente.** `server.ts:569-571`: `app.use("/uploads/validation-images", express.static(...))` em `tmp/validation-images`, **sem autenticação**. Qualquer um com a URL acessa a foto de qualquer usuário (privacidade/GDPR). E `tmp/` é **efêmero no Render** → as selfies **somem no redeploy**, quebrando o Percurso e a regra "só marca o dia depois da selfie real".
- **X-7 (spec) — selfie obrigatória: verificar.** O doc diz "backend aceita sem foto [implementar]". A memória de 2026-05-29 diz que `SELFIE_REQUIRED` (XP=0 sem foto) **foi** adicionada. **Divergência doc×memória → confirmar no código atual** qual vale.
- **X-8/X-9/X-10 (P2 produto) — Morte do GUTO não existe.** Sem `gutoLifeStatus`/`accessLocked`/`deadAt`/`deathReason`; **nenhum guard 403 `GUTO_DECEASED`**; blackout é só opacidade cosmética. É a **maior divergência doc×código** do projeto (Parte 2).

## ➕ O que falta adicionar
- Auth + ownership no serving das selfies; storage persistente (S3/Cloudinary/disco persistente) fora do `tmp/`.
- (Parte 2) Campos de morte + guard 403 + tela de blackout real + Percurso read-only.

## 🛠 Plano de ação
1. **(P0) Proteger as selfies.** Servir `/uploads/validation-images` atrás de `requireActiveUser` + checagem de dono; migrar storage para persistente. **Sem isto não pode haver usuário real** (é dado sensível de menores potencialmente).
2. **(P0 verificar) Confirmar `SELFIE_REQUIRED`** no código atual (memória diz feito; doc diz pendente). Se não estiver, implementar (XP=0 sem foto).
3. **(P2) Morte do GUTO** (X-8/X-9/X-10): adicionar campos + guard 403 `GUTO_DECEASED` + blackout + Percurso read-only. Coordenar com [01 L-5](01_login_e_acesso.md).
4. **(verificação)** Validar treino com selfie → conferir +100 XP, avatar evoluindo, Arena/Percurso refletindo o mesmo número.

## Como verificar
Validar um treino com foto e sem foto: confirmar credita só com foto. Tentar abrir a URL de uma selfie sem token: **hoje abre** (deveria negar). Conferir XP igual em Arena, Evoluir, Percurso e memória.
