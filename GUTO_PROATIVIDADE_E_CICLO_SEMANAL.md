# Proatividade e Ciclo Semanal do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de produto e engenharia da Máquina de Estados de Proatividade, Ciclos de Contexto Semanal e Inteligência de Presença do GUTO.

---

## O Que É A Proatividade Do GUTO

A proatividade do GUTO é a chave de virada sensorial do produto. Ela é o mecanismo técnico e comportamental que faz o usuário sentir que seu companheiro ativo digital não é um robô de respostas passivas, mas uma presença real que o acompanha na jornada diária.

**A proatividade do GUTO não é push. A proatividade é o sistema nervoso do GUTO.**

Ela precisa provar que o GUTO:
- pensa antes do usuário;
- detecta ausência;
- entende rotina semanal;
- confirma antes de salvar;
- usa memória temporária;
- adapta treino e dieta;
- respeita dor, patologia, `lockedByCoach` e `foodRestrictions`;
- evita spam;
- valida eventos depois que passam;
- não vira chatbot passivo.

**Proatividade NÃO é:**
- Disparar notificações push genéricas com frases motivacionais aleatórias.
- Mandar mensagens automáticas e frias dizendo: *"Hora de treinar!"*.
- Enviar alertas irritantes de calendário sem qualquer relação com o estado físico do aluno.
- Transformar o GUTO em chatbot passivo que só reage quando o usuário pergunta.
- Criar notificação genérica sem motivo rastreável.

**Proatividade É:**
Um ciclo integrado e fechado onde o GUTO **pergunta, entende, confirma, salva, enriquece, usa e valida** eventos e contextos pessoais da vida do usuário que afetam de forma direta a sua capacidade de cumprir a Missão.

Se este ciclo operar com 100% de precisão e integridade, o GUTO atinge sua promessa de valor: o usuário sente que não está sozinho e que o GUTO sabe exatamente o que está acontecendo na semana dele.

---

## 1. Objetivo da Fase 4 — Proatividade

A Fase 4 não começa implementando push. Push é apenas um canal de entrega. A fase começa tornando a proatividade tecnicamente confiável, auditável e conectada ao comportamento real do GUTO.

A ordem correta da Fase 4 será:

1. Auditoria da proatividade existente.
2. Validação deste documento canônico.
3. Correção do schema de memória proativa.
4. Endpoints/jobs.
5. Push real.
6. Integração com treino/dieta.
7. Integração com XP/ausência/morte.
8. Mobile/UX.
9. Testes.
10. Só depois aprovação.

Regras de escopo:
- Proatividade não é painel ADM.
- Proatividade não é Fase 3.
- Proatividade é uma fase própria porque afeta todo o sistema: chat, memória, treino, dieta, ausência, XP, penalidade, push, mobile e revisão de coach.
- A Fase 4 não deve avançar criando funcionalidades isoladas. Primeiro precisa existir contrato canônico, depois implementação validada contra esse contrato.

---

## A Ideia Principal: O Contexto Operacional

O GUTO monitora e reage a eventos da rotina do usuário que influenciam as variáveis de treino, dieta, segurança articular, cobrança de presença e consistência.

### Eventos Monitorados

- Viagens (lazer ou trabalho).
- Compromissos profissionais ou familiares fora da rotina.
- Alterações temporárias de horários disponíveis.
- Cansaço acumulado ou fadiga prevista.
- Dores ou incômodos musculares.
- Lesões ou sinais de risco físico.
- Fechamento de academias (feriados locais, obras, eventos).
- Falta temporária de equipamento.
- Semanas atipicamente corridas.
- Contextos alimentares temporários: aeroporto, trem, casamento, reunião longa, cidade diferente.

Essas informações são salvas como **Memória Proativa Contextual**, moldando a flexibilidade e a resiliência do sistema.

### Princípio Temporário

A proatividade cria contexto operacional temporário. Ela não deve transformar automaticamente uma semana atípica em calibragem permanente. Viagem, mudança de cidade, horário quebrado, dieta prática ou treino em hotel são sinais de curto prazo, não alteração definitiva de perfil.

---

## O Ciclo da Semana e o Gatilho Resiliente

O início natural da coleta do contexto semanal ocorre nas primeiras horas da segunda-feira. No entanto, o sistema deve ser resiliente a inatividades.

```txt
               [ Gatilho de Coleta Semanal ]

            Segunda-feira?
             /          \
          (Sim)         (Não)
           /              \
    Usuário abriu?    Primeira abertura real
          │           do usuário na semana?
          ▼                    │
    Perguntar sobre            ▼
    a rotina semanal     Perguntar sobre a rotina
                         e planejar o resto da semana
```

### Regra do Gatilho Resiliente

Se o usuário sumiu e só abriu o aplicativo na quarta-feira, o GUTO detecta que a semana corrente não possui registros de contexto ativo. A primeira interação do GUTO com o aluno deve ser o questionamento acolhedor e focado sobre o restante dos seus dias:

