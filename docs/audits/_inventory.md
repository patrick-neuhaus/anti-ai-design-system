# Inventário factual — anti-ai-design-system

> **Data:** 2026-05-02
> **Tipo:** ground-truth descritivo, sem julgamento — base pra todos os audits
> **Método:** filesystem scan + leitura HTML/CSS/JSX + grep tokens/animations

## 1. Páginas servidas

| # | Caminho | URL local | Categoria | Notas |
|---|---|---|---|---|
| 1 | `index.html` | `http://127.0.0.1:8000/` | Root redirect | meta-refresh 0s → showcase/index.html. Fallback 3 links (institucional / demo / catálogo) |
| 2 | `ui_kits/default/showcase/index.html` | `http://127.0.0.1:8000/ui_kits/default/showcase/index.html` | Showcase institucional | Hero floating cards, categorias, CTA pra demo |
| 3 | `ui_kits/default/showcase/base.html` | `.../base.html` | Catálogo técnico | Button/Checkbox/Input/Radio/Select/Switch/Textarea |
| 4 | `ui_kits/default/showcase/surfaces.html` | `.../surfaces.html` | Catálogo técnico | Card/Surface |
| 5 | `ui_kits/default/showcase/display.html` | `.../display.html` | Catálogo técnico | Alert/Avatar/Badge/Dialog/Drawer/EmptyState/Popover/ProgressBar/Skeleton/Spinner/StatusBadge/Tag/Toast/Tooltip |
| 6 | `ui_kits/default/showcase/layout.html` | `.../layout.html` | Catálogo técnico | AppLayout/PageHeader/PageShell/Section |
| 7 | `ui_kits/default/showcase/forms.html` | `.../forms.html` | Catálogo técnico | Combobox/DateField/FileUpload/FormField/NumberField/Slider/Stepper |
| 8 | `ui_kits/default/showcase/navigation.html` | `.../navigation.html` | Catálogo técnico | Breadcrumb/NavLink/Pagination/Sidebar/Tabs/UserMenu |
| 9 | `ui_kits/default/showcase/data.html` | `.../data.html` | Catálogo técnico | AppTable/ListItem/Table |
| 10 | `ui_kits/default/showcase/dashboard.html` | `.../dashboard.html` | Catálogo técnico | KpiGrid/MetricCard/StatCard |
| 11 | `ui_kits/default/showcase/auth.html` | `.../auth.html` | Catálogo técnico | LoginScreen/RegisterScreen/ForgotPasswordScreen/ResetPasswordScreen/ConfirmEmailScreen |
| 12 | `ui_kits/default/showcase/screens.html` | `.../screens.html` | Catálogo técnico | DashboardScreen/EmptyDashboardScreen/ProfileScreen/RomaneiosScreen/SettingsScreen |
| 13 | `ui_kits/default/index.html` | `http://127.0.0.1:8000/ui_kits/default/index.html` | Demo interativa | Login + 3 templates (Ops/CRM/Wiki) interativos. **Usa React + Babel standalone in-browser** |

**Out of scope:** `preview/*.html` (13 previews históricos warm-*).

## 2. Templates demo (após login)

| Template | Email mock | Senha mock | Ícone | Hue brand | User mock |
|---|---|---|---|---|---|
| Ops | `template1@gmail.com` | `Demo!Ops-2026` | Truck | accent (terracotta) | Carlos Andrade — Operador |
| CRM | (a confirmar) | (a confirmar) | (a confirmar) | (a confirmar) | (a confirmar) |
| Wiki | (a confirmar) | (a confirmar) | (a confirmar) | (a confirmar) | (a confirmar) |

> Detalhes CRM/Wiki: serão capturados via Chrome navigation no Wave A.

## 3. Componentes (60 JSX, ~/ui_kits/default/components/)

### 3.1 Base (`base/` — 7)
Button · Checkbox · Input · Radio · Select · Switch · Textarea

### 3.2 Surfaces (`surfaces/` — 2)
Card · Surface

### 3.3 Display (`display/` — 14)
Alert · Avatar · Badge · Dialog · Drawer · EmptyState · Popover · ProgressBar · Skeleton · Spinner · StatusBadge · Tag · Toast · Tooltip

### 3.4 Layout (`layout/` — 4)
AppLayout · PageHeader · PageShell · Section

### 3.5 Forms (`forms/` — 7)
Combobox · DateField · FileUpload · FormField · NumberField · Slider · Stepper

### 3.6 Navigation (`navigation/` — 6)
Breadcrumb · NavLink · Pagination · Sidebar · Tabs · UserMenu

