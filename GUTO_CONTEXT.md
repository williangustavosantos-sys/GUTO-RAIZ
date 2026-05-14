# GUTO — Contexto Institucional

**Este arquivo é a fonte da verdade sobre o GUTO.**  
Qualquer agente de IA, desenvolvedor ou colaborador deve ler este arquivo ANTES de trabalhar no projeto.

**Última atualização:** 13 de Maio de 2026  
**Validado contra código em:** 13 de Maio de 2026

---

## 1. O que é o GUTO

O GUTO é um **companheiro ativo digital** — um personagem com identidade própria que vive dentro do celular do usuário, entende sua rotina, guarda memória, conduz sua vida ativa e espera que ele apareça.

**O GUTO NÃO é:**
- App fitness comum
- Chatbot genérico
- Personal digital
- Formulário de treino

**A tese central:**
O problema do fitness digital não é falta de informação. É falta de presença, cobrança, continuidade emocional e alguém conduzindo o usuário quando ele está cansado.

**O que o GUTO entrega:**
- Presença diária
- Cobrança real
- Adaptação contextual
- Vínculo emocional (dupla GUTO & usuário)
- Treino guiado por voz (GUTO ONLINE)
- Validação de presença
- Evolução do avatar como consequência de consistência

**O que o GUTO NÃO entrega:**
- Mais conteúdo fitness
- Prescrição médica ou nutricional
- Configuração de personalidade (o GUTO é quem ele é)
- Lista de exercícios sem contexto

---

## 2. Filosofia do GUTO (nunca muda)

1. **O GUTO não é configurável.** Ele tem personalidade própria. Fala como melhor amigo — direto sem ser grosso, parceiro sem passar a mão na cabeça.

2. **O GUTO prefere morrer a ser ignorado.** Se o usuário some, o avatar regride, apaga, some. Não manda notificação implorando. Mas quando o usuário volta, o GUTO está lá.

3. **A vitória nem sempre é o treino.** Alguns dias a maior conquista é uma conversa. O GUTO pensa no longo prazo.

---

## 3. Arquitetura real do projeto

### Frontend
- **Local:** `/Users/williandossantos/GUTOO/guto-app-v0`
- **Stack:** Next.js 16 / React 19 / TypeScript / Tailwind 4
- **Comando local:** `npm run dev` (porta 3000)
- **Typecheck:** `npx tsc --noEmit`
- **Deploy:** Vercel

### Backend
- **Local:** `/Users/williandossantos/GUTOO/guto-backend`
- **Stack:** Node.js / TypeScript / Express
- **Comando local:** `npm run dev` (porta 3001)
- **Typecheck:** `npx tsc --noEmit`
- **Deploy:** Render (Starter $7/mês)
- **Persistência:** Upstash Redis (free tier) + fallback em arquivo
- **IA:** Gemini Flash (chat + exceptions), OpenAI Whisper (speech-to-text), Google Cloud TTS (voicepack)

### Estrutura de dados
- 4 stores com Redis: user-access-store, team-store, invite-store, arena-store
- Memória do usuário: GutoMemory (userId, nome, idioma, XP, streak, treinos, dieta, calibragem, etc.)
- Sessão GUTO ONLINE: localStorage versionado com janelas de retomada

---

## 4. Estado atual do produto

**Status: EM DESENVOLVIMENTO INTERNO** — ver `GUTO_OK_CHECKPOINT.md` para gates de prontidão.

### O que está implementado e funcional