> *"Will, para eu organizar tua missão direito daqui para frente: como está o resto da tua semana? Tem viagem, compromisso ou horário quebrado que eu preciso considerar?"*

Esse gatilho não deve bloquear o treino sem necessidade. Ele deve coletar contexto rápido e seguir para a missão.

---

## O Que a Proatividade Salva vs. O Que Ignora

Para manter o banco de dados limpo e os prompts focados, o extrator semântico do backend aplica um filtro de relevância sobre as conversas.

### Salva na Memória Proativa (Impacto Direto)

- *"Quarta vou viajar para Roma."* (Afeta clima, local de treino, dieta prática, push e tempo de Missão).
- *"Sexta tenho um compromisso o dia inteiro."* (Gera sugestão de treino matutino mais curto).
- *"Esta semana só consigo treinar às 06h."* (Ajusta os alarmes de cobrança ativa no push).
- *"Sábado tenho o casamento do meu irmão."* (Sinaliza dia de descanso planejado, missão mínima ou dieta prática).
- *"A academia vai fechar na quinta."* (Ativa treino em casa/hotel ou missão curta, se permitido).
- *"Estou com dor no joelho."* (Aciona prioridade de segurança física).

### Ignora (Conversa Casual)

- *"Roma é uma cidade linda."*
- *"Estou assistindo a uma nova série."*
- *"Hoje o café da manhã estava maravilhoso."*
- *"Meu amigo viajou semana passada."*

**Regra de Ouro:** Só vira memória proativa o evento que altera treino, dieta, cobrança, rotina, segurança ou consistência de presença.

Mesmo nesses casos, se a ação afetar calibragem, treino, dieta ou cobrança, o GUTO deve confirmar antes de salvar em memória operacional.

---

## Confirmação Ativa (Sem Suposições)

O GUTO nunca salva informações de rotina como verdades absolutas de forma silenciosa. Ele sempre passa pela etapa de validação com o usuário no chat, em modal curto, em push reply ou em UI in-app.

### Cenário de Confirmação Clara

- **Usuário:** *"Quarta vou para Roma e sexta vou para Londres."*
- **GUTO (Entende e propõe confirmação):** *"Ok, Will. Então quarta é Roma e sexta é Londres, certo?"*
- **Usuário:** *"Certo / Isso."*
- **Resultado:** Backend altera o estado da memória para `confirmed`.

### Cenário de Correção Ativa

- **Usuário:** *"Quarta vou para Roma e sexta vou para Londres."*
- **GUTO:** *"Ok, Will. Então quarta é Roma e sexta é Londres, certo?"*
- **Usuário:** *"Não, na verdade Roma é quinta."*
- **GUTO (Corrige antes de salvar):** *"Fechado. Roma fica na quinta e Londres na sexta. Anotado!"*

### Cenário Ambíguo (Anti-Chute)

- **Usuário:** *"Vou viajar essa semana, acho que quarta."*
- **GUTO (Recusa a suposição):** *"Não vou chutar, Will. Roma ainda está de pé para quarta ou o dia ficou incerto?"*

Evento ambíguo não altera treino, dieta, XP, cobrança ou push. Ele pode gerar uma pergunta curta de esclarecimento, mas não uma adaptação.

---

## 2. Schema Técnico da Memória Proativa

Este é o contrato conceitual da memória proativa. Ele descreve o objeto que a Fase 4 deve implementar, auditar e respeitar. O nome abaixo é técnico, mas o objetivo é simples: cada evento temporário precisa ter origem, confirmação, impacto, ciclo de vida e expiração.

```ts
type ProactiveEvent = {
  id: string
  userId: string
  type:
    | "travel"
    | "schedule_change"
    | "busy_day"
    | "busy_week"
    | "fatigue"
    | "pain"
    | "injury"
    | "gym_closed"
    | "equipment_unavailable"
    | "meal_context"
    | "temporary_location"
    | "other"

  status:
    | "pending_confirmation"
    | "confirmed"
    | "enriched"
    | "surfaced"
    | "pending_validation"
    | "validated_happened"
    | "validated_postponed"
    | "discarded"
    | "expired"

  source:
    | "chat"
    | "weekly_checkin"
    | "push_reply"
    | "app_open"
    | "manual_admin"

  rawText: string
  normalizedTitle: string
  dateStart?: string
  dateEnd?: string
  timeWindow?: string
  locationCity?: string
  locationCountry?: string
  timezone?: string

  affectsWorkout: boolean
  affectsDiet: boolean
  affectsPush: boolean
  affectsPenalty: boolean
  affectsCoachReview: boolean

  userConfirmed: boolean
  confirmationQuestion?: string
  confirmationAnswer?: string

  enrichment?: {
    weather?: unknown
    holiday?: unknown
    timezone?: string
    localContext?: string
  }

  impact: {
    workout?: "none" | "shorter" | "home" | "hotel" | "recovery" | "skip_planned" | "coach_review"
    diet?: "none" | "practical_meals" | "travel_meals" | "macro_preserve" | "coach_review"
    push?: "none" | "reschedule" | "increase_attention" | "reduce_cobrança"
    penalty?: "none" | "soften" | "pause_review" | "no_penalty_if_confirmed"
  }

  expiresAt?: string
  createdAt: string
  updatedAt: string
  surfacedAt?: string
  validatedAt?: string
}
```

