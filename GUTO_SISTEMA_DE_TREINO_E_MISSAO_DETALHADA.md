# Sistema de Montagem de Treino do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da Geração Adaptativa de Exercícios, Coerência Física, Catálogo de Mídias Locais e Dúvidas Contextuais (a aba **Missão / Treino do Dia**).
>
> **Natureza:** descreve o **GUTO atual + alvo de produto**. O treino **consome** a calibragem (`GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`); ele não inventa dado. Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim.
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (Pág. 9) · `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` · `GUTO_CHAT_E_CEREBRO_DETALHADA.md` (botão de dúvida) · `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` · `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (Coach Lock).

---

## O Que É O Treino no GUTO

O treino do GUTO não funciona como uma lista estática de exercícios comuns de academias ou planilhas prontas de aplicativos fitness. 

Ele é uma **decisão de comportamento e segurança física** tomada de forma integrada pelo backend. O sistema combina:
- Dados biológicos de calibragem inicial.
- Memória ativa de limitações articulares e lesões.
- Histórico recente de treinos validados (evitando repetição de grupos musculares fadigados).
- Feedbacks de esforço, dores e energia coletados nas sessões passadas.
- Calendário contextual semanal (viagens e indisponibilidades fornecidas pela proatividade).
- Prescrições e bloqueios impostos pelo treinador no painel de retaguarda (Coach Lock).

Enquanto um app tradicional prescreve um "treino de peito genérico" igual para todos, o GUTO monta uma missão customizada para a realidade exata daquele dia:
> *"O Will está retornando aos treinos de musculação (nível `returning`), seu objetivo principal é hipertrofia (`muscle_gain`), treinará em uma academia (`gym`), possui um joelho sensível, realizou treino de peito ontem e viajará amanhã para Roma. O treino do dia precisa herdar e responder a todas estas condições."*

---

## Princípio Central: O Dado como Autoridade (Anti-Chute)

O GUTO é proibido de construir ou sugerir planos baseados em suposições ou dados ausentes. Se houver alguma lacuna operacional de calibragem na conta do usuário, o treino é retido e o Chat inicia o fluxo de perguntas para clarificação:

- **Se falta o local de treino:**
  > *"Will, para eu montar tua missão certa hoje: onde você vai treinar hoje? Academia, casa ou parque?"*
- **Se falta o status de dores/patologias:**
  > *"Antes de eu liberar teu treino de hoje, me diz uma coisa: tem alguma dor, lesão ou limitação física hoje ou está limpo?"*

---

## Estrutura de Validação e Origem dos Dados

O "cérebro" (backend) é a única fonte de verdade para a montagem e persistência do treino. Ele valida a integridade dos dados mínimos antes de rodar os algoritmos de geração:

```txt
               [ Validador de Calibragem Mínima ]

  Verifica Campos Mínimos:
  ├── Idade calibrada? ────────➔ (Se não: redireciona para Calibragem)
  ├── Nível de treino? ────────➔ (Se não: redireciona para Calibragem)
  ├── Objetivo ativo? ─────────➔ (Se não: redireciona para Calibragem)
  ├── Local escolhido? ────────➔ (Se não: Chat pergunta o local)
  ├── Dor/limitação declarada? ➔ (Se não: Chat pergunta sobre dores)
  └── Idioma definido? ────────➔ (Se não: herda fallback selectedLanguage)
