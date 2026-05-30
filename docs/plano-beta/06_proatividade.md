# 06 — Proatividade e Ciclo Semanal

> Spec: `GUTO_PROATIVIDADE_E_CICLO_SEMANAL.md` · Código: `guto-backend/src/proactivity/*` (`memory-extractor`, `memory-action-resolver`, `memory-enricher`, `proactive-store`, `weekly-conversation`), `presence/*`
>
> **Veredito: 🟢 o ciclo está implementado e testado (23 testes). Falta validar em device e a fala depende do chat (que está quebrado).**

---

## O que a spec manda
Proatividade é o que faz o GUTO "parecer vivo" — **não** é notificação genérica. Ciclo: coletar → confirmar → enriquecer → usar → validar → descartar. **Confirma antes de salvar** (Regra Soberana 1). Não vira calibragem permanente sem confirmação. Não cobra presença de quem declarou viagem. Liquida memória após o ciclo (sem "sujeira eterna"). Correção atualiza o evento, não duplica.

## O que existe no código
- `proactivity/`: extrator → `pending_confirmation` → `confirmed` → `enriched` → `surfaced` → `validated`/`discarded`.
- `proactive-store`: expira 24h, reschedule +7d.
- `presence/`: signal-extractor → context-bank.
- Endpoints `/guto/proactivity/*` (open-weekly, confirm, validate).

## ✅ O que está certo
- **P-1..P-5, P-7 ✅** (testes `proactivity-resolver` 23 passes + `proactivity-store-cycle` + `proactivity-http`): ciclo fechado nos 3 idiomas, confirma antes de salvar, não vira calibragem permanente, não sobrescreve lock, arquiva sem sujeira, não pune viagem declarada.

## ❌ O que está errado / quebra
- **PRO-1 (upstream) — a fala da proatividade sai pelo chat.** Como o chat está quebrado ([03](03_chat_e_cerebro.md)), a proatividade pode ser sufocada pelos mesmos gates de "distração"/cobrança. Precisa ser revalidada **depois** do fix do chat.
- **P-6 (spec) — enriquecimento com clima/feriado é parcial.** `city`/contexto são usados, mas o **provider de clima externo não está confirmado** (é auxiliar: não pode bloquear o app se falhar).
- **(verificação) — nunca validado em device real.** O contrato de aceitação V1 lista "smoke da proatividade no celular: confirmar → usar → validar" como pendente.

## ➕ O que falta adicionar
- Provider de clima/feriado externo (auxiliar, com fallback que não bloqueia).
- QA do ciclo completo em celular real.

## 🛠 Plano de ação
1. **(depende de [03])** Revalidar a proatividade após destravar o chat (a fala não pode virar "distração").
2. **(P2 auxiliar) Provider de clima** por cidade, com timeout e fallback silencioso.
3. **(verificação)** Smoke em device: o GUTO menciona algo da semana → confirma → usa na missão → no fim pergunta se aconteceu → arquiva.

## Como verificar
Em conversa real: usuário menciona "vou viajar pra Roma sexta" → GUTO **pergunta** se entendeu (não salva no escuro) → confirma → durante a semana usa o contexto → depois pergunta se rolou → arquiva. Hoje, o risco é o gate de chat abafar essa fala.
