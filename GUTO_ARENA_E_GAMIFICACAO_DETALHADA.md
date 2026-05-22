# Arena e Sistema de Gamificacao do GUTO — Especificacao Canonica

> Documento canonico de engenharia e produto para a Arena do GUTO: escopos por empresa/time, Arena Geral global, privacidade, XP, rankings, painel admin e experiencia do aluno.

---

## Decisao Central

A Arena do GUTO nao e por coach. A Arena e por **empresa/time/academia**.

No sistema, a empresa e representada tecnicamente por `teamId`. O termo "empresa", "academia" ou "time" e apenas rotulo de interface para o usuario.

```txt
Empresa / Academia / Time = teamId
Coach = professor dentro da empresa
Aluno = compete com alunos da mesma empresa nas Arenas Semanal e Mensal
```

Exemplo:

```txt
Empresa: Action Fit
Aluno: Will
Dupla: GUTO & Will
```

Na Arena Semanal e na Arena Mensal, o Will compete contra outros alunos da Action Fit. Ele nao compete apenas contra alunos do mesmo coach.

Na Arena Geral, o Will compete contra todos os alunos visiveis do app GUTO. Nessa Arena Geral, cada linha deve mostrar tambem o nome da empresa/time ao lado da dupla.

```txt
1. GUTO & Will      Action Fit
2. GUTO & Laura     Studio Vertice
3. GUTO & Marco     Iron Club
4. GUTO & Ana       Action Fit
```

Alunos que comprarem o GUTO diretamente pela internet tambem precisam pertencer a uma empresa/time interno do GUTO. O nome comercial dessa Team interna sera definido depois. Ate la, a regra tecnica e:

```txt
Nao existe aluno sem teamId.
Nao existe aluno sem coachId.
Aluno direto da internet = aluno de uma Team interna do GUTO.
```

---

## O Que E A Arena Do GUTO

A Arena do GUTO e o centro de engajamento social e gamificacao da constancia. Ela nao foi criada para comparar corpo, peso, estetica, carga levantada ou performance extrema.

No GUTO, a metrica que importa e **presenca consistente**.

A unidade publica da Arena nao e o aluno sozinho. E a dupla:

```txt
GUTO & Will
GUTO & Maria
GUTO & Amanda
```

O ranking comunica que a dupla apareceu, validou a missao e continuou viva na jornada. A Arena deve gerar incentivo, nao constrangimento.

---

## Objetivos Da Arena

1. **Criar consequencia social saudavel:** estimular presenca sem expor dados sensiveis.
2. **Aumentar retencao:** fazer o aluno lembrar que a semana e o mes ainda podem ser recuperados.
3. **Dar leitura operacional para empresas e coaches:** mostrar quem esta engajado e quem esta sumindo.
4. **Fortalecer a cultura da empresa/time:** alunos da mesma academia competem no mesmo ambiente semanal e mensal.
5. **Preservar legado global:** a Arena Geral mostra a historia acumulada do app GUTO inteiro.

---

## As Tres Arenas

O GUTO tem tres rankings oficiais:

```txt
Arena Semanal  -> escopo da empresa/time (teamId)
Arena Mensal   -> escopo da empresa/time (teamId)
Arena Geral    -> escopo global do app GUTO
```

### 1. Arena Semanal

**Escopo tecnico:** `teamId`

**Titulo na tela:**

```txt
Arena Semanal — Action Fit
```

**Quem aparece:**

Somente alunos visiveis da mesma empresa/time.

```txt
GUTO & Will
GUTO & Maria
GUTO & Joao
```

**Quem pode visualizar:**

- Aluno: ve a Arena Semanal da sua propria empresa.
- Coach: ve a Arena Semanal da empresa onde trabalha, nao apenas seus alunos.
- Admin da Empresa: ve a Arena Semanal da propria empresa.
- Super Admin: ve qualquer Arena Semanal e pode filtrar por empresa.

**Reset:** segunda-feira 00:00 ate domingo 23:59, respeitando timezone operacional definido para o aluno/time.

**Objetivo:** dar uma chance curta de recuperacao. Um aluno novo ou alguem que ficou para tras ainda consegue brigar na semana seguinte.

### 2. Arena Mensal

**Escopo tecnico:** `teamId`

**Titulo na tela:**

```txt
Arena Mensal — Action Fit
```

**Quem aparece:**

Somente alunos visiveis da mesma empresa/time.

**Quem pode visualizar:**

