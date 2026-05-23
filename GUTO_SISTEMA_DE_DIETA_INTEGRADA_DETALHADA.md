# Sistema de Dieta Integrada do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação do Motor Nutricional, Isolamento de Intolerâncias, Localização de Contextos e Dúvidas Dietéticas.

---

## Estado Do Documento

Este documento é a fonte de verdade para auditoria e implementação da Dieta. Antes de alterar código, qualquer agente deve cruzar este arquivo com:

- `README.md`
- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`
- `PARTE_3_SISTEMA_PRINCIPAL_CHAT_TREINO_DIETA.md`
- código real do backend/frontend envolvido na dieta

Se houver divergência entre documento e código, a primeira entrega deve ser um relatório técnico. Não corrigir código antes da autorização explícita.

---

## O Que É A Dieta no GUTO

A dieta no GUTO não opera como um cardápio ou planilha estática separada do restante das funcionalidades do aplicativo. Ela funciona como a **continuação biológica e geográfica da calibragem** e do contexto semanal do usuário.

A experiência deve ser totalmente unificada: o usuário não pode sentir que preencheu dados detalhados no onboarding (como intolerâncias ou país) para depois a aba Dieta sugerir ingredientes perigosos ou indisponíveis no seu comércio regional. 

O motor de dieta calcula o plano integrando dez variáveis ativas em tempo real:
- Identidade do aluno (sexo biológico e idade).
- Parâmetros físicos (peso e altura para cálculo metabólico).
- Objetivo principal (hipertrofia, emagrecimento, etc.).
- Restrições e intolerâncias alimentares (campo "NÃO COMO" da calibragem).
- Localização geográfica (país e cidade para herança de ingredientes locais).
- Idioma de exibição (tradução de pratos e refeições).
- Volume de treino atual (gasto calórico da Missão).
- Contexto da semana ativa (viagens mapeadas pela Proatividade).
- Prescrições e bloqueios impostos pelo treinador (Coach Override).

---

## Objetivo da Dieta: Orientação Prática e Coerente

O GUTO **não** realiza diagnósticos clínicos, terapia nutricional de patologias renais, ou tratamentos de saúde complexos. O objetivo técnico é gerar uma **orientação alimentar fitness prática, segura e coerente** focada em hipertrofia, emagrecimento ou consistência física diária.

A interface deve traduzir a complexidade nutricional (macros e calorias) em porções de alimentos realistas, práticos e rápidos de preparar, reduzindo a fadiga de decisão do aluno.

---

## Relação Estrita com a Calibragem (Dados Mínimos)

A aba Dieta permanece sob estado de bloqueio (`idle` ou `needs_clarification`) caso o perfil do aluno apresente ausência de dados mínimos para as equações metabólicas de macros.

```txt
               [ Validador de Dados Nutricionais ]

  Verifica Variáveis:
  ├── userAge (Idade) ──────────➔ (Se ausente: GUTO bloqueia e pergunta no chat)
  ├── biologicalSex (Gênero) ───➔ (Se ausente: GUTO bloqueia e pergunta no chat)
  ├── heightCm (Altura) ────────➔ (Se ausente: GUTO bloqueia e pergunta no chat)
  ├── weightKg (Peso) ──────────➔ (Se ausente: GUTO bloqueia e pergunta no chat)
  ├── country (País ativo) ─────➔ (Se ausente: GUTO pergunta antes de dieta localizada)
  └── countryCode (ISO-2) ──────➔ (Se ausente: GUTO tenta resolver; se incerto, pergunta)
