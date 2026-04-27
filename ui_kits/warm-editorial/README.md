# UI Kit · warm-editorial

Reference flavor: **chocotracking** (Barry Callebaut traceability surface).
Preset attribute: `data-preset="warm"` on `<html>` or `<body>`.

## What this is
A high-fidelity recreation of the operational dashboard pattern from the warm-editorial preset. Single-file React/JSX prototype demonstrating the design language end-to-end:

- Cream `#F4ECE3` shell, **#FFFFFF** cards, **teal `#00585C`** sidebar
- **Lora** display + **Poppins** body + **Geist Mono** for tabular numbers
- Variable radius scale (6 → 8 → 12 → 16 → 20)
- Soft shadows (sm/md only) — never `xl`/`2xl`
- Capsule status pills, semi-transparent bg, hue-aligned
- Active nav: filled bg + 3px terracotta gesture bar
- Numbers always tabular and mono

## Surfaces in the prototype
- **Sidebar** — 272px, dark teal zone with workspace + nav sections, user pill at bottom
- **Topbar** — breadcrumbs, ⌘K search
- **Page header** — Lora `text-2xl`, sub-copy in muted, primary + secondary actions
- **KPI strip** — 4 cards, large display numerals, mono delta
- **Tabs + filter chips** — chips fully rounded, tabs bottom-bordered with terracotta
- **Data list** — grid CSS (NOT `<table>`), group headers, row hover `bg-muted/55`
- **Side panel** — info card with k/v pairs + dashed timeline
- **Modal** — 480px card, `radius-2xl`, focus ring on inputs
- **Toast** — dark inverse pill, slide-up entrance

## Interactions
- Click "Novo romaneio" → modal opens
- Submit → modal closes + toast appears
- Sidebar nav swaps active state
- Tabs and filter chips toggle
- Hover on rows shows muted background

## Anti-AI tells avoided
- No `<Card><CardHeader>...` — raw divs with explicit padding/radius/border
- No `<table>` for data — CSS grid with named columns
- No icon in every label — only in primary actions and status
- Spacing strictly from the religious scale (1, 1.5, 2, 4, 5, 6, 8)
- Foreground is `16 38% 12%` — hue, never pure grey
