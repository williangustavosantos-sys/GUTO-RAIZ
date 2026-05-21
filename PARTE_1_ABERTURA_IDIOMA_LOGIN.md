# Parte 1 — Abertura, Idioma e Login

> Documento de fluxo da primeira porta do GUTO. Leia depois do `README.md`.

## O Que Essa Parte Representa

Essa é a porta de entrada do GUTO. Tudo o que vem depois — calibragem, pacto, missão, chat, GUTO Online, dieta, arena — só faz sentido se a Parte 1 cumprir três promessas:

1. **Identidade visual e ritual de entrada**: o usuário vê o vídeo de abertura e entende que está entrando em algo vivo, não num formulário.
2. **Soberania do idioma**: o que ele escolhe aqui rege todo o resto do app — UI, voz do GUTO, mensagens de erro, push.
3. **Conexão correta entre identidade, acesso e memória**: o login não é só "entrar"; ele liga o usuário certo à memória certa, com o status de acesso correto.

Se a Parte 1 quebra, o GUTO mente desde o primeiro segundo: idioma errado, memória trocada, treino de outro usuário, acesso indevido. Por isso ela é a parte mais protegida.

## Fluxo Completo (Ordem Soberana)

```txt
1. Visitante abre o app
2. Vê o vídeo de abertura (intro padrão)
3. Escolhe um dos três idiomas
4. Cai em /login  (ou em /convite/[token] se veio por link)
5. Autentica
6. Backend valida acesso, devolve token + dados
7. Frontend carrega memória do GUTO
8. App decide o stage real: consent → naming → calibration → pact → system
9. Se acesso está bloqueado: /acesso-pausado com motivo certo
```

Nenhum passo pode ser pulado. Ninguém entra no app principal sem ter passado por todos.

---

## 1) Vídeo De Abertura

### O que é
Cápsula visual que sempre aparece quando alguém entra sem sessão ativa. Dura 4 segundos fixos, com timer de segurança caso o vídeo falhe.

### Experiência
- Visitante abre o app.
- Vê o portal/cápsula com o botão **"Iniciar GUTO" / "Start GUTO" / "Avvia GUTO"** (texto já segue idioma se vier de retorno).
- Toca uma vez (obrigatório por causa do iOS Safari, que bloqueia autoplay com áudio).
- Vídeo toca por 4 s. Se falhar, o timer de segurança avança igual.
- Cai na tela de idioma.

### Em código
- Arquivo: `guto-app-v0/components/guto/guto-app.tsx`
- Stage inicial `"intro"` (`useState<AppStage>(skipIntro ? "language" : "intro")`).
- Constante `INTRO_VIDEO_MS = 4000`.
- `startIntroVideo()` lida com Safari (seek-to-0 antes de exibir, tentativa unmuted → fallback muted).
- `completeIntroToLanguage()` é o **único** completer — garante que ninguém pule para o stage errado.
- Debug: `?skip-intro=1` na URL pula o intro (apenas dev).

### Regra
- Intro só aparece para **visitante sem sessão**. Usuário logado retornando vai direto para o stage correto. (Decisão confirmada pelo proprietário.)

---

## 2) Idioma

### O que é
Escolha entre três idiomas: **Português (pt-BR)**, **English (en-US)**, **Italiano (it-IT)**.

Esta escolha é lei. Tudo daqui em diante fala esse idioma, incluindo a voz do GUTO quando disponível.

### Experiência
- Após o intro, três cápsulas iluminadas com bandeira/idioma e subtítulo (Brasil / United States / Italia).
- Usuário toca um. A cápsula ganha um glow e o app rota para a próxima porta:
  - Se tem convite pendente no localStorage → `invite_claim` (mesmo idioma).
  - Se não tem sessão e nem convite → `/login?lang={idioma}`.
  - Se já está logado (re-seleção via settings) → volta para `naming`.

### Em código
- Tela: `guto-app-v0/components/guto/screens/language-screen.tsx`.
- Handler: `handleLanguageSelect()` em `guto-app.tsx`.
- Persistência:
  - `localStorage["guto-onboarding-language"]` — escolha em onboarding (ainda mutável).
  - `localStorage["guto-selected-language"]` — escolha confirmada (ex.: trocada nas settings).
- Resolver: `lib/guto-profile.ts → resolveGutoLanguage()` aplica a hierarquia: sessão → onboarding storage → memória do backend → global storage → fallback.

### Regra
- País ≠ Idioma. Um brasileiro morando na Itália pode usar pt-BR e ter contexto alimentar italiano. `country` é campo separado.
- Toda nova rota deve consultar `resolveGutoLanguage()` para renderizar em qualquer idioma — incluindo `/login`, `/convite/[token]` e `/acesso-pausado`.

---

## 3) Login

### O que é
A trava de identidade. Resolve quatro coisas:
```txt
1. Identificar quem é o usuário.
2. Confirmar se ele tem acesso válido.
3. Conectar o usuário à memória correta.
4. Levar para o fluxo certo: onboarding, sistema ou bloqueio.
```

