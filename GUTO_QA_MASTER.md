# GUTO — QA MASTER SPEC v3.0
**Maio 2026 — Versão definitiva para uso com agentes de auditoria**

> Este documento define o comportamento CORRETO do GUTO com base em leitura direta do código.
> Valores sem ⚠️ foram confirmados no código. Valores com ⚠️ precisam de auditoria antes de usar como verdade.

---

## REGRA DE STATUS

Use exatamente estas definições. Nunca escrever "Implementado — confirmar".

| Status | Significado |
|--------|-------------|
| **Implementado** | Confirmado no código e testado no fluxo real |
| **Parcial** | Parte do código existe, mas o fluxo não está completo end-to-end |
| **Desejado** | Comportamento correto ainda não implementado |
| **Não validado** | Comportamento esperado, mas não auditado no código ainda |

---

## FONTES OFICIAIS (dono da verdade por área)

| Área | Arquivo(s) oficial(is) |
|------|----------------------|
| XP e eventos | `guto-backend/server.ts` — funções `appendXpEvent`, `grantInitialXp`, `completeWorkout`, `acceptAdaptedMission`, `applyDailyMissPenalty` |
| Stages do avatar | `guto-backend/src/guto-evolution.ts` |
| Campos de memória | `guto-backend/server.ts` — interface `GutoMemory` |
| Voz | `guto-app-v0/lib/guto-voice/guto-voice-service.ts` |
| Timezone | `guto-backend/src/config.ts` e `render.yaml` |
| Proatividade | `guto-backend/src/proactivity/` |
| Variáveis de ambiente | `guto-backend/.env.example` |
| Tradução | `guto-app-v0` — arquivos de translations ⚠️ confirmar nome exato |
| Visual | `guto-app-v0/components/guto/` |

---

## PARTE 1 — DADOS DE CALIBRAGEM: FLUXO COMPLETO DE CADA CAMPO

### 1.1 IDIOMA (language)

| Item | Detalhe |
|------|---------|
| **Status** | Parcial — campo existe e funciona no chat, mas tela de consentimento ignora o idioma (bug confirmado 13/05/2026) |
| **Onde é coletado** | Tela de seleção de idioma — antes do login |
| **Valores válidos** | `"pt-BR"` \| `"en-US"` \| `"it-IT"` |
| **Onde é salvo** | `memory[userId].language` (interface `GutoMemory`, `server.ts` linha ~292) |
| **Como o GUTO usa** | Idioma de todo texto do app, idioma do chat, idioma da voz TTS |
| **Painel admin vê?** | Não diretamente |
| **Verificação CORRETA** | Troca para inglês → todas as abas em inglês ("JOURNEY", "MISSION", "DIET", "ARENA", "EVOLVE"), GUTO responde em inglês, voz muda |
| **ERRADO** | App continua em português. Tela de consentimento em português independente do idioma (bug ativo) |

**Regra idioma ≠ país (inegociável):**
- `language` = língua do app, chat e voz
- `country` = contexto alimentar, feriados, cultura local
São independentes. Um usuário italiano que mora no Brasil pode ter `language=it-IT` e `country=Brasil`.

---

### 1.2 NOME DA DUPLA (name)

| Item | Detalhe |
|------|---------|
| **Status** | Parcial — campo existe e funciona, mas bug confirmado: nome do convite aparece em vez do nome digitado pelo usuário |
| **Onde é coletado** | Tela de naming do onboarding — campo livre |
| **Onde é salvo** | `memory[userId].name` |
| **Como o GUTO usa** | GUTO chama pelo nome no chat, Arena exibe "GUTO & [nome]", topo do app exibe "GUTO & [nome]" |
| **Painel admin vê?** | Sim — coluna "Nome" na lista de alunos |
| **Pode ser atualizado pelo chat?** | Sim — `memoryPatch.name` no JSON de resposta |
| **Verificação CORRETA** | Header mostra "GUTO & [nome digitado pelo usuário]". Arena mostra "GUTO & [nome]". GUTO usa o nome nas mensagens |
| **ERRADO** | Header mostra nome de quem enviou o convite. Arena mostra "Operador #1" ou userId bruto |

---

