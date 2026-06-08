# GUTO — Fix: Contexto > Regra na Proatividade (CONCLUÍDO — PR #48 no main)

> Documento vivo. Criado em 2026-05-30. **Shipado:** CEREBROGUTO PR #48 (merge no main → Render); raiz GUTO-RAIZ commit `351a461`. Objetivo, plano, progresso e impacto nos docs canônicos abaixo.

## Objetivo
Fazer o GUTO **entender o contexto** quando o usuário compartilha um evento da semana (viagem/compromisso), em vez de tratar como recusa e cobrar treino. O fluxo-alvo (definido pelo fundador, alinhado à spec `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`):

1. Arrival: "tava te esperando, treino pronto, bora?"
2. Usuário responde afirmação ("ok") → GUTO entra na proatividade: "como tá a semana?"
3. Usuário responde algo → GUTO **avalia relevância pelo contexto** → se relevante, **sobe o card** de confirmação
4. Usuário confirma → GUTO **inicia o ciclo** (enriquece, usa, valida depois)

## Problema (evidência, reproduzido ao vivo 2026-05-30)
- Usuário: "viajo na quarta" (resposta à pergunta da semana).
- GUTO: "faz só 20 minutos hoje pra manter o pacto antes da viagem" (cobrança).
- A viagem foi salva **silenciosamente** em `pending_confirmation` (a spec proíbe save silencioso), e **sem o confirm conversacional trava ali** — não enriquece, não usa, não valida.

### Causa-raiz
- O classificador de intenção (`classifyContractIntent` em `server.ts`) rotula "viajo na quarta" como **`postpone`/recusa** (porque "vou viajar" soa como "não vou treinar").
- A **escada de cobrança** (`server.ts:6993-7038`, branch `isResistance` → `enforceTrainingFlowCertainty`) dispara e dá `return` **antes** do modelo poder responder com contexto.
- A confirmação só está fiada pro **turno seguinte** (`proactivity-injector.ts` injeta `[CONFIRMAÇÃO PENDENTE]`), porque a extração roda async depois do turno. Resultado: no momento, regra > contexto.

É a mesma doença já corrigida no chat (perguntas centrais viravam "distração"): **gates determinísticos rodando na frente e por cima do entendimento de contexto** — o oposto do README ("não pode ser árvore burra de palavras-chave").

## Princípio da correção
Modelo + memória + ciclo de proatividade **dirigem**; regra (palavra-chave/gate) só como **piso de segurança**, nunca como motor. Mesma "precedência" usada no fix de segurança (quando o contexto certo está ativo, a regra burra não roda).

## Plano
1. **Classificador:** ensinar que compartilhar viagem/compromisso/mudança de horário **não é** `postpone`/`resistance` — é evento de proatividade (contexto), o modelo trata naturalmente.
2. **Precedência:** a escada de cobrança (`isResistance`/`isGrief`) **não** dispara quando o turno é compartilhamento de evento de proatividade (ou abertura semanal ativa) — deixa o modelo acolher e o card subir.
3. **Verificar ao vivo:** "viajo na quarta" → GUTO acolhe/confirma no momento → card → `confirmed` → usado na semana. Sem quebrar a recusa legítima ("não vou treinar" continua na escada).

## Progresso
- [x] Doc criado + causa-raiz confirmada (spec + código + repro ao vivo).
- [x] Classificador: novo kind `proactive_context` (viagem/compromisso/horário ≠ recusa) + `postpone` esclarecido + fallback determinístico de viagem.
- [x] Precedência: `proactive_context` não está nos kinds de recusa → escada de cobrança não dispara; entrou na lista que reseta a escada.
- [x] Confirmação natural: injector `[CONFIRMAÇÃO PENDENTE]` (PT/EN/IT) não vaza mais o texto interno.
- [x] Verificação ao vivo: "viajo na quarta → acolhe/adapta → captura → confirma natural → trip:confirmed"; recusa legítima ainda cobra (sem regressão).
- [x] tsc 0 + suíte 456/456.
- [x] Correção do doc canônico de proatividade.
- [x] Teste determinístico (`tests/guto-proactive-context.test.ts`, 8 casos) — suíte **464/464**.
- [x] Shipado: PR #48 (backend → main → Render) + raiz commit `351a461`.
- [ ] Observado (separado, monitorar): num turno a resposta veio como JSON cru (parse intermitente) — não reproduziu no run limpo.

## Arquivos alterados
- `guto-backend/server.ts`: kind `proactive_context` (union + normalize + prompt do classificador); `postpone` esclarecido (adiar HOJE ≠ compartilhar evento da semana); fallback determinístico de viagem/compromisso; `proactive_context` na lista que reseta a escada.
- `guto-backend/src/proactivity/proactivity-injector.ts`: bloco `[CONFIRMAÇÃO PENDENTE]` (PT/EN/IT) agora pede confirmação com palavras próprias do GUTO, proibindo copiar o texto interno/usar aspas.