### Sub-fluxos

#### 3.1 Login normal (usuário já ativo)
- Tela: `/login` em `guto-app-v0/app/login/page.tsx`.
- Campos: `Usuário ou E-mail`, `Senha`, botão `ENTRAR`.
- Texto fixo no rodapé: *"Acesso restrito. Você precisa de convite para ativar o GUTO."*
- Idioma renderizado segue `?lang=` → localStorage → fallback pt-BR.

Fluxo técnico:
```txt
POST /auth/user/login  { emailOrId, password }
→ backend valida (existe? senha bate? acesso ativo?)
→ devolve { token, role: "student", userId, name, email, teamId, coachId,
            subscriptionStatus, subscriptionEndsAt }
→ frontend salva token em localStorage["guto-auth-token"]
→ AuthProvider atualiza estado de usuário
→ router.push("/") → GutoApp monta
→ getGutoMemory() carrega a memória do backend
→ resolveAuthenticatedStage() decide: consent | naming | calibration | pact | system
```

#### 3.2 Login por convite
- Coach/admin cria aluno no painel → sistema gera link `/convite/<token>`.
- Aluno abre o link → `app/convite/[token]/page.tsx` salva o token em `localStorage["guto-pending-invite-token"]` e redireciona para `/`.
- `GutoApp` detecta o token e abre o stage `invite_claim`.
- Aluno cria senha + confirma → `POST /auth/invite/:token/claim` → recebe token de sessão.
- Daí em diante segue o fluxo normal (consent → naming → calibration → pact → system).

**Regra soberana**: o `presetName` do convite é apenas sugestão. O nome só vira oficial depois que o aluno aperta confirmar no stage `naming`. Convite **nunca** rouba identidade.

#### 3.3 Acesso bloqueado
- Backend devolve `403` com `code ∈ {ACCESS_PAUSED, ACCESS_EXPIRED, SUBSCRIPTION_EXPIRED, GUTO_DECEASED, GUTO_DEAD}`.
- Interceptor em `lib/api/client.ts` redireciona para `/acesso-pausado?reason=<code>`.
- `/acesso-pausado` mostra a copy correta para o motivo, no idioma do usuário.

Mensagens canônicas (resumo):
| Motivo | Título (pt-BR) | O que o usuário lê |
|---|---|---|
| `ACCESS_PAUSED` | Acesso Pausado | Ciclo encerrou ou aguarda ativação. Fale com seu coach para reativar. |
| `SUBSCRIPTION_EXPIRED` / `ACCESS_EXPIRED` | Acesso Expirado | Assinatura terminou. Renove para continuar. |
| `GUTO_DECEASED` / `GUTO_DEAD` | O GUTO apagou | Este acesso terminou. Fale com o admin. |

#### 3.4 Admin/coach
- `/auth/admin/login` e `/auth/coach/login` são separados. Aluno **não** acessa o painel; coach/admin **não** entram pelo app do aluno sem vínculo próprio.
- Cliente força: se `user.role !== "student"`, `router.replace("/coach")`.

### Estados Possíveis Do Usuário
`novo`, `convidado`, `ativo`, `onboarding incompleto`, `calibragem incompleta`, `pacto pendente`, `ativo completo`, `pausado`, `arquivado`, `bloqueado`, `GUTO morto`, `acesso expirado`. Cada um leva para um destino, sem mistura.

### Segurança
- Senha **bcrypt** (nunca em claro).
- JWT assinado server-side; cliente nunca pode forjar `userId`.
- Erro genérico `Credenciais inválidas` — não revela se é o e-mail ou a senha.
- Token expira; 401 expulsa para `/login`.
- Storage de memória local é por usuário (`guto-white-lab-profile-<userId>`) — impede vazar entre contas no mesmo dispositivo.

### Mobile / Teclado
A página `/login` (e `/acesso-pausado`) usa o hook compartilhado `hooks/use-guto-viewport.ts`, que sincroniza `visualViewport.height` em `--guto-viewport-height` e seta `data-keyboard-open` quando o teclado iOS abre. O CSS de `.sala-guto[data-keyboard-open]` em `app/globals.css` faz o container encolher para a altura visível, mantendo os inputs acima do teclado.

---

## Arquivos-Chave Dessa Parte

| Caminho | Função |
|---|---|
| `app/page.tsx` | Roteador raiz que monta `GutoApp` |
| `components/guto/guto-app.tsx` | Máquina de stages (intro → language → invite_claim → consent → naming → calibration → pact → system) |
| `components/guto/screens/language-screen.tsx` | Tela de escolha de idioma |
| `app/login/page.tsx` | Tela de login |
| `app/convite/[token]/page.tsx` | Captura do token de convite |
| `app/acesso-pausado/page.tsx` | Tela de bloqueio multi-motivo, multi-idioma |
| `components/auth-provider.tsx` | Estado global de sessão (token, user) |
| `lib/api/auth.ts` | Cliente do backend de auth |
| `lib/api/client.ts` | Wrapper de fetch + interceptor 401/403 |
| `lib/guto-profile.ts → resolveGutoLanguage()` | Resolver de idioma |
| `hooks/use-guto-viewport.ts` | Sync de viewport/teclado para rotas fora do GutoApp |
| `guto-backend/src/auth-router.ts` | Endpoints `/auth/user/login`, `/auth/me`, `/auth/invite/...` |

