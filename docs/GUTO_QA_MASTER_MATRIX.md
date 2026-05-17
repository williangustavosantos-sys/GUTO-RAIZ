# GUTO — QA MASTER MATRIX

**Data:** 2026-05-16
**Auditor:** Claude (Opus 4.7) — modo executivo
**Status:** FASE 1 (inventário) + FASE 4 (relatório). FASE 2/3 (Playwright live + screenshots fresh) **não executadas neste sandbox** — comandos exatos para Will rodar localmente estão na Seção 7.
**Documentos-âncora:**
- [`GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md`](../GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md) — contrato comportamental
- [`docs/GUTO_AUDITORIA_PAGINA_POR_PAGINA.md`](GUTO_AUDITORIA_PAGINA_POR_PAGINA.md) — auditoria prosa do mesmo dia
- [`CLAUDE.md`](../CLAUDE.md) — definição de produto
- Repo: `guto-app-v0/` (Next.js 16 + React 19 + Tailwind 4 + Sentry) + `guto-backend/` (Express)

> **Regra desta matriz:** linhas tabulares, critérios objetivos, status binário. Não é prosa — é checklist auditável. Cada botão tem 1 linha. Cada tela tem 1 bloco. Status `OK` só com critérios satisfeitos.

---

## 0. Limitação declarada do sandbox

| Item | Status | Motivo |
|---|---|---|
| `npm run build` | ❌ não rodou | EPERM no filesystem montado + SWC arm64 ausente |
| Playwright headless live | ❌ não rodou | sandbox capado em 45s/comando + browser binaries ausentes |
| Screenshots novos | ❌ não gerados | reaproveita os 15 PNGs de hoje em `docs/audit-screenshots/2026-05-16/` |
| Leitura de código-fonte | ✅ completa | todas as 49 rotas/componentes mapeados via Read/Grep |
| Cross-check com auditoria anterior | ✅ feita | 5 falsos-positivos corrigidos |

**O que isso significa:** a matriz abaixo é construída a partir de leitura direta do código + 15 screenshots + audit existente. Para evidência fresca (Playwright em viewport mobile, screenshots novos), use os comandos da Seção 7 na máquina local.

---

## 1. Correções de falsos-positivos na auditoria anterior

| # | Audit anterior dizia | Verdade no código | Implicação |
|---|---|---|---|
| 1 | `pathQuote` nunca em translations | Definido em PT/EN/IT (`translations.ts:189, 320, 451`) | **Não é P1.** Remover do backlog. |
| 2 | `noInjuryFallback` PT-only | Record completo PT/EN/IT (`calibration-screen.tsx:59-63`) | **Não é P1.** Remover do backlog. |
| 3 | Label "Obs" não traduzida | Usa `copy.observation` → PT="Obs"/EN="Note"/IT="Nota" (`mission-tab.tsx:49, 82, 115`) | **Não é P1.** Remover do backlog. |
| 4 | "Riscaldamento" é typo IT | Tradução correta de warm-up em italiano | **Não é P2.** Remover do backlog. |
| 5 | `[GUTO_DIET_ERROR]` loga em prod | Gated por `NODE_ENV !== "development"` → return early (`diet-plan.ts:306`) | **P0 ainda existe** mas pelo motivo correto: dieta inválida É entregue ao usuário, apenas silenciosamente. Reformular descrição. |

Ganhos: 4 P1/P2 falsos removidos do backlog. 1 P0 reescrito com root-cause correto.

---

## 2. Tabela mestra de telas

