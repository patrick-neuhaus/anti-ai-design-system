# Component Inventory — CRM Template vs Docs (Iter 3)

> Catálogo completo: o que template usa inline vs o que existe em `/components/`. Identifica duplicates pra refactor + candidatos novos.

## A) Components em `/components/` (canonical, documentados em showcase)

| Categoria | Components | Count |
|---|---|---|
| auth/ | ConfirmEmail, ForgotPassword, Login, Register, ResetPassword | 5 |
| base/ | Button, Checkbox, Input, Radio, Select, Switch, Textarea, ToggleGroup | 8 |
| dashboard/ | Chart, KpiGrid, MetricCard, StatCard | 4 |
| data/ | AppTable, ListItem, Table | 3 |
| display/ | Accordion, Alert, Avatar, Badge, Dialog, Drawer, EmptyState, Popover, ProgressBar, Separator, Skeleton, Spinner, StatusBadge, Tag, Toast, Tooltip | 16 |
| forms/ | Combobox, DateField, FileUpload, FormField, NumberField, Slider, Stepper | 7 |
| layout/ | AppLayout, NavHeader, PageHeader, PageShell, Section | 5 |
| navigation/ | Breadcrumb, NavLink, Pagination, Sidebar, Tabs, UserMenu | 6 |
| screens/ | DashboardScreen, EmptyDashboardScreen, ProfileScreen, RomaneiosScreen, SettingsScreen | 5 |
| surfaces/ | Card, Surface | 2 |
| **Total** | | **61** |

## B) Components inline em `index.html` (template CRM)