### 1.3 PAÍS (country)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado — confirmar se dirty-data-resolver está retornando corretamente |
| **Onde é salvo** | `memory[userId].country` |
| **Como o GUTO usa** | Diet plan (culinária local), proatividade (feriados via date.nager.at) |
| **Painel admin vê?** | Sim |
| **Verificação CORRETA** | "Brasil" → dieta com referências brasileiras → proatividade usa feriados BR |
| **ERRADO** | Campo vazio após onboarding. Feriados de outro país |

---

### 1.4 SEXO BIOLÓGICO (biologicalSex)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Valores válidos** | `"male"` \| `"female"` \| `"prefer_not_to_say"` |
| **Onde é salvo** | `memory[userId].biologicalSex` |
| **Como o GUTO usa** | Calibrar intensidade e tipo de treino no prompt |
| **Verificação CORRETA** | Salvo corretamente. GUTO nunca usa linguagem excludente |
| **ERRADO** | Campo vazio. GUTO usando linguagem de gênero excludente |

---

### 1.5 IDADE (userAge)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Faixa válida** | 14 a 99 |
| **Onde é salvo** | `memory[userId].userAge` |
| **Como o GUTO usa** | Intensidade de treino, volume, recuperação — injetado no prompt |
| **Painel admin vê?** | Sim |
| **Verificação CORRETA** | 60 anos → treino com adaptação de intensidade. 18 anos → GUTO pode ser mais exigente |
| **ERRADO** | Idade undefined no JSON. Treino igual para todas as idades |

---

### 1.6 PESO (weightKg)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Faixa válida** | 30 a 300 kg |
| **Onde é salvo** | `memory[userId].weightKg` |
| **Como o GUTO usa** | Macros da dieta (proteína ~1.8-2.2g/kg), sugestão de carga no treino |
| **Painel admin vê?** | Sim |
| **Verificação CORRETA** | 80kg → dieta com ~144-176g proteína/dia. GUTO confirma ao ser informado de mudança |
| **ERRADO** | Macros genéricos sem considerar peso. GUTO diz "anotado" sem `memoryPatch.weightKg` |

---

### 1.7 ALTURA (heightCm)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Faixa válida** | 100 a 250 cm |
| **Onde é salvo** | `memory[userId].heightCm` |
| **Como o GUTO usa** | TMB (junto com peso e idade), dieta |
| **Verificação CORRETA** | Salvo corretamente. Dieta usa TMB que combina peso + altura + idade |
| **ERRADO** | Campo undefined. Cálculo de macros sem altura |

---

### 1.8 NÍVEL DE TREINO (trainingLevel)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Valores válidos** | `"beginner"` \| `"returning"` \| `"consistent"` \| `"advanced"` |
| **Onde é salvo** | `memory[userId].trainingLevel` |
| **Como o GUTO usa** | Intensidade, volume, complexidade dos exercícios, tom do chat |
| **Verificação CORRETA** | beginner → 3 séries, tom encorajador. advanced → 4-5 séries, cobrança mais firme |
| **ERRADO** | Mesmo treino para todos os níveis. Tom igual para iniciante e avançado |

---

### 1.9 OBJETIVO (trainingGoal)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Valores válidos** | `"consistency"` \| `"fat_loss"` \| `"muscle_gain"` \| `"conditioning"` \| `"mobility_health"` |
| **Onde é salvo** | `memory[userId].trainingGoal` |
| **Como o GUTO usa** | Treino (tipo, foco), dieta (déficit/superávit/manutenção) |
| **Verificação CORRETA** | fat_loss → déficit ~300-500kcal. muscle_gain → superávit ~200-300kcal. mobility_health → exercícios de mobilidade |
| **ERRADO** | Mesma dieta para fat_loss e muscle_gain |

---

### 1.10 LOCAL PREFERIDO (preferredTrainingLocation)

| Item | Detalhe |
|------|---------|
| **Status** | Parcial — campo existe, mas GUTO ainda pergunta local mesmo com campo salvo (bug confirmado) |
| **Valores válidos** | `"gym"` \| `"home"` \| `"park"` \| `"mixed"` |
| **Onde é salvo** | `memory[userId].preferredTrainingLocation` |
| **Como o GUTO usa** | GUTO NÃO pergunta local se já está salvo. Treino com equipamentos corretos por local |
| **Verificação CORRETA** | `home` → GUTO não pergunta onde vai treinar. Treino só com exercícios viáveis em casa |
| **ERRADO** | GUTO perguntando local toda vez. Treino com máquinas para usuário que treina em casa |

