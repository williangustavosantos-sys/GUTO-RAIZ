# GUTO — Auditoria Página por Página, Botão por Botão

Data: **2026-05-16**
Auditor: Claude (Opus 4.7) operando em worktree `funny-swartz-015494`
Repo de código auditado: `/Users/williandossantos/GUTOO/guto-app-v0/` (Next.js 16, React 19, Tailwind 4, Sentry)
Referência absoluta: [`GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md`](../GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md)
Auditoria anterior: [`GUTO_AUDITORIA_COMPLETA_ESTADO_ATUAL.md`](GUTO_AUDITORIA_COMPLETA_ESTADO_ATUAL.md)
Screenshots reutilizados: [`docs/audit-screenshots/2026-05-16/`](audit-screenshots/2026-05-16/)

> **Regra de ouro desta auditoria:** não provar que está bom — descobrir exatamente onde ainda está quebrado para corrigir com precisão. Nenhum código foi modificado.

---

## 1. Resumo Executivo

O CORPOGUTO já existe como produto: 15 telas reais renderizam, build passa limpo, Playwright passa 20/20. Mas a auditoria página-por-página mostra que **a maior parte do app está em estado "Parcial"**: visualmente coerente, comportamentalmente frágil. O Santo Graal exige presença soberana, memória autoritativa e zero vazamento de idioma — o app entrega presença visual mas mantém costuras de mock, fallback PT-BR escondido em prompts internos, e contratos B2B (admin/coach) ainda não validados por testes.

**Veredito de prontidão para o teste com usuários reais:** ainda não. Pode entrar em rodada interna forte e em demo controlada. Os P0 não são visuais — são de comportamento (dieta versus restrições, segurança de imagens de validação, histórico contextual, mock no Playwright).

## 2. Status Geral do Produto

| Métrica | Valor | Observação |
|---|---|---|
| Build (`next build`) | **Verde** | Compilou em 3.2s. 13 rotas, 4 dinâmicas, 9 estáticas. |
| TypeScript | **Verde** | `tsc --noEmit` passou nesta e na auditoria anterior. |
| Playwright | **20/20 verde** | Roda em 18.6s. **Mas mock-heavy** — não prova fluxo real. |
| Erro silencioso em testes | **`[GUTO_DIET_ERROR]`** | `lib/diet-plan.ts:313` loga `valid:false, mealsKcal:620 vs targetKcal:2900` durante o teste 14 da aba dieta. Teste passa porque só checa ausência de timeout; produto está com macros inválidos. |
| Screenshots reais | 15 PNGs em `docs/audit-screenshots/2026-05-16/` | Capturados na auditoria anterior do mesmo dia. Reutilizados aqui. |
| Submódulos no worktree | **vazios** | CORPOGUTO/CEREBROGUTO não inicializados em `funny-swartz-015494/`. Operei sobre o main repo `/Users/williandossantos/GUTOO/guto-app-v0/`. |
| Rotas reais expostas | `/`, `/login`, `/admin/login`, `/coach`, `/convite/[token]`, `/privacy`, `/terms`, `/acesso-pausado`, `/billing/{pricing,success,cancel}`, `/dev/voice`, `/api/guto/[...path]` | Não há `/admin` (somente `/admin/login`). Todo o painel admin entra via `/coach` com hierarquia de permissões. |
| Nota de prontidão para beta pago | **~15%** (preserva a leitura da auditoria anterior, com os mesmos P0 abertos) | Nenhum P0 foi resolvido hoje. |

## 3. Tabela Geral de Páginas

| # | Página/Aba | Rota / Estado | Status | P0 | P1 | P2 | Screenshot | Pode dar OK? |
|---|---|---|---|---:|---:|---:|---|---|
| 1 | Intro / Cápsula | `stage="intro"`, vídeo abertura | Parcial | 0 | 2 | 1 | [01-intro.png](audit-screenshots/2026-05-16/01-intro.png) | Não |
| 2 | Seleção de idioma | `stage="language"` | Parcial | 0 | 1 | 1 | [02-language.png](audit-screenshots/2026-05-16/02-language.png) | Quase |
| 3 | Login / código acesso | `/login` | Parcial | 1 | 2 | 1 | [03-login-en.png](audit-screenshots/2026-05-16/03-login-en.png) | Não |
| 4 | Convite | `/convite/[token]` → `stage="invite_claim"` | Parcial | 1 | 2 | 0 | n/a | Não |
| 5 | Consentimento | `stage="consent"` | Parcial bom | 0 | 2 | 1 | [04-consent-en.png](audit-screenshots/2026-05-16/04-consent-en.png) | Quase |
| 6 | Calibragem | `stage="calibration"` | Parcial bom | 0 | 3 | 2 | [05-calibration-pt.png](audit-screenshots/2026-05-16/05-calibration-pt.png) | Quase |
| 7 | Pacto | `stage="pact"` | Parcial bom | 0 | 1 | 0 | [06-pact-pt.png](audit-screenshots/2026-05-16/06-pact-pt.png) | Sim, com 1 P1 |
| 8 | Home / Chat | `activeTab="guto"` | Parcial | 1 | 3 | 1 | [07-home-chat.png](audit-screenshots/2026-05-16/07-home-chat.png) | Não |
| 9 | Treino / Missão | `activeTab="missao"` | Parcial | 1 | 3 | 2 | [08-missao.png](audit-screenshots/2026-05-16/08-missao.png) | Não |
| 10 | GUTO Personal Online | overlay `onlineOpen` | Parcial crítico | 1 | 2 | 1 | [09-guto-online.png](audit-screenshots/2026-05-16/09-guto-online.png) | Não |
| 11 | Dieta da semana | `activeTab="dieta"` | **Quebrada** | 1 | 2 | 1 | [10-dieta.png](audit-screenshots/2026-05-16/10-dieta.png) | Não |
| 12 | Percurso | `activeTab="caminho"` | Parcial | 0 | 2 | 1 | [11-percurso.png](audit-screenshots/2026-05-16/11-percurso.png) | Quase |
| 13 | Evoluir / XP | `activeTab="evolucoes"` | Parcial | 0 | 1 | 1 | [12-evoluir.png](audit-screenshots/2026-05-16/12-evoluir.png) | Sim |
| 14 | Arena / Ranking | `activeTab="arena"` | Parcial | 0 | 2 | 1 | [13-arena.png](audit-screenshots/2026-05-16/13-arena.png) | Não |
| 15 | Settings / Conta / Privacidade | overlay settings em `guto-app.tsx` | Parcial | 1 | 2 | 1 | [14-settings.png](audit-screenshots/2026-05-16/14-settings.png) | Não |
| 16 | Admin / Coach / Super Admin | `/coach` | Parcial | 1 | 2 | 1 | [15-admin-coach-desktop.png](audit-screenshots/2026-05-16/15-admin-coach-desktop.png) | Não |
| 17 | Fluxos de erro/loading/fallback | transversal | Parcial | 1 | 2 | 1 | n/a | Não |
| 18 | Memória/idioma/proatividade | transversal | Parcial crítico | 1 | 3 | 1 | n/a | Não |
| 19 | Segurança/GDPR/PII | transversal | Parcial | 2 | 2 | 0 | n/a | Não |
| 20 | Responsividade mobile | playwright viewport 390x844 | Parcial | 0 | 1 | 1 | qualquer | Quase |

