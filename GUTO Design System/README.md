# GUTO Design System

> **GUTO** is a Brazilian Portuguese app for human evolution — training, presence, accountability, with a robotic best-friend avatar. Not a chatbot. Not a generic fitness app. Not a form. The mission: **transform intention into action.**
>
> *"GUTO age como melhor amigo / irmão mais velho: direto, leal, proativo, curto, com postura, sem humilhar."* — `AGENTS.md`

---

## What's in this design system

This folder is everything an agent or designer needs to build a GUTO-branded interface — slides, mocks, throwaway prototypes, or production-adjacent code — without re-deriving the brand from scratch.

**Sources** (read-only, may not be available to readers):
- Codebase: `GUTOO/` — Next.js 14 frontend (`guto-app-v0`) + Express backend (`guto-backend`), local mount.
- GitHub repo: `williangustavosantos-sys/CORPOGUTO` — sibling app workspace (same brand).
- Operational doctrine: `GUTOO/AGENTS.md` (project constitution).
- Production tokens: `GUTOO/app/globals.css` (the canonical source for every color, shadow, and gradient in this file).

**Index of this folder:**

| File | What's in it |
|---|---|
| `README.md` | This file — brand overview, content & visual foundations, iconography. |
| `SKILL.md` | Cross-compatible Agent Skill manifest. |
| `colors_and_type.css` | Raw + semantic CSS variables; type ramp; one import to use the system. |
| `assets/` | Logos (`logo_guto.png`, `icon-guto.svg`), the white-room background (`FUNDO_APP.jpg`), the four language flags, the user avatar. |
| `preview/` | Small HTML cards that populate the Design System tab (palette, type, components). |
| `ui_kits/guto-app/` | Hi-fi recreation of the GUTO mobile app — onboarding, calibration, chat, mission, evolutions. |

There is **one product** in scope: the GUTO mobile-first web app (`guto-app-v0`). The backend is API-only, no UI. There is no marketing site, docs site, or admin product worth a dedicated kit at this time (an admin login screen exists but is a single page).

---

## Products represented

1. **GUTO mobile app** (`guto-app-v0`) — the user-facing product. A single-route Next.js app where the entire onboarding-through-system experience flows inside one shell (`.sala-guto`). Six tabs: **GUTO** (chat), **TREINO** (mission), **DIETA** (diet), **ARENA** (rankings), **EVO.** (evolutions), **PERC.** (path/journey). Four supported languages: `pt-BR`, `en-US`, `es-ES`, `it-IT`.
2. **Login + invite + admin** — auxiliary routes (`/login`, `/convite/[token]`, `/admin/login`) that share the same shell but have no unique components beyond a logo + form.

---

# CONTENT FUNDAMENTALS

GUTO's voice is the brand's most distinctive layer. It is **not** corporate, not therapeutic, not gym-bro. It is **older brother who already loves you**: direct, loyal, a little stoic, never humiliating.

### Tone

- **Curt by mandate.** From `AGENTS.md` §2: GUTO's replies must be "1 a 3 frases, no idioma do usuário." Never preambles. Never disclaimers. Never "I'm sorry, but…".
- **Action-pulling.** Verbs of motion: *bora, vamos, conduz, sustenta, evolua, chega.* The whole UI assumes you came here to do something hard and need a friend who won't let you flake.
- **Calm, not hyped.** No exclamation marks in chrome. No 🔥. No "LET'S GOOO". The signal is composure.
- **You-form (Portuguese "você"/tu) — never "we" for false camaraderie.** GUTO addresses you. It does not pretend to be a team.
- **Mission-coded.** "Pacto", "missão", "percurso", "calibragem". The metaphor is partnership-under-oath, not subscription/service.

### Casing & punctuation

- **All-caps tech labels** are the brand's primary chrome voice. Almost every label, button, eyebrow, tab name and field label is uppercase, mono, with wide tracking.
  Examples: `IDENTIDADE`, `ACESSO RESTRITO`, `ENTRAR`, `MISSÃO`, `XP TOTAL`, `PRÓXIMA EVOLUÇÃO`.
