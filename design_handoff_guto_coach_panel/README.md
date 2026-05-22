# Handoff: GUTO — Coach Panel, Empresa Portal & Sala de Controle

## Overview
GUTO é um sistema multi-tenant de fitness/coaching com três portais web operacionais (B2B/B2B2C, **não** o app do aluno):

1. **Sala de Controle** (`Sala de Controle.html`) — Painel **admin/superadmin** GUTO. Visão global da plataforma: todas as empresas, todos os coaches, todos os alunos, logs, planos, billing.
2. **Empresa Portal** (`Empresa Portal.html`) — Painel da **empresa cliente** (academia/franquia). Vê apenas os seus coaches e alunos.
3. **Coach Portal** (`Coach Portal.html`) — Painel do **coach individual**. Vê apenas seus alunos.

Há também um **Login** unificado (`Login.html`) que roteia para o portal correto baseado no papel do usuário.

Conceitos de domínio importantes:
- **Aluno (Student)**: usuário final. Tem `weeklyXp`, `monthlyXp`, `totalXp`, `currentStreak`, `avatarStage` (baby/teen/adult/elite), `subscriptionStatus`, `lastValidationAt`.
- **Coach**: gerencia uma carteira de alunos. Pertence a uma empresa.
- **Empresa (Team)**: dono comercial. Tem `plan`, `maxStudents`, `maxCoaches`, `usage`.
- **Risco do aluno** (`calcRisk`): `ok` (validou nos últimos 3d), `atencao` (3–7d), `critico` (≥7d sem validação), `sem-sinal` (nunca validou), `pausado`.
- **Arena**: leaderboards baseados em XP. Escopo varia por portal (ver regras abaixo).

---

## About the Design Files
Os arquivos neste bundle são **referências de design criadas em HTML+React (via Babel inline)** — protótipos demonstrando aparência e comportamento pretendidos, **não código de produção pra copiar diretamente**.

A tarefa é **recriar esses designs no codebase de destino** (ex.: Next.js + React + TypeScript + Tailwind/shadcn, Vue, etc.) usando os padrões e bibliotecas já estabelecidos no projeto. Se ainda não existe ambiente, escolha o stack mais apropriado e implemente os designs lá.

**Não copie os arquivos `.jsx` direto para o codebase.** Eles usam um padrão de "globals via `window.*`" que só funciona em HTML standalone. Use-os como **referência fiel** de layout, tokens, copy, lógica de filtro/ordenação e fluxos.

---

## Fidelity
**High-fidelity (hifi).** Os mockups estão pixel-perfect com cores, tipografia, espaçamento e interações finais. Recrie pixel-perfect usando as bibliotecas e padrões existentes do codebase.

---

## Tech Stack Usado nos Mockups (apenas para entender; não copie)
- HTML + React 18 (via UMD CDN) + Babel standalone para JSX inline
- Inline styles com objeto `T` de tokens (sem CSS-in-JS lib)
- i18n simples via `window.t(key)` (PT-BR / EN / IT)
- Estado em `localStorage` para "qual coach/empresa está logado"
- Sem backend — todos os dados são mocks em `panel-data.jsx` / `sala-data.jsx`

