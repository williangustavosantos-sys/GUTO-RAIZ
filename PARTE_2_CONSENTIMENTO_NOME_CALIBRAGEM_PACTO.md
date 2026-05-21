# Parte 2 — Consentimento, Nome da Dupla, Calibragem e Pacto

> Documento de fluxo de onboarding e engajamento inicial do GUTO. Leia depois da `Parte 1`.

## O Que Essa Parte Representa

Esta parte é onde o visitante deixa de ser apenas um usuário logado e se torna parte de uma dupla oficial e ativa. O onboarding do GUTO não é uma coleta de dados burocrática; é o ritual de nascimento do companheiro digital baseado em quatro promessas cruciais:

1. **Proteção absoluta de dados (Consentimento)**: o usuário confia ao GUTO suas dores, dados físicos, limitações e rotina. O consentimento garante que ele está no controle total desses dados de saúde e sensíveis.
2. **Soberania da identidade (Nome da Dupla)**: a dupla nasce formalmente sob o nome `GUTO & [nome do usuário]`. Esse nome é sagrado e não pode ser sobrescrito por convites ou e-mails automáticos.
3. **Calibragem como Memória Viva**: todos os dados coletados aqui alimentam imediatamente o "cérebro" (backend) e moldam a experiência operacional do chat, treino, dieta, GUTO Online e proatividade.
4. **O Pacto de Fidelidade**: a consagração do compromisso. O XP inicial serve como recompensa emocional inicial para firmar a jornada física e mental.

---

## Fluxo Completo (Ordem Soberana)

```txt
1. Usuário realiza o login ou claim de convite com sucesso
2. É direcionado para a tela de Consentimento (/consent)
3. Aceita os termos de dados de saúde e termos gerais
4. Avança para a tela de Nome da Dupla (/naming)
5. Confirma o nome oficial do aluno (soberano)
6. Avança para a Calibragem (/calibration)
7. Responde dados de treino, corpo, dores, dieta, país e cidade
8. Envia calibragem para o backend (salvo como memória real)
9. Avança para o Pacto (/pacto)
10. Conclui o pacto e recebe o XP inicial de boas-vindas
11. É direcionado para o Sistema Principal (Hub/Chat)
```

---

## 4) Consentimento

### O que é
Tela de consentimento legal e de privacidade em conformidade com as regras de proteção de dados (GDPR/LGPD). Explica de forma clara que o GUTO processará dados de saúde altamente sensíveis (peso, altura, limitações físicas, alimentação) para poder personalizar os planos de forma segura.

### Experiência
- O usuário visualiza os termos e políticas no idioma selecionado na Parte 1.
- Dois checkboxes obrigatórios precisam ser selecionados ativamente para liberar o botão de avanço:
  - Aceite dos Termos Gerais de Uso e Política de Privacidade.
  - Autorização explícita para coleta e processamento de dados de saúde e corporais.
- Se o usuário revogar o consentimento futuramente nas configurações, todos os seus dados pessoais e de calibragem (idade, peso, altura, patologias, restrições alimentares) devem ser limpos no backend e o acesso é interrompido de forma segura.

### Regras Críticas
- **Sem Consentimento, sem Calibragem**: o sistema impede qualquer redirecionamento para calibragem ou chat caso o consentimento esteja ausente ou falso no banco de dados.
- **Revogação Real**: quando o usuário limpa os dados, o backend precisa de fato deletar os dados sensíveis. Não é permitido "fingir" ou manter um soft-delete invisível sobre dados de saúde.

---

## 5) Nome da Dupla

### O que é
A tela de batismo do relacionamento entre o companheiro ativo digital e o usuário.

### Experiência
- O usuário digita o seu nome preferido de uso (primeiro nome ou apelido direto).
- A tela ilustra visualmente a marca e identidade oficial:
  ```txt
  GUTO & [nome digitado pelo usuário]
  ```
- O usuário confirma. Esse nome agora se torna o registro soberano do sistema.

### Regras Críticas
- **Soberania Absoluta**: o nome confirmado pelo usuário na interface de naming não pode ser sobrescrito em hipótese alguma pelo nome que veio do link de convite, e-mail do aluno, cadastro do coach ou fallback genérico do sistema. O que o aluno digita e confirma é lei.
- **Glow e Validação**: se o nome estiver em branco ou contiver caracteres puramente numéricos/inválidos, a interface exibe um feedback visual estilizado no idioma do usuário antes de permitir o avanço.

---

## 6) Calibragem

### O que é
A calibragem é a etapa de configuração profunda do "corpo" e "ambiente" do usuário. Ela fornece os dados necessários para o backend rodar de forma segura, inteligente e contextualizada.

### Parâmetros Coletados
1. **Idade** (ajusta intensidade e limites fisiológicos).
2. **Sexo Biológico** (ajusta bases biológicas de consumo calórico e macro nutrientes).
3. **Nível de Treino** (`beginner`, `intermediate`, `advanced`).
4. **Objetivo** (ganho de massa, emagrecimento, consistência, etc.).
5. **Local Preferido de Treino** (`gym`, `home`, etc.).
6. **Altura** e **Peso** (essenciais para cálculo de dieta e evolução corporal).
7. **País** e **Cidade** (fornecem o contexto geográfico para clima, feriados, fusos e alimentação local).
8. **Dores, Patologias ou Limitações** (dados cruciais de segurança; ex: joelho operado, hérnia, dores articulares).
9. **Restrições Alimentares ou Intolerâncias** (dados médicos alimentares; ex: intolerância a lactose, veganismo, alergia a glúten).

### Regras Críticas
- **Conexão Real no Backend**: a calibragem não é um formulário de cadastro cosmético. Ela precisa persistir na memória operacional do backend imediatamente. 
- **Memória de Segurança**: se o usuário informa uma limitação de dor (ex: joelho sensível), o backend **nunca** pode gerar exercícios de alto impacto articular sem proteção no quadrilceps.
- **Coerência da Dieta**: se o usuário informa intolerância à lactose, derivados lácteos com lactose estão estritamente banidos do plano alimentar da aba Dieta.
- **Sem Redundância**: o GUTO nunca pergunta no Chat ou na aba Dieta informações que o usuário já respondeu na calibragem inicial. Perguntar novamente destrói a percepção de presença inteligente.

---

## 7) Pacto

### O que é
A consagração simbólica da parceria entre o usuário e o GUTO. O encerramento definitivo do onboarding.

### Experiência
- Uma tela ritualística e de alta carga emocional que firma o compromisso de consistência diária.
- O usuário realiza uma ação física estilizada (como um botão "Segurar por 2 segundos" ou uma confirmação visual estilizada) para assinar o pacto.
- O sistema concede um XP inicial de boas-vindas como comemoração e marco de partida.

### Regras Críticas
- **XP de Boas-Vindas como Buffer**: o XP concedido no pacto serve puramente como um estímulo psicológico de largada. Ele **não** conta como atividade física realizada, não valida treinos reais e não gera streak (dias consecutivos de treino).
- **Entrada no Hub Principal**: ao selar o pacto, o stage do usuário é atualizado no banco de dados para `system`, liberando o acesso total às abas do aplicativo principal.