### 3.7 Data (`data/` — 3)
AppTable · ListItem · Table

### 3.8 Auth screens (`auth/` — 5)
LoginScreen · RegisterScreen · ForgotPasswordScreen · ResetPasswordScreen · ConfirmEmailScreen

### 3.9 Dashboard widgets (`dashboard/` — 3)
KpiGrid · MetricCard · StatCard

### 3.10 Full screens (`screens/` — 5)
DashboardScreen · EmptyDashboardScreen · ProfileScreen · RomaneiosScreen · SettingsScreen

### 3.11 App-root (`components/` — 4)
ConferenciaScreen · DeliveriesScreen · Icon · app

**Total: 60 componentes JSX.**

## 4. Tokens declarados

Fonte: `colors_and_type.css` + `presets/default/tokens.css`. Sistema HSL nativo (`hsl(var(--token))`).

### 4.1 Cores (preset default — warm chocolate)

| Token | Valor | Papel |
|---|---|---|
| `--background` | `30 33% 96%` | Warm cream (canvas) |
| `--foreground` | `16 38% 12%` | Dark cocoa (texto) |
| `--card` | `0 0% 100%` | Branco superfície elevada |
| `--card-foreground` | `16 38% 12%` | — |
| `--popover` | `0 0% 100%` | — |
| `--muted` | `30 20% 90%` | Bg muted |
| `--muted-foreground` | `20 29% 33%` | Texto secundário |
| `--border` | `30 20% 87%` | Bordas |
| `--input` | `30 33% 96%` | Bg input |
| `--ring` | `184 100% 18%` | Focus ring (= primary) |
| `--primary` | `184 100% 18%` | Teal petroleum #00585c |
| `--primary-foreground` | `0 0% 100%` | Texto sobre primary |
| `--secondary` | `30 33% 93%` | — |
| `--accent` | `12 65% 55%` | Terracotta |
| `--accent-foreground` | `16 38% 11%` | Dark cocoa (AA pass ≥4.5:1, comentário no css) |
| `--destructive` | `0 100% 43%` | Vermelho ajustado pra AA c/ white FG (~5:1) |
| `--success` | `152 85% 30%` | Verde |
| `--warning` | `38 92% 50%` | Amarelo |
| `--info` | `217 91% 45%` | Azul |
| `--sidebar-background` | `184 100% 18%` | Sidebar dark teal |
| `--sidebar-foreground` | `0 0% 100%` | — |
| `--sidebar-accent` | `184 80% 25%` | — |
| `--sidebar-border` | `184 80% 22%` | — |
| `--sidebar-indicator` | `12 65% 55%` | Active dot accent |

### 4.2 Tipografia