| Linha | Inline component | Categoria docs equivalente | Status |
|---|---|---|---|
| 557 | LoginScreen | auth/LoginScreen.jsx | **DUPLICATE** |
| 691 | AppSidebar | navigation/Sidebar.jsx | **DUPLICATE** (template-specific data shape) |
| 803 | OpsDashboard | screens/DashboardScreen.jsx | template-specific (Ops) |
| 843 | CrmDashboard | screens (NEW — extrair) | **NEW candidate screens/** |
| 872 | TelemetriaIACard | dashboard (NEW) | **NEW candidate dashboard/** |
| 908 | FunnelStagesChart | dashboard/Chart.jsx (variante) | **NEW candidate dashboard/** |
| 949 | PipelineTrendChart | dashboard/Chart.jsx (variante) | **NEW candidate dashboard/** |
| 999 | WikiDashboard | screens (Wiki specific) | template-specific |
| 1043 | Breadcrumb | navigation/Breadcrumb.jsx | **DUPLICATE** |
| 1056 | Pagination | navigation/Pagination.jsx | **DUPLICATE** |
| 1087 | Checkbox | base/Checkbox.jsx | **DUPLICATE** |
| 1103 | SelectField | base/Select.jsx | **DUPLICATE** |
| 1113 | ProgressBar | display/ProgressBar.jsx | **DUPLICATE** |
| 1122 | Drawer | display/Drawer.jsx | **DUPLICATE** (canonical tem focus trap) |
| 1162 | Dialog | display/Dialog.jsx | **DUPLICATE** |
| 1200 | Skeleton | display/Skeleton.jsx | **DUPLICATE** |
| 1212 | EmptyState | display/EmptyState.jsx | **DUPLICATE** |
| 1223 | Slider | forms/Slider.jsx | **DUPLICATE** |
| 1233 | NumberStepper | forms/Stepper.jsx ou NumberField.jsx | **DUPLICATE** |
| 1248 | RadioGroup | base/Radio.jsx | **DUPLICATE** |
| 1267 | TextareaField | base/Textarea.jsx ou forms/FormField.jsx | **DUPLICATE** |
| 1295 | RomaneiosPage | screens/RomaneiosScreen.jsx | **DUPLICATE** |
| 1500 | CenarioPill | display/Tag.jsx (variante) | **NEW candidate display/** |
| 1521 | PipelinePage | screens (NEW) | **NEW candidate screens/** |
| 1708 | ContatosPage | screens (NEW) | **NEW candidate screens/** |
| 1770 | RelatoriosPage | screens (NEW) | **NEW candidate screens/** |
| 1910 | ConversasPage | screens (NEW) | **NEW candidate screens/** |
| 2036 | PromptsPage | screens (NEW) | **NEW candidate screens/** |
| 2099 | ArticlesPage | screens (NEW Wiki) | template-specific |
| 2268 | ProfileScreen | screens/ProfileScreen.jsx | **DUPLICATE** |
| 2396 | ToggleSwitch | base/Switch.jsx | **DUPLICATE** |
| 2414 | SettingsScreen | screens/SettingsScreen.jsx | **DUPLICATE** (já não usado, swap p/ TokenEditorPreview) |

## C) Candidatos pra adicionar em `/components/`

| Inline component | Sugestão categoria | Justificativa |
|---|---|---|
| **CenarioPill** | display/Tag.jsx (extender) ou display/CenarioBadge.jsx | Pattern qualification A-F útil pra qualquer CRM. Reutilizável |
| **TelemetriaIACard** | dashboard/AICard.jsx (novo) ou dashboard/MetricGrid.jsx | Observabilidade IA — emergente em DS modernos (Vercel Analytics, OpenAI dashboards) |
| **FunnelStagesChart** | dashboard/Chart.jsx (variante "funnel") | Chart genérico já existe — adicionar variante funnel |
| **PipelineTrendChart** | dashboard/Chart.jsx (variante "trend area") | Idem — variante trend |
| **CrmDashboard** | screens/CrmDashboardScreen.jsx | Tela mock template — útil como case |
| **PipelinePage** | screens/PipelineScreen.jsx (kanban + lista + drawer) | Padrão CRM essencial |
| **ContatosPage** | screens/ContactsScreen.jsx | Idem |
| **RelatoriosPage** | screens/ReportsScreen.jsx | Idem |
| **ConversasPage** | screens/ConversationsScreen.jsx | Padrão chat WhatsApp-like — alta reutilização |
| **PromptsPage** | screens/PromptsLibraryScreen.jsx | Padrão prompt-library AI — emergente |

## D) Action plan

### Phase 1 — ✅ COMPLETE (commit `04151fa`)

- [x] Doc gerado neste arquivo
- [x] "Categorias de componentes" → "Componentes" em showcase

### Phase 2 — ✅ COMPLETE (commit `3b5ac7b`)

- [x] Carregado canonical scripts: Icon.jsx, display/Drawer.jsx, display/Dialog.jsx
- [x] Removido inline Drawer + Dialog (~80 linhas)
- [x] Verificado: Pipeline drawer abre/fecha c/ canonical (focus trap nativo, Icon.X close, motion tokens)

### Phase 3 — DEFERRED (manual review necessária)

10 inline duplicates restantes com signature mismatches:

| Inline | Canonical | Mismatch |
|---|---|---|
| Skeleton({width,height,rounded}) | Skeleton({width,height,radius,label,style}) | `rounded:bool` vs `radius:number` |
| EmptyState({icon,title,desc,action,onAction}) | EmptyState({icon,title,description,action}) | `desc`→`description`, `action+onAction`→`action` (props mudaram) |
| ProgressBar({value,max,color}) | ProgressBar({value,max,label,showPercent,intent,height}) | `color:string`→`intent:enum` |
| Slider({value,onChange,min,max,step}) | Slider (TBD signature) | check |
| NumberStepper | Stepper ou NumberField (escolha) | naming + signature |
| RadioGroup | Radio (single) — group pattern? | check |
| TextareaField | Textarea ou FormField (escolha) | naming |
| Breadcrumb | navigation/Breadcrumb.jsx | usage map |
| Pagination | navigation/Pagination.jsx | check |
| Checkbox / SelectField / ToggleSwitch | base/* | naming + signature |

Cada swap requer:
1. Grep usages no template
2. Map props inline → canonical
3. Test visual + functional
4. Commit individual

Trabalho manual estimado: 4-6h. Não autonomous nesta sessão.

### Phase 4 — extract candidatos pra docs

10 components inline candidatos (CenarioPill, TelemetriaIACard, FunnelStagesChart, PipelineTrendChart, CrmDashboard, PipelinePage, ContatosPage, RelatoriosPage, ConversasPage, PromptsPage). Criar arquivos novos em `/components/` + showcase entries.

Trabalho manual estimado: 6-8h. Não autonomous nesta sessão.

## E) Resumo executivo

- **31 inline components** no template
- **12 são duplicates** de canonical em /components/
- **10 são candidatos** novos (alta reutilização)
- **9 são template-specific** (mantém inline OK)

Refactor strategy: começar pelos 5 P0 (Drawer/Dialog/Skeleton/EmptyState/ProgressBar) → próxima iteração mover Checkbox/Radio/Select/Slider/Stepper/Switch (signatures podem diferir, validar 1 por 1) → última iteração extrair candidatos pra docs.