```

O idioma é usado para texto, voz e instruções. Ele não altera a escolha biomecânica do treino. A escolha de exercícios vem de local de treino, objetivo, nível, dores/limitações, histórico e bloqueios do coach.

---

## Semântica de Patologias e Gestão de Riscos

O campo de patologias e dores é processado por motores de inteligência que realizam a classificação semântica das regiões corporais e associam restrições biomecânicas de segurança.

- **Entrada do usuário:** *"Joelho direito sensível"* ou *"Operei o menisco"*
  - **Mapeamento de risco:** Articulação de Membros Inferiores.
  - **Filtro de exclusão:** Remove agachamentos livres com alta amplitude de flexão, leg press pesado, passadas afundo ou saltos pliométricos do plano.
  - **Filtro de adaptação:** Insere caminhada de aquecimento inclinada leve ou movimentos isométricos com flexores caso o feedback seja favorável.
- **Entrada do usuário:** *"Nenhum"*, *"Sem dor"*, *"No pain"*, ou em italiano *"Nessun dolore"*
  - **Mapeamento:** Conta marcada como limpa de riscos físicos articulares.
  - *Aviso:* O termo em italiano *"nessun dolore"* não pode ser confundido por leitores primitivos como uma restrição alimentar ou alergia. Ele mapeia estritamente ausência de dores corporais.

Se o usuário preencher algo ambíguo que a IA não classifique com segurança (ex: *"estou com um negócio esquisito no braço"*), o GUTO bloqueia a geração do treino de membros superiores e questiona no chat:
> *"Will, não vou chutar. Esse 'negócio esquisito no braço' é uma dor articular, lesão muscular ou só cansaço do treino anterior?"*

---

## Ordem de Prioridade Soberana da Missão

A geração do treino do dia segue uma hierarquia de origens para garantir o alinhamento comercial B2B2C:

1. **Plano Manual Prescrito pelo Coach:** Se o Coach montou e travou o treino do dia para o aluno no painel, este treino é a verdade absoluta. O GUTO Online e a Missão herdam esse plano e o GUTO fala: *"Teu coach travou esse treino fechado para hoje, Will. Eu vou te guiar. Se aparecer dor, eu paro a sessão e marco revisão, sem trocar o plano sozinho."*
2. **Plano de Sugestão Adaptativo do GUTO:** Gerado de forma autônoma pelo backend baseado nas regras de calibragem e histórico.
3. **Fallback de Segurança:** Acionado em falhas graves de rede ou processamento, entregando uma rotina segura de mobilidade de corpo inteiro.

---

## Catálogo de Exercícios e Mídias Locais

O GUTO opera sob a premissa de que o aluno precisa saber executar cada movimento com exatidão.
- Cada exercício retornado possui o mapeamento de um vídeo de demonstração local armazenado fisicamente em `/public/exercise/visuals/[grupo]/[nome_exercicio].mp4`. **Limites oficiais de vídeo:** catálogo oficial do GUTO **≤ 15 segundos**; exercício **custom** enviado pelo coach pelo painel **≤ 30 segundos** (`/exercise/visuals/custom/`). Ambos: MP4, **sem áudio**, ≤ 720p, ≤ 12 MB, caminho interno validado.
- **Regra Crítica Absoluta:** Se o ID do exercício não corresponder a um arquivo de vídeo físico existente e validado na pasta, o exercício está **terminantemente banido** de entrar no treino do aluno. O sistema evita catalogar movimentos que não tenham prova visual.

---

## Payload de Exemplo de Plano de Treino (`lastWorkoutPlan`)

Quando o treino é montado e persistido em `memory.lastWorkoutPlan` no backend, o JSON retornado para hidratar a aba Missão segue o padrão:

```json
{
  "workoutId": "workout_will_2026_05_21",
  "focus": "Força Total — Membros Superiores",
  "focusKey": "upper_body_strength",
  "difficulty": "moderate",
  "locationMode": "gym",
  "planSource": "guto_adaptive",
  "lockedByCoach": false,
  "exercises": [
    {
      "id": "supino_reto_halteres",
      "canonicalName": "Supino Reto com Halteres",
      "sets": 4,
      "reps": 10,
      "restSeconds": 60,
      "suggestedLoad": "20kg de cada lado",
      "note": "Mantenha as escápulas aduzidas e os cotovelos a 45 graus.",
      "videoUrl": "/exercise/visuals/peito/supino_reto_halteres.mp4"
    },
    {
      "id": "remada_baixa_triangulo",
      "canonicalName": "Remada Baixa com Triângulo",
      "sets": 4,
      "reps": 12,
      "restSeconds": 60,
      "suggestedLoad": "45kg",
      "note": "Alongue bem as costas no retorno e esmague na contração.",
      "videoUrl": "/exercise/visuals/costas/remada_baixa_triangulo.mp4"
    }
  ],
  "createdAt": "2026-05-21T09:00:00Z"
}
```

---

## Evolução e Circuito de Feedback

O treino evolui dinamicamente à medida que o usuário acumula históricos na conta. Ao final de cada validação (Página 12), o sistema capta e armazena os feedbacks do aluno:

```txt
               [ Circuito de Evolução do Treino ]

  Feedbacks do Aluno:
  ├── "Foi Fácil" ➔ Próxima missão aumenta carga sugerida ou volume (+1 série/rep).
  ├── "Foi Difícil" ➔ Próxima missão mantém parâmetros de carga ou aumenta repouso.
  └── "Senti Dor" ➔ Gatilho de segurança: altera o treino do dia seguinte, banindo a região dolorida.
