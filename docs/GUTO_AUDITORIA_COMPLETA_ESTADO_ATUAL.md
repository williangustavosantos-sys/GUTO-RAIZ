# GUTO — Auditoria Completa do Estado Atual

Data da auditoria: 2026-05-16  
Referência absoluta: `GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md`  
Escopo: leitura local de frontend, backend, documentação, rotas, componentes, hooks, serviços, memória, idioma, assets, testes e captura visual com Playwright.

## 1. Sumário Executivo

O GUTO atual tem uma base real de produto: onboarding, login, consentimento, calibragem, hub, chat, treino, GUTO Online, dieta, percurso, evolução, arena, configurações e painel admin/coach existem no código e aparecem na tela. Visualmente, o app já tem identidade própria: cápsula branca, cyan, botões touch-first e presença forte do avatar.

Mas ele ainda não está pronto para teste com usuário real sem supervisão. O principal problema não é visual. É comportamento, persistência sensível, segurança de dados de validação, dieta/restrições, teste automatizado quebrado, GUTO Online ainda parcialmente local/scriptado e lacunas de idioma/memória.

O Santo Graal exige um sistema de ação e accountability que decide com contexto e preserva missão. Hoje o produto ainda alterna entre fluxo real e fallback local. Em várias áreas ele parece pronto na interface, mas o comportamento por trás ainda é frágil.

## 2. Nota Geral Hoje

Nota geral: **52/100**

Critério: não é uma nota de beleza. É uma nota de prontidão real contra o Santo Graal, considerando comportamento, persistência, segurança, idioma, treino, dieta, testes e beta.

## 3. Percentual de Prontidão

| Cenário | Prontidão | Leitura honesta |
|---|---:|---|
| Teste interno com fundador | 70% | Dá para usar guiado, vendo logs e aceitando falhas. |
| Teste com 3 pessoas | 42% | Ainda arriscado: dieta, validação, idioma, onboarding antigo e testes backend falhando. |
| Teste com 20 pessoas | 25% | Falta estabilidade, proteção de dados, QA mobile real e persistência consistente. |
| Beta pago | 15% | Não vender antes de resolver P0/P1. |
| Venda B2B para personal/academia | 18% | Painel admin existe, mas segurança, testes e contratos ainda não sustentam operação real. |

## 4. Evidência Técnica Executada

| Item | Resultado |
|---|---|
| Santo Graal localizado | `GUTO_SANTO_GRAAL_V3_1_IMPECAVEL.md`, raiz do projeto. |
| Estrutura/documentação | Lida via `rg --files`, `find`, `AGENTS.md` e arquivos `.md` relevantes. |
| Frontend typecheck | `npx tsc --noEmit` passou. |
| Backend typecheck | `npx tsc --noEmit` passou. |
| Backend tests | `npm test` falhou. Falhas principais: auth/admin/coach/account/weekly diet/workout retornando 401, histórico contextual não entende “ontem/anteontem” como exigido. |
| Playwright screenshots | Geradas em `docs/audit-screenshots/2026-05-16/`. |
| Supabase | Não há integração Supabase no código. `rg supabase` só encontrou textos de privacidade. Supabase MCP não foi necessário. |
| Deploy | Não alterado. |
| Código | Não corrigido. Apenas relatório e screenshots foram adicionados. |

## 5. Tabela Geral de Páginas, Abas e Sistemas

| Área | Status | Prioridade |
|---|---|---|
| A. Entrada / Intro / Cápsula | Parcial | P1 |
| B. Login / Acesso / Convite | Parcial | P1 |
| C. Consentimento / GDPR / Saúde | Parcial bom | P1 |
| D. Calibragem inicial | Parcial bom | P1 |
| E. Home / Hub principal | Parcial | P2 |
| F. Chat | Parcial | P1 |
| G. Treino do dia | Parcial | P1 |
| H. GUTO Online | Parcial crítico | P1/P0 se vendido como presença ativa |
| I. Dieta da semana | Quebrada/frágil | P0 |
| J. Percurso / Progresso | Parcial | P2 |
| K. Arena / Ranking | Parcial | P1 |
| L. Perfil / Configurações | Parcial | P1 |
| M. Admin / Coach / Super Admin | Parcial | P0/P1 |
| N. Memória / Personalização / Proatividade | Parcial crítico | P0 |
| O. Sistema de idioma | Parcial | P1 |
| P. Avatar / Assets / Vídeos | Parcial | P2 |
| Q. Backend / API / Supabase | Parcial crítico | P0 |
| R. Testes / QA | Insuficiente | P0 |
| S. Produção / Deploy | Não pronto | P0/P1 |

## 6. Auditoria Detalhada por Página e Fluxo

