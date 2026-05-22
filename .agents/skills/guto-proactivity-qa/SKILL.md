---
name: guto-proactivity-qa
description: "Checklist de QA proativo do GUTO. Execute após qualquer mudança de código antes de considerar a tarefa concluída. Use quando o usuário disser 'pronto', 'feito', 'pode revisar', ou antes de sumarizar uma entrega. Verifica TypeScript, console.logs, flows críticos, câmera, navegação e integridade visual."
---

# QA Proativo — Projeto GUTO

Execute este checklist após **toda** mudança de código, antes de reportar o trabalho como concluído.

---

## 1. TypeScript

```bash
npx tsc --noEmit 2>&1 | head -50
```

- Zero erros de compilação tolerados
- Se houver erro: corrigir antes de entregar
- Avisos (`warn`) documentar e mencionar ao usuário se relevantes

---

## 2. Console Logs

```bash
grep -r "console\.\(log\|warn\|error\)" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | grep -v "// " | grep -v test
```

- Nenhum `console.log` de debug em código entregue
- `console.error` só em handlers de erro reais
- Se encontrar: remover ou converter em logger estruturado

---

## 3. Fluxos Críticos Afetados

Checar se a mudança toca em algum destes arquivos/flows:

| Flow | Arquivos-chave a verificar |
|------|--------------------------|
| Câmera / validação | `WorkoutValidationFlow`, `CameraView`, `ValidationScreen` |
| Avatar / evolução | componentes de avatar, lógica de XP/estágio |
| Chat GUTO | componentes de chat, serviço de IA |
| Onboarding | telas de calibragem, naming, pacto |
| Ranking/Arena | lógica de XP, componentes de ranking |
| Navegação | `RootNavigator`, tab navigator, stack screens |

Se tocou em algum: **testar manualmente o fluxo completo** ou documentar que não foi testado.

---

## 4. Imports Quebrados

```bash
# Verifica imports que podem ter sido deixados pendentes
grep -r "from '\.\./" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | grep -v node_modules | head -20
```

Verificar especialmente:
- Arquivos renomeados sem atualizar os imports
- Componentes removidos ainda sendo importados

---

## 5. Integridade Visual (se mudou UI)

- [ ] Touch targets ≥ 44×44pt nos elementos afetados
- [ ] Nenhum emoji usado como ícone estrutural
- [ ] Sem `console.log` visual (texto debug na tela)
- [ ] Cores seguem o design system (não hexadecimais avulsos hardcoded)
- [ ] Comportamento igual em tela pequena (375px) e grande

---

## 6. Verificação Rápida de Segurança

- [ ] Nenhuma chave de API exposta no código novo
- [ ] Nenhum dado sensível do usuário logado
- [ ] Inputs do usuário sanitizados antes de usar

---

## Saída Esperada

Reportar ao usuário:
- ✅ TypeScript: OK (0 erros)
- ✅ Console.logs: nenhum encontrado
- ✅ Fluxos afetados: [listar quais foram verificados]
- ⚠️ [qualquer pendência conhecida com explicação]
