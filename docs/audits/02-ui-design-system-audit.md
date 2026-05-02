# UI Design System Audit — anti-ai-design-system

> **Skill:** `ui-design-system --audit` v2 (read-only)
> **Data:** 2026-05-02
> **Escopo:** tokens (`colors_and_type.css`, `presets/default/tokens.css`), aplicação de tokens nos 13 HTML/JSX, drift, identidade
> **Método:** análise estática CSS + visual inspection via Chrome + grep de hardcoded values
> **Escala maturidade:** L0–L4 (L4 = sistêmico/auto-validado)
> **Importante:** este audit **NÃO modifica DS** — apenas documenta findings

## 1. Resumo Executivo

| Dimensão | Maturidade | Notas |
|---|---|---|
| **Cores semânticas** | **L3 — tokenizado** | Sistema HSL `hsl(var(--token))` consistente, comments WCAG AA inline. Falta dark-mode rigor em CRM preset. |
| **Tipografia** | **L2 — consistente** | 3 fonts canônicas (Poppins/Lora/Geist Mono), escala `--text-xs..xl` definida. **Drift:** valores `13px`, `11.5px`, `12.5px`, `10px` literais em vários estilos não cobertos por token. |
| **Spacing** | **L1 — básico** | **Sem tokens de spacing** declarados (`--space-1..N`). Padding/margin/gap tudo em `px` literal. |
| **Radii** | **L3 — tokenizado** | `--radius-sm/md/lg/xl` cobrindo casos comuns. Drift mínimo (`16px`, `999px`, `12px` ocasional). |
| **Sombras** | **L1 — básico** | Sombras inline `box-shadow: 0 1px 2px hsl(var(--foreground)/.04)` — não tokenizado. |
| **Motion (durations/easing)** | **L1 — básico** | `--ease` único definido. Durations `120ms`, `150ms`, `200ms`, `400ms`, `600ms` literais — sem `--motion-fast/normal/slow`. |
| **Identidade visual** | **L4 — sistêmico** | Anti-AI manifesta clara: warm cream + teal petroleum + terracotta + 3 fonts editoriais. Foge do shadcn-default. **Forte.** |
| **Theme switching** | **L3 — tokenizado** | 3 presets (Ops/CRM Dark/Wiki Sage) trocam hue runtime. Funciona. |
| **Componentes** | **L2 — consistente** | 60 JSX usam tokens. Drift quando se afasta de DS (ver §3). |

**Maturidade global:** **L2.5 — consistente com gaps tokenizáveis**. O sistema **tem identidade forte**, mas falta tokenizar spacing, sombras e motion pra subir pro L3. Isso é a diferença entre "tem DS" e "tem DS consumível por outro projeto".

## 2. Inventário de tokens (factual)

### 2.1 Cores semânticas (preset Ops Default)

