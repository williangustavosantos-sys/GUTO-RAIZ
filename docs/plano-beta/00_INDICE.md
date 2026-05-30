# GUTO — Plano de Beta, Parte por Parte (verificado no código rodando)

> **Data:** 2026-05-30 · **Método:** para cada área eu li o documento canônico da raiz (`*_DETALHADA`), li o código real de `guto-backend`/`guto-app-v0`, e **rodei o sistema de verdade** (backend no ar + conversa real com o cérebro Gemini). Cada doc traz: **o que a spec manda · o que existe no código · ✅ certo · ❌ errado/quebra · ➕ falta · 🛠 plano**.
>
> Este plano **não altera código** — é diagnóstico + plano de execução. Ele complementa e, em pontos, **corrige** as auditorias antigas (`docs/GUTO_AUDITORIA_*`, `docs/GUTO_PLANO_EXECUCAO_PARA_TESTES.md`).

---

## A descoberta que muda a prioridade

As DETALHADA marcam o **chat como ✅ alinhado** (CH-3 "intenção semântica, não palavra-chave"; CH-6 "fallback honesto"). **Rodando o código, isso é falso.** Numa conversa de usuário normal (10 turnos, perfil calibrado e travado), **6 de 10 respostas quebram**: perguntas centrais como *"qual é o treino de hoje?"*, *"e a minha dieta?"*, *"quantas calorias?"* são respondidas com a frase fixa **"Depois. Agora é ação: treino primeiro, distração depois."**

**Causa-raiz (verificada):** existe um **gate de intenção por regex/palavra-chave ANTES do modelo** (`guto-backend/src/guto-turn-contract.ts` + `server.ts:5866-5980`). Mensagens caem em baldes (`off_topic_distraction`, `resistance_common`, etc.) e recebem **frases prontas que pulam o Gemini** (`return`). As perguntas mais centrais do produto estão sendo classificadas como **"distração"**. Isso **viola a Regra Soberana nº3** ("não usa regex/`se X então Y` como motor principal"), que o próprio doc do chat lista como proibido (§3, §12).

> A auditoria antiga tinha outra teoria de causa-raiz ("vira chatbot quando o frontend não parseia o contrato"). Isso pode ser verdade também, mas **não é o que está quebrando hoje**: hoje o **backend** devolve respostas canned para perguntas legítimas. É um bug de **classificação/roteamento no cérebro**, não de parsing no app.

**Consequência para o plano:** o bloqueador nº1 do beta **não é deploy nem painel** — é o **chat**. Ver [`03_chat_e_cerebro.md`](03_chat_e_cerebro.md).

---

## Mapa de status (spec × código rodando)

| # | Área | Doc canônico | Veredito (verificado) |
|---|---|---|---|
| 01 | Login / acesso / convite | `GUTO_PAGINA_DE_LOGIN_DETALHADA` | 🟢 sólido; faltam recuperação de senha e code de morte |
| 02 | Calibragem / memória | `GUTO_CALIBRAGEM_E_MEMORIA_DETALHADA` | 🟠 coleta ok, mas **"sem lesão" trava o usuário** (ver chat) |
| 03 | **Chat / cérebro** | `GUTO_CHAT_E_CEREBRO_DETALHADA` | 🔴 **quebra para usuário normal** — bloqueador nº1 |
| 04 | Treino / missão | `GUTO_SISTEMA_DE_TREINO_E_MISSAO_DETALHADA` | 🟠 gera, mas **curador falha >50% sob carga** (cai em template) |
| 05 | Dieta | `GUTO_SISTEMA_DE_DIETA_INTEGRADA_DETALHADA` | 🟠 lógica testada, mas **inalcançável pelo chat** (vira "distração") |
| 06 | Proatividade | `GUTO_PROATIVIDADE_E_CICLO_SEMANAL` | 🟢 ciclo testado (23 testes); validar em device |
| 07 | GUTO Online | `GUTO_ONLINE_SESSAO_ASSISTIDA_DETALHADA` | 🔴 só engine/spike; **não validado como feature viva** |
| 08 | Validação / XP / evolução / morte | `GUTO_EVOLUCAO_XP_E_MORTE_DETALHADA` | 🟠 XP ok; **selfie pública (P0 segurança)**; morte ausente |
| 09 | Arena / gamificação | `GUTO_ARENA_E_GAMIFICACAO_DETALHADA` | 🟢 ranking testado; validar consistência de XP entre telas |
| 10 | Painel admin / coach | `GUTO_PAINEL_ADMIN_CANONICO_V1` | 🟠 funcional; tirar mock; isolamento de time testado |
| 11 | Fluxo geral (espinha) | `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP` | síntese — ver cada parte |

