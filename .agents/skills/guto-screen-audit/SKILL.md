---
name: guto-screen-audit
description: "Auditoria completa de UI/UX de uma tela do GUTO. Use quando o usuário pedir para revisar, melhorar, auditar ou checar a qualidade visual de uma tela ou componente. Combina as diretrizes da ui-ux-pro-max com o checklist específico do GUTO para gerar um relatório de problemas e recomendações priorizados."
---

# Screen Audit — Auditoria de Tela GUTO

Auditoria de UI/UX de uma tela específica do projeto GUTO usando `ui-ux-pro-max` como motor de análise.

---

## Passo 1 — Identificar a Tela

Confirmar com o usuário:
- Nome da tela / componente principal
- Arquivo(s) envolvido(s)
- Contexto de uso (onboarding, treino diário, chat, ranking, etc.)

Ler o arquivo da tela antes de qualquer análise:
```bash
# Localizar o componente
grep -rn "export.*[NomeDaTela]" --include="*.tsx" src/ app/ 2>/dev/null
```

---

## Passo 2 — Consultar ui-ux-pro-max

Rodar a busca de UX para o contexto da tela:

```bash
# Busca geral de UX para o contexto da tela
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "[contexto da tela] fitness mobile" --domain ux -n 10

# Busca de estilo se a tela tem decisão visual
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "[palavras-chave visuais]" --domain style -n 5

# Se tiver formulário ou feedback
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "form feedback validation" --domain ux -n 5

# Melhores práticas React Native para a tela
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "[componentes chave]" --stack react-native
```

---

## Passo 3 — Checklist de Auditoria por Prioridade

### CRÍTICO (bloqueia entrega)

**Acessibilidade**
- [ ] Todos os botões de ícone têm `accessibilityLabel`
- [ ] Contraste de texto ≥ 4.5:1 (especialmente texto sobre fundo do avatar/cápsula)
- [ ] Ordem de foco do screen reader segue a ordem visual
- [ ] Imagens com `accessibilityLabel` ou `accessible={false}` se decorativas

**Touch e Interação**
- [ ] Touch targets ≥ 44×44pt (incluindo botões pequenos de ícone)
- [ ] Espaçamento ≥ 8pt entre targets tocáveis
- [ ] Feedback visual em ≤ 150ms após toque (ripple, opacity, scale)
- [ ] Ações assíncronas desabilitam o botão e mostram loading

### ALTO (corrigir antes de release)

**Layout e Responsividade**
- [ ] Funciona em 375px (iPhone SE) e 428px (iPhone Pro Max)
- [ ] Safe areas respeitadas (notch, Dynamic Island, barra de gestos)
- [ ] Sem scroll horizontal
- [ ] Conteúdo não fica escondido atrás de tab bar ou header fixo
- [ ] `min-h-dvh` ou `flex: 1` corretamente usado para tela cheia

**Identidade GUTO**
- [ ] Nenhum emoji usado como ícone estrutural (usar @expo/vector-icons)
- [ ] Cor dos olhos do GUTO: azul (#007AFF aproximado, verificar design system)
- [ ] Personalidade do avatar não comprometida por overlays ou badges
- [ ] Nome da dupla "GUTO & [nome]" visível se for tela principal

### MÉDIO (melhorar na próxima iteração)

**Tipografia e Cor**
- [ ] Fonte ≥ 16px para texto de corpo (evita auto-zoom iOS)
- [ ] Line-height ≥ 1.5 para parágrafos
- [ ] Cores usando tokens semânticos, não hex hardcoded
- [ ] Hierarquia visual clara (heading bold, body regular, label medium)

**Animação**
- [ ] Transições entre 150–300ms
- [ ] Animações usando `transform` e `opacity` (não `width`/`height`)
- [ ] `useReducedMotion` respeitado para usuários com sensibilidade a movimento

**Estado Vazio e Loading**
- [ ] Estado de loading com skeleton/shimmer (não tela em branco)
- [ ] Estado vazio com mensagem + ação (não lista em branco)
- [ ] Erro de rede com mensagem + botão de retry

---

## Passo 4 — Relatório de Saída

Formato do relatório:

```
SCREEN AUDIT — [Nome da Tela]
===============================

CRÍTICO (N problemas)
- [problema]: [arquivo:linha] → [solução recomendada]

ALTO (N problemas)
- [problema]: [arquivo:linha] → [solução recomendada]

MÉDIO (N problemas)
- [problema] → [solução recomendada]

POSITIVO (o que está bom)
- [o que está bem implementado]

PRÓXIMOS PASSOS SUGERIDOS
1. [ação mais impactante]
2. [segunda ação]
```

---

## Notas Específicas do GUTO

- **Tela de câmera / validação**: checar `safe-area-awareness` e que o frame de encaixe de rosto está centralizado em todos os tamanhos de tela
- **Chat**: checar que a área de input não fica escondida pelo teclado virtual
- **Ranking/Arena**: checar que duplas (não nomes solo) aparecem em todos os breakpoints
- **Avatar**: checar que os 4 estágios são visualmente distintos e legíveis em dark e light mode
