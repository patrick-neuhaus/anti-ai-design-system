# Component Anatomy Audit — anti-ai-design-system

> **Skill:** `component-architect` v3 + `states-inventory.md` (canonical)
> **Data:** 2026-05-02
> **Escopo:** 60 componentes JSX em `ui_kits/default/components/` × 17 estados visuais canônicos
> **Método:** análise estática JSX + inspeção visual via showcases técnicas

## 1. Estados visuais canônicos (states-inventory)

| # | Estado | Aplica a | Crítico pra |
|---|---|---|---|
| 1 | Default | todos | baseline |
| 2 | Hover | interactive (button, link, card-clickable, list-item) | discovery |
| 3 | Focus-visible | interactive + form fields | a11y (WCAG 2.4.7) |
| 4 | Active/Pressed | button, toggle | feedback (Pilar 1) |
| 5 | Disabled | button, input, control | bloqueio claro |
| 6 | Read-only | input, textarea | distinção edição |
| 7 | Loading | button, table, page | feedback (Pilar 1) |
| 8 | Async (busy) | button, form-submit | feedback |
| 9 | Error | input, form-field, alert, banner | recuperação |
| 10 | Success | input pós-validate, alert, toast | confirmação |
| 11 | Empty | table, list, dashboard | null state |
| 12 | No-results | search, filter | distinção empty vs filtered |
| 13 | Selected | row, card, item, tab | feedback de seleção |
| 14 | Expanded | accordion, dropdown, sidebar group | controlado |
| 15 | Drag (in motion) | list reorder, file upload, sortable | a11y (WCAG 2.5.7) |
| 16 | Overflow | text long, table cell | truncation/ellipsis |
| 17 | Invalid | form-field pre-submit | live validation |

## 2. Resumo executivo

| Categoria | Componentes | Estados cobertos avg | Gap principal |
|---|---|---|---|
| **Base** (7) | Button/Input/Textarea/Select/Checkbox/Radio/Switch | ~10/17 | active/loading/async/empty/no-results/drag |
| **Surfaces** (2) | Card/Surface | ~5/17 | hover-lift (parcial), selected, drag |
| **Display** (14) | Alert/Avatar/Badge/Dialog/Drawer/EmptyState/Popover/Progress/Skeleton/Spinner/StatusBadge/Tag/Toast/Tooltip | ~6/17 | empty/no-results/error/success em vários |
| **Layout** (4) | AppLayout/PageHeader/PageShell/Section | ~4/17 | empty/loading na PageShell |
| **Forms** (7) | Combobox/DateField/FileUpload/FormField/NumberField/Slider/Stepper | ~8/17 | error/invalid live, async submit, drag (FileUpload) |
| **Navigation** (6) | Breadcrumb/NavLink/Pagination/Sidebar/Tabs/UserMenu | ~9/17 | active+selected confusion, expanded incompleto |
| **Data** (3) | AppTable/ListItem/Table | ~7/17 | loading row, empty, no-results, selected, sort active |
| **Auth screens** (5) | LoginScreen/RegisterScreen/Forgot/Reset/Confirm | ~6/17 | error live, loading, success post-submit |
| **Dashboard widgets** (3) | KpiGrid/MetricCard/StatCard | ~3/17 | loading, error, empty, async refresh |
| **Full screens** (5) | Dashboard/Empty/Profile/Romaneios/Settings | ~5/17 | global empty/loading/error |

**Score médio:** **~6.5/17 estados cobertos** = **~38% completude**

**Veredicto:** os componentes **funcionam pro happy path + 2-3 estados secundários**, mas **a cobertura de estados de borda é fraca**. Pra subir maturidade pra "production-ready DS consumível", priorizar 3 estados que faltam transversalmente:
1. **Loading/Async** — quase nenhum componente mostra estado de espera dedicado
2. **Empty/No-results** — Display tem EmptyState component mas não há orientação clara de onde aplicar
3. **Error live + Invalid** — Form fields têm error mas falta padrão de validação live

## 3. Matriz por componente (resumo)

> Marcação: ✅ = coberto · ⚠️ = parcial · ❌ = ausente · — = N/A

