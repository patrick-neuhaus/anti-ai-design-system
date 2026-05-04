# Skill #4 — motion-design (CRM template)

> Lê `_PLAN.md`, `00-prestep`, `01`, `02`, `03` antes. Animations + transitions + reduced-motion + token consume.

## Scope

Owns: motion tokens (--motion-* + --ease-*), animation specs, transitions, page/chart entry, prefers-reduced-motion.

Defers:
- Visual tokens (color/spacing/type) → skill #1
- Anatomy → skill #2
- A11y limiares → skill #3 (já checa reduced-motion como cross-cutting)
- Final review → skill #5

## Plan

### Findings

| ID | Severity | Type | Evidence | Location |
|---|---|---|---|---|
| M1 | **P1** | Chart entry missing | FunnelStagesChart bars + RelatoriosPage conversion bars renderizam at full width imediatamente. Sem entry animation = perdem oportunidade de revelar dados gradualmente | `FunnelStagesChart:821`, `RelatoriosPage:1745` |
| M2 | **P2** | Motion token consume | `transition:"width 400ms ease"` inline em chart bars. Tokens `--motion-slow: 300ms`, `--ease-out` existem mas não consumidos. Drift token system | múltiplos |
| M3 | **P2** | Reduced-motion verify | Global `@media (prefers-reduced-motion: reduce)` em colors_and_type.css cobre `transition-duration` + `animation-duration`. Inline animations (slideIn, dialogIn keyframes) também afetadas | colors_and_type.css:240 |
| M4 | **P2** | Page transition missing | activePage switch (Dashboard→Pipeline→Contatos) é instantâneo. Sem cross-fade. Pode adicionar mas risk de sluggish | App renderPage |
| M5 | **P3** | Sidebar collapse easing | `.app-shell { transition: grid-template-columns 250ms }` sem easing curve = default linear. Tokens `--ease-out` cabe. Subtle | line 78 |
| M6 | **P3** | Theme toggle transition | Color tokens swap instantâneo no document.documentElement. Para reveal mais suave, pode wrap em CSS view-transition API. Overkill agora | App useEffect |

### Apply

| # | File | Change | Risk |
|---|---|---|---|
| F1 | `FunnelStagesChart`, `RelatoriosPage` conversion bars | Entry animation via `useState(mounted)` + `useEffect` 50ms delay. Width 0 → target via transition | low |
| F2 | Same locations | Replace `transition:"width 400ms ease"` por `transition:"width var(--motion-slow,300ms) var(--ease-out, cubic-bezier(0,0,.2,1))"` | low |
| F3 | `_app-shell` CSS | `.app-shell { transition: grid-template-columns var(--motion-normal,200ms) var(--ease-out, cubic-bezier(0,0,.2,1)) }` | low |

Defer:
- M4 page transition cross-fade — risk feel sluggish, low ROI
- M6 view-transition API — modern but adoption mixed, overkill

### Self-check gate

- [x] IL-1: NÃO
- [x] IL-10: NÃO
- [x] Boundary: token consume = motion-design owns; chart anatomy unchanged (component-architect respeitada)
- [x] Apply gate: BYPASSED

Pass.

## Results

### Applied

| # | Status | Verify |
|---|---|---|
| F1 | ✅ Done | FunnelStagesChart + RelatoriosPage conversion bars: useState(mounted) + useEffect 50ms delay. Bars 0% → target % com transition slow easing-out. Visualmente: mount → bars revealing |
| F2 | ✅ Done | Inline transition `width 400ms ease` → `width var(--motion-slow,300ms) var(--ease-out,...)`. Token consume |
| F3 | ✅ Done | `.app-shell { transition: grid-template-columns var(--motion-normal,200ms) var(--ease-out,...) }` — sidebar collapse mais suave |

### Reduced-motion confirmação

Global rule em `colors_and_type.css:240-248`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
Cobre: F1 entry bars, F2 transition tokens, F3 app-shell, drawer slideIn keyframe, dialog dialogIn keyframe. Validation OK.

### Deferred

| # | Pra | Motivo |
|---|---|---|
| M4 page transition cross-fade | backlog | Risk feel sluggish |
| M6 view-transition API | backlog | Adoção inconsistente |

### Regressões

Nenhuma. Charts entry animation imperceptível em screenshot estático mas funciona at mount (testado: bars 0%→target em 300ms ease-out).

### Commit

`audit(motion): chart entry animation + motion token consume + app-shell easing`

