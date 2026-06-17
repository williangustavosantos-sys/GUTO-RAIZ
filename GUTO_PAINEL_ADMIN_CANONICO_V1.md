# GUTO — Painel ADMIN / EMPRESA / COACH (Documento Canônico Operacional V1)

> **Status:** Fonte canônica operacional do painel web B2B do GUTO.
> **Versão:** V1 — consolidação tela-por-tela, papel-por-papel, fluxo-por-fluxo.
> **Data:** 2026-05-27.
> **Escopo desta tarefa:** documentação. **Nenhum código foi alterado, nenhum merge foi feito, nenhum arquivo foi removido.** Este documento descreve como o painel **deve** funcionar e como ele se conecta ao app do aluno, cruzado com o código real auditado.
> **Para implementar a partir daqui não é preciso perguntar "o que é o painel?".** Tudo está aqui: rotas, papéis, telas, botões, campos, endpoints, erros, critérios de pronto, GAPs.

---

## Índice

1. [Autoridade do Documento](#1-autoridade-do-documento)
2. [Estado Atual Resumido](#2-estado-atual-resumido)
3. [Hierarquia Operacional](#3-hierarquia-operacional)
4. [Papéis e Permissões](#4-papéis-e-permissões)
5. [Login e Redirecionamento](#5-login-e-redirecionamento)
6. [Fluxo Super Admin — Tela por Tela](#6-fluxo-super-admin--tela-por-tela)
7. [Fluxo Empresa / Company Admin — Tela por Tela](#7-fluxo-empresa--company-admin--tela-por-tela)
8. [Fluxo Coach — Tela por Tela](#8-fluxo-coach--tela-por-tela)
9. [Detalhe do Aluno — Conexão com o App](#9-detalhe-do-aluno--conexão-com-o-app)
10. [Rotas Canônicas](#10-rotas-canônicas)
11. [Endpoints e Contratos](#11-endpoints-e-contratos)
12. [O Que NÃO Deve Existir](#12-o-que-não-deve-existir)
13. [Critérios de Pronto](#13-critérios-de-pronto)
14. [Plano de Implementação Depois do Documento](#14-plano-de-implementação-depois-do-documento)
15. [Gaps Obrigatórios](#15-gaps-obrigatórios)
16. [Internacionalização](#16-internacionalização)
17. [Relatório Final desta Tarefa](#17-relatório-final-desta-tarefa)

---

## 1. Autoridade do Documento

Este arquivo (`GUTO_PAINEL_ADMIN_CANONICO_V1.md`) é a **fonte canônica operacional do painel web do GUTO**. Quando este documento conflitar com qualquer documento anterior sobre o painel, **este vence para fins de produto/operação**, porque foi escrito cruzando os documentos antigos com o **código real auditado** (frontend `guto-app-v0` e backend `guto-backend`) em 2026-05-27.

Hierarquia de autoridade entre os documentos de painel:

| Documento | Papel | Autoridade |
|---|---|---|
| **`GUTO_PAINEL_ADMIN_CANONICO_V1.md`** (este) | **Canônico operacional de produto.** Telas, papéis, fluxos, idioma, conexão com o app, GAPs. | **Prevalece** para entendimento de produto e operação. |
| `PARTE_5_PAINEL_COACH_E_ADMIN.md` | Resumo executivo (ponteiro). | Defere a este documento. |
| **`design_handoff_guto_coach_panel/`** | **Design canônico do painel** (protótipo HTML/JSX, hi-fi, tema LIGHT, desktop-first: `Login` + `Sala de Controle` + `Empresa Portal` + `Coach Portal`). | **Referência visual oficial.** Não é runtime, mas o cockpit `/coach` **já segue** seus tokens (sidebar navy + conteúdo claro + acento ciano `#0E7490`). Tokens, layout, copy e regras de Arena por portal são referência fiel. |

**Regra para qualquer agente:** leia `README.md`, depois este documento (produto) e o código real do painel (`guto-app-v0/app/coach/` + `guto-backend/src/admin-router.ts`) antes de tocar qualquer código do painel.

### Design canônico do painel (decisão — fim da dúvida dos dois designs)

- **Design canônico = `design_handoff_guto_coach_panel/`** — hi-fi, **tema LIGHT**, **desktop-first**, com os portais reais: **Login → Sala de Controle (super admin) → Empresa Portal → Coach Portal**. Última sincronização: 2026-05-23. O README do handoff manda usar a versão **LIGHT** (a dark foi removida).
- **Descontinuado: `GUTO Design System/painel-comando/`** ("GUTO · COMANDO — Painel ADM", mobile/cockpit 390×844, de 2026-05-17). Foi **removido** do disco — **não é referência**. (Conflita com a decisão de produto "painel é desktop-first" — ver §17.)
- **A implementação segue o design:** o cockpit real em `guto-app-v0/app/coach` já adota os tokens do handoff (sidebar navy escura + conteúdo claro + ciano). Design e código estão na mesma linguagem visual.
- **Regra simples:** *design do painel* → `design_handoff_guto_coach_panel/` · *implementação* → `app/coach` · `painel-comando/` → morto.

---

## 2. Estado Atual Resumido

> Auditado no código real em 2026-05-27 e revisado novamente em 2026-06-17. Esta seção corrige os "Estados Atuais" desatualizados dos documentos antigos.

### 2.1 O que JÁ EXISTE e funciona (✅)

- **Backend admin canônico (`/admin/*`)** — `guto-backend/src/admin-router.ts` (2212 linhas), real e testado. Cria/edita/lista empresa, coach, aluno; gera/edita/trava treino e dieta; convite; aprovações; logs; planos.
- **Login real do painel** — `POST /auth/admin/login` e `POST /auth/coach/login` (bcrypt + JWT). Tela em `app/admin/login/page.tsx`, com seletor de 3 idiomas (PT/IT/EN) e seletor visual de papel.
- **Painel operacional único em `/coach`** — `app/coach/page.tsx` + cockpit (`_components/`, `_hooks/`), ligado à API real via `lib/api/admin.ts`. **Atende super_admin, admin e coach no mesmo cockpit, com escopo por papel.**
- **Isolamento de time** — validado em runtime no backend (`auth-middleware.ts`), coberto por testes (`guto-team-isolation.test.ts`, 55 passes).
- **Planos e limites** — `team-plans.ts` (Start/Pro/Elite/Custom), bloqueio de capacidade via `ensureTeamPlanCapacity`.
- **Convite** — `invite-store.ts` (token SHA-256, expira em 7 dias, claim → +30 dias).
- **Hierarquia já refletida no menu** — a sidebar do cockpit já trata "Coaches dentro da empresa (drawer)" e "Treino/Dieta dentro do aluno (drawer)" — **não há mais aba global de Coaches/Treino/Dieta na navegação** (`cockpit-layout.tsx`, `NAV_ITEMS`).

### 2.2 O que está PARCIAL (🟡)

- **Detalhe do aluno** — abas reais hoje: **Resumo, Calibragem, Treino, Dieta, Validações, Histórico, Acesso** (7 abas; `utils.ts → DETAIL_TABS`). A visão alvo ainda pede **Arena, XP/Evolução, Percurso e Logs do aluno** como abas dedicadas (parte dessas informações fica diluída em Resumo/Histórico/Validações). GAP G-09.
- **Status de onboarding** — derivado da `GutoMemory` no frontend; não há campo único `onboardingStage` no backend. GAP G-04.
- **Edição de calibragem** — flui por `PATCH /admin/students/:id` com objeto `calibration`; **não existe** endpoint dedicado validado por campo com auditoria before/after. GAP G-05.
- **i18n do cockpit** — existe base `panel-i18n` PT/EN/IT e parte do cockpit já usa idioma persistido, mas ainda há labels/toasts hardcoded em PT. Portanto é **parcial**, não 100%. GAP G-08.
- **Códigos de acesso** — backend emite só `ACCESS_PAUSED` e `SUBSCRIPTION_EXPIRED`; `GUTO_DECEASED/GUTO_DEAD` é tratado no interceptor do frontend mas o backend **não emite** (morte não implementada). GAP G-07.

### 2.3 O que segue FUTURO/PARCIAL (🟣)

- **Morte do GUTO por XP zerado:** `GUTO_DECEASED/GUTO_DEAD` é tratado como possibilidade no cliente, mas o backend ainda não implementa `gutoLifeStatus`, `deadAt` nem guard 403 de morte. GAP G-07.
- **i18n 100% do cockpit:** base parcial existe, mas não cobre todo texto operacional. GAP G-08.
- **Documentos antigos desatualizados:** descrevem `/admin` como Sala mock e `/empresa` como stub recebendo o operador. **Não é mais verdade** (ver 2.4).

### 2.4 O que era LEGADO/MOCK e foi RESOLVIDO

- **`/admin` e `/empresa` agora são apenas redirect para `/coach`** (`app/admin/page.tsx` e `app/empresa/page.tsx` renderizam `<LegacyPanelRedirect />`; regra em `lib/panel-rules.ts → legacyPanelRedirectTarget`). A UI mock (`lib/panel/data-source.ts`, `IS_MOCK_DATA`) **não é mais alcançável por essas rotas**. O risco de "vazamento de mock" descrito nos docs antigos está **mitigado**.
- **Rotas legadas de coach no backend (`/guto/coach/*`)** — desativadas por padrão (`410 LEGACY_COACH_ROUTES_DISABLED`); só `/guto/coach/rankings` (Arena) permanece ativo.
- **Threshold de risco alinhado** — o código atual usa Verde ≤48h · Atenção 3–5 dias · Crítico ≥6 dias (`studentRisk` em `utils.ts`).
- **Telas órfãs globais removidas do fluxo ativo** — `Screen`/`ActiveScreen` atuais não expõem `coaches`, `treinos` e `dietas` como telas globais; coach fica no drawer da empresa e treino/dieta no drawer do aluno.
- **Selfie obrigatória implementada** — validação sem `imageBase64` retorna `SELFIE_REQUIRED`; XP/Arena só entram com evidência.

### 2.5 O que precisa virar GAP (resumo; detalhe em §15)

Onboarding-stage dedicado, endpoint validado de calibragem, abas faltantes do aluno (Arena/XP/Percurso/Logs), i18n completa do cockpit, emissão de código de morte, role dedicada de empresa (ver §4.5).

---

## 3. Hierarquia Operacional

A hierarquia é **estrita e não-negociável**. Toda entidade nasce dentro da entidade pai. Não existe entidade solta.

```txt
Super Admin
  └── Empresa / Team (teamId)            ← unidade comercial B2B pagante
        ├── Coach (coachId, teamId)      ← pertence a UMA empresa
        │     └── Aluno (userId, coachId, teamId)
        │           └── Dados do aluno:
        │                 Calibragem · Memória (GutoMemory) · Treino · Dieta ·
        │                 XP/Streak · Arena · Percurso/Validações · GUTO Online ·
        │                 Convite/Acesso · Logs
        └── Arena Semanal/Mensal da empresa (escopo teamId)

Arena Geral = global (todas as empresas), com teamName ao lado da dupla.
```

Regras estruturais (validadas no backend):

- **Não existe aluno sem `teamId` e sem `coachId`.** (`auth-middleware.ts` normaliza `teamId` para `GUTO_CORE` quando ausente; isolamento sempre por `teamId`.)
- **Coach só existe dentro de uma empresa** (`teamId` obrigatório ao criar coach).
- **Aluno em empresa cliente exige coach real** (`400 GUTO_COACH_REQUIRED` se faltar — ver §11).
- **`GUTO_CORE_TEAM_ID` = `"GUTO_CORE"`** é a empresa interna do GUTO para alunos diretos/B2C e para alunos internos do super admin. **Não conta como cliente B2B** nas métricas (`lib/panel-rules.ts → clientTeams/activeClientTeams`). É a **única exceção documentada** à regra "aluno precisa de coach": super admin pode ter alunos internos em GUTO_CORE sem coach explícito.
- **Treino e dieta NÃO são entidades globais.** Eles vivem **dentro do aluno**. Coach vive **dentro da empresa**.

---

## 4. Papéis e Permissões

Quatro papéis no token JWT (`auth-middleware.ts → GutoJwtPayload.role`): `super_admin`, `admin`, `coach`, `student`.

Helpers reais:
- `requireSuperAdmin` → só `super_admin`.
- `requireAdmin` / `isAdminRole` / `requireSuperAdminLike` → `admin` **ou** `super_admin`.
- `requireCoachOrAdmin` → `admin`, `super_admin` ou `coach`.
- `canAccessUserAccess(actor, target)` → super_admin vê tudo; admin vê o próprio `teamId`; coach vê só `student` com `coachId === actor.userId` no próprio `teamId`; student não acessa nada administrativo.

### 4.1 Tabela mestra de permissões

Legenda: ✅ pode · ❌ não pode · 🟢 só do próprio escopo (time/coach) · ➖ não se aplica.

| Capacidade | super_admin | admin (empresa) | coach | student |
|---|:---:|:---:|:---:|:---:|
| Acessa o painel web | ✅ | ✅ | ✅ | ❌ (`ADMIN_ACCESS_FORBIDDEN`) |
| Vê **empresas** (lista) | ✅ todas | 🟢 só a própria | ❌ | ➖ |
| Cria empresa | ✅ (`POST /admin/teams`) | ❌ | ❌ | ➖ |
| Edita empresa (plano/limite/status) | ✅ (`PATCH /admin/teams/:id`) | ❌ (só super) | ❌ | ➖ |
| Pausa/ativa/arquiva empresa | ✅ (status via PATCH) | ❌ | ❌ | ➖ |
| Entra dentro de uma empresa | ✅ qualquer | 🟢 só a própria ("Minha Empresa") | ❌ | ➖ |
| Cria **coach** | ✅ (informa `teamId`) | 🟢 no próprio time | ❌ | ➖ |
| Edita/pausa coach | ✅ | 🟢 do próprio time | ❌ | ➖ |
| Cria **aluno** | ✅ (`teamId` obrigatório) | 🟢 no próprio time | 🟢 só p/ si mesmo | ❌ |
| Precisa escolher coach ao criar aluno | ✅ em empresa cliente (senão `GUTO_COACH_REQUIRED`); exceção GUTO_CORE | 🟢 pode atribuir coach do time | ➖ (forçado a si) | ➖ |
| Vê **alunos** | ✅ todos | 🟢 do próprio time | 🟢 só os seus (`coachId`) | ❌ |
| Vê **treino** do aluno | ✅ | 🟢 | 🟢 | ➖ (vê no app) |
| Gera/edita/trava treino | ✅ | 🟢 | 🟢 | ❌ |
| Vê/gera/edita/trava **dieta** | ✅ | 🟢 | 🟢 | ❌ |
| Vê **Arena** | ✅ global + qualquer empresa | 🟢 própria empresa + Geral | 🟢 empresa onde trabalha + Geral | (vê no app) |
| Vê **aprovações** (Banco GUTO) | ✅ | ✅ (`requireAdmin`) | ❌ (só sugere) | ➖ |
| Aprova item p/ Banco GUTO | ✅ | ✅ | ❌ | ➖ |
| Sugere exercício p/ Banco | ✅ | ✅ | ✅ (`POST /admin/exercises/custom`) | ➖ |
| Vê **Banco GUTO** (catálogo) | ✅ | 🟡 leitura (ver §6.8) | 🟡 leitura | ➖ |
| Vê **logs** globais | ✅ (`GET /admin/logs`) | 🟡 só do próprio escopo (alvo a refinar) | ❌ | ➖ |
| Pausar/reativar/renovar acesso do aluno | ✅ | ✅ (`requireAdmin`) | ❌ (hoje exige admin) | ➖ |
| Reset senha / reset progresso | ✅ | ✅ (`requireAdmin`) | ❌ | ➖ |
| Hard-delete (apagar de tudo) | ✅ (`DELETE`, `requireSuperAdmin`) | ❌ | ❌ | ➖ |
| Editar XP/streak/estágio à mão | ❌ **nunca** | ❌ **nunca** | ❌ **nunca** | ➖ |
| Sobrescrever Nome Soberano | ❌ **nunca** | ❌ **nunca** | ❌ **nunca** | ➖ |
| Vê dados de **outra empresa** | ✅ | ❌ (`403 TEAM_ACCESS_FORBIDDEN`) | ❌ | ➖ |
| Vê alunos de **outro coach** | ✅ | ✅ (do time) | ❌ (`403 COACH_STUDENT_ACCESS_FORBIDDEN`) | ➖ |

### 4.2 Super Admin (resumo)
Vê tudo. Cria/edita empresas, coaches, alunos. Pausa/arquiva empresas. Entra em qualquer empresa. Vê aprovações globais, Banco GUTO, logs, Arena global. **Não** cria aluno solto sem empresa/coach (exceto GUTO_CORE interno). **Não** vê Treino/Dieta como menu global — eles ficam dentro do aluno.

### 4.3 Empresa / Admin da empresa (resumo)
Vê **somente a própria empresa** (`teamId`). Não vê outras empresas, não cria empresa. Vê dashboard, coaches, alunos, uso do plano (limites/ativos/pausados/críticos), Arena da empresa, aprovações da empresa. Cria coaches e alunos do próprio time (respeitando plano). Não vê logs globais sensíveis nem Banco GUTO administrativo global (salvo leitura autorizada). Não acessa dados de outra empresa.

### 4.4 Coach (resumo)
Vê **somente os alunos vinculados a ele** (`coachId`), dentro do próprio `teamId`. Não cria empresa, não vê empresas globais. Pode criar aluno **só para si** (backend força `coachId = actor.userId` e `teamId` do token). Abre o detalhe do aluno: calibragem, memória, treino, dieta, XP, streak, validações, percurso, risco. Gera/edita/trava/destrava treino e dieta. Sugere exercício/alimento ao Banco GUTO (não aprova). Vê a **Arena da empresa** (não uma arena só dele) + Arena Geral. Não acessa logs globais, alunos de outro coach ou de outra empresa.

### 4.5 Aluno (student)
**Não usa o painel.** Usa o app GUTO (React Native/Expo + web app). Entra por convite (`/convite/[token]`) ou login de aluno (`/login`). Faz onboarding (consentimento → nome soberano → calibragem → pacto). Recebe treino/dieta do GUTO ou do coach. Valida treino. Ganha/perde XP. Aparece no painel para empresa/coach/super admin conforme escopo. Qualquer tentativa de acessar o painel é negada (`403 ADMIN_ACCESS_FORBIDDEN`).

### 4.6 GAP de produto — role de empresa
Hoje **não existe** um role `company_admin` separado: o papel `admin` cumpre o papel de "Admin da Empresa", e a separação visual no login (`empresa`) usa o **mesmo endpoint** `POST /auth/admin/login` (o backend devolve o role real do token). **GAP G-01:** decidir se cria um role dedicado `company_admin` ou mantém `admin` como "Admin de Empresa". Enquanto não houver decisão, **tratar `admin` = Admin da Empresa** com escopo no próprio `teamId`.

---

## 5. Login e Redirecionamento

### 5.1 Tela inicial e idioma
- Rota real: **`/admin/login`** (`app/admin/login/page.tsx`). É **login real** (não mock).
- **3 idiomas obrigatórios** no seletor (canto superior direito): **PT-BR, IT-IT, EN-US**. A escolha afeta labels, placeholders, botões e mensagens de erro **instantaneamente, sem reload**.
- Persistência atual: `localStorage["guto-admin-language"]`.
- **Seletor visual de papel** (3 cápsulas): **Super Admin**, **Empresa**, **Coach**. É um atalho de UX — **a verdade do papel vem do backend/token** (ver 5.3). O usuário não "vira" super admin só por clicar na cápsula.

### 5.2 Campos e ações
- **E-mail** (não case-sensitive), **Senha** (com toggle de visibilidade no app do aluno; no painel é input padrão).
- Botão **Entrar** (`Entrar`/`Accedi`/`Sign in`) → spinner durante validação.
- Link "É aluno? → Login do app" aponta para `/login`.
- **Não há "Esqueci minha senha"** no painel hoje. GAP G-02 (recuperação de senha). Até existir endpoint real, **não simular envio de e-mail** — orientar contato com o admin.

### 5.3 Fluxo de autenticação
1. Usuário escolhe idioma + papel visual, digita e-mail e senha, clica Entrar.
2. Frontend chama:
   - `super` e `empresa` → `POST /auth/admin/login` (compartilham o endpoint admin).
   - `coach` → `POST /auth/coach/login`.
3. Backend valida bcrypt e devolve `LoginResponse` com `{ token, role, userId, coachId?, teamId, email? }`. **O `role` retornado é a verdade** (não o que o usuário clicou).
4. Frontend grava token em `localStorage["guto-auth-token"]` e redireciona por papel.

### 5.4 Redirecionamento por papel (estado REAL no código)

```txt
super_admin → /coach   (cockpit, escopo global)
admin       → /coach   (cockpit, escopo da própria empresa)
coach       → /coach   (cockpit, escopo dos próprios alunos)
student     → bloqueia com mensagem "Esta entrada é só para coaches e admins. Use a tela do aplicativo."
outro/sem acesso → "Sua conta não tem acesso ao painel."
```

> **DECISÃO CANÔNICA confirmada pelo código:** o **único painel operacional é `/coach`** (o "cockpit"/Sala de Controle). Ele é role-aware e mostra/oculta telas conforme o papel. As rotas `/admin` e `/empresa` **redirecionam para `/coach`** (`legacyPanelRedirectTarget`). `/admin/login` permanece como login real (não redireciona).
>
> Isto **substitui** a descrição antiga (super→`/admin` mock, admin→`/empresa` stub). Não há mais "painéis paralelos".

**Nota de produto:** a rota canônica chama-se `/coach` por legado, mas hoje atende os três papéis. **Renomear é P2 cosmético** (ex.: `/painel` ou `/console`); não fazer no P0 — manter `/coach` e tratar a confusão por documentação. Se renomear, manter redirect de `/coach` para a nova rota.

### 5.5 Erros e estados de borda

| Cenário | Comportamento esperado |
|---|---|
| Senha errada | `401` → "Credenciais inválidas." (no idioma ativo). Nunca dizer se foi e-mail ou senha. |
| Conta sem acesso ao painel (student) | `403` → mensagem "Esta entrada é só para coaches e admins." |
| Token expirado / inválido (durante uso) | Interceptor `lib/api/client.ts`: `401` em rota não-login → remove token e manda para `/login` (no painel, recai em `/admin/login`). |
| Acesso pausado/expirado | `403` com code `ACCESS_PAUSED`/`SUBSCRIPTION_EXPIRED` → app do aluno vai para `/acesso-pausado?reason=`. (No painel, operador não é "pausado"; isto vale para o app do aluno.) |
| Plano da empresa pausado | Decisão de produto: bloquear operação de criação e mostrar aviso comercial. GAP G-10 (hoje o plano governa só volumetria). |
| Logout | `POST /auth/logout` (stateless: descarta token no cliente). |

---

## 6. Fluxo Super Admin — Tela por Tela

> Telas do cockpit `/coach` quando `role = super_admin`. Navegação real em `cockpit-layout.tsx → NAV_ITEMS`, filtrada por papel.

Sidebar do Super Admin (grupos → itens):
- **Operação:** Dashboard (`hoje`), Aprovações (`aprovacoes`).
- **Cadastros:** Empresas (`empresas`), Alunos (`students`).
- **Análise:** Arena (`arena`).
- **Sistema:** Banco GUTO (`banco`), Logs (`logs`).

> **Coaches NÃO é item de menu** — coaches são gerenciados **dentro do drawer da empresa**. **Treino/Dieta NÃO são itens de menu** — vivem **dentro do drawer do aluno**.

### 6.1 Dashboard Super Admin (`hoje`)
**Deve conter:**
- Empresas ativas reais (exclui `GUTO_CORE` e exclui pausadas/arquivadas — `activeClientTeams`).
- Alunos ativos (contagem do escopo).
- Treinos validados hoje.
- Críticos (**≥6 dias** sem validar; alinhado no código atual).
- Em atenção (faixa intermediária).
- Pendências de aprovação (exercícios custom aguardando).
- Lista curta de empresas ativas.
- Lista de alunos que precisam de atenção (atalho para abrir o aluno).

**NÃO deve conter:**
- Botão `+Aluno` solto (CTA do dashboard é nulo; `headerCtaForScreen("hoje") = null`). Aluno só nasce na tela **Alunos** (com empresa+coach exigidos) ou dentro do **drawer da empresa**.
- Treino/dieta global solto.
- Contagem incluindo `GUTO_CORE` ou empresas arquivadas como "cliente ativo".

### 6.2 Empresas (`empresas`) — super_admin only
**Deve conter:**
- Busca (nome da empresa).
- Filtro: todas | ativas | pausadas | arquivadas.
- Botão **`+Empresa`** (CTA do header só nesta tela; `headerCtaForScreen("empresas", superAdmin) = "empresa"`).
- Lista de empresas com colunas: **Nome · Status · Plano · Alunos (uso/limite) · Coaches (uso/limite) · Críticos/Atenção · Última atividade · Ação (abrir)**.
- Excluir `GUTO_CORE` da lista de clientes (ou marcá-la claramente como interna).

### 6.3 Criar Empresa (dialog `CreateTeamDialog`)
**Campos mínimos (mapeados ao `TeamDraft` / `POST /admin/teams`):**
- Nome da empresa (obrigatório).
- Plano: **Start | Pro | Elite | Custom** (obrigatório).
- Se **Custom**: `maxStudents` e `maxCoaches` (definidos manualmente pelo super admin).
- Status inicial: ativa | pausada | arquivada (default ativa).
- **Contato B2B (opcional, mas recomendado):** e-mail de contato, telefone, endereço, cidade, país. **Telefone é permitido aqui (contato comercial) e NUNCA entra na `GutoMemory` do aluno.**

**Decisão de produto:** telefone da empresa é **opcional** no contrato atual (`AdminTeamContactInput`), mas **recomenda-se exigir e-mail do responsável** (vira primeiro acesso do `admin` da empresa). Documentar como semi-obrigatório.

**Critérios:**
- Empresa criada **não** pode virar aluno (entidades separadas).
- Empresa aparece na lista imediatamente após criar.
- Empresa persiste (`team-store.ts`).
- Empresa tem limites de plano efetivos (`GUTO_TEAM_PLAN_LIMITS`).
- Gera log `team_created`.

### 6.4 Abrir Empresa (drawer `EmpresaDrawer`)
Abas do drawer (`EmpresaTab`): **resumo · coaches · alunos · plano · logs**.
**Deve conter:**
- **Resumo:** dados da empresa, contato, status.
- **Plano e uso:** plano contratado, `Coaches uso/limite`, `Alunos uso/limite`, vagas restantes, aviso de limite próximo/atingido.
- **Coaches:** lista de coaches **daquela** empresa (ver 6.5).
- **Alunos:** lista de alunos da empresa (filtrável por coach).
- **Logs:** histórico/auditoria da empresa.
- **Ações:** editar, pausar, arquivar.
- Botão **criar coach dentro da empresa**.
- Botão **criar aluno dentro da empresa, exigindo coach**.

### 6.5 Coaches dentro da Empresa (drawer, aba `coaches`)
**Deve conter:**
- Lista de coaches **daquela empresa** (`coachesForTeam(coaches, teamId)`).
- Criar coach (`POST /admin/coaches` com `teamId`; bloqueado se `coachLimitReached`).
- Editar coach (`PATCH /admin/coaches/:id`).
- Pausar coach (via `active=false`).
- Nº de alunos por coach.
- **Coach nunca aparece em empresa errada** (isolamento `teamId`).

### 6.6 Alunos dentro da Empresa (drawer, aba `alunos`) e tela global `students`
**Tela `Alunos` (global, escopada por papel) deve conter:**
- Busca (nome/e-mail).
- Filtros: por coach, por status (ativos/pausados/arquivados/todos — `FilterTab`), por risco, por objetivo, por sexo, faixa etária.
- Colunas: **Aluno · Coach · Status · XP · Risco · Último treino validado · Último acesso · Abrir**.
- Botão **`+Aluno`** (CTA só na tela Alunos e no drawer da empresa).
- Abrir aluno → drawer de detalhe (ver §9).
- Para o **super admin**, cada linha mostra o contexto: **Empresa + Coach + Aluno** (busca global preserva a hierarquia).

### 6.7 Aprovações (`aprovacoes`) — admin/super_admin
**Deve conter:**
- Exercícios pendentes (`GET /admin/exercises/custom`, status `pending`).
- Quem sugeriu (`requestedBy`, `requestedByRole`) e quando.
- Tipo / grupo muscular / equipamento.
- **Vídeo obrigatório** para exercício, com metadados validados.
- **Limite de vídeo (decisão fechada):** **catálogo oficial ≤15s; exercício custom do coach ≤30s.** Ambos: MP4, ≤ **12MB**, ≤ **720p**, **sem áudio**, caminho interno `/exercise/visuals/custom/` (custom). Os dois limites são oficiais.
- Botões **Aprovar** (`POST /admin/exercises/custom/:id/approve`) e **Rejeitar** (`.../reject` com motivo).
- Aprovado entra no **Banco GUTO** (catálogo).
- **Coach sugere, admin/super aprova** (coach não aprova).
- Gera logs `custom_exercise_requested`, `custom_exercise_approved` (+ reject).

### 6.8 Banco GUTO (`banco`) — super_admin only no menu
**Deve conter:**
- Exercícios aprovados (catálogo oficial — `GET /admin/exercises/catalog`).
- (Alvo) alimentos aprovados — catálogo nutricional.
- Busca e filtros (grupo muscular, equipamento, idioma).
- Status do item.
- Modo leitura ou edição conforme papel.
- **Nunca confundir com o treino/dieta individual do aluno** (Banco = catálogo da plataforma; treino/dieta = do aluno).

### 6.9 Arena (`arena`)
Super admin vê:
- **Semanal** e **Mensal** por empresa (`teamId`) — com seletor/filtro de empresa; título exibe o nome da empresa.
- **Geral** (global) — cada linha mostra `GUTO & Nome — Empresa/Time`.
- Filtros operacionais permitidos: empresa, país, período, status, coach (só para análise — **não muda o escopo oficial da Arena**, que é por `teamId`).
- **Sem dados sensíveis** (peso, altura, idade, patologia, restrição, foto, telefone, e-mail).

### 6.10 Logs (`logs`) — super_admin only
Super admin vê (`GET /admin/logs`):
- Ações administrativas: criação/edição de empresa, coach, aluno; aprovação/rejeição; travamento/destravamento de treino/dieta; pausa/reativação/renovação; reset; convite; consentimento.
- Cada log: `timestamp`, `actorUserId`, `actorRole`, `targetUserId`, `action`, `metadata` (antes/depois quando aplicável).
- Filtros: por empresa, usuário, ação, data (hoje há filtro por `targetUserId`; filtros por empresa/ação/data são alvo).
- **Tipos de ação reais** (`log-store.ts → LogAction`): `admin_login, user_created, user_updated, user_deleted, invite_created, invite_regenerated, access_paused, access_reactivated, access_renewed, password_reset, arena_reset, coach_created, coach_updated, coach_deleted, coach_assigned, coach_unassigned, workout_edited, workout_generated, workout_locked, workout_unlocked, workout_reset, workout_published, workout_weekly_saved, diet_edited, diet_generated, diet_locked, diet_unlocked, diet_reset, diet_published, diet_weekly_saved, custom_exercise_requested, custom_exercise_approved, consent_accepted, consent_revoked, team_created, team_updated, team_deleted, teams_cleanup, guto_revived, billing_checkout_completed, billing_subscription_updated, push_dispatch, account_self_deleted`.

---

## 7. Fluxo Empresa / Company Admin — Tela por Tela

> Mesmo cockpit `/coach`, `role = admin`. Sidebar do admin de empresa:
> - **Operação:** Dashboard (`hoje`), Aprovações (`aprovacoes`).
> - **Cadastros:** **Minha Empresa** (atalho que abre o drawer da própria empresa — `minha_empresa`), Alunos (`students`).
> - **Análise:** Arena (`arena`).
>
> O admin **não vê** "Empresas" (lista global), Banco GUTO no menu, nem Logs globais.

### 7.1 Dashboard Empresa (`hoje`, escopo do próprio `teamId`)
Mostra apenas dados da própria empresa:
- Alunos ativos.
- Coaches ativos.
- Treinos validados hoje.
- Alunos críticos / em atenção.
- **Uso do plano:** "Plano Pro: 3/4 coaches · 45/50 alunos" (de `GET /admin/team/summary`).
- Pendências internas (aprovações da empresa).

### 7.2 Coaches (dentro de "Minha Empresa", aba `coaches`)
- Criar coach (`POST /admin/coaches`, `teamId` derivado do token).
- Listar coaches da empresa.
- Abrir coach → ver alunos do coach (drawer de coach: `resumo · alunos · treinos · dietas · logs`).
- Pausar coach (se permitido; bloqueado se `coachLimitReached`).

### 7.3 Alunos (`students`)
- Criar aluno (`POST /admin/students`) — **escolher coach obrigatório** (coach do próprio time).
- Enviar convite (gerado automaticamente quando não há senha) e ver status do convite.
- Abrir aluno → detalhe (§9): calibragem, treino, dieta, XP, risco.
- Filtro por coach, status, risco.

### 7.4 Arena da Empresa (`arena`)
- Semanal da própria empresa.
- Mensal da própria empresa.
- Geral global (com nome da empresa ao lado da dupla).
- **Não mostra outras empresas** nas abas Semanal/Mensal.

### 7.5 Configurações da Empresa ("Minha Empresa", aba `plano`)
- Dados da empresa, contato, idioma padrão (se existir).
- Plano e limites (uso/limite).
- **Edição de plano bloqueada para o admin** — só `super_admin` altera plano/limites (`PATCH /admin/teams/:id` é `requireSuperAdmin`). O admin **vê** mas não edita o plano.

---

## 8. Fluxo Coach — Tela por Tela

> Mesmo cockpit `/coach`, `role = coach`. Sidebar do coach:
> - **Operação:** Dashboard (`hoje`).
> - **Cadastros:** Alunos (`students`).
> - **Análise:** Arena (`arena`).
>
> Coach **não vê** Aprovações (só sugere), Empresas, Banco GUTO no menu, nem Logs globais.

### 8.1 Dashboard Coach (`hoje`, escopo `coachId`)
Mostra:
- Meus alunos (contagem).
- Treinos hoje.
- Alunos em risco (atenção/crítico) em destaque no topo (ação proativa).
- Alunos que precisam de revisão.
- Alunos sem calibragem / sem treino / sem dieta (alvo; derivar da memória).
- Pendências de resposta.

### 8.2 Meus Alunos (`students`, filtrado por `coachId`)
- Lista **apenas alunos do coach** (`getScopedUserAccessList` filtra por `coachId === actor.userId`).
- Busca + filtro por status/risco/objetivo.
- Abrir aluno → detalhe (§9).
- Criar aluno (CTA `+Aluno`) — sempre vinculado a si.

### 8.3 Criar Aluno pelo Coach
- Vincula **automaticamente à empresa do coach** (`teamId` do token).
- Vincula **automaticamente ao coach logado** (backend força `coachId = actor.userId`; tentar outro coach → `403 COACH_STUDENT_ACCESS_FORBIDDEN`).
- Não pode escolher outra empresa.
- Gera convite (sem senha) ou senha temporária (`GUTO-xxxx`, quando `active=true`).
- Status inicial: pendente (inativo até claim do convite) ou ativo (com senha).

### 8.4 Detalhe do Aluno (drawer `StudentDrawer`)
**Abas reais hoje (`DETAIL_TABS`):** **Resumo · Calibragem · Treino · Dieta · Histórico · Acesso**.
**Abas-alvo (visão de produto, GAP G-09):** acrescentar **Percurso/Validações**, **XP/Evolução**, **Arena** e **Logs do aluno** como abas dedicadas (hoje diluídas em Resumo/Histórico). Detalhe campo-a-campo em §9.

### 8.5 Treino do Aluno (aba `treino`)
- Ver treino atual (`GET /admin/students/:id/workout`), de hoje (`/today`), da semana (`/week`), histórico (`/history`).
- Gerar treino (`POST .../workout/generate` → `workout-curator.ts`).
- Editar treino (`PUT .../workout`) e semana (`PUT .../workout/week`).
- Travar (`POST .../workout/lock` → `lockedByCoach=true`) / destravar (`/unlock`) / resetar (`/reset`).
- **Respeitar calibragem:** nível (parado/voltando/treinando/avançado), objetivo, local, **dor/limitação** (patologia afeta treino, não dieta).
- **Iniciante não recebe treino avançado sem progressão** (`workout-level.ts`, `workout-progression.ts`).
- **Exercício sem `videoUrl` válido (`/exercise/visuals/...`) não pode ser salvo** (`hasInvalidWorkoutExerciseContract` no editor; validação no backend).
- **Nada de treino inventado no frontend** se o backend falhar — mostrar erro honesto.
- Com `lockedByCoach`, o GUTO **não sobrescreve** automaticamente.
- Cada ação gera log (`workout_edited|generated|locked|unlocked|reset|weekly_saved`).

### 8.6 Dieta do Aluno (aba `dieta`)
- Ver dieta atual/today/week/history; gerar (`POST .../diet/generate` → `nutrition.ts`); editar (`PUT .../diet`, `/diet/week`); travar/destravar/resetar.
- **Respeitar país/cidade** (`food-availability.ts`), **objetivo**, **restrição alimentar (campo único NÃO COMO / `foodRestrictions`)**.
- "Não como / não tenho alimento" = **alimentação** (substituição), nunca patologia.
- **Patologia/dor não é restrição alimentar** — não confundir.
- **O editor barra alimento proibido pelo NÃO COMO** (backend recusa).
- Macros coerentes (`proteinG*4 + carbsG*4 + fatG*9 ≈ targetKcal`).
- **Nada de dieta inventada no frontend** se o backend falhar.
- Com `lockedByCoach`, o GUTO não sobrescreve.
- Logs `diet_edited|generated|locked|unlocked|reset|weekly_saved`.

### 8.7 Sugestões para Banco GUTO
- Coach sugere exercício (`POST /admin/exercises/custom`) com vídeo obrigatório válido.
- Admin/super aprova; item aprovado entra no catálogo (Banco GUTO).
- Coach **não aprova** (sem acesso à tela de Aprovações).

---

## 9. Detalhe do Aluno — Conexão com o App

O detalhe do aluno é o ponto onde **o painel espelha o app do aluno**. A fonte de verdade é a **`GutoMemory`** (backend), preenchida pelo onboarding no app. O painel **lê** memória e planos; **edita** por campos controlados; **nunca** edita XP/streak/Nome Soberano.

Endpoint base: `GET /admin/students/:userId` → `{ user, student, memory }`. Treino/dieta por endpoints próprios.

### 9.1 Onboarding (status derivado da memória)
Campos no app → como o painel deriva o status (GAP G-04 pede `onboardingStage` dedicado no backend):

| Estado (badge no painel) | Como derivar (campos reais) |
|---|---|
| Convite pendente / sem 1º acesso | `UserAccess.active === false` + invite `pending_claim` |
| Sem consentimento | falta `memory.consentHealthFitness` e `memory.acceptedTerms` |
| Consentimento aceito | `memory.consentAcceptedAt` presente |
| Nome confirmado | `UserAccess.name` confirmado pelo aluno (Nome Soberano sobrescreve `presetName` do convite) |
| Calibragem incompleta | faltam `biologicalSex`, `trainingLevel`, `trainingGoal`, `heightCm`, `weightKg`, etc. |
| Calibragem completa | campos preenchidos + `resolvedFields` |
| Pacto aceito | `memory.initialXpGranted === true` |
| Sistema ativo | consentimento + calibragem + pacto + `active` |

Mapeamento com o **Stage Router do app** (`GUTO_PAGINA_DE_LOGIN_DETALHADA.md`): `invited → consent → naming → calibration → pact → system`.

### 9.2 Calibragem (aba `calibragem`)
Campos exibidos (do `GutoMemory`; draft em `CalibrationDraft`):

| Campo (painel) | Campo (código) | Alimenta |
|---|---|---|
| Nome | `UserAccess.name` (Nome Soberano) | identidade da dupla |
| Idioma | `memory.language` (PT/EN/IT) | textos/voz |
| Sexo biológico | `biologicalSex` (male/female) | **dieta** (macros) |
| Idade | `userAge` | treino (segurança) + dieta (BMR) |
| Peso | `weightKg` | **dieta** |
| Altura | `heightCm` | **dieta** |
| Objetivo | `trainingGoal` | **treino e dieta** |
| Nível | `trainingLevel`/`trainingStatus` | **treino** (dificuldade) |
| Local | `preferredTrainingLocation` (gym/home/park/mixed) | **treino** (catálogo) |
| País | `country`/`countryCode` | **dieta** (alimentos locais) |
| Cidade | `city` | dieta/proatividade (clima) |
| Restrição alimentar (NÃO COMO) | `foodRestrictions` (campo **único**) | **dieta** (exclusão absoluta) |
| Patologia/dor/limitação | `trainingPathology`/`trainingLimitations` | **treino** (gatekeeper de segurança) |
| `resolvedFields` | resultado do `dirty-data-resolver` | resolução semântica |
| Consentimento | `consentHealthFitness`, `acceptedTerms`, `consentAcceptedAt`, `consentRevokedAt` | LGPD |

**Regras de edição (explicar no painel):**
- Restrição alimentar (NÃO COMO) → alimenta **dieta** e é **soberana** (bane alimento proibido).
- Dor/limitação → alimenta **treino**, **não** a dieta.
- Objetivo → alimenta treino **e** dieta.
- País/cidade → alimenta dieta (disponibilidade) — **idioma não escolhe comida**.
- Estado atual (nível) → alimenta dificuldade do treino.
- **Nunca editar `GutoMemory` como JSON cru.** Editar via `PATCH /admin/students/:id` com objeto `calibration`. GAP G-05: criar endpoint validado por campo com auditoria before/after.
- **Invalida dieta** ao mudar: `weightKg`, `heightCm`, `biologicalSex`, `trainingGoal`, `country/city`, `foodRestrictions`.
- **Invalida treino** ao mudar: `trainingLevel`, `trainingGoal`, `preferredTrainingLocation`, `trainingPathology/limitations`.
- Se plano `lockedByCoach=true`, **não recalcular automaticamente** — sinalizar revisão.

### 9.3 Treino (aba `treino`) — campos vindos do app
- Treino do dia (`lastWorkoutPlan`) e semanal (`weeklyWorkoutPlan`).
- Por exercício: nome canônico, **séries**, **reps**, **descanso**, **carga sugerida**, **cue/nota**, **vídeo local** (`videoUrl`), **botão de dúvida `?`** (no app abre o chat com contexto do exercício), substituição, validação.
- Cuidado físico (dor/limitação) destacado.
- Relação com XP: treino validado = +100 XP.

### 9.4 Dieta (aba `dieta`) — campos vindos do app
- Dieta semanal e do dia; `targetKcal`, `proteinG`, `carbsG`, `fatG`; refeições com horário, alimento, porção, kcal, nota; substituições; **botão de dúvida `?`**.
- Restrição alimentar respeitada; relação com objetivo (superávit/déficit).

### 9.5 Chat / GUTO (contexto — leitura no painel; ação no app)
- O chat do app entende contexto: dúvida vinda da dieta carrega contexto de alimento/refeição; dúvida vinda do treino carrega contexto de exercício.
- "Não tenho" em alimento = substituição alimentar; "não tenho" em exercício/equipamento = substituição de exercício; "dor no ombro" = limitação física.
- GUTO não responde robótico; economiza texto/voz; respostas curtas, humanas e acionáveis.
- O painel **não** é chat. Quando o coach edita treino/dieta, o app traduz via "Guto Talk" (personalidade), **não** como mensagem de sistema ("seu administrador atualizou…").

### 9.6 GUTO Online (sessão guiada — leitura no painel)
- Sessão de treino guiada por máquina de estados (briefing → warmup → série → descanso → transição → finalização), voz, progresso, finalização → validação → XP.
- Usa sempre o **plano oficial persistido**; respeita `lockedByCoach`.
- Risco operacional: se o storage não tiver `userId`, a sessão não inicia (botão bloqueado).
- O painel pode mostrar logs de sessão (`session_started`, `set_completed`, `pain_reported`, `session_finished`).

### 9.7 Validação (aba `validacoes`)
- Câmera: foto/selfie de prova — **obrigatória** (decisão do fundador): sem foto não valida e não dá XP/streak. O backend atual retorna `SELFIE_REQUIRED` sem `imageBase64`, e o painel exibe a aba **Validações** com imagem, data, foco, local, XP e feedback.
- Frase de confirmação (quando existir).
- Status: pendente/aprovado/rejeitado.
- **Privacidade:** nunca expor imagem de validação pública sem autenticação; se o consentimento for revogado, ocultar fotos e dados biológicos.

### 9.8 XP / Evolução (alvo: aba dedicada; hoje no Resumo)
- XP inicial de boas-vindas = **+100** (buffer do pacto) — conta em XP total/Semanal/Mensal/Individual do período, mas **não é prova de treino**, **não ativa streak** e **não incrementa `validatedWorkouts`**.
- XP por validação real (+100 treino; +50 missão adaptada).
- **XP nunca negativo** (`clampXp`); penalidade por ausência = −20 (clamp a 0).
- Evolução: **Baby / Teen / Adult / Elite** (`getAvatarStage(totalXp)`).
- **Coach/admin NÃO edita XP manualmente** — sem regra explícita; é mérito real.

### 9.9 Arena (alvo: aba dedicada; hoje resumida)
- Posição semanal/mensal (escopo empresa/`teamId`), geral (global).
- XP semanal/mensal/total, streak, estágio do avatar.
- Mostra a **dupla `GUTO & Nome`** (e empresa na Geral) — **nunca** dados sensíveis.

---

## 10. Rotas Canônicas

### 10.1 Frontend

| Rota | Papel permitido | Função | Estado atual | Ação recomendada |
|---|---|---|---|---|
| `/admin/login` | público (vira super/admin/coach) | Login real do painel (3 idiomas, seletor de papel) | ✅ real | Manter. É a porta do painel. |
| `/coach` | super_admin, admin, coach | **Painel operacional único** (cockpit role-aware) | ✅ real, ligado a `/admin/*` | Manter como canônico. Renomear é P2 (manter redirect). |
| `/admin` | — | Antiga Sala mock | ✅ **redireciona para `/coach`** (`LegacyPanelRedirect`) | Manter redirect; remover UI mock em limpeza P2. |
| `/empresa` | — | Antigo portal empresa stub | ✅ **redireciona para `/coach`** | Manter redirect; remover stub em limpeza P2. |
| `/admin/teams/[teamId]` | — | Detalhe de empresa (legado mock) | 🟡 legado | Consolidar no drawer de empresa do `/coach`; redirecionar/remover. |
| `/login` | student | Login do aluno (app) | ✅ real | Manter (app do aluno). |
| `/convite/[token]` | student | Captura o token, salva em `localStorage`, manda para `/` (claim no app) | ✅ real | Manter. |
| `/acesso-pausado` | student | Tela de bloqueio (pausado/expirado/morto) | ✅ real (3 idiomas) | Manter. |
| App do aluno (`/` + tabs) | student | Chat, Missão, Dieta, Arena, Percurso, Evoluir, GUTO Online, Validação | ✅ real | Não é painel. |

### 10.2 Backend

| Rota | Papel | Função | Estado | Ação |
|---|---|---|---|---|
| `/admin/*` | admin/super/coach (escopado) | **API canônica do painel** | ✅ real | Toda chamada de painel passa aqui. |
| `/auth/admin/login` | super/admin | Login admin | ✅ | Manter. |
| `/auth/coach/login` | coach | Login coach | ✅ | Manter. |
| `/auth/user/login` | student | Login aluno | ✅ | Manter. |
| `/auth/me` | qualquer autenticado | Identidade do token | ✅ | Manter. |
| `/auth/invite/:token` (GET) | público | Preview do convite | ✅ | Manter. |
| `/auth/invite/:token/claim` (POST) | público | Ativa conta + senha (+30 dias) | ✅ | Manter. |
| `/auth/admin/invites` (POST) | admin/super/coach | Cria convite (caminho alternativo) | ✅ | Padronizar no `POST /admin/students` (P0). |
| `/auth/logout` | — | Logout (stateless) | ✅ | Manter. |
| `/guto/coach/*` | — | Rotas legadas de coach | ⛔ `410` por padrão | **Não ressuscitar.** |
| `/guto/coach/rankings` | coach | Rankings de Arena | ✅ exceção ativa | Manter. |
| `/guto/memory`, `/guto/diet/*`, `/guto/validate-workout`, `/guto/arena/*`, `/guto/online/*` | student | App do aluno | ✅ | App, não painel. |

---

## 11. Endpoints e Contratos

> Cliente em `guto-app-v0/lib/api/admin.ts` e `auth.ts`. Servidor em `guto-backend/src/admin-router.ts` e `auth-router.ts`. Todas as rotas `/admin/*` exigem JWT; escopo validado em runtime (`canAccessUserAccess`).

### 11.1 Empresas (Teams)

| Endpoint | Método | Payload | Retorno | Erros | Papel | Tela |
|---|---|---|---|---|---|---|
| `/admin/teams` | GET | — | `{ teams: AdminTeam[] }` | 403 | admin/super (escopado) | Empresas |
| `/admin/teams` | POST | `{ name, plan, status?, customLimits?, email?, phone?, addressLine?, city?, country? }` | `{ team }` | 400 nome/plano; 403 | **super** (`requireSuperAdmin`) | Criar Empresa |
| `/admin/teams/:id` | PATCH | `{ name?, plan?, status?, customLimits?, contato? }` | `{ team }` | 403; 404 | **super** | Editar Empresa |
| `/admin/teams/:id` | DELETE | — | `{ ok, teamId }` | 403; 409 (não vazia) | **super** | — |
| `/admin/team/summary` | GET | `?teamId` | `{ team, limits, usage }` | 403 | admin/super/coach | Dashboard/Plano |
| `/admin/maintenance/cleanup-empty-teams` | POST | `{}` | `{ ok, removedCount, removed[] }` | 403 | **super** | Manutenção |

### 11.2 Coaches

| Endpoint | Método | Payload | Retorno | Erros | Papel | Tela |
|---|---|---|---|---|---|---|
| `/admin/coaches` | GET | — | `{ coaches }` | 403 | admin/super | Empresa → Coaches |
| `/admin/coaches` | POST | `{ name, email, password?, teamId? }` | `{ coach, temporaryPassword? }` | 400 nome/email; 400 `GUTO_TEAM_REQUIRED` (super sem teamId); 403 `TEAM_ACCESS_FORBIDDEN`; limite de plano | admin/super (`requireSuperAdminLike`) | Criar Coach |
| `/admin/coaches/:id` | PATCH | `Partial<AdminCoach>` | `{ coach }` | 403; limite | admin/super | Editar Coach |
| `/admin/coaches/:id` | DELETE | — | `204` | 403 | admin/super | — |
| `/admin/coaches/:id/students/:sid` | POST | — | `{ student }` | 403 | admin/super | Atribuir aluno |
| `/admin/coaches/:id/students/:sid` | DELETE | — | `{ student }` | 403 | admin/super | Desvincular |

### 11.3 Alunos (Students)

| Endpoint | Método | Payload | Retorno | Erros | Papel | Tela |
|---|---|---|---|---|---|---|
| `/admin/students` (=`/users`) | GET | filtros (`search, coachId, gender, minAge, maxAge, status, subscriptionStatus`) | `{ students, users }` | 403 | escopado | Alunos |
| `/admin/students` (=`/users`) | POST | ver 11.4 | `201 { user, student, inviteLink, temporaryPassword? }` | ver 11.5 | admin/super/coach | Criar Aluno |
| `/admin/students/:id` | GET | — | `{ user, student, memory }` | 403/404 | escopado | Detalhe |
| `/admin/students/:id` | PATCH | `Partial<AdminStudent> & { calibration? }` | `{ user, student }` | 403/400 | escopado | Editar/Calibragem |
| `/admin/students/:id` | DELETE | — | `204` (soft) | 403 | **super** (`requireSuperAdmin`) | — |
| `/admin/students/:id/reactivate` | POST | — | `{ user, student }` | 403 | **admin** | Acesso |
| `/admin/students/:id/pause` | POST | — | `{ user, student }` | 403 | **admin** | Acesso |
| `/admin/students/:id/renew` | POST | `{ days=30 }` | `{ user, student }` | 403 | **admin** | Acesso |
| `/admin/students/:id/reset-password` | POST | `{ password? }` | `{ user, temporaryPassword? }` | 403 | **admin** | Acesso |
| `/admin/students/:id/reset` | POST | `{ scope: weekly\|monthly\|individual\|validationHistory\|all }` | `{ student, scope }` | 403 | **admin** | Acesso |
| `/admin/students/:id/invite` | GET | — | `{ invite, inviteLink, message? }` | 403 | escopado | Acesso/Convite |
| `/admin/students/:id/invite/regenerate` | POST | — | `{ inviteLink }` | 403 | escopado | Acesso/Convite |

### 11.4 Payload de criação de aluno — `POST /admin/students`

```jsonc
{
  "firstName": "Will",            // OU "name"; sobrenome opcional (nome soberano confirmado no app)
  "lastName": "Santos",           // opcional
  "email": "will@exemplo.com",    // OBRIGATÓRIO, válido, único, normalizado p/ lowercase
  "phone": "+55 11 99999-0001",   // OPCIONAL (valida só se enviado)
  "teamId": "action-fit",         // OBRIGATÓRIO p/ super_admin; derivado do token p/ admin/coach
  "coachId": "c001",              // admin: opcional (valida mesmo time); coach: forçado a si
  "language": "pt",               // opcional
  "active": false,                // opcional; default = (tem senha)
  "password": null,               // opcional; ausente + !active → gera CONVITE
  "visibleInArena": true,         // opcional, default true
  "accessDurationDays": 30,       // opcional, default 30
  "notes": "..."
}
```
Sucesso: `201 { user, student, inviteLink (se sem senha), temporaryPassword (se senha gerada) }`.

### 11.5 Erros do criar aluno (contrato REAL no código)

| Situação | HTTP | code |
|---|---|---|
| Nome ausente | 400 | `GUTO_NAME_REQUIRED` |
| Email ausente/inválido | 400 | `GUTO_EMAIL_INVALID` |
| Telefone inválido (se enviado) | 400 | `GUTO_PHONE_INVALID` |
| **Email duplicado** | **409** | `GUTO_EMAIL_DUPLICATE` ✅ (resolvido — não é mais GAP) |
| Role ≠ student | 403 | `ADMIN_ACCESS_FORBIDDEN` |
| Conta student tentando criar | 403 | `ADMIN_ACCESS_FORBIDDEN` |
| Super_admin sem teamId | 400 | `GUTO_TEAM_REQUIRED` |
| Aluno em empresa cliente sem coach | 400 | `GUTO_COACH_REQUIRED` (exceção: GUTO_CORE) |
| Admin/coach tentando outro time | 403 | `TEAM_ACCESS_FORBIDDEN` |
| Coach criando p/ outro coach | 403 | `COACH_STUDENT_ACCESS_FORBIDDEN` |
| Coach inexistente / outro time | 404 / 403 | "Coach não encontrado" / `TEAM_ACCESS_FORBIDDEN` |
| Plano cheio | 4xx | `GUTO_TEAM_PLAN_LIMIT_REACHED` (com `subject`, `usage`) |

> **Telefone agora é OPCIONAL** (resolve o conflito de privacidade citado nos docs antigos). Telefone é contato comercial e **não entra na `GutoMemory`**.

### 11.6 Treino

| Endpoint | Método | Função | Papel |
|---|---|---|---|
| `/admin/students/:id/workout` | GET/PUT/PATCH | ler/editar treino atual | escopado |
| `/admin/students/:id/workout/today` | GET | treino do dia | escopado |
| `/admin/students/:id/workout/week` | GET/PUT | semanal | escopado |
| `/admin/students/:id/workout/history` | GET | histórico | escopado |
| `/admin/students/:id/workout/generate` | POST | GUTO gera (`workout-curator`) | escopado |
| `/admin/students/:id/workout/lock` \| `/unlock` \| `/reset` | POST | travar/destravar/resetar | escopado |

### 11.7 Dieta

| Endpoint | Método | Função | Papel |
|---|---|---|---|
| `/admin/students/:id/diet` | GET/PUT/PATCH | ler/editar dieta atual | escopado |
| `/admin/students/:id/diet/today` \| `/week` \| `/history` | GET (week: PUT) | hoje/semana/histórico | escopado |
| `/admin/students/:id/diet/generate` | POST | GUTO gera (`nutrition`) | escopado |
| `/admin/students/:id/diet/lock` \| `/unlock` \| `/reset` | POST | travar/destravar/resetar | escopado |

### 11.8 Catálogo / Aprovações / Logs

| Endpoint | Método | Função | Papel |
|---|---|---|---|
| `/admin/exercises/catalog` | GET | Banco GUTO (catálogo) | escopado |
| `/admin/exercises/custom` | GET/POST | listar/sugerir custom | GET admin/super; POST coach+ |
| `/admin/exercises/custom/:id/approve` \| `/reject` | POST | aprovar/rejeitar | **admin/super** (`requireAdmin`) |
| `/admin/logs` | GET | auditoria (`?targetUserId`) | escopado (alvo: super) |
| `/admin/maintenance/backfill-arena-initial-xp` | POST | manutenção | **admin** |

### 11.9 Auth / Convite

| Endpoint | Método | Payload | Retorno | Papel |
|---|---|---|---|---|
| `/auth/admin/login` | POST | `{ email, password }` | `{ token, role, userId, teamId, email? }` | público |
| `/auth/coach/login` | POST | `{ email, password }` | `{ token, role:coach, userId, coachId, teamId }` | público |
| `/auth/user/login` | POST | `{ emailOrId, password }` | `{ token, role:student, ... }` | público |
| `/auth/invite/:token` | GET | — | `{ name, legalName, userId, coachId }` | público |
| `/auth/invite/:token/claim` | POST | `{ password (≥6) }` | `{ token, userId, name, subscription* }` | público |

Convite: token SHA-256, **expira em 7 dias**, status `pending_claim → active → expired → revoked`; claim define senha (bcrypt), ativa conta, `+30 dias`.

### 11.10 Planos (limites reais — `team-plans.ts`)

| Plano | Label | maxCoaches | maxStudents | Bloqueia ao criar |
|---|---|---|---|---|
| Start | GUTO Time Start | 2 | 20 | 3º coach / 21º aluno |
| Pro | GUTO Time Pro | 4 | 50 | 5º coach / 51º aluno |
| Elite | GUTO Time Elite | 6 | 70 | 7º coach / 71º aluno |
| Custom | GUTO Time Custom | `null` | `null` | definido pelo super_admin |

---

## 12. O Que NÃO Deve Existir

- ❌ **Reintroduzir treino global fora do aluno.** Treino vive dentro do aluno (drawer) ou em fila escopada de revisão, nunca como editor global solto.
- ❌ **Reintroduzir dieta global fora do aluno.** Dieta vive dentro do aluno (drawer) ou em fila escopada de revisão.
- ❌ **Reintroduzir coach global sem empresa.** Coach só existe dentro de `teamId`; coaches vivem no drawer da empresa.
- ❌ **Aluno sem empresa/coach**, exceto a exceção interna documentada **GUTO_CORE**.
- ❌ **Empresa contando GUTO_CORE como cliente** (excluir de métricas — `clientTeams`).
- ❌ **Empresa arquivada/pausada contando como ativa** (`activeClientTeams` filtra).
- ❌ **Mock acessível em produção.** `/admin` e `/empresa` redirecionam; nunca religar `IS_MOCK_DATA` em produção sem fonte real.
- ❌ **Botão `+Aluno` solto no Dashboard** do super admin (`headerCtaForScreen("hoje") = null`).
- ❌ **Texto hardcoded fora do sistema de idioma** (ver §16 — hoje o cockpit está parcialmente migrado; cobertura total é GAP G-08).
- ❌ **Resposta do GUTO tratando alimento como dor** (ex.: "nessun dolore" não é restrição alimentar).
- ❌ **Resposta do GUTO tratando dor como alimento** (patologia ≠ NÃO COMO).
- ❌ **Imagem de validação pública sem autenticação.**
- ❌ **Edição manual de XP/streak/estágio.** ❌ **Sobrescrever Nome Soberano.** ❌ **Reviver GUTO morto sem liberação comercial.**
- ❌ **Calcular ranking/KPI no frontend carregando todos os alunos** — vem agregado do backend, paginado.

---

## 13. Critérios de Pronto

### Super Admin
- [ ] Login funciona (`/admin/login` → `/coach`).
- [ ] Idioma funciona na tela de login (PT/EN/IT).
- [ ] Dashboard mostra empresas ativas (sem GUTO_CORE/arquivadas), alunos ativos, críticos/atenção, pendências — sem `+Aluno` solto.
- [ ] Cria empresa (`POST /admin/teams`) e ela aparece/persiste.
- [ ] Abre empresa (drawer) com plano/uso/coaches/alunos/logs.
- [ ] Cria coach **dentro da empresa**.
- [ ] Cria aluno **dentro da empresa escolhendo coach** (bloqueia `GUTO_COACH_REQUIRED` se faltar).
- [ ] Vê aluno com calibragem (memória real).
- [ ] Gera treino/dieta no aluno.
- [ ] Aprova item custom → entra no Banco GUTO.
- [ ] Vê logs.

### Empresa (admin)
- [ ] Login funciona e cai em `/coach` com escopo da própria empresa.
- [ ] Vê **só a própria empresa** (não vê "Empresas" global).
- [ ] Cria coach do próprio time.
- [ ] Cria aluno com coach do próprio time.
- [ ] Vê alunos e uso do plano.
- [ ] **Não vê outras empresas** (`403 TEAM_ACCESS_FORBIDDEN` em acesso cruzado).

### Coach
- [ ] Login funciona.
- [ ] Vê **só os próprios alunos** (`coachId`).
- [ ] Abre aluno e vê calibragem.
- [ ] Gera treino e dieta.
- [ ] Sugere item ao Banco (não aprova).
- [ ] **Não vê** aluno de outro coach/empresa.

### App Aluno (ponta a ponta)
- [ ] Convite funciona (claim → +30 dias).
- [ ] Onboarding funciona (consent → naming → calibração → pacto).
- [ ] Calibragem salva na `GutoMemory`.
- [ ] Painel lê a calibragem.
- [ ] Treino usa nível/dor/local; dieta usa objetivo/restrição/país.
- [ ] Chat entende contexto (treino/dieta).
- [ ] Validação gera XP; Arena atualiza.
- [ ] `lockedByCoach` respeitado (GUTO não sobrescreve).

### Engenharia
- [ ] `tsc` passa (frontend e backend).
- [ ] Testes de isolamento verdes (`guto-team-isolation`, `guto-team-limits`, `guto-team-plans`, `guto-access-blocking`, `guto.legacy-coach-routes`).
- [ ] Build frontend passa; Playwright focado passa ou falha documentada como infra.

---

## 14. Plano de Implementação Depois do Documento

### Fase P0 — Contrato e rotas (consolidação)
- Confirmar login único `/admin/login → /coach` para os 3 papéis (✅ já no código).
- Confirmar `/admin` e `/empresa` redirecionando (✅ já no código).
- Decidir role de empresa (G-01): manter `admin` como Admin de Empresa **ou** criar `company_admin`.
- Garantir escopo por papel em todas as telas (esconder o que o papel não pode ver).
- Manter a regra atual: coaches dentro do drawer da empresa; treino/dieta dentro do drawer do aluno. Não reintroduzir telas globais `coaches`/`treinos`/`dietas`.

### Fase P1 — Super Admin completo
- Empresa: criar/editar/pausar/arquivar (drawer completo).
- Coach: criar/editar/pausar dentro da empresa.
- Aluno: criar com coach obrigatório; detalhe completo.
- Detalhe do aluno: badge de onboarding (G-04), abas faltantes (Arena/XP/Percurso/Logs — G-09).
- Aprovações e Logs com filtros (empresa/ação/data).

### Fase P2 — Empresa completo
- Dashboard próprio, coaches, alunos, limites do plano (visualizar; editar só super).
- Arena da empresa + Geral.

### Fase P3 — Coach completo
- Meus alunos, treino/dieta dentro do aluno, sugestões ao Banco, risco/retenção em destaque.

### Fase P4 — Conexão app aluno
- Calibragem → painel (read + edição validada, G-05).
- Treino/dieta → app (já reflete via memória compartilhada).
- Validação → XP; Arena/Percurso sincronizados.

### Fase P5 — QA
- Testes backend; testes frontend; Playwright; screenshots; teste em Safari/iPad/iPhone; checklist manual real.

---

## 15. Gaps Obrigatórios

| GAP | Descrição | Impacto | Arquivo provável | Prioridade | Como provar que foi resolvido |
|---|---|---|---|---|---|
| **G-01** | Role dedicada de empresa (`company_admin`) vs usar `admin` | Confusão de produto; "Empresa" no login usa endpoint admin | `auth-router.ts`, `auth-middleware.ts`, `app/admin/login/page.tsx` | P0 (decisão) | Decisão escrita + teste de escopo do admin de empresa |
| **G-02** | Recuperação de senha (admin/coach) | Operador sem auto-atendimento | `auth-router.ts`, login page | P1 | Endpoint real + fluxo na UI (sem simular e-mail) |
| **G-03** | Renomear rota `/coach` → nome neutro (ex.: `/painel`) | Nome confunde (atende 3 papéis) | `app/coach/*`, redirects | P2 | Rota nova + redirect de `/coach`; testes verdes |
| **G-04** | `onboardingStage` derivado no backend | Painel recalcula regra de negócio no front | `admin-router.ts → buildStudentView` | P1 | Campo no `GET /admin/students/:id` + badge no painel |
| **G-05** | Endpoint validado de calibragem por campo + auditoria before/after | Risco de gravar dado inconsistente | `admin-router.ts`, `memory-store.ts` | P1 | Rota tipada com ranges + log before/after; teste |
| **G-06** | **FECHADO:** risco **Verde ≤48h / Atenção 3–5d / Crítico ≥6d**; vídeo **catálogo ≤15s / custom ≤30s**. | Código atual alinhado | `app/coach/_components/utils.ts` | Fechado | `studentRisk` usa crítico ≥6 |
| **G-07** | Backend não emite `GUTO_DECEASED`; morte não implementada | Promessa de produto sem enforcement; copy errada p/ expirado | `auth-middleware.ts`, `memory-store.ts` | P1 | `gutoLifeStatus`/guard 403 + emissão do code; teste |
| **G-08** | i18n do cockpit `/coach` parcial | Painel ainda não cumpre 100% dos 3 idiomas | `app/coach/_components/*` (textos/toasts restantes hardcoded) | P1 | Todos os textos via `panel-i18n`; toggle cobre cockpit inteiro |
| **G-09** | Abas faltantes no detalhe do aluno (Arena, XP/Evolução, Percurso, Logs) | Visão incompleta do aluno | `app/coach/_components/student-drawer.tsx`, `DETAIL_TABS` | P1 | Abas dedicadas presentes lendo memória/arena/logs; **Validações já existe** |
| **G-10** | Plano governa só volumetria; recursos premium por plano | Sem diferenciação comercial além de limite | `team-plans.ts` | P2 | Matriz de recursos por plano + enforcement |
| **G-11** | **FECHADO:** telas globais `coaches`/`treinos`/`dietas` não estão no `Screen` ativo | Superfície morta removida do fluxo | `app/coach/page.tsx`, `utils.ts` | Fechado | Coach fica no drawer da empresa; treino/dieta ficam no drawer do aluno |
| **G-12** | Filtros de logs por empresa/ação/data | Auditoria pouco navegável | `admin-router.ts → /logs` | P2 | Query params + UI de filtro |
| **G-13** | **FECHADO:** selfie obrigatória na validação | Accountability com prova | backend de validação | Fechado | Sem `imageBase64`, backend retorna `SELFIE_REQUIRED`; sem prova não há XP/Arena |
| **G-14** | Agregados `/admin/panel/*` paginados | Escala (não carregar tudo no front) | `admin-router.ts` | P2 | Endpoints agregados + paginação cursor |

---

## 16. Internacionalização

### 16.1 Idiomas oficiais do painel (3, agora)
- **Português brasileiro (`pt-BR`)** — default.
- **Inglês (`en-US`)**.
- **Italiano (`it-IT`)**.

País **não** é idioma (um brasileiro em Roma usa PT com contexto alimentar italiano). Persistência atual: `localStorage["guto-admin-language"]`.

### 16.2 Regra dura
**Não pode haver texto hardcoded solto fora do sistema de idioma.** Hoje existe base `panel-i18n` PT/EN/IT e parte do cockpit já usa esse sistema, mas ainda há labels/toasts hardcoded em PT. Resolver cobertura total = **G-08**.

### 16.3 Convenção de chaves
Usar dot notation (referência do design handoff `i18n.jsx`): `nav.*`, `kpi.*`, `risk.*`, `rank.*`, `screen.<id>.title`, `screen.<id>.sub`, `action.*`, `error.<code>`. Erros de API devem mapear `code → mensagem` por idioma (o cliente já tem base em `lib/api/client.ts → gutoApiErrorCopy`).

### 16.4 Mapa de telas (título PT-BR · chave semântica · comportamento)

| Tela | Título PT-BR | Chave semântica | Comportamento esperado |
|---|---|---|---|
| Login | "Entrar no painel" | `login.title` | 3 idiomas; redireciona por papel |
| Dashboard | "Hoje" / "Visão geral operacional" | `screen.hoje.title` / `.sub` | KPIs por escopo; sem +Aluno |
| Empresas | "Empresas" | `screen.empresas.title` | super only; busca/filtro/+Empresa |
| Minha Empresa | "Minha Empresa" | `nav.minha_empresa` | abre drawer da própria empresa (admin) |
| Alunos | "Alunos" | `screen.students.title` | escopado; +Aluno; abrir detalhe |
| Aprovações | "Aprovações" | `screen.aprovacoes.title` | admin+; aprovar/rejeitar |
| Banco GUTO | "Banco do GUTO" | `screen.banco.title` | super; catálogo aprovado |
| Arena | "Arena" | `screen.arena.title` | Semanal/Mensal (teamId) + Geral |
| Logs | "Logs" | `screen.logs.title` | super; auditoria |
| Detalhe aluno | "Resumo/Calibragem/Treino/Dieta/Validações/Histórico/Acesso" | `detail.tab.*` | abas; ler memória |

> Não é preciso traduzir todos os textos agora; é preciso garantir que **nenhum texto novo entre hardcoded** e que o cockpit migre para chaves (G-08).

---

## 17. Relatório Final desta Tarefa

### 17.1 Documentos lidos (raiz + submódulos)
- `README.md`
- `PARTE_5_PAINEL_COACH_E_ADMIN.md`
- `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md`
- `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md`
- `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md`
- `GUTO_ARENA_E_GAMIFICACAO_DETALHADA.md`
- `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md`
- `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md`
- `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md`
- `GUTO_PAGINA_DE_LOGIN_DETALHADA.md`
- `guto-app-v0/docs/GUTO_INVENTARIO_COMPLETO_ESTADO_ATUAL.md`
- `design_handoff_guto_coach_panel/README.md` (+ estrutura dos `.jsx`/`.html`)

### 17.2 Código lido (frontend)
- `app/admin/login/page.tsx`, `app/coach/page.tsx`
- `app/coach/_components/cockpit-context.tsx`, `cockpit-layout.tsx`, `utils.ts`
- `app/coach/_hooks/use-admin-permissions.ts`
- `app/admin/page.tsx`, `app/empresa/page.tsx`, `app/convite/[token]/page.tsx`
- `lib/panel-rules.ts`, `lib/api/admin.ts`, `lib/api/auth.ts`, `lib/api/client.ts`

### 17.3 Código lido (backend)
- `src/admin-router.ts` (mapa de rotas + handlers de criação de aluno/coach), `src/auth-router.ts`, `src/auth-middleware.ts`, `src/team-plans.ts`, `src/invite-store.ts`, `src/log-store.ts`, `src/risk-classifier.ts` (constatado: é classificador de **segurança do chat**, não de abandono)

### 17.4 Arquivo criado
- **`GUTO_PAINEL_ADMIN_CANONICO_V1.md`** (este arquivo, na raiz). Nenhum outro arquivo foi criado.

### 17.5 Conflitos encontrados entre docs e código (e resolução)
1. **Roteamento por papel.** Docs antigos: super→`/admin` mock, admin→`/empresa` stub, coach→`/coach`. **Código real: os três papéis vão para `/coach`; `/admin` e `/empresa` redirecionam.** → Documentado o estado real como canônico (§5).
2. **Telefone do aluno.** Doc de engenharia dizia "obrigatório no backend (conflito de privacidade)". **Código real: telefone é opcional** (valida só se enviado). → Conflito resolvido a favor do código (§11.5).
3. **Email duplicado.** Doc de engenharia listava como GAP. **Código real já retorna `409 GUTO_EMAIL_DUPLICATE`.** → GAP fechado.
4. **"Não cria empresa real" (PARTE_5).** **Errado:** backend cria empresa/coach/aluno/convite de verdade. → Corrigido.
5. **Threshold de risco e vídeo — DECIDIDOS e alinhados.** Risco canônico: **Verde ≤48h / Atenção 3–5d / Crítico ≥6d**; vídeo: **catálogo ≤15s / custom ≤30s**. → G-06 fechado.
6. **Morte do GUTO.** Docs descrevem lockdown/guard 403; **backend não implementa** (`resolveBlockedAccessCode` não trata morte). → GAP G-07.
7. **i18n do painel.** Docs exigem 3 idiomas em todo o painel; **cockpit `/coach` tem base parcial `panel-i18n`, mas ainda não é 100%**. → GAP G-08.
8. **Abas do aluno.** Doc-alvo pede mais abas dedicadas; **código tem 7** (Resumo/Calibragem/Treino/Dieta/Validações/Histórico/Acesso). → GAP G-09 apenas para Arena, XP/Evolução, Percurso e Logs dedicados.
9. **Selfie obrigatória.** Docs antigos diziam que o backend aceitava validação sem foto; **código atual retorna `SELFIE_REQUIRED` e só credita XP/Arena com evidência**. → G-13 fechado.

### 17.6 Principais decisões canônicas
- **Painel único = `/coach`** (cockpit role-aware). `/admin` e `/empresa` são redirects. `/admin/login` é a porta.
- **Hierarquia estrita:** Super Admin → Empresa → Coach → Aluno → Dados. Coach dentro da empresa (drawer); Treino/Dieta dentro do aluno (drawer). Sem entidade solta (exceção GUTO_CORE).
- **API canônica = `/admin/*`**; legado `/guto/coach/*` morto (410) exceto rankings.
- **`admin` = Admin de Empresa** até decisão sobre `company_admin` (G-01).
- **XP/streak/Nome Soberano são imutáveis pelo painel.** Calibragem editável só por campos validados.
- **3 idiomas oficiais; nada hardcoded fora do sistema de idioma.**

### 17.7 Principais GAPs (ver §15)
Role de empresa (G-01), recuperação de senha (G-02), `onboardingStage` (G-04), calibragem validada (G-05), morte/lockdown (G-07), i18n completa do cockpit (G-08), abas dedicadas restantes do aluno (G-09), agregados/logs (G-12/G-14).

### 17.8 Arquivos alterados
- **Apenas 1 arquivo foi criado:** `GUTO_PAINEL_ADMIN_CANONICO_V1.md`.
- **Nenhum arquivo de código, teste ou configuração foi alterado.**

### 17.9 Confirmações finais
- ✅ **Não alterei código.**
- ✅ **Não corrigi tela.**
- ✅ **Não fiz merge.**
- ✅ **Não deletei arquivos.**
- ✅ **Não disse "feito" sem prova:** todas as afirmações de estado têm referência a arquivo/rota real auditado.
- ✅ A tarefa foi **somente** criar este documento de referência operacional.