### 3.1 Base

#### Button (`base/Button.jsx`)
| Estado | Status | Evidência |
|---|---|---|
| Default | ✅ | 5 variants (Primary/Secondary/Outline/Ghost/Destructive) |
| Hover | ✅ | bg opacity 0.9 |
| Focus-visible | ⚠️ | `--ring` declarado mas não testado em variants escuras (F-UI-007) |
| Active/Pressed | ❌ | F-MO-003 |
| Disabled | ✅ | `Disabled` + `Disabled Outline` na showcase |
| Read-only | — | |
| Loading | ❌ | sem variant `<Button loading />` visível |
| Async | ❌ | idem |
| Error | — | |
| Success | — | |
| Empty | — | |
| No-results | — | |
| Selected | — | |
| Expanded | — | |
| Drag | — | |
| Overflow | ⚠️ | text-overflow não testado em label longo |
| Invalid | — | |

**Cobertura: 6/9 aplicáveis = 67%.**

#### Input (`base/Input.jsx`)
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover | ✅ subtle border |
| Focus-visible | ✅ border + ring |
| Active | — |
| Disabled | ✅ |
| Read-only | ⚠️ não diferenciado de disabled visualmente |
| Loading | ❌ |
| Async | ❌ |
| Error | ✅ "Inválido" variant |
| Success | ❌ |
| Empty | ⚠️ placeholder só |
| No-results | — |
| Selected | — |
| Expanded | — |
| Drag | — |
| Overflow | ⚠️ |
| Invalid | ⚠️ pre-submit live? F-UX-011 |

**Cobertura: 6/12 aplicáveis = 50%.**

#### Textarea (`base/Textarea.jsx`)
Similar ao Input. **Cobertura ~50%.**

#### Select (`base/Select.jsx`)
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover | ✅ |
| Focus-visible | ⚠️ confirmar |
| Disabled | ✅ |
| Loading | ❌ |
| Empty (sem opções) | ❌ |
| Expanded (open) | ⚠️ depende impl |
| Selected (item) | ✅ |

**Cobertura: 5/8 = 63%.**

#### Checkbox / Radio / Switch (`base/Checkbox.jsx`, `Radio.jsx`, `Switch.jsx`)
| Estado | Status |
|---|---|
| Default unchecked | ✅ |
| Hover | ⚠️ confirmar |
| Focus-visible | ⚠️ confirmar |
| Active (transition tick) | ❌ Pilar 1 ausente |
| Disabled | ⚠️ |
| Indeterminate | ❌ Checkbox precisa estado misto |

**Cobertura: 3-4/8 = ~50%.**

### 3.2 Surfaces

#### Card (`surfaces/Card.jsx`)
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover-lift | ✅ — variant "Card — INTERACTIVE (HOVER LIFT)" |
| Focus-visible | ❌ Card clicável não mostra focus |
| Selected | ❌ |
| Loading | ❌ skeleton só fora do card |
| Empty | ❌ |
| Error | ❌ |

**Cobertura: 2/7 = 29%.**

#### Surface (`surfaces/Surface.jsx`)
Tonal background, sem estados interativos. **N/A maioria.**

### 3.3 Display

#### Alert (`display/Alert.jsx`)
| Estado | Status |
|---|---|
| Info / Success / Warning / Destructive | ✅ |
| Dismissible | ❓ não testado |

**Cobertura: 4/4 variants ✅. Dismiss state ❓.**

#### Badge / StatusBadge / Tag
| Estado | Status |
|---|---|
| Default + variants | ✅ |
| Hover (interactive) | ❓ Tag com `removível` tem X — confirmar |
| Removable transition | ❓ |
| Selected | — |

**Cobertura: ~80%.**

#### Avatar
| Estado | Status |
|---|---|
| Default initials | ✅ |
| Image | ✅ |
| Fallback | ❓ |
| Loading | ❌ |

**Cobertura: 2/4 = 50%.**

#### Dialog / Drawer / Popover
| Estado | Status |
|---|---|
| Open animation | ⚠️ confirmar transition |
| Close animation | ⚠️ |
| Focus trap | ❓ a testar |
| Backdrop dismiss | ❓ |
| Esc dismiss | ❓ |