| Token | Valor |
|---|---|
| `--font-body` | `'Poppins', ui-sans-serif, system-ui, sans-serif` |
| `--font-display` | `'Lora', Georgia, serif` |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` |

| Tamanho | Valor |
|---|---|
| `--text-xs` | 12px |
| `--text-sm` | 14px |
| `--text-base` | 16px |
| `--text-lg` | 18px |
| `--text-xl` | 20px |
| `--text-3xl` | (não listado no grep — confirmar) |

Pesos: `--weight-normal` 400 · `--weight-medium` 500 · `--weight-semibold` 600
Line-height: `--leading-tight` 1.25 · `--leading-normal` 1.5 · `--leading-relaxed` 1.625
Tracking: `--track-tight` -0.025em · `--track-normal` 0

### 4.3 Radii

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 6px | — |
| `--radius-md` | 8px | — |
| `--radius-lg` | 12px | buttons |
| `--radius-xl` | 16px | rows |

### 4.4 Easing

| Token | Valor |
|---|---|
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### 4.5 Tokens hardcoded encontrados (drift)

> A confirmar nos audits — exemplos detectados nos primeiros files lidos:

- `font-size:13px` literal em `tpl-card-name`, `nav-item`, `field-input`, várias classes (deveria ser `--text-sm`?)
- `font-size:11.5px`, `12.5px`, `10px` valores fora da escala oficial
- `padding`, `gap`, `margin` em pixels literais — sem token de spacing
- `border-radius:10px`, `12px`, `16px`, `999px` — alguns batem token, outros não
- `box-shadow:0 1px 2px hsl(var(--foreground)/.04)` — usa var mas não é token sombra
- Cores hardcoded `hsl(35 85% 30%)`, `hsl(0 70% 40%)` em `.pill.warn`, `.pill.err` — bypassa `--warning`/`--destructive`

> Levantamento completo no `02-ui-design-system-audit.md`.

## 5. Motion inventory (factual, sem julgamento)

| File | `@keyframes` + `animation:` + `transition:` |
|---|---|
| `ui_kits/default/index.html` | 43 ocorrências |
| `ui_kits/default/showcase/index.html` | 63 ocorrências |
| `colors_and_type.css` | 4 ocorrências |
| `presets/default/tokens.css` | 0 ocorrências |

### 5.1 Animations (loops infinitos detectados na primeira leitura)

- `orb-float-a` 16s ease-in-out infinite (login brand panel)
- `orb-float-b` 18s ease-in-out infinite (login brand panel)
- `bf-drift` 12s/14s/16s ease-in-out infinite (3 floating glyphs)

**3 loops infinitos visíveis simultaneamente no login.** Sem botão pause detectado na primeira leitura.

### 5.2 Transitions cataloged

- `border-color`, `background`, `box-shadow`, `transform`, `opacity`, `color` em durations 120ms / 150ms / 250ms / 400ms / 600ms / 800ms
- Várias durations diferentes sem token de motion (`--motion-fast` / `--motion-normal` etc não existem nos tokens vistos)

### 5.3 Pilares cobertos (a determinar no audit)

- **Pilar 1 (funcional):** ✅ presente — hover/focus/active em buttons, cards, inputs
- **Pilar 2 (vetorial/branding):** ⚠️ parcial — animated logos? a verificar
- **Pilar 3 (narrativo/editorial):** ❓ a verificar — hero entries, parallax, scrollytelling
- **Pilar 4 (espacial/imersivo):** ❌ provavelmente ausente — sem 3D/WebGL detectado nos files lidos

## 6. React stack

### 6.1 Runtime

- **React 18.3.1 UMD** via unpkg CDN
- **react-dom 18.3.1 UMD** via unpkg CDN
- **@babel/standalone 7.29.0** in-browser JSX compile
- **NÃO** usa Vite/Webpack/build pipeline
- Script tag: `<script type="text/babel">` — Babel compila no client

### 6.2 Hooks usados

| Hook | Arquivos detectados |
|---|---|
| `useState` | app.jsx (3) |
| `useEffect` | (presente em files não escaneados ainda) |
| `useMemo` | (a confirmar) |
| `useCallback` | (a confirmar) |
| `useRef` | (a confirmar) |
| `ConferenciaScreen.jsx` | 2 hooks |

> Análise full em `05-react-patterns-audit.md`.

### 6.3 Bibliotecas

- React UMD only — **sem** Radix/Headless UI/Floating UI
- Ícones inline SVG (`Icon.jsx`, ~7700 bytes — provavelmente ~30 ícones)
- **Sem** state manager (Zustand/Redux) — tudo `useState` local

### 6.4 Padrões arquiteturais

- App.jsx orquestra rotas via `useState` (`route` + `SCREENS` dict) — sem React Router
- LoginScreen → setAuthed(true) → muda render
- Sem code splitting (tudo carrega de uma vez via babel standalone)
- **Build pra produção?** Provavelmente não — perf babel-in-browser é tradeoff conhecido

## 7. Cross-browser stack declarado

- **Sem** `package.json browserslist` detectado na primeira leitura
- React 18.3 UMD: suporta Chrome 73+, FF 78+, Safari 13.1+, Edge 79+
- Babel standalone: idem
- Features CSS detectadas que precisam atenção:
  - `backdrop-filter: blur(...)` — suportado mas com `-webkit-` em Safari < 18
  - `mask-image` / `-webkit-mask-image` — declarado com prefix
  - `:focus-within` — Safari 10.1+
  - `gap` em flexbox — Safari 14.1+
  - `scrollbar-width: thin` — não suportado em Safari (degrada graciosamente)

## 8. Server runtime

- `127.0.0.1:8000` (servidor estático rodando, confirmado pelo Patrick)
- Sem backend — tudo client-side
- Sem service worker / PWA detectado

## 9. Observações pré-audit

1. **DS já tem comments WCAG AA** em `--accent-foreground` e `--destructive` — sinal positivo de awareness de a11y
2. **Babel-in-browser** é decisão consciente pra demo / showcase — não pra produção
3. **3 templates devem reutilizar mesmo Sidebar/PageShell** — verificar se há diferenciação clara
4. **Login com 3 floating loops infinitos** já é red flag de motion-audit (WCAG 2.2.2)
5. **Tokens `--text-*` não cobrem `13px`, `11.5px`, `12.5px`, `10px`** — drift documented inline em vários CSS