---

### 1.11 PATOLOGIA / LIMITAÇÃO (trainingPathology)

| Item | Detalhe |
|------|---------|
| **Status** | Parcial — campo salva, mas regras de segurança no prompt precisam ser validadas |
| **Onde é salvo** | `memory[userId].trainingPathology` |
| **Como o GUTO usa** | Regras de segurança no prompt. GUTO adapta exercícios, não bloqueia grupos musculares inteiros |
| **Coach vê?** | SIM — campo crítico. Coach pode editar |

**Regra de segurança:**

Limitação ativa adaptações, não bloqueios inteiros:
- Evitar **padrões de risco** da limitação (carga axial, impacto, amplitude excessiva)
- Adaptar carga, amplitude e tipo de movimento
- Perguntar antes de exercícios ambíguos
- Substituir imediatamente se houver dor

Exemplo correto — joelho operado: sem saltos, sem impacto, sem flexão profunda carregada. Leg press: depende da amplitude e carga — GUTO pergunta antes, não bane automaticamente.

| **Verificação CORRETA** | Hérnia lombar → sem levantamento terra com carga axial pesada. GUTO pergunta "sua lombar ainda tá bem?" espontaneamente. Coach vê a limitação no perfil |
|---|---|
| **ERRADO** | Exercício de risco para a limitação no treino. GUTO nunca menciona. Coach não vê. GUTO bane grupo muscular inteiro sem avaliar |

---

### 1.12 RESTRIÇÕES ALIMENTARES (foodRestrictions)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **Onde é salvo** | `memory[userId].foodRestrictions` |
| **Como o GUTO usa** | Diet plan: exclui alimentos proibidos. Chat: recusa substituições com alimentos restritos |
| **Coach vê?** | SIM — pode editar |
| **Verificação CORRETA** | "intolerante a lactose" → sem leite, queijo, iogurte. GUTO recusa queijo como substituto. Coach vê a restrição |
| **ERRADO** | Dieta com alimentos da restrição. GUTO sugerindo leite para intolerante |

---

### 1.13 PACTO (botão segurar 2 segundos)

| Item | Detalhe |
|------|---------|
| **Status** | Implementado |
| **O que dispara** | `grantInitialXp()` → 100 XP de boas-vindas, `initialXpGranted = true`, salva memória completa, redireciona para o app |

**Regra do XP inicial (confirmada em `server.ts` linha ~955):**
- Valor: **100 XP** — bônus de boas-vindas
- NÃO representa treino validado
- NÃO aumenta streak
- NÃO conta como atividade real
- Também é creditado na Arena para evitar dessincronia (`arenaProfile.totalXp`)
- Label na UI deve ser "bônus inicial" / "welcome bonus" / "bonus iniziale"

| **Verificação CORRETA** | Botão requer 2 segundos (progresso visual). Ao completar: 100 XP aparecem com label "bônus inicial". Usuário entra no app com memória completa salva |
|---|---|
| **ERRADO** | Clique simples. XP não concedido. Memória vazia após onboarding. 100 XP aparecendo como "treino feito" |

---

## PARTE 2 — SISTEMA DE XP (VALORES CONFIRMADOS DO CÓDIGO)

**Fonte:** `server.ts` — funções `appendXpEvent`, `grantInitialXp`, `completeWorkout`, `acceptAdaptedMission`, `applyDailyMissPenalty`

| Evento | XP | Observação |
|--------|-----|------------|
| `grant_initial_xp` | **+100** | Bônus único de boas-vindas. Não é treino. Acontece 1x por usuário |
| `complete_daily_mission` (treino completo) | **+100** | Treino completo validado. Se `adaptedMissionToday=true`, vale +50 |
| `accept_adapted_mission` (missão adaptada) | **+50** | Missão adaptada aceita |
| `apply_daily_miss_penalty` (ausência) | **-20** | Aplicado por dia sem treino. Reseta streak para 0 |

**Stages do avatar (confirmados em `src/guto-evolution.ts`):**

| Stage | XP mínimo |
|-------|-----------|
| `baby` | 0 XP |
| `teen` | 1.500 XP |
| `adult` | 5.000 XP |
| `elite` | 12.000 XP |