**Cobertura estimada: 50-60%.** Recomendação: testar interativamente.

#### EmptyState
| Estado | Status |
|---|---|
| Default | ✅ "Nada por aqui" + ícone + CTA |
| Loading | — |
| Error | ❌ EmptyState não cobre estado de erro (deveria ter variant Error) |
| No-results | ⚠️ confirmar variant pra search empty |

**Cobertura: 1-2/3 aplicáveis.**

#### Skeleton / Spinner / ProgressBar
| Componente | Estado |
|---|---|
| Skeleton — shimmer | ❌ F-MO-004 |
| Spinner — rotate | ✅ |
| ProgressBar — value transition | ⚠️ |

#### Toast
| Estado | Status |
|---|---|
| In / Out animation | ⚠️ não testado |
| Stack multiple | ❓ |
| Auto-dismiss | ❓ |
| Variants Default/Success/Destructive | ✅ |

#### Tooltip
| Estado | Status |
|---|---|
| Show on hover | ❓ |
| Show on focus | ❓ |
| Delay | ❓ |
| Reduced-motion fallback | ❓ |

### 3.4 Layout

#### AppLayout / PageHeader / PageShell / Section
| Estado | Status |
|---|---|
| Default render | ✅ |
| Empty content | ❌ PageShell precisa estado vazio claro |
| Loading content | ❌ |
| Error boundary | ❌ |

**Cobertura: 1/4 = 25%.**

### 3.5 Forms (especializados)

#### FormField (`forms/FormField.jsx`)
| Estado | Status |
|---|---|
| Default + label + helper | ✅ |
| Required indicator (\*) | ✅ |
| Error message | ✅ |
| Success message | ❌ |
| Loading async | ❌ |
| Invalid live | ⚠️ F-UX-011 |

**Cobertura: 3-4/6 = 50-67%.**

#### Combobox / DateField / FileUpload / NumberField / Slider / Stepper
- **Combobox:** open/close, search, no-results — ❓ não testado completo
- **DateField:** open picker, range — ✅ visível pages forms.html
- **FileUpload:** drag-over state, error file type, success uploaded preview — ⚠️ drag-over ❓, F-UX-029
- **NumberField:** spinner up/down small target — F-UX-020
- **Slider:** drag thumb, focus on thumb — ❓
- **Stepper:** step active/complete/error — ❓

**Cobertura média: ~50%.**

### 3.6 Navigation

#### Breadcrumb
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover link | ⚠️ |
| Current page (bold/different) | ✅ |
| Truncate long | ❓ |

#### NavLink
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover | ✅ explícito "Hover state em todos (não só active)" no showcase |
| Active | ✅ — left indicator 3px |
| Disabled | ❓ |
| Focus-visible | ❓ |

**Cobertura: 3-4/5 = 60-80%.**

#### Pagination
| Estado | Status |
|---|---|
| Page numbers + Prev/Next | ✅ |
| Current page highlighted | ✅ "3" highlighted |
| Disabled prev (page 1) / next (last) | ⚠️ confirmar |
| Loading next page | ❌ |

#### Sidebar
| Estado | Status |
|---|---|
| Default expanded | ✅ |
| Collapsed | ✅ |
| Hover items | ✅ |
| Active item + indicator | ✅ |
| Disabled item | ❓ |
| Section expanded/collapsed (group) | ❓ |
| Scroll overflow | ✅ scrollbar interno (mas Safari issue F-UX-019) |

**Cobertura: 5/7 = 71%.**

#### Tabs
| Estado | Status |
|---|---|
| Default | ✅ |
| Active tab | ✅ underline + bold |
| Hover non-active | ✅ |
| Disabled | ❓ |
| Loading content | ❌ F-UX-014 |
| Pill variant | ✅ presente |

**Cobertura: 4/6 = 67%.**

#### UserMenu (sidebar bottom)
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover | ✅ |
| Avatar fallback | ✅ initials |
| Open dropdown | ❓ |
| Logout action | ✅ |
| Settings action | ✅ |

