# GUTO — Plano Cirúrgico Para Testes

> Documento operacional canônico para execução faseada.
> Atualizado: 2026-05-28.
>
> **Antes de qualquer fase:** ler `README.md` + o documento DETALHADA da área. Uma mudança por vez. Todos os testes do backend (hoje 418) antes e depois de cada mudança.

---

## Status Atual da Execução

| Fase | Status | Quando | Observação |
|---|---|---|---|
| 0 — Verificação Base | ✅ Concluída | 2026-05-28 | 36 suítes, 418 testes, 0 falhas. TS exit 0 nos dois. |
| 1 — Merge + Deploy | ✅ Concluída | 2026-05-27 | P0 já estava em `main` (PR #24); `main` avançou +6 PRs; produção READY no SHA `f65440b`. |
| 2 — Smoke Test Parte 1 | 🟡 Em andamento | 2026-05-28 | URL: https://corpoguto.vercel.app · 1 bug detectado: treino em EN/IT misturava nomes PT (PR #35 ✅ mergeada) |
| 3 — Selfie obrigatória | ✅ MERGEADA em produção | 2026-05-28 | Frontend [#31](https://github.com/williangustavosantos-sys/CORPOGUTO/pull/31) ✅ · Backend [#34](https://github.com/williangustavosantos-sys/CEREBROGUTO/pull/34) ✅ |
| Bug Fase 2 — Idioma do treino EN/IT | ✅ MERGEADA em produção | 2026-05-28 | Backend [#35](https://github.com/williangustavosantos-sys/CEREBROGUTO/pull/35) ✅ |
| 4.A — Empresas: pausar/arquivar/excluir | ✅ MERGEADA em produção | 2026-05-28 | Frontend [#32](https://github.com/williangustavosantos-sys/CORPOGUTO/pull/32) ✅ |
| Bug painel — Gate calibragem ao gerar treino | ✅ MERGEADA em produção | 2026-05-28 | Backend [#36](https://github.com/williangustavosantos-sys/CEREBROGUTO/pull/36) ✅ — bug do fundador (aluno sem calibragem gerava treino) |
| 4.B — Auditoria completa PARITY painel⇄app | 🟡 Iniciando agora | — | Trilhas: calibragem · treino · dieta · XP/streak · arena · validações |
| 4 — Limiar de risco ≥6 | ⬜ Aguardando Fase 3 | — | — |
| 5 — Painel sem mock | ⬜ Aguardando Fase 4 | — | — |
| 6 — Morte do GUTO | ⬜ Aguardando teste real | — | Parte 2 do produto |
| 7 — Itens auxiliares | ⬜ Backlog | — | — |

Legenda: ⬜ pendente · 🟡 em execução / pronta · ✅ concluída · 🔴 bloqueada

### Última verificação base (Fase 0 — 2026-05-28)

| Comando | Resultado |
|---|---|
| `guto-backend: npm run test:guto` | ✅ 36 suítes, 418 testes, 0 falhas |
| `guto-backend: npx tsc --noEmit` | ✅ exit 0 |
| `guto-app-v0: npx tsc --noEmit` | ✅ exit 0 |

> A auditoria de 2026-05-25 reportava 24 suítes/302 testes. Hoje são 36/418 — o código cresceu em cobertura desde então. Estado base sólido.

---

## Estado Real (2026-05-28)

O código está mais completo do que parece. Das 70+ áreas do inventário, apenas 12 têm lacunas reais.

**O que está implementado e testado:**
- 418 testes no backend (36 suítes), TypeScript limpo nos dois submódulos (validado em 2026-05-28)
- Onboarding completo (idioma → login → consentimento → nome → calibragem → pacto)
- Turn contract (`fala/acao/expectedResponse/avatarEmotion/memoryPatch/workoutPlan`) — sólido
- Stage Router (`resolveAuthenticatedStage`) — sólido
- Chat + Gemini + segurança
- Treino (video gate 27 testes, 89 mp4, lockedByCoach, respeito a dor/limitação)
- Dieta (BMR/TDEE, macros, restrições, localização por país/cidade)
- Proatividade (ciclo completo: coletar→confirmar→enriquecer→usar→validar→descartar)
- XP, streak, arena, evolução de avatar — sólidos
- GUTO Online (máquina de estados, retomada por janela)
- Panel `/coach` consome API real (`/admin/*`); backend admin real e testado
- i18n PT/EN/IT em todo o app

**Branches:**
- Backend `main`: deploy em `cerebroguto.onrender.com` — estado P0
- Frontend: correções de P0 em `fix/hard-stabilization-p0` (PR #16 mergeado) — confirmar merge para `main`

---

## Por Que o GUTO Vira Chatbot (Causa Raiz)

O turn contract é a cola de integração. Se qualquer mudança faz o frontend não conseguir parsear a resposta do backend, o app cai para modo texto puro — o "chatbot".

Isso acontece quando:
1. Uma mudança no backend altera a estrutura da resposta sem o parser do frontend ser atualizado
2. Uma mudança no schema da GutoMemory faz um campo esperado desaparecer
3. Uma mudança no Stage Router confunde a máquina de estados e o app fica preso

**Solução:** nunca tocar as 4 zonas sagradas sem mudança coordenada em ambos os lados + rodar todos os testes do backend imediatamente.

---

## As 4 Zonas de Não Tocar

| Zona | Arquivo | Por que é sagrado |
|---|---|---|
| Turn contract | `guto-backend/src/guto-turn-contract.ts` | Mudança estrutural → GUTO vira chatbot |
| Stage Router | `guto-app-v0/components/guto/guto-app.tsx` (`resolveAuthenticatedStage`) | Mudança → onboarding preso ou etapa pulada |
| GutoMemory schema (campos públicos) | campos de `memory` no backend | Renomear/remover campo → treino/dieta/chat perdem dado silenciosamente |
| Video gate + catálogo | `guto-backend/src/workout-catalog-validation` + 89 mp4 | 27 testes dependem; remover vídeo → exercício some do treino |

---

## Lacunas Reais (Pontos de Atenção de Todas as DETALHADA)

Compilado de 11 documentos canônicos. Os ✅ alinhados não entram aqui.

### P0 — Blocking para teste completo

| Gap | Ref doc | Arquivo exato | Risco |
|---|---|---|---|
| Selfie obrigatória na validação (hoje opcional) | X-7, O-7 | `guto-backend/src/server.ts` (rota validate) | Baixo — additive guard |
| Limiar de risco ≥7→≥6 dias (código usa ≥7, decisão é ≥6) | (utils) | `guto-app-v0/app/coach/_components/utils.ts` | Muito baixo — display do painel |
| Backend emitir `GUTO_DECEASED` como code de acesso | L-5 | `guto-backend/src/auth-middleware.ts` | Baixo — só o string do code |

### P1 — Para painel sem mock

| Gap | Ref doc | Ação | Risco |
|---|---|---|---|
| `/admin`/`/empresa` em mock por padrão | 179, 180 | Setar `NEXT_PUBLIC_USE_MOCKS=false` no Vercel | Zero para app do aluno |

### P2 — Morte do GUTO (Parte 2 do produto — após P0/P1)

| Gap | Ref doc | Arquivo | Risco |
|---|---|---|---|
| Campos `gutoLifeStatus`, `accessLocked`, `deadAt`, `deathReason` ausentes | X-8 | Schema backend | Médio — adicionar campos |
| Guard 403 `GUTO_DECEASED` nas rotas | X-9 | `requireActiveUser` no backend | Médio — guard novo |
| Tela de blackout no frontend | X-10 | Frontend — interceptor já existe | Baixo — tela nova isolada |

### P3 — Auxiliares (não bloqueiam teste)

| Gap | Ref doc | Urgência |
|---|---|---|
| Endpoint dedicado de calibragem validada | C-5 | Futura |
| `source` de alteração em todos os caminhos | C-6 | Futura |
| Fila de pendência para coach (swap com lock) | T-6 | Futura |
| Cobertura de swap de alimento por chat | D-8 | Futura |
| Provider de clima externo para proatividade | P-6 | Auxiliar |
| Recuperação de senha | L-6 | Futura |

---

## Regra de Ouro do Processo

```
Uma mudança → Um arquivo → Rodar todos os testes → Confirmar → Próxima mudança
```

Nunca alterar turn contract e GutoMemory schema na mesma sessão.
Nunca mudar frontend e backend ao mesmo tempo sem rodar os testes entre as mudanças.

---

## Fase 0 — Verificação Base (zero código, ~30 min)

```bash
# Backend
cd guto-backend && npm run test:guto
# Esperado em 2026-05-28: 36 suítes, 418 testes, 0 falhas

cd guto-backend && npx tsc --noEmit
# Esperado: exit 0

# Frontend
cd guto-app-v0 && npx tsc --noEmit
# Esperado: exit 0
```

Só avança se todos os testes passarem. Se falhar: parar e investigar ANTES de qualquer mudança.

Critério de saída: estado base confirmado e rastreável.

---

## Fase 1 — Merge + Deploy (zero código)

1. Confirmar: `git log guto-app-v0/main` inclui o PR #16 (`fix/hard-stabilization-p0`)
2. Se não: fazer merge de `fix/hard-stabilization-p0` → `main` no submodule `guto-app-v0`
3. Confirmar Vercel deploy automático passa (sem `next build` quebrado)
4. Confirmar URL de preview funciona

Critério de saída: `main` do frontend no Vercel com todas as correções de P0.

---

## Fase 2 — Smoke Test Parte 1 (zero código, celular real)

Roteiro completo em ordem, em conta nova:

```
1. Abrir URL Vercel no iPhone Safari (conta nova)
2. Vídeo de abertura → toque "Iniciar GUTO"
3. Escolher PT
4. Login por convite
5. Consentimento → aceitar tudo
6. Nome da dupla → confirmar
7. Calibragem → preencher todos os 11 campos
8. Pacto → assinar
9. Chat → verificar fala/ação/emoção (NÃO texto puro — se for texto puro, parar aqui)
10. Missão → ver treino do dia com vídeos
11. Chat → botão "?" no exercício → verificar que abre com contexto
12. Dieta → ver plano da semana
13. Proatividade → GUTO faz pergunta sobre a semana, responder, confirmar memória
14. Repetir 1–13 em EN e IT
15. Repetir em Android Chrome
```

O que observar:
- Chat mostra texto puro sem ações → turn contract falhando → parar e investigar
- Missão não aparece → `lastWorkoutPlan` não gerado → verificar backend
- GUTO pergunta local de treino de novo → calibração não chegando no treino

Critério de saída: fluxo completo funcionando nos 3 idiomas em iPhone Safari + Android Chrome sem orientação do fundador.

---

## Fase 3 — Selfie Obrigatória (backend, 1 arquivo)

Documento de referência: `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` (X-7) + `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA.md` (O-7)

Arquivo: `guto-backend/src/server.ts` — rota de validação de treino (`POST /guto/workout/validate` ou equivalente).

O que fazer:
```
Antes de creditar XP:
se !body.imageBase64 || body.imageBase64.length === 0:
  retornar 400 { error: "SELFIE_REQUIRED", message: "Validação exige foto" }
```

Depois: rodar todos os testes. Adicionar 1 teste novo cobrindo o guard.
Não tocar: XP, turn contract, treino, dieta, nada mais.

Critério de saída: todos os testes passando + 1 teste novo + validação sem foto retorna 400.

---

## Fase 4 — Limiar de Risco do Painel (1 linha, frontend)

Documento de referência: `GUTO_PAINEL_ADMIN_CANONICO_V1.md` (§ Risco)

Arquivo: `guto-app-v0/app/coach/_components/utils.ts`

Localizar a função `studentRisk` (ou equivalente). Mudar:
```
// De:
diasSemTreino >= 7  →  status "critico"
// Para:
diasSemTreino >= 6  →  status "critico"
```

Depois: TypeScript. Não tocar mais nada.

Critério de saída: `tsc --noEmit` limpo; painel mostra "crítico" a partir de 6 dias.

---

## Fase 5 — Painel Sem Mock (variável de ambiente)

Documento de referência: `GUTO_PAINEL_ADMIN_CANONICO_V1.md`

Arquivo: variável de ambiente no Vercel (não em `.env` commitado).

Adicionar:
```
NEXT_PUBLIC_USE_MOCKS=false
```

Depois: fazer login no painel em `/admin/login` → verificar que dados são reais (sem badge "DADOS MOCK · FASE VISUAL").

Zero risco para o app do aluno — flag é só do painel.

Critério de saída: painel funcionando com dados reais do backend.

---

## Fase 6 — Morte do GUTO (Parte 2 — só após Fase 2–5 validadas)

Documento de referência: `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA.md` (X-8, X-9, X-10)

Esta fase adiciona um sistema novo sem alterar o que funciona.

**Backend — 3 etapas em sequência, uma por vez:**

**6-A:** Adicionar campos ao schema de memória (additive — não remove nada):
```
gutoLifeStatus: "alive" | "dead"   (default "alive")
accessLocked: boolean               (default false)
deadAt: string | null               (default null)
deathReason: string | null          (default null)
```

**6-B:** No job de penalidade diária: quando `totalXp` chega a 0 após clamp, setar:
```
gutoLifeStatus = "dead"
accessLocked = true
deadAt = new Date().toISOString()
```

**6-C:** Em `requireActiveUser` (middleware): se `accessLocked === true`, retornar:
```
403 { action: "lock_screen", status: "dead", code: "GUTO_DECEASED" }
```

**Frontend — 1 etapa:**

**6-D:** O interceptor de 403 em `guto-app-v0/lib/api/client.ts` já existe. Criar a tela de blackout que ele mostra quando `action === "lock_screen"` e `status === "dead"`. Design: avatar morto, Percurso read-only, sem acesso ao chat/treino/dieta.

Rodar todos os testes após cada etapa (6-A, 6-B, 6-C separadamente).

Critério de saída: conta com XP zero → blackout no app → Percurso read-only → sem acesso às abas.

---

## Fase 7 — Itens Auxiliares (Parte 2+)

Só entram em execução depois que o fluxo completo estiver validado com pessoas reais.

| Item | Esforço estimado | Documento |
|---|---|---|
| Endpoint dedicado de calibragem (C-5) | Médio | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` |
| Source tracking em mutações (C-6) | Médio | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA.md` |
| Fila de pendência coach (T-6) | Médio | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA.md` |
| Swap de alimento por chat (D-8) | Médio | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA.md` |
| Provider de clima (P-6) | Pequeno | `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` |
| Recuperação de senha (L-6) | Médio | `GUTO_PAGINA_DE_LOGIN_DETALHADA.md` |

---

## Histórico Validado

1. `CEREBROGUTO` PR #8 — dieta vai para `needs_clarification` quando campos nutricionais da calibragem mudam, preservando `lockedByCoach`.
2. `CEREBROGUTO` PR #9 — `phone` removido da `GutoMemory`.
3. `CEREBROGUTO` PR #10 — `biologicalSex` restrito a `male | female`.
4. `CEREBROGUTO` PR #11 — ranges oficiais de idade, altura e peso aplicados.
5. `CORPOGUTO` PR #11 — contrato do app remove `phone` da memória do aluno.
6. `CORPOGUTO` PR #12 — ajustes/calibragem aguardam persistência antes de mostrar salvo.
7. Validação local `CEREBROGUTO` — `memoryPatch` gravado antes da resposta ao app.
8. Validação local `CORPOGUTO` — idioma e nome fora da calibragem e antes dela.
9. `CEREBROGUTO` PR #12 — dieta bloqueia alimentos brasileiros difíceis fora do Brasil.
10. `CORPOGUTO` PR #13 — `countryCode` enviado junto com país/cidade.
11. `CEREBROGUTO` PR #13 — backend limpa `countryCode` antigo quando país muda.
12. `CEREBROGUTO` PR #14 — rota admin propaga calibragem para dieta, `countryCode` e `trainingStatus`.
13. `CORPOGUTO` PR #14 — aba de dieta bloqueia plano inválido sem reconciliar local.
14. `CEREBROGUTO` PR #15 — peixe/frutos do mar banidos quando declarados no NÃO COMO.
15. `CEREBROGUTO` PR #16 — ovo banido quando declarado no NÃO COMO.
16. `CEREBROGUTO` PR #17 — falha de dieta retorna `reason` estruturado.
17. `CORPOGUTO` PR #15 — aba de dieta usa `reason` para mensagem específica.
18. `CORPOGUTO` PR #16 — `persistMemory` reverte update otimista quando backend não confirma.
19. `GUTO-RAIZ` — 11 documentos canônicos DETALHADA criados/revisados com Pontos de Atenção. Painel V1 canônico criado. PARTE_1..5 virou ponteiros.

---

## Como Trabalhar Com Agentes

1. Ler `README.md`
2. Ler este plano
3. Ler apenas o documento DETALHADA da fase atual
4. Auditar o código antes de tocar
5. Propor a menor mudança possível
6. Implementar só o autorizado
7. Rodar todos os testes
8. Entregar relatório: arquivos alterados, o que mudou, testes rodados, riscos restantes, próxima fase

```
Uma fase só termina quando o comportamento está validado, documentado e subido em branch/PR rastreável.
```
