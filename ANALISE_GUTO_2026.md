# Análise do Sistema de Evolução do GUTO — Maio 2026

## 1. Troca de Avatares (Vídeos por Estágio)

### Componente: `guto-official-avatar.tsx`
- Renderiza vídeos `.mp4` diferentes para cada **estágio de evolução** (`baby`, `teen`, `adult`, `master`, `legend`).
- Cada estágio tem **5 variações de emoção**: `default`, `alert`, `critical`, `reward`.
- A emoção é controlada por `vitalState` e pelo contexto do chat (última mensagem do GUTO).
- **Funciona corretamente** — o avatar troca de vídeo conforme `evolution` e `emotion`.

### Onde o avatar aparece:
| Aba/Componente | Avatar Presente? | Estágio usado |
|---|---|---|
| **ChatTab** | ✅ Sim | `evolution` prop |
| **PathTab** | ✅ Sim | `currentEvolution` prop |
| **EvolutionsTab** | ✅ Sim | `currentEvolution` prop (mostra o estágio atual + cards de todos) |
| **ArenaTab** | ❌ Não (usa labels/cores) | Apenas texto |
| **EliteHudExperience** | ✅ Sim (dev tool) | Seletor manual |

**Conclusão:** O avatar troca corretamente em **todas as abas que o exibem**.

---

## 2. Mudança de Cores por Estágio

### O que muda:
- **ArenaTab**: usa `stageColors` (cyan → gold → purple → red → white) para labels visuais.
- **EvolutionsTab**: destaca o card ativo com `guto-deboss-deep`.
- **ChatTab / PathTab**: não há mudança de cor do tema baseada no estágio — o fundo, bordas e cores seguem o design system fixo (cyan/navy/glass).
- **Não há** um "tema de cor" que mude globalmente conforme a evolução. Apenas labels e badges mudam.

**Conclusão:** Cores mudam apenas em elementos específicos (ArenaTab), não no layout geral.

---

## 3. Sistema de XP e Evolução

### Frontend: `guto-evolution.ts`
```typescript
const EVOLUTION_XP_THRESHOLDS: Record<EvolutionStage, number> = {
  baby: 0,
  teen: 500,
  adult: 2000,
  master: 5000,
  legend: 10000,
}
```
- `getNextGutoEvolutionXp(currentXp)` retorna o próximo threshold.
- `getEvolutionStage(currentXp)` retorna o estágio baseado no XP total.

### Backend: `guto-backend/src/guto-evolution.ts`
- Mesma lógica de thresholds.
- Usado em `completeWorkout`, `acceptAdaptedMission`, `applyPendingMissPenalties`.

---

## 4. Regressão de Avatar ao Perder XP

### Pergunta: Se o usuário perde XP, o avatar regride?

**Resposta: NÃO.** O sistema **não permite regressão de estágio**.

### Evidências:

1. **`getEvolutionStage` no backend** (`guto-backend/src/guto-evolution.ts`):
   ```typescript
   export function getEvolutionStage(totalXp: number): EvolutionStage {
     if (totalXp >= EVOLUTION_XP_THRESHOLDS.legend) return "legend"
     if (totalXp >= EVOLUTION_XP_THRESHOLDS.master) return "master"
     if (totalXp >= EVOLUTION_XP_THRESHOLDS.adult) return "adult"
     if (totalXp >= EVOLUTION_XP_THRESHOLDS.teen) return "teen"
     return "baby"
   }
   ```
   - Lógica puramente baseada em `>=` (maior ou igual). Se o XP cai, o estágio **pode** regredir tecnicamente.

2. **`applyPendingMissPenalties` no backend** (`server.ts`):
   ```typescript
   const penalty = Math.round(baseXp * 0.15) // 15% do XP base
   memory.totalXp = Math.max(0, (memory.totalXp || 0) - penalty)
   ```
   - **Subtrai XP diretamente** de `totalXp`.
   - Se o XP cair abaixo do threshold do estágio atual, `getEvolutionStage` retornará um estágio inferior.

3. **`completeWorkout`**:
   ```typescript
   memory.totalXp = (memory.totalXp || 0) + xpGain
   ```
   - Só adiciona XP, nunca remove.