| Feature | Status | Fonte |
|---|---|---|
| Onboarding completo (9 stages) | ✅ Funcional | Código validado |
| 6 abas (GUTO, MISSÃO, DIETA, ARENA, EVOLUIR, PERCURSO) | ✅ Funcional | Código validado |
| Chat com GUTO (Gemini + memória) | ✅ Funcional | Código validado |
| GUTO ONLINE engine local | ✅ Funcional | Código validado |
| GUTO ONLINE persistência (localStorage versionado) | ✅ Funcional | Código validado |
| GUTO ONLINE Quick Talk + Context Guard | ✅ Funcional | Código validado |
| GUTO ONLINE Undo | ✅ Funcional | Código validado |
| Arena (XP, ranking, streak) | ✅ Funcional | Código validado |
| Arena-store com Redis/Upstash | ✅ Funcional | Código validado |
| Evolução (baby → teen → adult → elite) | ✅ Funcional | Código validado |
| Validação de treino (câmera + voz) | ✅ Implementado | Código validado |
| Dieta com macros | ✅ Funcional | Código validado |
| Painel Admin/Coach | ✅ Funcional | Código validado |
| Billing/Stripe | ✅ Funcional | Código validado |
| Push notifications (Web Push) | ✅ Funcional | Código validado |
| 3 idiomas (PT-BR, EN-US, IT-IT) | ✅ Funcional | Código validado |
| Convite/invite | ✅ Funcional | Código validado |
| Consentimento/privacidade (GDPR) | ✅ Funcional | Código validado |
| Proatividade (API) | ✅ Implementado | Código validado |
| Warm-up de cache no boot | ✅ Funcional | Código validado |
| ARENA_GROUP dinâmico (sem hardcode) | ✅ Funcional | Código validado |

### O que é parcial ou precisa de validação

| Item | Status | O que falta |
|---|---|---|
| Voz do GUTO | ⚠️ Parcial | Voicepack existe mas precisa validação de qualidade em mobile real |
| IA contextual no GUTO ONLINE | ⚠️ Parcial | Endpoint de exceptions existe, fallbacks locais existem, mas não testado em condição real |
| Proatividade calibrada | ⚠️ Parcial | API existe, mas timing e frequência não testados com usuários reais |
| Validação de treino em mobile | ⚠️ Não testado | Precisa testar câmera + voz em Safari e Chrome Android |
| Analytics | ❌ Não existe | Sem camada de analytics instrumentada |
| Testes com usuário real | ❌ Zero | Nenhum usuário externo testou o app |

### O que NÃO existe (não confundir com conceito)

| Item | Realidade |
|---|---|
| Espanhol | Não está no código. São 3 idiomas: PT-BR, EN-US, IT-IT |
| 5 estágios de evolução | São 4: baby, teen, adult, elite |
| Geofence/GPS na validação | Não existe no código |
| IndexedDB no GUTO ONLINE | Usa localStorage versionado (funciona para MVP) |
| Testes automatizados no frontend | Não existe suite |
| Métricas de retenção reais | Não existe |

---

## 5. Fluxos que não podem quebrar

### Onboarding
```
Intro → Idioma → Convite/Login → Consentimento → Naming → Calibragem → Pacto → Sistema
```

### Chat
```
Mensagem do usuário → backend /guto → Gemini com memória → resposta curta do GUTO → atualização de memória quando necessário
```

### Treino (loop principal)
```
Calibragem + histórico → GUTO monta treino → usuário executa (solo ou GUTO ONLINE) → validação → XP → Arena → Percurso
```

### GUTO ONLINE (sessão guiada)
```
Briefing → Warmup → Executing_set → Rest → Next exercise → ... → Finished
```
Interrupções possíveis: dor, troca, fadiga, quick talk, pause.  
Recuperação: localStorage versionado com janelas de retomada.

### Coach/Admin
```
Admin/Coach cria aluno → gera convite → aluno ativa → onboarding → GUTO cria memória → coach pode editar treino/dieta → aluno valida → XP/Arena/Percurso atualizam
```

---

## 6. Identidade visual do GUTO

- Fundo branco futurista/cápsula
- Glass/ice
- Cyan como cor primária
- Navy como cor de profundidade
- Botões grandes touch-first
- Visual premium, não formulário genérico
- Avatar: robô pequeno com dois olhos grandes azuis
- 4 estágios visuais: baby, teen, adult, elite
- 4 emoções por estágio: default, alert, critical, reward