**Legenda:** Status `OK` (pronto) · `Parcial` (entrega visual coerente, comportamento frágil) · `Parcial bom` (poucos ajustes) · `Quebrada` (não cumpre função declarada).

---

## 4. Detalhe Página por Página

> Cada seção segue o template: **Rota → Santo Graal → Código atual → Tela real → Botões → Inputs → Backend → Idioma → Visual → Segurança → Playwright → Veredito**.

---

### 1. Intro / Abertura do GUTO

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `app/page.tsx` → `<GutoApp skipIntro={?skip-intro=1}/>` → `stage="intro"` em `guto-app.tsx:581`. Pula via `splash-screen.tsx:110` após 2.5s. Disable via `?skip-intro=1`. |
| **Santo Graal exige** | Cápsula futurista, olhos azuis grandes, abertura premium e silenciosa. Idioma persistido. Reload não quebra. |
| **Código atual** | `splash-screen.tsx` (115 linhas) com vídeo local `abertura-guto.mp4` + fallback animado de 3 dots. Auto-advance via `setTimeout` (não usa `onEnded` do vídeo). |
| **Tela real** | [01-intro.png](audit-screenshots/2026-05-16/01-intro.png) — frame pego mostra tela quase branca, botão `INICIAR GUTO`. Cápsula/vídeo não apareceu nesse frame. |
| **Botões** | (1) **Auto-advance** (não-interativo) — `setTimeout(onComplete, 2500ms)` — sem fallback se aba estiver em background. |
| **Inputs** | Nenhum. |
| **Backend** | Nenhum. |
| **Idioma** | Tela é silenciosa, mas o botão `INICIAR GUTO` na captura é PT-BR antes de qualquer escolha de idioma. **P1**. |
| **Visual** | Captura mostra impacto baixo. Asset de vídeo pode demorar para carregar; sem skeleton compatível com a estética premium. |
| **Segurança** | Nenhum risco. |
| **Playwright** | `01 — app abre sem tela branca` e `02 — loader resolve em até 10s` cobrem ausência de tela morta, mas não verificam impacto visual nem presença do vídeo. |
| **Bugs detectados** | (a) Vídeo sem `onCanPlay` guard — se for lento, dot animation finaliza antes. (b) `?skip-intro=1` bypassa intro inteira inclusive sem prova de cache de idioma. |
| **Veredito** | **Não pronto.** P1: trocar fallback genérico por capsula estática; pelo menos não mostrar texto PT antes da escolha de idioma. |

---

### 2. Seleção de Idioma

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `stage="language"` em `guto-app.tsx:581`. Componente: `language-screen.tsx` (86 linhas). |
| **Santo Graal exige** | PT/EN/IT obrigatórios. Sem mistura. Persiste antes de qualquer outro stage. |
| **Tela real** | [02-language.png](audit-screenshots/2026-05-16/02-language.png) — 3 cartões grandes com bandeiras. |
| **Botões** | (1) `Português 🇧🇷` → `onSelect("pt-BR")`; (2) `English 🇺🇸` → `onSelect("en-US")`; (3) `Italiano 🇮🇹` → `onSelect("it-IT")`. Cada um: toca som `select`, escreve `localStorage["guto-onboarding-language"]` + `["guto-selected-language"]` (`guto-app.tsx:1149-1156`); se não autenticado, `router.push("/login?lang=...")` (`:1184`); se autenticado, avança para `naming` (`:1195`). **Não chama backend.** |
| **Inputs** | Nenhum. |
| **Backend** | Idioma só é gravado em `/guto/memory` depois (no chat ou na calibragem). Aqui é puro localStorage. |
| **Idioma** | Labels "Português / English / Italiano" são hardcoded (`language-screen.tsx:11-14`), não traduzidos. Aceitável por convenção, mas a auditoria anterior já marcou inconsistência. |
| **Visual** | Coerente; sem overflow (Playwright teste 15 confirma). |
| **Playwright** | Coberto: testes 03–08 verificam que aparece, persiste em localStorage e não mistura idiomas. |
| **Bugs detectados** | (a) `isSupportedLanguage()` usa `Array.includes` simples (`guto-app.tsx:386-388`) — aceita qualquer string truthy via cast. (b) Se localStorage falha (Safari private mode), avanço continua sem aviso. |
| **Veredito** | **Quase OK.** P1: garantir que tela de pós-erro de localStorage também tem fallback explícito. |

---

### 3. Login / Código de Acesso

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `/login` (`app/login/page.tsx`, ~200 linhas). |
| **Santo Graal exige** | Acesso por convite ou compra. Erros claros. Sem `local-user` em produção. |
| **Tela real** | [03-login-en.png](audit-screenshots/2026-05-16/03-login-en.png) — tela limpa em EN. |
| **Botões** | (1) **ENTRAR / SIGN IN / ENTRA** (`login/page.tsx:168-175`) → `loginUser(emailOrId, password)` (`lib/api/auth.ts:41-45`) → POST `/auth/login`. Loading spinner. Erros mapeados (TIMEOUT/CONNECTION_ERROR/genérico). Em sucesso: salva JWT em `localStorage["guto-auth-token"]` e redireciona para `/`. |
| **Inputs** | (1) `text` "User/Email" — sem validação de formato; (2) `password` com `autoComplete="current-password"`. |
| **Backend** | POST `/auth/login` no CEREBROGUTO. **Backend tests falham em rotas auth/admin/coach** segundo auditoria anterior. |
| **Idioma** | Copy é local-do-arquivo (`login/page.tsx:15-49`), **não usa `translations.ts`**. Funciona PT/EN/IT, mas i18n fragmentado. |
| **Visual** | OK. |
| **Segurança** | (a) Token em `localStorage` → XSS exposure. Sem refresh token. (b) `console.log("[GUTO_LOGIN] login success")` em `login/page.tsx:96` é debug deixado em produção. **P1**. (c) Nenhum rate limit no client; brute-force depende só do backend. |
| **Playwright** | Apenas `19 — página /login renderiza sem erro`. Não há teste de fluxo de submit, erro 401, ou idioma. |
| **Bugs detectados** | Listados em segurança + auditoria anterior (token, console.log, sem timeout). |
| **Veredito** | **Não pronto.** **P0**: backend tests falhando bloqueia confiança em login. P1: tirar console.log, adicionar timeout, mover token para cookie httpOnly ou aceitar XSS como risco documentado. |

