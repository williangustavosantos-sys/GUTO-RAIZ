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

## 1. Função-objetivo (formal)

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

- "Dupla viva" é medida por **evidência observável** (§10), nunca por proxy de engajamento (tempo de tela, push aberto). Otimizar proxy = proibido.
- Quando o objetivo (5) colide com uma restrição superior (1–4), **a restrição vence** e o objetivo cede.
- O cérebro **não pergunta** "como respondo?"; pergunta **"qual ação agora maximiza a sobrevivência honesta da Dupla?"**

## 2. Pipeline do turno

**Soberania:** comprehensão + decisão + composição acontecem em **uma única chamada governada** ao modelo (o "brain step"), não numa cadeia de módulos determinísticos que competem. As únicas etapas determinísticas são **pré-cérebro** (montar estado + preempt de segurança) e **pós-cérebro** (validar, persistir, executar). **Nada decide o turno exceto o brain step.**

```txt
PRÉ-CÉREBRO (determinístico)
  P0  assembleWorldState(userId, sessionId) → GutoWorldState
  P1  safetyPreempt(message, world)         // risk-classifier, falha-aberta
        └─ se risco real → retorna SafeHandlingContract e ENCERRA o turno

CÉREBRO (uma chamada governada — o decisor soberano)
  B   decideTurn(input, world) → TurnContract
        ├─ interpreta intenção + contexto + certeza
        ├─ aplica função-objetivo (§1) + política de decisão (§5)
        ├─ escolhe 1 estratégia (§6)
        └─ compõe o contrato (fala no idioma do usuário + ação + next_step)

PÓS-CÉREBRO (determinístico)
  Q0  validateContract(contract)             // malformado → honestFallback()
  Q1  persist(contract.memoryPatch, contract.workoutPlan)  // honesto; rollback on fail
  Q2  execute(contract)                       // mãos materializam + propagam 1 verdade
  Q3  updateRiskModel(world, observations)    // §10 (feedback, faltas, interação)
```

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
Snapshot único montado pelos **fornecedores de contexto**. Sem ele o GUTO responde cego.
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
  avatarState: AvatarState;                 // VIEW de duoHealth
  percurso: PercursoState;
  duoHealth: DuoHealth;                      // computado (§10)
  abandonmentRisk: RiskBand;                 // computado (§10)

  // — Memória viva (TEMPORÁRIA/contextual)
  activeTemporaryEvents: TemporaryEvent[];   // §7
  pendingCards: ProactiveCard[];
  recentFeedbacks: FeedbackSignal[];         // §10
  lastWorkouts: WorkoutRecord[];
  markedDifficulties: string[];
  absenceHistory: AbsenceRecord[];           // dias sem missão cumprida
  optionsAlreadyOffered: string[];           // anti-repetição (curto prazo)

  // — Sessão / turno
  phase: FlowPhase;                          // onboarding | normal | retomada | ...
  duoState: 'alive' | 'weakening' | 'ended'; // §10
}
```

## 4. Saída do turno: `TurnContract`

```ts
interface TurnContract {
  fala: string;                 // JÁ no idioma do usuário (language)
  acao: TurnAction | null;      // ex.: updateWorkout, generateDiet, openProactiveCard
  expectedResponse: string[];   // botões rápidos (conduz)
  avatarEmotion: string;
  memoryPatch?: MemoryPatch;    // conservador; campos permitidos
  workoutPlan?: WorkoutPlan;    // quando o turno gera/edita treino
}
```
- **Invariante `next_step`:** o turno **sempre** conduz — garantido por `expectedResponse` não-vazio e/ou pela `fala`. Não é um campo separado; é uma pós-condição validada em `validateContract`.
- Schema exato dos sub-tipos = código (`guto-turn-contract.ts`) + `GUTO_CHAT_E_CEREBRO_DETALHADA.md`. Aqui fixamos **papel e nomes**, não a forma final.

## 5. Como o cérebro decide (política)

Regras determinísticas que o brain step **deve** respeitar (testáveis por golden transcript):

1. **Pergunta quando a resposta muda a ação**; se o próximo passo é o mesmo independente da resposta, **age**.
2. **Decide quando há caminho seguro.** Conduz com default ("faço X, a não ser que prefira Y"); não terceiriza com "qual prefere?" sem default.
3. **Não age sem entender** (incerteza factual bloqueia execução). O maior erro é **agir sem entender**, não perguntar.
4. **Pergunta só o dado crítico** — nunca vira formulário.
5. **Nunca termina sem próximo passo.**
6. **Não repete** opção/contexto já recusado (`optionsAlreadyOffered`).
7. **Não finge persistência** ("salvei" só após gravação confirmada).
8. **Não promove memória temporária a permanente sem confirmação.**
9. **Decisão única:** sem gate-decisor novo, sem ramo especializado por caso (o tipo de evento é **dado de contexto**, não ramo).
10. **Raciocina por classe/conceito**, não por instância.

**Seleção de estratégia:** dadas a intenção interpretada e o `GutoWorldState`, o cérebro escolhe **uma** munitção (§6) que maximiza a função-objetivo (§1). Quanto maior o `abandonmentRisk`, mais o cérebro tende a estratégias de recuperação de comprometimento — **sempre honestas e dentro da identidade**.

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
Ciclo: `detectar → entender → confirmar → enriquecer → usar → validar → descartar`. Continuidade Primeiro: evento = mudança de contexto, nunca desculpa automática. Detalhe em `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`.

## 8. Memória (quatro camadas, regras de leitura/escrita)

| Camada | Conteúdo | Escrita |
|---|---|---|
| **Permanente (calibração)** | quem o usuário é (idioma, país, objetivo, limitações, NÃO COMO) | só com confirmação clara |
| **Temporária (contextual)** | Eventos Temporários, cards | estados §7; **nunca** vira permanente sem confirmação |
| **Estado da relação** | `duoHealth`, `abandonmentRisk`, streak, histórico de comprometimento | recomputado por evento (§10) |
| **Curto prazo do turno** | `optionsAlreadyOffered`, foco da conversa | por sessão; anti-repetição |

Escrita sempre via `memoryPatch` (conservador) e **persistência honesta**. Tudo numa **fonte única e durável** (sobrevive a redeploy).

## 9. Uso de Arena, XP, Avatar, Percurso, Coach

Cada um é **(a) munitção** que o cérebro pode invocar honestamente **+ (b) executor** que materializa e propaga **uma só verdade**:
- **XP** = consistência; fonte única; Arena/Percurso/Avatar são **views**, nunca cópias.
- **Avatar** = **view de `duoHealth`** (cresce/enfraquece/morre com a relação). Não é o usuário nem o GUTO.
- **Arena/ranking** = pertencimento/disputa, usado quando serve à Dupla. *(Ver Decisão Pendente D-6.)*
- **Coach** = autoridade externa; plano vira trilho `lockedByCoach`; o cérebro respeita e gera sinal de revisão, não sobrescreve.

## 10. Modelo de risco e ciclo de vida da Dupla

### 10.1 Sinais (evidência observável)
```txt
AUMENTAM o risco (abandonmentRisk ↑):
  + dias consecutivos sem MISSÃO CUMPRIDA   (sinal prim�rio, peso crescente no tempo)
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
> A morte **nunca** é "X dias" puro. Dias são **um** sinal; o contexto governa. O GUTO **não pune contexto**.

