---
name: guto-design
description: Use this skill to generate well-branded interfaces and assets for GUTO — a Portuguese-language human-evolution app (training, accountability, robotic best-friend avatar) — for production work or throwaway prototypes/mocks/slides. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in the GUTO white-room / cyan / navy / glass-deboss aesthetic.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/guto-app/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out of this folder and create static HTML files for the user to view. Always link `colors_and_type.css` and use its semantic CSS variables (`--fg1`, `--accent`, `--guto-deboss`, etc.) instead of hard-coding hex values.

If working on production code, copy assets and read the rules here to become an expert in designing with this brand. The canonical CSS lives in the source codebase at `GUTOO/app/globals.css` if available; this skill mirrors and documents those tokens.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a screen? a deck? a marketing page?), ask 3–5 clarifying questions about audience, language (pt-BR / en-US / es-ES / it-IT), and surface, then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

**Non-negotiables:**
- No emoji. No bluish-purple gradients. No drop shadows on dark backgrounds.
- All chrome labels are uppercase, monospace, wide-tracked.
- Cyan (`#52e7ff`) is the only accent. Navy (`#0d2341`) is the only foreground.
- Cards always have an inset deboss; inputs have only the deboss.
- GUTO's voice is curt, loyal, older-brother — never apologetic, never hyped.
