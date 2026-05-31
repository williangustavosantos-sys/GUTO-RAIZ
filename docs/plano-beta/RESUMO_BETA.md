# GUTO — Resumo pro Beta (estado real, verificado rodando o app)

> Atualizado 2026-05-31. Consolida o que foi **corrigido + verificado** e o que **ainda falta** pro beta. Tudo aqui foi checado **rodando o app/cérebro de verdade** (não só testes que mockam o modelo). Detalhe por área em `00_INDICE.md` + docs `01..11`.

## ✅ Corrigido e shipado nesta leva (verificado ao vivo + travado por teste)

| Fix | Repo / PR | Verificação |
|---|---|---|
| **Chat sequestrava pergunta central** ("qual o treino?/dieta/calorias" → "distração") | CEREBROGUTO #42 | engaja no domínio (conversa real) |
| **Usuário saudável travava na calibragem** ("Sem dor") | CORPOGUTO #43 | gera treino no 1º turno |
| **"fiz o treino" reperguntava idade** | CEREBROGUTO #45 | reconhece + manda validar |
| **Febre/doença → mandava treinar** | CEREBROGUTO #44 | "descanso/hidratação/médico" |
| **Álcool/intoxicação → mandava treinar** (precedência da segurança sobre a escada) | CEREBROGUTO #47 | 8/8 nas sondas → critical |
| **Selfies públicas por URL** | CEREBROGUTO #46 | URL assinada (HMAC); 403 sem assinatura |
| **Proatividade: viagem virava "cobrança"** (kind `proactive_context`) | CEREBROGUTO #48 | "viajo na quarta" → acolhe → confirma → `trip:confirmed` |
| **Consent travava o onboarding** (17-28s → timeout) | CEREBROGUTO #49 | 28s → **0.03s** |
| **XP do pacto inflava o semanal da Arena/admin** | CEREBROGUTO #50 | total=100 / weekly=0 (app = admin) |
| **Login quebrava com o teclado** | CORPOGUTO #53 | rola, ENTRAR alcançável |

Backend suíte **467/467 · tsc 0**. Frontend `tsc`/`build` ok.

## ✅ Verificado FUNCIONANDO no app real (visual)
- **Onboarding:** intro → idioma → login → consentimento → nome → pacto → home (fluxo completo).
- **Chat:** engaja treino/dieta/calorias/pizza; conclusão; **segurança de febre sólida**.
- **MISSÃO:** treino real ("FORÇA TOTAL", gerado), vídeos, botão "?", "VALIDAR TREINO".
- **DIETA:** dieta semanal coerente (2075 kcal déficit, macros, refeições localizadas em PT).
- **GUTO Online:** sessão guiada **funciona** (aquecimento → exercício → série, checklist, controles).
- **Arena / Evoluir / Percurso / Painel admin:** XP consistente pós-fix (total bate; semanal sem buffer).
- **/coach:** super admin carrega; coach edita treino do aluno (com lock).

## 🔲 Falta pro beta (priorizado)
**P0 — antes de usuário real amplo**
- **Storage persistente das selfies** (hoje em `tmp/` efêmero → somem no redeploy do Render). Escolha de infra (S3/Cloudinary). [08]
- **Validação/selfie ponta a ponta em device real** (câmera não roda no preview): treino → selfie → +100 XP → reflete em Arena/Percurso. [08]
- **Recuperação de senha** (não existe; hoje só via coach). [01]

**P1 — qualidade/operação**
- **Curador de treino sob carga** — caía em template >50% em rajada; medir/estabilizar (retry/backoff). [04]
- **Tirar o mock do painel** (`NEXT_PUBLIC_USE_MOCKS=false`) + threshold de risco ≥7→≥6. [10]
- **Juiz dos evals** (`ANTHROPIC_API_KEY`) pra o `release:gate` medir nuance (hoje `judge:skip`). [03]
- **Risco probabilístico:** o classificador é modelo pequeno; o piso determinístico cobre álcool/doença, mas re-sondar multi-frase periodicamente. [03]

**P2 — Parte 2 / decisão de produto**
- **Morte do GUTO** (campos + guard 403 + blackout) — maior divergência doc×código. [08]
- **GUTO Online nativo** (`guto-mobile`): bugs do spike (haptic/tick, `silence.mp3`, `endedAt`) se o nativo entrar no beta. [07]
- **Painel:** i18n do cockpit, abas do aluno 6→9, endpoint de calibragem validado. [10][02]

## Como testar (após deploys Render/Vercel)
`corpoguto.vercel.app`. Login com teclado (não corta) · conta nova → consentimento (não trava) · chat "qual o treino?/e a dieta?" (engaja) · "tô com febre"/"bebi e tô mal" (manda descansar) · "viajo na quarta" (acolhe + confirma) · MISSÃO → GUTO Online (sessão roda) · validar treino com selfie.

## Notas operacionais
- O que testei como aluno foi com a conta `w@gmail.com` (ela "drifou" e voltou durante o QA — operacional, não bug de produto).
- Lição de método registrada: **sempre rodar o app e olhar** antes de dizer que algo funciona (backend verde ≠ app ok).
