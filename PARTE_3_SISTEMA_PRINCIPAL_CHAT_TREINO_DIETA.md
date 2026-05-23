# Parte 3 — Sistema Principal, Chat, Missão e Dieta

> Documento de fluxo das abas interativas centrais e do motor de inteligência do GUTO. Leia depois da `Parte 2`.

## Estado Do Documento

Este documento define como o sistema principal do aluno deve se comportar depois do onboarding. Ele não substitui os documentos especializados de calibragem, treino, dieta, arena, XP ou painel; ele mostra como essas partes conversam entre si dentro do app.

Antes de alterar código com base nesta parte, o agente deve ler também:
- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`
- `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md`
- `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md`
- `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`

Regras fixas desta parte:
- O chat pode propor atualização de memória somente por campos controlados e validados.
- Telefone nunca é campo do aluno no chat, na calibragem, nas configurações ou em `GutoMemory`.
- Treino e dieta são planos oficiais do backend; o frontend não inventa treino nem dieta.
- Se coach bloqueou treino ou dieta com `lockedByCoach`, o GUTO não pode sobrescrever automaticamente.
- Se o backend não salvar uma alteração, o GUTO não pode responder como se tivesse salvado.

## O Que Essa Parte Representa

O Sistema Principal é onde a relação diária entre o usuário e o GUTO ganha vida através de abas altamente integradas. Nenhuma aba opera como um silo isolado. Se o chat aprende algo novo, a dieta e a missão mudam. Se a missão muda, a validação de treino herda esse novo plano. Esta parte do sistema sustenta três promessas principais:

1. **O Chat como Contrato Estruturado**: o chat não é uma interface de texto livre que apenas joga palavras na tela. Cada interação gera um contrato de turno com regras de segurança rígidas e persistência comprovada.
2. **Coerência Absoluta do Treino (Missão)**: o treino diário do usuário é gerado pelo backend (ou coach) com base nos parâmetros de calibragem e possui suporte de vídeos locais válidos e dúvidas contextuais inteligentes.
3. **Nutrição Respeitosa (Dieta)**: uma dieta integrada que herda toda a calibragem física, localização geográfica e restrições médicas reais do usuário, sem perguntas repetitivas ou falhas sanitárias.

---

## 8) Sistema Principal e Conexão de Abas

O aplicativo principal é dividido em abas que mostram diferentes lados da mesma verdade (a memória do backend).

```txt
       [ Memória do Backend / Cérebro ]
         /           |             \
  ( Chat/GUTO )  ( Missão )     ( Dieta )
        \            |             /
     [ Validação -> XP -> Arena/Percurso/Evoluir ]