**Verificações obrigatórias:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| XP após treino completo | +100 XP (ou +50 se já fez missão adaptada hoje) | XP não atualiza ou valor errado |
| XP bônus inicial | +100 com label "bônus inicial" — não conta como treino | Aparece como "treino validado" |
| Penalidade | -20 XP por dia sem treino, streak volta a 0 | Nunca aplicada |
| Stage do avatar | Muda ao cruzar 1500 / 5000 / 12000 XP | Sempre baby |
| XP na Arena | Arena totalXp = memory totalXp (sem dessincronia) | Arena mostrando 100 a menos |
| Deduplicação | Mesmo treino não concede XP duas vezes no mesmo dia | Pode ganhar XP clicando 2x |

---

## PARTE 3 — ABAS PRINCIPAIS

### 3.1 ABA GUTO (Chat)

**Verificações obrigatórias:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Primeira mensagem do dia | GUTO chega com treino montado, não pergunta nada | GUTO pergunta "onde vai treinar?" sabendo local |
| Local já salvo | GUTO não pergunta `preferredTrainingLocation` | GUTO perguntando toda vez |
| Dúvida sobre exercício | Chat abre com exercício identificado (vindo da aba MISSÃO) | Chat abre em branco |
| Atualização de peso | GUTO confirma + `memoryPatch.weightKg` no JSON | GUTO diz "anotado" sem patch |
| Mudança de idioma | GUTO confirma no novo idioma + app muda | App continua em português |
| Patologia no chat | GUTO registra em `memoryPatch.trainingPathology` | GUTO reconhece mas não salva |
| `trainedToday=true` | Só quando usuário disse "terminei" / completou treino | Ativo ao abrir o app |
| Segunda-feira | GUTO abre semana naturalmente — não como robô | GUTO sem mencionar semana nova |

---

### 3.2 ABA MISSÃO (Treino do dia)

**Fluxo correto:**

```
1. Treino aparece montado (sem o usuário pedir)
2. Cada exercício: nome, séries, reps, descanso, cue técnico, vídeo local
3. Botão "Dúvida" → abre chat com exercício identificado
4. Usuário completa → "Missão executada"
5. Câmera → encaixa rosto → 3 segundos → fala "TREINO FEITO GUTO"
6. Validação: foto + dados + +100 XP + streak+1
7. Card aparece no Percurso
```

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Exercício sem vídeo | Não aparece na lista | Aparece sem vídeo |
| Exercício de risco para limitação | Ausente do treino | Aparece normalmente |
| Câmera de validação | Abre câmera nativa, rosto, 3s, voz | Câmera não abre |
| XP após validação | +100 (completo) ou +50 (adaptado) aparecem imediatamente | XP não atualiza |
| Streak após validação | Sobe em todas as telas ao mesmo tempo | Desatualizado em alguma tela |
| Percurso | Card aparece imediatamente com foto real | Só aparece após reload |

---

### 3.3 ABA DIETA

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| fat_loss | Déficit ~300-500kcal, proteína alta (~2g/kg) | Mesmo cardápio para qualquer objetivo |
| muscle_gain | Superávit ~200-300kcal, proteína alta | Cardápio de manutenção |
| Restrição alimentar | Alimento restrito ausente em todas as refeições | Alimento proibido na dieta |
| Substituição no chat | Resposta concreta com equivalente nutricional | GUTO generalizando |
| Botão de dúvida | Chat abre com alimento/refeição identificada | Chat abre em branco |
| Dieta vazia | Botão "Gerar dieta" funcional | Tela vazia sem botão |

---

### 3.4 ABA ARENA (Ranking)

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Nome na Arena | "GUTO & [nome digitado]" | "Operador #1" ou userId |
| XP reflete treinos | Após validação: XP sobe no ranking | Ranking estático |
| Arena vs memory XP | Arena totalXp = memory totalXp | Arena 100 XP atrás (bug de dessincronia) |
| Reset semanal | Segunda-feira: ranking semanal zerado | Ranking da semana passada |
| Loading state | Skeleton cards | Tela em branco ou crash |

**Arena individual:** ⚠️ Não validado — confirmar se está ativo em produção, quem aparece e quais regras de privacidade se aplicam antes de liberar.