| # | Stage / Aba | Arquivo principal | LOC | Estados | OK objetivo? | P0 | P1 | P2 |
|---|---|---|---|---|---|---:|---:|---:|
| 1 | `stage="intro"` (cápsula) | `components/guto/screens/splash-screen.tsx` | 115 | loading vídeo, fallback dots, skip-intro | **NÃO** | 0 | 2 | 1 |
| 2 | `stage="language"` | `components/guto/screens/language-screen.tsx` | 86 | escolha PT/EN/IT, persist localStorage | **QUASE** | 0 | 1 | 1 |
| 3 | `/login` | `app/login/page.tsx` | ~200 | idle, loading, erro 401, erro timeout | **NÃO** | 1 | 2 | 1 |
| 4 | `/convite/[token]` + `stage="invite_claim"` | `app/convite/[token]/page.tsx` + `guto-app.tsx:1750+` | ~30 + ~80 | token válido, expirado, password match, claim 200/4xx | **NÃO** | 1 | 2 | 0 |
| 5 | `stage="consent"` | `components/guto/screens/consent-screen.tsx` | 227 | nenhum check, 1 check, 2 checks (CTA libera) | **QUASE** | 0 | 2 | 1 |
| 6 | `stage="naming"` | inline em `guto-app.tsx:2280-2369` | ~90 | vazio, nome digitado, conflito com preset | **QUASE** | 0 | 1 | 0 |
| 7 | `stage="calibration"` | `components/guto/screens/calibration-screen.tsx` | 607 | inputs vazios, parciais, completos, decimais PT vs EN | **QUASE** | 0 | 2 | 1 |
| 8 | `stage="pact"` | `components/guto/screens/agreement-screen.tsx` | 239 | hold 0%, 50%, 100% | **SIM (1 P1)** | 0 | 1 | 0 |
| 9 | `system` tab `guto` (chat) | `components/guto/tabs/chat-tab.tsx` | 1295 | sem msgs, com msgs, proativo aberto, mic ativo, voz on/off | **NÃO** | 1 | 3 | 1 |
| 10 | `system` tab `missao` | `components/guto/tabs/mission-tab.tsx` | 470 | sem plano, plano gerado, started, exercícios marcados, validate | **NÃO** | 1 | 2 | 2 |
| 11 | GUTO Online (overlay) | `components/guto/guto-online-session.tsx` + `lib/guto-online/*` | ~600 | warmup, série ativa, descanso, pausa, dor, finalizar | **NÃO** | 1 | 2 | 1 |
| 12 | `system` tab `dieta` | `components/guto/tabs/diet-tab.tsx` + `lib/diet-plan.ts` | 749 + ~400 | sem plano, gerando, gerado válido, gerado inválido (silencioso) | **QUEBRADA** | 3 | 2 | 1 |
| 13 | `system` tab `caminho` (percurso) | `components/guto/tabs/path-tab.tsx` | 334 | sem histórico, com validações, modal foto aberto | **QUASE** | 0 | 1 | 1 |
| 14 | `system` tab `evolucoes` | `components/guto/tabs/evolutions-tab.tsx` | 165 | baby, teen, adult, elite | **SIM** | 0 | 1 | 1 |
| 15 | `system` tab `arena` | `components/guto/tabs/arena-tab.tsx` | 351 | sem ranking, weekly, monthly, individual | **NÃO** | 0 | 2 | 1 |
| 16 | `stage="settings"` (overlay) | `guto-app.tsx:2583+` | ~700 inline | aberto, sub-modais (idioma, perfil, GDPR) | **NÃO** | 1 | 2 | 1 |
| 17 | `/coach` (painel admin) | `app/coach/` + 10 sub-screens | ~3000 | super-admin, coach, hierarquia bloqueada, demo bypass | **NÃO** | 1 | 2 | 1 |
| 18 | `/admin/login` | `app/admin/login/page.tsx` | ~150 | idle, loading, erro | **NÃO** | 1 | 1 | 0 |
| 19 | `/privacy` | `app/privacy/page.tsx` | ~? | render PT/EN/IT | **QUASE** | 0 | 1 | 0 |
| 20 | `/terms` | `app/terms/page.tsx` | ~? | render PT/EN/IT | **QUASE** | 0 | 1 | 0 |
| 21 | `/billing/{pricing,success,cancel}` | `app/billing/*` | ~? | 3 rotas | **N/A** | 0 | 1 | 0 |
| 22 | `/acesso-pausado` | `app/acesso-pausado/page.tsx` | ~? | estado bloqueado | **QUASE** | 0 | 0 | 0 |
| 23 | `/dev/voice` (debug) | `app/dev/voice/page.tsx` | ~? | dev-only | **N/A** | 0 | 0 | 0 |
| 24 | Estados transversais (erro/loading/vazio) | distribuído | — | API 401/500/timeout | **NÃO** | 1 | 2 | 1 |
| 25 | Memória / idioma / proatividade | `guto-app.tsx` + backend | — | sync, vazamento PT em EN/IT, expiração | **NÃO** | 1 | 3 | 1 |
| 26 | Segurança / GDPR / PII / Sentry | transversal | — | token, imagens, consent, delete, Sentry | **NÃO** | 2 | 2 | 0 |
| 27 | Responsividade mobile real | viewport 390×844 | — | iOS Safari, Android Chrome | **QUASE** | 0 | 1 | 1 |

**Totais brutos:** ~27 superfícies de tela/estado · **P0=15** · **P1=39** · **P2=15** (com remoção dos 4 falsos-positivos).

> **Atenção:** alguns P0 são **compartilhados** entre telas (ex.: imagens públicas afetam Percurso + segurança transversal). A contagem **única de P0 distintos** é **11** (Seção 5).

---

## 3. Matriz botão-por-botão (FASE 1, granular)

> Coluna `Status`: `OK` · `QUEBRADO` · `INCOMPLETO` · `NÃO TESTADO` (Playwright real)
> Coluna `Storage`: o que grava em localStorage/sessionStorage
> Coluna `API`: endpoint chamado
> "—" significa não se aplica

### 3.1 Tela 1: Intro / Cápsula (`stage="intro"`)

Sem botões interativos. Auto-advance via `setTimeout(2500ms)` em `splash-screen.tsx:110`.
- **Risco P1:** botão "INICIAR GUTO" mostrado em PT antes da escolha de idioma (screenshot `01-intro.png`).
- **Risco P1:** vídeo `abertura-guto.mp4` sem `onCanPlay` guard — em conexão lenta, fallback dots termina antes do vídeo carregar.
- **Risco P2:** `?skip-intro=1` bypassa intro inteira sem cache de idioma.
- **OK Criteria:** vídeo carrega em <2s OU fallback estilizado aparece; nenhum texto em idioma do app antes da tela 2.

### 3.2 Tela 2: Seleção de idioma (`stage="language"`)

| # | Botão | Onde | Deveria fazer | Hoje | Muda estado | API | Storage | Navega | Modal | Feedback | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `Português 🇧🇷` | `language-screen.tsx:34` | seleciona pt-BR, persiste, avança | OK | `setLanguage("pt-BR")` em `guto-app.tsx:1149` | — | `guto-onboarding-language` + `guto-selected-language` | unauth: `/login?lang=pt-BR`; auth: `naming` | — | toca som `select` | **OK** |
| 2 | `English 🇺🇸` | `language-screen.tsx:42` | idem en-US | OK | idem | — | idem | idem | — | idem | **OK** |
| 3 | `Italiano 🇮🇹` | `language-screen.tsx:50` | idem it-IT | OK | idem | — | idem | idem | — | idem | **OK** |

- **Risco P1:** `isSupportedLanguage` em `guto-app.tsx:386-388` aceita cast; Safari private mode silencia falha de localStorage.
- **OK Criteria:** click em qualquer cartão → próxima tela renderiza no idioma selecionado E `localStorage["guto-selected-language"]` contém o código.