---

### 4. Convite (`/convite/[token]`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `app/convite/[token]/page.tsx` (~30 linhas) salva token em localStorage e redireciona para `/`; aí entra no `stage="invite_claim"` dentro de `guto-app.tsx` (linhas ~1750+). |
| **Santo Graal exige** | Acesso por convite. Token único. Não perder usuário em Safari private mode. |
| **Botões** | (1) Submit **ATIVAR MEU GUTO** → `claimInvite(token, password)` (`lib/api/auth.ts:56-60`) → POST `/invites/{token}/claim`. Em sucesso autologa e hidrata. |
| **Inputs** | (1) `password` "Criar senha"; (2) `password` "Confirmar senha". Validação: match + min 6 chars. |
| **Backend** | POST `/invites/{token}/claim`. Token limpo via `clearPendingInviteStorage()` (`guto-app.tsx:978`). |
| **Idioma** | Copy duplicada em `inviteClaimCopy` (`guto-app.tsx:355-384`), **não em translations.ts** — i18n fragmentado. |
| **Segurança** | (a) **localStorage no try-catch silencioso** (`convite/[token]/page.tsx:19-21`) — Safari private mode perde token sem aviso. **P1**. (b) Senha nunca persistida no client (correto). (c) Sem timeout no claim. |
| **Playwright** | **Zero cobertura.** Nenhum teste para o fluxo de convite. **P0** para B2B/beta. |
| **Veredito** | **Não pronto.** P0: cobertura Playwright. P1: avisar usuário se localStorage falha. |

---

### 5. Consentimento

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `stage="consent"` (gatekeeper `resolveAuthenticatedStage` em `guto-app.tsx:536`). Componente: `consent-screen.tsx` (227 linhas). |
| **Santo Graal exige** | Consentimento explícito de saúde + termos. Bloqueio antes do uso. Revogação real (limpa dados). |
| **Tela real** | [04-consent-en.png](audit-screenshots/2026-05-16/04-consent-en.png) — mostrou em PT mesmo em EN por causa de memória de usuário PT-BR vencer o idioma local. Bloqueio do CTA funciona. |
| **Botões** | (1) **Checkbox dados de saúde** (`consent-screen.tsx:170`); (2) **Checkbox termos** (com 2 links `/terms?lang=` e `/privacy?lang=` `target="_blank"`); (3) **CTA Continuar** (`:204`) — desabilitado até ambas marcadas. Em click → `handleConsentAccepted` (`guto-app.tsx:1039`) → escreve `consentHealthFitness: true, acceptedTerms: true, consentAcceptedAt: ISO` em profile **local**. |
| **Inputs** | Apenas checkboxes (role="checkbox" customizado). |
| **Backend** | Aceite inicial não chama API — só persiste localStorage. Backend só é atualizado em pontos posteriores. **Revogação** chama POST `/guto/consent/revoke` (`lib/api/auth.ts:78-80`) com fallback local mesmo se servidor falhar (`guto-app.tsx:1619-1631`). |
| **Idioma** | OK em 3 idiomas; bug histórico de memória PT vencer escolha EN local apareceu na captura. |
| **Segurança** | (a) Backend de revogação limpa `age` mas NÃO `userAge`, `trainingGoal` nem `preferredTrainingLocation` (apontado em auditoria anterior — `guto-backend/server.ts:3793-3813`). **P1**. (b) Aceite não está auditável no servidor antes do uso real. |
| **Playwright** | Não há teste específico de consent (já está dentro do fluxo autenticado mockado). |
| **Veredito** | **Quase OK.** P1: gravar aceite no servidor síncrono; revogação limpar todos os campos. |

---

### 6. Calibragem

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `stage="calibration"` (`guto-app.tsx:544`). Componente: `calibration-screen.tsx` (607 linhas). |
| **Santo Graal exige** | idade, sexo biológico, peso, altura, país, nível, objetivo, local, patologia, restrições e intolerâncias. |
| **Tela real** | [05-calibration-pt.png](audit-screenshots/2026-05-16/05-calibration-pt.png) — visual forte; corpo técnico ao fundo. |
| **Botões (pills)** | (1) **Sexo** — `female / male / prefer_not_to_say` (`:201-215`); (2) **Nível** — `beginner / returning / consistent / advanced` (`:339-342`); (3) **Objetivo** — 5 opções (`:373-376`); (4) **Local** — `academia / casa / parque / misto` (`:383-386`); (5) **CALIBRAR** (`:391-413`) — desabilitado se `!isComplete`. Em click → `onComplete(profile)` → `handleCalibrationComplete` (`guto-app.tsx:1224`) → `persistProfile({calibrationComplete:true, onboardingComplete:false})` + `persistMemory({...todos os campos})` → POST `/guto/memory`. |
| **Inputs** | (1) `number` idade (14–99) (`:229-246`); (2) `number` peso (30–300, step 0.1) (`:262-280`); (3) `number` altura (100–250) (`:295-313`); (4) `text` país (sem validação ISO) (`:169-175`); (5) `text` restrições (`:180-186`); (6) `text` patologia/lesão (`:349-355`) com fallback `noInjuryFallback[language]`; (7) `text` intolerâncias (`:360-367`). |
| **Backend** | POST `/guto/memory` via `saveGutoMemory()` em `handleCalibrationComplete`. |
| **Idioma** | Boa cobertura via `translations.ts`. Mas `noInjuryFallback` PT-only (`:59-63`) e `isGenericGutoName` faz `toLocaleLowerCase("pt-BR")` (`lib/guto-profile.ts:64`). |
| **Visual** | OK; pode confundir input de peso decimal com vírgula em pt-BR locale (auditoria anterior). |
| **Playwright** | Coberto parcialmente (testes mockam memory). |
| **Bugs detectados** | (a) `getMissingCalibrationFields` não exige país/restrições/intolerâncias (`lib/guto-profile.ts:76-85`) — sistema considera calibragem completa sem campos críticos para dieta. **P1**. (b) Inputs decimais não tratam vírgula PT-BR. (c) Labels da prevenção de erros são strings PT. |
| **Veredito** | **Quase OK.** P1: tornar país e intolerâncias obrigatórios para que dieta funcione. |

