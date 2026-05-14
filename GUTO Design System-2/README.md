# GUTO Design System

> Design system for **GUTO** — a Brazilian (Portuguese, pt-BR) AI fitness coach platform. Pair-style: every athlete is bonded to "GUTO", an AI alter-ego that grows stages (`baby → teen → adult → elite`) with their XP. The product mixes **fitness coaching**, **gamification (XP / streaks / arenas)**, and an **operations panel** for human coaches and admins.

This system was reverse-engineered from a single design handoff: the Coach Panel (admin/operations surface). The end-user product (athlete-facing app, "PACT" portal) is **referenced in the CSS tokens** but no screens were provided — we documented those tokens but could not visually verify them. See *Caveats* below.

## Sources

| Source | Path |
|---|---|
| Handoff README | `uploads/adm-handoff/README.md` |
| Coach Panel implementation | `uploads/adm-handoff/project/coach-panel/Coach Panel.html` + `panel-*.jsx` |
| Production tokens (referenced) | `uploads/adm-handoff/project/coach-panel/colors_and_type.css` (header note: "Sourced from GUTOO/app/globals.css") |

The Coach Panel was the user's primary work-in-progress when the bundle was exported; it is the implemented artifact.

---

## Two surfaces, one brand

GUTO has two distinct visual modes that share one token vocabulary (cyan accent, mono UI face, frosted-glass plate metaphor, wide-tracked uppercase kickers):

1. **Athlete portal — "white-room futurism"** (light). Documented in `colors_and_type.css` `--guto-*` tokens. Frosted white plates, chrome gradients, cyan glow on action. The portal background is layered white frostings with a subtle steel undertint.
2. **Coach Panel — "blackbox ops"** (dark). Implemented in `coach-panel/`. Near-black ink (`#060912`), cyan-tinted translucent plates, the same JetBrains Mono UI face, the same wide-tracked uppercase labels. Reads as the *administrative inverse* of the same brand.

Use the **white** vocabulary for athlete-facing surfaces (signups, the portal, marketing, slides). Use the **dark** vocabulary for ops/admin/coach tooling.

---

## Content fundamentals

**Language: Brazilian Portuguese (pt-BR).** All copy in the Coach Panel is in pt-BR — `Hoje`, `Alunos`, `Fila de Treinos`, `Fila de Dietas`, `Arena`, `Coaches`, `Times`, `Logs`, `Tweaks`. Translate to English only for international surfaces; default is pt-BR.

**Voice: terse, technical, present-tense, second-person informal (você).** Examples in the wild:
- `Selecione um Time para criar coaches e alunos nele.` ("Select a Team to create coaches and students in it.")
- `Alunos ordenados por urgência. Clique para editar o treino direto.` ("Students ordered by urgency. Click to edit the workout directly.")
- `Estes controles afetam só a aparência e o comportamento do protótipo.`

The voice is operational, not promotional — it tells the operator what they're looking at, never sells. No exclamation marks. No emoji. No marketing fluff.

**Casing:**
- **UPPERCASE WIDE-TRACKED** for all kickers, eyebrows, button labels, pill labels, field labels, status pills, nav items: `HOJE`, `EM DIA`, `ATENÇÃO`, `CRÍTICO`, `SEM SINAL`, `ACESSO RESTRITO`, `ALPHA TEAM · 10 ALUNOS`, `+ ALUNO`. Tracking ranges from `0.18em` (chips) to `0.30em` (the tiny stamps).
- **Sentence case** for screen titles, body copy, hints, names: `Hoje`, `Fila de Treinos`, `Criar aluno`, `Restaurar padrões`.
- Headings are **never** uppercase — only the kickers above them.
- Numbers are pt-BR formatted (`1.100 XP` with period thousands separator via `toLocaleString("pt-BR")`).

**Vocabulary signatures.** XP everywhere (`weeklyXp`, `monthlyXp`, `totalXp`). Streaks in days (`14d streak`). Risk states are domain-specific: `EM DIA` / `ATENÇÃO` / `CRÍTICO` / `SEM SINAL` / `PAUSADO`. Avatar stages: `BABY / TEEN / ADULT / ELITE`. Subscription: `Ativo / Pausado / Inadimplente / Cancelado / Trial`. The athlete-AI pair is named `<Name> & GUTO` ("Helena & GUTO").

**No emoji.** Replace with stroked SVG icons. The brand is too clinical/sci-fi for emoji.

---

## Visual foundations

