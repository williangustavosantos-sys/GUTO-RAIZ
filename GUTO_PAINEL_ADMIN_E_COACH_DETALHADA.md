# Painel Admin e Coach do GUTO — Roteiro Detalhado de Engenharia

> Documento canônico de especificação do Painel B2B2C Desktop, Gestão de Alunos, Isolamento de Equipes (Team Isolation) e Segurança Operacional.

---

## O Que É O Painel Admin do GUTO

O Painel Admin e Coach do GUTO é o cérebro empresarial e operacional da plataforma. Projetado exclusivamente para interfaces de navegadores desktop, ele serve de portal de gestão para academias, estúdios, boxes de crossfit, personal trainers e empresas corporativas.

Enquanto o aplicativo móvel do aluno é o templo da experiência emocional, o painel desktop é a **central de governança comercial**.

O painel não concorre ou substitui o GUTO. Ele o alimenta. 
- O profissional de educação física define as diretrizes, edita os treinos, prescreve as dietas e acompanha as métricas.
- O GUTO absorve essas mudanças no backend e as conduz na ponta de forma amigável, direta e viva para o aluno no celular.

---

## O Problema Comercial da Escala B2B2C

O grande gargalo de treinadores físicos e academias corporativas é a capacidade de entrega individualizada. Um personal trainer tradicional consegue atender com atenção no máximo 10 a 15 alunos de forma manual. Ao tentar escalar, a qualidade da entrega decai por falta de tempo.

O Painel do GUTO resolve a escala: o Coach planeja e opera a retaguarda, enquanto o GUTO automatiza a presença, a cobrança, o GUTO Online e a motivação diária série por série na ponta.

---

## Hierarquia Estrita de Papéis (Roles)

O sistema possui uma segregação de permissões rígida baseada em claims no token JWT:

```txt
  [ Super Admin ]  ➔ Visão global de todas as empresas, faturamento e auditoria total.
         │
         ▼
  [ Admin de Time ]➔ Gerencia a academia/unidade, seus coaches e seus alunos.
         │
         ▼
  [ Coach/Personal]➔ Edita treinos, dietas, analisa riscos e acompanha alunos vinculados.
         │
         ▼
  [ Aluno (Student) ]➔ Usa apenas o app celular. Bloqueado contra acessos ao painel.
```

- **Super Admin:** O nível supremo. Modula as regras comerciais de limites de licenças, cria novas empresas e possui acesso a logs de auditoria global.
- **Admin de Time/Empresa:** Escopado para a sua própria organização (academia ou unidade). Gerencia sua equipe de treinadores, fatura planos corporativos e visualiza os rankings internos de sua unidade.
- **Coach / Treinador:** Nível operacional de atendimento diário. Insere treinos, bloqueia dietas, edita dados de calibragem física e acompanha relatórios de desistência dos alunos amarrados diretamente a ele ou ao seu time.
- **Aluno (Student):** Totalmente isolado do painel. Qualquer requisição vinda de contas estudantis às rotas `/admin` ou `/coach` é interceptada no backend com negação `403 Forbidden` e redirecionamento de segurança.

---

## A Regra de Ouro: Isolamento de Dados (Team Isolation)

Toda e qualquer tabela de dados sensíveis de usuários (peso, altura, limitações, fotos de validação, e-mails de cadastro) herda obrigatoriamente a tag `teamId`.

### Bloqueio Técnico Estrito
- Um Coach do Time Alfa está fisicamente e tecnicamente impedido de ler ou alterar registros de alunos do Time Beta.
- Se o Coach do Time Alfa tentar injetar IDs de alunos do Time Beta via requisições diretas de API ou URLs adulteradas, o backend intercepta o `teamId` contido no token JWT do Coach e nega a operação retornando `403 Forbidden`.
- Os testes automáticos (`guto-backend/tests/guto-team-isolation.test.ts`) rodam de forma contínua no pipeline para certificar que nenhum vazamento acidental ocorra. Vazamento de dados pessoais entre empresas parceiras é considerado falha técnica crítica gravíssima de compliance (GDPR/LGPD).

---

## O Fluxo de Onboarding via Convite

O cadastro de novos alunos no painel estabelece uma ponte automatizada com o aplicativo celular:

```txt
1. Coach preenche E-mail e Nome Sugerido no Painel Desktop
2. Backend cria o perfil estudantil com status "invited" e teamId/coachId amarrados
3. Backend gera um token exclusivo de convite
4. O link de onboarding é enviado (/convite/[token])
5. O Aluno abre o link no celular
6. O sistema executa o fluxo (idioma ➔ senha ➔ termos ➔ nome ➔ calibragem ➔ pacto)
7. Aluno ativa a conta no celular
8. Painel Desktop atualiza o status do aluno para "active" em tempo real
```

- *Aviso de Soberania:* O nome digitado e confirmado pelo aluno na Página de Naming é lei. Ele sobrescreve na hora o nome provisório (presetName) registrado pelo Coach no convite inicial.

---

## Visão Geral das Abas do Perfil do Aluno no Painel

Ao clicar no registro de um aluno na lista consolidada, o treinador abre a ficha clínica e esportiva do aluno, dividida em abas:

### A. Aba Resumo (Métricas de Engajamento)
Exibe gráficos rápidos de consistência, o estágio do avatar (`Baby`, `Teen`, `Adult`, `Elite`), dias de streak ativo, total de XP, data do último treino validado e o sinalizador gráfico de **Risco de Abandono**:
- **Verde (Risco Baixo):** Treinou e interagiu nas últimas 48 horas.
- **Amarelo (Atenção):** Sem validações ou chat de 3 a 5 dias.
- **Vermelho (Risco Alto):** Mais de 5 dias sumido. Alerta o treinador para intervenção manual rápida.