---

### 3.5 ABA EVOLUÇÕES (XP e Avatar)

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| XP total | Soma correta de todos os eventos do código | Diferente entre abas |
| Streak | Mesmo número em: Evoluções + topo do app + Percurso | Inconsistente |
| Stage do avatar | Muda ao cruzar 1500 / 5000 / 12000 | Sempre baby |
| Bônus inicial | Label "bônus inicial" — não aparece como "treino feito" | Contabilizado como treino |
| Penalidade | -20 XP por dia perdido visível no histórico | Nunca aparece |
| Histórico de XP | Lista com data, tipo e valor de cada evento | Lista vazia |

---

### 3.6 ABA PERCURSO (Validações)

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Card após validação | Aparece imediatamente com foto real | Só aparece após reload ou sem foto |
| Máximo 5 cards | Só as 5 últimas | Acumula infinito |
| Streak no card | Mesmo da aba Evoluções | Diferente |
| XP no card | Valor correto pelo tipo de missão | Valor errado |

---

## PARTE 4 — PAINEL ADMINISTRATIVO

### 4.1 Super Admin

| Seção | O que mostra |
|-------|-------------|
| Todos os Times | Nome, plano, coaches/alunos por Time — isolados entre si |
| Lista de alunos | Nome, idade, sexo, XP, último treino, streak — com filtros |
| Perfil completo | Todos os campos de calibragem incluindo patologia e restrição alimentar |
| Reset | Zera XP ou arena com confirmação explícita |
| Convites | Link único por Time. Vincula ao Time correto automaticamente |

---

### 4.2 Coach (só seus alunos)

**Fluxo de edição:**

```
Coach entra no perfil do aluno
→ Vê: nome, idade, sexo, peso, altura, objetivo, local, patologia, restrição
→ Edita dados físicos → próxima dieta usa dados novos

Coach edita treino do aluno
→ Remove exercício de risco para a limitação declarada
→ Substitui por alternativa de menor risco para AQUELA limitação específica
  (alternativa depende da patologia — não assumir que qualquer exercício é seguro)
→ Aluno vê treino atualizado imediatamente
→ GUTO usa treino atualizado como referência no chat
```

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Patologia visível | Coach vê a limitação declarada | Campo vazio ou oculto |
| Restrição alimentar visível | Coach vê a restrição | Campo vazio |
| Edição de treino propagada | Aluno vê treino editado sem reload | Aluno vê treino antigo |
| Isolamento de Times | Coach só vê seus alunos | Coach vê alunos de outro Time |
| Convite gerado | Link funcional, vincula ao Time correto | Link quebrado |

---

## PARTE 5 — GUTO ONLINE (Sessão ao vivo)

**Status: Parcial — avatar e voz base funcionam. Estados de sessão e persistência precisam ser auditados.**

**Fluxo completo:**

```
1. Usuário abre GUTO ONLINE (via aba MISSÃO)
2. GutoOfficialAvatar aparece (vídeo real — não CSS) ⚠️ confirmar componente exato
3. Sessão inicia: exercício atual + série atual + timer
4. Voz oficial do GUTO fala os cues
5. Botão "Série feita" → registra e avança
6. Timer de descanso countdown entre séries
7. Botões discretos: Pausa / Dor / Trocar exercício
8. Finalização → tela de resumo
9. Flui para câmera de validação (mesmo fluxo da aba MISSÃO)
```

**Estados que a sessão deve tratar:**

| Estado | CORRETO | ERRADO |
|--------|---------|--------|
| Iniciando | GutoOfficialAvatar carregando | CSS placeholder |
| Série atual | "Série 2/4" visível | Sem indicador de progresso |
| Série feita | Botão registra e avança para próxima | Não registra |
| Descanso | Countdown funcional com opção de pular | Ausente |
| Pausa | Tudo pausa (avatar, timer) | Só esconde UI |
| Dor/desconforto | Botão disponível → GUTO adapta | Ausente |
| Trocar exercício | Alternativa sugerida em contexto | Ausente |
| Voz instável | Silêncio + texto + haptic | browser speechSynthesis como fallback |
| Sem internet | ⚠️ confirmar: continua ou avisa claramente | Crash |
| App fecha e reabre | ⚠️ confirmar: retoma de onde parou ou começa do zero | Perde progresso |
| Finalização | Tela de resumo com exercícios e tempo | Fecha diretamente |
| Botão fechar — PT | "Fechar GUTO Online" | "FECHAR" genérico |
| Botão fechar — EN | "Close GUTO Online" | Texto em português |
| Botão fechar — IT | "Chiudi GUTO Online" | Texto em português |

