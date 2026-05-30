# 11 — Fluxo Geral (espinha) e Ordem de Execução

> Spec: `GUTO_ESTRUTURA_E_FLUXO_DETALHADO_DO_APP.md` + `README.md` · Síntese de todas as partes.
>
> **Veredito: a engenharia de cada peça é madura, mas a CORRENTE que faz o GUTO "parecer vivo" está partida em dois elos: calibragem→chat.**

---

## A corrente "parece vivo" (README) e onde ela parte hoje

O README define a cadeia que faz o GUTO funcionar como presença:

```
calibragem → memória → chat → ação → treino → missão → GUTO Online
           → validação → XP → Arena/Percurso/avatar → proatividade → coach
```

> "Se qualquer parte decide sozinha, o produto quebra."

**Onde quebra hoje (verificado rodando o cérebro real):**

```
calibragem ──(❌ usuário saudável não "trava": server.ts:1267)──► memória
memória ─────(❌ chat trata pergunta central como "distração": server.ts:5866)──► chat
chat ────────► treino (não chega: bloqueado acima) ─► dieta (idem) ─► proatividade (abafada)
```

Os dois cortes — **[02] calibragem-lock** e **[03] chat-gate** — derrubam, em cascata, treino, dieta e proatividade para o usuário comum. Por isso o app "quebra em 1 minuto" apesar de 426 testes verdes: **os testes provam as peças isoladas; eles não exercem a corrente com o modelo real.**

---

## Estado por parte (resumo)

| Parte | Engenharia | Alcançável pelo usuário hoje |
|---|---|---|
| [01] Login/acesso | 🟢 madura | 🟢 sim (validar grant de acesso) |
| [02] Calibragem | 🟢 coleta madura | 🔴 trava usuário saudável |
| [03] Chat | 🟠 contrato existe | 🔴 sequestra perguntas centrais |
| [04] Treino | 🟢 madura | 🔴 não chega (chat) + frágil (curador) |
| [05] Dieta | 🟢 a mais sólida | 🔴 não chega (chat) |
| [06] Proatividade | 🟢 testada | 🟠 depende do chat |
| [07] GUTO Online | 🟠 engine testada | 🔴 não validado como feature |
| [08] Validação/XP | 🟢 XP sólido | 🟠 selfie pública (P0) + morte ausente |
| [09] Arena | 🟢 testada | 🟠 falta prova ponta a ponta |
| [10] Painel | 🟠 funcional | 🟠 mock + gaps G-01..G-13 |

---

## Ordem de execução recomendada (o que destrava o quê)

**Bloco 1 — Destravar a corrente do aluno (P0, ~1–2 semanas)**
1. [02] Corrigir o lock da calibragem para usuário saudável.
2. [03] Desarmar o gate de "distração" e rotear perguntas de treino/dieta para handler/modelo.
3. [03] "fiz o treino" → conclusão; ampliar risco (febre/álcool); suavizar tom.
4. **Verificar com conversa real** (não unit test): 10 turnos sem frase robótica, treino gerado, dieta respondida.

**Bloco 2 — Segurança e confiabilidade (P0/P1, ~1 semana)**
5. [08] Selfies atrás de auth + storage persistente.
6. [04] Estabilizar/medir o curador (retry/backoff).
7. [03] Ligar o juiz dos evals (`ANTHROPIC_API_KEY`) e re-rodar o gate.

**Bloco 3 — Operação e QA (P1, ~1 semana)**
8. [10] Tirar o mock do painel + threshold de risco (G-06) + fluxo coach→aluno.
9. [01] Recuperação de senha; validar grant de acesso no convite.
10. [06]/[09] Revalidar proatividade e consistência de XP **em device real**.

**Bloco 4 — Parte 2 (depois do beta da Parte 1)**
11. [08]/[01] Morte do GUTO (campos + guard 403 + blackout).
12. [07] GUTO Online como feature viva (decidir e construir/validar).

---

## Regra de processo (das auditorias antigas, ainda válida)
- **Uma mudança → um arquivo → rodar os 426 testes → confirmar → próxima.**
- **Nunca** alterar `guto-turn-contract.ts` e o schema de `GutoMemory` na mesma sessão (zonas sagradas).
- **Mas atenção:** o `guto-turn-contract.ts` é, ao mesmo tempo, "zona sagrada" **e** a origem do bug nº1. Mudá-lo exige mudança coordenada front/back + a verificação por conversa real acima — não só os testes que mockam o modelo.

## A métrica de "pronto" (README)
Pronto = um usuário novo entra, escolhe idioma, consente, nomeia a dupla, calibra, assina o pacto, **recebe a missão**, é conduzido, **valida**, ganha XP e volta no dia seguinte — sem o fundador explicar nada por fora. Hoje a cadeia para em "recebe a missão / é conduzido" por causa de [02] e [03].