### B. Aba Calibragem (Ficha Biológica)
Exibe as variáveis preenchidas no onboarding (idade, peso, altura, intolerâncias, país, dores). O Coach pode fazer pequenos ajustes nesses campos se solicitado pelo aluno. Quaisquer alterações aqui modificam a memória ativa no backend e recalculam as variáveis de treino e dieta do app celular imediatamente.

### C. Aba Treino (Editor de Exercícios)
O Coach visualiza o treino em execução e possui a ferramenta de montagem de treinos manuais, escolhendo exercícios do catálogo oficial e alterando séries, repetições, tempos de descanso e cargas sugeridas.
- **Regra do Coach Lock:** Ao travar um treino manual para o aluno, o backend marca `lockedByCoach = true`. O GUTO está impedido de reescrever este plano automaticamente. O GUTO Online no celular usará este treino, agindo sob rédeas seguras impostas pelo treinador.

### D. Aba Dieta (Menu Nutricional)
Permite a visualização e edição das porções diárias de refeições e o balanço calórico. O editor barra a prescrição de alimentos proibidos pelas intolerâncias de calibragem do aluno (ex: barra laticínios normais se houver marcação de intolerância a lactose). Também conta com a trava de segurança `lockedByCoach: true`.

### E. Aba Histórico (Linha do Tempo)
Diário operacional de auditoria do aluno. Exibe todas as fotos de validações físicas enviadas pela câmera, as notas pós-treino ("Foi fácil", "Senti dor"), as queixas de dores articulares relatadas e os registros de XP recebidos.

### F. Aba Acesso (Controle de Status)
- **Ativo:** Acesso liberado ao app principal.
- **Pausado / Expirado / Arquivado:** Altera a conta no banco de dados. Na mesma hora, o interceptor de requisições do celular do aluno detecta o status bloqueado e redireciona a interface móvel para a tela `/acesso-pausado` no idioma correto.

---

## O Mecanismo de Logs de Auditoria do Painel

Toda ação executada por profissionais que afete dados, faturamento ou status de acessos de alunos gera um log imutável no banco de dados, contendo metadados de segurança:
- `timestamp`: Data e hora exatas da ação.
- `operatorId`: ID do profissional (Admin ou Coach) que realizou o comando.
- `operatorRole`: Papel hierárquico do operador.
- `targetUserId`: Aluno que recebeu a alteração.
- `actionType`: Tipo da ação (`workout_locked`, `diet_modified`, `access_paused`, `invite_generated`).
- `metadata`: JSON contendo o valor antigo e o valor novo para auditoria B2B de segurança.

---

## Planos Comerciais B2B e Limites de Licenças

O sistema gerencia limites técnicos de volumetria de acordo com a categoria de plano faturada e integrada ao Stripe:
- **Plano Start:** Permite até 2 Coaches e 20 alunos ativos simultaneamente.
- **Plano Pro:** Permite até 4 Coaches e 50 alunos ativos simultaneamente.
- **Plano Elite:** Permite até 6 Coaches e 70 alunos ativos simultaneamente.
- **Plano Custom:** Volumetria configurável de treinadores e alunos sob demanda corporativa.

O backend bloqueia a criação de novos convites de alunos caso os limites técnicos contratados pelo `teamId` tenham sido atingidos, alertando o Administrador da Empresa para realizar o upgrade de plano.

---

## A Camada Emocional: "O Que o Usuário Não Vê"

Embora o painel desktop seja uma interface fria de tabelas corporativas, o GUTO atua como um tradutor de tom emocional na ponta móvel.
- Quando o Coach edita o supino reto para 4 séries de 10 reps e adiciona uma observação no painel, o aplicativo móvel **não** exibe uma mensagem estéril de sistema como: *"Seu administrador atualizou seu registro de treino."*
- A aba Missão é atualizada silenciosamente e, na próxima interação no Chat, o GUTO assume a fala de melhor amigo de forma natural:
  > *"Will, teu treinador deu uma mexida na nossa missão de supino para hoje. Ele quer consistência e postura, então reduzi a carga sugerida e coloquei 4 séries limpas de 10. Eu te guio, vamos fazer bem feito."*

---

## O Que Não Pode Acontecer (Restrições Críticas)

- **Vazamento de Dados (Leak de Equipes):** Coaches ou admins de um time visualizarem, buscarem ou realizarem mutações em dados pertencentes a alunos de outras equipes. **P0 Crítico de Compliance**.
- **Quebrar a Soberania do Nome:** O painel desktop sobrescrever o Nome Soberano do aluno confirmado na Página de Naming pelo nome registrado no cadastro inicial do convite.
- **Burla de Contas Mortas:** O painel permitir que o Coach crie treinos e force a volta ao sistema de alunos que estão marcados com o status de `dead` (GUTO morto), sem passar pela liberação financeira e reativação comercial formal do faturamento.
- **Edição Direta de XP e Streak:** Disponibilizar botões ou campos de inputs para o Coach alterar manualmente o saldo de XP, streak ou nível de evolução do avatar do aluno. Essas métricas são frutos de mérito real e consistência física documentada no Percurso.
- **Bypass de Termos:** Gerar convites que iniciem o aluno no aplicativo de forma direta no Sistema Principal, pulando as etapas obrigatórias de Consentimento Legal e de Saúde e a Calibragem inicial no celular.
- **Prescrever Alimentos Proibidos:** O painel permitir a gravação de planos dietéticos contendo ingredientes explicitamente marcados como alergias graves do aluno no campo "NÃO COMO" de calibragem.
- **Acesso de Alunos:** Alunos conseguirem de alguma forma ignorar as travas do router e logarem nos portais administrativos de retaguarda.