### 3.3 Tela 3: Login (`/login`)

| # | Botão/Input | Onde | Deveria fazer | Hoje | API | Storage | Navega | Feedback | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | input email/user | `login/page.tsx:~120` | aceitar email/userId | sem validação de formato | — | — | — | — | **INCOMPLETO** |
| 2 | input password | `login/page.tsx:~135` | senha + autoComplete current-password | OK | — | — | — | — | **OK** |
| 3 | btn `ENTRAR/SIGN IN/ENTRA` | `login/page.tsx:168-175` | POST `/auth/login`, salvar JWT, redirect `/` | OK funcional | POST `/auth/login` (`lib/api/auth.ts:41-45`) | `guto-auth-token` (JWT em localStorage) | `/` | spinner, mapeia TIMEOUT/CONNECTION_ERROR | **INCOMPLETO** |
| 4 | botão senha esquecida | inexistente | recuperar acesso | **AUSENTE** | — | — | — | — | **QUEBRADO** (UX) |

- **Risco P0:** backend tests admin/auth falhando ⇒ login pode 401 silencioso em produção.
- **Risco P1:** `console.log("[GUTO_LOGIN] login success")` em `:96` em prod.
- **Risco P1:** JWT em localStorage → XSS exposure. Sem refresh token.
- **OK Criteria:** submit válido → 200 → home; submit inválido → mensagem específica (não genérica); sem `console.log` em prod build.

### 3.4 Tela 4: Convite (`/convite/[token]`) + `stage="invite_claim"`

| # | Botão/Input | Onde | Deveria fazer | Hoje | API | Storage | Navega | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | landing convite | `app/convite/[token]/page.tsx:19-21` | salvar token e redirect `/` | try-catch silencioso | — | `guto-pending-invite-token` | `/` | **INCOMPLETO** (Safari private mode quebra mudo) |
| 2 | input "Criar senha" | `guto-app.tsx:2158+` | senha min 6 | OK | — | — | — | **OK** |
| 3 | input "Confirmar senha" | idem | match | OK | — | — | — | **OK** |
| 4 | btn `ATIVAR MEU GUTO` | idem | POST `/invites/{token}/claim` → auto-login | OK funcional | POST `/invites/{token}/claim` (`lib/api/auth.ts:56-60`) | `guto-auth-token` | `naming` ou `system` | **INCOMPLETO** |

- **P0:** **zero cobertura Playwright** para esse fluxo crítico de aquisição B2B.
- **P1:** sem timeout no claim.
- **OK Criteria:** convite válido + senha válida → claim 200 → entrada em `naming` sem repetir login.

### 3.5 Tela 5: Consentimento (`stage="consent"`)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Navega | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | checkbox "dados de saúde" | `consent-screen.tsx:170` | marcar `consentHealthFitness` | OK | — | — | — | **OK** |
| 2 | checkbox "termos" | `consent-screen.tsx:~185` | marcar `acceptedTerms` | OK | — | — | — | **OK** |
| 3 | link `/terms?lang=` | inline | abrir Terms em nova aba | OK | — | — | new tab | **OK** |
| 4 | link `/privacy?lang=` | inline | abrir Privacy em nova aba | OK | — | — | new tab | **OK** |
| 5 | btn Continuar | `consent-screen.tsx:204` | salvar consent e avançar | desabilitado até ambos check; ao click salva LOCAL apenas | — (local only) | profile com `consentHealthFitness`, `acceptedTerms`, `consentAcceptedAt` | `calibration` | **INCOMPLETO** |

- **Risco P1:** aceite só local; servidor não é notificado de aceite inicial síncrono.
- **Risco P1:** revogação (`POST /guto/consent/revoke`) limpa `age` mas NÃO `userAge`/`trainingGoal`/`preferredTrainingLocation` (server.ts:3793-3813).
- **OK Criteria:** aceite síncrono no servidor antes de avançar.

### 3.6 Tela 6: Naming (`stage="naming"`)

| # | Botão/Input | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | input "Como você quer ser chamado?" | inline `guto-app.tsx:2280-2369` | aceita nome livre | OK | — | — | **OK** |
| 2 | btn Confirmar | inline | salvar `committedName` | OK; sobrescreve presetName do convite | POST `/guto/memory` | profile.name | **INCOMPLETO** |

- **Risco P1:** `isGenericGutoName` em `lib/guto-profile.ts:64` usa `toLocaleLowerCase("pt-BR")` — pode normalizar mal em IT/EN com diacríticos exóticos. Risco baixo (ASCII domina).
- **OK Criteria:** nome confirmado pelo usuário SEMPRE vence preset do convite.

### 3.7 Tela 7: Calibragem (`stage="calibration"`)

| # | Botão/Input | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | sexo `female/male/prefer_not_to_say` | `calibration-screen.tsx:201-215` | pill selecionável | OK | — | — | **OK** |
| 2 | input idade (14-99) | `:229-246` | número inteiro | OK | — | — | **OK** |
| 3 | input peso (30-300, step 0.1) | `:262-280` | decimal | aceita ponto; **vírgula PT-BR quebra** | — | — | **INCOMPLETO (P1)** |
| 4 | input altura (100-250) | `:295-313` | número | OK | — | — | **OK** |
| 5 | input país | `:169-175` | texto livre | sem validação ISO | — | — | **INCOMPLETO** |
| 6 | input restrições alimentares | `:180-186` | texto livre | sem validação | — | — | **INCOMPLETO** |
| 7 | pills nível (4 opções) | `:339-342` | uma seleção | OK | — | — | **OK** |
| 8 | pills objetivo (5 opções) | `:373-376` | uma seleção | OK | — | — | **OK** |
| 9 | pills local (4 opções) | `:383-386` | uma seleção | OK | — | — | **OK** |
| 10 | input patologia/lesão | `:349-355` | texto + fallback `noInjuryFallback` | OK (fallback localizado em PT/EN/IT) | — | — | **OK** |
| 11 | input intolerâncias | `:360-367` | texto livre | sem validação | — | — | **INCOMPLETO** |
| 12 | btn **CALIBRAR** | `:391-413` | salva memória + avança | desabilitado se `!isComplete` | POST `/guto/memory` | memory completa | **INCOMPLETO** |