- **Sentence case** is reserved for body copy GUTO actually says — chat bubbles, screen subtitles, exercise names.
- **No emoji.** None in the codebase. Do not introduce them.
- **No exclamation points** in chrome. Sparingly in chat if the moment warrants.
- **Period-as-statement.** `Complete.` `Sem distrações.` `Estamos prontos.` Short sentences ending in a period feel like a verdict.

### Specific examples (lifted from the codebase)

| Surface | pt-BR | en-US |
|---|---|---|
| Chat opener | *"Estamos prontos. Sem distrações."* | *"We're ready. No distractions."* |
| Calibration title | *"Calibragem inicial"* | *"Initial calibration"* |
| Calibration sub | *"Antes de eu te puxar, preciso entender o teu corpo."* | *"Before I pull you, I need to understand your body."* |
| Mission objective | *"Execução controlada. Nada de pressa."* / *"Tempo certo = músculo certo."* | *"Controlled execution. No rush." / "Right tempo = right muscle."* |
| Path quote | *"Você já é mais forte do que ontem. O melhor ainda está por vir."* | *"You are already stronger than yesterday. The best is still ahead."* |
| Login hint | *"Precisa de convite? Fale com seu coach."* | *"Need an invite? Talk to your coach."* |
| Path subtitle | *"O percurso mostra execução, ausência e consequência."* | *"The path shows execution, absence, and consequence."* |
| Evolution copy | *"A evolução não é automática. É construída todos os dias."* | *"Evolution is not automatic. It is built every day."* |

### Thou shalt not

- ❌ Friendly hedges: *"maybe try…", "if you'd like…", "feel free to…"*
- ❌ Emoji of any kind.
- ❌ Bullet-list greetings: *"Here are 3 options for you!"*
- ❌ Marketing superlatives: *"the BEST workout!", "amazing results!"*
- ❌ Apologies. GUTO does not apologize for asking you to show up.

---

# VISUAL FOUNDATIONS

The aesthetic is a **white-room future**: a futuristic capsule lab, all white plastic and glass, lit by a single cyan light source. Everything looks vacuum-formed, debossed, slightly damp. **No drop shadows on dark backgrounds.** No bluish-purple gradients. No emoji cards. No left-border accent cards.

### Background

- **Always light.** Page background is a vertical pale gradient: `linear-gradient(180deg, #edf2f7 0%, #dfe7f0 100%)`. Some screens swap in `var(--guto-bg-portal)` for the multi-stop white-radial portal.
- **The hero shot** is a real photograph of a glossy-white capsule interior with cyan accent lights — `assets/FUNDO_APP.jpg`. Used full-bleed on the chat avatar stage. **Do not redraw it; reuse the asset.**
- **Repeating textures**: a 1px navy hairline at 42px intervals (`repeating-linear-gradient(90deg, rgba(13,35,65,0.025) 0 1px, transparent 1px 42px)`) at 38% opacity multiplied — used on the `.guto-portal-screen::before`. Subtle scan-line effect; do not overdo.

### Color (consume from `colors_and_type.css`)

- **One accent.** `--guto-cyan` `#52e7ff`. Used for the primary CTA fill, focus rings, glows, "alive" indicators, and headings in moments of GUTO's voice. Never used on neutral information.
- **One foreground.** `--guto-navy` `#0d2341`. All primary text, all icons in default state. There is no off-black.
- **Tertiaries are alphas of navy**: `rgba(13,35,65,0.68 / 0.48 / 0.20)`. There is no grey scale in HSL space.
- **Destructive** is `#9d2b2b` (a brick red, not a fire-red). Used very rarely — error toasts only.
- **No purple. No green. No yellow. No orange.** The avatar has color variants (yellow `AMARELO`, purple `ROXO`, red `VERMELHO`) but the chrome around them stays cyan/white.

### Type

- **Primary face: monospace** (`JetBrains Mono` substitute for SF Mono — flagged below). Mono is the UI voice — every label, button, eyebrow, value readout. This is unusual and very deliberate; it carries the "tech / lab / pact" feel.
- **Secondary face: humanist sans** (`Inter Tight` substitute for SF Pro Display) — reserved for the brand mark and rare display moments.
- **Tracking is wide on uppercase.** `letter-spacing: 0.18em–0.30em` on all-caps labels. Default tracking on running text.
- **Weights skew heavy.** 800 / 900 dominate. Light weights (400/300) are not used in chrome.
- **Sizes are small.** UI labels are 9–12px. Headings are 20–24px. Hero moments are 36–56px. The interface trusts its density.

