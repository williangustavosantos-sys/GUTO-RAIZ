---
name: guto-new-screen
description: "Protocolo completo para criar uma nova tela no GUTO. Use quando o usuário pedir para criar, construir ou adicionar uma nova tela, página, fluxo ou componente de tela inteira no app. Cobre design → estrutura de arquivo → implementação → navegação → QA."
---

# New Screen — Protocolo de Criação de Tela GUTO

Protocolo completo para criar uma nova tela no projeto GUTO de forma consistente, segura e com qualidade de produto.

---

## Passo 1 — Entender o Escopo

Antes de qualquer código, confirmar com o usuário:

1. **Nome da tela**: como será chamada (ex: `WorkoutSummaryScreen`)
2. **Objetivo**: o que o usuário faz nesta tela?
3. **Entrada**: de onde o usuário chega até aqui?
4. **Saída**: para onde vai depois?
5. **Dados**: quais dados a tela precisa exibir ou coletar?
6. **Fluxos críticos**: esta tela faz parte de algum flow crítico (validação, onboarding, ranking)?

---

## Passo 2 — Design System

### 2.1 Verificar MASTER.md
```bash
cat /Users/williandossantos/GUTOO/design-system/MASTER.md 2>/dev/null | head -60
ls /Users/williandossantos/GUTOO/design-system/pages/ 2>/dev/null
```

### 2.2 Se a tela tem necessidade visual específica
```bash
# Verificar override existente ou criar novo
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "fitness [contexto da tela]" \
  --domain ux -n 8

python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "[feature principal da tela]" \
  --stack react-native
```

### 2.3 Consultar ui-ux-pro-max para UX do contexto
Sempre rodar ao menos uma busca de UX antes de implementar:
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "[tipo de tela: form, list, detail, validation, onboarding, dashboard]" \
  --domain ux -n 6
```

---

## Passo 3 — Estrutura de Arquivo

### Convenção de localização
```
app/
  screens/
    [NomeDaTela]/
      index.tsx          ← componente principal
      [NomeDaTela].tsx   ← se preferir nome explícito
  components/
    [ComponenteEspecifico]/
      index.tsx
```

### Template base de tela

```tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

interface [NomeDaTela]Props {
  // props do navigator se necessário
}

export function [NomeDaTela]({ }: [NomeDaTela]Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* conteúdo */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '[cor do design system]',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
```

**Regras obrigatórias do template:**
- Sempre `SafeAreaView` na raiz
- Sempre `StyleSheet.create` para estilos (não inline objects)
- Exportar como named export (não default)
- Props tipadas com interface

---

## Passo 4 — Implementação

### Ordem de desenvolvimento

1. **Estrutura estática** — layout sem lógica, dados mockados
2. **Tipagem** — types/interfaces para todos os dados
3. **Lógica de estado** — useState, useEffect se necessário
4. **Integração de dados** — API calls, Context, hooks
5. **Animações e feedback** — loading, pressed states, transitions

### Checklist durante implementação

- [ ] `accessibilityLabel` em todos os botões de ícone
- [ ] Touch targets ≥ 44pt (usar `hitSlop` se necessário)
- [ ] Safe areas respeitadas
- [ ] Loading state implementado para qualquer dado assíncrono
- [ ] Empty state implementado se a tela pode ter lista vazia
- [ ] Error state implementado para falhas de rede
- [ ] Nenhum emoji como ícone (usar @expo/vector-icons)
- [ ] Cores do design system (não hex hardcoded)

---

## Passo 5 — Navegação

### Registrar a tela no navigator
Localizar o navigator correto:
```bash
grep -rn "Navigator\|Stack\|Tab" --include="*.tsx" src/ app/ 2>/dev/null | grep -v node_modules | grep -i "navigator"
```

Adicionar a rota:
```tsx
// No navigator correto
<Stack.Screen
  name="[NomeDaTela]"
  component={[NomeDaTela]}
  options={{ title: '[Título]' }}
/>
```

### Tipagem de navegação
Adicionar ao tipo do RootStackParamList (ou equivalente):
```ts
[NomeDaTela]: {
  // parâmetros se houver
} | undefined;
```

---

## Passo 6 — QA da Tela Nova

Executar `/guto-screen-audit` na tela recém-criada + verificar:

```bash
# TypeScript
npx tsc --noEmit 2>&1 | grep "[NomeDaTela]"

# Verificar que a tela é alcançável via deep link / navegação normal
grep -rn "[NomeDaTela]" --include="*.tsx" --include="*.ts" src/ app/ 2>/dev/null | grep -v "\.d\.ts"
```

**Testes manuais obrigatórios:**
- [ ] Tela abre a partir do flow de entrada correto
- [ ] Back funciona e volta para onde deveria
- [ ] Layout correto em 375px e 428px
- [ ] Safe area não corta conteúdo
- [ ] Loading, empty e error states funcionam
- [ ] Nenhum crash em Android e iOS

---

## Notas Específicas do GUTO

| Tipo de Tela | Atenção Especial |
|---|---|
| Tela com câmera | `Camera` permissions, `WorkoutValidationFlow` como referência |
| Tela de onboarding | Seguir sequência: idioma → convite → calibragem → pacto |
| Tela de chat | Input não pode ficar escondido pelo teclado |
| Tela de ranking | Mostrar dupla (GUTO & nome), não nome solo |
| Tela do avatar | Garantir os 4 estágios distinguíveis |
| Tela com XP | Nunca mostrar XP como intensidade — sempre consistência |
