# Handoff: GUTO App — Design System Completo

## Overview
GUTO é um app de fitness/saúde com mascote que acompanha o usuário em treinos, dietas e arena social. Este pacote contém o design completo: **15 telas do fluxo principal** (01 → 15) + **13 telas de Ajustes/Configurações** (20 → 32).

## About the Design Files
Os arquivos neste pacote são **referências de design criadas em HTML/JSX** — protótipos de alta fidelidade mostrando aparência e comportamento pretendidos, **não código de produção**. A tarefa é **recriar esses designs no ambiente do codebase alvo** (Next.js, React Native, SwiftUI etc.) usando padrões e bibliotecas já estabelecidos. Se não houver codebase ainda, escolha o framework mais apropriado.

## Fidelity
**Alta fidelidade (hifi)** — cores, tipografia, espaçamentos, sombras, glows e animações estão definidos com precisão. O dev deve buscar fidelidade pixel-perfect usando as libs do codebase.

## Design Tokens

### Cores (paleta GUTO)
```
charcoal:  #2D3748   (texto principal)
exec:      #4A5568   (texto secundário)
soft:      #5A7CA8   (texto de apoio / azul-cinza)
cyan:      #52e7ff   (cor de marca / acentos / glows)
deepNavy:  #0d2341   (texto escuro em superfícies claras)
white:     #ffffff
bgGrad:    radial-gradient(120% 80% at 50% 0%, #f4f8fc 0%, #d9e3ee 60%, #c1d4e8 100%)
```

### Tipografia
- **Família principal:** `"Inter", "Montserrat", system-ui, sans-serif`
- **Pesos:** 500 (body), 700 (input), 800 (botões/labels), 900 (títulos)
- **Mono (uso restrito):** `"JetBrains Mono", monospace` apenas em kickers de header e numeração de seções
- **Letter-spacing comuns:** 0.18em (títulos), 0.24–0.32em (labels/botões uppercase)

### Espaçamentos / radii / sombras
- Phone frame: 393×852, border-radius 56, viewport notch 28×26
- Cards (Plate): radius 22, padding 16×18, backdrop-filter blur(18px)
- Botões CTA: height 50, border-radius 999, border `1px solid #52e7ff`
- Glow padrão: `0 0 14px rgba(82,231,255,0.32)` + `inset 0 1px 0 rgba(255,255,255,0.92)`

### Background "Cápsula"
Imagem `assets/fundo.jpg` em `object-fit: cover`, `transform: scale(1.05)`, `filter: saturate(1.05) brightness(1.02)` + overlay gradiente:
```css
linear-gradient(180deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.18) 22%,
                       rgba(255,255,255,.08) 50%, rgba(255,255,255,.45) 78%,
                       rgba(220,232,244,.85) 100%),
radial-gradient(120% 60% at 50% 8%, rgba(82,231,255,.16), transparent 60%)
```
Pilares laterais ciano: `width 1.5px`, gradiente vertical 0→0.65→0, glow `0 0 10px rgba(82,231,255,0.7)`.

## Telas (visão geral)

### Bloco A — Onboarding + App principal (01 → 15)
| # | Nome | Propósito |
|---|------|-----------|
| 01 | Idioma | Seleção de idioma com bandeiras circulares |
| 02 | Login | Email + senha |
| 03 | Cadastrar Senha | Criação de senha |
| 04 | Termos | Aceite de termos |
| 05 | Nome | Captura de nome do usuário |
| 06 | Calibragem | Gênero, idade, peso, altura, IMC, restrições, intolerâncias/alergias, objetivo, local |
| 07 | Pacto Inicial | Hold-to-confirm com digital |
| 08 | Chat | GUTO mascote + bubble + input + botão de voz on/off |
| 09 | Treino | Lista de exercícios com vídeos placeholder |
| 10 | Dieta | Refeições + macros |
| 11 | Arena Semana | Ranking semanal |
| 12 | Arena Mês | Ranking mensal |
| 13 | Arena Individual | Perfil de competidor |
| 14 | Percurso | Calendário + progresso diário |
| 15 | Evolução | Níveis do mascote |

### Bloco B — Ajustes (20 → 32)
| # | Nome |
|---|------|
| 20 | Menu Configurações |
| 21 | Idioma (mesma estrutura da 01) |
| 22 | Alterar Nome |
| 23 | Perfil |
| 24 | Objetivo |
| 25 | Local de Treino |
| 26 | Limitações |
| 27 | Peso e Altura |
| 28 | Onde Mora |
| 29 | Restrições Alimentares |
| 30 | Intolerâncias / Alergias |
| 31 | Privacidade e Dados |
| 32 | Excluir Conta |

## Componentes-chave
- **Capsule** (chrome de tela com fundo + pilares ciano) — `screens-v2.jsx` linha 40
- **Plate** (card translúcido com blur) — `screens-v2.jsx`
- **BottomNav** (5 abas: Chat, Treino, Dieta, Arena, Percurso) — `components.jsx`
- **Mascot** (vídeo webm em loop com mask circular) — `mascot.jsx`
- **Chips/segmented controls** (gênero, objetivo, local, estado)
- **NumPlate** (input numérico read-only com glow) — calibragem

## Interações
- **Pacto inicial** (07): hold por ~1.5s preenche anel; ao completar, digital fica cyan glow
- **Chat voz** (08): toggle ON/OFF muda ícone + glow + label "VOZ ON"/"VOZ OFF"
- **Chips selecionáveis**: estado on = `border 1.5px cyan + bg rgba(82,231,255,0.18) + box-shadow glow`
- **Bottom nav**: tab ativa com cyan accent

## Assets
Em `assets/`:
- `fundo.jpg` — background unificado das cápsulas
- `logo.png` — logo GUTO
- `body-xray.png` — silhueta para calibragem
- `digital.png` — impressão digital do pacto
- `guto-baby.webm`, `guto-teen.webm`, `guto-adult.webm`, `guto-elit.webm` — mascotes (4 fases evolutivas)
- `guto-baby-super.webm`, `guto-teen-super.webm`, `guto-adult-super.webm`, `guto-elit-super.webm` — mesmas fases com a roupa "super" (usadas no chat interativo)
- `idioma-{portugues,english,espanol,italiano}.svg` — bandeiras

## Arquivos
- `Vistoria 32 Telas.html` — visão consolidada (sem chrome)
- `Todas as Telas.html` — grid 01→15 (React-mounted)
- `Telas de Configuração.html` — grid 20→32 (HTML estático)
- `screens-v2.jsx` — telas 02–15 (Auth, Calibration, Chat, Percurso, Evolutions, Treino, Dieta, Arena)
- `screens-extra.jsx` — telas 01 (Language), 03 (CadastrarSenha), 05 (Name)
- `components.jsx` — átomos compartilhados (Plate, Header, BottomNav, Sub, Title, Body)
- `mascot.jsx` — componente Mascot (webm loop)

## Notas para implementação
- Usar React + Inter (Google Fonts ou local). NÃO usar fontes do sistema.
- Botões nunca têm `text-transform: uppercase` no CSS — o conteúdo já vem em maiúsculas onde aplicável.
- Mascote deve ter `playsInline muted loop autoplay` no `<video>`.
- O fundo é uma imagem real, não SVG — manter o asset `fundo.jpg`.
- Hit targets mínimos de 44×44px em toda a UI mobile.
