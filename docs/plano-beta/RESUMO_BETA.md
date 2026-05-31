# GUTO — Estado Geral pro Beta (documento mestre)

> **Atualizado 2026-05-31.** Fonte única do que foi **testado, corrigido, está certo e ainda falta**. Tudo aqui foi checado **rodando o app/cérebro de verdade** (API real + Redis de produção) ou pela **suíte de testes** — não só por testes que mockam o modelo. Detalhe por área em `00_INDICE.md` + docs `01..11`.
>
> **Status do build:** backend suíte **470/470 · tsc 0** · frontend `tsc`/`build` ok.
> **Deploy:** backend → Render (`cerebroguto.onrender.com`) · app → Vercel (`corpoguto.vercel.app`).

---

## ✅ Corrigido e shipado (verificado ao vivo + travado por teste)

| # | Fix | Repo | Verificação |
|---|---|---|---|
| 1 | **Chat sequestrava pergunta central** ("qual o treino?/dieta/calorias" → "distração") | CEREBROGUTO #42 | engaja no domínio (conversa real) |
| 2 | **Usuário saudável travava na calibragem** ("Sem dor") | CORPOGUTO #43 | gera treino no 1º turno |
| 3 | **"fiz o treino" reperguntava idade** | CEREBROGUTO #45 | reconhece + manda validar |
| 4 | **Febre/doença → mandava treinar** | CEREBROGUTO #44 | "descanso/hidratação/médico" |
| 5 | **Álcool/intoxicação → mandava treinar** (segurança tem precedência sobre a escada) | CEREBROGUTO #47 | 8/8 nas sondas → critical |
| 6 | **Selfies públicas por URL** | CEREBROGUTO #46 | URL assinada (HMAC); 403 sem assinatura |
| 7 | **Proatividade: viagem virava "cobrança"** (kind `proactive_context`) | CEREBROGUTO #48 | "viajo na quarta" → acolhe → confirma → `trip:confirmed` |
| 8 | **Consent travava o onboarding** (17-28s → timeout) | CEREBROGUTO #49 | 28s → **0.03s** |
| 9 | **XP do pacto inflava o semanal da Arena/admin** | CEREBROGUTO #50 | total=100 / weekly=0 (app = admin) |
| 10 | **Login quebrava com o teclado** | CORPOGUTO #53 | rola, ENTRAR alcançável |
| 11 | **Foco/nome do treino do coach não chegava ao app** | CEREBROGUTO `main` (b9d1d8a) | coach grava foco → aluno lê o mesmo |
| 12 | **Convite: GET 404 mesmo com convite válido** | CEREBROGUTO `main` (193c56a) | GET acha o pending; regenerate revoga todos antigos |
| 13 | **Race no `createTeam`: 2ª empresa criada em rajada sumia do Redis** | CEREBROGUTO `main` | write ao Redis serializado; 2 times concorrentes persistem |

**Detalhe dos fixes 11 e 12 (desta sessão):**
- **#11 — foco do treino do coach:** `localizeWorkoutPlan` (server.ts) sobrescrevia `focus`/`summary` a partir do `focusKey` na rota do aluno (`GET /guto/memory`) → o nome que o coach digitava era descartado e o aluno via o rótulo padrão. **Fix:** quando o plano é autorado pelo coach (`manualOverride` / `planSource` de override), o `focus` salvo pelo coach é preservado e chega ao app **como treino normal do GUTO** (conteúdo do coach). Treino gerado pelo GUTO continua localizando pelo `focusKey` (i18n por idioma intacto).
- **#12 — convite:** `findInviteByUserId` pegava o **primeiro** registro do usuário (podia ser um `revoked` antigo) → GET dava 404 mesmo com convite válido; e `revokeInviteByUserId` só revogava o primeiro → acumulavam vários `pending_claim`. **Fix:** seleciona o convite **vigente** (mais recente não-revogado) e o regenerate **revoga todos** os antigos. Teste `tests/guto-invite-store.test.ts`.

---

## ✅ Verificado FUNCIONANDO no app real (visual / API real)

