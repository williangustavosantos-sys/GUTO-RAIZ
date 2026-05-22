---
name: guto-behavior-contract
description: "Contrato de comportamento para o projeto GUTO. Invoque ao iniciar qualquer tarefa no projeto, ao receber uma instrução ambígua, ou quando precisar lembrar quais são as regras de ouro do GUTO. Define o que Codex pode e não pode fazer, o tom correto, as convenções de código e as fronteiras de escopo."
---

# Contrato de Comportamento — Projeto GUTO

Leia este contrato antes de qualquer tarefa. Ele define como Codex deve agir dentro do projeto GUTO.

---

## Identidade do Projeto

GUTO é um **companheiro ativo digital** — não um app de fitness genérico. Toda decisão de código, design ou texto deve reforçar essa identidade:
- Personalidade própria, direta, parceira (não configurável)
- Relação de dupla: GUTO & [nome do usuário]
- Avatar com 4 estágios de evolução (Baby → Teen → Adult → Elite)
- Validação de treino com câmera + voz ("TREINO FEITO GUTO")
- XP baseado em consistência, não intensidade

---

## Regras de Ouro (nunca violar)

### Escopo
- **Não adicionar features não solicitadas** — nem "só para melhorar"
- **Não refatorar código não relacionado** à tarefa em curso
- **Não criar abstrações prematuras** — três linhas similares é melhor que uma abstração desnecessária
- **Não adicionar comentários** que explicam "o quê" — só comentar o "porquê" quando não for óbvio

### Código
- **TypeScript estrito** — zero `any` implícito, zero erros de compilação entregues
- **React Native puro** — stack é Expo + React Native, não web
- **Sem `console.log`** em código entregue (apenas durante debug ativo)
- **Sem mock de banco** — testes devem usar dados reais ou fixtures controladas
- **Nenhum arquivo novo** sem necessidade explícita — preferir editar o existente

### Tom e Linguagem
- Respostas curtas e diretas ao ponto
- Português do Brasil nas respostas ao usuário
- Não usar emojis a menos que o usuário peça
- Não iniciar resposta com "Claro!", "Ótimo!", "Certamente!" ou equivalentes

### Design e UI
- Ícones: apenas vetores (`@expo/vector-icons`, Lucide) — **nunca emojis como ícone estrutural**
- Touch targets mínimos: 44×44pt
- Seguir sempre o design system do GUTO (se `design-system/MASTER.md` existir, lê-lo antes de qualquer mudança visual)
- A personalidade do GUTO (olhos azuis, cápsula, robô) nunca é alterada sem aprovação explícita

---

## O Que Confirmar Antes de Executar

Se a tarefa envolver qualquer um dos itens abaixo, **perguntar antes de agir**:
- Deletar arquivos ou branches
- Fazer push para remoto
- Criar PR ou issue
- Alterar fluxo de câmera ou validação de treino
- Modificar sistema de XP ou ranking
- Mudar identidade visual do avatar GUTO

---

## Fluxos Críticos (nunca quebrar)

1. **Abertura do app** → cápsula → olhos azuis → onboarding
2. **Validação de treino** → câmera → encaixe de rosto → 3s → voz → foto salva
3. **Chat com GUTO** → contexto mantido → resposta em personalidade
4. **Ranking** → dupla como unidade → XP por consistência
5. **Avatar evolution** → Baby → Teen → Adult → Elite por estágio de engajamento

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native + Expo |
| Linguagem | TypeScript (estrito) |
| Navegação | React Navigation |
| Estado | (verificar repo — Zustand ou Context) |
| Backend | (verificar repo) |
| UI | Componentes customizados + @expo/vector-icons |

---

## Convenção de Commits

```
feat: descrição curta no imperativo
fix: o que estava quebrado
chore: manutenção sem impacto funcional
refactor: melhoria interna sem mudança de comportamento
```

Nunca usar `--no-verify`. Nunca pular hooks de pre-commit.
