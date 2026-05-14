# GUTO — Checkpoint de Prontidão para Teste

**Última atualização:** 13 de Maio de 2026  
**Estado atual:** EM DESENVOLVIMENTO INTERNO — nenhum gate passou ainda

---

## Regra fundamental

Enquanto qualquer gate abaixo falhar, o app está em **desenvolvimento interno**, não em beta.  
Nenhum usuário externo deve receber convite enquanto todos os 4 gates não estiverem aprovados.

---

## Gate 1 — Experiência básica não quebrada

O app precisa abrir, fluir e parecer pronto sem que o usuário precise ignorar problemas visuais ou funcionais.

### Critérios

- [ ] App abre sem crash em Safari mobile e Chrome Android
- [ ] Onboarding flui sem travar de intro até sistema
- [ ] Idioma selecionado é respeitado em TODAS as telas (incluindo ConsentScreen)
- [ ] Nome da dupla usa o nome digitado pelo usuário, não o nome do coach/convite
- [ ] Nenhum botão desalinhado ou sobreposto
- [ ] Nenhuma aba com design inconsistente
- [ ] Botões internos têm som/haptic feedback
- [ ] Nenhuma tela com texto cortado, overflow ou layout quebrado em mobile

### Bloqueadores automáticos (qualquer um = Gate 1 falha)

| Bloqueador | Descrição |
|---|---|
| Botões desalinhados | Qualquer botão fora do alinhamento visual do sistema |
| Idioma errado após seleção | Tela mostra idioma diferente do selecionado |
| ConsentScreen sempre em PT | Consentimento aparece em português independente do idioma escolhido |
| Nome do coach no chat | Chat usa nome do coach/convite em vez do nome digitado pelo usuário |
| Voz feminina/genérica do navegador | Qualquer fluxo usa voz padrão do navegador em vez da voz do GUTO |
| Botões sem som/haptic | Interações principais não produzem feedback tátil/sonoro |
| Abas com design inconsistente | Qualquer aba visualmente desconectada do design system |
| GUTO ONLINE visualmente ruim | Interface do GUTO ONLINE parece protótipo, não produto |

---

## Gate 2 — Fluxo principal completo

O loop central do produto precisa funcionar de ponta a ponta sem intervenção manual.

### Critérios

- [ ] Convite → login → onboarding → calibragem → pacto → sistema (fluxo completo)
- [ ] Treino do dia aparece com exercícios, séries, reps, carga, descanso, cue e vídeo
- [ ] Chat com GUTO funciona e responde no idioma correto
- [ ] Validação de treino funciona (câmera + voz "TREINO FEITO GUTO")
- [ ] XP sobe após validação
- [ ] Streak conta corretamente
- [ ] Arena atualiza com novo XP e posição
- [ ] Percurso registra validação com foto e dados
- [ ] Dieta aparece com macros, refeições e alimentos
- [ ] Evolução do avatar reflete XP corretamente (baby → teen → adult → elite)
- [ ] Push notification chega quando o GUTO é proativo
- [ ] Settings permite alterar idioma, nome, dados físicos, restrições e privacidade

---

## Gate 3 — GUTO ONLINE apresentável

O diferencial do produto precisa ser funcional, natural e visualmente premium.

### Critérios

- [ ] Sessão inicia com voz do GUTO (não voz feminina/genérica do navegador)
- [ ] Exercício é conduzido série por série com timing natural
- [ ] Quick Talk funciona sem virar chat livre (Context Guard seguro)
- [ ] Pause e retomada funcionam corretamente
- [ ] Dor → ajuste funciona (exercício é removido/substituído)
- [ ] Troca de exercício funciona (equipamento ocupado, alternativa)
- [ ] Descanso é cronometrado e o GUTO avisa quando acaba
- [ ] Finalização é clara e satisfatória
- [ ] Visual é premium (glass/ice, cyan, navy, botões grandes touch-first)
- [ ] Retomada de sessão funciona em mobile:
  - [ ] Reabrir em até 15 min: retoma automático
  - [ ] Reabrir entre 15 min e 12h: pede confirmação
  - [ ] Reabrir após 12h: descarta/arquiva sessão antiga
- [ ] Undo funciona (voltar série ou exercício)
- [ ] Fadiga → ajuste funciona (reduz carga, mantém forma)

---

## Gate 4 — Pronto para teste externo

Infraestrutura e segurança precisam estar em nível de produção, mesmo que para poucos usuários.

### Critérios

- [ ] Gate 1, 2 e 3 aprovados
- [ ] JWT_SECRET real em produção (não o default `"dev-secret-change-in-production"`)
- [ ] Upstash Redis configurado e persistindo Arena após restart/deploy do Render
- [ ] teamId correto por usuário (não vazamento entre Times)
- [ ] Analytics mínimo ativo com os eventos:
  - [ ] `app_opened`
  - [ ] `onboarding_completed`
  - [ ] `workout_started`
  - [ ] `guto_online_started`
  - [ ] `guto_online_completed`
  - [ ] `workout_validated`
  - [ ] `xp_awarded`
  - [ ] `user_returned_next_day`
  - [ ] `session_abandoned`
- [ ] Penalidade de falta calibrada para beta (reduzida ou desabilitada)
- [ ] Safari mobile testado e funcionando
- [ ] Chrome Android testado e funcionando
- [ ] Convite → login → acesso ativo testado com usuário real
- [ ] Processo de reset/correção manual de dados documentado

---

## Registro de validação

| Data | Gate 1 | Gate 2 | Gate 3 | Gate 4 | Validado por |
|---|---|---|---|---|---|
| 13/05/2026 | ❌ | ❌ | ❌ | ❌ | — |

> Preencher esta tabela toda vez que uma validação formal for feita. Marcar ✅ apenas quando TODOS os critérios do gate passarem.

---

## Lembrete

O objetivo das próximas semanas é: **5 usuários reais completando treino com GUTO ONLINE e voltando no dia seguinte.**

Mas isso só acontece depois que todos os 4 gates passarem. Antes disso, é desenvolvimento interno.