### A. Entrada / Intro / Cápsula Inicial

**Santo Graal exige:** intro minimalista, premium, sem distração, com cápsula e presença do GUTO. Reload não pode quebrar o fluxo. Idioma precisa persistir depois de escolhido.

**Código atual:** entrada em `guto-app-v0/app/page.tsx` chama `GutoApp` com `skipIntro`. A intro usa vídeo `abertura-guto.mp4` e fallback visual em `components/guto/guto-app.tsx`.

**Tela real:** `01-intro.png` mostra uma tela quase vazia com botão `INICIAR GUTO`. A cápsula/vídeo não apareceu no frame capturado, só o botão.

**Funciona:** há estado de intro, botão de iniciar e rota com `?skip-intro=1`.

**Parcial/quebrado/faltando:** o botão da intro está em português antes da escolha de idioma. A captura mostra pouca presença visual do GUTO. Se o vídeo demora/carrega mal, o primeiro contato vira uma tela branca genérica.

**Risco:** primeira impressão abaixo do Santo Graal. Não bloqueia backend, mas prejudica muito percepção premium.

**Prioridade:** P1.

**Arquivos/evidência:** `guto-app-v0/app/page.tsx`; `guto-app-v0/components/guto/guto-app.tsx`; screenshot `01-intro.png`.

### B. Login / Acesso / Convite

**Santo Graal exige:** acesso real, convite/senha, proteção de rotas, estados de erro claros e sem `local-user` em produção.

**Código atual:** login em `app/login/page.tsx`; auth provider usa JWT em localStorage; API em `lib/api/auth.ts`. Convite salva token em localStorage e redireciona para `/`.

**Tela real:** `03-login-en.png` abriu login em inglês. Visual está coerente com o produto.

**Funciona:** login de aluno/admin/coach existe; `/auth/me` protege app; 401 remove token e redireciona.

**Parcial/quebrado/faltando:** token em localStorage aumenta risco XSS. Convite depende de localStorage; se Safari private mode bloquear storage, o código apenas “segue” e perde o token (`app/convite/[token]/page.tsx:16-22`). Erros do backend são majoritariamente PT.

**Risco:** usuário convidado pode cair fora do fluxo em Safari/private mode. Proteção existe, mas ainda frágil para beta.

**Prioridade:** P1.

**Arquivos/evidência:** `guto-app-v0/app/login/page.tsx`; `guto-app-v0/app/convite/[token]/page.tsx:16`; `guto-app-v0/lib/api/client.ts:70`; screenshot `03-login-en.png`.

### C. Consentimento / GDPR / Saúde

**Santo Graal exige:** consentimento claro antes de usar, aceite obrigatório, idioma correto, persistência e bloqueio se não aceitar.

**Código atual:** `ConsentScreen` exige duas confirmações. Links para termos e privacidade respeitam `?lang=`.

**Tela real:** `04-consent-en.png` apareceu em português na captura porque a memória privada do usuário auditado estava em `pt-BR` e venceu o idioma local selecionado. A tela em si está legível e bloqueia o botão até aceite.

**Funciona:** checkbox obrigatório, CTA desabilitado, termos e política existem em 3 idiomas.

**Parcial/quebrado/faltando:** aceite inicial persiste primeiro em profile local; backend só é atualizado em outros pontos. Revogação chama backend, mas se falhar ainda revoga localmente (`components/guto/guto-app.tsx:1616-1631`). Backend limpa `age`, mas não `userAge`, `trainingGoal` ou `preferredTrainingLocation` (`guto-backend/server.ts:3793-3813`).

**Risco:** usuário pode achar que dados sensíveis foram limpos quando parte deles continua na memória. Isso é perigoso para GDPR/LGPD.

**Prioridade:** P1.

**Arquivos/evidência:** `components/guto/screens/consent-screen.tsx`; `components/guto/guto-app.tsx:1616`; `guto-backend/server.ts:3793`; screenshot `04-consent-en.png`.

### D. Calibragem Inicial

**Santo Graal exige:** coletar idade, sexo biológico, nível, objetivo, local, patologia, idioma, histórico recente, altura, peso, país, restrições e intolerâncias. Não perguntar de novo se já salvo.

**Código atual:** `CalibrationScreen` coleta sexo incluindo `prefer_not_to_say`, idade, nível incluindo `advanced`, objetivo, local, país, altura, peso, patologia, restrições e intolerâncias.

**Tela real:** `05-calibration-pt.png` mostra a calibragem inicial com corpo técnico, sexo, idade, peso, altura, país, restrições, intolerâncias, objetivo e local. Visual está alinhado à estética.

**Funciona:** coleta ampla e UI forte.

