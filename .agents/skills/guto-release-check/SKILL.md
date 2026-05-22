---
name: guto-release-check
description: "Verificação completa pré-release ou pré-merge do projeto GUTO. Use antes de criar um PR, antes de merge em main/feat branches, ou quando o usuário disser 'vamos fazer release', 'preparar para merge', 'criar PR'. Cobre TypeScript, flows críticos, performance, dependências, segurança e checklist de produto."
---

# Release Check — Projeto GUTO

Execute este protocolo completo antes de qualquer merge em branch principal ou release.

---

## Fase 1 — Código

### TypeScript
```bash
npx tsc --noEmit
```
**Critério de passe:** zero erros. PR não segue com erros de tipo.

### Lint
```bash
npx eslint . --ext .ts,.tsx 2>&1 | grep -E "error|warning" | head -30
```
Erros de lint bloqueiam. Warnings documentar.

### Console.logs
```bash
grep -rn "console\.log" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | grep -v "\.test\." | grep -v "// "
```
Zero `console.log` em código de produção.

---

## Fase 2 — Flows Críticos (teste manual obrigatório)

Confirmar com o usuário se os flows abaixo foram testados manualmente:

- [ ] **Abertura do app** — cápsula abre, animação roda, GUTO aparece
- [ ] **Onboarding completo** — idioma → convite/login → calibragem → pacto
- [ ] **Chat com GUTO** — mensagem enviada, resposta recebida com personalidade correta
- [ ] **Treino do dia** — exercícios carregam com vídeo, botão de dúvida funciona
- [ ] **Validação de treino** — câmera abre, rosto encaixa, 3s, voz detectada, foto salva
- [ ] **Percurso** — cards dos últimos 5 treinos aparecem corretamente
- [ ] **Dieta da semana** — refeições carregam, botão de dúvida funciona
- [ ] **Arena/Ranking** — duplas aparecem com XP correto
- [ ] **Navegação back** — back em todos os flows funciona sem quebrar stack

Se algum não foi testado: documentar explicitamente no PR.

---

## Fase 3 — Segurança

```bash
# Verificar chaves/secrets expostos
grep -rn "sk-\|pk-\|API_KEY\|api_key\|secret\|password\|token" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | grep -v ".env\|process\.env\|Constants\."
```

- [ ] Nenhuma chave de API hardcoded
- [ ] Variáveis de ambiente lidas via `process.env` ou `Constants.expoConfig`
- [ ] `.env` não commitado (verificar `.gitignore`)

---

## Fase 4 — Dependências

```bash
npm list --depth=0 2>/dev/null | grep "UNMET\|invalid" || echo "OK"
```

```bash
# Verificar se há pacotes duplicados problemáticos
npx expo-doctor 2>/dev/null | head -20
```

- [ ] Nenhuma dependência com peer conflict não resolvido
- [ ] Expo SDK compatível com todos os pacotes nativos
- [ ] `package-lock.json` ou `yarn.lock` atualizado

---

## Fase 5 — Checklist de Produto

- [ ] Personalidade do GUTO intacta (tom, olhos azuis, cápsula)
- [ ] Dupla "GUTO & [nome]" aparece no topo corretamente
- [ ] Avatar nos estágios corretos (Baby/Teen/Adult/Elite)
- [ ] XP calculado por consistência (não só intensidade)
- [ ] Nenhuma feature nova não solicitada incluída no PR
- [ ] Descrição do PR explica o "porquê", não só o "o quê"

---

## Fase 6 — Branch e Git

```bash
git status
git diff main...HEAD --stat 2>/dev/null || git diff feat/round2-hardening...HEAD --stat
```

- [ ] Branch atualizada com a base (sem conflitos pendentes)
- [ ] Commits com mensagens descritivas
- [ ] Nenhum arquivo sensível staged (`.env`, credenciais)

---

## Saída Esperada

```
GUTO Release Check — [nome da branch]
========================================
✅ TypeScript: 0 erros
✅ Lint: 0 erros (N warnings)
✅ Console.logs: nenhum
✅ Segurança: nenhuma chave exposta
⚠️ Flows testados manualmente: [listar] | Não testados: [listar]
✅ Produto: personalidade intacta, dupla OK, avatar OK
```
