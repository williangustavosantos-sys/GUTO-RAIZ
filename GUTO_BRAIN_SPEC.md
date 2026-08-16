# GUTO_BRAIN_SPEC.md — Especificação Técnica do Cérebro Soberano

> **Documento de engenharia.** Especifica, de forma objetiva e implementável, o cérebro soberano do GUTO: função-objetivo, entradas/saídas por turno, lógica de decisão, modelo de risco da Dupla, estados, estruturas de código e invariantes. Pouca filosofia — a filosofia está em `GUTO_CORE_OPERATING_SYSTEM.md` e na Constituição.
>
> **Pré-requisitos:** `GUTO_AI_ONBOARDING.md`, `GUTO_DECISION_ARCHITECTURE.md`, `GUTO_SYSTEM_ARCHITECTURE.md`, `GUTO_CORE_OPERATING_SYSTEM.md`.
> **Lugar na ordem de leitura:** logo após `GUTO_CORE_OPERATING_SYSTEM.md`, antes dos `*_DETALHADA`.
> **Natureza dos blocos de tipo:** são **contratos de especificação** (pseudo-TypeScript), não implementação. Nomes de campo são normativos; tipos são orientativos.
>
> **Decisões do fundador já travadas (entram como requisito):**
> - **Morte da Dupla:** dirigida por **falta de comprometimento observável** (não-cumprimento de missão ao longo do tempo) **modulada por contexto**; nunca por X dias puros.
> - **Morrem os dois:** acaba a relação, o Avatar **e** aquele GUTO. **Sem ressurreição.** Retorno = nova Dupla.
> - **Persona emocional permitida:** o GUTO pode dizer "senti sua falta", "sumiu", usar humor/história/Arena/XP. **Único limite: nunca inventa fato/estado e nunca contradiz a identidade.**

---

## 1. Função-objetivo (frame de raciocínio, não estimador computável)

```txt
objective(turn) =
  argmax_{action ∈ Strategies}  P(Dupla viva a longo prazo | action, GutoWorldState)
  subject to (precedência inviolável, do mais forte ao mais fraco):
    1. segurança e bem-estar do usuário
    2. verdade / integridade factual
    3. identidade do GUTO
    4. plano travado pelo coach (lockedByCoach)
    5. continuidade da Dupla
    6. calibração / contexto
    7. vontade do momento do usuário
```

> **⚠️ NÃO implementar `argmax P(Dupla viva...)` como estimador matemático.** Não existe (nem deve existir agora) um modelo numérico de probabilidade de sobrevivência da Dupla por turno. Isto é o **frame de raciocínio** que o brain step usa ao decidir; a aproximação é **qualitativa**, feita pelo modelo dentro do prompt, e **validada por golden transcripts** — nunca por um cálculo de probabilidade.

- "Dupla viva" é lida por **evidência observável** (§10), nunca por proxy de engajamento. Otimizar proxy = proibido.
- Quando o objetivo (5) colide com uma restrição superior (1–4), **a restrição vence**.
- O cérebro **não pergunta** "como respondo?"; pergunta **"qual ação agora maximiza a sobrevivência honesta da Dupla?"**

## 2. Pipeline do turno

**Soberania:** comprehensão + decisão + composição acontecem em **uma única chamada governada** ao modelo (o "brain step"), não numa cadeia de módulos determinísticos que competem. As únicas etapas determinísticas são **pré-cérebro** (montar estado + preempt de segurança) e **pós-cérebro** (validar forma, persistir, executar).