### Explicação Dos Campos

| Campo | Significado |
|---|---|
| `id` | Identificador único do evento proativo. Deve ser usado para evitar duplicação e rastrear logs. |
| `userId` | Usuário dono do contexto. Nunca deve misturar eventos entre contas. |
| `type` | Categoria operacional do evento. Define qual parte do sistema pode ser afetada. |
| `status` | Estado atual na máquina de estados da proatividade. |
| `source` | Canal onde o evento nasceu: chat, check-in semanal, resposta de push, abertura do app ou admin manual. |
| `rawText` | Texto original que gerou a extração. Serve para auditoria e debug sem depender só da normalização. |
| `normalizedTitle` | Título curto e legível do evento, como "Viagem para Roma" ou "Semana corrida". |
| `dateStart` | Data inicial do evento, quando houver data confiável. |
| `dateEnd` | Data final do evento, quando ele ocupa mais de um dia ou período. |
| `timeWindow` | Janela de horário relevante, como "manhã", "após 20h" ou "06:00-07:00". |
| `locationCity` | Cidade temporária vinculada ao evento. Não altera a cidade permanente do perfil. |
| `locationCountry` | País temporário vinculado ao evento. Não altera o país permanente do perfil. |
| `timezone` | Fuso do evento quando diferente ou relevante para push e agenda. |
| `affectsWorkout` | Indica se pode impactar treino, missão ou seleção de exercícios. |
| `affectsDiet` | Indica se pode impactar orientação alimentar contextual. |
| `affectsPush` | Indica se deve ajustar horário, tom ou existência de push. |
| `affectsPenalty` | Indica se pode suavizar, revisar ou evitar penalidade cega. |
| `affectsCoachReview` | Indica que o evento precisa de atenção do coach quando há bloqueio ou risco. |
| `userConfirmed` | Verdadeiro apenas quando o usuário confirmou explicitamente. |
| `confirmationQuestion` | Pergunta exata feita ao usuário para confirmar o evento. |
| `confirmationAnswer` | Resposta usada para confirmar, corrigir ou descartar o evento. |
| `enrichment` | Dados complementares externos ou derivados, como clima, feriado, fuso e contexto local. |
| `impact.workout` | Tipo de adaptação permitida no treino. |
| `impact.diet` | Tipo de adaptação permitida na dieta. |
| `impact.push` | Tipo de ajuste permitido na comunicação ativa. |
| `impact.penalty` | Tipo de ajuste permitido em XP, cobrança e ausência. |
| `expiresAt` | Data limite para o evento deixar de influenciar o sistema. |
| `createdAt` | Data de criação do registro. |
| `updatedAt` | Última alteração do registro. |
| `surfacedAt` | Momento em que o evento apareceu ao usuário em chat, missão, dieta, card ou push. |
| `validatedAt` | Momento em que o evento foi validado após passar. |

---

## 3. Estados e Transições Permitidas

Cada evento contextual transita por estados lógicos rigorosos no backend. A máquina de estados existe para impedir chute, duplicação, sujeira eterna e cobrança cega.

### Estados Da Memória Proativa

1. `pending_confirmation`: O extrator identificou o evento, mas o usuário ainda não confirmou.
2. `confirmed`: O usuário confirmou a validade do evento.
3. `enriched`: O backend agregou metadados externos ou derivados.
4. `surfaced`: O evento foi inserido de forma orgânica em chat, missão, treino, dieta, card ou push.
5. `pending_validation`: A data do evento passou e o sistema precisa validar o que aconteceu.
6. `validated_happened`: O usuário confirmou que o evento ocorreu.
7. `validated_postponed`: O usuário informou que o evento foi adiado.
8. `discarded`: O evento foi cancelado, rejeitado ou descartado.
9. `expired`: O evento passou do limite de validade sem validação confiável.

### Tabela De Transições

