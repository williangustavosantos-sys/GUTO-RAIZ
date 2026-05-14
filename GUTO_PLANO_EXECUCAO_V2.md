# GUTO — Plano de Execução V2

**Versão 2.0 — 13 de Maio de 2026**  
**Substitui:** `PLANO_EXECUCAO_GUTO.md` (versão 1.0)  
**Objetivo:** 5 usuários reais completando treino com GUTO ONLINE e voltando no dia seguinte

---

## Contexto

O plano V1 (PLANO_EXECUCAO_GUTO.md) propunha sprints para problemas que já foram resolvidos:
- ✅ Arena-store já tem Redis/Upstash
- ✅ ARENA_GROUP já é dinâmico (sem hardcode)
- ✅ GUTO ONLINE já tem persistência local versionada
- ✅ Warm-up de cache já existe no boot

O que mudou desde o V1: os problemas de infraestrutura foram resolvidos. O desafio agora é **validação e acabamento**, não construção.

---

## Estado atual

| Dimensão | Status |
|---|---|
| Infraestrutura | ✅ Redis, warm-up, persistência — tudo implementado |
| Funcionalidades | ✅ Onboarding, chat, treino, dieta, arena, evolução, coach, billing — tudo implementado |
| GUTO ONLINE engine | ✅ State machine, persistência, quick talk, context guard, undo — tudo implementado |
| Experiência real | ❌ Nenhum usuário testou o app completo em celular real |
| Acabamento visual/voz | ⚠️ Precisa validação e ajustes |
| Analytics | ❌ Não existe |
| Segurança em produção | ⚠️ Precisa confirmar JWT_SECRET e Redis ativos |

---

## Fase 1 — Validação de produção (P0)

**Objetivo:** Confirmar que a infraestrutura está realmente funcionando em produção.

### Tarefas

| # | Tarefa | Como validar | Tempo estimado |
|---|---|---|---|
| 1.1 | Confirmar JWT_SECRET real em produção | Verificar env vars no Render. Não pode ser `"dev-secret-change-in-production"` | 5 min |
| 1.2 | Confirmar Upstash Redis ativo | Fazer deploy → criar usuário → restart Render → verificar se dados persistem | 30 min |
| 1.3 | Confirmar teamId correto por usuário | Criar convite para Time X → registrar com convite → verificar se usuário está no Time correto | 30 min |
| 1.4 | Testar convite → login → acesso ativo | Fluxo completo de entrada de novo usuário | 1 hora |
| 1.5 | Testar loop completo end-to-end | Onboarding → missão → GUTO ONLINE → validação → XP → Arena → Percurso | 2 horas |

### Critério de conclusão da Fase 1
Todas as 5 tarefas passaram sem erros. Dados persistem após restart do Render.

---

## Fase 2 — Validação de experiência (P1)

**Objetivo:** O GUTO ONLINE funciona em celular real como experiência premium.

### Tarefas

| # | Tarefa | Como validar | Tempo estimado |
|---|---|---|---|
| 2.1 | Testar GUTO ONLINE em iPhone (Safari) | Sessão completa: briefing → warmup → exercícios → descanso → finalização | 2 horas |
| 2.2 | Testar GUTO ONLINE em Android (Chrome) | Mesmo fluxo acima | 2 horas |
| 2.3 | Validar voz do GUTO | Não pode usar voz feminina/genérica do navegador. Tem que ser voz do GUTO (voicepack ou TTS configurado) | 1 hora |
| 2.4 | Validar timing e naturalidade | Frases não podem parecer robóticas ou repetitivas. Pausas entre séries precisam ser naturais | 1 hora |
| 2.5 | Validar Quick Talk | Falar com GUTO durante treino → classificação local → resposta curta → volta ao treino | 1 hora |
| 2.6 | Validar pause/retomada | Pausar no meio → retomar → continuar de onde parou | 30 min |
| 2.7 | Validar dor → ajuste | Dizer "doeu" → exercício é removido/substituído → sessão continua | 30 min |
| 2.8 | Validar troca de exercício | Dizer "não tem esse equipamento" → alternativa é oferecida | 30 min |
| 2.9 | Validar descanso | Timer funciona → GUTO avisa quando acaba → próxima série começa | 30 min |
| 2.10 | Validar finalização | Sessão termina → XP é contabilizado → validação é possível | 30 min |
| 2.11 | Validar retomada de sessão em mobile | Fechar app → reabrir em <15min (auto), 15min-12h (confirmação), >12h (descarta) | 1 hora |
| 2.12 | Validar undo | Voltar série ou exercício sem quebrar o estado | 30 min |
| 2.13 | Validar fadiga → ajuste | Dizer "cansado" → carga reduz → sessão continua | 30 min |

### Critério de conclusão da Fase 2
Uma sessão completa de GUTO ONLINE funciona em celular real sem bugs, com voz do GUTO, timing natural e todas as interrupções (dor, troca, fadiga, quick talk, pause) funcionando.