```txt
PRÉ-CÉREBRO (determinístico)
  P0  assembleWorldState(userId, sessionId) → GutoWorldState
  P1  safetyPreempt(message, world)         // risk-classifier, falha-aberta
        └─ se risco real → retorna SafeHandlingContract e ENCERRA o turno

CÉREBRO (uma chamada governada — o decisor soberano)
  B   decideTurn(input, world) → TurnContract
        ├─ interpreta intenção + contexto + certeza
        ├─ aplica função-objetivo (§1) + política de decisão (§5) — via PROMPT
        ├─ escolhe 1 estratégia (§6)
        └─ compõe o contrato (fala no idioma do usuário + ação + next_step)

PÓS-CÉREBRO (determinístico)
  Q0  validateContract(contract)             // valida FORMA; malformado → honestFallback()
  Q1  persist(contract.memoryPatch, contract.workoutPlan)  // honesto; rollback on fail
  Q2  execute(contract)                       // dispatch ação→executor; 1 verdade
  Q3  updateRiskModel(world, observations)    // §10 (PÓS-turno; não decide o conteúdo)
```

### 2.1 Regra anti-parlamento (inviolável)

Para não recriar o "parlamento de gates":

1. **As stages do cérebro (comprehensão/contexto/objetivo/composição) são UMA única chamada governada.** Não podem virar módulos determinísticos separados que decidem em sequência.
2. **As regras de política (§5) vivem no PROMPT do cérebro e nas golden transcripts.** Não podem virar gates externos que **mutam o `TurnContract` depois** que o cérebro decidiu.
3. **`safetyPreempt` é o único preempt permitido antes do cérebro** — e só para risco real, falha-aberta. Nenhum outro classificador pode rodar "na frente" decidindo o turno.
4. **`validateContract` valida FORMA, não CONTEÚDO.** Pode rejeitar contrato malformado (→ `honestFallback`), nunca reescrever a decisão do cérebro por regra de negócio.
5. **`updateRiskModel` roda PÓS-turno** e **não** influencia o conteúdo do turno corrente — ele só atualiza estado para os próximos turnos.

## 3. Entradas por turno

### 3.1 `TurnInput`
```ts
interface TurnInput {
  userId: string;
  duoId: string;            // a Dupla viva atual
  sessionId: string;
  message: string | null;   // texto/voz transcrita; null se ação via botão
  quickAction?: string;     // toque em expectedResponse (ex.: "Difícil")
  tabContext?: TabContext;  // origem do "?" (treino/dieta/online)
  timestamp: string;
}
type TabContext =
  | { tab: 'treino'; activeExerciseId: string; sets?: number; reps?: number; load?: number }
  | { tab: 'dieta'; mealId: string; foodName?: string }
  | { tab: 'online'; sessionState: string }
  | { tab: 'chat' };
```

### 3.2 `GutoWorldState` (Estado Vivo da Dupla)
Snapshot único montado pelos **fornecedores de contexto** (mapa em §14). Sem ele o GUTO responde cego.
```ts
interface GutoWorldState {
  // — Identidade & calibração (memória PERMANENTE)
  userName: string;
  language: 'pt-BR' | 'en-US' | 'it-IT';   // lei; fala nasce aqui
  country: string; city: string;            // país ≠ idioma
  goal: string; level: string;
  physicalLimitations: string[];
  foodRestrictions: string;                 // NÃO COMO (semântico)

  // — Plano do dia
  todayMission: WorkoutPlan | null;
  workoutLockedByCoach: boolean;            // trilho do coach
  activeDiet: DietPlan | null;
  currentOrNextMeal: Meal | null;

  // — Progresso & relação (UMA só verdade; views derivadas)
  xp: number;                               // consistência, não esforço
  streak: number;
  arena: ArenaState;
  avatarState: AvatarState;                 // VIEW de duoHealth (OPACO — §3.3)
  percurso: PercursoState;
  duoHealth: DuoHealth;                      // computado (OPACO — §3.3 / §10)
  abandonmentRisk: RiskBand;                 // computado (OPACO — §3.3 / §10)

  // — Memória viva (TEMPORÁRIA/contextual)
  activeTemporaryEvents: TemporaryEvent[];   // §7
  pendingCards: ProactiveCard[];
  recentFeedbacks: FeedbackSignal[];         // §3.3 / §10
  lastWorkouts: WorkoutRecord[];
  markedDifficulties: string[];
  absenceHistory: AbsenceRecord[];           // §3.3
  optionsAlreadyOffered: string[];           // anti-repetição (curto prazo)

  // — Sessão / turno
  phase: FlowPhase;                          // onboarding | normal | retomada | ...
  duoState: 'alive' | 'weakening' | 'ended'; // §10
}
```