| Estado atual | Evento | Próximo estado | Quem dispara | Observação |
|---|---|---|---|---|
| `pending_confirmation` | Usuário confirma | `confirmed` | Usuário | Só depois disso pode influenciar treino, dieta, push ou penalidade. |
| `pending_confirmation` | Usuário nega, corrige para irrelevante ou ignora até expirar | `discarded` | Usuário ou job | Não deve aparecer depois. |
| `confirmed` | Dados externos/contexto derivados adicionados | `enriched` | `event_enricher` | Enriquecimento não pode alterar o significado confirmado. |
| `confirmed` | Evento precisa aparecer para o usuário | `surfaced` | App, chat, missão, dieta ou push | Pode aparecer mesmo sem enrichment, se não depender de dados externos. |
| `enriched` | Evento precisa aparecer para o usuário | `surfaced` | App, chat, missão, dieta ou push | Preferível quando clima, fuso ou feriado importam. |
| `surfaced` | Data do evento passou | `pending_validation` | `event_validation_scheduler` | O sistema deve perguntar se aconteceu, foi adiado ou cancelado. |
| `pending_validation` | Usuário confirma que aconteceu | `validated_happened` | Usuário | Arquiva como histórico resolvido. |
| `pending_validation` | Usuário informa adiamento | `validated_postponed` | Usuário | Deve pedir ou registrar nova data antes de reativar influência. |
| `pending_validation` | Usuário cancela ou rejeita | `discarded` | Usuário | Cancela influência futura e remove da superfície. |
| `validated_postponed` | Nova data confirmada | `confirmed` | Usuário | Reprograma o mesmo evento. |
| `confirmed`/`enriched`/`surfaced` | Usuário cancela evento | `discarded` | Usuário | Cancela influência imediatamente. |
| Qualquer estado passado sem validação | Prazo de validação expirou | `expired` | `stale_event_cleaner` | Não deve continuar influenciando o sistema. |

### Regra Anti-Duplicação

Nunca criar evento duplicado se o usuário apenas corrigiu data, cidade ou horário. O backend deve atualizar o mesmo `ProactiveEvent`, preservando `id`, `rawText` quando útil, `updatedAt` e histórico de auditoria.

Exemplos:
- "Roma é quinta, não quarta" atualiza `dateStart`.
- "Na verdade é Milão" atualiza `locationCity`.
- "Só consigo às 07h, não às 06h" atualiza `timeWindow`.

---

## Cancelamentos e Ajustes no Meio do Ciclo

Se os planos do usuário mudarem no meio da semana, o sistema deve reagir imediatamente.

```txt
   [ Fluxo de Cancelamento no Meio do Ciclo ]

   Usuário informa: "Cancelei a viagem a Londres"
   ├── 1. Backend intercepta a intenção semântica
   ├── 2. Localiza a memória proativa correspondente
   ├── 3. Altera o status de "confirmed/enriched/surfaced" para "discarded"
   ├── 4. Remove filtros de adaptação de treino, dieta, clima e push
   └── 5. GUTO diz: "Entendido. Londres caiu da semana. Missão normalizada!"
```

Ao final do ciclo, a memória marcada como `discarded` está banida de questionamentos. O GUTO **nunca** perguntará ao usuário: *"E aí, Will, como foi Londres?"* caso a viagem tenha sido cancelada no meio do caminho. Perguntar sobre eventos cancelados demonstra desatenção técnica.

---

## Enriquecimento e Uso Contextual

Uma vez confirmada a memória, o backend pode enriquecer o dado e o GUTO o aplica silenciosamente de forma integrada:

- **Na terça-feira (dia anterior):**
  > *"Will, amanhã é tua viagem para Roma. Já vi que tem previsão de chuva por lá, então hoje a nossa missão vai ser forte e interna na academia, sem depender de rua. Preparado?"*
- **Na quarta-feira (no GUTO Online):**
  > *"Will, hoje você viaja, então o treino foi desenhado para ser curto e preciso. Vamos manter a consistência sem ego no final."*
- **Na quinta-feira (na dieta):**
  > *"Como você está em trânsito/Roma, selecionei refeições práticas e fáceis de encontrar em mercados locais de lá para você não perder os macros."*

Regras de aplicação:
- Viagem ou cidade temporária pode adaptar treino/dieta da semana, mas não troca `country`/`city` permanente da calibragem sem confirmação explícita.
- Dieta em viagem respeita o local informado para o evento e o campo **NÃO COMO** / `foodRestrictions`.
- Se treino ou dieta estiverem com `lockedByCoach: true`, a proatividade não sobrescreve o plano. Ela cria sinal de revisão ou sugere comportamento seguro.

---

## Validação Pós-Evento (O Fechamento)

No início do ciclo seguinte, o GUTO repassa as memórias pendentes de validação (`pending_validation`) para garantir que o histórico seja limpo e as pendências resolvidas.

### Caso 1: Aconteceu De Fato

- **GUTO:** *"Will, a viagem de Roma rolou tudo certo?"*
- **Usuário:** *"Sim, foi ótimo!"*
- **Backend:** Altera para `validated_happened` e arquiva como evento resolvido.

### Caso 2: Adiado

- **GUTO:** *"Will, a viagem de Roma rolou tudo certo?"*
- **Usuário:** *"Não, adiei para a semana que vem."*
- **Backend:** Altera para `validated_postponed`, solicita ou registra a nova data e reprograma o mesmo evento.
- **GUTO:** *"Fechado. Levo Roma para a semana que vem e ajusto a tua missão de hoje com base nisso."*

### Caso 3: Cancelado

- **GUTO:** *"Will, a viagem de Roma rolou tudo certo?"*
- **Usuário:** *"Não, cancelei."*
- **Backend:** Altera para `discarded`, remove influência futura e não pergunta novamente sobre Roma.