**Parcial/quebrado/faltando:** `getMissingCalibrationFields` não exige país, restrições nem intolerâncias (`lib/guto-profile.ts:76-85`), embora dieta dependa disso. Configurações não aceitam `prefer_not_to_say` como sexo editável. Histórico recente de treino não aparece como campo forte da calibragem.

**Risco:** o sistema considera calibragem completa sem dados que o Santo Graal exige para dieta/país/segurança.

**Prioridade:** P1.

**Arquivos/evidência:** `components/guto/screens/calibration-screen.tsx`; `lib/guto-profile.ts:76`; screenshot `05-calibration-pt.png`.

### E. Home / Hub Principal

**Santo Graal exige:** presença constante do GUTO, sensação de dupla, fala curta e proativa, sem parecer chatbot genérico.

**Código atual:** Home é a aba chat dentro de `GutoApp`; avatar, bolha, input, voz e nav inferior.

**Tela real:** `07-home-chat.png` mostra GUTO visualmente presente, mas o avatar aparece com arte recortada/ruído cinza ao redor. A fala inicial é forte, porém longa: “Finalmente, AUDIT USER. Tava te esperando...”.

**Funciona:** presença visual, input, botão de voz, navegação e identidade premium.

**Parcial/quebrado/faltando:** a saudação passa de 1-3 frases curtas e pode soar mais teatral do que operacional. O avatar não está limpo na captura. A bolha e input ocupam bem o mobile, mas a imagem recortada reduz qualidade percebida.

**Risco:** percepção de produto ainda protótipo, apesar da boa direção visual.

**Prioridade:** P2.

**Arquivos/evidência:** `components/guto/tabs/chat-tab.tsx`; `components/guto/avatar/*`; screenshot `07-home-chat.png`.

### F. Chat

**Santo Graal exige:** GUTO não é chatbot. Deve usar contexto, memória, idioma e autonomia do modelo para decisão/execução. Respostas curtas, diretas, no idioma do usuário.

**Código atual:** `ChatTab` envia mensagem para `/guto`, inclui histórico curto, expected response e memória. Há proatividade via `/guto/proactive` a cada 60s.

**Funciona:** input, histórico local, integração backend, proatividade básica, troca de idioma via ação, voz e perguntas de treino/dieta.

**Parcial/quebrado/faltando:** histórico de chat fica no localStorage e só últimos 24 itens (`chat-tab.tsx:364-414`). `profile.name` cai para `"Usuário"` se vazio mesmo em EN/IT (`chat-tab.tsx:850-852`). Dúvida de exercício manda pouco contexto de treino (`chat-tab.tsx:951-970`). Dúvida de dieta não inclui intolerâncias (`chat-tab.tsx:989-1001`). Follow-up de dieta injeta “Pergunta do usuário” em português no prompt (`chat-tab.tsx:1090-1094`).

**Risco:** o chat parece inteligente, mas ainda há costuras que podem virar resposta genérica ou fora do idioma/contexto.

**Prioridade:** P1.

**Arquivos/evidência:** `components/guto/tabs/chat-tab.tsx:850`; backend `/guto`; testes backend de histórico falhando.

### G. Treino do Dia

**Santo Graal exige:** treino adaptado por calibragem, histórico, dor/limitação e local. Cards devem ter séries, reps, carga, descanso, mídia validada, dúvida e entrada no GUTO Online.

**Código atual:** `MissionTab` exibe plano, vídeos locais, dúvida e validação. Se não há plano no backend, frontend cria fallback local em `createLocalWorkoutPlan`.

**Tela real:** `08-missao.png` mostra treino “Peito, ombro e tríceps”, aquecimento, cards com séries/reps/descanso, vídeos/imagens e botão `GUTO PERSONAL ONLINE`.

**Funciona:** visual bom, cards úteis, vídeos aparecem, botão de dúvida existe, validação fica desabilitada até checklist.

**Parcial/quebrado/faltando:** carga não aparece como campo operacional. Validação de vídeo só verifica prefixo/metadata, não existência real de arquivo (`mission-tab.tsx:144-151`). Fallback local usa catálogo pequeno e não respeita histórico de forma suficiente. Testes backend mostram que “treinei isso ontem/anteontem” falha.

**Risco:** treino pode parecer certo, mas repetir grupo ou ignorar contexto recente. Isso ataca o centro do produto.

**Prioridade:** P1; P0 para beta se histórico/adaptação continuar falhando.

**Arquivos/evidência:** `components/guto/tabs/mission-tab.tsx`; `lib/workout-plan.ts`; screenshot `08-missao.png`; backend tests falhando.

### H. GUTO Online / Presença Ativa

