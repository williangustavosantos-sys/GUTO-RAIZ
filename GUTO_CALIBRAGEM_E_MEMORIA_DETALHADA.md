# Calibragem e Memória Operacional do GUTO — Roteiro Detalhado de Engenharia

> **Documento canônico** da Calibragem Inicial, Alterações de Perfil e Engenharia de Memória (`GutoMemory`) do GUTO.
>
> **Natureza:** descreve o **GUTO finalizado — como tem que ser**. É a **fonte de verdade** da calibragem; treino, dieta, chat, GUTO Online, arena e painel **consomem** o que está aqui (não duplicam, não recalculam por conta própria). Onde o código atual diverge, ver **[Pontos de Atenção](#pontos-de-atenção-doc--código-atual)** no fim.
>
> **Documentos relacionados:** `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` (espinha) · `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` · `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` · `GUTO_CHAT_E_CEREBRO_DETALHADA.md` · `GUTO_PAINEL_ADMIN_CANONICO_V1.md`.

---

## O Que É A Calibragem

A calibragem é a espinha dorsal e a fundação da **memória operacional** do GUTO. Ela não funciona como um cadastro ou formulário estático comum de aplicativos fitness. 

Ela representa o momento em que o GUTO entende as variáveis biológicas, físicas, alimentares, ambientais e geográficas do usuário. A partir desse mapeamento, o backend (cérebro) passa a ditar as ações personalizadas do chat, treino, dieta, GUTO Online e ciclos de proatividade.

Se os dados de calibragem falharem ou forem dessincronizados, todo o ecossistema do GUTO quebra:
- Um usuário com joelho lesionado receberia treinos inadequados, violando a integridade e segurança física.
- Um usuário intolerante a lactose receberia derivados de leite na sua dieta semanal, gerando uma falha sanitária grave.

---

## Fluxo Correto Antes da Calibragem

A calibragem não começa na primeira tela do aplicativo. O fluxo inicial correto é:

```txt
Vídeo / Intro
  └── Idioma
        └── Login / Convite
              └── Nome soberano da dupla
                    └── Tela de Calibragem física, alimentar e geográfica
                          └── Pacto
                                └── Sistema principal
```

Idioma e nome entram na memória inicial do GUTO, mas **não são campos da tela de calibragem física/alimentar**. Essa separação é obrigatória para evitar que agentes ou implementações futuras tentem colocar idioma e nome dentro da mesma aba/formulário da calibragem.

### Campos de Contexto Inicial Fora da Tela de Calibragem

```txt
idioma ─────> selectedLanguage (pt-BR, en-US, it-IT)
nome ───────> name (Soberano, confirma a identidade da dupla GUTO & [Nome])
```

- **Idioma:** É escolhido na segunda página do app, logo depois da experiência inicial/vídeo. Ele define o idioma de toda a experiência: onboarding, botões, chat, treino, dieta, arena, configurações, erros e voz quando disponível.
- **Nome:** É definido depois do login/convite, na etapa de nome soberano. Ele confirma a identidade da dupla e não pode ser sobrescrito automaticamente por e-mail, convite, nome do coach ou cadastro administrativo.

---

## Campos Ativos na Tela de Calibragem do App

A tela de calibragem do aplicativo consolida exatamente as seguintes variáveis:

```txt
idade ──────────────────> userAge (Inteiro, 14 a 99 anos)
sexo ───────────────────> biologicalSex (Mapeado rigidamente para "male" ou "female")
nível de treino ────────> trainingLevel & trainingStatus (beginner, returning, consistent, advanced)
objetivo ───────────────> trainingGoal (consistency, fat_loss, muscle_gain, conditioning, mobility_health)
local de treino ────────> preferredTrainingLocation (gym, home, park, mixed)
dor ou limitação ───────> trainingPathology & trainingLimitations (Texto livre/Semântica)
altura ─────────────────> heightCm (Inteiro, 100 a 250 cm)
peso ───────────────────> weightKg (Decimal, 30 a 300 kg)
país ───────────────────> country (String livre para alimentação local; ex: "Itália")
cidade ─────────────────> city (String livre para previsão climática e proatividade; ex: "Roma")
NÃO COMO ───────────────> foodRestrictions (Campo único de restrições alimentares)
```

### Campos Excluídos da Calibragem do App (Do Not Include)
- **Idioma:** Não entra na tela de calibragem. Ele é definido antes, na página de idioma, e apenas acompanha a memória.
- **Nome:** Não entra na tela de calibragem. Ele é definido antes, após login/convite, na página de nome soberano.
- **Sexo "Prefiro não informar":** Desabilitado. O sistema nutricional e metabólico do backend exige obrigatoriamente a base biológica binária (`male` ou `female`) para cálculo metabólico de macronutrientes.
- **Campos separados de Intolerância Alimentar:** Intolerâncias, alergias e preferências éticas (veganismo) são mesclados de forma simplificada no campo único **"NÃO COMO"**.
- **Telefone:** Informação essencial para cadastro comercial de empresa/responsável e controle operacional do Admin/Coach no painel. Não faz parte da calibragem do aluno, das configurações do aluno, da memória `GutoMemory` do aluno nem de alterações via Chat no app do usuário.
- **Histórico recente de atividade física:** Não é perguntado como campo inicial. O app começa com o nível declarado em `trainingLevel`; o histórico real passa a ser construído depois pelo backend com treinos concluídos, feedbacks, adaptações e faltas.

---

## Fonte Única de Verdade da Calibragem

`GutoMemory` no backend é a fonte única de verdade da calibragem operacional do aluno.

Não pode existir uma calibragem paralela no aplicativo, outra no Chat, outra no painel e outra nos módulos de treino ou dieta. Todos os fluxos abaixo precisam ler e escrever na mesma memória persistida:

```txt
Idioma inicial ──────────┐
Nome soberano ───────────┤
Calibragem inicial ──────┤
Configurações do app ────┤
Chat do GUTO ────────────┼──> GutoMemory do aluno ───> Chat, Treino, Dieta, GUTO Online, Arena e Painel
Painel Admin/Coach ──────┘
```

Qualquer tela ou serviço que renderize dados de calibragem deve partir da memória atual persistida no backend. Estados locais do frontend são apenas rascunhos temporários antes da gravação.

### Regras de Sincronismo Obrigatório

- **Idioma vem antes:** O idioma é definido logo depois da experiência inicial/vídeo e antes da etapa de nome/calibragem.
- **Nome vem depois do login:** O nome soberano da dupla é definido após login/convite e antes da tela de calibragem.
- **Calibragem cria a ficha física/alimentar:** A primeira calibragem física, alimentar e geográfica nasce depois do nome soberano.
- **Configurações alteram:** O aluno pode atualizar os mesmos campos de calibragem nas configurações do app. Após salvar, o painel Admin/Coach precisa mostrar o novo valor.
- **Chat altera com controle:** O Chat pode solicitar alteração de campos permitidos, mas dados sensíveis ou ambíguos exigem confirmação. O GUTO só pode dizer "anotado" se a gravação no backend for concluída com sucesso.
- **Painel corrige com validação:** Admin/Coach pode visualizar e corrigir calibragem do aluno pelo painel, mas apenas por campos controlados e validados. O painel nunca edita `GutoMemory` como JSON cru.
- **App reflete o painel:** Se Coach/Admin altera peso, objetivo, local, dor, cidade ou "NÃO COMO" no painel, o app do aluno precisa refletir essa alteração na próxima leitura/sincronização.
- **Painel reflete o app:** Se o aluno altera dados nas configurações ou pelo Chat, o painel precisa exibir o dado atualizado.
- **Último dado salvo vence:** Quando houver conflito, o valor persistido mais recente no backend vence. A auditoria precisa guardar origem, operador e campos alterados.

### Origem de Alteração

Toda mutação de calibragem precisa registrar a origem operacional:

```txt
source = onboarding
source = app_settings
source = chat
source = coach_panel
source = admin_panel
```

Para alterações via painel, o backend também deve registrar:

```txt
operatorId   = id do Admin ou Coach
operatorRole = super_admin | admin | coach
teamId       = empresa/time do aluno
coachId      = coach vinculado ao aluno
fieldsChanged = lista dos campos alterados
before       = snapshot dos valores anteriores
after        = snapshot dos novos valores
```

Implementações legadas que editem calibragem por patch genérico devem ser tratadas como transitórias. O contrato correto é um endpoint validado de calibragem, com payload tipado, ranges oficiais e auditoria de antes/depois.

---

## Detalhamento de Atribuição e Destino de Dados

### 1. Idioma (`selectedLanguage`)
- **Opções:** `pt-BR`, `en-US`, `it-IT`.
- **Destino técnico:** Salvo no `localStorage`, atualizado no perfil local do app e gravado como `language` no banco de dados através de `/guto/memory`.
- **Aplicação:** Domina 100% da interface do aplicativo móvel, menus de dieta, descrições de treinos, mensagens de erros de sistema, e-mails e as diretrizes do chat com o LLM.

### 2. Nome (`name`)
- **Impacto:** Constrói a identidade soberana da dupla `GUTO & [Nome]`.
- **Destino técnico:** Gravado em `profile.userName` e `memory.name`.
- **Aplicação:** Exibido em destaque nos cabeçalhos, notificações de push, ranking da Arena, Percurso e na condução das frases amigáveis e diretas do chat.

### 3. Idade (`userAge`)
- **Validação:** 14 a 99.
- **Destino técnico:** `memory.userAge` e profile do chat.
- **Aplicação:** Ajusta os limites de segurança fisiológicos na geração de treinos (regras de volume articular) e calcula a taxa metabólica basal para a prescrição calórica diária.

### 4. Sexo Biológico (`biologicalSex`)
- **Mapeamento:** `Homem ➔ male`, `Mulher ➔ female`.
- **Destino técnico:** `memory.biologicalSex`.
- **Aplicação:** Fundamental para o cálculo da equação de distribuição metabólica dos macronutrientes da aba Dieta.

### 5. Nível de Treino (`trainingLevel`)
- **Opções:** `beginner` (iniciante), `returning` (voltando), `consistent` (consistente), `advanced` (avançado).
- **Destino técnico:** Grava `memory.trainingLevel` e iguala automaticamente a variável de comportamento `memory.trainingStatus = trainingLevel`.
- **Aplicação:** Determina o volume de séries por grupo muscular, tempo de descanso sugerido e o nível de complexidade dos exercícios listados na Missão.

### 6. Objetivo (`trainingGoal`)
- **Opções:** `consistency` (consistência), `fat_loss` (perder gordura), `muscle_gain` (ganhar massa), `conditioning` (condicionamento), `mobility_health` (mobilidade/saúde).
- **Destino técnico:** `memory.trainingGoal`.
- **Aplicação:** Determina se a aba Dieta prescreve superávit calórico (ganho de massa) ou déficit calórico (perda de gordura) e molda a prioridade de treinos aeróbicos ou resistidos na Missão.

### 7. Local de Treino (`preferredTrainingLocation`)
- **Opções:** `gym` (academia), `home` (casa), `park` (parque), `mixed` (misto).
- **Destino técnico:** `memory.preferredTrainingLocation`.
- **Aplicação:** Filtro do catálogo de exercícios. Se `home`, remove aparelhos e foca em calistenia e pesos livres. Se ausente, impede o GUTO de montar o treino do dia.

### 8. Dor, Patologia ou Limitação (`trainingPathology`)
- **Validação:** Tratamento de texto com análise semântica.
- **Destino técnico:** `memory.trainingPathology` e `memory.trainingLimitations`.
- **Aplicação:** Funciona como gatekeeper de segurança física. Bane do treino do dia movimentos que gerem estresse na região afetada (ex: joelho direito sensível bloqueia cadeira extensora pesada ou saltos).
- *Regra de Ambiguidade:* Se o usuário escrever dados ambíguos (ex: "tenho um troço nas pernas"), o backend aciona uma rotina de esclarecimento, forçando o GUTO a perguntar antes de prosseguir com a montagem do treino:
  > *"Não vou chutar. Esse troço na perna é uma dor articular, lesão muscular ou só cansaço do último treino?"*

### 9. Altura (`heightCm`) e Peso (`weightKg`)
- **Validação:** Altura de 100 a 250 cm; Peso de 30 a 300 kg.
- **Destino técnico:** `memory.heightCm` e `memory.weightKg`.
- **Aplicação:** Variáveis matemáticas diretas de cálculo calórico. Atualizações de peso recalculam dinamicamente a Dieta da semana.

### 10. País (`country`) e Cidade (`city`)
- **Impacto:** Localização física do usuário.
- **Destino técnico:** `memory.country` e `memory.city`.
- **Aplicação:** Desacoplamento de Idioma. Se o idioma for português mas o país for Itália, a Dieta sugere ingredientes locais italianos e a Proatividade contextualiza feriados e previsão do tempo de Roma ou Milão. Serviços externos de clima ou contexto local são auxiliares: se falharem, não podem bloquear o aplicativo.

### 11. Campo Único "NÃO COMO" (`foodRestrictions`)
- **Impacto:** Agrupador de todas as restrições, intolerâncias e alergias do aluno.
- **Destino técnico:** `memory.foodRestrictions` e `memory.resolvedFields.foodRestriction`.
- **Aplicação:** Exclui de forma absoluta ingredientes intolerados (ex: lactose, glúten, frutos do mar) da aba Dieta e das opções de substituições.
- *Regra Crítica Semântica:* Se o usuário preencher "lactose", iogurtes e leites comuns estão proibidos de aparecer nas refeições. O sistema usa interpretação semântica para diferenciar restrições alimentares de queixas físicas em outros idiomas (ex: descarta "nessun dolore" como restrição).

---

## Engenharia de Alterações e Sincronismo

Toda alteração de dados após o onboarding deve persistir imediatamente no backend. Isso vale para Configurações do app, Chat do GUTO e Painel Admin/Coach. Não é permitido simular mudanças no frontend sem gravação de banco de dados comprovada.

```txt
              [ Fluxo de Alteração de Dados ]
  
  CONFIGURAÇÕES DO APP          CHAT DO GUTO                 PAINEL ADMIN/COACH
  ┌────────────────────┐        ┌────────────────────┐       ┌────────────────────┐
  │ Aluno edita campo  │        │ Aluno informa dado │       │ Operador corrige   │
  │ nas configurações  │        │ em linguagem livre │       │ campo validado     │
  └─────────┬──────────┘        └─────────┬──────────┘       └─────────┬──────────┘
            │                             │                            │
            ▼                             ▼                            ▼
  ┌────────────────────┐        ┌────────────────────┐       ┌────────────────────┐
  │ Validação de tipo  │        │ Intenção, contexto │       │ Permissão por role │
  │ e ranges oficiais  │        │ e confirmação      │       │ teamId e coachId   │
  └─────────┬──────────┘        └─────────┬──────────┘       └─────────┬──────────┘
            │                             │                            │
            └───────────────┬─────────────┴──────────────┬─────────────┘
                            │                            │
                            ▼                            ▼
                 ┌────────────────────┐       ┌────────────────────┐
                 │ Grava GutoMemory   │       │ Registra auditoria │
                 │ no backend         │       │ before/after       │
                 └─────────┬──────────┘       └─────────┬──────────┘
                           │                            │
                           └────────────┬───────────────┘
                                        ▼
                          ┌────────────────────────────┐
                          │ Próximo Chat, Treino,      │
                          │ Dieta, Painel e App leem   │
                          │ a mesma memória atualizada │
                          └────────────────────────────┘
```

### Campos Permitidos Por Canal

| Campo | Onboarding | Configurações App | Chat | Painel Admin/Coach |
| --- | --- | --- | --- | --- |
| Idioma | Sim | Sim | Sim, com confirmação | Visualização e suporte operacional |
| Nome soberano | Sim | Sim | Sim, com confirmação | Não sobrescreve nome confirmado pelo aluno |
| Idade | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Sexo biológico | Sim | Sim | Não alterar casualmente por chat | Sim, campo validado |
| Nível de treino | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Objetivo | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Local de treino | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Dor/patologia/limitação | Sim | Sim | Sim, se claro; pergunta se ambíguo | Sim, campo validado |
| Altura | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Peso | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| País | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| Cidade | Sim | Sim | Sim, com confirmação | Sim, campo validado |
| NÃO COMO | Sim | Sim | Sim, se claro; pergunta se ambíguo | Sim, campo único validado |
| Telefone | Não | Não | Não | Somente cadastro comercial de empresa/responsável, fora de `GutoMemory` |

### Impacto Direto em Treino e Dieta

Treino e dieta são consumidores da calibragem, não formulários independentes.

- **Treino usa:** idade, nível, objetivo, local de treino, dor/patologia/limitação, histórico de treino validado e bloqueios do Coach.
- **Dieta usa:** idade, sexo biológico, altura, peso, objetivo, país, cidade e campo único "NÃO COMO". O idioma entra apenas para traduzir textos, voz e rótulos; ele não escolhe alimentos.
- **GUTO Online usa:** plano oficial atual, local, limitação física, idioma e contexto de segurança.
- **Painel usa:** os mesmos campos para exibir ficha biológica, risco operacional, filas de revisão e decisões do Coach.

Quando um campo de calibragem muda, os planos derivados precisam respeitar o novo valor:

- Se `weightKg`, `heightCm`, `userAge`, `biologicalSex` ou `trainingGoal` mudarem, a próxima dieta deve ser recalculada ou marcada para revisão.
- Se `preferredTrainingLocation`, `trainingLevel`, `trainingGoal` ou `trainingPathology` mudarem, o próximo treino deve ser recalculado ou marcado para revisão.
- Se `foodRestrictions` mudar, qualquer dieta atual com alimento proibido precisa ser marcada como inválida ou pendente de revisão.
- Se houver treino ou dieta com `lockedByCoach: true`, o GUTO não pode sobrescrever automaticamente o plano. Ele pode sinalizar que a calibragem mudou e pedir revisão/liberação do Coach.

---

## Cenário Completo de Payload Integrado

Exemplo de persistência de um usuário calibrado com sucesso:

```json
{
  "userId": "user_will_777",
  "name": "Will",
  "language": "pt-BR",
  "userAge": 35,
  "biologicalSex": "male",
  "trainingLevel": "returning",
  "trainingStatus": "returning",
  "trainingGoal": "muscle_gain",
  "preferredTrainingLocation": "gym",
  "trainingPathology": "joelho direito sensível",
  "trainingLimitations": "joelho direito sensível",
  "heightCm": 178,
  "weightKg": 82,
  "country": "Itália",
  "city": "Roma",
  "foodRestrictions": "lactose"
}
```

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Opções Incompatíveis:** Permitir o avanço da calibragem se o campo sexo biológico estiver nulo ou marcado com termos indefinidos que impeçam as fórmulas de nutrição e metabolismo do backend de operar.
- **Campos Separados de Comida:** Expor formulários complexos segregando alergias de intolerâncias. A interface móvel foca estritamente em um campo unificado chamado **"NÃO COMO"**.
- **Duplicidade de Perguntas:** Fazer o GUTO questionar no Chat dados que já estão calibrados e salvos na memória operacional.
- **Mudar sem Salvar:** O GUTO responder no chat confirmando uma mudança física ("Anotado, Will!") se a requisição de gravação de memória falhar ou não for realizada no backend de fato.
- **Mapear Errado na Dieta:** Ignorar as restrições declaradas do campo "NÃO COMO" na montagem ou na oferta de ingredientes alternativos de substituição de refeições.
- **Memórias Paralelas:** Criar um estado separado de calibragem no painel, no Chat, no treino ou na dieta que não escreva no `GutoMemory` persistido.
- **Painel Editando JSON Cru:** Permitir que Admin ou Coach edite a calibragem como texto JSON livre, sem campos controlados, validação e auditoria.
- **Alteração Invisível:** Coach/Admin alterar calibragem no painel e o app do aluno continuar mostrando valor antigo depois da sincronização.
- **Telefone no Aluno:** Salvar telefone dentro da calibragem ou memória do aluno. Telefone pertence a cadastro comercial de empresa/responsável, nunca ao `GutoMemory` do aluno.
- **Sobrescrever Plano Travado:** Recalcular treino ou dieta automaticamente por mudança de calibragem quando o plano atual estiver bloqueado por Coach (`lockedByCoach: true`) sem revisão/liberação.

---

## Pontos de Atenção (doc × código atual)

> Sinalização doc × `guto-app-v0`/`guto-backend`. A calibragem é o elo mais maduro do GUTO (validado em teste real em 2026-05-20), então a maioria está **alinhada**. Nada aqui é "doc errado" — são lacunas de robustez de backend, com alvo claro.

| # | Tema | Doc (alvo / GUTO finalizado) | Código atual | Tipo |
|---|---|---|---|---|
| C-1 | Campos coletados (idade, sexo, peso, altura, nível, objetivo, local, dor, país, cidade, NÃO COMO) | Todos na `GutoMemory`, exigidos no onboarding | Todos presentes e mapeados (`calibration-screen` + backend) | ✅ alinhado |
| C-2 | Telefone fora da memória do aluno | Proibido em GutoMemory/calibragem/settings/chat | Backend remove `phone` da memória (teste `guto-memory-phone`) | ✅ alinhado |
| C-3 | Sexo biológico binário | Só `male`/`female` (sem "prefiro não informar") | `normalizeBiologicalSex` aceita só female/male (testado) | ✅ alinhado |
| C-4 | Campo único NÃO COMO | Um só `foodRestrictions`; sem campo separado de intolerância | Único campo; sem segregação | ✅ alinhado |
| C-5 | Endpoint validado de calibragem por campo | Rota tipada, ranges oficiais, `source`, snapshot before/after | Hoje via `PATCH /admin/students/:id` com objeto `calibration` (sem rota dedicada validada) | **[implementar]** |
| C-6 | Origem da alteração (`source`: onboarding/app_settings/chat/coach_panel/admin_panel) | Toda mutação registra origem + operador | Trilha de auditoria existe; não confirmado que os 5 valores são gravados em todos os caminhos | **[implementar]** (parcial) |
| C-7 | Chat altera calibragem com confirmação | Campos permitidos alteráveis por chat, com confirmação; "anotado" só se persistiu | Chat conservador por design (prompt instrui a não afirmar alteração); persiste subconjunto | **[decisão futura]** — definir matriz campo×canal efetiva (sem urgência) |

> **Decisões herdadas (aplicadas em todo o projeto):** telefone é **opcional/comercial** e nunca entra na `GutoMemory`; alterações sensíveis de calibragem **invalidam** treino/dieta (recalcular ou marcar revisão), exceto quando `lockedByCoach`.