- **Risco P1:** `getMissingCalibrationFields` em `lib/guto-profile.ts:76-85` **não exige país, restrições e intolerâncias** — sistema considera calibragem completa sem campos críticos para dieta. **Esse é o root cause do P0 da dieta.**
- **Risco P1:** input decimal com vírgula (`75,5` em pt-BR locale) é rejeitado.
- **OK Criteria:** calibragem aceita TODOS os campos críticos para dieta antes de avançar.

### 3.8 Tela 8: Pacto (`stage="pact"`)

| # | Interação | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | hold de 1600ms (fingerprint) | `agreement-screen.tsx` | confirmar compromisso | OK; `pactCompleteRef` previne re-trigger | POST `/guto/memory` (via persistProfile) | profile com `pactAccepted:true, onboardingComplete:true` | **OK** |

- **Risco P1:** **sem teste Playwright cobrindo o pact**.
- **OK Criteria:** hold completo dispara feedback áudio + transição imediata para `system`.

### 3.9 Tela 9: Home / Chat (`system` tab `guto`)

| # | Botão/Input | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | input mensagem | `chat-tab.tsx:1220-1231` | Enter submete | OK | — | — | **OK** |
| 2 | btn Mic | `:1203-1218` | grava áudio, transcreve | onPointerDown→startRecording | POST `/voice/transcribe` (assumido) | — | **NÃO TESTADO** (falta teste) |
| 3 | btn Send | `:1233-1245` | POST `/guto` | OK | POST `/guto` `{profile,input,language,history,expectedResponse}` | history em localStorage (max 24) | **INCOMPLETO** |
| 4 | toggle Som on/off | `:1124-1155` | persiste preferência | OK | — | `guto-voice-enabled-${userId}` | **OK** |
| 5 | bolha proativa Confirm | inline | confirma evento proativo | OK | PATCH `/guto/proactive/{id}` `{action:"confirm"}` | — | **INCOMPLETO** |
| 6 | bolha proativa Discard | inline | descarta evento | OK | PATCH `/guto/proactive/{id}` `{action:"discard"}` | — | **INCOMPLETO** |
| 7 | bolha proativa Validate | inline | valida ocorrência | OK | PATCH `/guto/proactive/{id}` `{action:"validate"}` | — | **INCOMPLETO** |

- **P0:** `chat-tab.tsx:1090-1094` injeta `"Pergunta do usuário"` em PT no prompt de follow-up de dieta — vaza em EN/IT.
- **P1:** fallback `profile.name = "Usuário"` em PT mesmo em EN/IT (`:850-852`).
- **P1:** dúvida de exercício envia pouco contexto (`:951-970`); dúvida de dieta não inclui intolerâncias (`:989-1001`).
- **P1:** avatar com fundo cinza recortado (screenshot `07-home-chat.png`).
- **OK Criteria:** chat em EN nunca contém token PT; mic funciona em iOS Safari real.

### 3.10 Tela 10: Treino / Missão (`system` tab `missao`)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | btn Start/Reset | `mission-tab.tsx:382-399` | toggle `started` | OK | — | — | **OK** |
| 2 | btn `GUTO PERSONAL ONLINE` | `:402-414` | abre overlay | OK | — | — | **INCOMPLETO** |
| 3 | checkbox exercício (×N) | `:258-268` | marcar feito | `toggleExercise()` muda estado local | — | — | **OK** |
| 4 | btn `?` dúvida exercício | `:279-286` | pula para chat com contexto | abre chat, MAS contexto enviado é pobre | POST `/guto` | — | **INCOMPLETO (P1)** |
| 5 | btn `VALIDATE WORKOUT` | `:442-453` | abre fluxo câmera | desabilitado se `invalidWorkoutVideo \|\| !canComplete` | — | — | **INCOMPLETO** |

- **P0:** histórico "ontem/anteontem" falha em backend tests — IA repete grupo muscular (viola Santo Graal).
- **P1:** validação de vídeo só checa prefixo/metadata, não existência real (`:144-151`).
- **P1:** fallback `createLocalWorkoutPlan` (`lib/workout-plan.ts`) usa catálogo pequeno.
- **P2:** carga não tem campo operacional para o usuário ajustar.
- **OK Criteria:** dúvida de exercício envia treino completo + exercício específico ao chat; validação só habilita com vídeo carregado.

### 3.11 Tela 11: GUTO Personal Online (overlay)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | btn Play/Pause descanso | `guto-online-session.tsx` | toggle timer | OK | — | session local | **INCOMPLETO** |
| 2 | btn Voice toggle | `guto-online-voice-toggle.tsx` | mute/unmute | OK | — | `guto-online-voice-mode` | **OK** |
| 3 | Quick Talk (mic) | `guto-online-quick-talk.tsx` + `guto-online-context-guard.ts:43-80` | dor/troca/fadiga | **regex hardcoded** (viola Santo Graal — LLM com contexto) | POST `/guto/online/exception` | — | **QUEBRADO (P0 conceitual)** |
| 4 | btn Close X | `:` | fecha overlay sem perda | OK | — | session limpa? | **OK** |
| 5 | btn `Finalizar/Validar` | `:629-633` | abrir validação real de câmera | **só chama `onFinish` e fecha** — não dispara câmera | — | — | **QUEBRADO (P1)** |