**Santo Graal exige:** presença ativa real, série por série, warmup, descanso, pausa, dor, troca, finalizar, validação, retomada 0-15/15-12h/>12h, mobile seguro, sem depender de IA para microestado.

**Código atual:** há engine local com estados e resume em localStorage. Quick Talk classifica comandos/dor/troca/fadiga por regex. Sessão persiste só por `workoutKey`, sem `userId`.

**Tela real:** `09-guto-online.png` mostra tela full-screen, timer, botão de áudio, checklist e botões grandes. Visualmente parece presença ativa.

**Funciona:** abre, fecha, timer, warmup, checklist, pausa/reiniciar/falar, retomada local.

**Parcial/quebrado/faltando:** o plano remove exercícios de aquecimento e mostra um item genérico `AQUECIMENTO` (`guto-online-session.tsx:211-215`). Dor/troca/fadiga mudam estado/resposta, mas não adaptam de fato o exercício/carga. Classificação é regex hardcoded (`guto-online-context-guard.ts:43-80`), contra a regra do projeto. Sessão local não inclui usuário (`guto-online-storage.ts:29-55`). Botão validar só chama `onFinish` e fecha, não abre validação real (`guto-online-session.tsx:629-633`).

**Risco:** parece pronto na tela, mas ainda não é a presença ativa do Santo Graal. Para usuário real, isso vira promessa maior que comportamento.

**Prioridade:** P1; P0 se for apresentado como diferencial principal no beta.

**Arquivos/evidência:** `components/guto/guto-online-session.tsx`; `lib/guto-online/*`; screenshot `09-guto-online.png`.

### I. Dieta da Semana

**Santo Graal exige:** dieta semanal por contexto, país, idioma, restrições/intolerâncias, macros, refeições, substituições, integração chat e limites legais/sanitários.

**Código atual:** `DietTab` busca `/guto/diet`, gera se não houver e sanitiza plano. Backend usa memória e Gemini, com fallback/validação de porções.

**Tela real:** `10-dieta.png` mostrou erro: “Dieta ainda não gerada. Não foi possível gerar a dieta.”

**Funciona:** tela existe, loading/erro existem, coach diet tem caminho separado.

**Parcial/quebrado/faltando:** perfil completo para dieta não exige país/restrições/intolerâncias (`diet-tab.tsx:463-473`; backend `server.ts:4994-5038`). Fallback calculado usa iogurte, ovos, frango e parmesão mesmo se usuário tiver lactose/veganismo (`lib/diet-plan.ts:43-80`). Validação só confere calorias/macros, não alergênicos/restrições (`lib/diet-plan.ts:83-124`). Backend defaulta país para Brasil se ausente (`server.ts:5035`).

**Risco:** alto. Dieta errada com intolerância ou restrição alimentar é risco sanitário/legal e de confiança.

**Prioridade:** P0.

**Arquivos/evidência:** `components/guto/tabs/diet-tab.tsx`; `lib/diet-plan.ts`; `guto-backend/server.ts:4994`; screenshot `10-dieta.png`.

### J. Percurso / Progresso

**Santo Graal exige:** registros reais, XP, streak, histórico, validações, consequência visual.

**Código atual:** `PathTab` usa memória, validationHistory e XP. Evolução visual parcialmente vem de fixtures.

**Tela real:** `11-percurso.png` mostra mês atual, dias, XP, avatar, mensagem e card do treino. Visual está forte.

**Funciona:** mostra trajetória, XP e status. Usa validação real quando existe.

**Parcial/quebrado/faltando:** na captura apareceu `0 XP hoje` apesar da memória ter 100 XP inicial. Isso pode ser correto se XP inicial não conta como XP do dia, mas precisa ficar explícito para não parecer bug. As imagens de validação vêm de URLs públicas sem auth.

**Risco:** progresso é bom visualmente, mas dependente da validação/storage frágil.

**Prioridade:** P2.

**Arquivos/evidência:** `components/guto/tabs/path-tab.tsx`; `guto-backend/server.ts:4461`; screenshot `11-percurso.png`.

### K. Arena / Ranking

**Santo Graal exige:** ranking semanal, mensal, global, grupos/times, nomes de dupla, XP real e estado vazio forte.

**Código atual:** backend Arena existe com XP, ranking semanal/mensal/individual. Frontend consome rankings e mostra abas.

**Tela real:** `13-arena.png` mostra Semana/Mês/Individual, card do usuário, 100 XP e “precisa reagir”.

**Funciona:** ranking aparece com XP real inicial.

**Parcial/quebrado/faltando:** e2e mock antigo retorna `{entries: []}` enquanto componente real espera `items`, então teste não representa contrato real. Reset de semana/mês no backend usa JS local em partes do Arena, não um contrato explícito por timezone. Grupo/time existe, mas experiência social ainda rasa.

