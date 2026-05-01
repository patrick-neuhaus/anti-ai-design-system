---
name: anti-ai-design-system-spec
description: Specification for the Anti-AI Design System. Consumed by design-system-audit (Phase 2 Inventory) and any other tool that needs the system's invariants, axes, and class defaults. Not a standalone skill.
user-invocable: false
---

## How this file is consumed

This file is **not** a skill the maestro invokes directly. It is a specification read by other skills and tools.

- **Primary consumer:** `design-system-audit` skill at `~/Documents/Github/skillforge-arsenal/skills/design-system-audit/SKILL.md`. It references this repo path explicitly under "Default DS Reference (Wave 7)" and its Phase 2 Inventory `cat`s the canonical files listed below.
- **Canonical files** the audit skill loads (`cat`s into context as source of truth):
  - `docs/03-token-system.md`
  - `docs/07-component-patterns.md`
  - `docs/08-variation-axes.md`
  - `docs/09-class-defaults.md`
  - `docs/10-component-composition.md`
  - `presets/default/tokens.css`
  - `README.md` (specifically the *normative vs. illustrative vs. legacy* section)
- **To use this design system,** invoke `design-system-audit`. Do not invoke this file as a skill — `user-invocable: false` is intentional.
- Anything below is the system's specification: read-only knowledge for whatever tool consumes it.

---

Read the README.md file first, then explore the other available files.

## Decision tree (always run before generating)

1. **Read the briefing.** What is the user actually building? Form, dashboard, marketing site, editor, devtools panel, fintech surface?
2. **Identify the dominant class of app.** One of: `ops dashboard`, `fintech`, `editor/canvas`, `consumer`, `devtools`, `marketing`. If it spans two, pick the surface the user lives in (sidebar + table = ops; canvas = editor).
3. **Look up the axis defaults** for that class in `docs/09-class-defaults.md` — eight values: `density`, `surface`, `nav`, `typeContrast`, `iconDensity`, `statusEmphasis`, `motion`, `hueFamily`.
4. **Read what each axis controls** in `docs/08-variation-axes.md`.
5. **Use `presets/default/` and `ui_kits/default/` as concrete examples.** Read structure (component recipes, tokens, layout grids) — do **not** copy their brand unless the user asks for that flavor.
6. **Vary by axis, not by fork.** When the target differs from `default`, change tokens and component props. Do not duplicate components or create parallel folders.

## `no_fork_rule`

Do not create a new design system, preset, kit, or component variant when the variation can be expressed as:
- a token override (CSS vars in `:root`),
- a class swap (`density-compact` → `density-comfortable`),
- a prop on an existing component (`<StatusBadge variant="strong" />`),
- or a doc-level axis annotation (`docs/08-variation-axes.md`).

A correct adaptation = **token diff + axis annotation**, not a new folder under `presets/` or `ui_kits/`. A new preset folder is only legitimate when the user has a specific brand to ship long-term — and even then, the components inside must consume tokens, not hardcode brand values.

## Token-consumption convention

All component CSS reads tokens via `hsl(var(--token))` (with optional alpha: `hsl(var(--token) / .5)`). Tokens in `presets/default/tokens.css` are HSL triples without `hsl()` wrap. **Do not** use `var(--token)` directly for color — it resolves to `16 38% 12%` and CSS rejects it. Use `hsl(var(--token))`.

## Normative vs. illustrative vs. legacy

The README has the full table. Short version:

- **Normative** (apply universally): everything in `docs/`, the CONTENT/VISUAL/ICONOGRAPHY sections of the README, this file. These are invariants.
- **Illustrative** (one example, adapt the structure): `presets/default/`, `ui_kits/default/`, `preview/`, `colors_and_type.css`, `assets/icons/`. Read structure, swap brand.
- **Legacy** (do not consume as guidance): any `PLAN.md`, older `audits/` entries. Note: `presets/default/lovable-memory/design/tokens.md` was deleted in Wave 6 — if a stale copy reappears, treat as legacy.

## Key files

- `README.md` — full system: context, content fundamentals, visual foundations, iconography, default preset, anti-patterns.
- `docs/01-anti-patterns.md` — the 10 patterns. Rule #2 (`<table>`) is **contextual**.
- `docs/07-component-patterns.md` — component-level patterns + axis cross-reference.
- `docs/08-variation-axes.md` — the 8 canonical axes.
- `docs/09-class-defaults.md` — class → axis-defaults matrix.
- `docs/10-component-composition.md` — composition rules for components NOT covered by the library.
- `presets/default/tokens.css` — tokens for the default preset (warm-editorial: cream + teal + terracotta).
- `preview/` — specimen cards.
- `ui_kits/default/` — operations-dashboard recreation + production-lift JSX library, organized in subfolders (`base/`, `surfaces/`, `display/`, `layout/`, `forms/`, `navigation/`, `data/`, `dashboard/`, `auth/`, `screens/`).
- `ui_kits/default/showcase/` — navigable showcase pages per category.

## Notes for consumers building UI from this spec

- Apply the class defaults from `docs/09-class-defaults.md`.
- Use `presets/default/` as the structural reference; override tokens for non-warm-editorial classes.
- Output HTML artifacts (link `colors_and_type.css`) for prototypes, or production code for codebases.
- Default to grid CSS over `<table>` for navigable lists; use `<table>` semantically for real tabular data.
- Default to raw divs over `<Card><CardHeader>`.
- Never inject a Lucide icon into every label.
- Audit every screen against the 10 anti-patterns and the coherence checklist before declaring done.