### Cenários de perda de XP:
| Ação | Perde XP? | Pode regredir? |
|---|---|---|
| Faltar treino (miss penalty) | ✅ Sim (-15%) | ✅ Sim, tecnicamente |
| Adaptar missão | ❌ Não (ganha 50% do XP) | ❌ Não |
| Completar treino | ❌ Não (ganha XP) | ❌ Não |

**Conclusão:** O backend **permite** regressão via `applyPendingMissPenalties`, mas o frontend **nunca atualiza** o `evolution` prop após perda de XP — ele só atualiza via `memoryPatch` do backend. Se o backend enviar um `memoryPatch` com `totalXp` reduzido, o frontend recalcula o estágio e **pode regredir o avatar**.

---

## 5. Fluxo de Atualização do Estágio

### Caminho crítico: `handleMissionComplete` → backend → `memoryPatch` → frontend

1. Usuário completa treino → `handleMissionComplete` no `guto-app.tsx`
2. Chama `POST /guto/memory` com `{ action: "completeWorkout", ... }`
3. Backend processa em `server.ts`:
   - `completeWorkout()`: adiciona XP, atualiza `totalXp`
   - Retorna `memoryPatch` com `totalXp` atualizado
4. Frontend recebe `memoryPatch` → `setMemory(prev => ({...prev, ...memoryPatch}))`
5. `getEvolutionStage(memory.totalXp)` recalcula o estágio
6. Avatar troca de vídeo automaticamente

### Caminho crítico: penalidade por falta
1. Backend roda `applyPendingMissPenalties()` (agendado ou em próxima requisição)
2. Subtrai 15% do `totalXp`
3. Salva no banco
4. Na próxima requisição do frontend, o `memoryPatch` reflete o novo `totalXp`
5. Se caiu de estágio, o avatar **regride**

---

## 6. Processamento de `xpEvent`

### Rota `POST /guto/memory` (server.ts)
- **ANTES da correção:** `xpEvent` era recebido mas **não processado** — o backend ignorava eventos de XP do frontend.
- **DEPOIS da correção:** Agora processa `xpEvent`:
  ```typescript
  if (body.xpEvent) {
    const { amount, reason } = body.xpEvent
    memory.totalXp = (memory.totalXp || 0) + amount
    // ... log do evento
  }
  ```

### Rotas que processam XP:
| Rota | Processa XP? | Como? |
|---|---|---|
| `POST /guto/memory` (completeWorkout) | ✅ Sim | Adiciona XP do treino |
| `POST /guto/memory` (acceptAdaptedMission) | ✅ Sim | Adiciona 50% do XP |
| `POST /guto/memory` (xpEvent) | ✅ Sim (corrigido) | Adiciona/remove conforme `amount` |
| `POST /validate-workout` | ✅ Sim | Adiciona XP + bônus de streak |
| `applyPendingMissPenalties` | ✅ Sim | Remove 15% do XP base |

---

## 7. Resumo Final

| Aspecto | Status |
|---|---|
| Troca de avatar por estágio | ✅ Funciona em todas as abas |
| Variação de emoção (alert/critical/reward) | ✅ Funciona |
| Mudança de cores por estágio | ⚠️ Parcial (só ArenaTab) |
| Progressão de estágio ao ganhar XP | ✅ Funciona |
| Regressão de estágio ao perder XP | ⚠️ Possível tecnicamente, mas raro |
| Penalidade por falta (miss) | ✅ Implementada (-15% XP) |
| `xpEvent` processado no backend | ✅ Corrigido |
| Avatar reflete estágio atual | ✅ Sim |

### Riscos identificados:
1. **Regressão de avatar**: Se o usuário acumular muitas faltas seguidas, o XP pode cair o suficiente para regredir o estágio. Isso é consistente com a lógica atual, mas pode ser indesejado do ponto de vista de UX.
2. **Penalidade de 15%**: Pode ser agressiva para usuários que faltam poucos treinos.
3. **Sem trava de estágio mínimo**: Não há um "piso" que impeça o avatar de regredir abaixo do estágio atual.