**Risco:** ranking pode divergir entre teste, backend e UI.

**Prioridade:** P1.

**Arquivos/evidência:** `components/guto/tabs/arena-tab.tsx`; `guto-backend/src/arena.ts`; `e2e/guto.spec.ts:180-183`; screenshot `13-arena.png`.

### L. Perfil / Configurações

**Santo Graal exige:** dados do usuário, idioma, objetivo, restrições, logout/reset/privacidade/controle de dados, sem quebrar memória.

**Código atual:** settings existem dentro de `GutoApp`. Exporta JSON local, corrige dados via telas, revoga consentimento e exclui conta.

**Tela real:** `14-settings.png` mostra grade de cartões: idioma, nome, perfil, objetivo, local, limitação, peso/altura, país, restrições, intolerâncias e privacidade.

**Funciona:** visual bom, direto, com dados salvos aparecendo.

**Parcial/quebrado/faltando:** títulos truncam demais (`LIMITAC...`, `INTOLER...`). Exportação baixa dados locais/memória atual, não exportação completa backend (`guto-app.tsx:1566-1608`). Texto hardcoded “Consentimento” aparece no modo privacidade (`guto-app.tsx:3166`). `deleteOwnAccount` manda confirmação `"EXCLUIR"` fixa, mesmo que UI esteja em EN/IT (`lib/api/auth.ts:67-72`).

**Risco:** privacidade aparenta existir, mas ainda não é operação GDPR real completa.

**Prioridade:** P1.

**Arquivos/evidência:** `components/guto/guto-app.tsx:1566`; `lib/api/auth.ts:67`; screenshot `14-settings.png`.

### M. Admin / Coach / Super Admin

**Santo Graal exige:** planos, times, coaches, alunos, convites, edição treino/dieta, limites por plano, segurança e isolamento.

**Código atual:** painel `/coach` existe com alunos, coaches, arena, histórico, times. Backend admin tem rotas de alunos, coaches, times, exercícios, treino semanal, dieta semanal, locks e logs.

**Tela real:** `15-admin-coach-desktop.png` mostra dashboard super admin, alunos, filtros, escopo, time e status online. Visual B2B está mais industrial e coerente que o app mobile.

**Funciona:** painel renderiza, lista alunos e escopo.

**Parcial/quebrado/faltando:** backend tests falham em várias rotas admin/coach com 401. Treino/dieta semanais existem, mas integração estudante não está fechada em todos os fluxos. Segurança precisa passar testes antes de B2B.

**Risco:** para demo interna é útil. Para academia/personal real, ainda não sustenta contrato operacional.

**Prioridade:** P0/P1.

**Arquivos/evidência:** `guto-app-v0/app/coach/page.tsx`; `guto-backend/src/admin-router.ts`; screenshot `15-admin-coach-desktop.png`; backend tests falhando.

## 7. Auditoria Detalhada de Memória, Personalização e Proatividade

**Santo Graal exige:** memória real, contextual, sem `local-user`, com expiração/descartes, confirmação de eventos, uso da semana, proatividade real, sem prometer salvar se não salvou.

**Onde existe hoje:**

| Camada | O que salva |
|---|---|
| Frontend localStorage | profile/onboarding, chat local, sessão GUTO Online, token JWT, idioma. |
| Backend memory store | memória operacional do usuário, XP, treino, dieta, validações, proatividade. |
| Redis/Upstash | suporte opcional; depende de env. |
| Supabase | não existe integração no código. |

**O que funciona:**

- `/guto/memory` usa `requireActiveUser` e deriva usuário do JWT.
- `mergeMemory` exige `profile.userId`, sem fallback `local-user`.
- XP inicial é gravado e sincroniza Arena.
- Proatividade tem endpoints de extract/confirm/discard/request-discard/open-weekly.
- Chat consulta `/guto/proactive` em intervalo.

**Parcial/quebrado/faltando:**

- `persistMemory` atualiza estado local antes de confirmar backend; se falhar, usuário pode ver dado aparentemente salvo (`guto-app.tsx:703-717`).
- `onChangeLanguage` do chat salva profile local, mas não chama persistência de memória diretamente (`guto-app.tsx:1955-1959`).
- Proatividade depende de intervalo no chat aberto; não há evidência de push real no frontend.
- Redis é opcional e não há guard de produção exigindo Upstash (`config.ts:21-23`).
- `readMemoryStoreSync` não lê Redis diretamente; usa arquivo/cache (`memory-store.ts:125-147`).
- Sessão GUTO Online não inclui `userId` na chave, só `workoutKey` (`guto-online-storage.ts:29-55`).
- Revogação de consentimento não limpa todos os campos sensíveis.
- Não há mecanismo amplo de expiração para memória velha de treino/dieta além de alguns checks pontuais.