✅ **Cobertura forte:**
- Action: `--primary` (teal #00585c), `--primary-foreground`, `--ring`
- Brand: `--accent` (terracotta), `--accent-foreground`
- Surface: `--background` (cream), `--card`, `--popover`, `--muted`, `--secondary`
- Text: `--foreground` (dark cocoa), `--muted-foreground`, `--card-foreground`
- Border: `--border`, `--input`
- Status: `--destructive`, `--success`, `--warning`, `--info`
- Sidebar (specialty): `--sidebar-background`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-indicator`

✅ **Comments WCAG AA inline:** `--accent-foreground` declara "AA pass (>=4.5:1 vs ~3.74:1 c/ white)" — sinal positivo de awareness. **Maturidade L4 nesta dimensão.**

### 2.2 Tipografia

| Token | Valor | Aplicado |
|---|---|---|
| `--font-body` | Poppins, ui-sans-serif | ✅ body global |
| `--font-display` | Lora, Georgia, serif | ✅ headings (`.t-h1`, `.t-h2`, page-title, kpi-value) |
| `--font-mono` | Geist Mono, ui-monospace | ✅ labels mono (`.t-mono`, `.kpi-label`, `.section-label-mono`) |
| `--text-xs` | 12px | ✅ |
| `--text-sm` | 14px | ✅ |
| `--text-base` | 16px | ✅ |
| `--text-lg` | 18px | ✅ |
| `--text-xl` | 20px (page title h2) | ✅ |
| `--text-3xl` | (declared mas não no grep limit) — 56px? | ✅ Lora display escala |
| `--weight-normal/medium/semibold` | 400/500/600 | ✅ |
| `--leading-tight/normal/relaxed` | 1.25/1.5/1.625 | ✅ |
| `--track-tight/normal` | -0.025em / 0 | ✅ |

### 2.3 Radii

| Token | Valor | Uso semântico |
|---|---|---|
| `--radius-sm` | 6px | small buttons, badges? |
| `--radius-md` | 8px | inputs, cards small? |
| `--radius-lg` | 12px | buttons (declarado) |
| `--radius-xl` | 16px | rows (declarado) |

### 2.4 Easing

| Token | Valor |
|---|---|
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) |

## 3. Drift detectado (hardcoded values fora de token)

### 3.1 Tipografia — drift médio

Encontrado em `ui_kits/default/index.html` style block (login + app shell):

| Valor | Onde | Token sugerido (existe?) |
|---|---|---|
| `font-size:13px` | `.tpl-card-name`, `.nav-item`, `.field-input`, `.btn`, `.kpi`-related | **Nenhum token cobre `13px`** — entre `--text-xs` (12) e `--text-sm` (14). Sugerir `--text-13` ou padronizar pra 14. |
| `font-size:11.5px` | `.pill`, `.kpi-delta` | Idem — entre `xs` e `sm`. |
| `font-size:12.5px` | `.user-name`, `.field-group label` | Idem. |
| `font-size:11px` | `.nav-badge`, `.tab-item`, `.t-meta`, `.section-label-mono`, `.kpi-label` | Próximo de `--text-xs`. Padronizar pra 12 ou criar `--text-11`. |
| `font-size:10px` | `.tpl-cred`, `.nav-section-label` | Mono small. Criar `--text-mono-xs`? |
| `font-size:7.5px` / `7px` | `.sidebar-logo-tag` | Tag diagonal, ok caso especial. |

**Recomendação:** ou (a) **expand escala** pra incluir 11/13/15, ou (b) **collapse** pra 12/14/16 (`xs/sm/base`) e refatorar usages. Patrick decidiu rem 20/30/48/64/80/120 (decisão U2) — alinhar com isso.

### 3.2 Spacing — drift alto (sem token)

Padding, margin, gap em pixels literais:

| Valor literal | Frequência aproximada | Token sugerido |
|---|---|---|
| `4px` | high | `--space-1` |
| `8px` | high | `--space-2` |
| `12px` | high | `--space-3` |
| `16px` | high | `--space-4` |
| `20px` | medium | `--space-5` |
| `24px` | medium | `--space-6` |
| `32px` | low | `--space-8` |
| `40px`, `48px` | low | `--space-10/12` |

**Recomendação:** criar escala de spacing antes do próximo grande refactor. Decisão Patrick (U2) já cobre rem-based escala — aplicar quando tiver tempo.

### 3.3 Sombras — drift médio

```css
box-shadow: 0 1px 2px hsl(var(--foreground)/.04);   /* card, kpi */
box-shadow: 0 2px 8px hsl(var(--foreground)/.18);   /* sidebar-toggle */
box-shadow: 0 3px 12px hsl(var(--foreground)/.25);  /* sidebar-toggle hover */
box-shadow: 0 1px 4px hsl(var(--foreground)/.1);    /* avatar-edit-btn */
box-shadow: 0 2px 4px hsl(var(--foreground)/.15);   /* sidebar-logo-tag */
```

✅ **Bom:** todas usam `hsl(var(--foreground)/.N)` — ficam hue-aware (sem cinza chapado).
⚠️ **Drift:** valores blur/spread/y-offset literais. Cabem em 2-3 tokens:
- `--shadow-xs`: 0 1px 2px (cards, kpis)
- `--shadow-sm`: 0 1px 4px (subtle elevations)
- `--shadow-md`: 0 2px 8px (toggle, dropdowns)
- `--shadow-lg`: 0 3px 12px (hover/pressed elevations)

### 3.4 Motion — drift médio

| Duration literal | Onde | Token sugerido |
|---|---|---|
| `120ms` | nav-item hover, user-action-btn | `--motion-fast` |
| `150ms` | tpl-card transitions, btn-login, link, focus | `--motion-fast` ou `normal` |
| `200ms` | btn hover, btn-primary, modal | `--motion-normal` |
| `250ms` | app-shell collapsed | `--motion-normal` |
| `400ms` | brand-float color transition | `--motion-slow` |
| `600ms` | login-brand-orbs background transition | `--motion-slow` |
| `800ms` | login-brand-orbs transform | `--motion-very-slow`? |
| `12s/14s/16s/18s` | infinite loops orb-float, bf-drift | ambient (não tokenizar — caso especial) |

**Recomendação:** criar `--motion-fast: 120ms`, `--motion-normal: 200ms`, `--motion-slow: 400ms`, `--motion-page: 800ms`. Alinhar com decisão Patrick R4 (cross-browser) e motion-design Pilar 1.

### 3.5 Cores hardcoded (raras mas notáveis)

```css
.pill.warn  { color: hsl(35 85% 30%); }   /* HARDCODED — bypassa --warning-foreground */
.pill.err   { color: hsl(0 70% 40%); }    /* HARDCODED — bypassa --destructive-foreground */
.btn-destructive { color: hsl(0 70% 40%); } /* idem */
```

⚠️ **Risco:** quando preset CRM Dark for ativo, esses valores hardcoded ficam fixos enquanto outros tokens trocam. Possível inconsistência visual.

**Recomendação:** criar `--warning-text` e `--destructive-text` (foreground tokens) por preset.

## 4. Identidade visual — onde brilha

✅ **Cream + Teal + Terracotta:** combinação **fora do default shadcn** (que é cinza neutro + blue-500 + ocasional roxo). Identidade reconhecível em < 1s.
✅ **Lora Display:** font serif editorial em headings dá vibe "publicação" não "Bootstrap admin".
✅ **Hue nos neutros:** `--background: 30 33% 96%` (warm cream, **não** `0 0% 96%` cinza chapado). Mesma filosofia em `--foreground: 16 38% 12%` (cocoa, não black). **Diferencial DR-04 forte.**
✅ **Hue-aware shadows:** todas sombras usam `hsl(var(--foreground)/.N)` — quando preset muda, sombras mudam tom. **Maturidade L4.**
✅ **Geist Mono nos labels:** mono sans-serif técnico em uppercase + tracking + opacity nos labels (`KPI`, `STATUS`) cria hierarquia tipográfica forte.
✅ **3 presets distintos demonstram flexibilidade:** Ops warm + CRM dark navy/violet + Wiki sage olive. Mostra que o token system aceita variação real.

## 5. Findings

### F-UI-001 — Sem token de spacing (escala literal)
- **Maturidade:** L1
- **Componentes afetados:** todos (60 JSX + 13 HTML usam padding/margin literal)
- **Recomendação:** criar escala `--space-{1..16}` em `tokens.css`. Decisão Patrick U2 (rem 20/30/48/64/80/120) cobre — aplicar.
- **Esforço:** L (refactor cross-cutting)
- **Prioridade:** P2

### F-UI-002 — Sem token de sombra (5 valores literais)
- **Maturidade:** L1
- **Componentes:** card, kpi, sidebar-toggle, avatar-edit-btn, sidebar-logo-tag
- **Recomendação:** criar `--shadow-xs/sm/md/lg`.
- **Esforço:** S
- **Prioridade:** P2

### F-UI-003 — Sem token de motion (durations literais)
- **Maturidade:** L1
- **Componentes:** todos com `transition:`
- **Recomendação:** criar `--motion-fast/normal/slow/page`.
- **Esforço:** S
- **Prioridade:** P2
- **Cross-ref:** F-MO-008

### F-UI-004 — Tipografia 13px, 11.5px, 12.5px, 10px fora da escala oficial
- **Maturidade:** L2 (escala existe, mas não cobre)
- **Recomendação:** decisão arquitetural — collapse pra escala canônica (12/14/16) OU expand escala. Patrick U2 sugere rem 20/30/48/64/80/120 — alinhar.
- **Esforço:** M (refactor)
- **Prioridade:** P3

### F-UI-005 — Hardcoded `hsl(35 85% 30%)` em `.pill.warn`
- **Risco:** pode quebrar em CRM Dark preset
- **Recomendação:** criar `--warning-text-strong` token
- **Esforço:** XS
- **Prioridade:** P3

### F-UI-006 — Hardcoded `hsl(0 70% 40%)` em `.pill.err` e `.btn-destructive`
- **Mesma origem que F-UI-005**
- **Recomendação:** criar `--destructive-text-strong` token
- **Esforço:** XS
- **Prioridade:** P3

### F-UI-007 — `--ring` = `--primary` (mesmo valor)
- **Risco:** focus ring some quando o trigger é primary background (botão primary com focus = ring teal sobre fundo teal).
- **Recomendação:** `--ring` deve ter contraste vs background E vs primary. Use offset ring (white outline + primary).
- **Componentes afetados:** Button primary com focus-visible
- **Esforço:** S
- **Prioridade:** P2

### F-UI-008 — CRM Dark preset: `--muted-foreground` herdado sem ajuste de contraste
- **Página:** templates CRM logado
- **Evidência:** screenshots Dashboard CRM mostram labels muted abaixo de 4.5:1
- **Recomendação:** revisar `--muted-foreground` em CRM Dark preset.
- **Esforço:** XS
- **Prioridade:** P1
- **Cross-ref:** F-UX-002

### F-UI-009 — Sem dark mode default (apenas em CRM preset)
- **Decisão Patrick U4:** dark opcional — N/A neste audit. ✅
- **Status:** alinhado com decisão. Sem ação.

### F-UI-010 — Token `--text-3xl` declarado mas valor não capturado no grep
- **Recomendação:** verificar se token existe; documentar valor.
- **Esforço:** XS
- **Prioridade:** P4

### F-UI-011 — Showcase home: chips de cor (Petroleum/Terracotta/Cream/Sidebar/Success/Error) não mostram código hex/HSL ao passar mouse
- **Affordance:** designer copiando token gostaria de hover-to-copy
- **Recomendação:** click-to-copy + tooltip mostrando token name + HSL
- **Esforço:** S
- **Prioridade:** P3

### F-UI-012 — Pages técnicas: borders sutis demais (`hsl(var(--border))` = `30 20% 87%`)
- **Visual:** card borders quase invisíveis em alguns viewports
- **Decisão:** intencional? Patrick estética DR-04 (anti-shadcn) prefere border sutil
- **Recomendação:** sem ação se intencional. Se não, escurecer pra `30 20% 82%`.
- **Esforço:** XS
- **Prioridade:** P4

## 6. Maturity rubric — score por dimensão

| Dimensão | Score | L0 | L1 | L2 | L3 | L4 |
|---|---|---|---|---|---|---|
| Cores tokenizadas | 8/10 | | | | ✅ | (parcial L4 c/ comments WCAG) |
| Tipografia tokenizada | 6/10 | | | ✅ (drift) | | |
| Spacing tokenizado | 2/10 | | ✅ | | | |
| Radii tokenizado | 8/10 | | | | ✅ | |
| Sombras tokenizadas | 3/10 | | ✅ | | | |
| Motion tokenizado | 3/10 | | ✅ | | | |
| Theme switching | 9/10 | | | | ✅ | |
| Identidade visual | 10/10 | | | | | ✅ |
| Hue-awareness | 9/10 | | | | | ✅ (sombras + foreground) |
| Aplicação consistente | 7/10 | | | | ✅ (drift médio) | |
| Documentação inline | 8/10 | | | | ✅ (WCAG comments) | |

**Média:** 6.6/10 → **L2.5 → L3 com gap em spacing/shadow/motion**

## 7. Gaps pra subir pra L3 sistêmico

1. **Tokens de spacing** — F-UI-001 (P2)
2. **Tokens de sombra** — F-UI-002 (P2)
3. **Tokens de motion** — F-UI-003 (P2)
4. **Foreground tokens pra status texts** — F-UI-005, F-UI-006 (P3)
5. **Ring offset** — F-UI-007 (P2)
6. **Dark mode contrast tuning** — F-UI-008 (P1)

Estes 6 fixes elevam o sistema de **"DS bonito" pra "DS consumível"** — ou seja, time externo (Hygor/Jonas/freelancer) consegue construir feature nova sem hardcoded escapes.

## 8. O que NÃO mexer (proteção)

✅ **Paleta core (warm cream/teal petroleum/terracotta):** identidade não-toca-em.
✅ **Font pairing (Poppins/Lora/Geist Mono):** anti-Inter manifesto.
✅ **Hue nos neutros:** diferencial DR-04 forte.
✅ **Hue-aware shadows:** filosofia sistêmica.
✅ **Sidebar tokens specialty:** `--sidebar-*` separados são intencionais (sidebar é dark mesmo em preset light).
✅ **Comments WCAG inline em tokens:** mantém awareness.

**Decisão Patrick:** "não modifica DS" — estes 6 itens em §7 ficam pra wave futura, NÃO desta auditoria.

## 9. Cross-refs com outros audits

- F-UI-008 ↔ F-UX-002 (CRM dark contraste)
- F-UI-001/002/003 ↔ F-RP-005 (token consumption em JSX)
- F-UI-007 ↔ F-CA-008 (focus state em Button)
- F-UI-003 ↔ F-MO-008 (motion tokens)
