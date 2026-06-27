# GUTO — Processo de Release (da ideia ao "pronto" de verdade)

> Como uma alteração deve nascer, ser validada e chegar ao app sem reabrir o ciclo de regressão. Pré-requisito: `GUTO_ENGINEERING_GUIDE.md`.

---

## 1. Por que existe um processo

O ciclo de regressão do GUTO sobrevive porque **uma só IA diagnostica, implementa e se autoaprova** — sem freio independente, e com um sinal de qualidade (teste mockado) descolado da realidade. O processo abaixo instala dois freios: **papéis separados** e **validação com o modelo real**.

## 2. As fases (em ordem, sem pular)

### Fase 1 — Análise
- Entenda o pedido contra a **visão** (`GUTO_AI_ONBOARDING.md`, `README.md`) e o `*_DETALHADA` da área.
- Pergunte a régua: "isto faz o usuário sentir que alguém pensa por ele?".
- Defina o comportamento-alvo em linguagem de usuário, não de código — e como **conceito/classe**, não como caso isolado.

### Fase 2 — Diagnóstico (IA de Diagnóstico)
- Reproduza ao vivo com o **modelo real** e estado persistido.
- Identifique a **causa arquitetural** (decisão no lugar errado? duas verdades? faltou contexto ao cérebro? controle vazou? especialização por caso?).
- Entregue o **menor fix** que resolve a causa. **Não escreve código aqui.**

### Fase 3 — Implementação (IA de Implementação)
- Recebe o diagnóstico + a **transcrição dourada de comportamento** que precisa ficar verde.
- Faz **só aquilo**, no menor diff.
- Leva a decisão ao cérebro; **não cria gate novo nem ramo por caso**.

### Fase 4 — Validação
- Roda as **transcrições douradas contra o modelo real**, com estado persistido.
- Confere **uma só verdade** (dado igual em chat/missão/dieta/arena/percurso/memória).
- Confere persistência honesta, idioma correto na origem, próximo passo, sem vazamento de controle.

### Fase 5 — Auditoria (IA de Revisão, contexto limpo)
- Revisa o diff contra os CORE_PRINCIPLES e as outras transcrições douradas.
- **Tem poder de veto.** Não viu o chat da implementação (independência).
- Verifica regressão nos fluxos vizinhos do organismo e qualquer especialização por caso introduzida.

### Fase 6 — Deploy
- Backend (CEREBROGUTO) e frontend (CORPOGUTO) atualizados de forma coordenada.
- Garantir variáveis de ambiente de **persistência durável** e storage (selfies) configuradas — disco do host é efêmero.

### Fase 7 — Teste real (pós-deploy)
- Sessão de uso real de **10–20 minutos** como usuário comum.
- Toda quebra encontrada **vira uma nova transcrição dourada de comportamento** e reentra na Fase 2.

## 3. Os papéis de IA (e por que separá-los)

| Papel | Faz | Não faz |
|---|---|---|
| **Diagnóstico** (modelo forte) | acha causa-raiz + menor fix | escrever código |
| **Implementação** | o menor diff sobre o diagnóstico | decidir escopo, aprovar a si mesma |
| **Revisão** (modelo forte, contexto limpo) | vetar contra princípios/regressão | implementar |
| **Juiz final** | a suíte de transcrições douradas com **modelo real** + estado persistido | — |

Regra fixa para todas: *"Não diga que está pronto sem rodar a transcrição dourada ao vivo. Não adicione gate nem ramo por caso para resolver um exemplo — leve a decisão ao cérebro, por classe. Fix mínimo; se precisar de mais, pare e explique."*

## 4. Critérios de "realmente pronto" (Definition of Done)

Uma funcionalidade só está pronta quando **todas** as caixas estão marcadas:

- [ ] Passa nas **transcrições douradas de comportamento** com o **modelo real** (não mockado).
- [ ] **Estado persiste** (sobrevive a sair/voltar de tela e a redeploy).
- [ ] **Uma só verdade** em todas as áreas que mostram o dado.
- [ ] **Decisão única no cérebro**, por classe; nenhum gate novo nem ramo por caso decide o turno.
- [ ] **Próximo passo** em todo turno; **persistência honesta**; **idioma correto na origem**.
- [ ] **Não repergunta** o que já sabe; **não chuta** default; **não vaza** controle.
- [ ] **Sem regressão** nos fluxos vizinhos do organismo.
- [ ] **Nenhuma parte do produto/identidade foi reduzida.**
- [ ] Um usuário comum usa **10–20 min sem sentir chatbot quebrado**.

Qualquer caixa vazia = **não está pronto**, independente de testes verdes.

## 5. Sequenciamento do trabalho (nunca redução do produto)

Uma pessoa só, com IA, não consegue reescrever o cérebro e editar todos os módulos ao mesmo tempo. Por isso o trabalho é **sequenciado** — mas isto **não é, e nunca pode ser apresentado como, redução do produto.**

- **O organismo permanece inteiro e funcionando o tempo todo.** Arena, Avatar, XP, Percurso, Coach, GUTO Online, Dieta, Proatividade, B2B e os três idiomas continuam rodando, aparecendo e fazendo parte da demo — enquanto a consolidação do cérebro acontece.
- **Sequenciar** significa apenas escolher **a ordem** em que cada fluxo migra para o cérebro soberano (um por vez, com transcript de comportamento embaixo). Não significa desligar, esconder ou "adiar" nenhuma parte da identidade.
- **Proibido** qualquer plano, doc ou recomendação que sugira cortar idiomas, módulos ou áreas para "simplificar". A simplificação é sempre da **arquitetura de decisão**.

## 6. A pergunta final de todo release

> "Depois desta mudança, um usuário comum sente mais — ou menos — que existe alguém pensando por ele?"

Se a resposta não for claramente "mais", o release não está pronto, mesmo que tudo compile e os testes passem.
