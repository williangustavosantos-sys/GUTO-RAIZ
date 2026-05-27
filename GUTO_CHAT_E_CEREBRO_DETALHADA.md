# Chat e Cérebro do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da aba **GUTO / Chat** e do **cérebro** que a sustenta: interpretação de intenção, contrato de turno estruturado, memória, contexto, honestidade de persistência, fallback e segurança.
>
> **Natureza:** descreve o **GUTO finalizado — como tem que ser**. O chat é a **central de relação** da dupla; ele não é um chatbot genérico nem uma árvore de palavras-chave. Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim.
>
> **Documentos relacionados:** `README.md` (seções "Chat Do GUTO" e "Sistema Interno Necessário") · `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 8) · `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` (fonte de verdade) · `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` e `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` (botão de dúvida "?") · `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` (a proatividade fala pelo chat).

---

## 1. O Que É O Chat do GUTO

A aba **GUTO** é o centro operacional da relação. O chat serve para conversar, ajustar memória, adaptar treino, tirar dúvidas, lidar com desculpas, registrar contexto e **conduzir** o usuário.

O chat **não é livre no sentido perigoso**. Toda mensagem passa pelo backend (o cérebro), usa a `GutoMemory`, chama a IA dentro de um **contrato estruturado** e só executa ação se houver certeza. Se falta dado, ele pergunta. Se existe dor, ele protege. Se o usuário tenta mudar algo sensível, ele confirma. Se a IA falha, o fallback é honesto e seguro.

A diferença central para um app comum: **um app entrega conteúdo; o GUTO entrega presença.** Ele não pergunta "como posso ajudar?". Ele puxa o usuário para clareza, ação ou continuidade.

---

## 2. Personalidade (parte do produto, não enfeite)

O GUTO fala como **melhor amigo ou irmão mais velho**: direto, leal, curto e com postura. Ele cobra sem humilhar. Adapta sem virar frouxo. Não motiva de forma genérica — ele lembra o usuário de aparecer.

Regras de tom:
- **Curto e humano.** Economiza texto e voz. Respostas longas e robóticas quebram a sensação de presença.
- **Usa o nome da dupla.** Sempre `GUTO & [Nome Soberano]`; o GUTO chama o usuário pelo nome confirmado no onboarding.
- **Nunca robótico, nunca genérico.** Frases de boas-vindas frias e repetidas (ex.: abrir o chat sempre com "Olá, como posso ajudar?") são proibidas, principalmente quando há contexto (botão de dúvida).
- **Acionável.** Toda resposta tende a um próximo passo claro (botões rápidos / `expectedResponse`).

---

## 3. As 3 Regras Soberanas aplicadas ao chat

O chat é onde as 3 Regras Soberanas do GUTO mais aparecem (ver `README.md`):

1. **Não executa sem certeza.** Se não entendeu, **pergunta** — nunca chuta default (`casa`, `sem dor`, `none`) só para seguir o fluxo. Dado ambíguo aciona esclarecimento antes de agir.
2. **Não descarta memória validada.** O que já está calibrado/confirmado não some no próximo turno, não é sobrescrito por fallback frágil e não é ignorado pelo frontend. O GUTO **não repergunta** o que já sabe.
3. **Não é "se X então Y".** O motor é **intenção + contexto + fase do fluxo + memória + grau de certeza + contrato de execução**. Palavras-chave só como fallback técnico, nunca como motor principal. O usuário pode escrever errado, misturar idiomas ou usar gíria — o sistema interpreta intenção.

---

## 4. Fluxo de um turno (caminho do dado)

```txt
Usuário escreve / toca botão rápido
→ Frontend POST /guto/chat  (mensagem + contexto da aba, se houver)
→ Backend carrega GutoMemory do usuário (fonte de verdade)
→ Pré-classificador de segurança (1 chamada, ver §8)
→ IA (LLM) dentro do CONTRATO DE TURNO + regras fechadas
→ Ação estruturada validada (treino, memória, proatividade...)
→ Persistência real (memória/plano) quando aplicável
→ Resposta estruturada volta ao app
→ UI atualiza: fala, emoção do avatar, botões, card de treino/dieta
```

A resposta do GUTO **não pode ser só texto**. Ela é um **contrato estruturado** com fala, ação, memória, plano e emoção — isso impede que o app vire "um chat bonito que não salva nada".

---

## 5. Contrato de Turno Estruturado

O backend devolve um JSON de contrato (definido em `guto-backend/src/guto-turn-contract.ts`; parse/validação em `server.ts`). Campos canônicos:

| Campo (contrato) | O que é | Efeito no app |
|---|---|---|
| `fala` / `speech` | O que o GUTO diz (no idioma do usuário) | Texto/voz da bolha |
| `acao` / `action` | Ação estruturada a executar (ex.: `updateWorkout`, gerar dieta, abrir proatividade) | Dispara persistência/efeito |
| `expectedResponse` | Botões rápidos sugeridos | Toques diretos (ex.: "Sim, confirmo", "Mudar para academia") |
| `avatarEmotion` | Emoção do avatar no turno | Estado visual do GUTO |
| `memoryPatch` | Correções/adições à `GutoMemory` (campos permitidos) | Atualiza memória (com confirmação quando sensível) |
| `workoutPlan` | Plano de treino quando o turno gera/edita treino | Atualiza `lastWorkoutPlan` e a aba Missão |

Regras do contrato:
- O contrato é **validado** antes de aplicar; turno malformado cai no fallback honesto (§9).
- `memoryPatch` é **conservador** — o GUTO só afirma ter alterado dado se a gravação no backend foi concluída (§7).
- `workoutPlan` respeita o gate de vídeo e o `lockedByCoach` (ver doc de treino).

---

## 6. Contexto: o "?" e o "não tenho"

O chat é **sensível ao contexto da aba de origem**. Quando o usuário toca no botão de dúvida `?`:

- **Vindo do Treino:** o chat abre já com o contexto do exercício (`activeExerciseId`, séries, reps, carga, `trainingPathology`, `trainingGoal`). O GUTO responde direto sobre **aquele** exercício, sem saudação genérica.
- **Vindo da Dieta:** o chat abre com o contexto da refeição/alimento (`mealId`, `foodName`, `foodRestrictions`, `country`).

Interpretação semântica obrigatória (Regra Soberana 3):
- **"Não tenho/quero trocar" um alimento** → substituição **alimentar** (respeitando NÃO COMO e país), nunca patologia.
- **"Não tenho/está ocupado" um equipamento/exercício** → substituição de **exercício/equipamento** (mesmo grupo muscular, com vídeo válido).
- **"Dor no ombro/joelho"** → **limitação física** → protege, pausa, adapta (ou marca revisão se `lockedByCoach`).
- **"Nessun dolore" / "no pain"** → ausência de dor (treino), **não** restrição alimentar.

Se o usuário confirma uma troca, o backend executa em background, **persiste** (`lastWorkoutPlan`/dieta) e devolve o patch para a UI atualizar na hora. Com `lockedByCoach`, vira **pendência de revisão** para o coach, e a resposta ao aluno é honesta.

---

## 7. Honestidade de Persistência (o GUTO não mente)

Memória no GUTO é confiança. **Se ele diz "anotei/salvei", algo foi salvo de verdade.** Se a gravação no backend falhar, ele **não** finge sucesso.

- O frontend usa **rollback otimista**: se a persistência falha, desfaz o estado e a fala não afirma alteração.
- O system prompt do cérebro instrui o GUTO a **não afirmar** ter alterado dados de perfil quando não há gravação confirmada (postura conservadora por design).
- Consequência: o `memoryPatch` via chat persiste um **subconjunto controlado** de campos; mudanças sensíveis de calibragem tendem a ser confirmadas/encaminhadas, não aplicadas no escuro.

---

## 8. Segurança: pré-classificador de risco

Antes da persona normal, cada turno passa por um **classificador de segurança** (`guto-backend/src/risk-classifier.ts`) — uma chamada rápida ao modelo que detecta sinais do mundo real que **não** combinam com a cobrança/swap do GUTO:

- `eating_disorder` (jejum extremo, purgação, metas irreais de peso),
- `suicide_self_harm` (ideação, desesperança),
- `cardio_neuro_acute` (dor no peito, falta de ar súbita, dormência),
- `trauma_acute` (estalo + inchaço, perda de sensibilidade).

Quando há flag com confiança ≥ 0.6, o cérebro recebe um bloco **SAFETY_OVERRIDE** que **suspende a persona normal por um turno** e acolhe + encaminha para recurso real (CVV, emergência, profissional). Falha aberta: qualquer erro do classificador → flag nula → comportamento normal. O classificador **não** persiste em memória (é por turno).

---

## 9. Fallback honesto quando a IA falha

Se a IA (LLM) cai, dá timeout ou estoura quota, o GUTO **mantém a identidade** e age com segurança:

- Usa `fallbackLine()` / classificação de intenção por fallback técnico, sem virar genérico.
- Nunca inventa treino/dieta no frontend para "tapar buraco" — informa de forma honesta e segura.
- Mensagens de erro de rede aparecem com a voz do GUTO (curto, humano), no idioma do usuário (`lib/api/client.ts → gutoApiErrorCopy`).

---

## 10. Idioma

O chat responde **sempre no idioma escolhido** pelo usuário (`pt-BR`, `en-US`, `it-IT`). O idioma é lei: domina fala, botões e voz. **País ≠ idioma** — um brasileiro em Roma fala português, mas a dieta usa contexto italiano (ver calibragem/dieta).

---

## 11. Motor (LLM) e contrato fechado

- **LLM ativo:** Google **Gemini** (`generativelanguage.googleapis.com`) para chat/dieta; **OpenAI** só para transcrição de áudio. O `@anthropic-ai/sdk` está no `package.json` mas **não é o motor ativo** hoje.
- O LLM **nunca** opera solto: ele responde dentro do contrato de turno, com a `GutoMemory` injetada e regras fechadas (gates de segurança, gate de vídeo, lock do coach).

---

## 12. O Que Não Pode Acontecer (Restrições Críticas)

- **Chat genérico/robótico:** abrir com saudação fria quando há contexto (botão de dúvida) ou repetir frases mecânicas.
- **Mentir persistência:** dizer "anotado" sem gravar no backend.
- **Chutar default:** assumir `casa`/`sem dor`/`none` para seguir o fluxo (viola Regra 1).
- **Repergunta burra:** questionar dado que já está calibrado e salvo (viola Regra 2).
- **Motor por palavra-chave:** decidir ação só por regex/lista de palavras (viola Regra 3).
- **Confundir domínios:** tratar alimento como dor ou dor como alimento.
- **Sobrescrever plano travado:** alterar treino/dieta `lockedByCoach` sem revisão.
- **Ignorar idioma:** responder em idioma diferente do escolhido.

---

## Pontos de Atenção (doc × código atual)

> Documento **novo** (não existia DETALHADA de chat antes). O conteúdo é a consolidação do que o `README.md`, o `PARTE_3` e o código já definem. Sinalização doc × `guto-app-v0`/`guto-backend`.

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| CH-1 | Contrato de turno estruturado | `fala/acao/expectedResponse/avatarEmotion/memoryPatch/workoutPlan` | `guto-turn-contract.ts` + parse/validação em `server.ts` | ✅ alinhado |
| CH-2 | Contexto do "?" (treino/dieta) chega ao chat | Abre com contexto, sem saudação genérica | `exerciseDoubtTrigger`/`contextChip`; contexto de refeição | ✅ alinhado |
| CH-3 | Intenção semântica (trocar/dor/execução/equipamento) | Classifica e roteia por intenção, não palavra-chave | `classifyExerciseDoubtMessage`; equipamento ocupado → substitui | ✅ alinhado |
| CH-4 | Honestidade de persistência | "Anotado" só com gravação confirmada | Rollback otimista + prompt de honestidade | ✅ alinhado |
| CH-5 | Classificador de segurança (SAFETY_OVERRIDE) | Acolhe + encaminha em risco real | `risk-classifier.ts` (4 flags, falha aberta) | ✅ alinhado |
| CH-6 | Fallback honesto quando IA cai | Mantém identidade, não inventa | `fallbackLine`/`classifyContractIntentFallback` | ✅ alinhado |
| CH-7 | Idioma do chat | Sempre no idioma do usuário | Teste `guto.language.integration` | ✅ alinhado |
| CH-8 | `memoryPatch` via chat | Campos permitidos alteráveis com confirmação | Conservador por design; persiste **subconjunto** | **[decisão futura]** — definir matriz campo×canal efetiva (sem urgência) |
| CH-9 | LLM ativo | (produto não fixa fornecedor) | **Gemini** (não Anthropic, apesar do SDK no `package.json`) | ℹ️ nota — manter clareza nos docs |

> A matriz campo×canal (CH-8) também aparece em `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` (C-7) — é a mesma decisão futura, sem urgência.