Essa etapa é o fechamento do ciclo. Evento confirmado que passou não pode ficar aberto para sempre.

---

## 4. Hierarquia de Prioridade

Quando sinais entram em conflito, a decisão do GUTO deve seguir esta ordem:

1. Segurança física / dor / patologia.
2. Plano bloqueado pelo coach.
3. Consentimento e regras legais.
4. Evento proativo confirmado.
5. Calibragem permanente.
6. Objetivo do usuário.
7. Preferências temporárias.
8. Sugestão do LLM.

Essa hierarquia impede que o modelo de linguagem tome decisões soltas contra regras de segurança, coach ou contexto confirmado.

Exemplos obrigatórios:
- Se há dor no joelho e treino pesado de perna: segurança vence. O GUTO reduz risco, sugere alternativa segura ou pede revisão.
- Se coach bloqueou treino: proatividade não sobrescreve, apenas sinaliza revisão.
- Se viagem confirmada entra em conflito com academia: treino muda para home/hotel ou missão curta, desde que não exista bloqueio do coach.
- Se evento é ambíguo: não altera treino/dieta.

---

## 5. Proatividade e Treino

A proatividade pode adaptar treino da semana/dia somente quando:
- evento está `confirmed` ou `enriched`;
- não existe `lockedByCoach` bloqueando alteração;
- adaptação respeita vídeo local;
- adaptação respeita filtro de patologia;
- adaptação não inventa exercício sem catálogo;
- adaptação não altera calibragem permanente sem confirmação explícita.

O GUTO pode ajustar a forma de cumprir a Missão, mas não pode criar um treino tecnicamente inválido. A proatividade deve operar dentro do catálogo, dos vídeos disponíveis e das restrições clínicas.

| Evento | Adaptação permitida | O que é proibido |
|---|---|---|
| Viagem confirmada | Trocar treino de academia por treino home/hotel, missão curta ou sessão sem equipamento, se houver catálogo e vídeos locais. | Alterar `city`/`country` permanente, inventar exercício sem vídeo, ignorar dor/patologia ou sobrescrever coach. |
| Treino em casa temporário | Usar exercícios cadastrados para casa, peso corporal, elástico ou equipamento declarado. | Assumir equipamento não informado ou criar treino fora do catálogo. |
| Semana corrida | Reduzir volume, priorizar consistência, criar missão mínima ou reagendar cobrança. | Cancelar semana inteira sem confirmação ou tratar rotina quebrada como abandono. |
| Apenas 20 minutos disponíveis | Gerar sessão curta com foco e segurança, respeitando objetivo e catálogo. | Entregar treino longo disfarçado, remover aquecimento essencial ou aumentar intensidade sem critério. |
| Dor temporária | Reduzir impacto, trocar padrões de movimento, pedir confirmação de dor e sinalizar coach quando necessário. | Forçar exercício que agrava dor, diagnosticar lesão ou ignorar patologia. |
| Academia fechada | Propor treino home/hotel, missão curta ou dia de recuperação ativo. | Penalizar como falta cega ou mandar usuário procurar qualquer academia sem contexto. |
| Cansaço acumulado | Ajustar para recuperação, menor volume ou sessão técnica. | Confundir fadiga com preguiça, aumentar cobrança agressiva ou manter treino pesado sem revisão. |

---

## 6. Proatividade e Dieta

A proatividade pode adaptar dieta somente como orientação contextual e prática. Ela não deve trocar prescrição permanente sem confirmação e sem respeitar o que já foi calibrado.

Deve respeitar:
- `foodRestrictions`;
- país/cidade temporários;
- objetivo;
- macros;
- `lockedByCoach`;
- diferença entre idioma e localização.

Idioma não é localização. Um usuário falando português na Itália pode precisar de sugestões de comida disponíveis na Itália, mantendo resposta em português. Um usuário em país temporário não mudou seu perfil permanente.

| Evento | Adaptação alimentar | Restrições obrigatórias |
|---|---|---|
| Viagem para outra cidade | Sugerir opções práticas disponíveis no local temporário e preservar macros. | Não alterar cidade permanente, não ignorar restrições alimentares e não trocar plano bloqueado pelo coach. |
| Dia inteiro fora de casa | Sugerir refeições transportáveis, mercado, restaurante simples ou montagem rápida. | Não exigir cozinha, balança ou preparo longo. |
| Casamento/festa | Orientar estratégia de escolha, proteína, hidratação e controle de excesso sem moralismo. | Não transformar festa em punição nem remover objetivo nutricional. |
| Aeroporto/trem | Sugerir opções prováveis e simples: proteína, fruta, iogurte quando permitido, sanduíche adequado, água. | Não assumir disponibilidade específica nem sugerir alimento proibido. |
| Usuário vegano | Manter proteína vegetal e opções compatíveis. | Não sugerir ovos, leite, carne, whey lácteo ou derivados incompatíveis. |
| Lactose em `foodRestrictions` | Remover leite, iogurte comum, queijos e whey com lactose. | Não sugerir item lácteo sem versão adequada. |
| Objetivo `fat_loss` | Preservar déficit, proteína, saciedade e escolhas práticas. | Não sugerir "liberado geral" por estar viajando. |
| Objetivo `muscle_gain` | Preservar calorias, proteína e refeições viáveis mesmo fora da rotina. | Não reduzir comida agressivamente por conveniência. |