---

### 7. Pacto Final

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `stage="pact"` (`:566`). Componente: `agreement-screen.tsx` (239 linhas). |
| **Santo Graal exige** | Compromisso com peso psicológico. Hold de 2s. |
| **Tela real** | [06-pact-pt.png](audit-screenshots/2026-05-16/06-pact-pt.png). |
| **Botões** | (1) **Hold (fingerprint)** — `onPointerDown=startHold`, `onPointerUp/Leave/Cancel=endHold`, acumula até 1600ms. Em complete → `playGutoFeedback("hold_complete")` + `startSystem()` (`guto-app.tsx:~1024`) → `persistProfile({pactAccepted:true, onboardingComplete:true})`. |
| **Inputs** | Nenhum. |
| **Backend** | Memória atualizada via `persistMemory` (POST `/guto/memory`). |
| **Idioma** | OK em 3 idiomas. |
| **Playwright** | **Sem teste do pact.** |
| **Bugs detectados** | (a) `pactCompleteRef.current` previne re-trigger, mas não há "voltar" antes do fim — UX OK, mas a11y depende de pointer events que podem falhar em dispositivos com gestos customizados. |
| **Veredito** | **Pronto com 1 P1** (cobertura Playwright). |

---

### 8. Home / Chat (`activeTab="guto"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Após pacto, entra em `stage="system"` com aba inicial `guto`. Componente: `chat-tab.tsx` (1295 linhas). |
| **Santo Graal exige** | Presença ativa, sem chatbot. Respostas curtas e contextuais. Proatividade real. |
| **Tela real** | [07-home-chat.png](audit-screenshots/2026-05-16/07-home-chat.png) — avatar aparece com fundo recortado, saudação longa "Finalmente, AUDIT USER. Tava te esperando...". |
| **Botões** | (1) **Mic** (`:1203-1218`) `onPointerDown=startRecording`; (2) **Send** (`:1233-1245`) → `handleSend()` → POST `/guto` via `sendGutoMessage()` (`:850`); (3) **Sound toggle** (`:1124-1155`) — persiste `guto-voice-enabled-${userId}` em localStorage; (4) **Bolha de proatividade** confirm/discard/validate → PATCH `/guto/proactive/{id}` (`:787-795`). |
| **Inputs** | (1) `text` mensagem (`:1220-1231`) — Enter submete. |
| **Backend** | POST `/guto` com `{profile, input, language, history (últimas 6), expectedResponse}`; GET `/guto/proactive` a cada 60s (`:588`); GET `/guto/extract-proactivity` 1×/semana (`:914`). |
| **Idioma** | Bom no chat-tab, MAS: (a) follow-up de dieta injeta `"Pergunta do usuário"` em PT no prompt (`:1090-1094`). (b) Fallback `profile.name = "Usuário"` mesmo em EN/IT (`:850-852`). (c) `copy.connectionError` em PT vaza se locale falhar. |
| **Visual** | Avatar mostra arte recortada (cinza ao redor). **P1/P2**. |
| **Segurança** | Histórico em localStorage limitado a 24 itens (`:364-414`); se localStorage falha, try-catch silencioso (`:394`). |
| **Playwright** | Testes 10 e 11 cobrem aba GUTO e envio mockado de mensagem. **Sem teste de proatividade, mic, idioma.** |
| **Bugs detectados** | (a) Dúvida de exercício envia pouco contexto (`:951-970`) — chat responde sem saber qual treino. (b) Dúvida de dieta não inclui intolerâncias (`:989-1001`). (c) `xp+100` hardcoded em recompensa (`:1283`). |
| **Veredito** | **Não pronto.** P0: corrigir prompt PT-only de follow-up de dieta antes do beta. P1: enviar contexto completo de treino/dieta na dúvida; limpar avatar. |

---

### 9. Treino / Missão (`activeTab="missao"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Aba 2/6. Componente: `mission-tab.tsx` (470 linhas). |
| **Santo Graal exige** | Treino do dia adaptado a calibragem, histórico, dor e local. Carga, séries, reps, descanso, vídeo, dúvida, validação. |
| **Tela real** | [08-missao.png](audit-screenshots/2026-05-16/08-missao.png) — "Peito, ombro e tríceps", warmup, cards com séries/reps/descanso. |
| **Botões** | (1) **Start/Reset** (`:382-399`) toggle `started`; (2) **GUTO PERSONAL ONLINE** (`:402-414`) abre overlay; (3) **Checkbox por exercício** (`:258-268`) → `toggleExercise()`; (4) **`?` dúvida** por exercício (`:279-286`) → `onAskExercise(exercise)` pula para chat; (5) **VALIDATE WORKOUT** (`:442-453`) — desabilitado se `invalidWorkoutVideo` ou `!canComplete` → `onValidateWorkout()` abre fluxo de câmera. |
| **Inputs** | Nenhum direto. |
| **Backend** | Plano vem via props (carregado em `guto-app.tsx`); aba não chama API diretamente. |
| **Idioma** | (a) Label `"Obs"` em `:312` **não traduzido** para EN/IT. **P1**. (b) Possível typo "Riscaldamento" em IT (`:33`). |
| **Visual** | Bom. |
| **Bugs detectados** | (a) Validação de vídeo só checa prefixo/metadata, não existência real (`:144-151`); (b) Carga não tem campo operacional (auditoria anterior); (c) Fallback `createLocalWorkoutPlan` (`lib/workout-plan.ts`) usa catálogo pequeno; (d) Histórico "ontem/anteontem" falha em backend tests. **P0**. |
| **Playwright** | `12 — aba MISSÃO mostra exercícios do treino` apenas verifica presença. Sem teste de checkbox, dúvida, validate. |
| **Veredito** | **Não pronto.** P0 (histórico contextual falhando) + P1 (label, validação real de vídeo, carga). |

---

