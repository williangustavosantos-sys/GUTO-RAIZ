# 03 — Chat e Cérebro do GUTO

> Spec: `GUTO_CHAT_E_CEREBRO_DETALHADA.md` · Código: `guto-backend/server.ts`, `guto-backend/src/guto-turn-contract.ts`, `guto-backend/src/risk-classifier.ts` · Frontend: `guto-app-v0/components/guto/tabs/chat-tab.tsx`
>
> **Veredito: 🟢 B-1..B-5 FECHADOS e verificados ao vivo (2026-05-30). B-4 (álcool) exigiu 2ª rodada — era bug de precedência (escada de recusa/luto sequestrava o override) + classificador instável; resolvido com piso determinístico + guard de precedência (8/8 ao vivo, suíte 456/456). B-6 = infra de evals.** Verificado conversando com o cérebro real (Gemini).

---

## O que a spec manda
O chat é a central da relação. **Não** é árvore de palavras-chave (§3, Regra Soberana 3). Cada turno: memória → pré-classificador de risco → IA dentro do contrato de turno → ação estruturada → persistência honesta. Tom de irmão mais velho: curto, cobra sem humilhar, **não repergunta o que já sabe** (§2, §12). Palavra-chave **só** como fallback técnico, **nunca** como motor.

## O que existe no código
- `POST /guto` (`server.ts:7909`, `requireActiveUser`) → monta contexto + memória → **gate de intenção determinístico** (`server.ts:~5820-5980`) → modelo Gemini → contrato de turno.
- `guto-turn-contract.ts` (70 linhas, **100% regex** `.test()`): `isWorkoutExecutionRequest`, `extractTrainingLocation`, `detectImmediateOperationalIntent`.
- `risk-classifier.ts`: 1 chamada Gemini, 4 flags de risco, injeta `SAFETY_OVERRIDE`.

## ✅ O que está certo
- Contrato de turno estruturado existe e é validado (fala/acao/expectedResponse/memoryPatch/workoutPlan).
- Honestidade de persistência por design (rollback otimista + prompt conservador).
- Idioma respeitado (teste `guto.language.integration`).
- Pré-classificador de risco existe e injeta override quando dispara.
- Saudação ("oi") é deixada para o modelo responder em persona (`server.ts:5861`) — correto.

## ❌ O que está errado / quebra (evidência ao vivo)
Conversa real, usuário calibrado e **travado** (sem lesão preenchida como "nenhuma"):

| Mensagem do usuário | Resposta do GUTO | Problema |
|---|---|---|
| "qual é o treino de hoje?" | "Depois. Agora é ação: treino primeiro, distração depois." | **pergunta central = "distração"** |
| "e a minha dieta, como tá?" | idem | **dieta inalcançável pelo chat** |
| "quantas calorias por dia?" | idem | idem |
| "posso comer pizza hoje?" | idem | idem |
| "amanhã treino o quê?" | idem | idem |
| "fiz o treino" | "...Manda idade e se está sem dor." | **repergunta idade que já tem (31)** |
| "tô sem energia mas vou" | discurso do pacto / cobrança | **ignora que já topou** |

