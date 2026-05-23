# Página de Login do App GUTO — Roteiro Detalhado de Engenharia e Fluxo

> Documento complementar da Página de Login e do Controle de Acesso do GUTO. Em caso de conflito, a ordem soberana está em `PARTE_1_ABERTURA_IDIOMA_LOGIN.md`.

---

## O Que É A Página De Login

A página de login do GUTO é a chave de identidade e a barreira de segurança primária do app. Ela não é apenas um portal para digitação de e-mail e senha; ela funciona como o **orquestrador de fluxo e integridade operacional**.

No momento do login, o sistema decide o destino imediato do usuário com base no seu faturamento, no estado de atividade e no nível de conclusão de seu onboarding. Ela garante que o usuário certo acesse a memória certa e herde o comportamento correto, sem risco de cruzamento ou falsificação de dados.

---

## Objetivo Da Página De Login

O login deve resolver de forma sequencial e sem margem para erro quatro objetivos fundamentais:

```txt
1. Identificar quem é o usuário (Autenticidade).
2. Confirmar se ele tem acesso válido (Faturamento e Vínculo).
3. Conectar o usuário à sua memória operacional correta (Persistência).
4. Levar para o fluxo correspondente ao seu estado atual (Stage Router).
```

---

## 1. Formas de Conseguir Acesso e Login

Existem quatro portas de entrada possíveis para a autenticação no sistema:

### A. Convite de Admin, Empresa ou Coach (Fluxo B2B2C Principal)
- O Coach ou Admin cadastra o aluno no painel desktop.
- O sistema backend gera um token único associado ao e-mail do aluno e cria um link de onboarding (`/convite/[token]`).
- O aluno abre o link, que salva o token em `localStorage["guto-pending-invite-token"]` e abre a tela de criação de senha.
- O payload de herança do convite carrega as seguintes variáveis para o backend:
  ```json
  {
    "teamId": "id_do_time",
    "coachId": "id_do_treinador",
    "studentId": "id_do_aluno",
    "accessStatus": "invited",
    "presetName": "Nome Sugerido",
    "planId": "plano_vinculado",
    "expiresAt": "data_de_expiracao"
  }
  ```
- *Regra Soberana:* O `presetName` do convite é meramente consultivo. A identidade oficial da dupla só é gerada quando o aluno confirma ativamente seu nome na tela de Naming. O convite **nunca** rouba a identidade do aluno de forma automática.

### B. Conta Criada Manualmente pelo Admin/Coach
- O Admin cria o login e gera uma senha provisória de acesso.
- O aluno abre o `/login` normal, digita as credenciais provisórias e o sistema força a alteração de senha antes de dar andamento ao onboarding (consentimento -> naming -> calibragem -> pacto).

### C. Login de Usuário Já Ativo (Retorno)
- O aluno já completou todo o onboarding em sessões passadas.
- Insere seu E-mail/ID e senha.
- O backend devolve o token e o frontend consulta imediatamente a rota `/guto/memory`.
- O Stage Router avalia se o usuário já tem consentimento aceito, nome confirmado, calibragem realizada e pacto assinado. Estando tudo regularizado, o envia para o Sistema Principal (Aba Chat).

### D. Reativação ou Liberação de Novo Acesso (Billing/Pausa)
- Caso a assinatura tenha expirado, o GUTO tenha "morrido" por inatividade ou o Coach tenha pausado o aluno manualmente por falta de pagamento.
- Quando o Admin reativa o aluno no painel, o próximo login valida o status atualizado no backend e redireciona o aluno de volta para o sistema normal sem forçar uma nova calibragem.

---

## 2. Separação de Papéis (Vínculo de Login)

- **Login de Aluno:** Ocorre apenas no aplicativo móvel/web app (`/login`).
- **Login de Coach e Admin:** Ocorre em portais desktop separados (`/auth/coach/login` e `/auth/admin/login`).
- **Regras Estritas de Role:**
  - Alunos estão fisicamente e tecnicamente impedidos de acessar rotas do painel. Qualquer tentativa retorna redirecionamento instantâneo para `/`.
  - Coaches e Admins não acessam o app do aluno sem possuírem uma conta de teste do tipo `student` vinculada especificamente ao seu e-mail.
  - Um Coach não pode, sob nenhuma circunstância, herdar credenciais ou visualizar dados de alunos vinculados a equipes ou treinadores de outros times (Team Isolation).

---

## 3. Campos e Interface das Telas de Login

### Interface do Login Padrão
- **E-mail ou Usuário:** Input de texto limpo (não case-sensitive para e-mails).
- **Senha:** Input ocultado com botão de alternância visual (olho).
- **Botão "ENTRAR":** Executa a requisição POST e exibe spinner de carregamento.
- **Botão "Esqueci minha senha":** só deve aparecer quando o backend de recuperação existir. Até lá, a UI não pode fingir envio de e-mail.

### Interface do Claim de Convite (`/convite/[token]`)
- **Texto explicativo:** "Você foi convidado para o GUTO por [Nome do Coach/Time]" (no idioma selecionado).
- **Nome Sugerido:** pode ser exibido como contexto/rascunho vindo do `presetName`, mas não oficializa a identidade. O nome oficial da dupla só nasce no stage `naming`.
- **Campo "Criar Senha":** Requisito mínimo de 6 caracteres.
- **Campo "Confirmar Senha":** Validação visual de correspondência em tempo real.
- **Botão "ATIVAR MEU GUTO":** Realiza o POST de claim e autologa o aluno.

---

## 4. O Idioma na Tela de Login