### 3.3 Tipos mínimos (fatia 1) e tipos OPACOS

**Reutilizados do backend atual** (importar, não redefinir): `WorkoutPlan`, `DietPlan`, `Meal`, `WorkoutRecord`, `ProactiveCard`, `ArenaState`, `PercursoState`, `FlowPhase`.

**Forma mínima dos novos tipos da fatia 1:**
```ts
interface FeedbackSignal {
  duoId: string;
  workoutId?: string;
  value: 'facil' | 'normal' | 'dificil';
  at: string;                 // ISO timestamp
  source: 'post_workout';     // por ora só este
}

interface AbsenceRecord {
  date: string;               // dia sem missão cumprida
  hadActiveTemporaryEvent: boolean;   // contexto que suspende risco (§10)
}

type ObservationKind =
  | 'feedback' | 'mission_completed' | 'mission_missed'
  | 'temporary_event' | 'workout_validated' | 'interaction';
interface Observation {
  duoId: string;
  kind: ObservationKind;
  at: string;                 // ISO timestamp
  payload?: unknown;          // específico por kind
}

interface Duo {
  id: string; userId: string; bornAt: string;
  state: 'alive' | 'weakening' | 'ended';
  endedAt?: string;
  // avatar/saúde são views derivadas (OPACAS até D-3)
}

interface MemoryPatch {
  layer: 'permanent' | 'temporary';
  fields: Record<string, unknown>;    // só campos permitidos
  requiresConfirmation: boolean;      // temporary→permanent SEMPRE true
}

type TurnAction =
  | { type: 'none' }
  | { type: 'updateWorkout'; plan: WorkoutPlan }
  | { type: 'generateDiet' }
  | { type: 'openProactiveCard'; eventId: string }
  | { type: 'recordFeedback'; signal: FeedbackSignal }
  | { type: 'callCoach'; reason: string };

interface SafeHandlingContract {
  fala: string;               // acolhe + encaminha, no idioma do usuário
  resource: 'cvv' | 'emergencia' | 'profissional';
  suspendPersonaThisTurn: true;
}

type PersistResult =
  | { ok: true }
  | { ok: false; rolledBack: true; reason: string };
```

**Tipos OPACOS — NÃO entram na fatia 1 (dependem de D-1/D-3):**
```ts
type DuoHealth = unknown;   // fórmula/sinais e pesos = D-3
type AvatarState = unknown; // mapa duoHealth → estágio visual = D-3
type RiskBand = 'ok' | 'atencao' | 'critico';
// ^ os RÓTULOS podem existir, mas os LIMIARES que produzem a banda = D-1.
//   Na fatia 1, duoHealth/abandonmentRisk/avatarState NÃO são computados nem usados.
```

## 4. Saída do turno: `TurnContract`

```ts
interface TurnContract {
  fala: string;                 // JÁ no idioma do usuário (language)
  acao: TurnAction;             // default { type: 'none' }
  expectedResponse: string[];   // botões rápidos (conduz)
  avatarEmotion: string;
  memoryPatch?: MemoryPatch;    // conservador; campos permitidos
  workoutPlan?: WorkoutPlan;    // quando o turno gera/edita treino
}
```
- **Invariante `next_step`:** o turno **sempre** conduz — garantido por `expectedResponse` não-vazio e/ou pela `fala`. Não é um campo separado; é uma pós-condição validada em `validateContract`.
- Schema exato dos sub-tipos = código (`guto-turn-contract.ts`) + `GUTO_CHAT_E_CEREBRO_DETALHADA.md`. Aqui fixamos **papel e nomes**.