## Verificação
Backend local (Gemini real), userId limpo:
- "viajo na quarta" → *"Entendido. Vamos ajustar o ritmo para garantir o treino antes da viagem..."* (emo=default, **sem cobrança**).
- `/proactivity/extract` = 1 (viagem capturada, `pending_confirmation`).
- Próximo turno → *"Só confirma pra mim: **você viaja na quarta mesmo, pra eu ajustar o seu ritmo?**"* (natural, sem vazar texto interno).
- "isso, viajo mesmo" → memória vira **`trip:confirmed`**.
- Regressão: "não vou treinar hoje" → escada de cobrança (emo=alert) **intacta**.
- `tsc` 0 · `npm run test:guto` = **456/456**.

## Impacto nos docs canônicos da raiz
- `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` (Pontos de Atenção): o ciclo estava marcado ✅, mas na prática a confirmação ativa (P-2) era atropelada pela cobrança quando o usuário compartilhava o evento no chat. Adicionada nota de correção (2026-05-30) apontando este documento.

---

# Fix 2 — Continuidade Primeiro (mentalidade ativa, não agenda passiva)

> Documento vivo. Criado em 2026-06-08. Continuação do fix acima.

## Problema (evidência ao vivo)
Depois do Fix 1 o GUTO parou de cobrar treino, mas passou a responder com **mentalidade passiva de agenda tradicional**:
- Usuário: "Viajo na quarta"
- GUTO: "Quarta é dia de descanso ou treino adaptado, vamos ajustar o cronograma. Hoje e amanhã o foco é intensidade máxima pra compensar."

O erro **não** é falta de validação — é mentalidade. O GUTO assumiu interrupção primeiro ("viagem = descanso"), decidiu adaptação sem saber a condição, e prometeu "intensidade máxima pra compensar". Isso viola o princípio do produto: **o GUTO assume continuidade e busca uma forma de adaptar, nunca assume interrupção primeiro.**

## Causa-raiz
- **Conversacional:** `proactive_context` não tinha tratamento dedicado no turno do chat (diferente de `isResistance`/`isGrief`, que compõem fala via `composeContextualResponse`). O modelo respondia livre → caía na mentalidade de agenda.
- **Operacional:** `decision-engine.ts` (`decideFromProactiveMemory`, branch `travelDetected`) criava **impacto definitivo** para viagem nua (`workoutEffect: 'short_light'`, `missionEffect: 'protected_before'`, `blockedPeriod: 'all_day'`) sem saber se o usuário conseguia treinar — decidia adaptação/proteção por baixo do usuário.

## Princípio da correção
Suficiência de contexto: viagem **sem o dado crítico** (tempo/equipamento) não gera impacto definitivo — gera `ask_critical` (pending_clarification). O impacto definitivo só nasce quando o dado crítico chega: "consigo treinar" → adaptado (treino mantido); "não vai dar" → dia protegido (reorganiza a semana). Nunca descanso por padrão, nunca "intensidade máxima pra compensar".

## Arquivos alterados (Fase 2 — onde a decisão errada nascia)
- `guto-backend/src/proactivity/decision-engine.ts`: branch `travelDetected` criava impacto definitivo `short_light`/`protected_before` para "viajo quarta". **Era aqui** que a adaptação/proteção era decidida sem o dado crítico.
- `guto-backend/server.ts`: o turno do chat não tinha branch para `proactive_context` (a fala livre do modelo produzia "descanso/intensidade máxima"); `enforceTrainingFlowCertainty` não tinha piso determinístico de continuidade.
- `guto-backend/src/proactivity/types.ts`: faltavam estados para representar "perguntar o crítico" e "dia protegido" sem virar descanso.

## Implementação (Fase 3)
- `types.ts`: `ProactiveWorkoutEffect`/`ProactiveMissionEffect` ganham `'protected'`; `ProactiveDecisionReason` ganha `'short_window'`; `criticalQuestion` ganha `'training'`.
- `decision-engine.ts`: `detectTravelTrainingSignal()` (can_train / cannot_train / unknown). Viagem **unknown** → `ask_critical` (sem efeitos definitivos); **can_train** → `adapt_day` (treino mantido, curto/leve, sem `all_day`); **cannot_train** → dia `protected` (sem XP/Arena grátis, reorganiza semana). Novo branch `short_window` ("10 minutos") → missão curta. `getAdaptationForDate` expõe `isProtectedDay`.
- `server.ts`: branch `proactive_context` no turno (compõe fala ativa via `composeContextualResponse` + `buildProactiveContinuityContextPrompt`, com fallback determinístico `buildProactiveContinuityFala`); classificador (LLM + fallback) reconhece semana corrida e janela curta como continuidade; `enforceTrainingFlowCertainty` aplica piso determinístico de continuidade; `applyProactiveWorkoutAdaptation` não fabrica treino em dia `protected`.

## Testes (Fase 4)
- `tests/guto-proactive-continuity.test.ts` (novo): os 6 casos exigidos (viagem nua → ask_critical; viagem+hotel → adaptado; viagem+impossível → protegido; reunião à noite → bloqueia período preservando continuidade; "10 minutos" → missão curta; "semana corrida" → plano mínimo + linguagem ativa).
- `tests/proactivity-decision-engine.test.ts` e `tests/guto-proactivity-http.test.ts`: atualizados do contrato antigo (viagem nua = `short_light`) para o novo (viagem nua = `ask_critical`).

## Validação (Fase 5)
- `npm run typecheck` (tsc 0) + `npm test` (suíte verde).