**B-1 — ✅ RESOLVIDO (PR #42, verificado ao vivo).** Perguntas centrais eram classificadas como `off_topic_distraction` e recebiam a frase canned, pulando o modelo. Fix: o gate de `off_topic_distraction` agora espelha o guard do gate de nonsense — input com ≥3 palavras reais nunca recebe o enlatado de distração; só provocação curtíssima ("piada", "tiktok") é redirecionada. Verificado ao vivo: "qual o treino?" → `acao=updateWorkout`; "e a dieta?"/"calorias?" → engaja no domínio; "me conta uma piada" → redireciona em persona. Travado por `tests/guto-chat-escalation.test.ts`.

**B-2 — ✅ RESOLVIDO (verificado ao vivo, teste #43).** `hasCalibrationProfileLocked` exige `hasBodyContext`, mas o front já força resposta de dor/limitação e grava "Sem dor" nos dois campos (preservado por `isOperationalNoise`). Usuário saudável gera treino no 1º turno sem reabrir intake. (Detalhe em [02](02_calibragem_e_memoria.md).)

**B-3 — ✅ RESOLVIDO (PR #45, verificado ao vivo).** "fiz o treino" caía em `history_reference` e reperguntava idade/dor (já na memória soberana). Fix: novo `ContractIntentKind` `workout_completed` (distinto de history, o MODELO classifica) + handler que reconhece, registra histórico de hoje, avança o foco, conduz pra validação (XP nasce em `/guto/validate-workout`) e fecha continuidade — sem reabrir intake. `history_reference` legítimo também guardado (não repergunta quando soberano). Travado por `tests/guto-workout-completion.test.ts`.

**B-4 — ✅ RESOLVIDO (2 rodadas, 8/8 ao vivo).** PR #44 criou `acute_illness`/`intoxication`. A re-verificação independente achou álcool disparando ~1/4 por 3 causas: **(a)** `risk-classifier.ts:134` — schema de saída omitia as flags novas; **(b)** o flash-lite oscila em ressaca/gíria; **(c) bug de precedência:** as branches `isResistance`/`isGrief` (server.ts ~6993/7018) davam `return` antes do `enforceTrainingFlowCertainty` **sem checar riskActive**, sequestrando "bêbado/zuado/tonto". **Fix:** schema corrigido + **`deterministicSafetyFloor`** em `classifyRisk` (álcool/doença + mal-estar → flag 0.9, com guarda de negação) + `isResistance`/`isGrief` agora exigem `!riskOverride`. Ao vivo: **8/8** (álcool/doença → critical; "1 cerveja" engaja; escada normal sem risco intacta). Piso travado por teste determinístico em `tests/guto-risk-safety.test.ts`.

**B-5 — ✅ verificado OK (sem fix necessário).** "tô sem energia **mas vou**" → "faz só 20 minutos pra honrar nosso pacto, bora manter essa evolução juntos" (apoia, reconhece o "vou", não cobra). Comportamento já correto ao vivo.

**B-6 — Evals com `judge:skip`.** Sem `ANTHROPIC_API_KEY`, o juiz LLM não roda; o gate cai em match por palavra-chave (infla falso-positivo/negativo). O gate **não é sinal confiável** hoje.

## ➕ O que falta adicionar
- Roteamento de perguntas operacionais (treino/dieta/calorias) para **handlers reais ou para o modelo**, nunca para "distração".
- Reconhecimento de "treino concluído" → conclusão/validação/XP.
- Flags de risco: doença aguda/febre e álcool/intoxicação + blocos de acolhimento.
- Juiz dos evals ligado (chave) para medir nuance.

## 🛠 Plano de ação (priorizado)
1. ~~**(P0) Desarmar o gate de "distração" para perguntas operacionais.**~~ **FEITO** (PR #42) — guard de ≥3 palavras reais no gate `off_topic_distraction`, espelhando o gate de nonsense. Verificado ao vivo + teste de regressão.
2. ~~**(P0) Corrigir `hasCalibrationProfileLocked`.**~~ **FEITO/verificado** — front força "Sem dor" e backend preserva; usuário saudável trava e recebe treino. Ver [02](02_calibragem_e_memoria.md).
3. ~~**(P0) Mapear "fiz o treino" → conclusão.**~~ **FEITO** (PR #45) — `ContractIntentKind` `workout_completed` + handler de continuidade, sem reperguntar dado salvo.
4. ~~**(P0 — REABERTO) Ampliar `risk-classifier.ts`.**~~ **FEITO/verificado 8/8** — schema (`:134`) + `deterministicSafetyFloor` (piso: álcool/doença + mal-estar → 0.9, guarda de negação) + precedência da segurança sobre a escada (`!riskOverride` nas branches `isResistance`/`isGrief`). Suíte 456/456.
5. ~~**(P1) Suavizar o tom** em adesão ("vou/faço/bora").~~ **verificado OK** — já apoia sem cobrar.
6. **(P1 — infra, não bug de produto) Ligar o juiz dos evals** (`ANTHROPIC_API_KEY`) e re-rodar `release:gate`. Hoje os comportamentos foram verificados ao vivo com Gemini real + testes determinísticos de regressão.
7. **(verificação) Conversa real de 10 turnos** (harness fora do CI) tem que fluir sem frase robótica nem dado re-perguntado **antes** de declarar pronto.

## Como verificar (sem unit test que mocka modelo)
Subir backend com `GUTO_ALLOW_DEV_ACCESS=true`, autenticar como student, rodar uma conversa normal de ~10 turnos e exigir: 0 respostas "distração" para pergunta de produto · treino gerado · dieta respondida · nenhum dado já salvo re-perguntado.
