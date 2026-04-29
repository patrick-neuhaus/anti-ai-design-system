---
name: anti-ai-design
description: Use this skill to generate well-branded interfaces and assets for the Anti-AI Design System, either for production or throwaway prototypes/mocks/etc. The system ships ONE preset — default (warm-editorial / chocotracking flavor) — engineered to fix the "cara de IA" smell common to AI-generated web apps. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — full system: context, content fundamentals, visual foundations, iconography, the default preset, the anti-patterns this system is designed to break
- `colors_and_type.css` — drop-in tokens for the default preset
- `preview/` — 13 individual specimen cards (palettes, type, spacing, radii, shadows, components, shells, the anti-AI checklist)
- `ui_kits/default/` — operations-dashboard recreation (Choco / Barry Callebaut flavor) plus 10 production-lift JSX components

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Always link `colors_and_type.css`.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. Pay particular attention to the "cara de IA" anti-patterns documented in `preview/17-anti-checklist.html` and the README — that's the whole point of this system.

If the user invokes this skill without any other guidance, ask them:
1. Are they prototyping a one-off artifact, or contributing to a production codebase?
2. What surface are they building — marketing, dashboard, settings, onboarding, etc?

Then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need. Default to grid CSS over `<table>`, raw divs over `<Card><CardHeader>`, and never inject a Lucide icon into every label.