### 10. GUTO Personal Online (overlay)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Overlay aberto via Mission tab. Componente: `guto-online-session.tsx` + `lib/guto-online/*`. |
| **Santo Graal exige** | Presença ativa série por série. Warmup, descanso, pausa, dor, troca, finalizar, validação real. Retomada 0–15min / 15min–12h / >12h. Sem depender de IA para microestado. |
| **Tela real** | [09-guto-online.png](audit-screenshots/2026-05-16/09-guto-online.png) — full-screen, timer, áudio, checklist, botões grandes. |
| **Botões** | (1) **Play/Pause** descanso/série; (2) **Voice toggle** (`guto-online-voice-toggle.tsx`); (3) **Quick Talk** comandos por regex (`lib/guto-online/guto-online-context-guard.ts:43-80`) — `dor/troca/fadiga`; (4) **Close X** sai e fecha overlay; (5) **Finalizar/Validar** (`guto-online-session.tsx:629-633`) → só chama `onFinish` e fecha (não abre validação real). **P1**. |
| **Inputs** | Microfone (quick talk). |
| **Backend** | POST `/guto/online/exception` (auditoria anterior aponta que usa `(req as any).user?.language` mas middleware usa `req.gutoUser` — cai para PT) — `guto-backend/server.ts:5258`. **P1**. |
| **Idioma** | Comprometido por bug acima do backend. |
| **Visual** | Forte. |
| **Bugs detectados** | (a) Plano remove exercícios de aquecimento e mostra item genérico `AQUECIMENTO` (`:211-215`); (b) Dor/troca/fadiga mudam só resposta, não adaptam exercício/carga; (c) Classificação por regex hardcoded **contra a regra do projeto** (Santo Graal exige LLM com contexto); (d) Sessão local persistida por `workoutKey` sem `userId` (`lib/guto-online/guto-online-storage.ts:29-55`) — colisão entre usuários no mesmo browser. **P0**. |
| **Playwright** | Testes 13 e 18 cobrem abrir e fechar overlay. Não cobrem dor, troca, validação real. |
| **Veredito** | **Não pronto.** P0: incluir userId no storage; ligar botão "Validar" no fluxo real de câmera. P1: trocar regex por intenção via LLM ou ao menos prefixar regra. |

---

### 11. Dieta da Semana (`activeTab="dieta"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Aba 3/6. Componente: `diet-tab.tsx` (749 linhas) + `lib/diet-plan.ts`. |
| **Santo Graal exige** | Plano semanal por contexto, país, idioma, restrições/intolerâncias, macros, substituições, integração com chat. |
| **Tela real** | [10-dieta.png](audit-screenshots/2026-05-16/10-dieta.png) — "Dieta ainda não gerada. Não foi possível gerar a dieta." |
| **Botões** | (1) **`?` por alimento** (`:279-290`) → `onFoodDoubt(food, meal)`; (2) **Expand/collapse refeição** (`:220-250`); (3) **Regenerar dieta** (`:709-718`) → `handleRetry()` com `window.confirm` se locked. |
| **Inputs** | Nenhum. |
| **Backend** | GET `/guto/diet` (`:496`); POST `/guto/diet/generate` (`:503`). **Timeout hardcoded 50s** (`:484-490`). |
| **Idioma** | OK no diet-tab; PT vaza apenas via follow-up do chat. |
| **Bugs detectados** | **(a) `[GUTO_DIET_ERROR]` interno em produção** — `lib/diet-plan.ts:313` loga `valid:false, macroDelta:130, foodsKcal:480 vs mealKcal:620, mealsDelta:2280 vs targetKcal:2900` durante o teste 14. Macros declarados não batem com soma de alimentos. **P0.** (b) Fallback `createLocalDietPlan` (`lib/diet-plan.ts:43-80`) usa iogurte, ovos, frango e parmesão mesmo se usuário tem lactose/veganismo. **P0.** (c) Backend defaulta país para Brasil (`server.ts:5035`). (d) Validação só confere calorias/macros, **não alergênicos/restrições** (`:83-124`). **P0.** (e) Coach diet precedência silenciosa — usuário não sabe se está vendo dieta do coach ou do GUTO. |
| **Visual** | Estado vazio fraco (mensagem simples para um "sistema de autoridade"). |
| **Playwright** | `14 — aba DIETA abre sem tela morta e sem timeout exposto` passa, mas o teste só checa ausência de timeout — o `[GUTO_DIET_ERROR]` é silenciado porque é `console.error`, não throw. |
| **Veredito** | **QUEBRADA.** P0 múltiplo. Maior risco do app inteiro: dieta errada com intolerância é risco sanitário/legal. |

---

### 12. Percurso (`activeTab="caminho"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Aba 6/6. Componente: `path-tab.tsx` (334 linhas). |
| **Santo Graal exige** | Registros reais, XP, streak, validações fotográficas, memória afetiva. |
| **Tela real** | [11-percurso.png](audit-screenshots/2026-05-16/11-percurso.png) — mês atual, dias, XP, avatar, card do treino. |
| **Botões** | (1) **Clique no poster de validação** (`:284-303`) abre modal fullscreen; (2) **X fechar modal** (`:322-329`). |
| **Inputs** | Nenhum. |
| **Backend** | `validationHistory` via props; URLs montadas com `${API_URL}` direto. **As imagens são públicas** (auditoria anterior: `guto-backend/server.ts:491-494` + `storage.ts:13-17`). **P0**. |
| **Idioma** | `locale.pathQuote` esperado mas **nunca definido em translations** (`:272`) → renderiza `undefined`. **P1**. |
| **Visual** | Bom. |
| **Bugs detectados** | (a) Imagens públicas sem signed URL (P0 transversal); (b) `pathQuote` undefined; (c) Captura mostrou `0 XP hoje` apesar de ter 100 XP inicial — separar XP inicial de XP do dia (auditoria anterior). |
| **Playwright** | Sem teste de percurso. |
| **Veredito** | **Quase OK** no visual. P0 herdado de segurança transversal de imagens. P1: corrigir pathQuote. |

---

### 13. Evoluir / XP (`activeTab="evolucoes"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Aba 5/6. Componente: `evolutions-tab.tsx` (165 linhas). |
| **Santo Graal exige** | Avatar Baby → Teen → Adult → Elite com base em consistência. |
| **Tela real** | [12-evoluir.png](audit-screenshots/2026-05-16/12-evoluir.png). |
| **Botões** | Nenhum (read-only). |
| **Inputs** | Nenhum. |
| **Backend** | `currentXp = memory.totalXp` via props. `getNextGutoEvolutionXp(currentXp)` em `lib/guto-evolution.ts`. |
| **Idioma** | OK. |
| **Bugs detectados** | (a) `evolutionCardsFixture` (`view-models.ts:8`) é fixture hardcoded — se thresholds mudam, frontend diverge. **P1**. |
| **Playwright** | Sem teste. |
| **Veredito** | **OK** visualmente. P1: ligar fixture a contrato real. |