### 3.7 Data

#### Table (primitivo)
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover row | ✅ bg muted |
| Selected row | ⚠️ checkbox presente em Romaneios mas não em Table primitivo |
| Loading row | ❌ |
| Empty | ❌ |
| Sortable | ❌ — Table não tem sort, só AppTable |

#### AppTable (sortable)
| Estado | Status |
|---|---|
| Default | ✅ |
| Sort asc/desc/off | ✅ explícito ▲/▼/▼▲ semitransparente |
| Hover row | ✅ |
| Selected row | ⚠️ checkbox in Romaneios template — não em AppTable showcase |
| Loading | ❌ |
| Empty | ❌ |
| No-results filter | ❌ |
| Pagination integration | ❓ |

**Cobertura: 3-4/8 = 38-50%.**

#### ListItem
| Estado | Status |
|---|---|
| Default | ✅ |
| Hover | ⚠️ confirmar |
| Selected | ⚠️ confirmar |
| Read-only / interactive distinction | ❓ |

### 3.8 Auth screens
LoginScreen / RegisterScreen / ForgotPasswordScreen / ResetPasswordScreen / ConfirmEmailScreen

| Estado | Status |
|---|---|
| Form default | ✅ |
| Validation error | ⚠️ F-UX-011 |
| Submit loading | ❌ |
| Success post-submit | ❌ |
| Network error | ❌ |
| Disabled submit | ❌ |
| OAuth button states | ⚠️ |

**Cobertura: ~3/7 = 43%.**

### 3.9 Dashboard widgets
KpiGrid / MetricCard / StatCard

| Estado | Status |
|---|---|
| Default | ✅ |
| Loading skeleton | ❌ |
| Error | ❌ |
| Empty (no data yet) | ❌ |
| Trend up/down | ✅ delta com cor |
| Refresh transition | ❌ |

**Cobertura: 2/6 = 33%.**

### 3.10 Full screens
DashboardScreen / EmptyDashboardScreen / ProfileScreen / RomaneiosScreen / SettingsScreen

✅ EmptyDashboardScreen explícito como variant — bom pattern.
❌ Loading screen ausente — quando demo carrega, sem feedback global.
❌ Error screen ausente — 404 / generic error.

## 4. Findings de anatomia

### F-CA-001 — Estados Loading/Async ausentes em > 70% dos componentes interativos
- **Componentes:** Button, Input, FormField, Table, Cards, Auth screens, Dashboard widgets
- **Severidade:** P2
- **Recomendação:** definir variant `<X loading />` para os 5 componentes mais usados (Button, FormField, Table, Card, Auth submit). Ver state-inventory § 7.
- **Esforço:** M (cross-component)

### F-CA-002 — Estados Empty/No-results parcialmente cobertos
- **Componentes:** EmptyState existe mas não claro quando aplicar; AppTable/Romaneios sem fallback empty; Search/filter sem no-results
- **Severidade:** P2
- **Recomendação:**
  - EmptyState com 3 variants: `default` (Nada por aqui), `no-results` (filtered, com action limpar filtro), `error` (algo deu errado)
  - Documentar quando aplicar em pages técnicas

### F-CA-003 — Estados Focus-visible inconsistentes
- **Componentes:** Card clicável, NavLink, Pagination buttons sem focus-visible claro
- **Severidade:** P1 (a11y)
- **Recomendação:** padronizar focus ring `box-shadow: 0 0 0 3px hsl(var(--ring) / .2)` cross-cutting via `:focus-visible`
- **Esforço:** S
- **Cross-ref:** F-UI-007

### F-CA-004 — Estados Active/Pressed ausentes em buttons
- F-MO-003 cross-ref. **P2.**

### F-CA-005 — Form fields: validação live (Invalid) sem padrão claro
- **Componentes:** FormField, Input, Combobox
- **Recomendação:** padrão "validate on blur + clear on type" + state Invalid (border + helper text + ícone alert).
- **Esforço:** M
- **Prioridade:** P2