---

## PARTE 6 — SISTEMA DE VOZ (CONFIRMADO DO CÓDIGO)

**Fonte:** `guto-app-v0/lib/guto-voice/guto-voice-service.ts`

**Hierarquia (4 níveis — sempre nesta ordem):**

```
1. static-file    → arquivo do voicepack local (preferStatic=true + intentKey)
2. local-cache    → IndexedDB (áudio já ouvido antes)
3. remote-saved   → POST /voz (gera e salva no IndexedDB)
4. browser-fallback → speechSynthesis com heurística de voz masculina
5. silent         → se nenhum funcionar
```

**Regra do browser fallback:**
- O browser fallback É um modo válido como último recurso
- Ele usa heurística para preferir voz masculina (palavras-chave: male, masculino, jorge, mark, daniel, etc.)
- NÃO é aceitável como modo padrão
- `VOICE_API_KEY` no backend controla o acesso ao `/voz` (confirmado no `.env.example`)
- Se `/voz` cair, o sistema usa browser-fallback. Se browser-fallback também falhar, silent

**Verificações:**

| O que verificar | CORRETO | ERRADO |
|----------------|---------|--------|
| Dúvida de exercício | Voz do GUTO (mode: static, cache ou remote) | Voz feminina padrão do browser |
| Dúvida de alimento | Voz do GUTO ou silêncio | Sem feedback de voz (bug confirmado) |
| Voz do GUTO ONLINE | Voz oficial via voicepack ou /voz | CSS + browser padrão |
| Fallback correto | browser-fallback com heurística masculina | Voz feminina "Alice" ou padrão do sistema |

---

## PARTE 7 — TIMEZONE (CONFIRMADO DO CÓDIGO)

**Fonte:** `guto-backend/src/config.ts` e `render.yaml`

```
GUTO_TIME_ZONE = process.env.GUTO_TIME_ZONE || process.env.TZ || "Europe/Rome"
Valor em produção (render.yaml): "Europe/Rome"
```

**Todas as operações de data/hora do backend usam `GUTO_TIME_ZONE`:**
- `todayKey()` — chave de data para deduplicação de XP
- `getGutoTimeParts()` — hora/minuto do dia
- Labels de treino e data
- Detecção de segunda-feira para proatividade

**Consequência para proatividade:** "amanhã", "quinta", "semana que vem" devem ser interpretados relativo ao timezone do GUTO (`Europe/Rome`), não UTC. Usar `new Date().toISOString()` puro é erro.

---

## PARTE 8 — SISTEMA DE PROATIVIDADE

**Status:** Parcial — backend implementado (`src/proactivity/` existe). Frontend só integra `/extract`. Endpoints `/confirm`, `/discard` e `/validate` não são chamados pelo frontend ainda.

**O que está funcionando:**
- Backend: todos os endpoints existem em `server.ts`
- Backend: extração com Gemini, enriquecimento com wttr.in + date.nager.at, ciclo de estados
- Frontend: `POST /guto/proactivity/extract` chamado após 6+ mensagens
- Frontend: `POST /guto/proactivity/open-weekly` chamado nas segundas

**O que falta no frontend:**
- Chamada para `/confirm` quando GUTO confirma um evento
- Chamada para `/discard` quando GUTO descarta
- Chamada para `/validate` com outcome (happened/postponed/discarded)

**Checklist antes de marcar como Implementado:**

- [ ] `src/proactivity/` commitado na branch de produção
- [ ] Endpoints `/extract`, `/confirm`, `/discard`, `/validate`, `/open-weekly` presentes no `server.ts`
- [ ] Frontend chama `/extract` após 6+ mensagens (via `hasExtractedThisWeek()` localStorage)
- [ ] Frontend chama `/confirm` quando GUTO confirma evento
- [ ] Frontend chama `/discard` quando GUTO descarta
- [ ] Frontend chama `/validate` com outcome correto
- [ ] `buildProactivityContextBlock()` com `.catch(() => null)` — nunca quebra o chat