---

## 7. Proatividade, Ausência, XP e Morte

Esta seção define integração futura. Não implementa a regra final de XP, penalidade ou morte, mas estabelece que esses módulos precisam consumir sinais proativos confirmados.

Regras:
- Evento confirmado pode suavizar cobrança.
- Evento confirmado pode alterar missão do dia.
- Evento confirmado pode evitar penalidade cega.
- Evento ambíguo não suspende cobrança.
- Ausência sem evento confirmado continua contando como risco.
- Viagem confirmada não significa "liberado para sumir".
- GUTO deve propor missão mínima quando a rotina quebra.
- Morte/lockdown é módulo próprio, mas precisa consumir sinais da proatividade.

| Situação | Penalidade | Cobrança | Observação |
|---|---|---|---|
| Usuário confirmou viagem sem academia | Pode ser suavizada ou revisada. | Deve cobrar missão mínima ou alternativa curta. | Não é falta cega, mas também não é licença para desaparecer. |
| Usuário disse "talvez eu viaje" | Não deve ser suspensa. | Cobrança normal ou pergunta curta de confirmação. | Evento ambíguo não altera regra. |
| Usuário sumiu 2 dias sem contexto | Conta como risco. | Cobrança ativa e progressiva, respeitando anti-spam. | Ausência sem memória confirmada continua relevante. |
| Usuário confirmou semana corrida | Pode ser ajustada. | Cobrança adaptada para consistência mínima. | GUTO deve propor missão realista. |
| Usuário cancelou evento | Volta à regra normal. | Não perguntar sobre evento cancelado. | Evento `discarded` não influencia mais XP/push/missão. |

---

## 8. Push e Anti-Spam

Push é canal, não essência da proatividade. Todo push precisa nascer de memória, estado, rotina ou ausência com motivo rastreável. Mensagem genérica sem contexto enfraquece o GUTO.

Tipos de push:
- `weekly_checkin_push`
- `mission_reminder_push`
- `absence_warning_push`
- `event_confirmation_push`
- `event_validation_push`
- `recovery_push`
- `diet_context_push`

Regras obrigatórias:
- Deve existir limite máximo diário por usuário.
- Deve existir cooldown entre pushes.
- Não mandar push se usuário já interagiu recentemente.
- Não repetir mensagem igual.
- Push deve usar `GutoMemory`.
- Push deve respeitar idioma.
- Push deve respeitar nome da dupla.
- Push deve ter motivo rastreável.
- Push não pode ser genérico.
- Se push falhar, app deve mostrar mensagem ao abrir.
- Usuário sem permissão de push ainda recebe proatividade in-app.

| Tipo de push | Quando dispara | Conteúdo | Limite | Fallback |
|---|---|---|---|---|
| `weekly_checkin_push` | Início da semana ou primeira janela útil sem contexto semanal. | Pergunta curta sobre rotina, viagem, horários e compromissos. | Uma tentativa por ciclo semanal, respeitando cooldown. | Card/chat ao abrir app. |
| `mission_reminder_push` | Missão pendente e janela útil aproximando. | Lembrete contextual com missão do dia. | Limitado por dia e cancelado se houve interação recente. | Banner in-app na missão. |
| `absence_warning_push` | Ausência detectada sem evento confirmado. | Cobrança ativa, direta e personalizada. | Progressivo, com cooldown e sem repetição literal. | Alerta no topo ao abrir. |
| `event_confirmation_push` | Evento extraído precisa de confirmação e usuário não respondeu no chat. | Pergunta sim/não curta sobre o evento. | Baixa frequência; nunca em sequência irritante. | Modal ou card de confirmação. |
| `event_validation_push` | Evento passou e precisa fechar ciclo. | Pergunta se aconteceu, adiou ou cancelou. | Uma janela por evento, com fallback in-app. | Card de validação no app. |
| `recovery_push` | Fadiga/dor confirmada ou missão de recuperação. | Chamada segura para recuperação ou ajuste. | Só quando há motivo físico/contextual. | Card na missão. |
| `diet_context_push` | Contexto alimentar confirmado antes de janela crítica. | Sugestão prática respeitando macros e restrições. | Sem spam alimentar; só em evento relevante. | Card na dieta. |

---

## 9. Endpoints e Jobs Esperados

Esta é uma arquitetura futura. Não é implementação. A Fase 4 deve usar esta seção como mapa de responsabilidades, entradas, saídas e riscos.

