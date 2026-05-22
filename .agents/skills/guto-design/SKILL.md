---
name: guto-design
description: "Decisões de design visual para o GUTO usando ui-ux-pro-max. Use quando o usuário pedir para escolher cores, tipografia, estilo visual, criar um design system, definir como algo deve parecer, ou quando precisar de recomendações de UI para qualquer parte do app. Gera um design system completo calibrado para fitness mobile React Native."
---

# GUTO Design — Motor de Decisão Visual

Usa `ui-ux-pro-max` para gerar decisões de design fundamentadas para o projeto GUTO.

---

## Contexto Fixo do GUTO

Sempre incluir estes parâmetros nas buscas:
- **Produto**: companheiro ativo / fitness / parceiro digital
- **Público**: C-end consumers, adultos, contexto de mobilidade e academia
- **Stack**: React Native (Expo)
- **Palavras-chave permanentes**: `fitness companion mobile vibrant dark-mode gamification`

---

## Passo 1 — Verificar Design System Existente

Antes de qualquer busca, checar se já existe um design system persistido:

```bash
ls /Users/williandossantos/GUTOO/design-system/ 2>/dev/null && cat /Users/williandossantos/GUTOO/design-system/MASTER.md 2>/dev/null | head -50
```

Se `MASTER.md` existir: usá-lo como fonte primária. Buscar `ui-ux-pro-max` só para complementar.

---

## Passo 2 — Gerar Design System (se não existir)

```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "fitness companion gamification mobile vibrant dark-mode evolution avatar" \
  --design-system \
  --persist \
  -p "GUTO" \
  -f markdown
```

Isso cria:
- `design-system/MASTER.md` — fonte da verdade global
- Inclui: estilo, paleta, tipografia, efeitos, anti-padrões

---

## Passo 3 — Buscas por Necessidade

### Escolher paleta de cores
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "fitness gamification vibrant dark electric blue" \
  --domain color -n 5
```

### Escolher tipografia
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "bold modern athletic friendly" \
  --domain typography -n 5
```

### Definir estilo visual
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "dark mode glassmorphism gamification futuristic" \
  --domain style -n 5
```

### UX de uma feature específica
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "[feature específica: câmera, validação, ranking, chat, avatar]" \
  --domain ux -n 8
```

### Guidelines React Native para componente
```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "[componente: list, animation, navigation, camera, modal]" \
  --stack react-native
```

---

## Passo 4 — Override por Tela (se necessário)

Para uma tela específica que precisa de tratamento diferente do MASTER:

```bash
python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py \
  "fitness [contexto específico da tela]" \
  --design-system \
  --persist \
  -p "GUTO" \
  --page "[nome-da-tela]"
```

Isso cria `design-system/pages/[nome-da-tela].md` com as exceções.

---

## Princípios Visuais Fixos do GUTO

Estes nunca mudam independente do que a busca retornar:

| Elemento | Regra fixa |
|---------|-----------|
| Olhos do GUTO | Azul brilhante — identidade da marca |
| Cápsula | Vidro / transparência — glassmorphism é coerente |
| Avatar Baby | Pequeno, arredondado, cute |
| Avatar Elite | Chamas azuis, imponente |
| Dupla no header | "GUTO & [nome]" — sempre visível nas telas principais |
| XP/Ranking | Comunicar conquista com energia, não frieza |
| Ícones | Apenas @expo/vector-icons ou Lucide — zero emojis estruturais |

---

## Saída Esperada

Após executar as buscas, sintetizar e entregar:

```
DESIGN DECISION — [contexto da decisão]
=========================================
Estilo: [nome + justificativa]
Paleta primária: [cor + uso]
Paleta secundária: [cor + uso]
Tipografia: [heading font / body font]
Efeitos: [shadows, blur, radius padrão]
Anti-padrões a evitar: [lista]
Próximos passos: [implementação]
```