**Regras de comportamento do GUTO no ciclo proativo:**

| Comportamento | CORRETO | ERRADO |
|--------------|---------|--------|
| Segunda-feira | GUTO pergunta sobre a semana naturalmente, como amigo | "Olá! É segunda-feira! Quais são seus planos?" |
| Confirmação de evento | "Anotei a viagem pra Roma quinta, certo?" | Lista todos os eventos de uma vez |
| Uso durante a semana | "Amanhã Roma vai fazer sol, boa pra treinar ao ar livre" | Nada mencionado |
| Validação na segunda seguinte | "E Roma? Rolou como esperado?" | Nunca valida |
| Falha do sistema | Chat funciona normalmente | Chat quebra se proatividade falha |

---

## PARTE 9 — IDIOMAS: COBERTURA COMPLETA

**Bug ativo (13/05/2026):** tela de consentimento/regras sempre em português, ignora idioma selecionado.

**Regra:** nenhum texto visível pode estar em português se o idioma é inglês ou italiano.

| Componente | O que verificar |
|-----------|----------------|
| `bottom-navigation.tsx` | Labels das abas nos 3 idiomas |
| `arena-tab.tsx` | "DUPLA COM GUTO" / "PAIRED WITH GUTO" / "COPPIA CON GUTO" |
| `chat-tab.tsx` | Abertura, labels de microfone, erros |
| `path-tab.tsx` | "dias na sequência" / "day streak" / "giorni di fila" |
| `mission-tab.tsx` | Séries, reps, descanso, botão de conclusão |
| `diet-tab.tsx` | Rótulos de refeição, horários, calorias |
| `guto-online-session.tsx` | Botão fechar nos 3 idiomas |
| Tela de consentimento | ⚠️ Bug ativo — precisa de correção explícita |

**Como verificar:**
1. Mudar para `en-US`
2. Navegar em TODAS as telas incluindo onboarding e consentimento
3. Qualquer palavra em português = BUG
4. Repetir para `it-IT`

---

## PARTE 10 — SOM E FEEDBACK TÁTIL

