# 07 — GUTO Online (Sessão Assistida)

> **Documento histórico. Não usar como fonte operacional atual sem comparar com o código em main.**

> Spec: `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` · Código: `guto-app-v0/lib/guto-online/*`, `guto-app-v0/components/guto/guto-online-session.tsx` (867 linhas, montado em `mission-tab.tsx:456`); spike nativo em `guto-mobile/`
>
> **Veredito: 🟢 a sessão WEB funciona — validada ao vivo (2026-05-31): lança da MISSÃO, a máquina de estados progride (aquecimento → exercício → série), checklist e controles ok. (O spike NATIVO `guto-mobile` ainda tem bugs — GO-3.) A percepção "não existe" estava desatualizada.**

---

## O que a spec manda
Sessão guiada por **estado** (não cronômetro/videoaula): briefing → aquecimento → série → descanso → transição → fim. Nasce do `lastWorkoutPlan`. Dor pausa/protege; fadiga ajusta. **Ações críticas exigem toque** (voz não dispara sozinha). Retomada por janela (<15min auto / até 12h pergunta / >12h expira). Antirrepetição de voz (cache 5 frases). Fallback: TTS falhou → só haptic + texto gigante. Termina na **Validação com selfie**. Proibido: iniciar sem plano, esquecer progresso ao voltar de uma ligação, falsificar validação.

## O que existe no código
- **Web:** `lib/guto-online/guto-online-engine` + `decideResume`; componente `guto-online-session.tsx` lançado pela aba Missão.
- **Nativo (spike):** `guto-mobile/` — engine portada + áudio/lock screen/notificações (Marco 1 de 4 do `mobile-roadmap`).

## ✅ O que está certo (no nível de engine)
- **O-1..O-6, O-8 ✅** (doc): consome plano oficial; máquina de estados; dor/fadiga; toque-primeiro; retomada por janela (`decideResume`); respeita lock; não inicia sem `userId`.
- A state machine é **pura e testável** — bom alicerce.

## ❌ O que está errado / quebra
- **GO-1 — ✅ VALIDADO AO VIVO (2026-05-31).** Lancei pela MISSÃO ("GUTO PERSONAL ONLINE") e a sessão web rodou: briefing → "AQUECIMENTO FEITO" → avançou pra "AGACHAMENTO LIVRE (Exercício 1/5, Série 1 de 3)"; timer rodando, CHECKLIST 0→1 de 16, controles SÉRIE FEITA / FALAR COM GUTO / +MAIS / DESFAZER / REINICIAR. A máquina de estados progride certo. **Funciona como feature viva.**
- **GO-2 (depende de [04]/[02]/[03]) — sem plano, não há sessão.** O GUTO Online nasce do `lastWorkoutPlan`; se o treino não gera (usuário saudável travado) ou o chat não conduz, a sessão não tem de onde partir.
- **O-7 (spec) — selfie obrigatória no fim.** Hoje o backend aceita validação sem foto (ver [08 X-7](08_validacao_xp_evolucao_morte.md), divergência a confirmar).
- **GO-3 (spike nativo) — bugs reais no `guto-mobile`** (caso o nativo entre no beta):
  - `App.tsx:40-46,60`: **`Haptics` + gravação no AsyncStorage a cada `TICK` (1×/seg)** → vibração contínua e IO por segundo.
  - `native-audio-session.ts:30-39`: `speakLockScreenLine` depende do remoto `https://static.guto.app/silence.mp3` e **nunca chama `play()`**; não é TTS real.
  - `guto-online-engine.ts:142-149`: última série do último exercício → `finished` **sem `endedAt`**. Linha 211: ternário morto fixa `pt-BR`.
  - **Zero testes** no spike apesar da engine ser pura.

## ➕ O que falta adicionar
- Definição de produto: **GUTO Online entra no beta ou não?** Se sim, QA de sessão real e correção dos bugs do spike.
- TTS real + fallback haptic (a spec pede), substituindo o `silence.mp3` remoto.

## 🛠 Plano de ação
1. **(decisão)** Confirmar com o fundador se o GUTO Online entra no **primeiro beta** (a Parte 1 é onboarding+chat+treino+dieta+proatividade; o Online é Parte 4 no roadmap). Se **adiar**, marcar explicitamente como fora do beta para não bloquear.
2. **(se entrar — P1)** QA da sessão web real: abrir do `lastWorkoutPlan`, passar por todas as fases, sair/voltar (retomada), terminar na validação com selfie.
3. **(se nativo — P1)** Corrigir GO-3 (haptic-por-tick, `silence.mp3`/`play()`, `endedAt`, i18n) e adicionar testes da engine.

## Como verificar
Depende de treino gerado ([04]). **Verificado ao vivo (2026-05-31):** com plano ativo, GUTO Online lança e a máquina de estados progride (aquecimento → exercício → série, checklist). Falta exercitar: retomada por janela (<15min/>12h) e o fim → validação com selfie (a câmera não roda no preview headless). O spike nativo (GO-3) segue pendente se o nativo entrar no beta.
