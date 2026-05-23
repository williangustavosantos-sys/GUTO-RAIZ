# Parte 5 — Painel Admin e Coach

> Documento de fluxo de retaguarda, gestão B2B2C, escopo de acessos e segurança da plataforma GUTO. Leia depois da `Parte 4`.

## Estado Do Documento

Este documento resume o papel do painel na arquitetura do GUTO. O detalhamento operacional completo fica em `GUTO_PAINEL_ADMIN_E_COACH_DETALHADA.md`, que é a fonte principal para implementação do painel.

Decisões atuais que todo agente deve respeitar:
- O GUTO é uma plataforma única multiempresa.
- A unidade comercial principal é a Empresa/Team.
- Toda empresa tem plano, limites de coaches e limites de alunos.
- Todo coach pertence a uma empresa.
- Todo aluno pertence a uma empresa e a um coach.
- Não existe aluno sem `teamId`.
- Não existe aluno sem `coachId`.
- Alunos avulsos comprados pela internet entram em uma Team interna do GUTO, com nome a definir.
- Arena Semanal e Mensal são por empresa/time.
- Arena Geral é global e mostra o nome da empresa ao lado da dupla.
- Telefone é permitido para empresa/responsável comercial/admin, mas continua proibido na memória/calibragem do aluno.

## O Que Essa Parte Representa

Enquanto o aplicativo móvel do GUTO é o templo da experiência do aluno, o Painel Admin e Coach é o centro de controle e governança que transforma o GUTO em uma poderosa ferramenta B2B2C para treinadores, academias e equipes. Esta parte do sistema sustenta três promessas principais:

1. **Privacidade e Isolamento Estrito (Team Isolation)**: equipes e alunos são separados por muralhas de segurança. Um treinador ou equipe nunca pode ver, acessar ou vazar dados de alunos pertencentes a outro grupo.
2. **Operação Invisível de Apoio**: o Coach ajuda a ajustar os trilhos por trás (treinos, dietas, acompanhamento), mas para o aluno, quem conduz a rotina com personalidade na ponta continua sendo o GUTO.
3. **Imutabilidade de Mérito (XP/Streak Protegidos)**: o histórico de conquistas, dias consecutivos de treino (streak) e XP são sagrados. Nenhuma interferência manual externa pode fabricar ou apagar a consistência do usuário, preservando a confiança no ecossistema.

---

## 15) Arquitetura do Painel

O Painel é uma experiência de navegador para operação interna e B2B. Ele deve funcionar bem em desktop, iPad/tablet e celular, sem concorrer com o app do aluno.

Rotas principais:
- `/admin`: Sala de Controle do Super Admin.
- `/empresa`: Portal da Empresa/Admin de Team.
- `/coach`: Portal do Coach.

A hierarquia operacional é sempre:

```txt
Super Admin
  -> Empresas / Teams
    -> Coaches
      -> Alunos
```

O Super Admin começa pela empresa porque ela é a unidade que paga, possui plano, limites e responsabilidade operacional.

### Papéis e Escopo de Acesso (Roles)
- **Super Admin**: visão global de toda a plataforma, criação de empresas, planos, limites, auditoria, acesso a todos os times e leitura de todos os fluxos.
- **Admin de Empresa/Team**: vê somente a própria empresa, seus coaches, seus alunos, seus limites de plano, suas pendências e sua arena de empresa.
- **Coach**: acesso operacional diário aos alunos vinculados a ele dentro da empresa. O coach vê a arena da empresa, não uma arena separada apenas dos próprios alunos.
- **Aluno (Student)**: não possui acesso ao painel de retaguarda. Seus fluxos são totalmente processados e consumidos dentro do aplicativo móvel.

---

## 16) Isolamento de Dados por Time (Team Isolation)

### A Regra de Ouro
A separação de dados no backend é garantida por identificadores exclusivos (`teamId` e `coachId`) amarrados a todas as tabelas de dados.
- O Coach A, pertencente ao Time Alfa, está fisicamente e tecnicamente impossibilitado de ler ou editar dados de alunos vinculados ao Time Beta.
- Mesmo que o Coach A descubra a URL direta ou o ID interno de um aluno do Time Beta, qualquer requisição de API à rota do painel retornará `403 Forbidden`.
- Os testes integrados (`guto-backend/tests/guto-team-isolation.test.ts`) rodam de forma contínua para garantir que nenhuma brecha de herança de rotas permita vazamento de dados corporais, fotos de validação ou contatos de e-mail de alunos entre equipes diferentes.

### Regras De Existência
- Empresa só existe se criada pelo Super Admin ou por fluxo autorizado.
- Coach só existe dentro de uma empresa.
- Aluno só existe dentro de uma empresa e vinculado a um coach.
- Aluno avulso da internet também entra em uma empresa interna do GUTO. A diferença é comercial, não técnica.
- Todo cadastro precisa respeitar o limite de plano da empresa.

### Planos e Limites
Cada plano vendido define:
- limite máximo de coaches;
- limite máximo de alunos;
- status da empresa;
- permissões futuras de recursos.

O painel deve mostrar uso e limite juntos, por exemplo:
- `Coaches: 3 / 5`
- `Alunos: 42 / 60`

