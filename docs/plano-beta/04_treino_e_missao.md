# 04 — Treino e Missão (treino do dia)

> **Documento histórico. Não usar como fonte operacional atual sem comparar com o código em main.**

> Spec: `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` · Código: `guto-backend/src/workout-curator.ts`, `workout-level.ts`, `workout-progression.ts`, `workout-catalog-validation.ts`, `exercise-catalog.ts`; `guto-app-v0/components/guto/tabs/mission-tab.tsx`
>
> **Veredito: 🟠 a engenharia do treino é madura, mas a geração é frágil sob carga e está bloqueada upstream pelo chat e pela calibragem.**

---

## O que a spec manda
Treino do dia nasce do **backend** (ou do plano travado pelo coach), nunca inventado pelo front. Respeita calibragem, objetivo, local, nível, histórico, dor/limitação, feedback. Usa **catálogo oficial com vídeo local validado** (catálogo ≤15s / custom ≤30s); exercício sem vídeo não entra. Vira `lastWorkoutPlan`. Botão "?" leva contexto do exercício ao chat; troca confirmada persiste em `lastWorkoutPlan`; com `lockedByCoach`, vira pendência para o coach. Proibido: geração cega (sem local/limitação), exercício fantasma, sobrescrever plano travado.

## O que existe no código
- `workout-curator.ts` (gera via modelo) com **fallback para template** quando falha.
- `workout-level.ts` / `workout-progression.ts`: volume por nível, progressão (bug joelho/salto já corrigido via `avoidIfTags`).
- `workout-catalog-validation.ts` + 89 mp4 reais (27 testes).
- Swap por chat + lock/unlock no `admin-router`.

## ✅ O que está certo
- **T-1..T-5, T-7 ✅** (por teste): plano vem do backend; gate de vídeo; respeito a dor/nível/local/objetivo; coach lock não sobrescrito; botão "?" com contexto.
- Catálogo fechado com vídeo obrigatório — sólido.

## ❌ O que está errado / quebra
- **TR-1 (P1) — ✅ RESOLVIDO 02/06 (retry/backoff).** Antes o curador caía direto no template em 429/timeout (`curator succeeded: 6` vs `failed: 8` na rajada do `release:gate`). **Fix:** `curateWorkout` agora tenta de novo com **backoff exponencial + jitter** (default 3 tentativas — `GUTO_CURATOR_MAX_ATTEMPTS`/`GUTO_CURATOR_BACKOFF_MS`), distinguindo transiente (429/5xx/timeout/JSON estocástico → repete) de fatal (400/401/403 → não repete); tentativas e fallback ficam logados. Resta **medir a taxa real de fallback em produção** com a telemetria.
- **TR-2 (P0, upstream) — treino inalcançável pelo chat.** "qual é o treino de hoje?" → "distração" ([03 B-1](03_chat_e_cerebro.md)). O usuário não consegue nem perguntar do treino.
- **TR-3 (P0, upstream) — não gera para usuário saudável.** Sem lesão, a calibragem não trava e nenhum plano é montado ([02 CM-1](02_calibragem_e_memoria.md)).
- **T-6 (spec) — fila de pendência de swap para o coach não confirmada.** Swap por chat persiste, mas a pendência visível ao coach (quando `lockedByCoach`) não está confirmada.

## ➕ O que falta adicionar
- Retry/backoff + limite de concorrência no curador (ou aceitar template como caminho normal e garantir qualidade do template).
- Fila/painel de pendência de swap para o coach (T-6).
- Telemetria: taxa real de fallback do curador por sessão.

## 🛠 Plano de ação
1. **(depende de [03]/[02])** Destravar chat e calibragem — sem isso o treino não chega ao usuário.
2. **(P1) Estabilizar o curador**: medir taxa de fallback em ritmo de 1 usuário; adicionar retry/backoff e concorrência limitada; definir contrato de qualidade mínima do template (já que é o caminho de fallback).
3. **(P1) Pendência de swap (T-6)**: expor no painel a fila de troca pedida em plano travado.
4. **(verificação)** Gerar treino para 3 perfis (gym/home/park × níveis) e conferir vídeo válido em 100% dos exercícios e respeito à limitação.

## Como verificar
Conta calibrada → abrir Missão → confirmar plano com exercícios do catálogo (vídeo local) coerentes com nível/local/objetivo; pedir troca pelo "?" e confirmar persistência em `lastWorkoutPlan`. Medir quantas gerações caem em template em 10 tentativas.