## Eventos de localStorage (contrato)

| Chave | O que guarda | Quem escreve |
|---|---|---|
| `guto-auth-token` | JWT do usuário | `AuthProvider.login()` |
| `guto-onboarding-language` | Idioma escolhido em onboarding (ainda mutável) | `language-screen` |
| `guto-selected-language` | Idioma confirmado/atual | `settings`, `language-screen` |
| `guto-pending-invite-token` | Token de convite enquanto o aluno ainda não autenticou | `/convite/[token]/page.tsx` |
| `guto-entry-mode` | `"invite"` quando o usuário veio por convite | idem |
| `guto-white-lab-profile-<userId>` | Perfil local (nome, flags onboarding, consent, etc.) | `GutoApp.persistProfile()` |

---

## O Que Não Pode Acontecer (Travas Soberanas)

- Deixar entrar sem acesso válido.
- Misturar memória de outro usuário (storage por `userId` resolve).
- Aceitar `userId` do frontend como autoridade — só o JWT vale.
- Pular consent obrigatório, naming, calibração ou pacto.
- Substituir nome confirmado por `presetName` do convite.
- Deixar usuário com `GUTO_DECEASED` entrar no app normal.
- Mostrar UI em idioma diferente do escolhido.
- Vazar em mensagem de erro se é o e-mail ou a senha que está errado.
- Permitir aluno entrar no painel `/coach`.
- Permitir coach ver aluno de outro time.
- Criar conta sem vínculo quando o modelo exige convite.
- Fingir que recuperação de senha funciona quando ela não foi implementada.

---

## Estado Atual

### Pronto ✅
- Vídeo de abertura com timer de segurança, suporte a Safari, padrão para visitantes.
- Escolha de idioma persistida e propagada em URL + localStorage.
- Login normal com validação backend (bcrypt + JWT).
- Convite com confirmação manual de senha e nome.
- Distinção `student` vs `coach`/`admin` em rotas.
- `/acesso-pausado` traduzido em 3 idiomas, com copy específica por motivo (`?reason=…`).
- Interceptor 403 do cliente propaga o `code` para `/acesso-pausado`.
- `/login` e `/acesso-pausado` respeitam o teclado do iOS via `useGutoViewport`.
- Testes Playwright cobrindo viewport mobile, idiomas e motivos de bloqueio.

### Pendente ⚠️
- **Backend distinguir** `GUTO_DECEASED` / `SUBSCRIPTION_EXPIRED` de `ACCESS_PAUSED`. Hoje só emite `ACCESS_PAUSED`. Frontend já está pronto para receber.
- **Recuperação de senha**: não existe e não finge. Quando implementar, adicionar link "Esqueci minha senha" no `/login` + endpoint backend `/auth/password/reset`.
- **Botão "Tenho convite"** no `/login`: opcional na spec. Convite hoje só via URL direta `/convite/<token>`.
- **Tela `invite_claim` mostrar coach/time/plano**: backend precisa expor esses campos em `GET /auth/invite/:token` e UI ganhar elementos novos para exibir.
- **Aviso preventivo de assinatura** ("vence em 3 dias"): exige banner novo. Dados (`subscriptionStatus`, `subscriptionEndsAt`) já chegam ao cliente.

---

## Como Rodar Localmente

```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
npm install     # se ainda não rodou
npm run dev
```
Abre em **http://localhost:3000**.

Para validar como celular:
- Chrome DevTools → modo dispositivo → **iPhone 14 Pro (390×844)**.
- Focar o input de e-mail no `/login` → o container deve encolher e o input continuar visível.

### Rodar os testes da Parte 1
```bash
cd /Users/williandossantos/GUTOO/guto-app-v0
npx playwright test e2e/login-keyboard.spec.ts e2e/acesso-pausado.spec.ts --reporter=line
```

## Produção (Vercel)
- Front: **https://corpoguto.vercel.app/**
- Backend: **https://cerebroguto.onrender.com**

Detectados em `lib/api/client.ts` e `.env.local`. Mudanças locais só aparecem em produção depois de `git push` + auto-deploy do Vercel.

---

## Frase Final

A Parte 1 não existe para impressionar. Ela existe para que, quando o GUTO disser *"oi, é teu treino"*, o usuário tenha a certeza absoluta de que é com **ele** que o GUTO está falando — no idioma dele, com a memória dele, no acesso dele. Tudo o que vem depois confia nessa promessa.