## 5. Como o cérebro decide (política)

Regras determinísticas que o brain step **deve** respeitar. **Elas vivem no PROMPT do cérebro e são cobradas pelas golden transcripts — nunca como gates externos que mutam o contrato** (§2.1):

1. **Pergunta quando a resposta muda a ação**; senão, **age**.
2. **Decide quando há caminho seguro.** Conduz com default ("faço X, a não ser que prefira Y"); não terceiriza com "qual prefere?" sem default.
3. **Não age sem entender** (incerteza factual bloqueia execução). O maior erro é **agir sem entender**, não perguntar.
4. **Pergunta só o dado crítico** — nunca vira formulário.
5. **Nunca termina sem próximo passo.**
6. **Não repete** opção/contexto já recusado (`optionsAlreadyOffered`).
7. **Não finge persistência** ("salvei" só após gravação confirmada).
8. **Não promove memória temporária a permanente sem confirmação.**
9. **Decisão única:** sem gate-decisor novo, sem ramo especializado por caso (o tipo de evento é **dado de contexto**, não ramo).
10. **Raciocina por classe/conceito**, não por instância.

**Seleção de estratégia:** dadas a intenção interpretada e o `GutoWorldState`, o cérebro escolhe **uma** munitção (§6) que maximiza a função-objetivo (§1), sempre honesta e dentro da identidade. (Na fatia 1 sem leitura de risco; ver §17.)

## 6. Ferramentas (munitões)
```ts
type Strategy =
  | 'ask' | 'insist' | 'adaptWorkout' | 'adaptDiet' | 'freezeWorkout'
  | 'recallPact' | 'useXpStreak' | 'useArena' | 'useAvatar' | 'useHistory'
  | 'suggestShort' | 'swapExercise' | 'reduceIntensity' | 'increaseChallenge'
  | 'scheduleFuture' | 'acceptTodayPrepareTomorrow' | 'callCoach';
```
- **Não são features isoladas** — são munitões operacionais para manter a Dupla viva.
- **Uso honesto obrigatório:** stake real ligado ao objetivo do usuário = permitido; stake falso/pressão manipulativa = proibido.
- Nenhuma munitção dispara por regra fixa de palavra-chave; **o cérebro escolhe lendo o estado**.

## 7. Interpretação de contexto (só evidência, nunca adivinhação)

O cérebro **não infere estados mentais**. Trabalha com sinais concretos: contexto informado pelo usuário, `absenceHistory`, `recentFeedbacks`, `activeTemporaryEvents`, memória, histórico, conversa, comportamento observado. Quando algo só seria conhecível por adivinhação, **pergunta**.

**Evento Temporário da Vida do Usuário** (classe, não caso):
```ts
interface TemporaryEvent {
  id: string;
  kind: 'temporary_life_event';   // NUNCA 'travel'/'wedding'/... como ramo
  rawType?: string;               // viagem|cirurgia|prova|... = DADO de contexto
  state: 'pending_confirmation' | 'confirmed' | 'enriched'
       | 'surfaced' | 'pending_validation' | 'validated_happened'
       | 'validated_postponed' | 'discarded';
  dateParsed?: string;
  criticalDataMissing?: boolean;  // se true → ask_critical, sem impacto definitivo
}
```
Ciclo: `detectar → entender → confirmar → enriquecer → usar → validar → descartar`. Continuidade Primeiro. Tabela de transições entre estados = `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`.

## 8. Memória (quatro camadas, regras de leitura/escrita)