**Risco:** GUTO ainda não tem a memória soberana do Santo Graal. Ele tem persistência, mas há mistura de local/servidor e lacunas de expiração/garantia.

**Prioridade:** P0 para beta.

## 8. Auditoria Detalhada de Idioma

**Santo Graal exige:** PT/EN/IT em app, chat, onboarding, erros, dieta, treino, backend; idioma não é país.

**Funciona:**

- Dicionários PT/EN/IT existem.
- Login, termos, privacidade, consentimento, calibragem e abas principais têm tradução.
- `resolveGutoLanguage` separa escopo onboarding/private e valida idioma (`lib/guto-profile.ts:30-57`).

**Problemas encontrados:**

- Intro mostra `INICIAR GUTO` antes da seleção de idioma.
- Settings privacidade tem “Consentimento” hardcoded (`guto-app.tsx:3166`).
- API client retorna erros genéricos em inglês e erro de env em português (`lib/api/client.ts:44-65`).
- Backend tem várias mensagens PT-only.
- `deleteOwnAccount` envia `"EXCLUIR"` fixo (`lib/api/auth.ts:67-72`).
- Chat usa `"Usuário"` como fallback de nome (`chat-tab.tsx:850-852`).
- Prompt de follow-up de dieta injeta português (`chat-tab.tsx:1090-1094`).
- Datas antigas/estáticas ainda existem em translations/view-models.
- `profile-update-detector` menciona espanhol em regex, mas só suporta PT/EN/IT (`profile-update-detector.ts:56-64`, `230-243`).

**Risco:** usuário EN/IT pode encontrar PT em momentos sensíveis. Para Santo Graal, isso quebra confiança.

**Prioridade:** P1.

## 9. Auditoria Detalhada de Design

**Santo Graal exige:** foco obsessivo, autoridade industrial, luxo não-amigável, branco/cápsula/ice/cyan/navy, touch-first, sem app genérico.

**O que está forte:**

- App mobile tem identidade visual distinta.
- Botões grandes, glass/ice e nav por ícones funcionam.
- Painel admin tem estética industrial coerente.
- GUTO Online full-screen passa presença.

**Abaixo do padrão:**

- Avatar aparece com fundo/arte recortada na Home e Percurso (`07-home-chat.png`, `11-percurso.png`).
- Intro capturada ficou branca demais, sem impacto (`01-intro.png`).
- Settings truncam texto demais em cartões (`14-settings.png`).
- Alguns cards internos parecem flutuar dentro de painéis grandes; ainda há risco de excesso de vidro/baixo contraste.
- Dieta vazia mostra erro simples demais para um sistema de autoridade (`10-dieta.png`).

**Prioridade:** P2, exceto avatar/intro se forem primeira impressão de beta: P1.

## 10. Auditoria Detalhada de Backend/API/Supabase

**Santo Graal exige:** endpoints reais, JWT/session, persistência, policies/storage, logs, sem mock em produção, contratos robustos.

**Endpoints reais existem:**

- `/health`
- `/auth/*`
- `/guto`
- `/guto/memory`
- `/guto/validate-name`
- `/guto/validate-workout`
- `/guto/diet`
- `/guto/proactive/*`
- `/guto/push/*`
- `/admin/*`
- `/guto/billing/*`

**Funciona:**

- `requireActiveUser` protege rotas principais.
- `GUTO_ALLOW_DEV_ACCESS` tem guard contra produção.
- `JWT_SECRET` fraco falha em produção.
- CORS falha fechado se allowlist de produção não existir.

**Problemas críticos:**

- Imagens de validação são servidas publicamente por Express static (`server.ts:491-494`; `storage.ts:13-17`).
- Dieta não exige país/restrições/intolerâncias como contrato obrigatório.
- `/guto-audio` chama `/voz` sem Authorization (`server.ts:4431-4435`), então tende a falhar sob auth.
- `/guto/online/exception` usa `(req as any).user?.language`, mas middleware usa `req.gutoUser`; cai para PT (`server.ts:5258`).
- Não existe Supabase real apesar da política de privacidade dizer “Supabase / Vercel” (`privacy/page.tsx:43`, `84`, `125`).
- Redis/Upstash é opcional; sem ele, produção pode depender de arquivo/cache dependendo do ambiente.

**Prioridade:** P0/P1.

## 11. Auditoria Detalhada de Testes / QA