---

## 7. Prioridades atuais

### P0 — Validação de produção
- Confirmar JWT_SECRET real em produção
- Confirmar Upstash Redis configurado e persistindo Arena após restart
- Confirmar teamId correto por usuário beta
- Testar convite → login → acesso ativo
- Testar loop completo: onboarding → missão → GUTO ONLINE → validação → XP → Arena → Percurso

### P1 — Validação de experiência
- Testar GUTO ONLINE em celular real
- Validar voz, timing, quick talk, pause, dor, troca, descanso, finalização
- Validar retomada de sessão em mobile (15min, 15min-12h, >12h)
- Validar Safari mobile e Chrome Android

### P2 — Instrumentação
- Analytics mínimo: app_opened, onboarding_completed, workout_started, guto_online_started, guto_online_completed, workout_validated, xp_awarded, user_returned_next_day, session_abandoned

### Objetivo das próximas semanas
**5 usuários reais completando treino com GUTO ONLINE e voltando no dia seguinte.**

---

## 8. O que NÃO fazer agora

- ❌ Adicionar feature nova
- ❌ Refinar billing/Stripe
- ❌ Expandir dieta/nutrição
- ❌ Expandir painel coach
- ❌ Adicionar espanhol
- ❌ Migrar para IndexedDB
- ❌ Trabalhar em geofence/GPS
- ❌ Trabalhar em Times de amigos (v2.0)
- ❌ Trabalhar em Rede social (v3.0)
- ❌ Fazer redesign amplo sem pedido explícito
- ❌ Hardcodar português
- ❌ Remover persistência
- ❌ Quebrar mobile/Safari
- ❌ Alterar deploy sem autorização

---

## 9. Métricas que importam

**A métrica que define se o GUTO funcionou:**
> Quantas duplas ainda estão ativas depois de 30 dias?

**Métricas secundárias:**
- Sessões GUTO ONLINE iniciadas vs. completadas
- Média de XP por usuário na semana 2 vs. semana 4
- Quantas vezes o avatar "morreu" (mecânica Tamagotchi)
- Quantos convites os beta users geraram espontaneamente
- Taxa de retorno no dia seguinte (user_returned_next_day)

---

## 10. Modelo de negócio

- **B2C:** Usuário individual com plano mensal/anual
- **B2B2C:** Coach/academia paga plano mensal, traz alunos
- **Planos:** Start (2 coaches, 20 alunos), Pro (4 coaches, 50 alunos), Elite (6 coaches, 70 alunos), Custom
- **Beta:** 20 duplas, acesso antecipado, gratuito

---

## 11. Reframing estratégico

O GUTO NÃO compete com apps que entregam treino.  
O GUTO compete contra o abandono.

Fitness é o mercado inicial.  
A tecnologia real do GUTO é: **presença comportamental operacionalizada em software.**

---

## 12. Análise executiva (CTO Review — Maio 2026)

### O que o projeto já tem de forte
- **Identidade de produto clara e diferenciada** — presença > conteúdo não é marketing, é tese real
- **Onboarding completo e funcional** — 9 stages, fluxo sem quebra, pacto com hold de 2s
- **GUTO ONLINE com engine local sério** — state machine, persistência, quick talk, context guard, undo, retomada com janelas de tempo
- **Sistema de evolução ponta-a-ponta** — XP → 4 estágios → avatar com vídeo → emoções → penalidade por falta
- **Chat com IA funcional** — Gemini, system prompt de 1200 linhas, memória de contexto, evals com promptfoo
- **Infraestrutura de persistência resiliente** — 4 stores com Redis + fallback em arquivo + warm-up no boot
- **Coaching B2B2C estruturado** — painel com CRUD completo, edição de treino/dieta, times isolados
- **GDPR compliant desde o início** — consentimento, privacidade, exclusão de dados