| Endpoint/job | Responsabilidade | Entrada | Saída | Risco |
|---|---|---|---|---|
| `POST /guto/proactivity/extract` | Extrair possível evento proativo de texto ou ação. | `userId`, texto, fonte, idioma, contexto atual. | Evento `pending_confirmation` ou nenhuma ação. | Salvar ambiguidade como verdade. |
| `POST /guto/proactivity/confirm` | Confirmar evento extraído. | `eventId`, resposta do usuário. | Evento `confirmed` atualizado. | Confirmar evento errado ou duplicado. |
| `POST /guto/proactivity/discard` | Descartar evento antes ou depois de confirmação. | `eventId`, motivo. | Evento `discarded`. | Continuar mostrando evento cancelado. |
| `POST /guto/proactivity/update` | Corrigir data, cidade, horário ou impacto mantendo o mesmo evento. | `eventId`, campos corrigidos. | Mesmo evento atualizado. | Criar duplicata. |
| `POST /guto/proactivity/validate` | Validar evento depois que passou. | `eventId`, aconteceu/adiou/cancelou, nova data se houver. | `validated_happened`, `validated_postponed` ou `discarded`. | Deixar evento aberto para sempre. |
| `POST /guto/proactivity/open-weekly` | Abrir coleta semanal resiliente. | `userId`, semana, timezone. | Pergunta semanal ou estado já existente. | Perguntar toda hora ou bloquear missão. |
| `POST /guto/proactivity/request-discard` | Solicitar confirmação de descarte quando a intenção não for totalmente clara. | `eventId`, texto do usuário. | Pergunta de descarte ou descarte confirmado. | Cancelar evento por frase ambígua. |
| `POST /guto/proactivity/cancel` | Cancelar evento confirmado por declaração explícita do usuário. | `eventId` ou texto localizável. | Evento `discarded` e efeitos removidos. | Não localizar o evento certo. |
| `GET /guto/proactive` | Retornar estado proativo ativo para app, chat, missão e dieta. | `userId`, data, contexto. | Lista de eventos relevantes e ações sugeridas. | Expor evento expirado, descartado ou de outro usuário. |
| `weekly_context_collector` | Detectar falta de contexto semanal e abrir check-in. | Usuários ativos, semana, timezone. | Evento/pergunta de check-in. | Spam ou pergunta fora de hora. |
| `absence_detector` | Detectar ausência com ou sem contexto confirmado. | Atividade, missões, eventos confirmados. | Sinal de cobrança ou ajuste. | Penalidade cega. |
| `event_enricher` | Adicionar clima, feriado, fuso e contexto local. | Eventos `confirmed`. | Eventos `enriched`. | Enriquecer com dados errados ou irrelevantes. |
| `event_surface_scheduler` | Decidir quando mostrar evento ao usuário. | Eventos ativos, calendário, missão. | `surfaced` via chat/card/push/dieta. | Mostrar tarde, cedo demais ou em excesso. |
| `event_validation_scheduler` | Mover eventos passados para validação. | Eventos `surfaced`/`confirmed` passados. | `pending_validation`. | Deixar evento aberto. |
| `push_dispatcher` | Enviar push com anti-spam e fallback. | Ações proativas, permissão, idioma, cooldown. | Push enviado ou fallback in-app. | Spam ou mensagem genérica. |
| `stale_event_cleaner` | Expirar eventos sem validação útil. | Eventos antigos ou sem resposta. | `expired`. | Apagar contexto útil cedo demais. |

---

## 10. UX Mobile e In-App

A proatividade aparece onde ela ajuda, não onde atrapalha:
- chat;
- missão;
- dieta;
- card contextual no topo;
- push;
- modal de confirmação, se necessário.

Regras:
- confirmação precisa ser rápida;
- não pode bloquear treino sem necessidade;
- não pode virar formulário longo;
- teclado não pode cobrir resposta;
- botões confirmar/descartar precisam estar acima da safe area;
- no iPhone, bottom sheet não pode ficar atrás do teclado.

| Momento | UI sugerida | Regra mobile | Risco |
|---|---|---|---|
| Extração no chat | Bolha curta com confirmar/descartar. | Respostas visíveis acima do teclado. | Transformar conversa em formulário. |
| Abertura semanal | Card contextual no topo ou pergunta curta no chat. | Não bloquear acesso à missão. | Irritar usuário ativo. |
| Missão do dia | Card pequeno explicando adaptação. | Deve caber em telas pequenas e respeitar safe area. | Ocultar treino principal. |
| Dieta contextual | Card na dieta com orientação prática. | Texto curto, sem scroll excessivo. | Sugerir alimento proibido ou fora do local. |
| Push recebido | Abrir app na área relacionada. | Deep link deve preservar contexto. | Levar para tela errada. |
| Validação pós-evento | Modal/bottom sheet com aconteceu/adiou/cancelou. | Botões acima da safe area e teclado não deve cobrir inputs. | Prender usuário em modal longo. |

---

## 11. Auditoria e Logs