```

O idioma não substitui país/cidade. O idioma define a língua da interface e da fala. O país/cidade definem disponibilidade de alimentos.

### Dados Que Não Entram Na Dieta

- Telefone do aluno: proibido em `GutoMemory`, calibragem, settings do aluno, chat e dieta.
- Campo separado de intolerância: não existe. Tudo passa pelo campo único `foodRestrictions` / **NÃO COMO**.
- Histórico recente como pergunta inicial: o histórico nasce do uso real do app, não de formulário inicial.

---

## Isolamento Semântico de Restrições ("NÃO COMO")

A segurança sanitária é tratada com tolerância zero. O campo unificado da calibragem **"NÃO COMO"** (`foodRestrictions`) é processado semanticamente para classificar alergias e intolerâncias graves.

- **Entrada do usuário:** *"Não posso tomar leite, sou intolerante ao lattosio e intolerante ao glúten."*
  - **Mapeamento:** `foodRestrictions: ["lactose_intolerance", "gluten_intolerance"]`.
  - **Filtro de exclusão absoluta:** Leites comuns, queijos tradicionais, massas com farinha de trigo comum e aveia com contaminação estão **estritamente banidos** do cardápio e das opções de substituições.
- **Tratamento de Dor vs. Comida:** Se o usuário escrever em italiano na calibragem *"nessun dolore"* (que significa "sem dor física"):
  - O interpretador semântico sabe separar essa informação, registrando a ausência de lesões físicas na aba Treino e **não** cadastrando falso-positivos ou alergias inexistentes na aba Dieta.

### Quando O GUTO Não Entende

Se `foodRestrictions`, país, cidade ou objetivo estiverem vazios, contraditórios ou ambíguos, o GUTO deve perguntar antes de gerar uma dieta. Ele não deve chutar e não deve fingir que entendeu.

Exemplos:

- Usuário escreveu "não como massa" morando na Itália: perguntar se ele quer evitar massa em geral, glúten, trigo ou apenas reduzir carboidratos.
- Usuário escreveu "sem leite" mas aceita derivados sem lactose: perguntar se a restrição é lactose, proteína do leite ou preferência.
- Usuário escreveu "Italia" sem cidade: pode usar o país para alimentos gerais, mas se a dieta depender de contexto regional, pergunta a cidade.
- Usuário escreveu "não como nada branco": não gerar dieta com interpretação literal; pedir esclarecimento.

---

## O Desacoplamento de País e Idioma (Localização Real)

Um dos maiores diferenciais de inteligência do GUTO é o desacoplamento entre idioma e território.

- **Cenário:** O usuário é brasileiro, mas mora em Roma, na Itália.
  - **Calibragem:** `language: "pt-BR"`, `country: "Itália"`.
  - **Resultado Esperado (Interface e Alimentos Coerentes):**
    - Todo o texto da aba Dieta (refeições, instruções, botões) renderiza em português brasileiro.
    - O cardápio sugerido **exclui** alimentos de difícil acesso na Europa (como açaí, tapioca pura, farofa ou cupuaçu) e inclui itens fáceis do varejo italiano (como ovos, arroz, batata, legumes, frango, peixe, iogurte grego sem lactose quando permitido, massa integral local quando permitida e frutas comuns na região).

Regra prática: se um alimento depende de cultura/mercado brasileiro e o usuário mora fora do Brasil, ele não deve entrar por padrão. Só pode aparecer se o usuário confirmar que tem acesso fácil àquele alimento.

---

## Cálculo de Macros e Equação de Metas

O backend calcula o gasto energético e distribui a meta diária baseado nas variáveis biológicas do aluno:

1. **BMR (Taxa Metabólica Basal):** Calculado via equação de Harris-Benedict ou Mifflin-St Jeor.
2. **TDEE (Gasto Energético Diário Total):** Fator de atividade física herdado do `trainingLevel` e `trainingStatus`.
3. **Calorias Alvo (`targetKcal`):**
   - Objetivo `muscle_gain` ➔ Superávit moderado (+300 a +500 kcal).
   - Objetivo `fat_loss` ➔ Déficit controlado (-400 a -600 kcal).
4. **Divisão de Macronutrientes:**
   - **Proteínas (`proteinG`):** Calculado de 1.8g a 2.2g por kg de peso corporal.
   - **Gorduras (`fatG`):** Calculado de 0.8g a 1.0g por kg de peso corporal.
   - **Carboidratos (`carbsG`):** Alocação do restante das calorias da meta diária.

### Conferência Obrigatória De Calorias

O plano gerado precisa passar por validação matemática antes de ser salvo:

- A soma de calorias das refeições do dia deve ficar dentro da margem operacional definida pelo backend (ex.: ±80 kcal da meta).
- A soma de macros dos alimentos precisa ser coerente com `proteinG`, `carbsG` e `fatG`.
- A soma calórica dos macros precisa ser compatível com `targetKcal` (`proteinG*4 + carbsG*4 + fatG*9`), respeitando arredondamentos pequenos.
- Alimentos sem quantidade, sem calorias ou com porções impossíveis tornam a dieta inválida.
- Se a validação falhar, a dieta não pode ser marcada como `generated`.

---

## Estrutura da Dieta e Estados de Processamento

A Dieta é estruturada por refeições organizadas horizontalmente ao longo da semana (Segunda a Domingo) e transita pelos seguintes status:
- `idle`: Conta nova sem onboarding finalizado.
- `ready_to_generate`: Onboarding completo e macros calculados, aguardando montagem.
- `generating`: IA e regras fechadas processando o plano de refeições no backend.
- `generated`: Dieta persistida e pronta para exibição.
- `needs_clarification`: Dados incompletos; GUTO aciona o chat para perguntar peso, altura ou alergias.
- `failed`: Falha de sistema; ativa o fallback nutricional básico.

No backend atual, a dieta pode aparecer como plano semanal (`weeklyDietPlan`) na memória operacional e como plano estruturado (`DietPlan`) no store de dieta. A auditoria precisa verificar os dois caminhos antes de qualquer alteração.

Quando a dieta é gravada, o payload salvo precisa conter no mínimo:

```json
{
  "userId": "user_will_777",
  "generatedAt": "2026-05-21T09:00:00Z",
  "targetKcal": 2600,
  "proteinG": 160,
  "carbsG": 300,
  "fatG": 75,
  "lockedByCoach": false,
  "meals": {
    "segunda": [
      {
        "mealId": "m1_breakfast",
        "mealName": "Café da Manhã",
        "timeSuggested": "08:00",
        "foods": [
          { "name": "Ovos mexidos inteiros", "quantity": "3 unidades" },
          { "name": "Pão integral de sêmola", "quantity": "2 fatias" },
          { "name": "Café preto sem açúcar", "quantity": "1 xícara" }
        ],
        "calories": 420,
        "note": "Substitua o pão por fruta sem lactose se preferir menor densidade de carbo."
      }
    ]
  }
}
```

### Persistência E Verdade Operacional

- O GUTO só pode dizer "dieta pronta" depois de salvar o plano com sucesso.
- Se a geração falhar, o status deve refletir falha ou necessidade de esclarecimento, nunca sucesso falso.
- O app deve ler dieta persistida; não deve recriar cardápio no frontend.
- Se `foodRestrictions`, país, cidade, peso, altura, objetivo ou sexo biológico mudarem, a dieta existente precisa ser reavaliada antes de continuar sendo apresentada como atual.
- Se o plano estiver `lockedByCoach: true`, o GUTO não pode sobrescrever automaticamente. Ele deve sinalizar que a calibragem mudou e pedir revisão/liberação do coach.

---

## Integração com a Proatividade e o Treino

- **Ajuste por Treino Pesado:** Se o aluno validou uma missão exaustiva (ex: pernas e costas), a refeição pós-treino ganha destaque calórico no dia, focando na recuperação de glicogênio e reparação muscular.
- **Ajuste por Viagens (Proatividade):** Se a proatividade confirmou que o aluno viaja para Roma amanhã, a dieta do dia da viagem simplifica os preparos: substitui pratos complexos (como arroz, feijão e frango grelhado) por opções frias, shakes proteicos e lanches práticos fáceis de consumir em trânsito.
- **Mensagem de Conforto (Sem Paranoia):** Em finais de semana com eventos confirmados (ex: casamentos), o GUTO remove a rigidez e orienta:
  > *"Will, amanhã é o casamento. Esqueça balanças e paranoia de calorias por um dia. Garanta uma boa dose de proteína antes de sair e aproveite. Segunda a gente reata nossa consistência."*

---

## O Botão de Dúvida "?" na Dieta

Cada refeição e alimento possui um ícone de dúvida `?`.

### Transmissão de Contexto
Ao clicar no `?`, a interface abre a aba Chat do GUTO transmitindo o payload estruturado contendo a refeição ativa, os macros e as restrições do usuário:
```json
{
  "mealId": "m1_breakfast",
  "mealName": "Café da Manhã",
  "foodName": "Ovos mexidos",
  "foodRestrictions": ["lactose_intolerance"],
  "country": "Itália"
}
```
A IA responde de forma precisa:
- **Pergunta do usuário:** *"Não tenho pão integral hoje, o que uso?"*
- **Resposta contextual do GUTO:** *"Substitui por 80g de aveia sem glúten misturada com água ou fruta, Will. Mantém a mesma energia para o teu treino de força de hoje e passa longe da lactose!"*

---

## Sobresposição do Treinador (Coach Priority)

As edições manuais feitas pelo treinador no painel administrativo desktop possuem soberania absoluta sobre a geração automática da IA:

1. **Dieta Manual do Coach:** Se o Coach desenhou o menu calórico semanal do aluno, o backend trava a chave `lockedByCoach: true`.
2. **Comportamento da IA:** O GUTO impede alterações automáticas no cardápio, atuando apenas como esclarecedor de dúvidas e sugerindo substituições simples de ingredientes de equivalência idêntica sem modificar as calorias macro travadas pelo treinador.

### Conexão Com Painel Admin/Coach

O painel admin/coach deve conseguir visualizar a dieta do aluno e, em fase própria, editar porções/refeições com validação. Toda edição manual precisa:

- respeitar o campo **NÃO COMO**;
- respeitar país/cidade do aluno;
- manter totais de calorias e macros coerentes;
- registrar auditoria;
- refletir no app do aluno na próxima leitura;
- travar o plano com `lockedByCoach: true` quando for prescrição manual soberana.

O painel não pode gravar alimento proibido por restrição alimentar. Se tentar, backend deve recusar.

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Furos Sanitários (Alergias na Dieta):** Sugerir ingredientes contendo lactose para intolerantes calibrados ou carne para vegetarianos calibrados. **P0 Crítico**.
- **Incoerência de Idioma:** Apresentar termos de refeições em português (ex: "Almoço") caso o aluno tenha calibrado o idioma do app em inglês ("Lunch") ou italiano ("Pranzo").
- **Dissonância Geográfica:** Prescrever ingredientes tipicamente brasileiros (como tapioca ou açaí) para alunos que residam em outros países sem adaptações locais.
- **Dizer que Salvou sem Persistir:** O GUTO prometer no chat que alterou a refeição ou removeu um ingrediente sem atualizar e persistir o JSON de `dietPlan` no backend.
- **Pular Overrides do Coach:** A IA apagar ou sobrescrever de forma autônoma menus calóricos que foram montados de forma exclusiva e travados pelo Coach.
- **Cálculos Incoerentes de Macros:** Gerar cardápios semanais onde a soma calórica real dos alimentos sugeridos destoe gravemente da meta calórica de macros calculada pelo backend.
- **Gerar Dieta Com Dado Ambíguo:** Criar cardápio mesmo quando país, restrição alimentar ou dado essencial estiver incerto.
- **Usar Idioma Como País:** Passar comida brasileira porque o app está em português, ignorando que o aluno mora em outro país.
- **Frontend Inventar Dieta:** Montar dieta no app sem passar pelo backend e sem persistência.

---

## Checklist De Auditoria Obrigatório

Antes de qualquer correção de dieta, o relatório técnico deve responder:

1. Quais arquivos/funções geram a dieta hoje.
2. Quais endpoints existem para gerar, ler, editar, bloquear e desbloquear dieta.
3. Se a dieta usa idade, sexo biológico, altura, peso, objetivo, nível, país, cidade e **NÃO COMO**.
4. Se idioma é usado apenas para texto e não para escolher alimento.
5. Se país/cidade controlam disponibilidade alimentar.
6. Se `foodRestrictions` bloqueia alimento proibido de verdade.
7. Se dado ambíguo gera pergunta antes da dieta.
8. Se cálculo de BMR/TDEE/macros está coerente.
9. Se totais de refeições batem com `targetKcal` e macros.
10. Se o plano é salvo antes do GUTO afirmar que está pronto.
11. Se `lockedByCoach` é respeitado.
12. Se o painel consegue visualizar/editar dieta sem quebrar restrições.
13. Quais testes existem e quais faltam.
