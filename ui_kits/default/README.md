# UI Kit · default

Reference flavor: **chocotracking** (Barry Callebaut traceability surface) — warm-editorial.

This kit ships two complementary artifacts:

| File / Dir | Role |
|---|---|
| `index.html` | Single-file R+Babel **interactive demo** of the dashboard end-to-end. Open in a browser, no build step. |
| `components/` | 10 JSX **production-lift components** ready to drop into a real React app. Demo data preserved as scratch reference (re-brand per project). |

Tokens come from `colors_and_type.css` at the repo root — applied via `:root` automatically. No `data-preset` attribute needed.

## What the demo shows (`index.html`)

A high-fidelity recreation of the operational dashboard pattern. Single-file React/JSX prototype demonstrating the design language end-to-end:

- Cream `#F4ECE3` shell, **#FFFFFF** cards, **teal `#00585C`** sidebar
- **Lora** display + **Poppins** body + **Geist Mono** for tabular numbers
- Variable radius scale (6 → 8 → 12 → 16 → 20)
- Soft shadows (sm/md only) — never `xl`/`2xl`
- Capsule status pills, semi-transparent bg, hue-aligned
- Active nav: filled bg + 3px terracotta gesture bar
- Numbers always tabular and mono

### Surfaces in the prototype
- **Sidebar** — 272px, dark teal zone with workspace + nav sections, user pill at bottom
- **Topbar** — breadcrumbs, ⌘K search
- **Page header** — Lora `text-2xl`, sub-copy in muted, primary + secondary actions
- **KPI strip** — 4 cards, large display numerals, mono delta
- **Tabs + filter chips** — chips fully rounded, tabs bottom-bordered with terracotta
- **Data list** — grid CSS (NOT `<table>`), group headers, row hover `bg-muted/55`
- **Side panel** — info card with k/v pairs + dashed timeline
- **Modal** — 480px card, `radius-2xl`, focus ring on inputs
- **Toast** — dark inverse pill, slide-up entrance

### Interactions
- Click "Novo romaneio" → modal opens
- Submit → modal closes + toast appears
- Sidebar nav swaps active state
- Tabs and filter chips toggle
- Hover on rows shows muted background

## Components for production lift (`components/`)

10 JSX files structured to be copied into a real React project. Use as reference patterns or paste-and-rebrand starting points.

| File | Purpose |
|---|---|
| `app.jsx` | Top-level shell wiring sidebar + main viewport + screens |
| `Sidebar.jsx` | 272/72px collapsible sidebar — workspace pill, eyebrow group labels, accent gesture bar on active item, user pill at bottom |
| `PageHeader.jsx` | Lora display heading + muted sub-copy + primary/secondary action slot |
| `StatCard.jsx` | KPI tile — accent-tinted icon chip, 28px stat, divider, label/sublabel/trend row |
| `LoginScreen.jsx` | 50/50 split — primary fill left with branding, form right on cream surface |
| `DashboardScreen.jsx` | KPI strip + chart placeholders + recent-activity grid list |
| `DeliveriesScreen.jsx` | Tabs + filter chips + data list (grid CSS) |
| `RomaneiosScreen.jsx` | Same pattern, with side detail panel + dashed timeline |
| `ConferenciaScreen.jsx` | Item bipping interface — barcode-flavored input + scanned-vs-expected counters |
| `Icon.jsx` | Lucide-equivalent icon mapping for the demo (swap for `lucide-react` in production) |

**Demo data preserved.** Email placeholders, SKU codes, and the ChocoTracking app name are intentionally left as scratch reference — re-brand per project. The de-brand applied here was minimal: comments mentioning the BC palette were generalized (`bordeaux` → `primary`, `caramel` → `accent`) and `alt` text on the BC logo was updated.

## Anti-AI tells avoided
- No `<Card><CardHeader>...` — raw divs with explicit padding/radius/border
- No `<table>` for data — CSS grid with named columns
- No icon in every label — only in primary actions and status
- Spacing strictly from the religious scale (1, 1.5, 2, 4, 5, 6, 8)
- Foreground is `16 38% 12%` — hue, never pure grey