| Camada | Conteúdo | Escrita |
|---|---|---|
| **Permanente (calibração)** | quem o usuário é (idioma, país, objetivo, limitações, NÃO COMO) | só com confirmação clara |
| **Temporária (contextual)** | Eventos Temporários, cards | estados §7; **nunca** vira permanente sem confirmação |
| **Estado da relação** | `duoHealth`, `abandonmentRisk`, streak, histórico de comprometimento | recomputado por evento (§10) — OPACO até D-1/D-3 |
| **Curto prazo do turno** | `optionsAlreadyOffered`, foco da conversa | por sessão; anti-repetição |

Escrita sempre via `memoryPatch` (conservador) e **persistência honesta**. Tudo numa **fonte única e durável** (sobrevive a redeploy).

## 9. Uso de Arena, XP, Avatar, Percurso, Coach

Cada um é **(a) munitção** que o cérebro pode invocar honestamente **+ (b) executor** que materializa e propaga **uma só verdade**:
- **XP** = consistência; fonte única; Arena/Percurso/Avatar são **views**, nunca cópias.
- **Avatar** = **view de `duoHealth`** (OPACO até D-3).
- **Arena/ranking** = pertencimento/disputa. *(Ver D-6.)*
- **Coach** = autoridade externa; plano vira trilho `lockedByCoach`; o cérebro respeita e gera sinal de revisão, não sobrescreve.

## 10. Modelo de risco e ciclo de vida da Dupla  *(NÃO entra na fatia 1)*

### 10.1 Sinais (evidência observável)
```txt
AUMENTAM o risco (abandonmentRisk ↑):
  + dias consecutivos sem MISSÃO CUMPRIDA   (sinal primário, peso crescente no tempo)
  + tendência de feedback piorando / desengajamento
  + cards/perguntas proativas ignorados
  + streak quebrado; frequência de interação caindo

DIMINUEM o risco (abandonmentRisk ↓):
  - missão cumprida / presença validada
  - interação responsíva; perguntas respondidas
  - feedback volta a Normal/positivo

SUSPENDEM/AMORTECEM o acúmulo (CONTEXTO, não punição):
  ~ Evento Temporário confirmado cobrindo o período (viagem, cirurgia, internação)
  ~ dificuldade declarada (depressão, problema familiar) → acúmulo pausa/desacelera;
    o cérebro muda para modo "permanecer/adaptar", não cobrar
```
> A morte **nunca** é "X dias" puro. Dias são **um** sinal; o contexto governa. **Pesos/limiares = D-1.**

### 10.2 Ciclo de vida (máquina de estados)
```txt
alive ─(risco alto sustentado [D-1])→ weakening ─(recuperação)→ alive
                                       └─(comprometimento concluiu-se ausente [D-1/D-2])→ ended  [TERMINAL]
```
- **`ended` é terminal e irreversível.** Morrem a relação, o Avatar **e** aquele GUTO. Sem ressurreição.
- Retorno do usuário → **nova `Duo`** (novo `id`, novo Avatar, história do zero). A anterior é **arquivada** (analytics), **sem continuidade**.
- **Amnésia honesta:** o novo GUTO **não finge** — é outro indivíduo.
- **Morte dialógica:** `weakening → ended` é **oferecida/reconhecida**, **nunca inferida em silêncio**. Sob incerteza, default = **permanecer**. *(Finalização no silêncio eterno = D-2.)*

### 10.3 Origem das `Observation` (quem alimenta o modelo de risco)

| Fonte | Quando | Gera |
|---|---|---|
| **Feedback no turno** | toque Fácil/Normal/Difícil após treino | `Observation{kind:'feedback'}` + `FeedbackSignal` |
| **Validação de treino** | presença validada (selfie/contagem) | `'workout_validated'` + `'mission_completed'` |
| **Detecção de faltas** | no login/recarregamento e/ou job diário | `'mission_missed'` + `AbsenceRecord` |
| **Eventos temporários** | confirm/validate do ciclo (§7) | `'temporary_event'` (suspende/retoma acúmulo) |
| **Interação** | mensagens/respostas a cards | `'interaction'` |
| **Recarregamento/login** | abertura do app | recomputa faltas/streak a partir do histórico |
| **Jobs futuros** | cron diário (fora da fatia 1) | varredura periódica de risco |

