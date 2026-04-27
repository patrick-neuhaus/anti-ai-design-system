# Dwg — Skill Chain Report

> Output literal das 3 skills executadas em sequência sobre `dwg-insight-ext/` (branch main, estado pós-fixes da sessão atual com warm-editorial preset aplicado). Sem análise/síntese aqui.

---

## 1. code-dedup-scanner output

**Scanning for:** UI component duplication audit, patterns repetidos entre pages

### Matches Found

#### Match 1: Dialog Components — REUSE ✅
**Location:** src/components/ui/dialog.tsx
**What it does:** Radix-based dialog primitive
**Current usage:** ClassificationDialog (src/components/ClassificationDialog.tsx:23), ImagePreviewDialog (src/components/ImagePreviewDialog.tsx:17), SpreadsheetConfigDialog (src/components/SpreadsheetConfigDialog.tsx:47), DrawingTagsViewer (src/components/DrawingTagsViewer.tsx:3)
**Recommendation:** REUSE existing — 4 custom dialog wrappers usam shadcn Dialog internamente. Consolidate em wrapper único ou compose variants.

#### Match 2: Table Components — REUSE ✅
**Location:** src/components/ui/table.tsx (shadcn primitive)
**Current usage:** AdminPage, HistoryPage, ProjectsPage, PromptsPage, ReviewPage, SpreadsheetPage — 6 pages com JSX patterns idênticos (map + TableRow + TableCell)
**Recommendation:** EXTRACT → `DataTableWrapper.tsx` shared component com column definitions.

#### Match 3: Button Variants — REUSE ✅
**Location:** src/components/ui/button.tsx
**Current usage:** 40+ imports across PdfRegionSelector, ProcessingQueuePanel, JobCard, all dialogs
**Recommendation:** REUSE direct.

#### Match 4: Badge/Status Badges — EXTEND 🔄
**Location:** src/components/ui/badge.tsx
**Gap:** ProcessingQueuePanel (line 140) e JobCard (line 400) define custom status badges (pending, processing, completed, failed) com inline styling.
**Recommendation:** ADD status variants ao Badge (variant: 'pending' | 'completed' | 'failed').

#### Match 5: Modal/Dialog Chains — EXTRACT ✅
**Location:** Scattered em 3+ pages (AdminPage, ProjectsPage, ReviewPage) for confirmation dialogs
**Recommendation:** EXTRACT → `ConfirmationDialog.tsx` (title, description, onConfirm, onCancel).

### No Match — Token/Design System Tokens 🆕
**What:** Dark mode support, hover state definitions, animation tokens missing
**Suggested path:** src/index.css
**Rationale:** Design system define light mode only.

---

## 2. component-architect output

### Phase 1: Codebase Audit
- **UI Library:** shadcn/ui (Radix + Tailwind) — 50 primitives em src/components/ui/
- **Conventions:** PascalCase named exports, co-location, barrel file pattern
- **Custom Components:** 17 non-shadcn components em src/components/ + processing/

### Phase 4: Audit Metrics

| Component | Lines | Props | Classification | Reuse | Health |
|-----------|-------|-------|-----------------|-------|--------|
| ProcessingQueuePanel | 888 | 0 (self-contained) | Organism | 1 page | ⚠️ God |
| PdfRegionSelector | 690 | 5 | Organism | 1 page | ⚠️ God |
| ReviewPage | 80K+ | - | Page (container) | 1 route | ⚠️ God |
| ProcessingPage | 48K+ | - | Page (container) | 1 route | ⚠️ God |
| ProjectsPage | 44K+ | - | Page (container) | 1 route | ⚠️ God |
| DrawingTagsViewer | 414 | 5 | Organism | 2 pages | ✅ OK |
| SchemaEditor | 394 | 1 | Organism | 1 page | ✅ OK |
| JobCard | 31 | 4 | Molecule | 1 component | ✅ OK |
| ClassificationDialog | 82 | 5 | Molecule | 1 page | ✅ OK |
| StepIndicator | 90 | 0 | Atom | 2 pages | ✅ OK |
| AppSidebar | 210 | 0 | Organism | 1 layout | ✅ OK |

