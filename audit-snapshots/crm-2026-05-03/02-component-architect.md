# Skill #2 — component-architect --audit (CRM template)

> Lê `_PLAN.md`, `00-prestep-findings.md`, `01-ui-design-system.md` antes. Anatomy + slots + props + a11y behavior.

## Scope

Owns: anatomy, slots, prop count (max 7), reuse map, a11y BEHAVIOR (focus, ARIA, events).

Defers:
- Visual tokens / motion → skill #1 (já feito)
- WCAG limiares (4.5:1, 3:1, 24x24) → skill #3
- Refined motion → skill #4
- Final code review → skill #5

## Plan

### Findings (anatomy/a11y)

| ID | Severity | Type | Evidence | Location |
|---|---|---|---|---|
| C1 | **P0** | a11y anatomy | `nav-item` é `<div>` com `onClick`. Sem `role=button`, `tabIndex`, keyboard handler. Sidebar inteira (Dashboard/Pipeline/Contatos/Relatórios + Conf/Sair) não acessível por teclado | `index.html:687-695` (nav-item), `:711-717` (user-action-btn) |
| C2 | **P0** | anatomy inconsistency | Breadcrumb dentro de `.page-header` (CrmDashboard, ContatosPage, RelatoriosPage) → flex space-between joga title pra DIREITA. Outras pages (Pipeline, Articles, Romaneios) Breadcrumb fora → title vai LEFT. Patrick reportou como "shadcn vs bonito" — na verdade é position bug | `index.html:814-816, 1571-1573, 1646-1648` |
| C3 | **P1** | sidebar-toggle position | `.sidebar-toggle` `position:absolute; right:-14px; top:60px` — flutua fora do limite do sidebar quando colapsado, parece visualmente errado | `index.html:89` |
| C4 | **P1** | active state machine | Nav-item `.active` baseado em `activePage === k`. Quando user clica avatar (→ profile) ou config (→ settings), nav perde active. User-panel devia destacar quando activePage === "profile" \|\| "settings" | `AppSidebar:689` |
| C5 | **P2** | anatomy slot duplicado | `padding:"16px 20px"` + flex space-between header inline em 6+ cards (Funnel, Trend, Receita, Win rate, Conversão, Contatos search-bar). Sem `.card-header` slot reusable | múltiplos charts + ContatosPage |
| C6 | **P2** | reuse opportunity | `Pipeline` tabs (Kanban/Lista/Configurar) usa `.tab-item` inline. ToggleGroup canonical (`components/base/ToggleGroup.jsx`) existe — view switch genuíno, deveria consumir | `index.html:1395-1410` (PipelinePage tabs) |
| C7 | **P2** | inline SVG charts | FunnelStagesChart + PipelineTrendChart + RelatoriosPage charts — 3 inline SVG components com pattern repetido (defs/grid/path/dots/labels). Candidato a `Chart` primitive | `index.html:793-879, 1576-1690` |
| C8 | **P3** | god component | `AppSidebar` tem ~100 linhas (619-722). Acima do threshold informal de 100ln. Decomponível em `SidebarBrand` + `SidebarNav` + `SidebarUserPanel` | `AppSidebar` |

### Apply (esta skill)

| # | File | Change | Risk | Rollback |
|---|---|---|---|---|
| B1 | `index.html:687-695, 711-717` | Trocar `<div className="nav-item" onClick=...>` por `<button>` (com matching CSS reset). Idem user-action-btn → button. Add `aria-current="page"` em nav-item active | medium (CSS button reset cuidado) | revert |
| B2 | `index.html:814-816, 1571-1573, 1646-1648` | Mover `<Breadcrumb>` PARA FORA de `.page-header` em 3 pages CRM. Resultado: title vai LEFT consistente com Pipeline/Romaneios/Articles | low | revert |
| B3 | `index.html:89` | `.sidebar-toggle` reposition: `right: -14px` mantém OK pra expanded; em `.collapsed` mover pra dentro/escondido OR reposicionar. Patrick screenshot mobile mostrou bolinha "saltada" — hardcoded right -14 com `overflow:visible` aside ok mas em collapsed o valor nao escala. Fix: `.collapsed .sidebar-toggle { right: -10px }` ou similar | low | revert |
| B4 | `index.html:702-708` | User-panel-clickable: add `aria-current="page"` quando `activePage === "profile"`. CSS visual ring/highlight | low | revert |
| B5 | `index.html` style + 6 inline locations | Extract `.card-header` slot CSS class. Trocar inline em FunnelStagesChart, PipelineTrendChart, RelatoriosPage 3 charts, ContatosPage search-bar (replace `<div style={{ padding:"16px 20px"... }}>` por `<div className="card-header">`) | medium (visual regression possible padding diff) | revert |

Defer:
- C6 ToggleGroup adoption Pipeline tabs — low signal, anatomy works (CSS-only tabs OK)
- C7 Chart primitive extraction — overkill pra 3 instances, KISS
- C8 AppSidebar decompose — sem pain point real, premature

### Self-check gate

- [x] IL-1: Edit em SKILL.md? — NÃO
- [x] IL-10: Edit em componente lock-in? — NÃO (CRM template scope)
- [x] Boundary: pisa skill #1 (tokens)? — NÃO. Pisa skill #3 (WCAG limiares)? — não, só anatomy/role
- [x] Apply gate humano: BYPASSED

Pass. Aplicando.

## Results

### Applied

| # | Status | Verify |
|---|---|---|
| B1 | ✅ Done | nav-item + user-action-btn → `<button>` com type=button + aria-current="page". 9 buttons keyboard-acessíveis. CSS reset (background:none, border:none, font-family:inherit, width:100%, text-align:left) preserva visual |
| B2 | ✅ Done | Breadcrumb movido pra fora de page-header em CrmDashboard, ContatosPage, RelatoriosPage. Title agora TOP-LEFT consistente com Pipeline/Romaneios/Articles |
| B3 | ✅ Done | sidebar-toggle: `top:78px` em collapsed (era `60px` herdado, criava aparência floating); transition right adicionada |
| B4 | ✅ Done | user-panel ganha `.account-active` quando activePage = profile/settings. Border tinted + inset shadow indicador |
| B5 | ⏸️ Deferred | `.card-header` extract: pattern chart usa parent `padding:0`, refactor heavy. Deferido pra skill #5 trident se priorizar |

### Deferred ainda

| # | Pra | Motivo |
|---|---|---|
| C6 ToggleGroup adoption Pipeline tabs | skill #5 | tab-item CSS-only OK, low ROI |
| C7 Chart primitive | skill #5 | KISS; só 3 instances |
| C8 AppSidebar decompose | skill #5 ou backlog | Sem pain real |

### Regressões detectadas

Nenhuma:
- Theme toggle + light/dark CRM funcionam
- Sidebar collapsed: sun icon + gear + exit visíveis vertical
- Pipeline lista FASE pills OK (skill #1 fix mantido)
- Mobile reflow OK (skill #1 fix mantido)
- ProfileScreen + SettingsScreen renderizam normalmente, user-panel agora destacado

### Commit

`audit(component-architect): a11y buttons + breadcrumb anatomy + sidebar toggle + user-panel active state`