### F-CA-006 — Disabled vs Read-only não diferenciados visualmente
- **Componentes:** Input, Textarea
- **Recomendação:** disabled mais sutil + cursor not-allowed; read-only com cursor default + bg muted leve.
- **Esforço:** XS
- **Prioridade:** P3

### F-CA-007 — Drag state ausente em FileUpload
- F-UX-029. **P3.**

### F-CA-008 — Focus-visible em Button primary: ring teal sobre fundo teal
- F-UI-007 cross-ref. Ring offset (2px white outline + 3px primary halo). **P2.**

### F-CA-009 — Selected state em rows de Table/AppTable não mostrado nas showcase
- **Componentes:** Table, AppTable (Romaneios template usa checkbox de seleção, mas showcase data.html não)
- **Recomendação:** adicionar variant "AppTable — selected rows" mostrando highlight + bulk actions bar.
- **Esforço:** S
- **Prioridade:** P3

### F-CA-010 — Expanded state em Sidebar groups (sections "Operação"/"Cadastros")
- **Componentes:** Sidebar
- **Observação:** sections não colapsam — sempre expanded
- **Recomendação opcional:** se quiser, adicionar collapse de section ao clicar no label. Caso contrário, ok.
- **Prioridade:** P4

### F-CA-011 — Auth screens: success/error post-submit ausentes
- **Componentes:** LoginScreen (mock auth), Forgot, Reset, Confirm
- **Recomendação:** mostrar transition pra success state (ex: ✅ "Email enviado, verifique sua caixa") + error state (banner red top).
- **Esforço:** M
- **Prioridade:** P2

### F-CA-012 — Dashboard widgets sem skeleton
- F-MO-004 cross-ref. **P2.**

### F-CA-013 — Loading screen global ausente
- **Componentes:** página inteira logging-in
- **Recomendação:** spinner full-page entre login → dashboard (300ms).
- **Esforço:** XS
- **Prioridade:** P3

## 5. Boundary com outras skills

- **`ui-design-system`** — donos dos tokens visuais que cada estado usa (cores/contrast/motion). Não duplicar aqui.
- **`react-patterns`** — implementação de hooks/state management dos estados (loading via `useState`, async via `useEffect`).
- **`motion-design`** — transições entre estados (default → hover → active → disabled).
- **`ux-audit`** — audit de cobertura de estados em fluxos reais (não anatomia per se).

## 6. Backlog priorizado

| ID | Título | Sev | Esforço | Prioridade |
|---|---|---|---|---|
| F-CA-003 | Focus-visible inconsistente | Alta (a11y) | S | **P1** |
| F-CA-008 | Focus ring offset em Button primary | Alta | XS | **P1** |
| F-CA-001 | Loading/Async cross-component | Média | M | **P2** |
| F-CA-002 | Empty/No-results variants | Média | M | **P2** |
| F-CA-004 | Buttons sem :active | Média | XS | **P2** |
| F-CA-005 | Validação live FormField | Média | M | **P2** |
| F-CA-011 | Auth post-submit states | Média | M | **P2** |
| F-CA-012 | Dashboard skeletons | Média | S | **P2** |
| F-CA-006 | Disabled vs Read-only | Baixa | XS | **P3** |
| F-CA-007 | FileUpload drag state | Baixa | S | **P3** |
| F-CA-009 | AppTable selected rows showcase | Baixa | S | **P3** |
| F-CA-013 | Loading screen global | Baixa | XS | **P3** |
| F-CA-010 | Sidebar section collapse | Baixa | S | **P4** |

## 7. Observação estratégica

O DS está **bem cobrindo estados primários** (default + hover + variant + disabled). **Falha em estados secundários de produção real** — loading, error, empty differential, async, success transitions. Para um DS que se vende como "pronto pra usar", a cobertura ~38% é o gap pra "consumível por dev externo sem ele ter que inventar padrão".

**Roadmap sugerido:**
1. **Wave A (P1):** focus-visible cross-cutting + ring offset (~2h)
2. **Wave B (P2):** loading/async + empty/error variants nos top 5 components (~1 dia)
3. **Wave C (P3):** polish drag, success post-submit, validação live (~1 dia)