A proatividade precisa ser auditável. Cada decisão que afeta treino, dieta, push, cobrança, XP ou coach deve deixar rastro claro.

Eventos obrigatórios:
- `proactive_event_extracted`
- `proactive_event_confirmed`
- `proactive_event_discarded`
- `proactive_event_enriched`
- `proactive_event_surfaced`
- `proactive_event_validated_happened`
- `proactive_event_validated_postponed`
- `proactive_push_sent`
- `proactive_push_failed`
- `proactive_event_expired`
- `proactive_coach_review_required`

Cada evento deve registrar:
- `userId`;
- `eventId`;
- `actor` (usuário, sistema, job, admin, coach quando aplicável);
- `timestamp`;
- `before/after` quando aplicável;
- motivo;
- idioma;
- fonte.

Logs não existem para vigiar o usuário. Eles existem para explicar por que o GUTO adaptou, cobrou, suavizou, pediu confirmação ou sinalizou revisão.

---

## 12. Testes Obrigatórios Da Fase 4

A Fase 4 não pode ser aprovada por feeling. Ela precisa provar as regras com testes backend, mobile e fluxo manual.

| Teste | Área | Obrigatório? | Prioridade |
|---|---|---|---|
| Evento ambíguo não salva. | Backend | Sim | Alta |
| Evento confirmado salva. | Backend | Sim | Alta |
| Correção de data atualiza o mesmo evento. | Backend | Sim | Alta |
| Evento cancelado não aparece depois. | Backend | Sim | Alta |
| Evento passado vira `pending_validation`. | Backend/job | Sim | Alta |
| Evento adiado vira `validated_postponed` e reprograma. | Backend/job | Sim | Alta |
| Viagem adapta treino sem alterar `city`/`country` permanente. | Backend/treino | Sim | Alta |
| `lockedByCoach` impede sobrescrita. | Backend/treino/dieta | Sim | Alta |
| `foodRestrictions` continuam respeitadas. | Backend/dieta | Sim | Alta |
| Dor/patologia tem prioridade. | Backend/treino | Sim | Alta |
| Push não duplica. | Backend/push | Sim | Alta |
| Ausência sem contexto gera cobrança. | Backend/XP | Sim | Alta |
| Ausência com evento confirmado gera cobrança ajustada. | Backend/XP | Sim | Alta |
| Idioma correto. | Backend/push/chat | Sim | Média |
| Sem push permission ainda mostra mensagem in-app. | Backend/mobile | Sim | Alta |
| Confirmação no chat. | Frontend/mobile | Sim | Alta |
| Descarte. | Frontend/mobile | Sim | Alta |
| Card contextual. | Frontend/mobile | Sim | Alta |
| Push/open app. | Frontend/mobile | Sim | Alta |
| Teclado no iPhone. | Frontend/mobile | Sim | Alta |
| Safe area. | Frontend/mobile | Sim | Alta |
| Reload mantém evento. | Frontend/mobile | Sim | Média |
| Evento cancelado some. | Frontend/mobile | Sim | Alta |

---

## 13. Critérios De Aprovação Da Fase 4

A Fase 4 só pode ser aprovada se:

- existe memória proativa real;
- estados funcionam;
- eventos confirmados influenciam treino/dieta;
- eventos ambíguos não salvam;
- evento cancelado não aparece;
- push não é genérico;
- anti-spam existe;
- ausência é detectada;
- XP/penalidade respeita contexto confirmado;
- `lockedByCoach` é respeitado;
- mobile funciona no iPhone;
- testes backend passam;
- teste manual no iPhone passa.

---

## 14. O Que Não Pode Acontecer

- Não transformar proatividade em chatbot.
- Não transformar proatividade em push motivacional genérico.
- Não alterar calibragem permanente sem confirmação.
- Não ignorar dor/patologia.
- Não ignorar `foodRestrictions`.
- Não sobrescrever coach.
- Não penalizar cegamente contexto confirmado.
- Não salvar evento ambíguo.
- Não duplicar evento corrigido.
- Não perguntar evento cancelado.
- Não mandar spam.
- Não depender só do LLM.
- Não deixar evento aberto para sempre.
- Não alterar treino/dieta bloqueados por `lockedByCoach`.
- Não usar localização temporária como mudança permanente de perfil.
- Não tratar viagem confirmada como autorização para sumir.
- Não criar push sem motivo rastreável.

---

## Fechamento Canônico

A proatividade do GUTO só é válida quando fecha o ciclo inteiro:

```txt
perguntar → entender → confirmar → salvar → enriquecer → usar → validar → encerrar
```

Se qualquer etapa for ignorada, o GUTO perde precisão. Se o sistema salva sem confirmação, ele chuta. Se adapta sem respeitar coach, patologia ou restrição alimentar, ele quebra confiança. Se manda push genérico, ele vira aplicativo comum. Se não valida depois, ele deixa sujeira no sistema.

O objetivo da Fase 4 é transformar esse ciclo em comportamento técnico real, sem avançar implementação antes de consolidar o contrato.