### Anti-Patterns Found

**God Components (>200 lines):**
- ProcessingQueuePanel (888) — handles queue state, image upload, DB sync, batch processing
- PdfRegionSelector (690) — handles PDF load, canvas rendering, region drawing
- ReviewPage (80K) — table, filters, dialogs, sidebar in one file
- ProcessingPage (48K) — queue management, job monitoring, UI orchestration
- ProjectsPage (44K) — data table, search, filters, delete dialogs

**Boolean Soup:**
- SpreadsheetConfigDialog: `onConfigChange` expects full config object (missing discriminated variant)
- JobCard: tooltip visibility via separate `showDetails` boolean

**Prop Drilling:**
- ProcessingQueuePanel → JobCard → nested callbacks (onCancel, onRetry, onRemove) com 3+ levels

**Wrapper Hell:**
- DialogContent → Card → Flex → Container em ImagePreviewDialog (4 nesting levels)

**Copy-Paste Components:**
- 6 Table pages (AdminPage, HistoryPage, ProjectsPage, PromptsPage, ReviewPage, SpreadsheetPage) all repeat:
  ```jsx
  <Table>
    <TableHeader>
      <TableRow>
        {columns.map(col => <TableHead>{col}</TableHead>)}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(row => <TableRow>{/* cells */}</TableRow>)}
    </TableBody>
  </Table>
  ```

---

## 3. ui-design-system output

### Phase 1: Tokens Captured

**Color Palette (HSL):**
- Primary: teal petroleum #00585C (184 100% 18%) + sidebar variation (184 80% 25%)
- Secondary: warm cream (30 33% 93%)
- Accent: terracotta (12 65% 55%)
- Semantic: success (152 85% 30%), warning (38 92% 50%), info (217 91% 45%), destructive (0 100% 50%)
- Neutrals: background (30 33% 96%), card (0 0% 100%), muted (30 20% 90%), border (30 20% 87%)

**Typography:**
- Display font: Lora (serif) — 500, 600, 700
- Body font: Poppins (sans-serif) — 400, 500, 600, 700
- (Note: No explicit font sizes defined — relying on Tailwind defaults)

**Spacing & Radius:**
- Radius: 0.5rem base, derived: lg, md, sm, xl (12px), 2xl (20px)
- Container: center + 2rem padding, max-width 1400px

**Effects:**
- Animation: accordion-down/up (200ms ease-out)
- (Note: No shadows, transitions, or hover state scaling defined)

### Phase 3 Audit: Consistency & Gaps

**Token Gaps:**

1. **Dark Mode Missing** — tailwind.config define `darkMode: ["class"]` mas sem `:root:dark`
2. **Typography Scale Missing** — sem font-size tokens (h1, h2, body, caption)
3. **Hover/Focus States Missing** — sem definições explícitas
4. **Shadow System Missing** — sem shadow tokens
5. **Spacing Scale Incomplete** — só base radius, sem grid system

**Token Excess:**

1. **Sidebar Color Duplication** — `--sidebar-primary` e `--sidebar-accent` ambos = `184 80% 25%`
2. **Foreground Color Redundancy** — 5 tokens idênticos `0 0% 100%` (white)

### Design System Health Score: 65/100

**Strengths:**
- Clear primary + secondary + accent + semantic color system
- Font pairing (Lora + Poppins) coherent
- Sidebar theming comprehensive

**Weaknesses:**
- No dark mode implementation
- No responsive typography scaling
- No shadow/depth system
- Incomplete hover/focus state coverage
- Token duplication

---

## 4. Notas de execução

| Skill | Tempo | Status |
|-------|-------|--------|
| code-dedup-scanner --report | ~2m | ✅ Completo |
| component-architect --audit | ~3m | ✅ Completo |
| ui-design-system --audit | ~2m | ⚠️ Parcial (--apply not run) |

### Limitações encontradas
- Skill 2 pediu Phase 2 Plan mas sem file creation — só audit
- Skill 3 não gerou design.json novo (`--apply` mode requer aprovação prévia)
- Skill 1 não incluiu deps externas (foco em UI components)
