# 02 — Calibragem e Memória Operacional

> Spec: `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` · Código: `guto-app-v0/components/guto/screens/calibration-screen.tsx`, `guto-backend/server.ts` (memória/gate), `guto-backend/src/memory-store.ts`, `dirty-data-resolver.ts`
>
> **Veredito: 🟢 coleta madura; o furo CM-1 (usuário saudável) foi fechado no front e verificado ao vivo (2026-05-30).**

---

## O que a spec manda
Calibragem é a **fonte única de verdade**; treino/dieta/chat/online/painel **consomem**, não recalculam. Coleta: idade, sexo biológico (binário obrigatório), nível, objetivo, local, dor/limitação (texto semântico), altura, peso, país, cidade, campo único **NÃO COMO**. Idioma e nome ficam **fora** da tela de calibragem. Telefone **nunca** entra na `GutoMemory`. Toda mutação registra `source` + auditoria before/after. Mudança sensível **invalida** treino/dieta (recalcular/revisar), salvo `lockedByCoach`. Proibido: repergunta de dado já salvo; "anotado" sem gravar; memórias paralelas.

## O que existe no código
- `calibration-screen.tsx` (818 linhas): coleta todos os campos; botão libera só com obrigatórios.
- Backend persiste em `GutoMemory` (Redis/Upstash com fallback arquivo); `resolvedFields` classifica país/patologia/restrição semanticamente (`dirty-data-resolver.ts`).
- `hasCalibrationProfileLocked` (`server.ts:1263-1278`) decide se a calibragem é "soberana" (bypassa intake).

## ✅ O que está certo
- **C-1..C-4 ✅** (confirmado por testes): todos os campos presentes; telefone removido da memória (`guto-memory-phone`); sexo binário (`guto-biological-sex`); campo único NÃO COMO.
- Interpretação semântica de restrição vs queixa física ("nessun dolore" ≠ restrição) — `resolvedFields`.
- Memória como fonte única; treino/dieta consomem.

## ✅ CM-1 RESOLVIDO (verificado ao vivo 2026-05-30)
- **CM-1 (era P0) — "sem lesão" = calibragem incompleta — FECHADO.** A causa era a tela aceitar patologia vazia. O front foi corrigido (já no `origin/main`): `calibration-screen.tsx` agora **força** resposta de dor/limitação (`hasPathologyAnswer >= 2 chars` no `isComplete`) + atalho "Sem dor"; `guto-app.tsx` (`handleCalibrationComplete`) grava o valor em **trainingPathology E trainingLimitations**. `isOperationalNoise("sem dor")` = false → o backend **preserva** o sentinel → `hasBodyContext=true` → calibragem trava. Verificado ao vivo (Gemini real): usuário saudável (com "Sem dor") → `acao=updateWorkout`, treino com 6 exercícios, **sem reabrir intake**. Conta sem body context (coach/legado) pergunta dor/limitação **1x** e então gera — comportamento correto (Regra 1: não chuta sobre o corpo). Travado por `tests/guto-calibration-lock.test.ts`.

## ❌ O que está errado / quebra
- **C-5 (spec) — sem endpoint validado de calibragem por campo.** Hoje vai via `PATCH /admin/students/:id` com objeto `calibration` (sem rota tipada dedicada com ranges/`source`/snapshot). Funciona, mas é o "patch genérico" que a spec chama de transitório.
- **C-6 (spec) — `source` parcial.** Auditoria existe, mas não confirmado que os 5 valores (`onboarding/app_settings/chat/coach_panel/admin_panel`) são gravados em **todos** os caminhos.

## ➕ O que falta adicionar
- Marcador explícito de "nenhuma limitação" no onboarding (para distinguir "saudável" de "não respondido") **ou** ajustar o gate para não exigir lesão.
- Endpoint validado de calibragem (C-5) com auditoria before/after completa.

## 🛠 Plano de ação
1. ~~**(P0) Resolver o lock do usuário saudável.**~~ **FEITO** via Opção A (a tela grava "Sem dor" como marcador e o backend o preserva como `hasBodyContext`) — verificado ao vivo + teste de regressão. Respeita a Regra 1 (distingue "saudável" de "não perguntado").
2. **(P1) Endpoint validado de calibragem (C-5)** com ranges oficiais + `source` + before/after.
3. **(P1) Garantir `source` nos 5 caminhos (C-6).**
4. **(verificação) Invalidação de plano**: alterar peso/objetivo/local/NÃO COMO e confirmar que treino/dieta recalculam ou marcam revisão (exceto `lockedByCoach`).

## Como verificar
Calibrar uma conta nova **sem nenhuma lesão** e confirmar que: (a) o app gera treino no primeiro turno; (b) o GUTO não repergunta local/idade/ritmo. **Passa** (verificado ao vivo 2026-05-30 + `tests/guto-calibration-lock.test.ts`).