### Color
- **Ink** — `#060912` (page bg, dark mode). Translucent panels stack over it: `panel rgba(15,22,42,0.86)` → `panelHi rgba(22,32,58,0.90)` → `panelDp rgba(8,12,26,0.92)`.
- **Cyan** — `#52e7ff`. The signature accent. Used for focus, active state, primary CTAs, glow, the brand mark glow itself. Soft variant `rgba(82,231,255,0.14)` for backgrounds; line variant `rgba(82,231,255,0.24)` for borders.
- **Light surface** — `#f7f9fc` page → `#edf2f8` deep, with `--guto-bg-portal` layering radial-gradient white frostings over a `#fff → #f7f9fc → #edf2f8` vertical wash.
- **Charcoal title** `#2D3748` / **Executive body** `#4A5568` / **Soft-blue subtitle** `#5A7CA8` — the light-mode text triad. Soft-blue is reserved for ALL-CAPS subtitles.
- **Status colors** — `ok #4ade80` / `warn #fbbf24` / `bad #f87171` / `destructive #9d2b2b`. Always paired with a `~13%` alpha soft variant for fills.

### Type
- **`JetBrains Mono`** is the **dominant UI face** — buttons, labels, body, kickers, data, chat. Substituted for "SF Mono" (Apple) which we lack. **FLAGGED.**
- **`Inter Tight`** for display moments (the GUTO mark, hero, stage titles). Substituted for "SF Pro Display". **FLAGGED.**
- **`Inter`** as the everyday sans fallback. Substituted for "SF Pro Display". **FLAGGED.**
- Weights are **heavy** — `700 / 800 / 900`. The brand has almost no `400` body text in the chrome; even mono body is `500`.
- Tracking is the brand voice: `0.18em` on pills, `0.22em` on labels, `0.28em` on kickers, `0.30em` on tiny stamps.
- Tightness on display: `-0.01em` on the H1 mark only.

### Spacing & radii
- Tailwind-style 4px-step scale. Common rhythm: `12 / 14 / 16 / 18 / 20 / 24 / 28` for paddings.
- Radii: `xs 6 · sm 10 · md 14 · lg 16 (default) · xl 22 · pill 999`. Buttons are pills (`999`). Cards/plates are `14` or `16`. Inputs are `10`. Modal is `18`.

### Surfaces & shadows
- **Cards = "frosted plates"** — translucent fill + 1px ultra-low-alpha border + `backdrop-filter: blur(10px)` + a subtle drop shadow.
- **Light-mode signature** is the **deboss** — every input/recess uses the `--guto-deboss` inner-shadow recipe (`inset 2 2 8 rgba(152,163,179,.22), inset -6 -6 12 rgba(255,255,255,.94)`). Critical for the chrome look.
- **Dark-mode plates** drop the deboss; they use `0 4px 20px rgba(0,0,0,0.35)` + 1px `rgba(82,231,255,0.10)` border. When `glow={true}`: cyan ring + `0 0 28px rgba(82,231,255,0.15)`.
- Inputs in dark mode use `inset 0 2px 6px rgba(0,0,0,0.45)` for the recessed look.

### Borders, transparency, blur
- Almost nothing is fully opaque — surfaces are 86–92% alpha so the ink shows through.
- Headers and overlays use `backdrop-filter: blur(10px)`.
- Modal scrim: `rgba(0,0,0,0.65)` + `backdrop-filter: blur(4px)`.

### Glow as signal
- The cyan glow IS the brand's "alive" signal: focus, primary CTA, voice/active state. Three intensities: `sm 0 0 16 / 18% · md 0 0 24 / 36% · lg 0 0 34 / 58%`.
- Primary buttons combine cyan-gradient fill (`linear-gradient(135deg,#7df0ff,#1ec5e0)`) + `0 0 18px rgba(82,231,255,0.28)` glow. Text on the cyan CTA is **navy `#0d2341`**, never white.

