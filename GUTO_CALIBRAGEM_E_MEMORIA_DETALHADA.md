# Calibragem e Memória Operacional do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação da Calibragem Inicial, Alterações de Perfil e Engenharia de Memória do GUTO.

---

## O Que É A Calibragem

A calibragem é a espinha dorsal e a fundação da **memória operacional** do GUTO. Ela não funciona como um cadastro ou formulário estático comum de aplicativos fitness. 

Ela representa o momento em que o GUTO entende as variáveis biológicas, físicas, alimentares, ambientais e geográficas do usuário. A partir desse mapeamento, o backend (cérebro) passa a ditar as ações personalizadas do chat, treino, dieta, GUTO Online e ciclos de proatividade.

Se os dados de calibragem falharem ou forem dessincronizados, todo o ecossistema do GUTO quebra:
- Um usuário com joelho lesionado receberia treinos inadequados, violando a integridade e segurança física.
- Um usuário intolerante a lactose receberia derivados de leite na sua dieta semanal, gerando uma falha sanitária grave.

---

## Campos Ativos na Calibragem do App

A calibragem do aplicativo consolida exatamente as seguintes variáveis:

```txt
idioma ─────────────────> selectedLanguage (pt-BR, en-US, it-IT)
nome ───────────────────> name (Soberano, confirma a identidade da dupla)
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
- **Sexo "Prefiro não informar":** Desabilitado. O sistema nutricional e metabólico do backend exige obrigatoriamente a base biológica binária (`male` ou `female`) para cálculo metabólico de macronutrientes.
- **Campos separados de Intolerância Alimentar:** Intolerâncias, alergias e preferências éticas (veganismo) são mesclados de forma simplificada no campo único **"NÃO COMO"**.
- **Telefone:** Informação puramente opcional de controle comercial do Admin no painel desktop, não fazendo parte das etapas do onboarding móvel.
- **Histórico recente de atividade física:** Simplificado na escolha do campo `trainingLevel` (ex: "Voltando agora" mapeia `returning`).

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
- **Aplicação:** Desacoplamento de Idioma. Se o idioma for português mas o país for Itália, a Dieta sugere ingredientes locais italianos e a Proatividade contextualiza feriados e previsão do tempo de Roma ou Milão.

### 11. Campo Único "NÃO COMO" (`foodRestrictions`)
- **Impacto:** Agrupador de todas as restrições, intolerâncias e alergias do aluno.
- **Destino técnico:** `memory.foodRestrictions` e `memory.resolvedFields.foodRestriction`.
- **Aplicação:** Exclui de forma absoluta ingredientes intolerados (ex: lactose, glúten, frutos do mar) da aba Dieta e das opções de substituições.
- *Regra Crítica Semântica:* Se o usuário preencher "lactose", iogurtes e leites comuns estão proibidos de aparecer nas refeições. O sistema usa interpretação semântica para diferenciar restrições alimentares de queixas físicas em outros idiomas (ex: descarta "nessun dolore" como restrição).

---

## Engenharia de Alterações e Sincronismo

Toda alteração de dados após o onboarding (seja por Configurações ou pelo Chat) deve persistir imediatamente no backend. Não é permitido simular mudanças no frontend sem gravação de banco de dados comprovada.

```txt
              [ Fluxo de Alteração de Dados ]
  
  Opção A: CONFIGURAÇÕES                  Opção B: CHAT DO GUTO
  ┌────────────────────────┐              ┌────────────────────────┐
  │ Usuário edita campo    │              │ Usuário escreve no chat│
  │ (ex: Peso de 82➔78 kg) │              │ ("Estou com 78 kg")    │
  └───────────┬────────────┘              └───────────┬────────────┘
              │                                       │
              ▼                                       ▼
  ┌────────────────────────┐              ┌────────────────────────┐
  │ Validação de ranges    │              │ Análise de Intenção e  │
  │ (30 - 300 kg) no Front │              │ confirmação se ambíguo │
  └───────────┬────────────┘              └───────────┬────────────┘
              │                                       │
              └───────────────────┬───────────────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ POST /guto/memory      │
                     │ (Gravação no Backend)  │
                     └────────────┬───────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │ Memória Atualizada!    │
                     │ Próximo treino/dieta   │
                     │ herda o peso de 78 kg. │
                     └────────────────────────┘
```

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