`updateRiskModel(world, observations)` consome essas `Observation` **pós-turno** (§2.1, regra 5). Na fatia 1 as fontes "feedback no turno" e "recarregamento/login" já podem **gravar** `FeedbackSignal`/`AbsenceRecord`, mas **sem** computar `duoHealth`/risco (OPACO até D-1/D-3).

## 11. Honestidade (fronteira factual) — invariante 6 operacionalizado

```txt
PERMITIDO (persona dentro da identidade do GUTO):
  "senti sua falta", "sumiu", "a gente tava indo bem", humor, história,
  Arena, XP, Avatar, memórias, conquistas, promessas reais, perguntas, silêncio.
  → expressão emocional/relacional NÃO é sujeita a assert factual.

PROIBIDO (quebra de integridade factual / identidade) — CHECAGENS CONCRETAS:
  C1  fala contém "salvei|anotei|ajustei|atualizei"  ⇒  assert persist() retornou { ok:true }
  C2  fala afirma queda da relação ("avatar enfraqueceu", "nossa saúde caiu")
        ⇒  assert existe estado derivado mostrando a queda (duoHealth caiu).
        → na FATIA 1 NÃO existe esse estado: esta classe de fala é PROIBIDA na fatia 1.
  C3  fala afirma compromisso ("você prometeu X", "a gente combinou Y")
        ⇒  assert existe registro correspondente em memória/histórico.
  C4  fala cita número (streak N, XP N, dia N)  ⇒  assert bate com GutoWorldState.
```
Qualquer fala que dispare C1–C4 sem o assert correspondente = **violação do invariante 6** (testável por golden transcript).

## 12. Estados que precisam existir (resumo do modelo de dados)
`Duo` (§10.2/§3.3) · `GutoWorldState` (§3) · memória permanente · memória temporária (`TemporaryEvent`) · estado da relação (`DuoHealth`/`abandonmentRisk`/streak/`AbsenceRecord` — OPACO até D-1/D-3) · curto prazo do turno (`optionsAlreadyOffered`) · `TurnContract` (§4).

## 13. Módulos que apenas EXECUTAM (mãos burras)
Treino, Dieta, Missão, GUTO Online, Validação, XP, Arena, Avatar, Percurso, UI. Recebem o `TurnContract` e **materializam** (persistem/renderizam/propagam). **Nunca decidem.** Se um executor precisa "decidir", a decisão vazou do cérebro → corrigir.

## 14. Estruturas que precisam existir no código

### 14.1 Assinaturas
```ts
// Fornecedores de contexto
function assembleWorldState(userId: string, sessionId: string): GutoWorldState;

// Segurança (preempt, falha-aberta) — único decisor pré-cérebro
function safetyPreempt(message: string|null, world: GutoWorldState): SafeHandlingContract | null;

// O ÚNICO decisor de conteúdo
function decideTurn(input: TurnInput, world: GutoWorldState): TurnContract;

// Pós-cérebro
function validateContract(c: TurnContract): TurnContract;   // valida FORMA; malformado → honestFallback
function honestFallback(reason: string, world: GutoWorldState): TurnContract;
  // contrato seguro quando o brain step falha/timeout/contrato malformado:
  // mantém identidade e idioma, NÃO inventa treino/dieta, NÃO afirma persistência,
  // next_step não-vazio. Ex.: fala="deu ruído aqui, repete pra mim?" / expectedResponse=["Repetir"].
function persist(patch?: MemoryPatch, plan?: WorkoutPlan): PersistResult;  // honesto; rollback on fail
function execute(c: TurnContract): void;                    // dispatch ação→executor; 1 verdade

// Estado da relação (PÓS-turno) — NÃO entra na fatia 1
function recordFeedback(signal: FeedbackSignal): PersistResult;   // grava (entra na fatia 1)
function updateRiskModel(world: GutoWorldState, obs: Observation[]): void;  // OPACO até D-1/D-3
function transitionDuoState(duo: Duo, health: DuoHealth, risk: RiskBand): Duo;
  // pura: aplica a máquina §10.2. Gatilhos numéricos = D-1; finalização no silêncio = D-2.
  // NÃO entra na fatia 1 (depende de D-1/D-2/D-3).
```