### Spacing & layout

- **Mobile-first, single-column.** The shell is `100dvh × 100vw`, fixed, never scrolls in chrome. Tabs scroll internally.
- **Touch-first.** Hit targets ≥ 56px. The CTA is `h-14` (56px) and pill-shaped. Tab tiles are `clamp(56px, 10.6dvh, 73px)`.
- **Generous breathing room.** `padding-inline: 24–32px` on screen content. `gap: 14–20px` between cards.
- **Safe areas are honored.** `max(env(safe-area-inset-bottom), 12px)` everywhere a nav or input touches the bottom edge.

### Borders, radii, cards

- **Default radius is `1rem` (16px)** — `--guto-radius-lg`. Big cards go `22px`. Buttons & chips go pill (`999px`).
- **Cards are frosted plates**, not flat fills:
  - Background: `rgba(255,255,255,0.82)` over the page gradient
  - Border: `1px solid rgba(193,204,218,0.86)` (a steel hairline)
  - Backdrop-filter: `blur(14–18px)`
  - Outer shadow: `0 14px 30px rgba(122,138,156,0.12)`
  - **Inset deboss** (the signature): `inset 2px 2px 8px rgba(152,163,179,0.22), inset -6px -6px 12px rgba(255,255,255,0.94)` — gives the moulded-plastic look.
- **Inputs are deboss-only.** No outer shadow, no fill — they look pressed-into the panel. Use `var(--guto-deboss)` exactly.

### Shadows: outer vs inner

There are **two distinct shadow systems** and they are not mixed:

| System | Where | Effect |
|---|---|---|
| **Inner deboss** | Inputs, recessed slots, "pressed" buttons, bottom-nav tiles | Plate is **carved into** the surface |
| **Outer chrome** | Floating cards, modals, the Pact title plate | Plate is **lifted above** the surface |
| **Cyan glow** | Active CTA, focused field, voice-active avatar | The element is **alive / on** |

### Transparency & blur

- **Everything that's a card uses `backdrop-filter: blur(14–18px)`** (with `-webkit-backdrop-filter` paired). The white background is meant to be slightly visible through every plate.
- **Frost levels:** 0.16 (faint pane), 0.40 (chip), 0.82 (default card), 0.92 (sidebar / popover).
- Use blur sparingly on dark/cyan accents — only on the avatar stage and pact glow.

### Animation & easing

