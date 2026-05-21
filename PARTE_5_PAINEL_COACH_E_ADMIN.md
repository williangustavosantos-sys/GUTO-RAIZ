# Parte 5 — Painel Admin e Coach

> Documento de fluxo de retaguarda, gestão B2B2C, escopo de acessos e segurança da plataforma GUTO. Leia depois da `Parte 4`.

## O Que Essa Parte Representa

Enquanto o aplicativo móvel do GUTO é o templo da experiência do aluno, o Painel Admin e Coach é o centro de controle e governança que transforma o GUTO em uma poderosa ferramenta B2B2C para treinadores, academias e equipes. Esta parte do sistema sustenta três promessas principais:

1. **Privacidade e Isolamento Estrito (Team Isolation)**: equipes e alunos são separados por muralhas de segurança. Um treinador ou equipe nunca pode ver, acessar ou vazar dados de alunos pertencentes a outro grupo.
2. **Operação Invisível de Apoio**: o Coach ajuda a ajustar os trilhos por trás (treinos, dietas, acompanhamento), mas para o aluno, quem conduz a rotina com personalidade na ponta continua sendo o GUTO.
3. **Imutabilidade de Mérito (XP/Streak Protegidos)**: o histórico de conquistas, dias consecutivos de treino (streak) e XP são sagrados. Nenhuma interferência manual externa pode fabricar ou apagar a consistência do usuário, preservando a confiança no ecossistema.

---

## 15) Arquitetura do Painel

O Painel é projetado exclusivamente para uso em computadores e navegadores desktop (`/admin` e `/coach`). Ele não concorre com o aplicativo móvel do aluno.

### Papéis e Escopo de Acesso (Roles)
- **Super Admin**: visão global de toda a plataforma, faturamento, criação de novos times, delegação de admins e auditoria irrestrita de dados.
- **Admin de Time/Academia**: gerencia os treinadores da sua equipe, cadastra alunos do seu escopo, altera configurações de faturamento local e acompanha relatórios de retenção do time.
- **Coach**: acesso operacional diário focado no acompanhamento de progresso, prescrição de treinos/dietas e monitoramento de abandono dos alunos vinculados diretamente a ele ou ao seu time.
- **Aluno (Student)**: não possui acesso ao painel de retaguarda. Seus fluxos são totalmente processados e consumidos dentro do aplicativo móvel.

---

## 16) Isolamento de Dados por Time (Team Isolation)

### A Regra de Ouro
A separação de dados no backend é garantida por identificadores exclusivos (`teamId` e `coachId`) amarrados a todas as tabelas de dados.
- O Coach A, pertencente ao Time Alfa, está fisicamente e tecnicamente impossibilitado de ler ou editar dados de alunos vinculados ao Time Beta.
- Mesmo que o Coach A descubra a URL direta ou o ID interno de um aluno do Time Beta, qualquer requisição de API à rota do painel retornará `403 Forbidden`.
- Os testes integrados (`guto-backend/tests/guto-team-isolation.test.ts`) rodam de forma contínua para garantir que nenhuma brecha de herança de rotas permita vazamento de dados corporais, fotos de validação ou contatos de e-mail de alunos entre equipes diferentes.

---

## 17) Ferramentas e Recursos do Coach

O painel fornece recursos completos para melhorar a assertividade e o suporte aos alunos:

1. **Criação de Alunos e Convites**: o Coach insere os dados de e-mail do aluno e o sistema gera o link exclusivo de convite (`/convite/[token]`) com validade segura.
2. **Visualização da Calibragem**: o Coach visualiza em tempo real as respostas físicas, limitações, país e restrições alimentares declaradas pelo aluno no onboarding.
3. **Edição e Bloqueio de Treino (Manual Override)**: o GUTO gera treinos adaptativos, mas o Coach tem o poder supremo de prescrever manualmente o treino da semana ou bloquear exercícios específicos. Quando o Coach edita o treino, ele se torna o `lastWorkoutPlan` oficial no celular do aluno imediatamente.
4. **Prescrição Nutricional (Dieta)**: o Coach pode montar o menu calórico e indicar as refeições ideais de acordo com as restrições alimentares já herdadas da calibragem.
5. **Painel de Retenção e Risco de Abandono**: o sistema analisa os padrões de presença (último treino validado, última mensagem no chat, streaks) e destaca em sinalização visual (Vermelho / Amarelo / Verde) os alunos que estão há mais de 3, 5 ou 7 dias sem interagir com o GUTO. Isso permite que o Coach envie mensagens externas de suporte antes do abandono definitivo.
6. **Controle de Acesso**: o painel permite pausar, reativar ou arquivar permanentemente o acesso de um aluno (ex: em caso de inadimplência ou fim do plano contratado), disparando imediatamente a tela `/acesso-pausado` correspondente no celular do usuário.

---

## 18) Imutabilidade de XP e Streak

O painel permite que o Coach edite treinos e dietas, mas restringe severamente a alteração de dados de engajamento do aluno.
- **XP e Streak são imutáveis por edição manual**: um Coach ou Admin não possui campos na interface para aumentar, reduzir ou apagar o XP ou a quantidade de dias consecutivos (streak) de um aluno.
- **Justificativa**: essas duas métricas representam o esforço e a presença real do aluno em relação ao GUTO. Permitir edições manuais abre brechas para perda de credibilidade do game do app, além de descompassos na sincronia de estados entre Arena, Percurso e evolução do Avatar. Se um aluno perdeu o treino, ele precisa reatar a consistência no dia seguinte de forma limpa.