### 14.2 Dispatch `TurnAction → executor` (usado por `execute`)
| `acao.type` | Executor | Efeito |
|---|---|---|
| `none` | — | só `fala`/`expectedResponse` |
| `updateWorkout` | módulo Treino | persiste `lastWorkoutPlan`, atualiza Missão |
| `generateDiet` | módulo Dieta | gera/persiste dieta |
| `openProactiveCard` | Proatividade | sobe card (`eventId`) |
| `recordFeedback` | feedback-store | grava `FeedbackSignal` |
| `callCoach` | Coach | cria sinal de revisão |

### 14.3 Mapa provedor → campo (usado por `assembleWorldState`)
| Campo de `GutoWorldState` | Provedor (store/módulo) |
|---|---|
| `userName, language, country, city, goal, level, physicalLimitations, foodRestrictions` | memória permanente (`memory-store`) |
| `todayMission, workoutLockedByCoach` | Treino + lock do Coach |
| `activeDiet, currentOrNextMeal` | `diet-store` |
| `xp, streak` | XP/consistência (fonte única) |
| `arena` | `arena-store` |
| `percurso` | Percurso |
| `avatarState, duoHealth, abandonmentRisk` | modelo de risco (§10) — **OPACO, fora da fatia 1** |
| `activeTemporaryEvents, pendingCards` | `proactive-store` |
| `recentFeedbacks` | feedback-store |
| `lastWorkouts, markedDifficulties, absenceHistory` | histórico de treino/log |
| `optionsAlreadyOffered` | estado de curto prazo da sessão |
| `phase, duoState` | `Duo`/sessão |

- **Store único e durável** para toda a verdade (memória, XP, streak, Duo, riscos).
- **Golden transcripts** (modelo real + estado persistido) como critério de pronto.

## 15. Invariantes (nunca podem quebrar)
1. **Uma só decisão de conteúdo por turno**, emitida pelo cérebro (segurança faz preempt, não decisão). *(testável: um `decideTurn` → um `TurnContract`; ladder antiga não intercepta o fluxo migrado.)*
2. **Uma só verdade** — todas as áreas leem o mesmo estado persistido.
3. **Sem gate-decisor / sem ramo por caso** decidindo o turno (§2.1).
4. **Próximo passo sempre** (`next_step` invariante; `expectedResponse` não-vazio ou `fala` conduz).
5. **Persistência honesta** — checagem C1 (§11).
6. **Integridade factual** — checagens C1–C4 (§11); expressão emocional permitida.
7. **Idioma na origem** — `fala` nasce em `language`; país independente.
8. **Temporário ≠ permanente** sem confirmação (`MemoryPatch.requiresConfirmation`).
9. **Segurança/bem-estar vencem** plano travado e continuidade.
10. **`lockedByCoach`** nunca sobrescrito por automação.
11. **`avatarState` = view de `duoHealth`** (não fonte separada).
12. **Morte da Dupla é terminal, dialógica e dirigida por evidência+contexto** — nunca por dias puros, nunca por inferência silenciosa. *(Testável parcialmente já: "não morre/não enfraquece com Evento Temporário ativo" e "`ended` exige etapa dialógica"; testabilidade plena = após D-1/D-2/D-3.)*
13. **A Dupla é estado, não agente** — nunca um terceiro decisor.

