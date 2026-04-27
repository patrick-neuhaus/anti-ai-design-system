# UI Kit · minimalist-tech (v3)

**Forge.sh** — a deploy / release platform. Same structural envelope as `warm-editorial` (sidebar + topbar + page header + KPIs + data list + modal/toast), but a deliberately different visual voice.

## How it differs from warm-editorial
| | warm-editorial | minimalist-tech |
|---|---|---|
| Sidebar | dark teal, padded, soft radius | **light**, hairline borders, dense |
| Cards | rounded 20px, soft shadow | **flat**, hairline, no shadows |
| Type | Lora display + Poppins body | **Inter** body + **Geist Mono** for chrome |
| Color | warm cream + terracotta accent | cool blue-grey + **neon-green signal** |
| Primary action | rounded teal button | **squared button with offset signal-green shadow** |
| Numerals | semi-display | **38px tabular Geist Mono with sparklines** |
| Layout | even card grid | **asymmetric 12-col grid**, env matrix, dense pipeline |
| Voice | Portuguese editorial labels | lowercased mono, `//` comments, `↗`/`▸` glyphs |

## Anti-AI choices made
- **Light sidebar.** The "AI face" is dark sidebar + light main. Inverted on purpose.
- **No card shadows.** Hairlines do all the structural work.
- **Inline KPI strip** with embedded sparklines, not 4 equal-weight cards.
- **Service icons** are colored 18px tiles with 2-letter mono initials — not Lucide-in-every-row.
- **Primary button has an offset 3px neon shadow** that snaps on hover (`btn-primary` translates 2px → shadow shrinks). Hard not to notice; impossible to be confused for shadcn default.
- **Workspace pill** + **branch pill** + **shipping-now card** in the sidebar — concrete state, not just nav.
- **Environment matrix** is a 3×2 grid with a hairline-bordered "+ new env" cell, not 5 stacked cards.
- **`//` and `▸`** as visual punctuation everywhere (mono comments, group headers).
- **Pipeline rows** have a custom checkbox (square + neon-green check stroke), no Lucide check.
- **Status pills** are bordered rectangles with `●` glyph, all-lowercased, single-letter-spaced uppercase.

## Surfaces in the prototype
- Sidebar: brand mark, workspace switcher, 3 nav sections (ship / observe / workspace), live "shipping now" card with progress bar, user footer
- Topbar: breadcrumbs, branch pill, ⌘k search
- Page header: eyebrow `// deploys · last 24h`, large numeric headline `382 shipped`, sub copy, 2 actions
- Inline metric strip: 4 metrics with sparklines, not cards
- Asymmetric 7/5 split: recent deploys list (left) + environment matrix (right)
- Filter bar: segmented filters with counts + "group by" toggle
- Pipeline list: grouped by environment, custom checkbox, service icon, branch ← author meta, build progress bar, status pill, action arrow
- Modal: squared with offset green shadow, `//` prefixed title, mono labels
- Toast: bottom-right, dark, neon-green leading triangle and sha highlight

## Interactions
- Click "ship release" → modal opens
- Submit → modal closes + toast
- Pipeline row click → toggles selection (custom checkbox)
- Filter segments toggle
- Sidebar nav swaps active state (active = inverted ink+signal)
