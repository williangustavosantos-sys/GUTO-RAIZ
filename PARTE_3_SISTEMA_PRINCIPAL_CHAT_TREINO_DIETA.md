# Parte 3 — Sistema Principal, Chat, Missão e Dieta

> Documento de fluxo das abas interativas centrais e do motor de inteligência do GUTO. Leia depois da `Parte 2`.

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
- **Contexto Local Geográfico**: país e idioma são desacoplados. Se o usuário mora na Itália mas fala português (calibrado como `country: "IT"`, `language: "pt"`):
  - A interface e o chat renderizam em português.
  - O conteúdo de dieta e os alimentos sugeridos utilizam o contexto local italiano (alimentos disponíveis em mercados da Itália, hábitos típicos locais e marcas regionais).
- **Semântica sobre Palavra-Chave**: o backend deve usar interpretação semântica real para processar restrições. Frases do usuário como "nessun dolore" (italiano para "sem dor") indicam ausência de dor física e **não** devem ser registradas como restrições alimentares por falhas de correspondência simplista de texto.
