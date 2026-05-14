---
name: guto-design
description: Use this skill to generate well-branded interfaces and assets for GUTO, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. GUTO is a Brazilian (pt-BR) AI fitness coach platform pairing each athlete with a "GUTO" AI alter-ego that levels up via XP/streaks; the brand has two surfaces — a light "white-room/cyan glass" athlete portal, and a dark "blackbox ops" coach/admin panel.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **Two surfaces:** athlete-facing **light** (white-room futurism, frosted glass plates, cyan glow) — and **dark** ops/coach panel (near-black ink, cyan-tinted translucent plates). They share one token vocabulary; pick the surface to match the audience.
- **Language:** pt-BR. Voice is operational, terse, present-tense, second-person informal (você). No emoji, no exclamation marks, no marketing fluff.
- **Type:** JetBrains Mono dominates the UI; Inter Tight for display moments. Heavy weights (700/800/900). Wide-tracked uppercase labels are the brand voice on screen — `0.18em` on pills → `0.30em` on stamps.
- **Color:** signature accent is cyan `#52e7ff`. Glow is the brand's "alive" signal — focus, primary CTAs, voice/active state. Never recolor the logo.
- **Components live in `coach-panel/`** — atoms, icons, and screens are pre-factored. The same patterns translate to the light surface by swapping the panel/ink/border tokens for the `--guto-frost-*` / `--guto-deboss` / `--guto-shadow-*` recipes in `colors_and_type.css`.
- **Iconography:** stroked Lucide-style SVGs at `1.9` stroke-width (`2.2` when active). 21 are pre-built in `panel-shell.jsx`; pull more from Lucide.