- **P0:** `lib/guto-online/guto-online-storage.ts:53` `buildStorageKey(workoutKey)` **sem userId** — dois usuários no mesmo navegador colidem.
- **P0:** backend `/guto/online/exception` usa `(req as any).user?.language` mas middleware popula `req.gutoUser` → cai para PT (`server.ts:5258`).
- **P1:** plano remove aquecimento dos exercícios e mostra item genérico `AQUECIMENTO`.
- **OK Criteria:** sessão isolada por userId; quick talk dispara LLM com contexto; botão Validar abre fluxo de câmera real.

### 3.12 Tela 12: Dieta (`system` tab `dieta`) — **QUEBRADA**

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | btn `?` por alimento | `diet-tab.tsx:279-290` | abrir chat com substituição | OK | POST `/guto` | — | **INCOMPLETO (P1)** |
| 2 | expand/collapse refeição | `:220-250` | toggle | OK | — | — | **OK** |
| 3 | btn Regenerar dieta | `:709-718` | gerar nova dieta com confirm | `window.confirm` se locked | POST `/guto/diet/generate` (timeout 50s `:484-490`) | — | **INCOMPLETO** |

- **P0 (1):** **dieta gera plano com macros internamente inválidos** — `lib/diet-plan.ts` validação reporta `valid:false, foodsKcal:480 vs mealKcal:620, mealsKcal:620 vs targetKcal:2900` mas só loga em dev. Em prod, dieta inválida é entregue silenciosamente.
- **P0 (2):** `createLocalDietPlan` (`lib/diet-plan.ts:43-80`) usa iogurte/ovos/frango/parmesão **mesmo com lactose/veganismo**. Sanitização (`:83-124`) só confere calorias/macros, não alergênicos. **Risco sanitário e jurídico.**
- **P0 (3):** backend `/guto/diet/generate` defaulta país para Brasil (`server.ts:5035`) se ausente.
- **P1:** coach diet precedência silenciosa — usuário não sabe se vê dieta do coach ou do GUTO.
- **P1:** estado vazio fraco ("Não foi possível gerar a dieta.") fora do tom GUTO.
- **OK Criteria:** dieta com lactose declarada NÃO contém laticínios; teste Playwright que cobre esse caso; sanitização rejeita ou regera plano se ferir restrição.

### 3.13 Tela 13: Percurso (`system` tab `caminho`)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | click no poster de validação (×N) | `path-tab.tsx:284-303` | abre modal fullscreen | OK | — | — | **OK** |
| 2 | btn X fechar modal | `:322-329` | fecha modal | OK | — | — | **OK** |

- **P0 herdado:** imagens de validação **públicas via Express static** (server.ts:491-494; storage.ts:13-17) — qualquer URL acessível sem auth. Selfies de usuário expostas.
- **P1:** captura mostrou `0 XP hoje` apesar de 100 XP inicial — separação XP inicial vs XP do dia.
- **OK Criteria:** imagens só acessíveis com signed URL; XP do dia ≠ XP inicial.

### 3.14 Tela 14: Evoluir / XP (`system` tab `evolucoes`)

Read-only. Sem botões interativos.

- **P1:** `evolutionCardsFixture` em `view-models.ts:8` é hardcoded — se thresholds mudam no backend, frontend diverge.
- **OK Criteria:** estágio atual reflete `getNextGutoEvolutionXp(memory.totalXp)`.

### 3.15 Tela 15: Arena (`system` tab `arena`)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | sub-tab Semana | `arena-tab.tsx:284-298` | mostra ranking semanal | OK | GET `/guto/arena/weekly` | — | **INCOMPLETO** |
| 2 | sub-tab Mês | `:284-298` | ranking mensal | OK | GET `/guto/arena/monthly` | — | **INCOMPLETO** |
| 3 | sub-tab Individual | `:284-298` | ranking global | OK | GET `/guto/arena/individual` | — | **INCOMPLETO** |

- **P1:** mock Playwright retorna `{entries:[]}`, backend devolve `items` — contrato divergente (`e2e/guto.spec.ts:180-183`). Teste verde mascarando bug.
- **P1:** comparação string multilíngue `item.status === "EM CHAMAS" \|\| "ON FIRE"` (`:75`) — deveria ser enum.
- **OK Criteria:** Playwright mock = contrato real do backend.

### 3.16 Tela 16: Settings (`stage="settings"`)

| # | Botão | Onde | Deveria fazer | Hoje | API | Storage | Status |
|---|---|---|---|---|---|---|---|
| 1 | btn `Baixar meus dados` | `guto-app.tsx:1566-1608` | blob JSON | OK funcional, mas só dados locais | — | download | **INCOMPLETO** |
| 2 | btn `Revogar consentimentos` | `:1616-1631` | revoga server | POST `/guto/consent/revoke` com fallback local mesmo se 401/500 | POST `/guto/consent/revoke` | profile reset | **INCOMPLETO** |
| 3 | btn `Excluir definitivamente` | `:1636-1645` | delete account | DELETE `/guto/account` `{confirmation:"EXCLUIR"}` **fixo PT** | DELETE `/guto/account` | — | **QUEBRADO em EN/IT** |
| 4 | input "Digite EXCLUIR" | inline | confirmar deleção | palavra exigida em PT mesmo EN/IT | — | — | **QUEBRADO em EN/IT** |
| 5 | btn editar campos (×N) | inline | submodais de edição | OK por campo | POST `/guto/memory` por campo | profile parcial | **OK** |
| 6 | btn idioma (sub-modal) | inline | trocar idioma in-app | OK | POST `/guto/memory` | `guto-selected-language` | **OK** |