### 10.2 Ciclo de vida (máquina de estados)
```ts
interface Duo {
  id: string; userId: string; bornAt: string;
  state: 'alive' | 'weakening' | 'ended';
  avatarState: AvatarState;  // view de duoHealth
  endedAt?: string;
}
```
```txt
alive ─(risco alto sustentado)→ weakening ─(recuperação)→ alive
                                  └─(comprometimento concluiu-se ausente)→ ended  [TERMINAL]
```
- **`ended` é terminal e irreversível.** Morrem a relação, o Avatar **e** aquele GUTO. Sem ressurreição.
- Retorno do usuário → **nova `Duo`** (novo `id`, novo Avatar, história do zero). A Dupla anterior é **arquivada** (analytics do fundador), **sem continuidade** com a nova.
- **Amnésia honesta:** como o GUTO anterior genuinamente terminou, o novo GUTO **não finge** desconhecer — ele é, de fato, um novo indivíduo.
- **Morte dialógica:** a transição `weakening → ended` é **oferecida/reconhecida** (o cérebro tenta reconectar e dá ao usuário a autoria do fim), **nunca inferida em silêncio** — isso violaria "não agir sem entender". Sob incerteza, o default é **permanecer**. *(Finalização quando o usuário some para sempre e nunca responde = Decisão Pendente D-2.)*

## 11. Honestidade (fronteira factual)

```txt
PERMITIDO (persona dentro da identidade do GUTO):
  "senti sua falta", "sumiu", "a gente tava indo bem", humor, história,
  Arena, XP, Avatar, memórias, conquistas, promessas reais, perguntas, silêncio.

PROIBIDO (quebra de integridade factual / identidade):
  - inventar fato ("você prometeu treinar ontem" se não prometeu)
  - afirmar estado falso ("salvei" sem salvar; "nosso avatar enfraqueceu" se duoHealth NÃO caiu)
  - contradizer quem o GUTO é; implorar; manipular; mudar a identidade para reter
```
Regra: **expressão emocional/relacional é livre; fato e estado precisam ser verdadeiros.**

## 12. Estados que precisam existir (resumo do modelo de dados)
`Duo` (§10) · `GutoWorldState` (§3) · memória permanente · memória temporária (`TemporaryEvent`) · estado da relação (`DuoHealth`/`abandonmentRisk`/streak/`absenceHistory`) · curto prazo do turno (`optionsAlreadyOffered`) · `TurnContract` (§4).