- A tela de login herda imediatamente o idioma salvo em `localStorage["guto-selected-language"]` (escolhido na Página de Seleção de Idioma).
- Se o link do convite for aberto sem idioma previamente selecionado no navegador, a interface exibe de forma sutil o seletor de idiomas no topo direito da tela, permitindo ao usuário definir o idioma de leitura dos campos e termos antes de prosseguir com a criação da senha.
- **Zero Vazamento:** Mensagens de erro de login (ex: "Credenciais inválidas") devem ser traduzidas e exibidas rigidamente no idioma ativo da tela.

---

## 5. Fluxo Técnico da Autenticação

```txt
1. Usuário envia as credenciais (E-mail/Senha)
2. Frontend envia POST /auth/user/login (ou POST /auth/invite/:token/claim)
3. Backend valida as credenciais no banco de dados via hash bcrypt
4. Backend verifica o status de faturamento, inatividade e equipe do usuário
5. Backend responde com JWT assinado contendo dados básicos e expiração segura
6. Frontend armazena o token em localStorage["guto-auth-token"]
7. Frontend executa GET /guto/memory com o cabeçalho Authorization: Bearer {token}
8. O Stage Router do app analisa a resposta e decide o stage:
   ├── Se status no banco = "paused"         ──> Rota /acesso-pausado
   ├── Se status no banco = "dead"           ──> Rota /acesso-pausado?reason=dead
   ├── Se consentHealthFitness = false       ──> stage = "consent"
   ├── Se namingConfirmado = false           ──> stage = "naming"
   ├── Se calibragemIncompleta = true        ──> stage = "calibration"
   ├── Se pactoPendente = true               ──> stage = "pact"
   └── Se tudo estiver Ok e ativo            ──> stage = "system" (Hub)
```

---

## 6. Mapeamento de Estados e Destinos Após o Login

O sistema possui uma matriz rígida de estados de conta. O login valida essa matriz antes de renderizar qualquer componente interativo:

| Estado do Usuário | Condição no Backend | Destino Imediato no App | Mensagem Visual Exibida |
| :--- | :--- | :--- | :--- |
| **Novo por Convite** | `status = "invited"`, sem onboarding | `/consent` (Consentimento) | Interface de aceitação de termos. |
| **Incompleto** | `consent = true`, sem calibragem | `/calibration` (Calibragem) | "Falta pouco. Vamos calibrar seu corpo." |
| **Pacto Pendente** | Onboarding feito, pacto não assinado | `/pacto` (Assinatura) | "Hora de selar nossa dupla." |
| **Ativo Completo** | `status = "active"`, onboarding 100% | `/` (Aba Chat / GUTO) | "E aí, [Nome], pronto para hoje?" |
| **Acesso Pausado** | `status = "paused"` (Ação do Coach) | `/acesso-pausado?reason=paused` | "Seu acesso ao GUTO está pausado. Fale com seu coach para reativar." |
| **Assinatura Expirada**| `status = "subscription_expired"` | `/acesso-pausado?reason=expired`| "Sua assinatura expirou. Renove seu plano para continuar treinando." |
| **GUTO Morto** | `status = "dead"` (Longa inatividade) | `/acesso-pausado?reason=dead` | "O GUTO apagou. Este acesso terminou. Fale com o admin." |

---

## 7. Tratamento de Erros e Casos de Falha

### Convite Expirado ou Inválido
Se o token do convite for inválido, já tiver sido usado, ou pertencer a um time excluído, o app interrompe o avanço e exibe um modal estilizado:
> *"Este convite não é mais válido ou já foi utilizado. Peça um novo link de acesso ao seu coach."* (Renderizado no idioma ativo).

### Recuperação de Senha
- Fluxo futuro. Só pode aparecer na interface quando existir endpoint real de recuperação.
- Enquanto o backend não tiver esse endpoint, a interface deve exibir de forma honesta uma orientação para solicitar reset ao coach/admin, **nunca** simulando envio de e-mail ou token.

---

## 8. Segurança Rigorosa no Login

1. **Hash Bcrypt:** Senhas são criptografadas no backend de forma unidirecional com salt Bcrypt de custo mínimo 10. Nunca são salvas em texto limpo.
2. **Impedimento de Spoofing de ID:** O frontend nunca envia o `userId` em requisições de alteração de memória ou validação de treinos como prova de identidade. O backend extrai o ID do usuário diretamente da assinatura do JWT enviado no cabeçalho `Authorization`. Se o ID no token não bater com o recurso solicitado, a requisição é negada.
3. **Não Revelação de Motivos Sensíveis (Erro Genérico):** Para evitar varreduras de e-mails ativos na base por hackers, erros de digitação retornam a frase neutra:
   > *"E-mail ou senha inválidos."*
   O sistema nunca especifica se o erro foi na digitação do e-mail ou na digitação da senha.

---

## 9. Relação com a Memória e Painel Admin

- **Painel Desktop como Autoridade:** Se o Coach pressionar o botão "Pausar Aluno" no painel desktop, o status é alterado no banco de dados. Na próxima chamada de API feita pelo celular do aluno (ou no próximo login), o token é recusado ou o Stage Router redireciona o aluno na hora para a tela de acesso pausado.
- **Sincronia do Faturamento (Billing):** Webhooks de pagamento integrados ao Stripe atualizam o status de assinatura do aluno no banco de dados. O login consulta esse status a cada inicialização para validar se o usuário permanece ativo.

---

## 10. O Que Não Pode Acontecer (Restrições Críticas)

- O login não pode permitir que um usuário acesse as abas do app sem ter o status de assinatura válido e ativo no banco de dados.
- O sistema não pode pular nenhuma etapa obrigatória do onboarding (consentimento -> naming -> calibragem -> pacto).
- O login não pode expor mensagens de erro detalhadas contendo stack-traces do banco de dados ou motivos internos de segurança na tela do usuário.
- O login do aluno não pode ser utilizado para burlar o acesso e visualizar o painel administrativo de equipes.