🟢 pronto/quase · 🟠 funciona mas tem furo real · 🔴 quebra / não testável hoje

---

## P0 / P1 / P2 consolidado (o que realmente trava o beta)

### 🔴 P0 — sem isto, não dá teste real com usuário
1. **Chat sequestra perguntas centrais** (`server.ts:5866-5980` + `guto-turn-contract.ts`). "qual o treino", "e a dieta", "calorias", "posso comer X" → "distração". → [03](03_chat_e_cerebro.md)
2. **Usuário saudável fica preso** — `hasCalibrationProfileLocked` (`server.ts:1267-1270`) exige patologia/limitação não-vazia; quem não tem lesão nunca "trava" a calibragem. → [02](02_calibragem_e_memoria.md)
3. **Selfies de validação públicas e efêmeras** — `server.ts:569-571` serve `/uploads/validation-images` sem auth, em `tmp/` (some no redeploy). Privacidade/GDPR. → [08](08_validacao_xp_evolucao_morte.md)
4. **Risco de saúde no chat** — taxonomia só tem 4 flags; **febre/doença e álcool não são acolhidos** (usuário doente é mandado treinar). → [03](03_chat_e_cerebro.md)

### 🟠 P1 — qualidade/confiabilidade
5. **Curador de treino falha >50% sob carga** → cai em template. → [04](04_treino_e_missao.md)
6. **Tom atropela** — "fiz o treino" repergunta idade que já tem; "sem energia mas vou" dispara cobrança. → [03](03_chat_e_cerebro.md)
7. **Evals sem juiz** (`judge:skip`) — gate de release não mede nuance. → [03](03_chat_e_cerebro.md)
8. **Painel em mock por padrão** (`NEXT_PUBLIC_USE_MOCKS`). → [10](10_painel_admin_coach.md)

### ⚪ P2 — Parte 2 do produto
9. **Morte do GUTO** não existe no backend (`gutoLifeStatus`/guard 403/code `GUTO_DECEASED`). → [08](08_validacao_xp_evolucao_morte.md)
10. **GUTO Online** como feature viva (validar/encaixar no beta ou adiar). → [07](07_guto_online.md)

---

## Estado técnico de base (verificado 2026-05-30)
- Backend: `tsc` **0 erros**; `npm run test:guto` **426 testes / 0 falhas**; **boota** e `/health` ok com Gemini configurado.
- Frontend: `tsc` **0 erros**; `next build` **ok** (15 rotas).
- **Mas:** verde estático ≠ funcional. Os testes unitários **mockam o modelo** — não pegam o que o usuário vive. Por isso este plano é verificado **rodando o cérebro real**.

---

## Checklist de geração deste plano
- [x] 00 — Índice (este arquivo)
- [x] [01 — Login / acesso](01_login_e_acesso.md)
- [x] [02 — Calibragem / memória](02_calibragem_e_memoria.md)
- [x] [03 — Chat / cérebro](03_chat_e_cerebro.md)
- [x] [04 — Treino / missão](04_treino_e_missao.md)
- [x] [05 — Dieta](05_dieta.md)
- [x] [06 — Proatividade](06_proatividade.md)
- [x] [07 — GUTO Online](07_guto_online.md)
- [x] [08 — Validação / XP / evolução / morte](08_validacao_xp_evolucao_morte.md)
- [x] [09 — Arena](09_arena_gamificacao.md)
- [x] [10 — Painel admin / coach](10_painel_admin_coach.md)
- [x] [11 — Fluxo geral (síntese)](11_fluxo_geral.md)
