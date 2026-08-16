# 09 — Arena e Gamificação

> **Documento histórico. Não usar como fonte operacional atual sem comparar com o código em main.**

> Spec: `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md` · Código: `guto-backend/src/arena.ts`, `arena-store.ts`; `guto-app-v0/components/guto/tabs/arena-tab.tsx`
>
> **Veredito: 🟢 a Arena está bem alinhada e testada. O risco é consistência de XP entre telas em uso real.**

---

## O que a spec manda
Arena Semanal/Mensal por empresa (`teamId`); Arena Geral global, mostrando `teamName` ao lado da dupla. Ranking calculado no **backend**, paginado. XP/streak/avatar **iguais** em Arena, Percurso e Evoluir (divergência = bug crítico). XP do Pacto **não** conta como treino. `visibleInArena=false` remove do público. Dados sensíveis (peso, idade, patologia, foto, telefone, e-mail) **nunca** no ranking. Isolamento por time forte.

## O que existe no código
- `getUserArenaGroup` deriva do `teamId`; rankings weekly/monthly/individual; `getGlobalIndividualRanking`.
- `isVisibleInRanking` filtra ocultos; cálculo no backend.

## ✅ O que está certo
- **AR-1..AR-8 ✅** (testes `guto-arena-global-ranking`, `guto-team-isolation`): escopo por papel, geral com `teamName`, coach vê arena da **empresa**, XP não diverge, pacto não infla, oculto some, ranking no backend, sem dado sensível.
- Desync dos 100 XP iniciais já corrigido.

## ❌ O que está errado / quebra
- **AR-V (verificação) — consistência de XP em uso real.** Os testes cobrem a lógica, mas a regra de ouro ("XP igual em Arena/Percurso/Evoluir/memória") só se prova **rodando** após uma validação real de treino. Como o fluxo treino→validação→XP depende de partes quebradas upstream ([02]/[03]/[08]), a Arena ainda não foi exercida ponta a ponta com dado real.
- Nenhum gap estrutural próprio da Arena identificado.

## ➕ O que falta adicionar
- Nada estrutural. Só **prova de ponta a ponta** depois que treino+validação funcionarem.

## 🛠 Plano de ação
1. **(depende de [08])** Após uma validação real creditar +100 XP, conferir o **mesmo número** em Arena (semanal/geral), Evoluir e Percurso.
2. **(verificação) Isolamento**: confirmar que um coach não vê aluno de outro `teamId` na Arena (já testado; revalidar no painel real sem mock).

## Como verificar
Dois alunos em times diferentes; validar treino de um; conferir: aparece na Geral com `teamName`, aparece na Semanal só do próprio time, XP idêntico em todas as telas, e nenhum dado sensível exposto.

## ❗ Correção 2026-05-30 (PR #50, verificado no app real)
**Achado rodando o app:** AR-4 (XP igual entre telas) **não valia** — Arena (SEMANA) e **painel admin** mostravam **100 XP semanal** num usuário com 0 treinos validados, enquanto Evoluir/Percurso mostravam 0. **Causa:** `awardArenaXp` (`src/arena.ts`) somava o XP em `weeklyXp`/`monthlyXp` e setava streak/lastValidated para **todo tipo, inclusive `bonus`** (o buffer do pacto) → violava AR-5 ("buffer não infla Semanal/Mensal") e X-4 ("pacto não vira streak"). **Fix:** `bonus` agora credita **só `totalXp`**. **Verificado:** recém-onboardado → `memory.totalXp=100` (Evoluir), arena `total=100 weekly=0 monthly=0` (Arena/admin). O **painel admin lê o mesmo `getArenaProfile`** (admin-router.ts:333) que a aba Arena → batem. Teste `tests/guto-arena-bonus.test.ts`.