- Aluno: ve a Arena Mensal da sua propria empresa.
- Coach: ve a Arena Mensal da empresa onde trabalha.
- Admin da Empresa: ve a Arena Mensal da propria empresa.
- Super Admin: ve qualquer Arena Mensal e pode filtrar por empresa.

**Reset:** ciclo mensal calendario.

**Objetivo:** medir constancia de medio prazo dentro da empresa/time.

### 3. Arena Geral

**Escopo tecnico:** global do app GUTO.

**Titulo na tela:**

```txt
Arena Geral — GUTO
```

**Quem aparece:**

Todos os alunos visiveis do app GUTO que permitirem aparecer na Arena.

Na Arena Geral, a linha precisa mostrar a dupla e a empresa/time:

```txt
1. GUTO & Will      Action Fit
2. GUTO & Laura     Studio Vertice
3. GUTO & Marco     Iron Club
```

**Quem pode visualizar:**

- Aluno: ve a Arena Geral global, sem dados sensiveis.
- Coach: ve a Arena Geral global, sem dados sensiveis.
- Admin da Empresa: ve a Arena Geral global, sem dados sensiveis.
- Super Admin: ve a Arena Geral global com filtros operacionais.

**Objetivo:** representar legado, prestigio e consistencia historica dentro do app inteiro.

---

## Regras De Escopo Por Papel

### Aluno

No app do aluno:

- Ve Arena Semanal da sua empresa (`teamId`).
- Ve Arena Mensal da sua empresa (`teamId`).
- Ve Arena Geral global.
- Na Geral, cada dupla mostra o nome da empresa ao lado.
- Nunca ve dados privados de outro aluno.

### Coach

No painel do Coach:

- Ve Arena Semanal da empresa onde trabalha.
- Ve Arena Mensal da empresa onde trabalha.
- Ve Arena Geral global.
- Nao ve uma Arena limitada ao proprio `coachId`.

Regra importante:

```txt
Coach opera uma carteira de alunos.
Arena Semanal/Mensal pertence a empresa/time.
```

O coach pode acompanhar seus alunos em telas operacionais, mas a competicao da Arena e da academia inteira.

### Admin Da Empresa

No painel da Empresa:

- Ve Arena Semanal da propria empresa.
- Ve Arena Mensal da propria empresa.
- Ve Arena Geral global.
- Pode analisar ranking da empresa inteira, incluindo alunos de todos os coaches da empresa.

### Super Admin

No painel Super Admin:

- Ve todas as Arenas Semanais por empresa.
- Ve todas as Arenas Mensais por empresa.
- Ve a Arena Geral global.
- Pode filtrar por empresa, pais, status, periodo e coach quando for uma necessidade operacional.
- Nunca deve usar esses filtros para vazar dados sensiveis para usuarios finais.

---

## Como Deve Aparecer Na Interface

### App Do Aluno

A aba Arena do app deve ter tres modos:

```txt
Semanal | Mensal | Geral
```

Quando o aluno abre Semanal:

```txt
Arena Semanal — Action Fit
```

Quando abre Mensal:

```txt
Arena Mensal — Action Fit
```

Quando abre Geral:

```txt
Arena Geral — GUTO
```

Na Semanal e Mensal, as linhas mostram a dupla. O nome da empresa pode aparecer no titulo, pois todos pertencem ao mesmo `teamId`.

Na Geral, cada linha mostra a empresa ao lado da dupla, porque existem alunos de varios times.

### Painel Da Empresa

A tela Arena do painel da empresa deve exibir:

- Aba Semanal com titulo da empresa.
- Aba Mensal com titulo da empresa.
- Aba Geral com ranking global e coluna de empresa/time.

### Painel Do Coach

A tela Arena do coach deve ser igual a da empresa no escopo de ranking:

- Semanal da empresa.
- Mensal da empresa.
- Geral global.

A diferenca do painel do coach esta nas outras telas operacionais, onde ele trabalha com os alunos vinculados a ele. Na Arena, o escopo semanal/mensal continua sendo `teamId`.

### Painel Super Admin

A tela Arena do Super Admin deve exibir:

- Semanal: seletor/filtro de empresa para ver o ranking semanal daquele `teamId`.
- Mensal: seletor/filtro de empresa para ver o ranking mensal daquele `teamId`.
- Geral: ranking global do GUTO com coluna de empresa/time.

Filtros permitidos para Super Admin:

- Empresa/time.
- Coach (apenas para analise operacional, nao para mudar escopo oficial da Arena).
- Pais.
- Periodo.
- Status de acesso.
- Visibilidade na Arena.

---