---

### 14. Arena / Ranking (`activeTab="arena"`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Aba 4/6. Componente: `arena-tab.tsx` (351 linhas). |
| **Santo Graal exige** | Semanal, mensal, individual global. Dupla como unidade. XP por consistência. |
| **Tela real** | [13-arena.png](audit-screenshots/2026-05-16/13-arena.png) — abas Semana/Mês/Individual, card "100 XP, precisa reagir". |
| **Botões** | (1) Sub-tab **SEMANA / MÊS / INDIVIDUAL** (`:284-298`). |
| **Inputs** | Nenhum. |
| **Backend** | GET `/guto/arena/weekly|monthly|individual` (`:232-234`). |
| **Idioma** | (a) Compara `item.status === "EM CHAMAS" || "ON FIRE"` (`:75`) — backend devolve strings multilíngues misturadas, deveria ser enum único. **P1**. |
| **Bugs detectados** | (a) Mock de Playwright retorna `{entries:[]}`, contrato real espera `items` (`e2e/guto.spec.ts:180-183`) — teste verde, contrato divergente. **P1**. (b) Regex fuzzy de fallback de nome `/^operador\s*#?\d*$/i` (`:80`) pode dar falso positivo. |
| **Playwright** | Mock divergente. |
| **Veredito** | **Não pronto.** P1: unificar contrato `items`. |

---

### 15. Settings / Conta / Privacidade

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | Overlay invocado em `guto-app.tsx` (linhas ~1566-1650 + ~3166 + ~3241-3320). |
| **Santo Graal exige** | Editar dados, idioma, restrições; exportar/revogar/excluir (GDPR). |
| **Tela real** | [14-settings.png](audit-screenshots/2026-05-16/14-settings.png) — grade de cartões (idioma, nome, perfil, objetivo, local, limitação, peso/altura, país, restrições, intolerâncias, privacidade). |
| **Botões** | (1) **Baixar meus dados** (`:1566-1608`) → blob JSON local, sem chamada ao servidor; (2) **Revogar consentimentos** (`:1616-1631`) → POST `/guto/consent/revoke` com fallback local mesmo se 401/500; (3) **Excluir definitivamente** (`:1636-1645`) → DELETE `/guto/account` com body `{confirmation:"EXCLUIR"}` **fixo em PT** (`lib/api/auth.ts:67-72`); (4) **Editar campos** (vários sub-modals); (5) **Idioma** (sub-modal). |
| **Inputs** | Vários (idade, nome, objetivo, etc). (a) Input "Digite EXCLUIR para confirmar" — palavra exigida em PT mesmo em EN/IT. **P1**. |
| **Backend** | Listed acima. |
| **Idioma** | (a) Hardcoded "Consentimento" em `:3166`; (b) confirmação "EXCLUIR" PT-only. |
| **Visual** | Labels truncados em mobile (`LIMITAC...`, `INTOLER...`). **P2**. |
| **Segurança** | (a) `sendDefaultPii: false` em Sentry — bom. (b) Exportação é local (não traz histórico completo do backend) — pode dar falsa impressão de completude. **P1**. (c) Sentry `tracesSampleRate: 1` em prod custa caro e arrisca PII em stack traces sem `beforeSend` (`instrumentation-client.ts:7-29`). **P1**. |
| **Playwright** | Zero cobertura de settings/privacidade. **P0 para GDPR**. |
| **Veredito** | **Não pronto.** P0: cobertura de fluxo GDPR. P1: traduzir confirmação, exportar do servidor, reduzir sampling. |

---

### 16. Admin / Coach / Super Admin (`/coach`)

| Campo | Conteúdo |
|---|---|
| **Rota / estado** | `/coach` → `CockpitLayout`. Login admin em `/admin/login`. Hierarquia em `use-admin-permissions.ts:6-8`. Sub-screens: `aprovacoes / arena / banco / coaches / dietas / empresas / hoje / logs / students / treinos` em `app/coach/_components/screens/`. |
| **Santo Graal exige** | Planos, times, coaches, alunos, convites, edição de treino/dieta, limites por plano, isolamento. |
| **Tela real** | [15-admin-coach-desktop.png](audit-screenshots/2026-05-16/15-admin-coach-desktop.png) — dashboard industrial, lista de alunos, filtros, escopo, time, status online. |
| **Botões principais** | **Treinos:** `Editar treino ›` (`treinos-screen.tsx`) abre student drawer. **Aprovações:** Aprovar/Rejeitar → POST `/admin/exercises/{id}/approve`|`reject` (`aprovacoes-screen.tsx`); rejeição usa `window.prompt("Motivo?")` **sem sanitização** (`:146`). **P1**. **Alunos:** copy invite, regenerar invite (sem confirmação). **Dietas/Banco/Coaches/Empresas:** drawers com CRUD; permissões via hook. |
| **Inputs** | Filtros (search, status, empresa, coach, risco). |
| **Backend** | `/admin/students/*`, `/admin/exercises/*`, etc. Auditoria anterior: **backend tests admin/coach falham com 401**. **P0**. |
| **Idioma** | Painel industrial é PT-only (não há translations para admin). Aceitável para B2B BR, mas se vendido fora do Brasil é P2. |
| **Visual** | Coerente. |
| **Segurança** | (a) `window.prompt` aceita qualquer string como motivo de rejeição (`aprovacoes-screen.tsx:146`); (b) Vídeo de exercício backend permite 30s, spec exige 15s (`:112-114`); (c) Demo bypass `?demo` em preview (`lib/api/client.ts:15-25`) — se `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true` vazar para prod, `/coach?demo` ignora login. **P1**. |
| **Playwright** | **Zero cobertura para painel admin/coach.** **P0 para B2B**. |
| **Veredito** | **Não pronto para B2B.** P0: testes backend e Playwright. P1: substituir prompt() por modal, sincronizar limite de vídeo, isolar demo. |

---

### 17. Fluxos de Erro / Loading / Fallback / Estados Vazios