- **P0:** **zero cobertura Playwright** para fluxo GDPR (delete/revoke).
- **P1:** seção header "Consentimento" hardcoded PT (`guto-app.tsx:3169`).
- **P1:** labels truncadas em mobile: `LIMITAC...`, `INTOLER...`.
- **P1:** exportação só local — falsa impressão de completude.
- **P1:** Sentry `tracesSampleRate:1` + `replaysOnErrorSampleRate:1` em prod sem `beforeSend` filter.
- **OK Criteria:** confirmação de delete localizada PT/EN/IT; exportação inclui histórico do servidor.

### 3.17 Tela 17: Coach panel (`/coach`)

10 sub-screens: `aprovacoes / arena / banco / coaches / dietas / empresas / hoje / logs / students / treinos`.

Botões críticos:
| # | Botão | Onde | Deveria fazer | Hoje | API | Status |
|---|---|---|---|---|---|---|
| 1 | `Editar treino ›` | `treinos-screen.tsx` | abre drawer aluno | OK funcional | GET/PUT `/admin/students/{id}/workout` | **INCOMPLETO** |
| 2 | Aprovar exercício | `aprovacoes-screen.tsx` | POST aprovar | OK | POST `/admin/exercises/{id}/approve` | **INCOMPLETO** |
| 3 | Rejeitar exercício | `aprovacoes-screen.tsx:146` | exige motivo | usa **`window.prompt("Motivo?")`** sem sanitização | POST `/admin/exercises/{id}/reject` | **QUEBRADO (P1)** |
| 4 | Copiar convite | aluno drawer | clipboard token | OK | — | **OK** |
| 5 | Regenerar convite | aluno drawer | gerar novo | **sem confirmação** | POST `/admin/invites/regenerate` | **INCOMPLETO** |
| 6 | Editar dieta aluno | `tab-dieta.tsx` | override dieta | OK funcional | PUT `/admin/students/{id}/diet` | **INCOMPLETO** |

- **P0:** backend tests admin/coach falham com 401 — confiança em painel comprometida.
- **P0:** **zero cobertura Playwright para B2B inteiro**.
- **P1:** demo bypass `?demo` se `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true` (`lib/api/client.ts:15-25`). Se env vazar para prod, painel coach abre sem login.
- **P1:** backend permite vídeo de exercício 30s; Santo Graal exige 15s (`server.ts:112-114`).
- **P2:** painel inteiro em PT (aceitável para B2B BR, P2 se vender fora).
- **OK Criteria:** rejeitar exercício abre modal custom (não `window.prompt`); regenerar convite confirma; demo bypass desligado em prod.

### 3.18 Telas 18-23: secundárias

| Tela | Notas |
|---|---|
| `/admin/login` | mesmas falhas de `/login` (token, sem teste de fluxo). **P0 backend tests**. |
| `/privacy` | **cita Supabase que não existe no código** — erro de transparência. **P1**. |
| `/terms` | render OK em 3 idiomas. |
| `/billing/{pricing,success,cancel}` | 3 rotas estáticas; fluxo de pagamento real não auditado. **P1 sem teste**. |
| `/acesso-pausado` | estado bloqueado; sem botão de ação. |
| `/dev/voice` | rota debug; deve estar gated em prod. |

### 3.19 Estados transversais

| Estado | Onde | Status | Observação |
|---|---|---|---|
| Loading global | `<Loader2>` em `page.tsx`, `login/page.tsx`, `diet-tab` | **OK** | consistente |
| Erro 401 | `lib/api/client.ts:44-65` | **OK** | dispara auto-logout |
| Erro 500/timeout | `client.ts` | **INCOMPLETO** | strings PT/EN misturadas |
| Estado vazio dieta | `diet-tab.tsx` | **INCOMPLETO** | mensagem seca |
| Estado vazio arena | `EmptyState` em `arena-tab.tsx:320-326` | **OK** | |
| Skeletons | só arena | **P2** | resto sem skeleton |
| Fallback voz | SpeechSynthesis browser | **P1** | voz errada pior que silêncio |
| Fallback câmera (skip-camera) | envia base64 vazio | **P0** | backend rejeita por exigir `imageBase64` → usuário preso |

### 3.20 Memória / idioma / proatividade (transversal)

| Aspecto | Status | Observação |
|---|---|---|
| Persistência local antes do backend confirmar | **P0** | `guto-app.tsx:703-717` `persistMemory` atualiza estado antes de POST → falsa sensação de salvo |
| `local-user` em prod | aparentemente removido | confirmar via grep |
| Storage do GUTO Online sem userId | **P0** | `guto-online-storage.ts:53` colisão entre usuários no mesmo browser |
| Vazamento PT em EN/IT | **P1 múltiplo** | Lista consolidada na Seção 4 |
| Proatividade depende de chat aberto | **P1** | sem push server→frontend; intervalo 60s |
| Expiração de memória antiga | **P1** | sem mecanismo amplo |

### 3.21 Segurança / GDPR / PII

| Aspecto | Status |
|---|---|
| JWT em localStorage (XSS) | **P1** documentado |
| **Imagens de validação públicas** | **P0 crítico** — selfies expostas sem signed URL |
| Consent server-side síncrono | **P1** |
| Delete confirmação PT-only | **P1** |
| Sentry sem `beforeSend` + `tracesSampleRate:1` | **P1** |
| Source maps em Sentry | aceitável, documentar |
| Demo bypass `?demo` | **P1** |
| Privacy cita Supabase inexistente | **P1** |

