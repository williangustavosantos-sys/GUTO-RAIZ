# GUTO — Context Audit (Sprint de Contexto)

> **Natureza:** diagnóstico de engenharia. Lê os documentos canônicos da raiz como lei e o
> código real dos submódulos (`CORPOGUTO` = `guto-app-v0`, `CEREBROGUTO` = `guto-backend`)
> como estado atual. **Não** propõe reescrita de arquitetura. Foco exclusivo: **por que o GUTO
> toma uma decisão correta e depois age como se ela nunca tivesse acontecido.**
>
> Data: 2026-06-04 · Escopo: contexto (proatividade, exercício ativo, ponte Online↔Chat, voz, layout).

---

## 0. Leitura canônica da raiz (o que o GUTO tem que ser)

Fonte: `GUTO_CORE_PRINCIPLES.md`, `GUTO_CHAT_E_CEREBRO_DETALHADA.md`,
`GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`, `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`,
`GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md`, `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md`, `README.md`.

- **O que é:** companheiro ativo digital — presença, não chatbot. O chat é a central da relação
  da dupla `GUTO & [Nome]`. Toda mensagem passa pelo cérebro (backend) dentro de um **contrato de
  turno estruturado** (`fala/acao/expectedResponse/avatarEmotion/memoryPatch/workoutPlan`).
- **O que nunca pode virar** (CORE_PRINCIPLES §6): executar sem entender; **descartar memória
  validada sem confirmação** (§2); ser árvore fixa "se X → Y" (§3); **"responder genericamente
  quando recebeu contexto específico de exercício, alimento ou sessão"**.
- **Fonte de verdade esperada:** `GutoMemory` no backend é a **fonte única**. "Não pode existir
  calibragem/estado paralelo no app, no chat, no treino ou na dieta." (`CALIBRAGEM_E_MEMORIA`). O
  frontend é rascunho; o backend é verdade.
- **Como memória, chat, proatividade e GUTO Online deveriam conversar:** todos **leem e escrevem a
  mesma `GutoMemory`**. Proatividade = ciclo fechado **coletar → confirmar → enriquecer → usar →
  validar → descartar**, com **uma única confirmação** ("Duplicar Memórias em Correções" é proibido).
  GUTO Online **usa o plano oficial persistido** e suas trocas têm que **sincronizar com a Missão**
  ("o plano de treino é um recurso unificado"). Regra Soberana 2: **o GUTO não repergunta o que já sabe.**

**Tensão central encontrada:** o GUTO **decide com o modelo, no turno** (tempo real), mas
**confirma/persiste com pipelines determinísticos, fora do turno** (assíncronos). Esses dois mundos
**não compartilham um estado comum vivo**. O modelo age sobre o contexto antes de ele existir como
memória; os pipelines re-perguntam como se a ação nunca tivesse acontecido. Os 5 casos abaixo são
sintomas da mesma fratura.

---

## 1. Confirmação duplicada de eventos (viagem)

**Caso real:** GUTO perguntou da viagem → usuário respondeu → GUTO adaptou o treino corretamente →
depois apareceu um **card** perguntando de novo sobre a mesma viagem.

### Onde o evento nasce, é salvo e confirmado