```

O backend utiliza o histórico recente (`completedWorkoutDates`, `workoutFeedbackHistory`) para rotacionar grupos musculares de forma inteligente, evitando repetições burras (ex: se treinou membros inferiores ontem, o foco de hoje rotaciona obrigatoriamente para membros superiores ou core).

---

## Adaptações por Nível, Local e Objetivo

- **Por Nível:**
  - `beginner` ➔ Menos séries, movimentos uniarticulares simples, descansos de 90s, sem técnicas avançadas de falha.
  - `returning` ➔ Retorno progressivo, volume moderado e foco em segurança articular.
  - `consistent` ➔ Rotina consolidada, progressão regular e distribuição equilibrada.
  - `advanced` ➔ Séries com rest-pause, técnicas de exaustão e volume muscular complexo.
- **Por Local:**
  - `home` ➔ Treino calistênico e de mobilidade de peso corporal.
  - `gym` ➔ Treino estruturado em polias, barras olímpicas e maquinários pesados.
  - `park` ➔ Corrida leve, mobilidade, calistenia e exercícios usando ambiente externo.
  - `mixed` ➔ Alterna academia, casa e ambiente externo conforme disponibilidade confirmada.
- **Por Objetivo:**
  - `fat_loss` ➔ Circuitos de maior densidade cardíaca com menos tempo de intervalo.
  - `muscle_gain` ➔ Maior foco em tempo sob tensão, controle de carga excêntrica e hipertrofia.

---

## O Botão de Dúvida "?" nos Cards de Exercício

Cada exercício exibido na aba Missão possui um ícone de interrogação `?`.

### Transmissão de Contexto
Ao clicar no `?`, a aba Missão muda instantaneamente para a aba Chat e envia um payload de contexto completo sobre o exercício selecionado. O Chat recebe:
```json
{
  "activeExerciseId": "supino_reto_halteres",
  "activeExerciseName": "Supino Reto com Halteres",
  "sets": 4,
  "reps": 10,
  "load": "20kg",
  "trainingPathology": "joelho direito sensível",
  "trainingGoal": "muscle_gain"
}
```
A IA interpreta esse objeto e responde de forma imediata e personalizada:
- **Pergunta do usuário:** *"Posso trocar este?"*
- **Resposta contextual do GUTO:** *"Posso trocar sim, Will. Como você tem o joelho sensível, esse exercício de deitar não força em nada tua articulação. Mas se preferir por causa do ombro, posso colocar o supino reto com barra. Confirma que eu mudo o plano!"*

No código atual, o Chat preserva o exercício ativo quando a dúvida nasce do card. Se o usuário disser "o aparelho está ocupado" ou "não consigo fazer esse", o GUTO não pergunta "qual exercício?": ele usa o exercício, treino completo, perfil, limitações e local de treino já injetados no contexto e responde com alternativa equivalente para o mesmo grupo muscular/local.

### Dúvida Convertida em Ação Física (Mudança no Plano)
Se o usuário confirmar a troca no chat (ex: *"Muda para barra"*), o backend executa as seguintes operações em background:
- Localiza o exercício alternativo compatível no catálogo.
- Substitui o item em `lastWorkoutPlan`.
- Salva o novo payload consolidado no backend.
- Retorna o `memoryPatch` para o frontend, atualizando visualmente o card da aba Missão no celular do usuário na mesma hora.

Se o treino estiver com `lockedByCoach: true`, o fluxo muda:
- O backend não substitui o exercício automaticamente.
- O GUTO registra o pedido e o motivo.
- O painel mostra uma pendência/revisão para o Coach.
- A resposta ao aluno deve ser honesta: o plano está travado pelo coach e precisa de validação antes da troca.

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Geração Cega:** Montar treinos se dados de segurança cruciais como limitações ou locais de treino estiverem vazios na conta.
- **Exercícios Fantasmas:** Incluir exercícios na Missão do aluno que não possuam mídias de vídeo fisicamente validadas na pasta local do app.
- **Silos de Interfaces:** O botão de interrogação `?` abrir um chat genérico com frases de boas-vindas frias e descontextualizadas em vez de responder diretamente sobre o exercício clicado.
- **Mudar e Não Salvar:** Permitir a troca de um exercício pelo chat sem gravar a substituição na chave `lastWorkoutPlan` no backend. Isso quebraria a consistência e geraria erros na tela de GUTO Online e na Validação de treino.
- **Desrespeitar o Treinador:** Sobrescrever de forma autônoma treinos que foram montados e bloqueados manualmente pelo Coach no painel administrativo (`lockedByCoach: true`).

---

## Pontos de Atenção (doc × código atual)

> Sinalização doc × `guto-app-v0`/`guto-backend`. O treino é elo maduro (gate de vídeo e respeito à dor validados por teste). Decisões herdadas já aplicadas: **vídeo catálogo ≤15s / custom ≤30s**.

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| T-1 | Treino vem do backend; frontend não inventa | `lastWorkoutPlan`/`weeklyWorkoutPlan` do `workout-curator` | App lê o plano; não inventa | ✅ alinhado |
| T-2 | Gate de vídeo local obrigatório | Exercício sem `videoUrl` válido (`/exercise/visuals/`) não entra | Validado (`workout-catalog-validation`, 27 testes; 89 mp4 reais) | ✅ alinhado |
| T-3 | Limite de vídeo | **Catálogo ≤15s / custom ≤30s**, sem áudio, ≤720p, ≤12 MB | Catálogo curto; validação custom aceita ≤30s | ✅ alinhado (decisão do fundador) |
| T-4 | Respeita dor/limitação, nível, local, objetivo | Banimento por região; progressão por nível | `workout-curator` + `workout-progression` (bug joelho/salto corrigido) | ✅ alinhado |
| T-5 | Coach Lock (`lockedByCoach`) não é sobrescrito | GUTO não reescreve plano travado | `lock/unlock` no admin-router; não-override testado | ✅ alinhado |
| T-6 | Troca de exercício pelo chat persiste em `lastWorkoutPlan` | Swap salvo no backend; com lock vira pendência p/ coach | Swap por chat persiste; **fila de "pendência" visível ao coach** não confirmada | **[implementar]** (parcial) |
| T-7 | Botão de dúvida "?" leva contexto do exercício ao chat | Abre chat com contexto, sem saudação genérica | Implementado (`exerciseDoubtTrigger`/`contextChip`) | ✅ alinhado |
| T-8 | Aparelho ocupado/dúvida contextual não perde o exercício | GUTO sugere substituto direto sem perguntar qual exercício | `buildExerciseModelContext` + `activeExerciseContextRef` preservam exercício/treino/perfil/local | ✅ alinhado |

> Detalhe do botão "?" e do tratamento de "trocar/dor/execução" no chat: ver `GUTO_CHAT_E_CEREBRO_DETALHADA.md`. Coach Lock e edição pelo painel: ver `GUTO_PAINEL_ADMIN_CANONICO_V1.md`.