---

## 4. Vazamentos de idioma consolidados

| # | Onde | Texto PT vazando | Linguagem afetada | Severidade |
|---|---|---|---|---|
| 1 | `lib/api/auth.ts:71` | `{confirmation: "EXCLUIR"}` | EN/IT | **P1** (quebra delete em EN/IT) |
| 2 | `guto-app.tsx:3169` | header `"Consentimento"` em settings | EN/IT | **P1** |
| 3 | `chat-tab.tsx:850-852` | `profile.name = "Usuário"` fallback | EN/IT | **P1** |
| 4 | `chat-tab.tsx:1090-1094` | follow-up dieta `"Pergunta do usuário"` | EN/IT | **P1** |
| 5 | `guto-backend/server.ts:5258` | `(req as any).user?.language` cai p/ PT | EN/IT | **P1** |
| 6 | `lib/api/client.ts:44-65` | mensagens de erro mistas PT/EN | EN/IT | **P1** |
| 7 | painel coach | UI inteira PT-only | nenhuma (B2B BR) | **P2** se internacionalizar |

**Falsos-positivos removidos:** `pathQuote`, `noInjuryFallback`, label "Obs", "Riscaldamento" — todos OK.

---

## 5. Lista única consolidada — P0 distintos

Estes são os **11 P0 distintos** (não duplicados entre telas):

| # | P0 | Onde | Risco | Recomendação imediata |
|---|---|---|---|---|
| 1 | Dieta entrega plano com macros inválidos silenciosamente em prod | `lib/diet-plan.ts:300-313` | confiança do usuário + risco saúde | promover validação para throw em dev e Sentry capture em prod; gating no UI |
| 2 | Dieta não respeita intolerâncias/restrições/país | `lib/diet-plan.ts:43-124` + `guto-backend/server.ts:5035` | **risco sanitário/jurídico** | sanitização rejeita ou regera plano se ferir restrição; backend rejeita gerar sem país/intolerâncias |
| 3 | Calibragem não exige país/restrições/intolerâncias | `lib/guto-profile.ts:76-85` | causa raiz do #2 | adicionar campos ao `getMissingCalibrationFields` |
| 4 | Imagens de validação públicas | `guto-backend/server.ts:491-494` + `storage.ts:13-17` | **privacidade (selfies)** | signed URLs com expiração curta |
| 5 | GUTO Online storage sem userId | `lib/guto-online/guto-online-storage.ts:53` | colisão multi-usuário no mesmo browser | incluir userId no `buildStorageKey` |
| 6 | Validar do GUTO Online só fecha, não dispara câmera | `guto-online-session.tsx:629-633` | usuário não valida treino real | ligar ao `WorkoutValidationFlow` |
| 7 | Skip-camera envia imagem vazia, backend rejeita | `WorkoutValidationFlow` + backend | usuário preso | aceitar skip OU exigir imagem (escolher um) |
| 8 | Histórico "ontem/anteontem" falha (backend tests) | `guto-backend` | IA repete grupo muscular (Santo Graal violado) | corrigir backend tests + asserts contextuais |
| 9 | Backend tests falhando em auth/admin/coach | `guto-backend/tests` | sem confiança em login/painel B2B | restaurar suite |
| 10 | Zero cobertura Playwright em fluxos críticos | `e2e/` | regressões silenciosas | adicionar testes (lista Seção 6) |
| 11 | Persistência local antes do servidor confirmar | `guto-app.tsx:703-717` | usuário pensa que salvou e perde | atualizar estado só após 200 OK |

---

## 6. Testes Playwright faltantes (cobertura mínima para liberar beta)

| Teste | Prioridade | Cobertura |
|---|---|---|
| `/convite/[token]` happy path → home | **P0** | aquisição B2B |
| Login submit erro 401 → mensagem específica | **P0** | onboarding |
| Settings → Excluir conta confirma PT/EN/IT | **P0** | GDPR |
| Settings → Revogar consentimento | **P0** | GDPR |
| Coach: aprovar/rejeitar exercício | **P0** | B2B |
| Coach: copiar e regenerar convite | **P1** | B2B |
| Dieta: lactose declarada → ausência de laticínios | **P0** | risco sanitário |
| Validação treino com câmera (skip e capture) | **P0** | usuário não fica preso |
| Chat: dúvida exercício envia contexto completo | **P1** | qualidade do chat |
| GUTO Online: dor/troca/fadiga adapta carga | **P1** | presença prometida |
| Arena: contrato `items` vs mock `entries` | **P1** | bugs silenciosos |
| Mobile WebKit (iOS Safari) full suite | **P1** | público real |
| Chat enviar mensagem em EN — sem token PT no payload | **P1** | identidade multi-idioma |
| Pact hold completo dispara `system` | **P1** | onboarding |

---

## 7. Comandos para o Will rodar localmente (FASE 2 + FASE 3)

> Estas etapas o sandbox não pode rodar. São os comandos exatos para gerar a evidência fresh na máquina do Will.

### 7.1 Setup

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0

# Garantir submódulos:
git submodule update --init --recursive

# Garantir Playwright + browsers:
npm install
npx playwright install chromium webkit

# Backend rodando em paralelo:
cd ../guto-backend && npm install && npm run dev
# (deixa rodando em outro terminal)
```

### 7.2 Build limpo

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
npm run build 2>&1 | tee /tmp/guto-build.log
# Esperado: "Compiled successfully" + 13 rotas. Qualquer warning não-Sentry vira P1.
```

