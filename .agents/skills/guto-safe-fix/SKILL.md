---
name: guto-safe-fix
description: "Protocolo de correção segura de bugs no GUTO. Use quando o usuário reportar um bug, comportamento inesperado, erro de TypeScript, crash, ou quando um flow crítico parar de funcionar. Garante análise antes de mudança, blast radius mínimo e verificação pós-fix."
---

# Safe Fix — Protocolo de Correção Segura

Todo bug no GUTO passa por este protocolo: **leia antes de escrever, entenda antes de mudar, verifique depois de corrigir.**

---

## Fase 1 — Diagnóstico (NUNCA pular)

### 1.1 Reproduzir o problema
Antes de qualquer mudança, entender:
- Em qual tela/flow o bug ocorre?
- Qual o comportamento esperado vs atual?
- É reproduzível 100% ou intermitente?
- Ocorre em iOS, Android ou ambos?

### 1.2 Localizar o código relevante
```bash
# Buscar o componente/arquivo pelo nome da tela ou função
grep -rn "[nome do componente/função]" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null
```

### 1.3 Ler o arquivo antes de editar
**Obrigatório:** usar a ferramenta Read no arquivo antes de qualquer Edit ou Write. Entender:
- O que o código está tentando fazer?
- Quais outros componentes dependem deste?
- Existe estado compartilhado (Context, Zustand, Redux) envolvido?

### 1.4 Identificar a causa raiz
Perguntar:
- É um erro de lógica, de tipo, de estado ou de efeito colateral?
- O bug existe no próprio componente ou vem de dados/estado externo?
- A mudança necessária afeta outros flows?

---

## Fase 2 — Planejamento da Correção

### Blast Radius Mínimo
- Alterar **apenas** o necessário para corrigir o bug
- Não refatorar código adjacente "enquanto está aqui"
- Não melhorar nomes de variáveis não relacionadas
- Não adicionar funcionalidades durante um fix

### Verificar Impacto
Antes de editar, checar se o arquivo tem:
- [ ] Outros componentes importando esse arquivo?
- [ ] Testes referenciando esta função?
- [ ] Flows críticos passando por aqui?

```bash
# Quem importa este arquivo?
grep -rn "from '.*[nome-do-arquivo]'" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null
```

---

## Fase 3 — Execução da Correção

### Regras de Ouro
1. **Read** o arquivo completo antes do **Edit**
2. Fazer uma mudança por vez — não bundlar múltiplos fixes em um commit
3. Se o fix exige mudança em mais de 3 arquivos, alertar o usuário antes de prosseguir
4. Preservar tipos TypeScript — não usar `as any` para "resolver" erros de tipo

### Flows Críticos — Cuidado Redobrado
Qualquer fix que toque nos arquivos abaixo exige confirmação explícita do usuário:

| Area | Risco |
|------|-------|
| `WorkoutValidationFlow` | Quebra o fluxo principal de validação |
| Navegação / Navigator | Pode resetar stack e perder estado |
| Sistema de XP | Afeta ranking e motivação do usuário |
| Chat / IA | Pode quebrar personalidade do GUTO |
| Avatar / evolução | Identidade visual do produto |
| Camera / permissions | Pode bloquear feature principal |

---

## Fase 4 — Verificação Pós-Fix

### TypeScript
```bash
npx tsc --noEmit 2>&1 | head -20
```
Fix não está completo se introduziu novos erros de tipo.

### Smoke Test
- O bug original foi corrigido?
- O flow crítico mais próximo ainda funciona?
- Algum comportamento adjacente foi afetado?

### Commit do Fix
```
fix: [descrição curta do que estava quebrado e como foi corrigido]
```

---

## Padrões Comuns no GUTO

| Sintoma | Causas Comuns |
|---------|---------------|
| Câmera não abre | Permissão não solicitada, import de Camera errado, state de loading travado |
| TypeScript `any` explodindo | Props não tipadas, API response sem type guard |
| Navegação quebrando | Stack sendo resetado, parâmetros não passados corretamente |
| XP não atualizando | State local não refletindo backend, cache não invalidado |
| GUTO não responde no chat | Token expirado, erro silenciado, estado de loading travado |
| Avatar no estágio errado | Lógica de threshold de XP incorreta, dado de estágio não sincronizado |