### O que está confuso ou perigoso
- **server.ts com 4796 linhas** — monolito que concentra tudo. Bug em dieta pode derrubar chat
- **Zero testes automatizados no frontend** — mudanças são validadas manualmente ou não são
- **Coach panel com 3723 linhas em um componente** — impossível manter sem refatorar
- **Voz do GUTO não validada em mobile real** — se soar robótica, o usuário sente "feature", não "companhia"
- **Validação de treino não testada em Safari/Android** — câmera + voz pode falhar silenciosamente

### O que está supercomplexo cedo demais
- **Billing/Stripe** para beta gratuito de 20 pessoas
- **Coach panel completo** antes do GUTO ONLINE estar validado
- **Arena com 3 camadas de competição** para 20 beta testers
- **3 idiomas** quando beta é PT-BR
- **Dieta automatizada completa** quando o diferencial é presença e treino

### O que realmente importa agora
- **GUTO ONLINE funcionando em celular real** — é o núcleo da tese
- **Validação de produção** (JWT_SECRET, Redis, teamId)
- **Fluxo completo sem quebrar**: onboarding → treino → validação → XP
- **5 pessoas reais usando e voltando no dia seguinte**

### O que pode ser adiado
- Espanhol, billing refinado, coach panel avançado, IndexedDB, geofence, Times de amigos (v2.0), Rede social (v3.0), qualquer feature nova

### Qual é o MVP REAL
Provar que presença ativa digital gera mais aderência que conteúdo passivo. Loop mínimo: onboarding → GUTO monta treino → usuário faz treino guiado por voz → valida → XP sobe → se falta, GUTO cobra → se volta, GUTO adapta → loop se repete.

### O que falta para testar com usuários reais
1. GUTO ONLINE em condição real (ninguém completou treino inteiro guiado por voz ainda?)
2. Validação de treino em Safari mobile e Chrome Android
3. Recuperação de sessão em mobile (fechar e reabrir)
4. Penalidade por falta em produção (calibrada para beta)
5. Performance em 3G/4G
6. Onboarding com alguém que nunca viu o app
7. Fluxo end-to-end sem intervenção manual

### Riscos arquiteturais
- R1: Monolito de 4800 linhas sem proteção de regressão
- R2: Sem testes automatizados
- R3: Google TTS como dependência (se cai, GUTO fica mudo)
- R4: Acoplamento frontend-backend sem contract formal

### Riscos de produto
- P1: GUTO ONLINE é a tese mas não está validado em mobile real
- P2: Validação de treino pode ser frustrante (câmera + voz = atrito)
- P3: Penalidade -15% XP pode afastar beta testers
- P4: Sem métricas de uso instrumentadas (cego)
- P5: Feature creep matando o foco

### Prioridade das próximas semanas
1. Validação de produção (JWT_SECRET, Redis, teamId, convite/login)
2. GUTO ONLINE em celular real (voz, timing, quick talk, dor, troca, descanso, finalização)
3. Acabamento visual (Gate 1 do checkpoint)
4. Analytics mínimo
5. 5 testers internos

### Direção clara
Parar de construir features. Começar a provar a tese. O GUTO precisa funcionar como "parceiro que treina com você por voz" para 5 pessoas reais.

### O que parar de fazer
Adicionar features, refinar billing, expandir dieta/coach/espanhol, migrar IndexedDB, geofence, v2.0/v3.0

### O que focar imediatamente
GUTO ONLINE funcionando de ponta a ponta em celular real, persistência validada, segurança básica, fluxo completo sem quebrar, 5 pessoas reais usando

---

## Histórico de atualizações

| Data | O que mudou |
|---|---|
| 13/05/2026 | Criação inicial. Validado contra código real do projeto. |
| 13/05/2026 | Adicionada seção 12: Análise executiva CTO Review completa |