### 7.3 Playwright suite atual (estabelecer baseline)

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
mkdir -p docs/qa-screenshots/full-app-audit-2026-05-16
npx playwright test --reporter=list 2>&1 | tee /tmp/guto-playwright.log
# Mover screenshots:
cp -r docs/audit-screenshots/2026-05-16/*.png docs/qa-screenshots/full-app-audit-2026-05-16/ 2>/dev/null || true
```

### 7.4 Playwright com captura por aba (gera screenshots novos)

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
DEBUG=pw:api npx playwright test e2e/audit-screenshots.spec.ts \
  --reporter=list \
  --headed=false 2>&1 | tee /tmp/guto-screenshots.log
# Screenshots vão para docs/audit-screenshots/page-by-page-2026-05-16/
```

### 7.5 Console errors + network failures (logs reais)

Adicionar ao `e2e/audit-screenshots.spec.ts` (não fazer agora — só quando aprovado):

```ts
test.beforeEach(async ({ page }) => {
  page.on('console', m => { if (m.type() === 'error') console.error('[BROWSER ERROR]', m.text()) })
  page.on('requestfailed', r => console.error('[NETFAIL]', r.url(), r.failure()?.errorText))
  page.on('response', r => { if (r.status() >= 400) console.error('[HTTP', r.status(), ']', r.url()) })
})
```

### 7.6 Variações de idioma (cobre FASE 3 idioma)

Já coberto pelos testes 04/05/06 em `guto.spec.ts`. Para variações de usuário/Arena/localStorage/API, criar arquivo `e2e/audit-variations.spec.ts` em sprint dedicada (não fazer agora).

---

## 8. Ordem de correção recomendada (FASE 5 — só após Will aprovar)

> Cada bloco é um PR pequeno, isolado, com teste Playwright correspondente.

### Bloco A (segurança + saúde — primeiro)
1. **P0-4 Imagens públicas** — signed URLs no `guto-backend`. PR pequeno. Teste: GET sem token retorna 401.
2. **P0-2 + P0-3 + P0-1 Dieta segura** — `getMissingCalibrationFields` exige campos críticos; `sanitizeDietPlan` rejeita laticínios se lactose; backend recusa default Brasil; promover error log para throw em dev + Sentry em prod. Teste: lactose → 0 laticínios.

### Bloco B (presença prometida)
3. **P0-5 + P0-6 + P0-7 GUTO Online + Validação** — userId no storage; botão Validar abre câmera real; skip-camera coerente. Teste: 2 usuários no mesmo browser não colidem.
4. **P0-8 Histórico contextual** — restaurar backend tests + asserts contextuais.

### Bloco C (cobertura)
5. **P0-9 Backend tests verdes** — recuperar suite auth/admin/coach.
6. **P0-10 Playwright crítico** — adicionar 8 testes da Seção 6 (P0).
7. **P0-11 Persistência síncrona** — `persistMemory` atualiza estado só após 200.

### Bloco D (idioma + UX)
8. **P1 idioma 7 vazamentos** — consolidar em `translations.ts`; eliminar `inviteClaimCopy`, `stageCopy`, copy local do login.
9. **P1 Sentry** — `beforeSend` filter + `tracesSampleRate: 0.2`.
10. **P1 demo bypass** — gating duro por env só em preview, nunca em prod.

### Bloco E (polish — após beta)
P2s ficam para a sprint pós-beta. Lista mínima: skeletons em todas as abas, labels truncados em settings, microcopy GUTO em estados vazios, safe-area iOS.

---

## 9. Resposta direta às perguntas da FASE 4

| Pergunta | Resposta |
|---|---|
| Quantas telas existem? | **27 superfícies** (Tabela Seção 2) |
| Quantos botões existem? | **~85 interações distintas** mapeadas botão-a-botão na Seção 3 |
| Quantos inputs existem? | **~25 inputs** (calibragem 12, login 2, naming 1, convite 2, settings ~8) |
| Quantas chamadas de API existem? | **~30 endpoints distintos** entre frontend e `guto-backend` |
| Quantos problemas P0? | **11 distintos** (Seção 5) |
| Quantos problemas P1? | **~25 distintos** (consolidando Seção 3 + Seção 4) |
| Quantos problemas P2? | **~12 distintos** |
| Telas OK? | **2:** Evoluir, Pacto (pacto com 1 P1 de cobertura Playwright) |
| Telas não OK? | **23** — todas as outras superfícies têm pelo menos 1 P0 ou P1 |
| Ordem de correção? | Bloco A (saúde/segurança) → B (presença) → C (cobertura) → D (idioma/UX) → E (polish) |

---

## 10. Veredito final desta auditoria

**O GUTO não está pronto para teste com usuários reais.** Está pronto para **rodada interna controlada** com Will + 2-3 testers calibrados que aceitem encontrar dieta inválida silenciosamente, selfies expostas, e GUTO Online que não valida treino de verdade.

**O número que importa do Santo Graal — 20% de 200 duplas ativas em 30 dias — não é mensurável hoje porque três P0 (dieta, imagens, validação) violam o contrato comportamental antes mesmo da retenção entrar em jogo.**

**Próximo passo recomendado:** Will aprova esta matriz e decide se o primeiro bloco é A1 (signed URLs — risco legal de imagem) ou A2 (dieta — risco sanitário). Eu recomendo **A1 primeiro** porque é mudança backend cirúrgica com cobertura de teste óbvia e mitiga risco regulatório imediato; A2 segundo porque exige reescrita de calibragem + sanitização + backend + Playwright (PR maior, mais arriscado).

**Nada será corrigido, commitado ou deployado sem aprovação explícita do Will.**

---

**Fim da matriz.**
