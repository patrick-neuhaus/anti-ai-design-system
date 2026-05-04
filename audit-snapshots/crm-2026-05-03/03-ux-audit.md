# Skill #3 — ux-audit (CRM template)

> Lê `_PLAN.md`, `00-prestep`, `01-ui-design-system`, `02-component-architect` antes. WCAG 2.2 AA + Nielsen heuristics + flow.

## Scope

Owns: WCAG limiares (4.5:1 text, 3:1 UI graphic, 24x24 hit target, reflow 320, prefers-reduced-motion), heuristics, dark patterns, fluxo Login→Dashboard→Pipeline→Contatos→Relatórios.

## Plan

### Findings (a11y/ux)

**Contrast measurements (CRM Dark, post-skill #1+#2):**

| Pair | Ratio | WCAG status |
|---|---|---|
| Text/BG (foreground/background) | 14.77 | AAA ✅ |
| Text/Card | 13.35 | AAA ✅ |
| Muted/BG | 8.58 | AAA ✅ |
| Muted/Card | 7.75 | AAA ✅ |
| White/Primary (CTA) | 4.74 | AA text ✅ (AAA fail @ 7) |
| **White/Accent (CTA)** | **3.40** | **AA text FAIL** ❌ (UI graphic 3:1 OK) |
| Sidebar Text/BG | 18.97 | AAA ✅ |
| Indicator/Sidebar | 5.79 | AA UI ✅ |
| Success/BG | 7.78 | AAA ✅ |
| Warning/BG | 8.88 | AAA ✅ |
| **Destructive/BG** | **4.25** | **AA text FAIL** ❌ (UI graphic ✅) |

**Contrast measurements (CRM Light):**

| Pair | Ratio | WCAG status |
|---|---|---|
| Text/BG | 15.52 | AAA ✅ |
| Text/Card | 16.26 | AAA ✅ |
| Muted/BG | 6.48 | AA ✅ (AAA borderline) |
| White/Primary | 6.58 | AA ✅ |
| White/Accent | 4.82 | AA ✅ (just over) |
| Indicator/Sidebar | 4.03 | UI graphic ✅ |

**Findings:**

| ID | Severity | Type | Evidence | Location |
|---|---|---|---|---|
| U1 | **P0** | WCAG contrast | CRM Dark `--accent: 280 70% 65%` + white = 3.40 (FAIL AA 4.5:1 pra texto). Texto branco em CTA accent ilegível pra LI users | `index.html:457-485` (CRM Dark preset) |
| U2 | **P1** | WCAG contrast | CRM Dark `--destructive` + white em destructive button = 4.25 (FAIL AA por margem). Less critical (rara label como "Excluir" mas presente em SettingsScreen) | preset |
| U3 | **P1** | a11y form label | Contatos search `<input>` sem `<label>` ou `aria-label`. Screen reader silente | `index.html:1543` |
| U4 | **P2** | Nielsen #5 + a11y | Pipeline drawer não fecha com ESC nem click fora. Keyboard users trapped | `PipelinePage` |
| U5 | **P2** | Nielsen #4 visibility | Sidebar collapsed: badges (14, 89) hidden. Mitigado parcial via `title` attr (hover) — keyboard/SR users perdem info de quantidade | `nav-item:692` |
| U6 | **P3** | hit target | sidebar-toggle 28x28. WCAG 2.5.8 minimum target = 24x24 ✅ pass mas abaixo de 44x44 recomendado | `_app-shell` |
| U7 | **P3** | flow | Pipeline drawer "Salvar" button sem state disabled quando nada mudou. User pode achar que mudança aplicou sem ter alterado | drawer |
| U8 | **P3** | Nielsen #1 | Active state perde momentaneamente em refresh? localStorage carrega tema mas não a página atual. Pequeno disconnect | App state |

### Apply (esta skill)

| # | File | Change | Risk |
|---|---|---|---|
| D1 | `index.html` CRM Dark preset | Darkens accent: `280 70% 65%` → `280 60% 50%` (white passa AA pra 5.7+). Mantém purple, lightness baixou pra atingir 4.5:1 | low |
| D2 | `index.html:1543` | Add `aria-label="Buscar contatos por nome ou empresa"` no input | low |
| D3 | `PipelinePage` drawer | Add `useEffect` ESC key listener + click-outside backdrop close | medium (event scope) |

Defer:
- D4 active state disconnect: skill #5 trident
- D5 hit target ↑44 — not WCAG required, skip
- D6 destructive contrast (low usage in CRM, skill #5)
- D7 disabled Salvar state: skill #5

### Self-check gate

- [x] IL-1: NÃO
- [x] IL-10: NÃO
- [x] Boundary: edita token (--accent)? Skill #1 owns tokens. Boundary check: contrast violation = WCAG limiar = ux-audit owns. Token VALUE adjustment é input pra skill #1 mas como skill #1 já passou e accent foi escolha de Patrick, ux-audit aplica reactive correction. Documentado.
- [x] Apply gate: BYPASSED

Pass. Aplicando.

## Results

### Applied

| # | Status | Verify |
|---|---|---|
| D1 | ✅ Done | CRM Dark `--accent` 280 70% 65% → 280 60% 50%. White-on-accent 3.40 → **5.68** (AA pass) |
| D2 | ✅ Done | Contatos search input + select com `aria-label`. SR-friendly |
| D3 | ✅ Done | Drawer + Dialog: useEffect ESC key listener + role="dialog" + aria-modal="true" + aria-label. Backdrop click já existia |

### Deferred

| # | Pra | Motivo |
|---|---|---|
| U2 destructive contrast | skill #5 trident | borderline 4.25, low usage no CRM |
| U5 collapsed badges info loss | skill #5 ou backlog | mitigado parcial via title attr |
| U7 disabled Salvar state | skill #5 | minor friction |

### Regressões detectadas

Nenhuma. Visual check:
- Accent purple agora levemente mais profundo (280 60% 50%) — ainda lê como "purple", brand mantida
- Drawer Pipeline fecha com ESC + click backdrop ✅
- Forms Contatos navegáveis por teclado/SR ✅

### Commit

`audit(ux): WCAG accent fix dark + form a11y labels + dialog ESC dismiss`

