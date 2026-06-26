# GUTO — Guia de Engenharia para IAs

> Manual de como **escrever código** no GUTO sem recriar o ciclo de regressão. Pré-requisito: `GUTO_AI_ONBOARDING.md`, `GUTO_DECISION_ARCHITECTURE.md`, `GUTO_SYSTEM_ARCHITECTURE.md`.

---

## 1. A regra mãe

> **Nunca conserte um bug criando um novo centro de decisão.**

A causa-raiz das regressões do GUTO é o "parlamento de cérebros". Cada `gate`/regex/`if` novo que **decide** o turno aprofunda a doença. A correção certa quase sempre é: **levar a decisão para o cérebro e dar a ele o contexto que faltava** — não adicionar mais um decisor.

## 2. As 10 regras inegociáveis

1. **Nunca adicione um novo gate para resolver um caso isolado.** Se um caso específico quebra, o cérebro não tinha o contexto certo — corrija o contexto, não a periferia.
2. **Sempre procure a causa arquitetural.** Pergunte "por que este bug é possível?", não só "onde ele acontece?". Um bug é quase sempre uma decisão nascendo no lugar errado, ou duas fontes de verdade.
3. **Sempre verifique o impacto no organismo inteiro.** Uma mudança no cérebro afeta chat, treino, dieta, proatividade, memória e idioma de uma vez. Liste o que mais toca antes de mudar.
4. **Faça o menor fix que resolve a causa.** Se a correção exige muitas linhas ou um novo decisor, **pare e explique** — provavelmente o desenho está errado.
5. **Uma só verdade.** Nunca crie um segundo lugar que guarda o mesmo estado. Leia e escreva na fonte única e durável.
6. **Persistência honesta.** Só responda "salvei/anotei/ajustei" depois da gravação confirmada. Em falha, rollback e fala honesta.
7. **Idioma na origem.** A fala nasce no idioma do usuário, no cérebro. Não traduza depois. País ≠ idioma.
8. **Trilhos fechados.** Prescrição só dentro do catálogo validado (exercício com vídeo, `NÃO COMO`, país). Respeite `lockedByCoach`.
9. **Próximo passo sempre.** Todo turno termina com `next_step`/`expectedResponse` não-vazio.
10. **Controle nunca vira fala.** Marcadores internos (`[CONFIRMAÇÃO PENDENTE]` etc.) jamais aparecem ao usuário.

## 3. Como abordar um bug (protocolo)

```txt
1. Reproduza ao vivo com o MODELO REAL e estado persistido (não confie no mock).
2. Classifique a causa nos 4 papéis: a decisão nasceu no lugar errado?
   há duas fontes de verdade? faltou contexto ao cérebro? vazou controle?
3. Escreva/atualize a TRANSCRIÇÃO DOURADA que captura o comportamento certo.
4. Corrija a CAUSA (geralmente: dar contexto ao cérebro / consolidar verdade),
   não o sintoma (geralmente: adicionar um gate).
5. Rode as transcrições douradas contra o modelo real. Verde só conta aqui.
6. Verifique regressão nos fluxos vizinhos do organismo.
```

## 4. Testes: por que o verde atual mente, e o que confiar

- A suíte roda com o **modelo mockado** ("modelo mockado vazio"). Ela testa os gates determinísticos e os fallbacks — **não** o comportamento real do GUTO. Por isso fica verde enquanto o app quebra.
- **Os testes mockados continuam úteis** como rede determinística (contratos, segurança, trilhos). Não os jogue fora. Mas eles **não** são critério de "pronto".
- **O critério de pronto são as transcrições douradas** (golden transcripts): conversas reais, rodadas contra o **Gemini de verdade**, com **estado persistido**, cobrindo os fluxos que importam. Cada bug encontrado ao vivo vira uma transcrição nova.
- **Nunca diga "está pronto" sem validar o comportamento completo ao vivo.** Teste mockado verde não autoriza essa frase.

## 5. Refatorar com segurança (não cometer suicídio técnico)

- **Reescrita big-bang do backend = proibida.** Reescrever o monólito do zero perde anos de regras de segurança embutidas e introduz cem bugs novos sem nunca ter um sistema funcionando.
- **Decomposição cirúrgica = obrigatória.** Regra: **nunca extraia/mova nada sem antes ter a transcrição dourada daquele fluxo passando contra o modelo real.** Primeiro a rede, depois o corte. Um pedaço por vez, o app sempre funcionando.
- Comece pelo orquestrador do turno de chat (consolidar no cérebro). Depois, um fluxo por vez.

## 6. Modelo e custo (contexto técnico)

- **Motor ativo de chat/dieta:** Google **Gemini** (`generativelanguage`). **OpenAI** só para transcrição de áudio. O `@anthropic-ai/sdk` aparece no `package.json` mas hoje é juiz de eval, **não** o motor.
- Um cérebro soberano precisa ser **esperto o bastante para interpretar**. Se a qualidade de decisão for fraca, avalie um modelo mais forte **no turno do cérebro** (é um modelo por turno, não o app inteiro) — decisão consciente de custo, não automática.
- O LLM **nunca** opera solto: sempre dentro do contrato de turno, com memória injetada e trilhos fechados.

## 7. Higiene de mudança

- **Não misture áreas** numa mesma mudança sem autorização (calibragem ≠ painel ≠ XP ≠ prompt).
- **Não crie mocks que parecem dados reais** sem marcá-los como fase visual/demo.
- **Não leia/exponha segredos** de `.env`.
- **Respeite os submódulos:** GUTO-RAIZ aponta para CEREBROGUTO e CORPOGUTO; mudanças de comportamento quase sempre vivem no cérebro.
- **Documente a decisão**, não só o diff: registre qual papel cada peça assumiu e por que a decisão ficou no cérebro.

## 8. Checklist antes de abrir PR

- [ ] A correção atacou a **causa arquitetural**, não o sintoma.
- [ ] **Nenhum gate novo** decide o turno; a decisão ficou (ou voltou) ao cérebro.
- [ ] **Uma só verdade**; estado persiste de verdade (sobrevive a sair/voltar e redeploy).
- [ ] **Transcrições douradas** relevantes passam **com o modelo real**.
- [ ] Verifiquei **fluxos vizinhos** do organismo (sem regressão).
- [ ] Fala no **idioma correto**; **próximo passo** presente; **persistência honesta**.
- [ ] Não vazou marcador interno; não chutei default; não menti "salvei".
- [ ] Um usuário comum aguentaria **10–20 min sem sentir chatbot quebrado**.