- **Onboarding:** intro → idioma → login → consentimento → nome → pacto → home (fluxo completo).
- **Chat:** engaja treino/dieta/calorias/pizza; conclusão; **segurança de febre/álcool sólida**.
- **MISSÃO:** treino real (gerado), vídeos, botão "?", "VALIDAR TREINO".
- **DIETA:** dieta coerente (2075 kcal déficit, macros, refeições localizadas em PT).
- **GUTO Online:** sessão guiada **funciona** (aquecimento → exercício → série, checklist, controles).
- **Arena / Evoluir / Percurso / Painel admin:** XP consistente pós-fix (total bate; semanal sem buffer do pacto).

### Integração painel `/coach` ↔ app (testada na API real + Redis prod, 31/05)
- **aluno → painel:** XP (100) e status do aluno aparecem no painel = valor do app. ✅
- **coach → aluno (treino):** exercícios (séries/reps/carga) editados no painel chegam na memória do aluno. ✅
- **coach → aluno (dieta):** refeições/alimentos editados chegam ao app; validação de calorias barra mismatch (400). ✅
- **coach → aluno (foco/nome):** ✅ **corrigido (#11)** — o nome que o coach salva chega ao aluno.
- **convite:** ✅ **corrigido (#12)** — gerar/reler convite funciona; regenerate invalida os antigos.

---

## ✅ Verificado pela suíte de testes (lógica sem dev-bypass)

> Importante: **isolamento/permissão NÃO dá pra testar no backend local** porque o `GUTO_ALLOW_DEV_ACCESS=true` dá acesso sintético a tudo (anula o escopo). O caminho correto é a suíte, que roda sem o bypass.

- **Isolamento de time:** admin/coach presos ao próprio time; coach não vê aluno de outro coach nem de outro time; super_admin vê tudo; listagens com escopo; sem vazamento entre times. ✅
- **Bloqueio de acesso:** pausado/arquivado → 403 `ACCESS_PAUSED`; expirado/cancelado → 403 `SUBSCRIPTION_EXPIRED` (inclusive no login). ✅
- **Limites de plano:** Start/Pro/Elite/Custom; bloqueia ao lotar; arquivado não conta. ✅
- **Plano semanal (treino + dieta):** salva com escopo por time; `/workout/today` e `/diet/today` resolvem do plano semanal com fallback; validações → 400. ✅
- **Lock/unlock:** rota + handler corretos (alternam `lockedByCoach`, salvam, logam); coberto pela suíte. ✅
- **Legacy quarentenado:** rotas `/guto/coach` antigas bloqueadas; `nuke-all` negado até pra super_admin. ✅

---

## 🟡 Achados operacionais (não-bug, mas importantes pro teste no prod)

- **Prod está quase vazio:** **1 aluno real** (`student-video-gate`, sem treino) e **0 coaches** no Redis de produção. Pra "tentar quebrar" isolamento/lock ao vivo é preciso criar **coaches/alunos reais**.
- **`w@gmail.com` / senha `www` é login só de DEV** (funciona via `GUTO_ALLOW_DEV_ACCESS` local; **não loga no prod**). O "willian/G-WILLIAN" usado no QA é um **fantasma do dev-bypass** (memória sem registro de acesso real; some no restart) — não existe como aluno no prod.
- **Não consigo auto-verificar o backend de prod** (não tenho o `JWT_SECRET` nem senha real de prod). Os fixes foram verificados no **backend local rodando o Redis de produção** com **código idêntico** ao que subiu. A confirmação final no Render é via app (com conta real) ou me dando como verificar.

---

## 🧪 Fixtures de teste criadas no prod (31/05) — verificadas AO VIVO no Render

> Contas de teste **descartáveis** (senha compartilhada `guto12345`). Criadas via backend local escrevendo no **Redis de produção**; **login confirmado no backend de prod** (`cerebroguto.onrender.com`). **Apagar/rotacionar antes do lançamento real.**

| Tipo | Nome | Login (email) | Senha | Time | userId |
|---|---|---|---|---|---|
| Empresa | Equipe QA Alpha | — | — | `team-4d59cca2c6ca` | — |
| Empresa | Equipe QA Beta | — | — | `team-b62cd7a433fc` | — |
| Coach | Coach Alpha | `coach.alpha@guto.test` | `guto12345` | Alpha | `coach-190974648b8b` |
| Coach | Coach Beta | `coach.beta@guto.test` | `guto12345` | Beta | `coach-86808a0591af` |
| Aluno | Aluno A1 | `aluno.a1@guto.test` | `guto12345` | Alpha | `G-ALUNO-A1` |
| Aluno | Aluno A2 | `aluno.a2@guto.test` | `guto12345` | Alpha | `G-ALUNO-A2` |
| Aluno | Aluno B1 | `aluno.b1@guto.test` | `guto12345` | Beta | `G-ALUNO-B1` |
| Aluno (convite) | Aluno A3 | — (sem senha) | — | Alpha | `G-ALUNO-A3-CONVITE` |

- **Convite do A3 (claim no app):** `https://corpoguto.vercel.app/convite/5548c5c66874d02a4388de6e2385c82c7710121ea2979670d44d274338b538f1`
- **✅ Isolamento confirmado AO VIVO no PROD:** Coach Alpha (login 200) vê só A1/A2/A3; Coach Beta (login 200) vê só B1 — sem vazamento entre times. Aluno A1 login 200. (Primeira verificação direta contra o backend de prod nesta sessão.)

## 🔲 Falta pro beta (priorizado)

### P0 — antes de usuário real amplo
- [ ] **Confirmar os fixes #11 e #12 vivos no Render** (testar no app com conta real após o deploy).
- [ ] **Criar coaches/alunos reais no prod** (hoje 1 aluno, 0 coaches) — pré-requisito pra testar isolamento/lock/convite ao vivo e pro próprio beta.
- [ ] **Storage persistente das selfies** (hoje `tmp/` efêmero → somem no redeploy do Render). Decidir infra (S3/Cloudinary). [08]
- [ ] **Validação/selfie ponta a ponta em device real** (câmera não roda no preview): treino → selfie → +100 XP → reflete em Arena/Percurso. [08]
- [ ] **Recuperação de senha** (não existe; hoje só via coach). [01]

### P1 — qualidade/operação
- [x] **✅ CORRIGIDO 31/05 — Race no `createTeam` (team-store).** Era: create/update/deleteTeam disparavam write async **fire-and-forget com snapshot** → dois writes concorrentes chegavam fora de ordem no Upstash e o snapshot antigo sobrescrevia o novo (perdia um time). **Fix:** persistência ao Redis **serializada** (fila de promises) que sempre grava o `memCache` atual. Verificado ao vivo: 2 times criados **concorrentemente** → ambos persistiram no Redis de prod. Suíte 470/470, tsc 0. (CEREBROGUTO `main`)
- [ ] **Curador de treino sob carga** — caía em template >50% em rajada; medir/estabilizar (retry/backoff). [04]
- [ ] **Tirar o mock do painel** (`NEXT_PUBLIC_USE_MOCKS=false`) + threshold de risco ≥7→≥6. [10]
- [ ] **Juiz dos evals** (`ANTHROPIC_API_KEY`) pro `release:gate` medir nuance (hoje `judge:skip`). [03]
- [ ] **Risco probabilístico:** o classificador é modelo pequeno; o piso determinístico cobre álcool/doença, mas re-sondar multi-frase periodicamente. [03]

### P2 — Parte 2 / decisão de produto
- [ ] **Morte do GUTO** (campos + guard 403 + blackout) — maior divergência doc×código. [08]
- [ ] **GUTO Online nativo** (`guto-mobile`): bugs do spike (haptic/tick, `silence.mp3`, `endedAt`) se o nativo entrar no beta. [07]
- [ ] **Painel:** i18n do cockpit, abas do aluno 6→9, endpoint de calibragem validado. [10][02]

---

## Como testar (após o deploy Render/Vercel)
No `corpoguto.vercel.app` (com **conta real** — `w@gmail.com/www` só funciona em dev):
- Login com teclado (não corta) · conta nova → consentimento (não trava)
- Chat: "qual o treino?/e a dieta?" (engaja) · "tô com febre"/"bebi e tô mal" (manda descansar) · "viajo na quarta" (acolhe + confirma)
- MISSÃO → GUTO Online (sessão roda) · validar treino com selfie
- **Painel `/coach`:** editar o **Foco** do treino de um aluno → abrir o app dele → MISSÃO mostra o nome exato (fix #11) · gerar/reler **convite** de um aluno (fix #12)

## Notas de método
- **Sempre rodar o app e olhar** antes de dizer que funciona (backend verde ≠ app ok).
- Verificação preferida nesta sessão: **API real + Redis de prod** (não mock), e suíte pro que o dev-bypass anularia.