| Aspecto | Estado atual |
|---|---|
| Loading global | `<Loader2>` em diversos pontos (page.tsx, login, aba dieta, etc). Consistente. |
| Erro de API | Mapeamento em `client.ts:44-65` com strings em PT e EN misturadas. Erros 401 disparam logout automático. |
| Estado vazio | Dieta mostra mensagem genérica seca. Arena tem `EmptyState` (`:320-326`). Mission tem estado "Sem treino definido" com motivo. |
| Skeletons | Arena tem skeleton (3 boxes). Outras abas não têm. |
| Fallback de voz | Cai para SpeechSynthesis browser (auditoria anterior diz que voz errada é pior que silêncio). **P1**. |
| Fallback de câmera | Skip-camera envia imagem vazia que backend rejeita por exigir `imageBase64`. **P0** (auditoria anterior #7). |
| **Veredito** | **Não pronto.** Estados de erro/vazio são funcionais mas frágeis, fora do tom GUTO. |

---

### 18. Memória / Idioma / Proatividade (transversal)

| Aspecto | Estado atual |
|---|---|
| Storage | localStorage + memória backend; sem Supabase real (apesar de Privacy citar Supabase). |
| Persistência | `persistMemory` atualiza estado local antes de confirmar backend (`guto-app.tsx:703-717`) → falsa sensação de salvo se backend falhar. **P0**. |
| Idioma | i18n fragmentado: `translations.ts` + `stageCopy` + `inviteClaimCopy` + `login/T` separados. PT vaza em: intro, settings `Consentimento`, `"EXCLUIR"`, `getMissingCalibrationFields`, `noInjuryFallback`, follow-up de dieta, e backend `online/exception`. **P1 múltiplo**. |
| Proatividade | Depende de chat aberto (intervalo 60s). Sem push real do servidor para frontend. **P1**. |
| Expiração | Sem mecanismo amplo de expiração de memória antiga. |
| `local-user` | Aparentemente removido (uso de `requireActiveUser`); mas `userId` ausente do storage do GUTO Online (`lib/guto-online/guto-online-storage.ts:29-55`). **P0**. |
| **Veredito** | **Não pronto.** P0 múltiplo. |

---

### 19. Segurança / GDPR / PII / Sentry

| Aspecto | Estado atual |
|---|---|
| Token | localStorage (XSS-exposed); sem refresh; auto-logout em 401. |
| CORS / Proxy | `/api/guto/[...path]` em preview; backend explícito em prod. |
| Imagens de validação | Públicas via Express static (`server.ts:491-494`; `storage.ts:13-17`). **Selfies de usuário acessíveis sem auth.** **P0 crítico**. |
| Consentimento server-side | Revogação tem fallback local mesmo se servidor recusar — divergência possível. **P1**. |
| Delete account | Palavra-chave exigida só em PT. **P1**. |
| Sentry | `tracesSampleRate: 1`, `replaysOnErrorSampleRate: 1`, `enableLogs: true`, `sendDefaultPii: false`. Sem `beforeSend` filter — stack traces podem vazar contexto sensível. **P1**. |
| Source maps | `widenClientFileUpload: true` envia ao Sentry — operacional, mas expõe código. |
| Demo bypass | `?demo` em preview se `NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true`. Risco se env vazar. **P1**. |
| GDPR copy | `/privacy` cita Supabase — não usado no código. Erro de transparência. **P1**. |
| **Veredito** | **Não pronto.** P0: signed URLs para imagens; P1: limpar Sentry, sincronizar consent, traduzir confirmação. |

---

### 20. Responsividade Mobile

| Aspecto | Estado atual |
|---|---|
| Viewport teste | Playwright roda em 390×844 (iPhone 14 Pro). |
| Overflow horizontal | Testes 15 e 16 passam (sem overflow). |
| Settings truncados | Cards truncam `LIMITAC...`, `INTOLER...`. **P2**. |
| Touch targets | Botões grandes e claros. |
| Safe-area iOS | Sem evidência explícita. **P2**. |
| WebKit/Safari real | **Não testado** — playwright.config só Chromium. **P1**. |
| Android Chrome real | **Não testado**. **P1**. |
| **Veredito** | **Quase OK.** P1: adicionar projects WebKit/Mobile Safari no playwright. |

---

## 5. Listas Consolidadas

### Top 10 P0 (bloqueiam teste real)

1. **Dieta gera plano com macros internamente inválidos** — `[GUTO_DIET_ERROR]` em `lib/diet-plan.ts:313` durante runtime do Playwright. Soma de alimentos da refeição diverge dos macros declarados (480 vs 620 kcal). Bloqueia confiança no produto.
2. **Dieta não respeita intolerâncias/restrições/país** — `createLocalDietPlan` em `lib/diet-plan.ts:43-80` usa iogurte/ovos/frango/parmesão mesmo com lactose/veganismo. Backend defaulta país para Brasil. Risco sanitário e jurídico.
3. **Imagens de validação públicas** — `guto-backend/server.ts:491-494` serve selfies via Express static sem auth nem signed URL.
4. **GUTO Online storage sem userId** — `lib/guto-online/guto-online-storage.ts:29-55` colide entre usuários do mesmo navegador.
5. **Backend tests falhando** (auth/admin/coach/account/weekly diet/workout) — sem confiança em login, painel ou dieta semanal.
6. **Histórico "ontem/anteontem" falha** — IA repete grupo muscular contra o Santo Graal.
7. **Skip-camera envia imagem vazia** que backend rejeita por exigir `imageBase64` — usuário fica preso.
8. **Validação "Validar" do GUTO Online só fecha overlay** (`guto-online-session.tsx:629-633`) sem disparar fluxo real de câmera.
9. **Persistência depende de Redis opcional** sem guard de produção (`guto-backend/config.ts:21-23`).
10. **Cobertura Playwright zero para fluxos B2B** (admin, coach, convite, settings/GDPR).

### Top 10 P1 (graves)

1. **Avatar recortado** na Home e Percurso (fundo cinza ao redor da arte).
2. **PT vazando em EN/IT** em vários pontos: `Consentimento` hardcoded em `guto-app.tsx:3166`, `"EXCLUIR"` em `lib/api/auth.ts:67-72`, `"Usuário"` fallback em `chat-tab.tsx:850-852`, `getMissingCalibrationFields`, `noInjuryFallback`, `"Obs"` em `mission-tab.tsx:312`, follow-up de dieta `chat-tab.tsx:1090-1094`.
3. **`pathQuote` undefined** em `path-tab.tsx:272` — chave não existe em translations.
4. **i18n fragmentado**: `translations.ts` + `stageCopy` + `inviteClaimCopy` + `login/T` separados; nenhum source of truth.
5. **Convite frágil em Safari private mode** (`app/convite/[token]/page.tsx:19-21`) — try-catch silencioso perde token.
6. **Mock divergente no Playwright** — `{entries:[]}` versus `items` real do backend (Arena).
7. **Sentry sem `beforeSend`** + `tracesSampleRate: 1` em prod — custo e risco de PII.
8. **`window.prompt` para motivo de rejeição** em `aprovacoes-screen.tsx:146` sem sanitização.
9. **Demo bypass `?demo`** depende só de env var — se vazar em prod, painel coach fica aberto.
10. **Privacy cita Supabase** que não existe no código — erro de transparência.

### Top 10 P2 (UX/visual)

1. Labels truncadas em Settings.
2. Estado vazio da Dieta sem tom GUTO.
3. Carga não aparece como campo operacional no treino.
4. Validação de vídeo só checa prefixo, não existência real.
5. Falta typo IT em "Riscaldamento" (`mission-tab.tsx:33`).
6. Fixture hardcoded em `evolutionCardsFixture`.
7. Sem skeletons na maioria das abas.
8. Sem evidência de safe-area iOS.
9. Reset de ranking por timezone explícito.
10. Microcopy do chat às vezes longo (saudação de boas-vindas com 2+ frases).

### Páginas prontas para "OK"

- **13 Evoluir / XP** — visual e dados consistentes. P1 menor (fixture).
- **7 Pacto** — pronto, falta só cobertura Playwright.

### Páginas que precisam correção antes de OK

Todas as demais (1–6, 8–12, 14–20).

### Testes Playwright faltantes (prioridade)

| Teste | Descrição | Prioridade |
|---|---|---|
| `convite/[token]` happy path | Token → senha → claim → home | P0 |
| Login fluxo completo | Submit → 200 → home; erro 401 → mensagem | P0 |
| Settings → Excluir conta | Step 1 → step 2 → confirmação → /login | P0 |
| Settings → Revogar consentimento | Click → confirma → volta para consent | P0 |
| Admin/Coach: aprovar/rejeitar exercício | Lista → aprovar → reflete na UI | P0 |
| Admin/Coach: copiar convite + regenerar | Botão → clipboard contém token | P1 |
| Chat: enviar dúvida de exercício com contexto | Mission → ? → chat com prompt completo | P1 |
| Dieta: respeitar intolerância (lactose) | Calibrar com lactose → gerar → sem laticínios | P0 |
| GUTO Online: pausa/dor/troca | Quick talk → adaptação real | P1 |
| Arena: contrato `items` | Mock real → contagem correta | P1 |
| Mobile WebKit | Suite inteira em Safari | P1 |
| Validação treino com câmera | Skip-camera não fica preso | P0 |

### Riscos antes de testar com usuários reais

1. **Risco sanitário/jurídico de dieta** (intolerâncias/restrições não respeitadas).
2. **Risco de privacidade** (imagens de validação acessíveis publicamente).
3. **Risco de identidade** (PT vazando em EN/IT quebra promessa de GUTO multi-idioma).
4. **Risco de presença prometida** (GUTO Online aparenta ativo mas só responde com regex, sem adaptar carga).
5. **Risco de retenção** (memória/proatividade ainda dependem do app estar aberto — não há push real).
6. **Risco operacional** (backend tests falhando e Playwright mock-heavy escondem regressões).

### Próxima página recomendada para corrigir primeiro

**Dieta da semana.** Concentra mais P0 do que qualquer outra, é onde o erro tem maior consequência (saúde do usuário) e onde a divergência entre o que o app promete e o que entrega é maior. Corrigir nesta ordem:

1. Fazer `getMissingCalibrationFields` exigir país, intolerâncias e restrições (`lib/guto-profile.ts:76-85`).
2. Reescrever `createLocalDietPlan` / `sanitizeDietPlan` para honrar restrições antes de validar macros (`lib/diet-plan.ts:43-124`).
3. Backend `/guto/diet/generate` deve recusar gerar sem país/intolerâncias e nunca defaultar para Brasil (`guto-backend/server.ts:4994-5038`).
4. Adicionar Playwright test que calibra com lactose → gera → afirma ausência de laticínios.
5. Tornar `[GUTO_DIET_ERROR]` um throw em dev e um Sentry capture em prod, não só `console.error`.

Depois da dieta, o segundo alvo é **Segurança de imagens de validação** (signed URL no CEREBROGUTO), e o terceiro é **GUTO Online** (userId no storage + ligar botão Validar à câmera real).

---

## 6. Anexos

### A. Comandos executados

```
npm run build                     # ✓ 3.2s, 13 rotas
npx playwright test --reporter=line  # ✓ 20/20 em 18.6s (mock-heavy)
```

### B. Notificação detectada durante o Playwright

Durante o teste 14 (aba dieta), o WebServer logou:

```
[GUTO_DIET_ERROR] {
  macroDelta: 130, macroKcal: 2770,
  mealValidation: [{ delta:140, foodsKcal:480, mealId:'meal-001', mealKcal:620, valid:false }],
  mealsDelta: 2280, mealsKcal: 620, targetKcal: 2900, valid: false
}
at logValidation (lib/diet-plan.ts:313:34)
```

O teste passou porque verifica apenas ausência de timeout — não a validade dos macros.

### C. Estrutura confirmada de rotas (next build)

```
○ /                       (Static)
○ /_not-found             (Static)
○ /acesso-pausado         (Static)
○ /admin/login            (Static)
ƒ /api/guto/[...path]     (Dynamic)
○ /billing/cancel         (Static)
○ /billing/pricing        (Static)
○ /billing/success        (Static)
○ /coach                  (Static)
ƒ /convite/[token]        (Dynamic)
○ /dev/voice              (Static)
○ /login                  (Static)
ƒ /privacy                (Dynamic)
ƒ /terms                  (Dynamic)
```

Não existe rota `/admin` — todo o painel admin entra via `/coach`.

### D. Submódulos no worktree

Submódulos `guto-app-v0` e `guto-backend` aparecem como hash não-inicializado neste worktree (`funny-swartz-015494`). A auditoria foi realizada lendo diretamente o main repo em `/Users/williandossantos/GUTOO/guto-app-v0/`. Nenhuma alteração foi feita.

---

*Relatório encerrado. Nada foi commitado. Nada foi deployado. Nada foi corrigido.*