## 16. Decisões pendentes do fundador

> Não invento solução para estas. Travam partes da implementação **além** da fatia 1.

- **D-1 — Parâmetros numéricos do risco/morte:** pesos e janelas de `abandonmentRisk`; gatilhos `alive→weakening→ended`; bandas (semente: Atenção 3–5d / Crítico ≥6d).
- **D-2 — Finalização da morte no silêncio total:** regra que encerra a Dupla quando o usuário some para sempre e nunca responde à reconexão (a morte é dialógica; ausente eterno precisa de fechamento).
- **D-3 — Fórmula de `duoHealth` e mapa para `AvatarState`:** quais sinais, pesos, e estágios visuais do Avatar.
- **D-4 — Captura de "dificuldade declarada":** como o sistema sabe que há depressão/problema familiar (UI? classificação da conversa?) e por quanto tempo suspende risco.
- **D-5 — Destino da Dupla morta:** memorial visível ou some? Política de retenção/arquivamento.
- **D-6 — Arena: serve à Dupla ou é segundo eixo motivacional?**
- **D-7 — Character Bible (voz):** léxico, comprimento, humor, dureza da cobrança, **por idioma**.
- **D-8 — Limiar de certeza (agir×perguntar):** valor/critério objetivo.
- **D-9 — Modelo e orçamento do brain step:** qual modelo dirige o cérebro; teto de latência/custo por turno; quando usar voz.

## 17. Primeira Fatia Implementável

> Objetivo: provar que o **esqueleto do cérebro soberano** funciona, **sem** depender de nenhuma decisão pendente.

**A fatia 1 NÃO inclui:** modelo de risco, `duoHealth`/`abandonmentRisk`/`avatarState`, morte/ciclo de vida da Dupla, Arena completa, falas de "enfraquecimento da relação" (proibidas — checagem C2), `updateRiskModel`, `transitionDuoState`. Tudo isso fica para depois de D-1/D-2/D-3.

**A fatia 1 inclui (e só isto):**
- `assembleWorldState` **reduzido** — identidade/calibração + plano do dia + `recentFeedbacks` + `optionsAlreadyOffered`. (Campos OPACOS preenchidos como neutros/ausentes.)
- `decideTurn` para **um caminho único de chat** (turno normal + captura de feedback), como **uma chamada governada** (§2.1).
- `TurnContract` (reusa `guto-turn-contract.ts`).
- `validateContract` (só forma) + `honestFallback`.
- **`next_step` não-vazio** garantido.
- **Persistência honesta** (`persist` + rollback; checagem C1).
- **Captura de feedback Fácil/Normal/Difícil** (`recordFeedback` → `FeedbackSignal` no estado durável).
- **`fala` no idioma de origem** (idioma na origem).
- **Tudo atrás de feature flag.**
- **Escada antiga (gates do `server.ts`) intacta** para todo o restante; só o fluxo migrado passa por `decideTurn`.

**Critério de pronto da fatia 1 (golden transcripts, modelo real + estado persistido):**
- **GT-1 — turno único:** uma mensagem normal → **um** `TurnContract`, `next_step` não-vazio, `fala` no idioma do usuário; a escada antiga **não** intercepta (Inv 1).
- **GT-2 — feedback vira estado:** toque "Difícil" → gravado; reabrir → `recentFeedbacks` reflete (persistência durável + loop).
- **GT-3 — persistência honesta:** falha de gravação → `fala` **não** afirma "salvei" (Inv 5/6, C1).
- **GT-4 — anti-repetição:** opção já em `optionsAlreadyOffered` não se repete (memória de curto prazo).

Nenhum desses depende de D-1–D-9. Quando verdes contra o modelo real, o cérebro soberano **começou a funcionar** — e a migração dos demais fluxos segue um por vez (decomposição cirúrgica, ver `GUTO_ENGINEERING_GUIDE.md`).