**Santo Graal exige:** teste real, mobile Safari/Android, 3 perfis, XP consistente, idioma, proatividade, admin/coach, fallback IA/voz/camera/push/network.

**O que existe:**

- Playwright em `guto-app-v0/e2e/guto.spec.ts`.
- Backend tem suíte de integração/unidade.
- Typecheck passa em frontend/backend.

**Problemas:**

- Backend `npm test` falhou.
- Playwright usa API mockada em `https://cerebroguto.onrender.com` (`e2e/guto.spec.ts:20-22`, `144-195`).
- Playwright só tem Chromium com viewport mobile; não testa WebKit/Safari nem Android real (`playwright.config.ts:34-43`).
- Mock de Arena usa contrato diferente do real (`entries` vs `items`).
- Testes visuais atuais não garantem backend/memória/XP real.

**Prioridade:** P0.

## 12. Produção / Deploy

**Santo Graal exige:** Vercel frontend, backend estável, envs corretos, logs, Sentry, performance e segurança antes de beta.

**Estado atual:**

- Deploy configs existem, mas não foram alterados.
- Sentry está ativo no cliente com `tracesSampleRate: 1`, Replay e `sendDefaultPii: true` (`instrumentation-client.ts:7-29`; também server/edge).
- `.env.local` do frontend aponta para backend remoto por padrão; em auditoria foi necessário interceptar chamadas para usar backend local.
- Render/Railway/envs dependem de preenchimento manual de secrets.

**Risco:** observabilidade existe, mas pode capturar PII demais. Produção precisa de revisão de privacidade, sampling e consentimento antes de beta pago.

**Prioridade:** P1.

## 13. Lista P0 — Bloqueadores Reais

1. Backend tests falhando em auth/admin/coach/account/weekly diet/workout e histórico contextual.
2. Dieta pode violar restrições/intolerâncias por fallback e validação insuficiente.
3. Imagens de validação/selfie/poster são públicas sem auth/signed URL.
4. Onboarding pode pular calibragem se `onboardingComplete` ou `pactAccepted` antigo existir antes da verificação de calibragem (`guto-app.tsx:549-559`).
5. Histórico “ontem/anteontem” falha nos testes, podendo repetir treino ou pedir contexto que já deveria inferir.
6. GUTO Online ainda não adapta dor/troca/carga de verdade, apesar de parecer “presença ativa”.
7. Validação de treino com skip camera envia imagem vazia e backend exige `imageBase64`.
8. Exportação/revogação/delete de dados não formam fluxo GDPR completo.
9. Persistência de produção depende de Redis/Upstash opcional, sem guard obrigatório.
10. Testes Playwright atuais são mockados e não provam fluxo real.

## 14. Lista P1 — Problemas Graves

1. Voz cai para browser fallback heurístico; voz errada é pior que silêncio para a identidade do GUTO.
2. Nome soberano pode ser sobrescrito por nome do auth/invite, porque `resolveGutoProfile` prioriza `user.name` antes de stored/memory (`lib/guto-profile.ts:105-110`).
3. Idioma tem vazamentos de PT em intro, settings, backend errors, prompts internos e delete.
4. Chat de dúvida de exercício/dieta envia contexto incompleto.
5. Configurações não editam `prefer_not_to_say`.
6. Convite depende de localStorage; Safari private mode pode perder token.
7. Sentry com `sendDefaultPii: true` e replay precisa revisão antes de usuário real.
8. `/guto-audio` tende a falhar por chamar `/voz` sem Authorization.
9. Privacy copy cita Supabase, mas o código não usa Supabase.
10. Admin/coach existe visualmente, mas testes de rota não sustentam B2B.

## 15. Lista P2 — Melhorias Importantes

1. Limpar avatar/asset recortado na Home/Percurso.
2. Melhorar estado vazio/erro da Dieta para atitude mais GUTO.
3. Exibir carga no treino quando existir.
4. Validar existência real de mídia local de exercício, não só prefixo.
5. Reduzir truncamento de labels em Settings.
6. Explicitar diferença entre XP inicial e XP do dia.
7. Expandir histórico recente na calibragem.
8. Adicionar testes mobile WebKit/Android.
9. Separar melhor país de idioma em todos os fluxos.
10. Revisar textos longos para 1-3 frases no tom GUTO.

## 16. Lista P3 — Refinamentos

1. Polir microcopy da intro.
2. Ajustar LCP de imagens de idioma.
3. Revisar `aria-labels` hardcoded.
4. Remover referências legadas/fixtures de datas antigas.
5. Melhorar skeleton/loading das abas.
6. Padronizar reset labels de ranking por idioma.
7. Revisar sombra/contraste em cards muito claros.
8. Adicionar evidência visual de safe-area iOS.
9. Melhorar labels do painel admin em telas menores.
10. Documentar contratos de cada endpoint em um arquivo único.

