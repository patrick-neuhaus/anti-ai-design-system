# React Patterns Audit — anti-ai-design-system

> **Skill:** `react-patterns --audit-cross-browser` v3
> **Data:** 2026-05-02
> **Escopo:** 60 JSX files em `ui_kits/default/components/` + browser stack (React 18.3.1 UMD + Babel standalone in-browser via unpkg CDN)
> **Método:** análise estática JSX + browser support matrix + cross-browser CSS feature audit

## 1. Resumo Executivo

| Dimensão | Status | Notas |
|---|---|---|
| **Stack architecture** | ⚠️ **Demo-tier** | React UMD + Babel standalone in-browser. **Inviável produção** (perf babel compile + bundle 1MB+). ✅ ok pra showcase |
| **State management** | ✅ Adequate | useState local + props drilling. Sem Redux/Zustand — adequado pro escopo |
| **Hooks usage** | ⚠️ Não auditado completo | `useState`, `useEffect` confirmados em app + ConferenciaScreen |
| **Re-render hygiene** | ❓ Não medido | Sem memoização visível (`useMemo`, `useCallback`, `React.memo`) |
| **Routing** | ⚠️ Manual | `useState` route + dict `SCREENS` — sem React Router |
| **Architecture-guard (thin client)** | ✅ N/A | Sem backend — tudo client é apropriado |
| **Cross-browser baseline** | ⚠️ **Não declarado** | Sem `package.json` browserslist. CSS usa features que precisam atenção (ver §6) |
| **Reduced motion / a11y JSX** | ⚠️ Parcial | `prefers-reduced-motion` ausente; ARIA inconsistente |

**Veredicto:** o repositório **está calibrado pra o que é** — showcase + demo. **Não é, não deve, e não precisa ser produção React.** Os findings de react-patterns não são "consertar pra produção" — são "o que **pegar** se este código for replicado por dev externo via Lovable knowledge ou copy-paste".

**3 prioridades:**
1. **Documentar explicitamente** que babel standalone é DEMO ONLY — adicionar warning no README.
2. **`prefers-reduced-motion` cross-cutting** (mesmo P1 que motion-audit).
3. **Cross-browser CSS audit** — features modernas com fallback.

## 2. Stack architecture