## 13. Módulos que apenas EXECUTAM (mãos burras)
Treino, Dieta, Missão, GUTO Online, Validação, XP, Arena, Avatar, Percurso, UI. Recebem o `TurnContract` e **materializam** (persistem/renderizam/propagam). **Nunca decidem.** Se um executor precisa "decidir", a decisão vazou do cérebro → corrigir.

## 14. Estruturas que precisam existir no código
```ts
// Fornecedores de contexto
function assembleWorldState(userId: string, sessionId: string): GutoWorldState;

// Segurança (preempt, falha-aberta)
function safetyPreempt(message: string|null, world: GutoWorldState): SafeHandlingContract | null;

// O ÚNICO decisor
function decideTurn(input: TurnInput, world: GutoWorldState): TurnContract;

// Pós-cérebro
function validateContract(c: TurnContract): TurnContract;        // malformado → honestFallback
function persist(patch?: MemoryPatch, plan?: WorkoutPlan): PersistResult; // honesto; rollback
function execute(c: TurnContract): void;                          // mãos; 1 verdade

// Saúde da Dupla
function updateRiskModel(world: GutoWorldState, obs: Observation[]): DuoHealth & { risk: RiskBand };
function recordFeedback(duoId: string, signal: FeedbackSignal): void;  // Fácil/Normal/Difícil
```
- **Store único e durável** para toda a verdade (memória, XP, streak, Duo, riscos).
- **Golden transcripts** (modelo real + estado persistido) como critério de pronto.

## 15. Invariantes (nunca podem quebrar)
1. **Uma só decisão de conteúdo por turno**, emitida pelo cérebro (segurança faz preempt, não decisão).
2. **Uma só verdade** — todas as áreas leem o mesmo estado persistido.
3. **Sem gate-decisor / sem ramo por caso** decidindo o turno.
4. **Próximo passo sempre** (`next_step` invariante).
5. **Persistência honesta** — nunca afirma salvar/alterar sem gravação confirmada.
6. **Integridade factual** — nunca inventa fato/estado; persona emocional permitida.
7. **Idioma na origem** — fala nasce em `language`; país independente.
8. **Temporário ≠ permanente** sem confirmação.
9. **Segurança/bem-estar vencem** plano travado e continuidade.
10. **`lockedByCoach`** nunca sobrescrito por automação.
11. **`avatarState` = view de `duoHealth`** (não fonte separada).
12. **Morte da Dupla é terminal, dialógica e dirigida por evidência+contexto** — nunca por dias puros, nunca por inferência silenciosa.
13. **A Dupla é estado, não agente** — nunca um terceiro decisor.

## 16. Decisões pendentes do fundador

> Não invento solução para estas. Travam partes da implementação.

- **D-1 — Parâmetros numéricos do risco/morte:** pesos e janelas de `abandonmentRisk`; quantos dias/sinais movem `alive→weakening→ended`; bandas Atenção/Crítico (semente: 3–5d / ≥6d). Sem números, o modelo §10 fica qualitativo.
- **D-2 — Finalização da morte no silêncio total:** a morte é dialógica, mas se o usuário some para sempre e **nunca** responde à reconexão, qual regra encerra a Dupla sem confirmação? (Tensão real: "dialógica" exige presença; ausente eterno precisa de uma regra de fechamento.)
- **D-3 — Fórmula de `duoHealth` e mapa para `avatarState`:** quais sinais, com que peso, e como o Avatar reflete cada faixa (estágios visuais).
- **D-4 — Captura de "dificuldade declarada":** como o sistema sabe que há depressão/problema familiar para suspender risco (UI dedicada? classificação da conversa?) e por quanto tempo a suspensão vale.
- **D-5 — Destino da Dupla morta:** o usuário vê a Dupla encerrada (memorial?) ou ela some? Política de retenção/arquivamento dos dados da Dupla anterior.
- **D-6 — Arena: serve à Dupla ou é um segundo eixo motivacional?** Competição com terceiros não deriva trivialmente de "amizade"; definir se a Arena é munitção da Dupla ou um sistema paralelo.
- **D-7 — Character Bible (voz):** "fala" precisa de spec de voz objetiva (léxico, comprimento, humor, dureza da cobrança) **por idioma** (a persona "senti sua falta" soa igual em pt/en/it?). Hoje a personalidade ainda é conhecimento tácito.
- **D-8 — Limiar de certeza (agir×perguntar):** valor/critério objetivo do "tenho certeza suficiente para agir". Hoje só qualitativo.
- **D-9 — Modelo e orçamento do brain step:** qual modelo dirige o cérebro (precisa interpretar bem) e qual o teto de latência/custo por turno; quando usar voz.