### Motion
- Easings: `cubic-bezier(0.4, 0, 0.2, 1)` (ease) and `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out, the punchier one for slide-in).
- Durations: `fast 160ms · base 180ms · slow 280ms`.
- Default transitions: `all 140ms ease` on interactive surfaces.
- Two named keyframes ship in the panel: `slideIn` (220ms `cubic-bezier(0.16,1,0.3,1)`) for the student detail panel, and `fadeIn` (160ms ease) for modal scrim.

### Hover / press
- Buttons: hover = `filter: brightness(1.12)`. Press = `transform: scale(0.97)`. No color shift — the brightness handles it.
- Plates that are clickable rows: `transition: border-color 140ms ease` (border lights up to cyan-line on hover; not heavy-handed).
- Inputs on focus: cyan border + cyan ring `0 0 0 1px rgba(82,231,255,0.20)` (dark) or the heavier `0 0 18px rgba(82,231,255,0.42)` (light). No outline.

### Layout
- Sidebar `220px` expanded / `64px` collapsed. Width transitions `200ms ease`.
- Header `60px`, sticky. Brand bar inside sidebar `60px`.
- Content padding `24px 28px` (rooms with grids), `28px 32px 60px` (tweaks/settings).
- Two-column grids snap at `repeat(3,1fr)` for the Arena rankings.

### Imagery
- The Coach Panel uses **no photographic imagery**. Iconography only (stroked SVG, see below) and the GUTO wordmark logo.
- The light-mode portal (per the CSS tokens) uses **no photographic imagery either** — it's a pure chrome/frosted-glass surface. The signature decoration is the `--guto-chrome` gradient (an 8-stop reflective chrome wash) and the `--guto-varnish` (a top-down white frosting).
- If product imagery is needed: keep it cool, blue-shifted, slightly over-exposed — the brand's color temperature is **cold**.

### Cards
- Default: 14–16px radius, translucent fill, 1px low-alpha border, blur, soft drop shadow. **No left-border-color accent** — that's a slop pattern; the brand uses **glow** as the accent device instead (`glow` prop on `Plate`).

---

## Iconography

**Custom Lucide-style stroked SVGs, defined inline.** The `<SI>` atom in `coach-panel/panel-shell.jsx` is the icon factory: 24×24 viewBox, `currentColor` stroke, `1.9` default stroke-width (bumped to `2.2` on active nav items), round caps & joins. Active icons are sized `14–16px`. Active = stroke-width up + color shifts to cyan.

Shipped icon set (in `panel-shell.jsx`): Zap · Users · Dumbbell · Fork · Trend · Shield · Building · Log · ChevronLeft · ChevronRight · Plus · X · Copy · Check · Lock · Calib · History · Menu · Trash · Save · Sliders · Search.

**Use Lucide as the substitute & expansion library.** All shipped icons are direct Lucide remakes; pull additional icons from Lucide (`https://lucide.dev`) at the same stroke weight. **CDN fallback** if you don't want to inline: `https://unpkg.com/lucide-static@latest/icons/<name>.svg`.

**No emoji. No unicode pictographs.** The only "stamp"-like glyph used is the chevron (`›`) inside CTA labels (`Editar treino ›`) — that's typeset, not an icon.

**Logo.** `assets/logo_guto.png` — the GUTO wordmark, glowing cyan outline on transparent. Apply `filter: brightness(1.1)` on dark backgrounds. Don't recolor — the cyan is baked in.

---

## Index

| Path | What it is |
|---|---|
| `README.md` | This file |
| `SKILL.md` | Cross-compatible skill manifest (Claude Code / Skills) |
| `colors_and_type.css` | The canonical token sheet — copied verbatim from production |
| `assets/` | Logos and any extracted brand assets (`logo_guto.png`) |
| `coach-panel/` | The implemented Coach Panel artifact (the user's primary file) |
| `ui_kits/coach-panel/` | UI kit: components + interactive index for the dark ops surface |
| `preview/` | Design system cards (rendered into the Design System tab) |

The Coach Panel itself **is** the dark-mode UI kit — `panel-shell.jsx` exports atoms (Plate, Kicker, Label, Pill, Btn, SearchBox, DataRow, SectionTitle), icons, sidebar and header. `panel-screens.jsx` exports each full screen. `panel-student.jsx` exports the student detail overlay. The `ui_kits/coach-panel/` folder mirrors the implementation so it's discoverable by name.

---

## Caveats & open questions

> **Bold ask:** please review and tell me where I'm wrong — this system was inferred from a single artifact, not a full brand book.

1. **Fonts.** SF Pro Display + SF Mono are Apple system fonts and we don't have license files. Substituted with **Inter Tight** + **JetBrains Mono** (closest Google Fonts match). If you have official font files, drop them in `fonts/` and update `colors_and_type.css` `@font-face`.
2. **Athlete-facing product unverified.** The light-mode "white-room" tokens are documented per the CSS file, but no athlete screens were provided — only the dark Coach Panel. If you have the portal/PACT/calibration/onboarding screens, send them and I'll validate the light surface.
3. **Brand assets.** Only the wordmark `logo_guto.png` was in the bundle. Any glyph mark, favicon, social variants, brand video stills, or photography library are missing.
4. **Accent palette.** Cyan is the canonical accent; the panel exposes `violet / lime / orange` as Tweaks (alternate themes), but I treated those as **prototype-only theming**, not official brand palettes. Confirm whether these are real brand variants or just throwaway demo options.
5. **Iconography.** Icons in the panel are hand-rolled in the Lucide style. Confirm whether GUTO uses Lucide officially, has a custom set, or wants me to substitute Heroicons / Phosphor.
6. **Logo monochrome variants.** If you have light/dark logo variants or a glyph-only mark, send them — the wordmark we have is dark-bg only.