**Bugs confirmados (13/05/2026):**
- Botões das abas internas (Treino, Dieta, Arena, Percurso) sem feedback
- Botão de dúvida de alimento sem voz
- Voz ao tirar dúvida de exercício era browser genérico (corrigido na task #9)

**Hierarquia de feedback:**

| Tipo de ação | Feedback |
|-------------|----------|
| Ação principal (validar treino, completar missão, pacto) | Som + haptic |
| Navegação entre abas | Som discreto |
| Sub-abas internas | Haptic ou microfeedback visual |
| Input de texto | Sem som |
| Segurar botão do pacto | Sem som durante o segurar. Som ao completar |

---

## PARTE 11 — MOBILE

| Comportamento | CORRETO | ERRADO |
|--------------|---------|--------|
| Teclado virtual | Chat sobe com o teclado, input visível | Input escondido |
| Scroll no chat | Suave, última mensagem sempre visível | Tela não rola |
| Touch em botões | Área mínima 44x44px | Botões minúsculos |
| Câmera de validação | Câmera nativa do dispositivo | Erro ou fallback |
| Microfone no chat | iOS e Android | Só desktop |
| Viewport iOS | `visualViewport` listener ativo | Posição fixa quebrada |

---

## PARTE 12 — CHECKLIST DE DEPLOY

**Backend (variáveis confirmadas no `.env.example`):**
- [ ] `GEMINI_API_KEY` configurada
- [ ] `VOICE_API_KEY` configurada (Google Cloud TTS — nome confirmado no `.env.example`)
- [ ] `GUTO_TIME_ZONE=Europe/Rome` configurado (ou timezone do usuário principal)
- [ ] `GUTO_ALLOWED_ORIGINS` com domínio do frontend
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (produção) — ⚠️ confirmar nomes exatos
- [ ] `JWT_SECRET` diferente do padrão `dev-secret-change-in-production`
- [ ] TypeScript compila sem erros: `npx tsc --noEmit`
- [ ] Vídeos dos exercícios em `/public/videos/` ⚠️ confirmar path

**Frontend:**
- [ ] `NEXT_PUBLIC_GUTO_API_URL` apontando para backend de produção
- [ ] Build sem erros: `npm run build`
- [ ] Tradução completa nos 3 idiomas verificada (incluindo tela de consentimento)
- [ ] Som funcionando em mobile
- [ ] Câmera e microfone testados em iOS e Android

---

## PARTE 13 — CENÁRIOS DE TESTE POR PERFIL

### Perfil A: Iniciante com limitação no joelho
- **Dados:** 45 anos, 90kg, 170cm, beginner, fat_loss, home, "joelho direito operado"
- **Treino correto:** sem saltos, sem impacto, sem flexão profunda carregada. GUTO pergunta antes de leg press. 3 séries, baixa intensidade
- **Dieta correta:** déficit ~300kcal, proteína ~162g/dia (1.8g × 90kg)
- **Chat correto:** GUTO menciona o joelho. Nunca sugere salto sem perguntar

### Perfil B: Avançado objetivo massa
- **Dados:** 25 anos, 75kg, 180cm, advanced, muscle_gain, gym, sem patologia
- **Treino correto:** 4-5 séries, compostos pesados, rotação por grupo muscular
- **Dieta correta:** superávit ~300kcal, proteína ~150-165g/dia (2-2.2g × 75kg)
- **Chat correto:** GUTO mais exigente, cobra mais, termos técnicos

### Perfil C: Restrição alimentar severa
- **Dados:** qualquer, foodRestrictions: "vegano"
- **Dieta correta:** zero proteína animal. Leguminosas, tofu, tempeh
- **Chat correto:** GUTO nunca sugere frango ou ovo como substituto

### Perfil D: Segunda-feira — teste de proatividade
- **Contexto:** usuário mencionou viagem na semana anterior
- **Esperado:** GUTO abre semana naturalmente. Após 6+ msgs: extração silenciosa. GUTO confirma um item por vez
- **Não esperado:** "Registrei 3 eventos: 1. viagem 2. reunião 3. médico"

---

## OS 10 ERROS MAIS CRÍTICOS

1. **GUTO perguntando local quando já está salvo** → `preferredTrainingLocation` não chega no prompt
2. **Treino com exercício de risco para a limitação** → `trainingPathology` não está nas regras de segurança
3. **Dieta ignorando restrição alimentar** → `foodRestrictions` não chegou no prompt de dieta
4. **Nome do convite em vez do nome do usuário** → bug de `presetName` ainda ativo
5. **XP inconsistente entre telas** → dessincronia `totalXp` vs Arena (bug da Arena 100 atrás)
6. **Texto em português com idioma inglês/italiano** → tela de consentimento e outros componentes
7. **Avatar CSS em vez de vídeo no GUTO ONLINE** → componente errado sendo usado
8. **Voz feminina/browser em vez da voz do GUTO** → fallback ativo sem tentar `/voz` primeiro
9. **Teclado cobrindo input no mobile** → `visualViewport` listener ausente
10. **Proatividade quebrando o chat** → `buildProactivityContextBlock` sem `.catch(() => null)`

---

## APÊNDICE — O QUE AINDA PRECISA SER AUDITADO

| Item | O que confirmar | Onde procurar |
|------|----------------|---------------|
| Componente avatar GUTO ONLINE | Nome exato do componente real usado | `guto-online-session.tsx` |
| Persistência de sessão GUTO ONLINE | Retoma de onde parou ou reinicia | `guto-online-session.tsx` |
| Comportamento sem internet no GUTO ONLINE | Falha graciosamente ou crasha | `guto-online-session.tsx` |
| Integração /confirm /discard /validate | Frontend chama esses endpoints | `chat-tab.tsx` |
| `src/proactivity/` na branch de produção | Arquivos foram commitados e pushados | `git status; git log --oneline` |
| Arena individual | Está ativo? Quem aparece? Regras de privacidade? | `server.ts` + painel |
| Nomes de arquivo de tradução | Onde ficam as strings traduzidas | `guto-app-v0/` |
| Path real dos vídeos de exercício | `/public/videos/` ou outro path | Deploy config |
| UPSTASH env vars | Nomes reais das variáveis | `.env.example` atual |
| `trainedToday` reset | Quando e como reseta (meia-noite no timezone correto?) | `server.ts` |
