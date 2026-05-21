# Arena e Sistema de Gamificação do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação das Arenas de Competição, Escopo de Equipes, Sincronismo de XP e Preservação de Privacidade.

---

## O Que É A Arena Do GUTO

A Arena do GUTO funciona como o **centro de engajamento social e gamificação da constância**. Ela não foi projetada para comparar pesos, expor corpos, incentivar postagens estéticas ou replicar dinâmicas de redes sociais genéricas de bem-estar.

No ecossistema do GUTO, a única métrica que possui valor é a **presença**. 

A Arena transforma o ato de aparecer em um esporte de repetição e compromisso. A unidade de competição não é o indivíduo isolado; é a identidade oficial da dupla:
```txt
GUTO & Will
GUTO & Maria
GUTO & Amanda
```
Não é apenas o aluno que ganha destaque no ranking: é a dupla provando para o grupo que está ativa, unida e resiliente.

---

## Objetivos da Arena

1. **Consequência Social Saudável:** Criar um incentivo amigável focado em consistência de curto e longo prazo.
2. **Gatilhador de Retenção:** Impulsionar o usuário a realizar a Missão do dia para manter ou defender sua posição na tabela.
3. **Métrica Operacional Ativa (Para Equipes e Coaches):** Permitir que treinadores e administradores identifiquem em tempo real quem está engajado e quem está em risco iminente de abandono.
4. **Combate ao Desânimo:** Estimular o aluno que está nas posições inferiores de que *"ainda dá para voltar hoje"*, e dar o senso de responsabilidade de manutenção para quem lidera o ranking.

---

## Eventos e Atribuição de Pontos (Sincronismo de XP)

A Arena consome a distribuição de XP validada de forma rigorosa pelo backend.

```txt
               [ Mecanismo de Geração de Pontuação ]

  Ações do Aluno:
  ├── Treino Validado (Pág. 12) ───────────➔ +100 XP (Presença Real de Missão)
  ├── Missão Adaptada Aceita (Chat) ──────➔ +50  XP (Flexibilidade sob dor)
  ├── Conclusão do Pacto (Pág. 7) ────────➔ +100 XP (Buffer Inicial Emocional)
  └── Ausência injustificada (Inatividade) ➔ -20  XP (Penalidade, se aplicável)
```

- *Aviso de Integridade:* O **XP Inicial de Boas-Vindas** concedido na assinatura do Pacto é meramente promocional. Ele entra no saldo geral do aluno, mas está **terminantemente banido** de contar como treino executado ou ativar dias seguidos de consistência (streak) nasArenas Semanal e Mensal.

---

## A Matriz das Três Arenas

O sistema calcula e divide a competição em três eixos de tempo para garantir a acessibilidade de novos alunos e premiar a lealdade histórica dos antigos:

```txt
       ┌────────────────────────┐
       │   A S T RÊ S   A R E N A S  │
       └───────────┬────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   ARENA SEMANAL       ARENA MENSAL
   (Reset: Domingo     (Reset: Último
    às 23:59 local)     dia do mês)
         │
         ▼
   ARENA GERAL
   (Histórico Acumulado / Legado)
```

### 1. Arena Semanal (A Chance do Agora)
- **Logica:** Inicia na segunda-feira às 00:00 e zera no domingo às 23:59 (respeitando o timezone local calibrado do usuário).
- **Objetivo:** Permite que um aluno recém-cadastrado na quinta-feira tenha chances reais de brigar e pontuar na semana seguinte, evitando o desânimo de competir contra históricos de anos de uso.
- **Cobrança ativa do GUTO:** *"Will, tua semana na Arena ainda tá viva. Um treino limpo hoje te joga duas posições pra cima na tabela. Vamodupla!"*

### 2. Arena Mensal (A Consistência de Ciclo)
- **Logica:** Acompanha a soma das validações do mês calendário corrente.
- **Objetivo:** Mede a resiliência a médio prazo. Destaca quem mantém o comparecimento estável sobre alunos que têm apenas uma "semana explosiva" e depois somem.

### 3. Arena Geral (O Legado)
- **Logica:** Acumulado histórico absoluto de toda a jornada da dupla.
- **Objetivo:** Simboliza a herança, o prestígio e a solidez da parceria entre o usuário e o GUTO desde o primeiro dia do pacto.

---

## Escopos de Exposição e Muralhas de Privacidade

Para evitar constrangimento público ou invasão de dados, as Arenas operam em silos controlados amarrados a regras rígidas de segurança:

- **Escopo do Aluno (Arena de Grupo):** O aluno visualiza apenas as posições de outros membros que pertençam ao mesmo grupo de treinamento (ex: mesmo time de empresa, alunos do mesmo Coach, ou grupo de teste beta fechado). Isso torna a competição próxima e engajadora.
- **Arena Individual (Me vs. Me):** Se o usuário optar por ocultar seu perfil (`visibleInArena = false`), sua linha de ranking é removida da listagem pública das Arenas de grupo. A aba Arena passa a exibir gráficos individuais de consistência, comparando o rendimento do aluno contra suas próprias melhores semanas passadas.
- **Muralha de Proteção de Dados (PII):** Outros usuários visualizam apenas:
  - Posição no ranking.
  - Nome Soberano da dupla (`GUTO & Aluno`).
  - Nível estético do Avatar (`Baby`, `Teen`, `Adult`, `Elite`).
  - Total de XP acumulado no período.
  - *Bloqueio Absoluto:* É proibido vazar ou expor dados de peso, idade, altura, patologias clínicas, restrições alimentares ou fotos privadas de validação para outros alunos na Arena.

---

## Estrutura de Atributos do Ranking

O JSON consolidado pelo backend em `arena-store` para processamento do ranking utiliza a estrutura:

```json
{
  "userId": "user_will_777",
  "displayName": "GUTO & Will",
  "arenaGroupId": "time_alfa_corporativo",
  "avatarStage": "Adult",
  "totalXp": 4500,
  "weeklyXp": 300,
  "monthlyXp": 1200,
  "validatedWorkoutsTotal": 45,
  "validatedWorkoutsWeek": 3,
  "validatedWorkoutsMonth": 12,
  "streak": 5,
  "lastValidationAt": "2026-05-20T18:30:00Z",
  "visibleInArena": true
}
```

---

## Critérios Estáveis de Desempate

Para evitar flutuações e bugs visuais que quebrem a percepção de seriedade do jogo, o backend calcula o desempate na Arena de forma determinística seguindo a hierarquia:
1. **Maior XP acumulado** no período (Semana/Mês/Geral).
2. **Maior Streak ativo** (Dias consecutivos de treino validado).
3. **Maior quantidade de treinos validados** fisicamente no período.
4. **Data/Hora de validação mais antiga** (Quem apareceu e provou primeiro herda a vantagem).

---

## Sincronismo Total de Estados (Bug Zero)

Todas as ações de pontuação nascem do mesmo evento originário no backend:

```txt
               [ Fluxo de Validação Unificada ]

  Validação do Treino Aprovada no Backend
  ├── 1. Percurso ────────➔ Grava o marco visual na linha do tempo
  ├── 2. Memória Geral ───➔ Atualiza totalXp e increments streak
  ├── 3. Arena Store ─────➔ Acrescenta pontuação (Semanal, Mensal, Geral)
  └── 4. Evoluir ─────────➔ Concede progresso físico ao Avatar
```

*Regra de Ouro:* É considerado **Bug Crítico P0** apresentar valores de XP ouStreak desalinhados entre as abas. Se o Percurso exibe streak de 5 dias, a Arena e o Evoluir do Avatar devem obrigatoriamente exibir o streak de 5 dias na mesma atualização.

---

## O Uso da Arena nas Interações com o GUTO

O GUTO monitora o andamento da tabela da Arena para modular sua fala no Chat de forma encorajadora e contextual, afastando piadas depreciativas:

- **Se o aluno caiu de posição:**
  > *"Will, caímos um degrau na Arena esta semana por causa do descanso de ontem. Mas nada de vergonha ou drama por aqui: a nossa semana ainda tá viva. Um treino curto e limpo hoje te joga de volta na briga. Vamo?"*
- **Se o aluno lidera o ranking:**
  > *"GUTO & Will no topo do grupo hoje. Orgulho da postura. Mas consistência não aceita férias: amanhã é dia de consolidar a presença."*

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **XP Descompassado:** Exibir pontuações diferentes em relação às abas de Evolução ou Percurso por falhas de cache local do frontend.
- **Duplicação de Eventos:** O mesmo treino gerar XP duas vezes no mesmo dia devido a reenvios múltiplos de rede do cliente.
- **Vazamento entre Empresas:** Misturar alunos de escopos ou organizações corporativas concorrentes no mesmo ranking da Arena por herança indevida de rotas no backend.
- **Exposição Abusiva:** Mostrar fotos privadas ou dados clínicos de limitação física de um usuário para os concorrentes da Arena.
- **Inflação de Cadastro:** Contar o XP inicial de Pacto ou preenchimentos de cadastro como "treinos concluídos" no ranking semanal.
- **UTC Puro na data:** Calcular o fechamento de ciclos de semanas usando UTC absoluto, punindo usuários em fusos horários atrasados com resets precoces de Arena.
- **Exibição sem Validação:** Pontuar na Arena apenas porque o usuário "declarou" que treinou no chat, sem que ocorra o envio de provas físicas de imagem e frase da Validação de Treino (Página 12).