## Campos Visiveis Na Arena

A Arena pode mostrar:

- Posicao.
- Nome da dupla (`GUTO & Nome`).
- Empresa/time, obrigatorio na Arena Geral.
- XP do periodo.
- Streak.
- Estagio do avatar (`Baby`, `Teen`, `Adult`, `Elite`).
- Ultima validacao em formato seguro, quando necessario.

Exemplo de linha na Arena Semanal ou Mensal:

```txt
1. GUTO & Will      420 XP   Streak 4   Adult
```

Exemplo de linha na Arena Geral:

```txt
1. GUTO & Will      Action Fit      4.500 XP   Streak 12   Elite
```

---

## Dados Proibidos Na Arena

A Arena nunca pode mostrar:

- Peso.
- Altura.
- Idade.
- Patologia.
- Dor/lesao/limitacao.
- Restricao alimentar / campo "NAO COMO".
- Fotos privadas de validacao.
- Telefone.
- Email.
- Cidade exata quando isso puder identificar o aluno.
- Qualquer dado clinico ou sensivel de calibragem.

Esses dados pertencem ao perfil operacional do aluno no painel autorizado, nao ao ranking publico.

---

## Visibilidade Individual

O aluno pode ser removido da listagem publica da Arena quando `visibleInArena = false`.

Quando isso acontece:

- Ele nao aparece nas Arenas Semanal, Mensal ou Geral publicas.
- A propria experiencia dele pode mostrar uma visao individual de progresso.
- O XP e a evolucao continuam sendo calculados normalmente.
- O painel autorizado ainda pode ver dados operacionais conforme permissao.

---

## Eventos E Pontuacao

A Arena consome eventos de XP validados pelo backend.

```txt
Treino Validado                  -> +100 XP
Missao Adaptada Aceita           -> +50 XP
Conclusao do Pacto               -> +100 XP inicial
Ausencia injustificada, se ativa -> penalidade conforme regra do produto
```

Regra de integridade:

- XP inicial do Pacto pode entrar no saldo geral.
- XP inicial do Pacto nao conta como treino executado.
- XP inicial do Pacto nao ativa streak.
- XP inicial do Pacto nao deve inflar Arena Semanal/Mensal como se fosse presenca real.

---

## Estrutura De Dados Do Ranking

O backend deve produzir linhas de ranking ja escopadas para o tipo de Arena solicitado.

Exemplo para Arena Semanal/Mensal por empresa:

```json
{
  "scope": "team",
  "period": "weekly",
  "teamId": "team_action_fit",
  "teamName": "Action Fit",
  "items": [
    {
      "position": 1,
      "userId": "user_will_777",
      "displayName": "GUTO & Will",
      "teamId": "team_action_fit",
      "teamName": "Action Fit",
      "avatarStage": "Adult",
      "xp": 420,
      "streak": 4,
      "validatedWorkouts": 4,
      "lastValidationAt": "2026-05-20T18:30:00Z",
      "visibleInArena": true
    }
  ]
}
```

Exemplo para Arena Geral:

```json
{
  "scope": "global",
  "period": "total",
  "items": [
    {
      "position": 1,
      "userId": "user_will_777",
      "displayName": "GUTO & Will",
      "teamId": "team_action_fit",
      "teamName": "Action Fit",
      "avatarStage": "Elite",
      "xp": 4500,
      "streak": 12,
      "validatedWorkouts": 45,
      "lastValidationAt": "2026-05-20T18:30:00Z",
      "visibleInArena": true
    }
  ]
}
```

---

## Regras De Backend

O backend deve calcular os rankings de forma deterministica.

### Semanal E Mensal

Para `period = weekly` ou `period = monthly`:

- Exigir `teamId`.
- Retornar apenas alunos daquele `teamId`.
- Aplicar `visibleInArena`.
- Nao aceitar `coachId` como escopo oficial da Arena.
- Permitir filtro por `coachId` apenas no painel Super Admin/Admin/Coach para analise operacional, se necessario, mas mantendo claro que o ranking oficial e do time.

### Geral

Para `period = total` ou `scope = global`:

- Nao restringir por `teamId`.
- Retornar alunos visiveis de todo o app GUTO.
- Incluir `teamName` em cada linha.
- Aplicar regras de privacidade.

### Permissoes

- Aluno so pode requisitar sua Arena Semanal/Mensal do proprio `teamId` e a Geral.
- Coach so pode requisitar Semanal/Mensal do proprio `teamId` e a Geral.
- Admin so pode requisitar Semanal/Mensal do proprio `teamId` e a Geral.
- Super Admin pode requisitar qualquer `teamId` e a Geral.