---

## Fase 3 — Acabamento visual e de experiência (Gate 1 do Checkpoint)

**Objetivo:** O app parece pronto, não protótipo.

### Tarefas

| # | Tarefa | Critério | Tempo estimado |
|---|---|---|---|
| 3.1 | Alinhar botões | Nenhum botão desalinhado ou sobreposto em nenhuma tela | 2-3 horas |
| 3.2 | Validar idioma em todas as telas | ConsentScreen, onboarding, chat, missão — tudo no idioma selecionado | 2-3 horas |
| 3.3 | Corrigir nome no chat | Chat usa nome digitado pelo usuário, não nome do coach/convite | 1 hora |
| 3.4 | Garantir voz do GUTO em todos os fluxos | Nenhum fluxo usa voz feminina/genérica do navegador | 2-3 horas |
| 3.5 | Adicionar som/haptic em botões | Interações principais produzem feedback tátil/sonoro | 2-3 horas |
| 3.6 | Padronizar design entre abas | Todas as abas seguem o design system (glass/ice, cyan, navy) | 2-3 horas |
| 3.7 | Acabamento visual do GUTO ONLINE | Interface parece premium, não protótipo | 3-4 horas |

### Critério de conclusão da Fase 3
Gate 1 do `GUTO_OK_CHECKPOINT.md` aprovado. App parece produto, não protótipo.

---

## Fase 4 — Instrumentação (P2)

**Objetivo:** Saber o que os usuários estão fazendo (ou não fazendo).

### Tarefas

| # | Tarefa | Detalhe | Tempo estimado |
|---|---|---|---|
| 4.1 | Implementar analytics mínimo | Eventos: app_opened, onboarding_completed, workout_started, guto_online_started, guto_online_completed, workout_validated, xp_awarded, user_returned_next_day, session_abandoned | 4-6 horas |
| 4.2 | Dashboard simples | Contar eventos por dia/semana. Não precisa ser fancy, precisa ser legível | 2-3 horas |
| 4.3 | Calibrar penalidade para beta | Reduzir de -15% para -5% ou desabilitar durante beta | 30 min |

### Critério de conclusão da Fase 4
Toda ação importante do usuário gera um evento. É possível ver quantos usuários abriram o app, completaram treino e voltaram no dia seguinte.

---

## Fase 5 — Teste interno

**Objetivo:** 5 pessoas reais usando o app. Observar, não perguntar.

### Tarefas

| # | Tarefa | Detalhe | Tempo estimado |
|---|---|---|---|
| 5.1 | Recrutar 5 testers | Amigos honestos que vão dizer o que acham | — |
| 5.2 | Criar convites para os testers | Via painel admin | 30 min |
| 5.3 | Observar uso real | Não intervir. Anotar onde travam, onde desistem, o que perguntam | 1 semana |
| 5.4 | Corrigir problemas encontrados | Semana dedicada a fixes, não features | 1 semana |
| 5.5 | Validar Gate 4 do checkpoint | Todos os gates do `GUTO_OK_CHECKPOINT.md` aprovados | — |

### Critério de conclusão da Fase 5
5 pessoas completaram pelo menos 1 treino com GUTO ONLINE. Pelo menos 3 voltaram no dia seguinte. Todos os gates do checkpoint aprovados.

---

## Sequência de execução

```
Semana 1:  Fase 1 — Validação de produção (P0)
Semana 2-3: Fase 2 — Validação de experiência (P1)
Semana 3-4: Fase 3 — Acabamento visual (Gate 1)
Semana 4:  Fase 4 — Instrumentação (P2)
Semana 5-6: Fase 5 — Teste interno com 5 pessoas
Semana 7-8: Abrir para 20 duplas (beta)
```

---

## O que NÃO fazer

| Feature | Motivo |
|---|---|
| Espanhol | Beta é PT-BR |
| Billing refinado | Beta é manual/gratuito |
| Coach panel avançado | Funciona o suficiente |
| IndexedDB | localStorage funciona para MVP |
| Geofence/GPS | Não é crítico para validar a tese |
| Times de amigos (v2.0) | Feature futura |
| Rede social (v3.0) | Visão distante |
| Feature nova qualquer | Foco em validar, não expandir |

---

## Custo projetado

| Serviço | Custo/mês |
|---|---|
| Render (backend) | ~R$40 ($7) |
| Vercel (frontend) | R$0 |
| Upstash Redis | R$0 (free tier) |
| Gemini API | R$0 (free tier) |
| Google Cloud TTS | ~R$0.50 |
| **Total** | **~R$40-45/mês** |

---

## Métrica que define sucesso

> **5 usuários reais completando treino com GUTO ONLINE e voltando no dia seguinte.**

Depois disso: 20 duplas. 30 dias. Quantas ainda estão ativas?

---

_Documento V2 — 13 de Maio 2026. Substitui PLANO_EXECUCAO_GUTO.md (V1)._