```

- Se o usuário valida o treino na aba **Missão**, o XP é creditado e atualiza imediatamente a **Arena**, o **Percurso** e a evolução do avatar na aba **Evoluir**.
- Se o **Coach** atualiza a dieta no Painel, a aba **Dieta** é atualizada no celular na mesma hora.
- Se o usuário comunica uma limitação articular no **Chat**, a aba **Missão** do próximo dia se adapta a essa limitação.
- Se uma alteração de memória impactar treino ou dieta, o backend precisa marcar o plano afetado para revisão, regeneração ou confirmação. A atualização não pode acontecer silenciosamente se existir bloqueio manual do coach.

---

## 9) Aba GUTO / Chat

### O que é
A aba GUTO é a central operacional e o portal de diálogo da dupla. O aluno fala em linguagem natural (gírias, erros gramaticais ou mistura de idiomas) e o GUTO conduz.

### O Contrato de Turno
Cada mensagem enviada pelo usuário ao backend passa por uma esteira de processamento que une:
- Memória ativa do usuário (calibragem, histórico de treino, limitações).
- Contexto da semana atual (metas, viagens).
- IA (LLM com instruções de tom e personalidade).
- Regras de segurança (gates fechados que impedem a IA de tomar decisões médicas ou gerar treinos inadequados).

A resposta enviada pelo backend ao frontend não é apenas um bloco de texto. É um objeto JSON estruturado (contrato) que contém:
- `speech`: a fala direta e curta do GUTO no idioma do usuário.
- `action`: comando para o aplicativo realizar (ex: abrir configurações, abrir GUTO Online, alternar aba, disparar proatividade).
- `memoryPatch`: correções ou adições que devem ser persistidas na memória do usuário.
- `workoutPlan`: atualização ou troca de treino no dia se o usuário alegar dor/limitação.
- `expectedResponse`: sugestões de botões rápidos para o usuário tocar em seguida, reduzindo esforço de digitação.
- `avatarEmotion`: a emoção visual do avatar correspondente à fala (ex: orgulhoso, sério, motivado, neutro).

### Regras Críticas
- **Fidelidade à Persistência**: se o GUTO responde ao usuário "salvei que você vai viajar" ou "ajustei seu treino", os dados **precisam** ter sido salvos de fato no backend. Não é permitido que o GUTO use falas de simulação sem que a persistência real tenha acontecido. Se houver falha de rede/sistema, o fallback deve relatar honestamente que não conseguiu salvar.
- **Campos Permitidos**: o chat pode corrigir dados como dor/limitação, local de treino, cidade, país, peso, restrições alimentares e contexto temporal quando houver confirmação. Ele não pode salvar telefone na memória do aluno.
- **Ambiguidade Pergunta, Não Salva**: se o usuário escrever algo que pode significar duas coisas, o GUTO deve perguntar antes de alterar memória. Exemplo: "não como muito leite" não pode virar automaticamente intolerância severa sem confirmação.
- **NÃO COMO É Campo Único**: intolerância, alergia, restrição, alimento proibido e preferência alimentar vivem no mesmo campo operacional de restrição alimentar. Não existe campo separado de intolerância na experiência do aluno.
- **Planos Bloqueados Pelo Coach**: se o `memoryPatch` exigir mudança de treino ou dieta, mas o plano atual está com `lockedByCoach`, o GUTO registra o sinal e pede revisão/confirmacao do coach. Ele não sobrescreve o plano manual.
- **Sem Determinismo Frágil**: o chat não deve depender de palavras soltas para decidir intenção. A interpretação precisa considerar frase, idioma, negação e contexto.

---

## 10) Aba Missão (Treino do Dia)

### O que é
A tela que exibe os exercícios, séries, repetições, tempos e cargas planejados para o dia atual.

### Como o Treino é Construído
O treino nasce exclusivamente do backend (via regras estruturadas alimentadas por IA) ou do planejamento manual bloqueado pelo Coach no painel. O frontend é estritamente um leitor desse plano e não cria treinos por conta própria.

### Parâmetros de Coerência do Treino
- **Calibragem**: respeita idade, sexo biológico, nível e objetivo.
- **Local**: se o local ativo for "home", o treino não pode listar exercícios que exijam máquinas de academia.
- **Segurança Física (Dores e Limitações)**: exercícios que causem impacto ou piorem patologias informadas na calibragem são filtrados e banidos do plano.
- **Catálogo de Mídias Locais**: cada exercício precisa corresponder a um vídeo local (em `/public/exercise/visuals/`) demonstrando a execução correta de até 15 segundos. Se o exercício não possui vídeo validado fisicamente na pasta, ele está impedido de aparecer no treino do dia do usuário.
- **Plano Oficial Único**: o app lê o treino oficial salvo pelo backend. Esse plano pode vir da geração do GUTO ou de edição manual do coach, mas só existe um plano ativo para execução.
- **Bloqueio Manual**: quando o coach define `lockedByCoach`, o treino fica protegido contra adaptação automática. O GUTO pode registrar sinais de dor, sugerir revisão e preparar proposta, mas não substitui o plano sem autorização.

### Dúvida Contextual
Se o usuário tiver dúvida sobre um exercício específico e tocar no ícone de interrogação `?` do card:
- O aplicativo muda automaticamente para a aba Chat.
- O chat inicia um fluxo contextual focado na dúvida daquele exercício específico (ex: "Como faço o agachamento sumô de forma correta sem forçar a lombar?"). O GUTO não pode dar uma resposta genérica de boas-vindas; ele já deve responder sabendo qual exercício o usuário tocou.

---

## 11) Aba Dieta

### O que é
A aba que exibe o plano alimentar diário e as orientações nutricionais do usuário para aquela semana.

### Regras Críticas
- **Uso da Memória Existente**: a dieta é calculada usando as variáveis de calibragem (peso, altura, idade, objetivo, nível). Ela não pode forçar o usuário a preencher um novo formulário nutricional.
- **Respeito Estrito a Intolerâncias e Restrições**: se o usuário informou intolerância a lactose na calibragem, alimentos derivados de leite estão estritamente banidos do plano de refeições gerado. Se houver restrições como veganismo ou vegetarianismo, proteínas animais não entram na lista.
- **Campo Único NÃO COMO**: restrição, intolerância, alergia, alimento evitado e preferência alimentar operacional entram no mesmo campo `foodRestrictions`. O app não cria campo separado de intolerância.
- **Contexto Local Geográfico**: país e idioma são desacoplados. Se o usuário mora na Itália mas fala português (calibrado como `country: "IT"`, `language: "pt"`):
  - A interface e o chat renderizam em português.
  - O conteúdo de dieta e os alimentos sugeridos utilizam o contexto local italiano (alimentos disponíveis em mercados da Itália, hábitos típicos locais e marcas regionais).
- **Idioma Não Define Comida**: o idioma escolhido define texto, voz e tom. A disponibilidade de alimentos vem de país/cidade. Um aluno no Brasil falando inglês recebe alimentos disponíveis no Brasil. Um aluno na Itália falando português recebe alimentos disponíveis na Itália.
- **Coerência Calórica e Nutricional**: calorias totais, proteína, carboidrato, gordura e porções precisam bater com os alimentos listados. Não é aceitável exibir uma soma diária incompatível com as refeições.
- **Plano Persistido**: a dieta exibida no app precisa vir do plano salvo no backend (`weeklyDietPlan`/plano alimentar oficial). O frontend não monta dieta sozinho a partir de texto solto.
- **Bloqueio Manual da Dieta**: se o coach editou e bloqueou uma dieta, o GUTO não pode trocar refeições automaticamente. Mudanças de calibragem ou do campo NÃO COMO devem gerar revisão pendente ou pedido de confirmação.
- **Semântica sobre Palavra-Chave**: o backend deve usar interpretação semântica real para processar restrições. Frases do usuário como "nessun dolore" (italiano para "sem dor") indicam ausência de dor física e **não** devem ser registradas como restrições alimentares por falhas de correspondência simplista de texto.

### Quando O GUTO Não Entende
Se o GUTO não tiver informação suficiente para montar uma dieta segura, ele não deve inventar. Ele deve perguntar de forma curta o dado faltante, por exemplo:
- "Você evita lactose por intolerância ou só prefere reduzir?"
- "Você mora em qual cidade hoje?"
- "Você treina em casa ou academia esta semana?"

Perguntar é correto. Inventar alimento, caloria ou restrição é falha.