---

## Criterios De Desempate

O desempate deve ser estavel e calculado no backend:

1. Maior XP no periodo.
2. Maior streak ativo.
3. Maior quantidade de treinos validados no periodo.
4. Validacao mais antiga no periodo, premiando quem apareceu primeiro.
5. `userId` como ultimo criterio tecnico para garantir ordem deterministica.

---

## Sincronismo Total De Estados

Toda pontuacao nasce de evento validado no backend.

```txt
Validacao de treino aprovada
  -> Atualiza memoria do aluno
  -> Atualiza XP semanal/mensal/geral
  -> Atualiza streak
  -> Atualiza Arena
  -> Atualiza Evolucao do avatar
```

Regra de ouro:

```txt
XP, streak e avatar nao podem divergir entre Arena, Evolucao, Percurso e painel.
```

Se a Arena mostra streak 5, o perfil do aluno e a evolucao devem mostrar o mesmo estado derivado da mesma fonte.

---

## Arena No Painel Admin

### Super Admin

O painel Super Admin deve ter uma tela Arena com tres abas:

```txt
Semanal | Mensal | Geral
```

Na Semanal e Mensal:

- Exigir selecao de empresa/time ou usar filtro padrao.
- Titulo exibe nome da empresa.
- Lista mostra ranking daquele `teamId`.

Na Geral:

- Titulo exibe `Arena Geral — GUTO`.
- Lista mostra ranking global.
- Cada linha mostra empresa/time ao lado da dupla.

### Admin Da Empresa

O painel da empresa deve ter a mesma tela Arena:

- Semanal da propria empresa.
- Mensal da propria empresa.
- Geral global.

### Coach

O painel do coach deve ter a mesma Arena da empresa:

- Semanal da empresa.
- Mensal da empresa.
- Geral global.

O coach nao deve ver Arena limitada a `coachId`.

### Detalhe Do Aluno

No detalhe do aluno, o painel pode mostrar um resumo da posicao do aluno:

- Posicao semanal dentro da empresa.
- Posicao mensal dentro da empresa.
- Posicao geral global.
- XP semanal.
- XP mensal.
- XP total.
- Streak.
- Estagio do avatar.

Esse resumo nao substitui a tela Arena principal.

---

## Uso Da Arena Nas Falas Do GUTO

O GUTO pode usar a posicao da Arena para motivar o aluno, respeitando o escopo correto.

Exemplo Semanal/Mensal:

> "Will, na Action Fit a nossa semana ainda esta viva. Um treino limpo hoje pode subir a dupla algumas posicoes."

Exemplo Geral:

> "GUTO & Will esta crescendo na Arena Geral. A Action Fit tambem aparece do nosso lado, mas o que conta aqui e a tua constancia."

O GUTO nunca deve humilhar o aluno por ranking baixo, nem expor dados de outros alunos.

---

## O Que Nao Pode Acontecer

- Criar Arena Semanal/Mensal por `coachId`.
- Fazer o coach ver apenas os proprios alunos na Arena da empresa.
- Mostrar Arena Geral sem nome da empresa/time ao lado da dupla.
- Misturar alunos de empresas diferentes na Arena Semanal ou Mensal.
- Expor dados sensiveis de calibragem no ranking.
- Mostrar telefone, email ou foto privada na Arena.
- Contar XP inicial do Pacto como treino validado.
- Duplicar XP por reenvio de validacao.
- Calcular ranking no frontend carregando todos os alunos.
- Deixar XP, streak ou avatar divergirem entre Arena, Evolucao e painel.
- Usar UTC puro ignorando timezone operacional do aluno/time.

---

## Checklist Para Qualquer Agente Que Implementar

Antes de implementar ou alterar Arena, confirmar:

- A Semanal usa `teamId`.
- A Mensal usa `teamId`.
- A Geral e global.
- O coach ve a Arena da empresa, nao uma Arena por coach.
- A Geral mostra `teamName` ao lado da dupla.
- O titulo da Semanal/Mensal mostra o nome da empresa.
- O app do aluno segue a mesma regra do painel.
- `visibleInArena = false` remove o aluno da listagem publica.
- Dados sensiveis nunca aparecem no ranking.
- Ranking e calculado no backend.
- Frontend recebe lista pronta, paginada quando necessario.
- Super Admin consegue filtrar por empresa.
- Admin/Coach nao conseguem vazar dados de outro `teamId`.