| Etapa | Local | Arquivo |
|---|---|---|
| Nasce (fala do usuário) | `classifyContractIntent` rotula como `proactive_context` → **não** dispara cobrança; modelo acolhe e **adapta no turno** | [server.ts:5426](../guto-backend/server.ts#L5426), [server.ts:5477](../guto-backend/server.ts#L5477) |
| Salvo | Extração **pós-turno** dispara `/guto/proactivity/extract` → `addProactiveMemory(status: pending_confirmation)` | front [chat-tab.tsx:1284](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1284) → back [server.ts:8689](../guto-backend/server.ts#L8689), [server.ts:8717](../guto-backend/server.ts#L8717) |
| Persistência | `memory[userId].proactiveMemories` (Redis/arquivo) — **fonte única correta** | [proactive-store.ts](../guto-backend/src/proactivity/proactive-store.ts) |

### Quem gera a pergunta no chat × quem gera o card

- **Pergunta conversacional (canal A):** o injector injeta `[PROATIVIDADE — CONFIRMAÇÃO PENDENTE]`
  no prompt do `/guto` e do `/guto/proactive` → GUTO pergunta "com as palavras dele". —
  [proactivity-injector.ts:274-318](../guto-backend/src/proactivity/proactivity-injector.ts#L274).
- **Card (canal B):** o frontend tem um **segundo poller** (`refreshProactiveMemories`, 60s) que
  busca `GET /guto/proactivity/memories` (retorna inclusive `pending_confirmation`) e renderiza um
  **card Sim/Não/Corrigir**. — front [chat-tab.tsx:1052-1059](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1052),
  [chat-tab.tsx:1615](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1615);
  filtro [guto-proactivity-ui.ts:54-63](../guto-app-v0/lib/guto-proactivity-ui.ts#L54); back [server.ts:8672-8681](../guto-backend/server.ts#L8672).

### Por que os dois canais aparecem / onde falta coordenação

1. **Duas superfícies independentes para a mesma memória `pending_confirmation`**, sem nenhuma flag
   de coordenação. O status `surfaced` só é setado para memórias **ativas** (`confirmed/enriched`),
   **nunca** para `pending_confirmation` — [injector:267-270](../guto-backend/src/proactivity/proactivity-injector.ts#L267).
   Logo nada marca "já perguntei isto por um canal".
2. **Dois pollers de 60s independentes** no chat: mensagem proativa
   ([chat-tab.tsx:884](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L884) / interval [1031](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1031))
   e card ([1052](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1052)). Não se suprimem.
3. **Ação antes da memória:** o modelo já **adaptou o treino no turno** (correto via
   `proactive_context`), mas a memória nasce **depois** como `pending_confirmation` — então a
   pergunta/o card chegam *depois* de o usuário já ter visto o GUTO agir. Viola a ordem do próprio
   spec (confirmar → usar) e a Regra Soberana 2 ("não repergunta o que já sabe").
4. **Risco de dupla gravação:** dois caminhos escrevem memória — extração pós-turno
   ([server.ts:8717](../guto-backend/server.ts#L8717)) e ação inline do modelo
   `applyBackendProactiveAction` ([server.ts:1195](../guto-backend/server.ts#L1195)). O dedup por
   assinatura (`type|date|location|understood`, [proactive-store.ts:72](../guto-backend/src/proactivity/proactive-store.ts#L72))
   só roda **dentro** da extração; se o `understood` divergir uma palavra, nasce uma 2ª memória → 2º card.

**Objetivo (canônico):** um evento só pode ser confirmado **uma vez**. Se o chat resolveu, o card
não pergunta; se o card resolveu, o chat não pergunta.

---

## 2. Contexto de exercício perdido

**Caso real:** usuário disse "a máquina está ocupada" → GUTO trocou o exercício → na mensagem
seguinte GUTO esqueceu qual exercício estava em andamento.

### Onde o exercício ativo é armazenado

| Pergunta | Resposta | Arquivo |
|---|---|---|
| É React ref? | **Sim** — `activeExerciseContextRef` (string montada uma vez) | [chat-tab.tsx:632](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L632), set em [1333](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1333) |
| Vai pro localStorage? | Não | — |
| Vai pro backend? | **Não** — só é prefixado no `modelInput` de **um** envio | [chat-tab.tsx:813](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L813) (`wrapWithActiveContext`) |
| Entra no prompt? | Sim, **só naquele turno** | [chat-tab.tsx:1357](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1357) |
| Entra no histórico enviado ao backend? | **Não** — history usa `message.text` (a bolha visível, sem o prefixo) | [chat-tab.tsx:1233](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1233) |
| Existe campo em `GutoMemory`? | **Não** — não há `activeExercise`/sessão ativa | [guto.ts:155-230](../guto-app-v0/lib/api/guto.ts#L155) |
| Quando desaparece? | Quando o usuário dispensa o chip (`clearActiveContext`), quando outra dúvida sobrescreve o ref, **ou** já no turno seguinte (porque o histórico não carrega o contexto) | [chat-tab.tsx:807-811](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L807) |

### Causa raiz

O contexto técnico do exercício é **efêmero e local** (ref, single-shot). Dois mecanismos o matam:

1. **Histórico sem contexto:** o backend recebe `history = messages.slice(-6)` mapeando só o texto
   visível. O prefixo de contexto **nunca** entra no histórico, então no turno N+1 o modelo vê "a
   máquina está ocupada" sem saber **de qual exercício** — fluxo genérico. Fere CORE_PRINCIPLES §6.
2. **Ref não é reconstruído após a troca:** `activeExerciseContextRef` é montado uma vez do
   `pendingExerciseQuestion.exercise` ([1333](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1333)).
   Depois que o GUTO troca o exercício, o ref continua apontando para o exercício **antigo** — o
   contexto fica defasado.

**Objetivo (canônico):** o exercício ativo precisa **sobreviver entre mensagens** e **chegar ao
backend** (fonte única de verdade).

---

## 3. GUTO Online e Chat sem estado comum

**Caso real:** o GUTO Online sabe exercício/série/descanso, mas o chat parece não saber em qual
exercício o usuário está.

### Onde o GUTO Online guarda o estado

| Pergunta | Resposta | Arquivo |
|---|---|---|
| Exercício/série atual | `state.exerciseIndex` / `state.currentSet` no engine local (React) | [guto-online-session.tsx:239](../guto-app-v0/components/guto/guto-online-session.tsx#L239) |
| Onde persiste | `localStorage`, chave `guto-online-session:v1:{workoutKey}` | [guto-online-storage.ts:53](../guto-app-v0/lib/guto-online/guto-online-storage.ts#L53) |
| Usa `workoutKey`? | Sim | idem |
| Tem `userId` na chave? | **Não** | [guto-online-storage.ts:29](../guto-app-v0/lib/guto-online/guto-online-storage.ts#L29) |
| Backend lê o estado? | **Não** — só recebe `/guto/online/exception` (dor/fadiga/troca) | [server.ts:9472](../guto-backend/server.ts#L9472) |
| Chat recebe esse estado? | **Não** | — |

### Causa raiz

- O **Quick Talk** do GUTO Online responde **localmente** por classificação regex
  (`classifyOnlineCommand`), **sem** passar pelo cérebro (`sendGutoMessage`) —
  [guto-online-session.tsx:493-580](../guto-app-v0/components/guto/guto-online-session.tsx#L493).
  Contraria CORE_PRINCIPLES §3 (não é árvore de palavras-chave) e isola o estado.
- A sessão **não escreve** exercício/série na `GutoMemory`. Quando o `workoutKey` muda (novo plano),
  a sessão local fica **órfã** → retoma como genérico. O doc Online diz que o estado deveria ser
  "persistido no backend (`guto-online-storage`)" (O-5/O-8) — **divergência**: hoje é localStorage puro.
- **Infra existe mas está morta:** há um **Context Bank** canônico
  ([src/presence/context-bank.ts](../guto-backend/src/presence/context-bank.ts)) que persiste contexto
  operacional em `memory[userId].contextBank` (com estado/confiança/expiração/dedup). Porém **não está
  conectado ao `server.ts`** (zero referências). É a camada de "contexto soberano" pronta e não usada.

**Objetivo (canônico):** se o usuário está na série 2 de um exercício, o chat precisa saber.

---

## 4. Voz intermitente (apenas mapeado — não corrigir nesta sprint)

**Caso real:** a voz sai na maioria das mensagens, mas algumas curtas ficam sem áudio.

Ordem de resolução do TTS: `static-file → local-cache (IndexedDB) → /voz remoto → browser → silent`
([guto-voice-service.ts:277](../guto-app-v0/lib/guto-voice/guto-voice-service.ts#L277)).

- **Pula o cache remoto se o texto tem `{` ou `}`:** `isRemoteCacheable` rejeita qualquer texto com
  chaves ([service:250-255](../guto-app-v0/lib/guto-voice/guto-voice-service.ts#L250)). Respostas com
  vazamento de JSON (já observado no PR #48) caem no fallback do navegador — **mudo no mobile**.
  Independe do tamanho (bate com "não é texto longo").
- **Autoplay sem gesto:** mensagens **proativas/arrival/semanais** tocam sem interação do usuário →
  política de autoplay do iOS bloqueia `audio.play()` → silêncio; respostas a um envio (com gesto)
  tocam. [chat-tab.tsx:947](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L947), [863](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L863).
- **Fala corta fala:** `speak()` chama `stop()` no início ([service:298](../guto-app-v0/lib/guto-voice/guto-voice-service.ts#L298));
  um poll proativo durante uma fala corta o áudio anterior.

> Fora do escopo de correção desta sprint (instrução do fundador). Apenas mapeado.

---

## 5. Layout quebrando atrás do input (apenas mapeado — não corrigir nesta sprint)

**Caso real:** mensagens e cards ficam atrás da caixa de digitar/teclado.

- O input reage ao teclado (`inputStackBottom` usa `isKeyboardOpen`) —
  [chat-tab.tsx:1439](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1439).
- **Mas** os outros elementos usam offsets **estáticos** a partir de `--guto-chat-input-bottom`, que
  **não recalcula** com o teclado (só `--guto-viewport-height` muda — [guto-app.tsx:899](../guto-app-v0/components/guto/guto-app.tsx#L899)):
  - card proativo: `bottom: calc(var(--guto-chat-input-bottom) + 4.75rem)` — [chat-tab.tsx:1619](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1619);
  - chip de contexto: `+4.25rem/+7.75rem` — [chat-tab.tsx:1688](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1688);
  - lista de mensagens: `+72px` — [chat-tab.tsx:1589](../guto-app-v0/components/guto/tabs/chat-tab.tsx#L1589).
- Nenhum deles reage a `isKeyboardOpen` → com o teclado aberto podem ficar atrás do input/teclado.

> Fora do escopo de correção desta sprint. Apenas mapeado.

---

## 6. Ranking de impacto

Classificação: **P0** = quebra a sensação de GUTO vivo · **P1** = quebra continuidade · **P2** = UX
ruim · **P3** = melhoria.

| # | Problema | Causa raiz | Arquivo | Impacto | Correção mínima |
|---|---|---|---|---|---|
| **P0-1** | Card + pergunta conversacional confirmam o **mesmo** evento | Duas superfícies independentes para `pending_confirmation`, sem flag de coordenação | injector:274 · chat-tab:1052/1615 · server:8672 | GUTO parece amnésico logo após acertar (caso 1) | Eleger **um** canal de confirmação para `pending_confirmation` e suprimir o outro |
| **P0-2** | Ação do modelo precede a memória do evento | Adapta no turno; memória nasce depois como `pending_confirmation` | server:5477 · chat-tab:1284 · server:8717 | Re-pergunta sobre algo já agido | Marcar "já tratado no turno" / não re-perguntar evento já acolhido |
| **P1-1** | Contexto de exercício morre em 1 turno | Ref efêmero, fora do histórico e do backend; não reconstruído após troca | chat-tab:813/1233/1333 | GUTO esquece o exercício (caso 2); fere CORE §6 | Persistir exercício ativo e reinjetá-lo enquanto a dúvida estiver ativa |
| **P1-2** | GUTO Online isolado do cérebro | Estado só local (`workoutKey`, sem `userId`); Quick Talk regex; backend não lê | online-session:239/493 · online-storage:29 | Chat não sabe a série/exercício (caso 3) | Ponte mínima: persistir exercício/série ativos na `GutoMemory` e injetar no `/guto` |
| **P2-1** | Possível dupla gravação de memória | Extração e ação inline; dedup parcial | server:8717/1195 · proactive-store:72 | Dois cards "do mesmo" evento | Estender dedup por assinatura aos dois caminhos |
| **P2-2** | Voz intermitente | skip por `{}`, autoplay sem gesto, fala corta fala | guto-voice-service:250/298 | Presença inconsistente (caso 4) | *(fora de escopo desta sprint)* |
| **P2-3** | Layout atrás do input/teclado | Offsets estáticos que ignoram `isKeyboardOpen` | chat-tab:1589/1619/1688 | Card/mensagem escondidos (caso 5) | *(fora de escopo desta sprint)* |
| **P3-1** | Context Bank canônico não conectado | `src/presence/*` construído e nunca lido pelo `server.ts` | presence/* | Infra de contexto soberano ociosa | Conectar como evolução futura (não nesta sprint) |

---

## 7. Plano de correção (mínimo, 3 blocos)

> Princípio: **menor patch possível**, sem feature nova, sem reescrever arquitetura, sem mexer em
> avatar/visual/dieta/XP/Cloudinary/billing/painel. Voz e layout ficam **apenas mapeados**.

### Bloco 1 — Contexto soberano (estado comum mínimo)
Garantir um único lugar de verdade vivo para: **evento semanal ativo**, **confirmação pendente**,
**exercício ativo** e **sessão GUTO Online ativa**. Sem inventar subsistema: usar `GutoMemory`
(fonte única já canônica) e/ou o `proactiveMemories` existente, marcando estado de "já perguntado".

### Bloco 2 — Supressão de duplicidade
Impedir que chat e card perguntem a mesma coisa. **Decisão de canal** (precisa do fundador):
escolher se `pending_confirmation` é resolvido **(a) no chat** (GUTO pergunta com as palavras dele —
mais canônico) ou **(b) no card** (Sim/Não/Corrigir determinístico). O outro canal para de perguntar.
Aplicar também dedup de gravação nos dois caminhos (P2-1).

### Bloco 3 — Persistência de exercício ativo
Fazer o contexto técnico do exercício **sobreviver entre mensagens** e **chegar ao backend**:
reconstruir/persistir o exercício ativo (incluindo após troca) e reinjetá-lo no prompt enquanto a
dúvida/sessão estiver ativa — para o chat nunca cair em genérico (CORE §6) e para o GUTO Online e o
chat compartilharem o mesmo exercício/série (ponte mínima).

---

## 8. O que NÃO será tocado nesta sprint
Avatar · voz · visual · dieta · XP · Cloudinary · billing · painel admin/coach · remoção de arquivos ·
qualquer comportamento fora do contexto. Voz (caso 4) e layout (caso 5) ficam **diagnosticados**, não corrigidos.