### 2.1 Runtime detectado

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin></script>
<script type="text/babel">/* JSX inline */</script>
```

⚠️ **Implicações:**
- **react.development.js** (não production) — ~140KB gzipped, com warnings, slow dev mode
- **babel/standalone** (~3MB!) — compila JSX no client toda carga
- **In-browser JSX compile** — first paint atrasada significativamente em mobile / connection lenta
- **Sem code splitting** — tudo carrega de uma vez

### 2.2 Trade-off avaliado

✅ **Pra demo / showcase:**
- Zero build setup — abre HTML, funciona
- Patrick replica facilmente em outro lugar
- Lovable pode importar via Project Knowledge sem npm install

❌ **Pra produção real:**
- Boot lento mobile
- Bundle pesado (3MB babel)
- React em dev mode (warnings, perf hit)
- Sem tree-shaking

**Decisão Patrick implícita:** repo é showcase, não app. **OK.**

### 2.3 Findings stack

#### F-RP-001 — React + Babel standalone in-browser apenas pra demo (não produção)
- **Severidade:** P3 (informacional)
- **Recomendação:**
  - Adicionar warning no README.md: "⚠️ This repo uses React + Babel standalone for showcase purposes. For production, use Vite/Next.js + npm build."
  - Adicionar comment no `<script>` HTML
- **Esforço:** XS

#### F-RP-002 — `react.development.js` em vez de `production.min.js`
- **Severidade:** P3
- **Observação:** dev mode tem warnings úteis no dev tools — ok pra showcase. Mas se Patrick demo pra prospect, prospect vê console warnings.
- **Recomendação:** considerar `production.min.js` pra demos públicas; manter `development.js` pra dev local.
- **Esforço:** XS

## 3. State management

### 3.1 Padrões identificados

`app.jsx` (root):
```jsx
const App = () => {
  const [authed, setAuthed] = React.useState(false);
  const [route, setRoute] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);
  // ...
}
```

✅ **Adequado:** `useState` local, sem global state manager. Drilling via props (`onLogin`, `onNavigate`, `onLogout`).

### 3.2 Findings state

#### F-RP-003 — Sem state manager — drilling via props funcional, mas se crescer 2x, considerar Context
- **Severidade:** P4
- **Recomendação:** se templates crescerem (ex: cada template ter 10+ screens), introduzir `React.createContext` pro user/preset. Atualmente, drilling de 1-2 níveis é OK.
- **Esforço:** N/A (não fazer agora)

## 4. Hooks usage

### 4.1 Detected

| File | Hooks | Count |
|---|---|---|
| `app.jsx` | useState | 3 |
| `Icon.jsx` | (declarações de ícones — sem hooks) | 0 |
| `DeliveriesScreen.jsx` | (não auditado interno) | 0 |
| `ConferenciaScreen.jsx` | useState, useEffect | 2 |
| `ui_kits/default/index.html` (templates inline) | useState, useEffect, useRef, useCallback | múltiplos |

### 4.2 Findings hooks

#### F-RP-004 — Sem `useMemo` / `useCallback` em listas/callbacks frequentes
- **Severidade:** P3
- **Componentes:** templates Ops/CRM/Wiki re-renderizam toda nav-item ao trocar route
- **Observação:** Sonnet inline no `<script type="text/babel">` tem callbacks definidos in-render — re-criados a cada paint
- **Recomendação:** wrap callbacks frequentes (`onNavigate`, `onLogout`) em `useCallback` se medir re-render issue. **NÃO premature optimize** — auditoria sugere apenas se Patrick reportar lag.
- **Esforço:** S
- **Prioridade:** P3 condicional

#### F-RP-005 — `useEffect` cleanup não auditado
- **Severidade:** P3
- **Recomendação:** se houver subscriptions/timers em useEffect (ex: KPI count-up animation, auto-dismiss toast), confirmar return cleanup. Sem ler todos files, status ❓.
- **Esforço:** S
- **Prioridade:** P3

#### F-RP-006 — Inline functions em onClick podem causar re-renders desnecessários
- **Severidade:** P4
- **Padrão:** `onClick={() => setRoute("conferencia")}` ✅ ok pra demo, mas em produção com 100 nav-items vira lag
- **Recomendação:** N/A (showcase scope)

## 5. Routing

### 5.1 Pattern atual

```jsx
const SCREENS = {
  dashboard: ({ goto }) => <DashboardScreen onOpenRomaneios={() => goto("romaneios")} />,
  deliveries: () => <DeliveriesScreen />,
  // ...
};
const Screen = SCREENS[route] || SCREENS.dashboard;
return <Screen goto={setRoute} />;
```

✅ **Engenhoso:** dict-based routing sem React Router. Funciona pra demo.
⚠️ **Limitações:**
- **Sem URL sync** — refresh perde state, não compartilha link específico
- **Sem back/forward browser** — botão voltar não funciona
- **Sem deep linking** — não consegue compartilhar `/dashboard/romaneios`

### 5.2 Findings routing

#### F-RP-007 — Routing sem URL sync — refresh / back / forward / share quebram
- **Severidade:** P3
- **Componentes:** templates Ops/CRM/Wiki interativos
- **Recomendação opcional:** se Patrick quiser que prospect compartilhe "demo CRM em pipeline" como link, adicionar `window.history.pushState` + `popstate` listener. Caso contrário, deixar.
- **Esforço:** M
- **Prioridade:** P3 condicional

## 6. Cross-browser audit (Phase 5 opt-in)

### 6.1 Stack declarado

❌ **Sem `package.json browserslist` declarado** — sem build target oficial.
React 18.3.1: suporta Chrome 73+, FF 78+, Safari 13.1+, Edge 79+.

### 6.2 CSS features sensíveis cross-browser

#### `backdrop-filter: blur(...)` — usado em `.login-brand-badge`, `.glass-blur` patterns
- **Suporte:** Chrome 76+, FF 103+, Safari 9+ (com `-webkit-`), Edge 79+
- **Status no repo:** declarado direto sem `-webkit-backdrop-filter` em alguns lugares
- **Risco:** Safari < 18 precisa `-webkit-backdrop-filter` separado
- **Recomendação:** adicionar prefix em todos backdrop-filter declarados

#### `mask-image` / `-webkit-mask-image` — usado em `.login-brand-grid`
- **Status no repo:** ✅ correto — declara ambos `mask-image` + `-webkit-mask-image`
- **Sem ação**

#### `:focus-within` — em `.field-group:focus-within label` (se usado)
- **Suporte:** Chrome 60+, FF 78+, Safari 10.1+, Edge 79+
- **Risco baixo** — fallback razoável (sem float label)

#### `gap` em flexbox/grid — usado em maioria de layouts
- **Suporte:** Chrome 84+, FF 63+, Safari 14.1+, Edge 84+
- **Risco:** Safari < 14.1 (iOS 14.4 e antes) ignora gap em flexbox
- **Recomendação:** se R1-R3 declarado "Safari iOS público", confirmar mínimo iOS 14.5+

#### `scrollbar-width: thin` — `.sidebar-nav`
- **Suporte:** Chrome 121+ (✅), FF 64+ (✅), Safari ❌ (não suporta), Edge 121+ (✅)
- **Status no repo:** ✅ tem fallback `::-webkit-scrollbar` declarado em paralelo
- **Sem ação**
- **Cross-ref:** F-UX-019

#### `animation-timeline: scroll()` — não detectado mas potencial fix
- **Suporte:** Chrome 115+, Edge 115+, FF/Safari ❌
- **Status:** não usado atualmente; se adotar pra reading progress (F-MO-016), precisa fallback JS

#### `::-webkit-scrollbar` — visível no `.sidebar-nav`
- **Suporte:** Chrome/Safari/Edge ✅ (webkit), FF ❌
- **Status no repo:** ✅ usado junto com `scrollbar-width` (cross-cutting)

#### `view-transition-name` (View Transitions API) — não usado
- **Suporte:** Chrome 111+, Safari 18+ (✅ recente), FF ❌
- **Recomendação:** se F-MO-006 implementado, garantir fallback graceful (transição instant em FF)

#### CSS Grid — usado em `.login-root`, `.app-shell`, `.kpis`
- **Suporte:** universal (Chrome 57+, FF 52+, Safari 10.1+, Edge 16+) ✅
- **Sem risco**

#### CSS Custom Properties (`var(--token)`) — universal cross-browser
- **Sem risco** ✅

#### `color-mix()` — não detectado, mas comum em DS modernos
- **Suporte:** Chrome 111+, FF 113+, Safari 16.2+, Edge 111+
- **Status:** não usado (sistema HSL com alpha resolve com `hsl(var(--token) / .12)`)
- **Sem ação**

### 6.3 Findings cross-browser

#### F-RP-008 — Sem `package.json browserslist` declarado
- **Severidade:** P2
- **Recomendação:** adicionar:
  ```json
  "browserslist": [
    "last 2 years > 0.5% not dead",
    "Safari iOS >= 15",
    "Edge >= 110"
  ]
  ```
  alinhado com R1-R3 decisão Patrick (last 2 years > 0.5% not dead + Safari iOS público + Edge enterprise).
- **Esforço:** XS
- **Prioridade:** P2

#### F-RP-009 — `backdrop-filter` sem `-webkit-` prefix em alguns blocos
- **Severidade:** P2
- **Componentes:** verificar `.login-brand-badge`, `.glass-blur` (top nav pill)
- **Recomendação:** declarar `-webkit-backdrop-filter` antes de `backdrop-filter` em todas as ocorrências.
- **Esforço:** XS
- **Prioridade:** P2

#### F-RP-010 — `gap` em flexbox: confirmar mínimo iOS 14.5
- **Severidade:** P3
- **Recomendação:** se Patrick declarar Safari iOS 15+ (decisão R), `gap` ok. Documentar.
- **Esforço:** XS
- **Prioridade:** P3

#### F-RP-011 — Sem teste em browsers reais (apenas Chromium)
- **Severidade:** P3
- **Recomendação:** rodar `playwright-browser-matrix.md` (skill react-patterns) com Safari/Firefox/Edge real ou via BrowserStack.
- **Esforço:** M
- **Prioridade:** P3

## 7. Reduced motion / a11y in JSX

### F-RP-012 — `prefers-reduced-motion` não tratado em JSX (apenas CSS issue)
- **Severidade:** P1
- **Componentes:** templates com Sidebar collapse animation, Toast in/out
- **Recomendação:** ler `useReducedMotion()` (Motion lib) ou `window.matchMedia('(prefers-reduced-motion: reduce)')` em useEffect; passar como prop pra desligar animations.
- **Esforço:** S
- **Prioridade:** P1
- **Cross-ref:** F-MO-001, F-MO-cross-cutting

### F-RP-013 — ARIA labels inconsistentes em ícones
- **Severidade:** P2
- **Componentes:** sidebar-toggle, user-action-btn (gear, logout), close buttons em Dialog
- **Recomendação:** padrão `aria-label` obrigatório em buttons icon-only.
- **Esforço:** M
- **Prioridade:** P2
- **Cross-ref:** F-UX-026

### F-RP-014 — Focus management em Dialog/Drawer não auditado
- **Severidade:** P2
- **Recomendação:** confirmar focus trap + restore on close + Esc dismiss em Dialog.jsx, Drawer.jsx, Popover.jsx.
- **Esforço:** S audit + M fix
- **Prioridade:** P2

## 8. Architecture-guard (thin client check)

### N/A — Repo é só client, sem backend

✅ **Sem backend = sem violação thin client.** Mock data inline é apropriado pro escopo (showcase + demo). Se Patrick decidir adicionar backend real (ex: Supabase pra demo "logada"), aí sim aplicar architecture-guard.

## 9. Performance hints (não medido)

⚠️ **Não rodei Lighthouse.** Recomendações baseadas em análise estática:

- **First Contentful Paint:** alto em mobile/3G — babel compile dominante
- **Largest Contentful Paint:** hero "Anti-AI Design System" h1 com Lora 88px — depende de font-load. Sugerir `font-display: swap` (já presumível em Google Fonts default).
- **Cumulative Layout Shift:** floating cards no hero têm dimensão fixa? Se images sem width/height, possível CLS.
- **Time to Interactive:** alto em mobile devido babel — aceitável em demo

**Recomendação:** rodar Lighthouse + relatar em audit separado se Patrick quiser otimização. **Sem ação proativa nesta auditoria.**

## 10. Backlog priorizado

| ID | Título | Sev | Esforço | Prioridade |
|---|---|---|---|---|
| F-RP-012 | `prefers-reduced-motion` em JSX | Alta (a11y) | S | **P1** |
| F-RP-008 | Browserslist declarado | Média | XS | **P2** |
| F-RP-009 | `-webkit-backdrop-filter` prefix | Média | XS | **P2** |
| F-RP-013 | ARIA labels icon buttons | Média | M | **P2** |
| F-RP-014 | Focus trap Dialog/Drawer | Média | M | **P2** |
| F-RP-001 | README warning demo-only | Baixa | XS | **P3** |
| F-RP-002 | production.min.js pra demos públicas | Baixa | XS | **P3** |
| F-RP-004 | useMemo/useCallback condicional | Baixa | S | **P3** condicional |
| F-RP-005 | useEffect cleanup audit | Baixa | S | **P3** |
| F-RP-007 | Routing URL sync opcional | Baixa | M | **P3** condicional |
| F-RP-010 | Confirmar gap iOS 14.5+ | Baixa | XS | **P3** |
| F-RP-011 | Test cross-browser real | Baixa | M | **P3** |

## 11. Cross-refs

- F-RP-012 ↔ F-MO-001 (reduced-motion)
- F-RP-013 ↔ F-UX-026 (ARIA icon labels)
- F-RP-014 ↔ F-CA-003 (focus-visible cross-cutting)
- F-RP-008/009/010 ↔ F-UX-019 (cross-browser Safari)