## 17. Plano Sugerido de Correção em Fases

### Fase 1 — Estabilização

- Fazer backend tests passarem.
- Corrigir onboarding skip de calibragem.
- Fechar segurança de validation images.
- Corrigir skip-camera ou remover promessa.
- Tornar Redis/Upstash obrigatório para beta/prod.
- Alinhar export/revoke/delete de dados.

### Fase 2 — Experiência

- Corrigir dieta com restrições/intolerâncias/país.
- Corrigir histórico contextual de treino.
- Melhorar GUTO Online para adaptar dor/troca/fadiga de verdade.
- Remover browser voice fallback ou transformá-lo em silêncio + texto/haptic.
- Limpar avatar/intro/labels truncadas.

### Fase 3 — Beta Interno

- Testar 3 perfis reais: iniciante, avançado, limitação/dor.
- Rodar Playwright real sem mocks contra backend local.
- Cobrir PT/EN/IT no onboarding, chat, treino, dieta e erros.
- Validar iOS Safari e Android Chrome.

### Fase 4 — Beta 20 Usuários

- Ativar logs/alertas com PII controlada.
- Monitorar falhas de dieta, treino, voz, validação e auth.
- Medir retenção, conclusão de missão e recuperação de ausência.
- Adicionar jobs/push reais para proatividade.

### Fase 5 — B2B

- Completar isolamento coach/team/admin.
- Passar suíte admin/coach.
- Fechar planos/limites/convites/auditoria.
- Criar contrato de dados e permissões por academia/personal.

## 18. Checklist Final Página por Página

- [ ] A. Intro mostra presença premium real e não vaza idioma.
- [ ] B. Login/convite funciona em Safari/private mode e erros localizados.
- [ ] C. Consentimento persiste no backend e revogação limpa dados certos.
- [ ] D. Calibragem exige campos mínimos do Santo Graal.
- [ ] E. Home tem avatar limpo e fala curta/operacional.
- [ ] F. Chat usa contexto completo, sem fallback PT e sem parecer genérico.
- [ ] G. Treino respeita histórico, dor, local e mídia validada.
- [ ] H. GUTO Online adapta dor/troca/carga e leva à validação real.
- [ ] I. Dieta respeita país, restrições, intolerâncias e limites legais.
- [ ] J. Percurso usa validações protegidas e XP consistente.
- [ ] K. Arena usa contrato real e rankings consistentes.
- [ ] L. Configurações controlam todos os dados, idioma e privacidade real.
- [ ] M. Admin/coach passa testes e isola times/alunos/coaches.
- [ ] N. Memória tem expiração, confirmação, descarte e proatividade real.
- [ ] O. Idioma PT/EN/IT não vaza em nenhuma tela/erro/prompt.
- [ ] P. Avatar/assets/vídeos carregam limpos em Safari/Chrome.
- [ ] Q. Backend/API tem contratos protegidos e storage privado.
- [ ] R. Testes cobrem fluxo real sem mocks frágeis.
- [ ] S. Produção tem envs, Sentry, logs e privacidade prontos.

## 19. Screenshots Geradas

- `docs/audit-screenshots/2026-05-16/01-intro.png`
- `docs/audit-screenshots/2026-05-16/02-language.png`
- `docs/audit-screenshots/2026-05-16/03-login-en.png`
- `docs/audit-screenshots/2026-05-16/04-consent-en.png`
- `docs/audit-screenshots/2026-05-16/05-calibration-pt.png`
- `docs/audit-screenshots/2026-05-16/06-pact-pt.png`
- `docs/audit-screenshots/2026-05-16/07-home-chat.png`
- `docs/audit-screenshots/2026-05-16/08-missao.png`
- `docs/audit-screenshots/2026-05-16/09-guto-online.png`
- `docs/audit-screenshots/2026-05-16/10-dieta.png`
- `docs/audit-screenshots/2026-05-16/11-percurso.png`
- `docs/audit-screenshots/2026-05-16/12-evoluir.png`
- `docs/audit-screenshots/2026-05-16/13-arena.png`
- `docs/audit-screenshots/2026-05-16/14-settings.png`
- `docs/audit-screenshots/2026-05-16/15-admin-coach-desktop.png`

## 20. Veredito

O projeto **não está pronto para teste com usuários reais sem supervisão**.

Ele está pronto para uma rodada interna forte, página por página, usando este relatório como checklist. Para 3 usuários externos, eu resolveria primeiro os P0: testes backend, dieta/restrições, segurança das imagens de validação, onboarding/calibragem, GUTO Online/validação e memória/privacidade.