- **Default duration: 160–280ms.** Snappy, never slow.
- **Easing: `cubic-bezier(0.4, 0, 0.2, 1)`** (Tailwind `ease`) for most transitions. `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances.
- **Tap feedback: `scale(0.96)`** via Framer Motion `whileTap`. Universal.
- **Hover** does not exist on mobile; on web prototypes use `:focus-visible` with `border-color: rgba(82,231,255,1)` + adding `--guto-glow-md`.
- **Never fade to nothing slowly.** `opacity` transitions are 160ms, not 600ms.
- **The Pact** is the one heavy animation moment — concentric cyan rings pulsing, scan lines, particle veins. It earns the showpiece.
- **No bounces.** No anticipation overshoot. The motion is mechanical-precise.
- **Reduced motion is respected** (`@media (prefers-reduced-motion: reduce)`).

### Hover / press states

- **Press = scale(0.96)** + intensified inner deboss (use `--guto-deboss-deep`).
- **Active CTA:** background gets `var(--guto-cyan)` solid; text stays navy; box-shadow gains `0 4px 20px rgba(82,231,255,0.30)`.
- **Focus:** `outline: none` always, replaced with `box-shadow: 0 0 0 1px var(--guto-cyan), 0 0 18px rgba(82,231,255,0.42)`.
- **Disabled:** `opacity: 0.5`, no glow, no press.

### Imagery

- **Avatar videos.** GUTO himself is a 3D animated character delivered as `.webm` and `.mov` (alpha) — see `GUTOO/public/assets/guto/GUTO_*.webm`. Four life stages: BABY → TEEN → ADULT → ELITE. Color variants exist (default blue, AMARELO yellow, ROXO purple, VERMELHO red) but only the default blue is shipped to the first demo. **Never substitute with a static avatar** — the motion is the personality.
- **Background photo (`FUNDO_APP.jpg`)** is the only photographic asset. Crisp, white, slightly cool. No grain. No filters.
- **No stock photos. No illustrations of people. No icons of organs / muscles / bodies.** The product talks about the body without showing one.

### Layout rules — fixed elements

- Bottom nav: 6-up grid, fixed-bottom, `91.54%` width centered, gap `clamp(2px, 1.5vw, 6px)`.
- Top strip: `rgba(255,255,255,0.4)` + `backdrop-filter: blur(5px)`, contains the GUTO mark left + partner name right.
- Chat input: anchored to `var(--guto-chat-input-bottom)` which dynamically lifts above the keyboard.

---

# ICONOGRAPHY

GUTO uses **Lucide React** (`lucide-react`) as its icon library — confirmed in `GUTOO/components/guto/bottom-navigation.tsx` and throughout the screens. Stroke-based, 2px stroke, geometric, monoline.

### Source

```js
import { Dumbbell, MapPin, MessageCircle, Swords, TrendingUp, UtensilsCrossed,
         Activity, ArrowLeft, Check, Fingerprint, Languages, Send, Settings,
         UserRound, Volume2, Zap, Loader2, Mic } from "lucide-react"
```

In **HTML/static contexts**, link Lucide via CDN:
```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="dumbbell"></i>
<script>lucide.createIcons();</script>
```

### Style rules

- **Stroke width: 2.4px** in active state (see bottom-nav: `stroke-[2.4]`), 2px elsewhere. Lucide's default is 2.
- **Default size: 22px** in nav, 18–20px inline, 32–40px in feature contexts. The Pact ring sub-icons go 56px+.
- **Color follows text.** Default `var(--fg2)` rgba(13,35,65,0.56). Active state `var(--guto-cyan)` with a `drop-shadow(0 0 8px rgba(82,231,255,0.48))` glow.
- **Never filled.** All icons are stroke-only. If you need filled, use the cyan-bg pill button as the affordance.

### Logo & brand marks

- **`assets/logo_guto.png`** — full chrome wordmark with a brushed-metal gradient and cyan inner glow. Used on portals, login, and the chat top bar. Do **not** recolor or recreate; the gradient is hand-tuned.
- **`assets/icon-guto.svg`** — square mark for favicons / app icons.
- **`assets/apple-icon.png`** — iOS home-screen icon.

### Language flags (curated set)

The four supported locales each have a custom hand-drawn SVG vector under `assets/idioma-{portugues,english,italiano,espanol}.svg`. These appear on the language-selection screen, perspective-tilted in a 2-up grid. Reuse as-is; do not substitute with emoji flags 🇧🇷🇺🇸 or country shapes — the brand uses these specific vectors.

### Are unicode / emoji used?

**No.** A grep across `GUTOO/components/` finds no emoji in JSX or copy. The closest thing is a single `&` ampersand styled as a chrome pill in the `GUTO & {USER NAME}` lockup. Do not introduce emoji.

---

# Substitutions & flags

The codebase uses **SF Pro Display** and **SF Mono** — Apple's system fonts, not freely licensed for distribution. We've substituted:

- `SF Pro Display` → **Inter Tight** (Google Fonts). Closest humanist sans in weights 400–900.
- `SF Mono` → **JetBrains Mono** (Google Fonts). Closest geometric monospace.

Both are loaded from Google Fonts in `colors_and_type.css`.

> 🚩 **Ask the user:** if you have licensed `.ttf`/`.otf` files for SF Pro Display and SF Mono, drop them in `fonts/` and we'll swap the `@import` to a local `@font-face`. The substitutes preserve the visual rhythm but are slightly wider on the mono and lighter on the display.

The only icon library used is Lucide; no substitutions were necessary.