Quando o limite estiver perto de estourar, o painel deve mostrar alerta operacional. Quando estiver estourado, o painel deve impedir novos cadastros até upgrade, liberação manual ou ajuste do plano.

---

## 17) Ferramentas e Recursos do Coach

O painel fornece recursos completos para melhorar a assertividade e o suporte aos alunos:

1. **Criação Hierárquica**: empresa -> coach -> aluno -> convite. A ordem importa. Não há aluno solto.
2. **Dados Comerciais Da Empresa**: nome, responsável, e-mail, telefone, documento, cidade/país, plano e limites. O telefone é essencial aqui, mas não pertence à memória do aluno.
3. **Criação de Alunos e Convites**: o coach/admin insere dados mínimos do aluno e o sistema gera convite seguro. O aluno completa idioma, nome e calibragem no app.
4. **Visualização e Edição Controlada da Calibragem**: coach/admin visualizam idade, sexo biológico, nível, objetivo, local, dor/limitação, altura, peso, país, cidade e campo único NÃO COMO. Edição futura deve ser por campos validados, nunca JSON cru.
5. **Edição e Bloqueio de Treino (Manual Override)**: o GUTO gera treinos adaptativos, mas o coach pode prescrever manualmente o treino da semana e marcar `lockedByCoach`. Quando bloqueado, o GUTO não sobrescreve automaticamente.
6. **Prescrição Nutricional (Dieta)**: a dieta segue o mesmo padrão do treino. O coach pode revisar/editar plano alimentar, respeitando calorias, macros, país/cidade e o campo NÃO COMO. Se bloquear, o GUTO não substitui automaticamente.
7. **Painel de Retenção e Risco de Abandono**: o sistema classifica alunos ativos sem sinal:
   - `Atenção`: 3 a 5 dias sem validação/chat/sinal.
   - `Crítico`: 6 ou mais dias sem validação/chat/sinal.
   - `Convite pendente`, `Sem primeiro acesso`, `Pausado`, `Arquivado`, `Expirado` e `GUTO morto` são status separados e não entram como crítico operacional normal.
8. **Arena Da Empresa e Arena Geral**:
   - Empresa, coach e aluno veem Arena Semanal e Mensal da própria empresa/time.
   - Arena Geral é global e mostra a empresa ao lado da dupla.
   - Super Admin consegue ver tudo.
9. **Controle de Acesso**: o painel permite pausar, reativar, renovar ou arquivar acesso do aluno conforme permissão. Isso reflete imediatamente no app.
10. **Auditoria**: alterações de treino, dieta, calibragem, acesso e plano precisam gerar log com ator, alvo, horário e resumo da mudança.

---

## 18) Imutabilidade de XP e Streak

O painel permite que o Coach edite treinos e dietas, mas restringe severamente a alteração de dados de engajamento do aluno.
- **XP e Streak são imutáveis por edição manual**: um Coach ou Admin não possui campos na interface para aumentar, reduzir ou apagar o XP ou a quantidade de dias consecutivos (streak) de um aluno.
- **Justificativa**: essas duas métricas representam o esforço e a presença real do aluno em relação ao GUTO. Permitir edições manuais abre brechas para perda de credibilidade do game do app, além de descompassos na sincronia de estados entre Arena, Percurso e evolução do Avatar. Se um aluno perdeu o treino, ele precisa reatar a consistência no dia seguinte de forma limpa.

---

## 19) Escalabilidade Do Painel

O painel não pode carregar todos os alunos no navegador para calcular métricas. Isso quebraria quando existirem milhares ou milhões de alunos.

Regras:
- KPIs globais vêm agregados do backend.
- Lista de empresas é paginada.
- Detalhe da empresa mostra coaches e alunos paginados.
- Busca de aluno deve ser server-side quando houver base grande.
- Super Admin vê primeiro empresas, não uma lista gigante de alunos.
- Para achar aluno específico, o operador entra na empresa/coach ou usa busca global.

---

## 20) Estado Atual E Próximas Fases Do Painel

Status documentado para retomada futura:
- A base visual do painel foi criada com `/admin`, `/empresa` e `/coach`.
- A visão geral do Super Admin já foi reorientada para empresas, planos, limites e agregados.
- O detalhe da empresa foi iniciado como leitura/visualização.
- O botão `+ Nova empresa` mostra preview informativo dos campos e regras, mas ainda não cria empresa real.
- A criação real de empresa, coach, aluno e convite depende de endpoints/backend e validações.
- Detalhe do Coach e Detalhe do Aluno ainda precisam ser finalizados.
- Edição de calibragem pelo painel deve esperar endpoint dedicado validado.
- Treino e dieta editáveis pelo painel devem respeitar `lockedByCoach`.
- Backend real agregado `/admin/panel/*` ainda deve substituir mocks.

Próxima retomada recomendada:
1. Finalizar Detalhe do Coach em modo leitura.
2. Finalizar Detalhe do Aluno em modo leitura, com abas Resumo, Calibragem, Treino, Dieta, Arena, Histórico e Acesso.
3. Criar backend agregado com escopo por role/team.
4. Criar endpoint validado de calibragem.
5. Só então liberar edição real de treino, dieta, acesso e cadastro.