**Stack recomendado para produção** (sugestão): Next.js 14 (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui + Zustand/TanStack Query + Prisma/Drizzle. Mas siga o que já estiver no codebase.

---

## Portais — Visão Geral

### 1. Login (`Login.html`)
- Tela central, single-form, com seletor de perfil (Admin / Empresa / Coach).
- Após login, redireciona para `Sala de Controle.html`, `Empresa Portal.html` ou `Coach Portal.html`.
- Grava `localStorage["guto-coach-id"]` ou `guto-empresa-id` para simular sessão.

### 2. Sala de Controle (Admin GUTO)
**Sidebar nav:**
- `Visão Geral` — KPIs globais (alunos ativos, criticos, empresas, MRR)
- `Empresas` — lista todas empresas, abre drawer com detalhes
- `Coaches` — lista todos coaches do sistema
- `Alunos` — lista global de alunos, filtros por empresa/coach/risco
- `Treinos` / `Dietas` — fila global de revisão
- `Logs` — auditoria (todas as ações: `student.workout.saved`, etc.)
- `Configurações` — planos, limites, custom limits

### 3. Empresa Portal
**Sidebar nav:**
- `Visão Geral` — KPIs da empresa (coaches/alunos ativos vs limite), lista de coaches, alunos em atenção
- `Coaches` — lista dos coaches da empresa
- `Alunos` — lista dos alunos da empresa (filtro por coach)
- `Treinos` / `Dietas` — fila de revisão escopada à empresa
- `Arena` — leaderboards (regra especial; ver abaixo)

### 4. Coach Portal
**Sidebar nav:**
- `Início` — KPIs do coach (alunos ativos, treinos hoje, em dia, críticos), lista de alunos em atenção
- `Meus Alunos` — lista filtrada (ativos/pausados/todos) + busca
- `Treinos` / `Dietas` — fila de revisão dos alunos do coach
- `Arena` — leaderboards (regra especial; ver abaixo)

---

## ⚠️ Regras de Arena (importante — recém-corrigido)

A Arena tem comportamento **diferente por portal**:

### Coach Portal — Arena
- **Apenas dois rankings: Semanal + Mensal**
- Escopo: somente alunos do coach
- **NÃO mostra ranking Geral** (totalXp). Coach não tem visibilidade total da plataforma.

### Empresa Portal — Arena
- **Três rankings: Semanal + Mensal + Geral**
- **Semanal + Mensal** (lado a lado, 2 colunas): escopo = alunos da empresa
- **Geral** (largura total, abaixo): escopo = **TODOS os alunos do sistema** (`MOCK_STUDENTS` inteiro), com coluna extra de coach pra identificação
- Ordenação: `totalXp` decrescente

### Sala de Controle (Admin) — Arena
- Mostra rankings globais (Semanal/Mensal/Geral) com todos os alunos.

**Por que essa regra:** coach só compete com sua carteira; empresa quer comparar seus alunos entre si **e** ver onde estão no panorama nacional/global.

---

## Screens / Views (detalhe)

### Layout Geral (todos os portais)
- **Sidebar fixa à esquerda**: 240px expandida, 64px colapsada. Fundo `#0B1120` (deep navy). Logo no topo, nav agrupado, toggle no rodapé.
- **Header sticky no topo**: 62px de altura, fundo branco, border inferior `#DDE1E8`. Mostra título da tela atual + sub-label do portal + ações (lang switcher, status pill, voltar ao login).
- **Main scrollable**: conteúdo da tela, padding `28px 32px`.

### Cards (padrão)
```
background: #FFFFFF
border: 1px solid #DDE1E8
border-radius: 12px
box-shadow: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)
```
Headers de card têm padding `16px 20px 12px` e border inferior `#EAECF0`.

### KPI Card
- Padding `18px 18px 16px`
- Top row: label (13px, 500, `#334155`) + ícone (30×30 com fundo soft + cor brand/ok/warn/bad)
- Valor: 28px, 600, `#0F172A`, letter-spacing -0.02em
- Sub: 12.5px, `#64748B`, marginTop 6px

### Tabela / Lista
- Header: padding `12px 22px`, fundo `#F7F8FA`, font 11.5px 600 letter-spacing 0.04em color `#64748B`
- Rows: padding `12px 22px`, border-bottom `#EAECF0`, hover `#F2F4F7`
- Avatares: 34px round, iniciais coloridas (paleta determinística por hash do nome — ver `EPAvatar`/`CPAvatar` nos arquivos `.jsx`)

### Ranking Row (Arena)
- Grid: `28px auto 1fr auto` (ou `28px auto 1fr 120px auto` quando inclui coluna de coach)
- Medalha (pos 1/2/3): pill 24px com cores `#FEF3C7`/`#E2E8F0`/`#FED7AA` e fg `#A16207`/`#475569`/`#C2410C`
- XP em JetBrains Mono, 14px 600

### Pills de Status (Risk / Subscription)
- Tones: `ok` (verde), `warn` (âmbar), `bad` (vermelho), `info` (azul), `mute` (slate), `brand` (cyan)
- Cada tone tem trio bg/fg/border (ver tokens `T.okSoft/ok/okLine` etc.)
- Dot indicator opcional (círculo 6px da cor do fg)

---

## Interactions & Behavior

- **Click em row de aluno** → abre drawer lateral (`StudentDrawer`) com abas: resumo, treino, dieta, validações, assinatura.
- **Click em row de empresa (Sala de Controle)** → abre drawer com detalhes e ações de billing.
- **Tecla `Esc`** → fecha drawer/modal aberto.
- **Filtros de fila (Treinos/Dietas)**: chips `Todos / Críticos / Atenção / Sem sinal` com contagem.
- **Busca**: input com ícone, filtra por nome+email em tempo real.
- **Lang switcher**: PT-BR / EN / IT (i18n via `window.t`). Persiste em `localStorage`.
- **Sidebar collapse**: animado 200ms ease.
- **Hover de row**: transition `background 120ms ease`.

---

## Design Tokens

### Colors (Light theme — Sala/Empresa/Coach panels)
```
/* Backgrounds */
bg:            #F0F2F5
bgAlt:         #E8EBF0
surface:       #FFFFFF
surfaceAlt:    #F7F8FA
surfaceHover:  #F2F4F7

/* Sidebar (deep navy) */
sidebar:         #0B1120
sidebarBorder:   rgba(255,255,255,0.07)
sidebarHover:    rgba(255,255,255,0.06)
sidebarActive:   rgba(82,231,255,0.13)
sidebarActiveBd: rgba(82,231,255,0.60)
sidebarFg:       rgba(255,255,255,0.72)
sidebarFgActive: #FFFFFF

/* Text */
fg:   #0F172A   (primary)
fg2:  #334155   (secondary)
fg3:  #64748B   (tertiary)
fg4:  #94A3B8   (placeholder/quaternary)
fg5:  #CBD5E1

/* Borders */
border:        #DDE1E8
borderStrong:  #C8CDD6
borderSoft:    #EAECF0

/* Brand cyan */
brand:        #0E7490   (text/icon on light bg — a11y)
brandStrong:  #0891B2
brandDeep:    #155E75
brandSoft:    #ECFEFF
brandSoft2:   #CFFAFE
brandLine:    #A5F3FC
cyan:         #52e7ff   (full brand — only on dark sidebar)

/* Status */
ok:    #15803D / okSoft #DCFCE7 / okLine #BBF7D0
warn:  #B45309 / warnSoft #FEF3C7 / warnLine #FDE68A
bad:   #B91C1C / badSoft #FEE2E2 / badLine #FECACA
info:  #1D4ED8 / infoSoft #DBEAFE / infoLine #BFDBFE
mute:  #475569 / muteSoft #F1F5F9 / muteLine #E2E8F0
```

### Typography
- **UI (default)**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`
- **Mono (numbers, IDs, XP)**: `"JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace`

### Spacing
Múltiplos de 4: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

### Border radius
- 6 / 8 / 10 / 12 (cards) / 14 / 16 / 999 (pills, avatars)

### Shadows
```
shadow1: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)
shadow2: 0 4px 12px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.05)
shadow3: 0 12px 32px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.07)
shadowFloat: 0 24px 60px rgba(15,23,42,0.20), 0 8px 24px rgba(15,23,42,0.10)
```

---

## Data Model (resumido)

### Student
```ts
{
  id: string;
  name: string;
  email: string;
  phone: string;
  coachId: string;
  sex: "M" | "F";
  age: number;
  active: boolean;
  archived: boolean;
  weeklyXp: number;
  monthlyXp: number;
  totalXp: number;
  currentStreak: number;
  validationsTotal: number;
  lastValidationAt: ISOString | null;
  lastActiveAt: ISOString;
  subscriptionStatus: "active" | "paused" | "overdue" | "cancelled" | "trial";
  subscriptionEndsAt: ISOString | null;
  avatarStage: "baby" | "teen" | "adult" | "elite";
  visibleInArena: boolean;
}
```

### Coach
```ts
{ userId, name, email, role: "coach", active, teamId }
```

### Team (Empresa)
```ts
{ id, name, plan: "start" | "pro" | "custom", status, customLimits, usage: { students, coaches } }
```

### Log
```ts
{ id, action, timestamp, actorRole, actorUserId, targetUserId }
```

Veja `coach-panel/panel-data.jsx` e `coach-panel/sala-data.jsx` para mocks completos e helpers (`calcRisk`, `relativeTime`, `coachName`, `studentsForEmpresa`, `coachesForEmpresa`).

---

## API Endpoints sugeridos (para implementação real)

### Auth
- `POST /auth/login` → `{ token, role, scopeId }`
- `POST /auth/logout`

### Coach scope
- `GET /coach/me`
- `GET /coach/students?filter=ativos|pausados|todos&search=`
- `GET /coach/queue/workouts?risk=`
- `GET /coach/queue/diets?risk=`
- `GET /coach/arena/weekly` → top N alunos do coach
- `GET /coach/arena/monthly` → top N alunos do coach

### Empresa scope
- `GET /empresa/me`
- `GET /empresa/coaches`
- `GET /empresa/students?coachId=&search=`
- `GET /empresa/queue/{workouts|diets}?risk=`
- `GET /empresa/arena/weekly` → alunos da empresa
- `GET /empresa/arena/monthly` → alunos da empresa
- `GET /arena/global` → **todos** os alunos (acessível à empresa)

### Admin scope
- `GET /admin/overview` → KPIs globais
- `GET /admin/companies` / `GET /admin/companies/:id`
- `GET /admin/coaches`
- `GET /admin/students`
- `GET /admin/logs?action=&actorRole=`
- `PUT /admin/companies/:id/plan`

---

## Internationalization
- 3 idiomas: **pt-BR (default), en, it**
- Chaves usam dot notation: `nav.alunos`, `kpi.alunos_ativos`, `risk.critico`, `rank.semanal`, `rank.todos_alunos`, etc.
- Switcher no header persiste em `localStorage["guto-lang"]`
- Arquivo de referência: `coach-panel/i18n.jsx`

---

## Files in this Handoff

### HTML entry points (referência visual + de fluxo) — **TEMA LIGHT (branco + ciano)**
- `Login.html` — tela de login com seletor de perfil
- `Sala de Controle.html` — admin panel (LIGHT — usar este)
- `Empresa Portal.html` — portal empresa (LIGHT)
- `Coach Portal.html` — portal coach (LIGHT)

> ⚠️ A versão dark ("Sala de Controle (Dark).html") foi **removida deste handoff propositalmente**. Use apenas o tema light: fundo branco/cinza-claro no conteúdo, sidebar deep navy, acentos em ciano (`#0E7490` em texto, `#52e7ff` só no sidebar).

### Componentes/screens (lógica + layout — leia como pseudocódigo de referência)
- `light-shell.jsx` — tokens `T`, atoms (`Card`, `Pill`, `Btn`, `SectionHeader`, `SearchBox`, `SelectInput`, ícones SVG inline `IUsers`/`IShield`/`ICheck`/`IZap`/`IChevR`/`IBuilding`), `Sidebar`
- `light-screens.jsx` — telas da Sala de Controle
- `light-drawers.jsx` — drawers laterais (StudentDrawer, EmpresaDrawer, CreateModal)
- `empresa-screens.jsx` — telas do Empresa Portal (incluindo `EPArenaScreen` recém-atualizado)
- `coach-screens.jsx` — telas do Coach Portal (incluindo `CPArenaScreen` recém-atualizado)
- `panel-shell.jsx` / `panel-screens.jsx` / `panel-student.jsx` — versões antigas (não-light); use só como referência histórica
- `sala-shell.jsx` / `sala-screens.jsx` / `sala-empresa.jsx` — outra iteração da Sala
- `panel-data.jsx` — mocks de alunos/coaches/teams/logs e helpers (`calcRisk`, `relativeTime`)
- `sala-data.jsx` — mocks adicionais (empresas, helpers `studentsForEmpresa`, `coachesForEmpresa`)
- `i18n.jsx` — dicionário PT-BR / EN / IT
- `colors_and_type.css` — design tokens em CSS variables (referência de cores raw + semânticos)

### Asset
- `logo_guto.png` — logo da marca

---

## Implementation Checklist

- [ ] Configurar projeto no stack escolhido (Next.js + TS + Tailwind sugerido)
- [ ] Portar tokens (`T`) para `tailwind.config.ts` / theme tokens
- [ ] Criar componentes base: `Card`, `Pill`, `Btn`, `SectionHeader`, `Avatar` (com paleta determinística), `SearchBox`, `SelectInput`, `Sidebar`, `Header`
- [ ] Implementar layout shell (sidebar + header + main) com collapse
- [ ] Implementar i18n (next-intl ou similar)
- [ ] Implementar autenticação + roteamento por papel
- [ ] **Admin (Sala de Controle)**: 8 telas
- [ ] **Empresa Portal**: 6 telas — atenção especial à Arena (3 rankings, escopo misto)
- [ ] **Coach Portal**: 5 telas — Arena com apenas Semanal + Mensal
- [ ] StudentDrawer (compartilhado entre portais — escopo de ações varia por papel)
- [ ] Implementar regras de acesso server-side: coach só vê seus alunos; empresa só vê seus coaches/alunos (exceto Arena geral); admin vê tudo
- [ ] Telas vazias / loading skeletons / error states

---

## Notes
- O sidebar é **dark** (navy) intencionalmente — contraste com o content area light. Não inverta.
- Brand cyan `#52e7ff` é vibrante demais para uso em texto sobre branco — use sempre `#0E7490` (brand) no content area; cyan puro só no sidebar.
- Números (XP, contagens, IDs) sempre em **JetBrains Mono**. Texto UI em **Inter**.
- Avatares são **iniciais com paleta determinística por hash do nome** — não imagens. Mantenha esse padrão a menos que tenha fotos reais.
- Logos/marcas: usar `logo_guto.png` (fornecido).
