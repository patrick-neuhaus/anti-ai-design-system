# Plano: token cirúrgico + token editor enhancement (DR-01 aligned)

> **Para retomada pós-compact.** Stand-alone — não depende de contexto da sessão atual.
> Spec source: `Downloads/Skill de Design/deep research/DR-01-color-tokens.md`
> Token map: `docs/token-map.json` (mesmo repo)

---

## Estado atual (commits feitos)

**anti-ai-design-system main:**
- `35873c3` — :active scale anim user-panel
- `5cb3f53` — user panel actions ghost (no bg/border)
- `e99c1f6` — user panel 2-row pattern (dwg-insight)
- `6c3b0ad` — sidebar-indicator → var(--primary) + nav-badge role split

**ia-da-plus main:**
- `85eb112` — :active scale (sync)
- `e5d121a` — actions ghost (sync)
- `79df1f6` — 2-row pattern + drop dropdown menu
- `e0100c3` — sidebar-indicator → var(--accent) (brand = accent terracotta) + nav-badge split

**Docs criados:**
- `anti-ai-design-system/docs/token-map.json` — mapeamento canônico tokens → consumers → roles → derivação

---

## Contexto chave

- **Patrick**: tech lead, prefere PT-BR direto, caveman mode active.
- **DR-01** = spec definitivo do algoritmo de derivação. NÃO inventar outras regras.
- **Consumer único do enhancement**: token editor já existente em `ui_kits/default/index.html`.
- **ia-da-plus brand = accent (terracotta)**, NÃO primary. Patrick brand mark `ia.plus` usa `text-sidebar-indicator` que agora é var(--accent).
- **CRM template brand = primary** (purple/blue per preset).

---

## STEP 1 — CIRÚRGICO: `sidebar-accent-foreground` (P0)

**Problema:** user-panel bg = sidebar-accent. Texto herda sidebar-foreground (branco). Se token editor muda sidebar-accent pra cor clara → contraste quebra. DR sec 82-90 manda foreground medido no PAR REAL.

**Estimativa:** 30min.

### Files

**A. `anti-ai-design-system/ui_kits/default/index.html`**

#### A.1 — Adicionar `--sidebar-accent-foreground` em cada preset

Localização: `COLOR_PRESETS` object (linha ~539-600).

Adicionar (em cada preset que tenha sidebar-accent definido):

```js
"CRM Dark": {
  ...
  "--sidebar-accent": "222 20% 15%",
  "--sidebar-accent-foreground": "0 0% 100%",  // ← ADD: branco contra dark
  ...
},
"CRM Light": {
  ...
  "--sidebar-accent": "222 22% 22%",
  "--sidebar-accent-foreground": "0 0% 100%",  // ← ADD: branco contra dark (sidebar é dark mesmo no preset Light)
  ...
},
"Wiki Sage": {
  ...
  "--sidebar-accent": "145 40% 38%",
  "--sidebar-accent-foreground": "0 0% 100%",  // ← ADD
  ...
},
"Ops Logística": {
  ...
  "--sidebar-accent": "184 80% 25%",
  "--sidebar-accent-foreground": "0 0% 100%",  // ← ADD
  ...
}
// (linha 600 — verificar se tem outro preset)
```

#### A.2 — Migrar consumers do user-panel

Em `<style>` block (linhas ~155-180):

```css
.user-panel { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
.user-name { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
.user-panel-clickable:hover .user-name { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
.avatar { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
.user-action-btn { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))/.7); }
.user-action-btn:hover { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
.user-action-btn-wide { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))/.7); }
.user-action-btn-wide:hover { color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))); }
```

Note `var(--token, var(--fallback))` — fallback pra sidebar-foreground se preset não declarou (defensive).

**B. `ia-da-plus/src/styles/anti-ai/tokens.css`**

Já tem `--sidebar-accent-foreground: 0 0% 100%` (linha ~128). Confirmar que existe e **não** mexer.

**C. `ia-da-plus/src/styles/anti-ai/primitives.css`**

Mesma migração de A.2 (sintaxe CSS pura — sem JSX).

### Verificação

1. Abrir CRM template em browser, dark mode → user-panel texto OK (branco em dark)
2. Trocar para preset Wiki Sage → user-panel texto OK (branco em verde)
3. Token editor manual → forçar sidebar-accent pra cor clara → texto **fica errado** (esperado — fix completo só com enhancement step 2). Documentar em commit que cirúrgico resolve preset switching, não manual edit.
4. ia-da-plus: `bun dev` → verificar user-panel rendering.

### Commit msg pattern

```
fix(tokens): declarar sidebar-accent-foreground por preset (P0)

DR-01 sec 82-90: foreground calculado vs par real, não abstrato.
user-panel hoje herda sidebar-foreground (branco) — se token editor
muda sidebar-accent pra claro, contraste quebra.

- COLOR_PRESETS: adiciona --sidebar-accent-foreground em CRM Dark/Light/Wiki/Ops
- user-panel + .user-name + .avatar + .user-action-btn[-wide]: usa novo token
- Fallback var(--sidebar-foreground) pra defensive
- ia-da-plus: tokens.css já tem token, sync primitives.css consumers

Resolve preset switching. Token editor manual edit ainda pode
quebrar — fix completo no step 2 (deriveColorTokens enhancement).

Refs docs/token-map.json (gap P0).
```

---

## STEP 2 — ENHANCEMENT: `deriveColorTokens(seed, mode)` (P0)

**Estimativa:** 3-4h.

**Spec:** DR-01 sec 38-107 (algoritmo) + sec 129-145 (8 edge cases) + sec 117-127 (5 grupos).

**Stack:**
- `culori` via CDN — OKLCH conversion + gamut mapping (~12KB)
  ```html
  <script src="https://cdn.jsdelivr.net/npm/culori@4/bundled/culori.min.js"></script>
  ```
- WCAG luminance + contrast ratio — hand-roll (4 lines)

### Files

**A. `anti-ai-design-system/ui_kits/default/index.html`**

#### A.1 — Adicionar culori CDN no `<head>`

#### A.2 — Adicionar JS module antes do `</body>` ou dentro do React component

```js
// ─────────────────────────────────────────────────────────────
// Color derivation — DR-01 aligned
// ─────────────────────────────────────────────────────────────
const Color = {
  // WCAG luminance
  luminance(rgb) {
    const [r, g, b] = rgb.map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  contrast(fg, bg) {
    const lf = this.luminance(fg);
    const lb = this.luminance(bg);
    const [light, dark] = lf > lb ? [lf, lb] : [lb, lf];
    return (light + 0.05) / (dark + 0.05);
  },
  // hsl string "H S% L%" → rgb [r, g, b]
  hslToRgb(hslStr) {
    const m = hslStr.match(/^\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*$/);
    if (!m) throw new Error(`invalid HSL: ${hslStr}`);
    const h = +m[1], s = +m[2] / 100, l = +m[3] / 100;
    // standard HSL→RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m_ = l - c / 2;
    let [r, g, b] = [0, 0, 0];
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [(r + m_) * 255, (g + m_) * 255, (b + m_) * 255];
  },
  rgbToHsl(rgb) {
    const [r, g, b] = rgb.map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  },
  hexToOKLCH(hex) {
    return culori.converter('oklch')(hex);
  },
  oklchToHsl(oklchObj) {
    const rgb = culori.converter('rgb')(oklchObj);
    return this.rgbToHsl([rgb.r * 255, rgb.g * 255, rgb.b * 255]);
  }
};

// Classifica seed em profile per DR sec 44-45
function classifySeed(oklch) {
  const { l, c, h } = oklch;
  if (l > 0.92) return 'nearWhite';
  if (l < 0.18) return 'nearBlack';
  if (c < 0.04) return 'neutral';
  // yellowLike: hue ~70-100, lightness alta
  if (h >= 70 && h <= 100 && l > 0.7) return 'yellowLike';
  // redLike: hue ~10-30, chroma alto
  if (h >= 10 && h <= 30 && c > 0.18) return 'redLike';
  // greenLike
  if (h >= 120 && h <= 160) return 'greenLike';
  // saturatedBlue
  if (h >= 240 && h <= 270 && c > 0.15) return 'saturatedBlue';
  if (c > 0.2) return 'highChroma';
  return 'normal';
}

// Lightness clamps por mode + profile (DR sec 49, 57, 119, 131-145)
function clampAccentLightness(L, mode, profile) {
  if (mode === 'light') {
    if (profile === 'nearWhite') return 0.6;   // DR sec 143
    if (profile === 'nearBlack') return 0.35;  // DR sec 145
    if (profile === 'yellowLike') return 0.55; // DR sec 133 — escurecer
    return Math.min(Math.max(L, 0.45), 0.7);
  }
  // dark mode
  if (profile === 'nearBlack') return 0.5;
  if (profile === 'nearWhite') return 0.7;
  return Math.min(Math.max(L, 0.55), 0.75);
}

function clampPrimaryLightness(L, mode, profile) {
  // DR sec 57 — normalize for action fill (mais conservador que accent)
  if (mode === 'light') {
    if (profile === 'yellowLike') return 0.42;  // sec 133
    if (profile === 'redLike') return 0.45;     // sec 135 — contain chroma
    if (profile === 'saturatedBlue') return 0.45; // sec 137
    return Math.min(Math.max(L, 0.4), 0.55);
  }
  return Math.min(Math.max(L, 0.55), 0.7);
}

function clampChroma(C, profile) {
  if (profile === 'redLike') return Math.min(C, 0.16);    // sec 135 — visual vibration
  if (profile === 'saturatedBlue') return Math.min(C, 0.18);
  if (profile === 'yellowLike') return Math.min(C, 0.14);
  return Math.min(C, 0.22);
}

// chooseForegroundForBackground (DR sec 82, 110-111)
function chooseForeground(bgHsl, minRatio = 4.5) {
  const bgRgb = Color.hslToRgb(bgHsl);
  const candidates = [
    { hsl: '0 0% 100%', rgb: [255, 255, 255] },
    { hsl: '0 0% 5%', rgb: [13, 13, 13] }
  ];
  for (const c of candidates) {
    if (Color.contrast(c.rgb, bgRgb) >= minRatio) return c.hsl;
  }
  // fallback: ajustar bg (DR sec 86-90 — adjustToneAwayFromForeground)
  // não implementar agora; returnar branco
  return '0 0% 100%';
}

// MAIN — DR sec 38-107
function deriveColorTokens(seedHex, mode = 'light') {
  const seedOK = Color.hexToOKLCH(seedHex);
  const profile = classifySeed(seedOK);

  // 1. Accent — manter identidade da seed
  const accent = { ...seedOK };
  accent.l = clampAccentLightness(accent.l, mode, profile);
  accent.c = clampChroma(accent.c, profile);

  // 2. Primary — mesma família, normalizado pra ação
  const primary = { ...accent };
  primary.l = clampPrimaryLightness(primary.l, mode, profile);
  primary.c = clampChroma(primary.c, profile);

  // 3. Decorative — analog rotation +20-40° (DR sec 64)
  const decorative = { ...accent };
  decorative.h = (accent.h + 30) % 360;
  decorative.l = mode === 'light' ? 0.6 : 0.7;

  // 4. Convert to HSL strings (CRM uses HSL var format)
  const accentHsl = Color.oklchToHsl(accent);
  const primaryHsl = Color.oklchToHsl(primary);
  const decorativeHsl = Color.oklchToHsl(decorative);

  // 5. Foregrounds
  const accentForeground = chooseForeground(accentHsl, 4.5);
  const primaryForeground = chooseForeground(primaryHsl, 4.5);

  // 6. Sidebar accent foreground (cirúrgico do step 1)
  // Assumindo sidebar-accent é declarado por preset, calculamos foreground pra ele aqui:
  // (esse override só roda se user mudou sidebar-accent via editor)
  // sidebarAccentForeground calculado on-demand pelo consumer

  return {
    '--accent': accentHsl,
    '--accent-foreground': accentForeground,
    '--primary': primaryHsl,
    '--primary-foreground': primaryForeground,
    '--decorative-accent-secondary': decorativeHsl,
    '--ring': primaryHsl  // DR sec 121 — ring overlap primary acceptable
    // sidebar-indicator já bound via var(--primary) no CSS
  };
}

// Wire to existing token editor
// 1. user picks color → trigger handleSeedChange(hex)
// 2. handleSeedChange → const tokens = deriveColorTokens(hex, currentMode)
// 3. Object.entries(tokens).forEach(([k, v]) => document.documentElement.style.setProperty(k, v))
```

#### A.3 — UI: contrast ratio panel (bonus)

Mostrar tabela WCAG no painel do editor:
```
PRIMARY × PRIMARY-FG: 4.7:1 ✓
ACCENT × ACCENT-FG:   5.2:1 ✓
RING × CARD:          3.4:1 ✓
```

Por par em `wcag_pairs_to_validate` do `token-map.json`.

### Edge case testing

8 seeds pra validar (DR sec 129-145):
1. `#2c2b88` (roxo escuro) — sec 131
2. `#fff59d` (amarelo claro) — sec 133
3. `#d32f2f` (vermelho saturado) — sec 135
4. `#1976d2` (azul saturado) — sec 137
5. `#388e3c` (verde) — sec 139
6. `#9e9e9e` (cinza neutro) — sec 141
7. `#fafafa` (quase branco) — sec 143
8. `#212121` (quase preto) — sec 145

Cada deve produzir tokens que passam WCAG checklist DR sec 149-158.

### Commit msg

```
feat(tokens): deriveColorTokens(seed, mode) — DR-01 algorithm

Implementa derivação WCAG-aware quando user muda seed no token editor.
Antes: editor setProperty direto, foregrounds não recalculados.
Depois: seed → deriveColorTokens → 6 tokens recomputed + WCAG check.

Spec: DR-01 sec 38-107 + 8 edge cases (sec 129-145)
Lib: culori 4 (CDN, OKLCH conversion)

- classifySeed: 8 profiles (nearWhite, nearBlack, neutral, yellowLike, redLike, greenLike, saturatedBlue, highChroma, normal)
- clampLightness/Chroma per profile (DR sec 49-57, 131-145)
- chooseForeground: par real WCAG 4.5:1 (DR sec 82-90)
- decorative: analog +30° hue rotation (DR sec 64)
- ring = primary (DR sec 121, overlap aceitável)

Wired to existing token editor handleSeedChange.
Bonus: contrast ratio panel (11 pares WCAG validados em tempo real).

Refs docs/token-map.json (derivation_topology), docs/PLAN-token-enhancement.md.
```

---

## STEP 3 — SPLIT: `sidebar-indicator` decorative vs selection (P2)

**Estimativa:** 1h. Não bloqueia steps 1-2.

**Quando atacar:** depois do step 2 (token editor enhancement). Razão: validação visual via sliders fica trivial após enhancement.

### Files

**A. `anti-ai-design-system/ui_kits/default/index.html`**

#### A.1 — Adicionar token novo em COLOR_PRESETS

```js
"CRM Dark": {
  ...
  "--sidebar-indicator": "var(--primary)",  // selection (já bound)
  "--sidebar-decorative": "var(--accent)",  // ← NEW: decorative
  ...
}
```

Aplicar em todos presets.

#### A.2 — Migrar consumers decorative

```css
/* ANTES — todos usam --sidebar-indicator */
.login-brand-orbs::before { background: hsl(var(--sidebar-indicator)); }
.sidebar-brand-text { background: hsl(var(--sidebar-indicator)/.18); border: 1px solid hsl(var(--sidebar-indicator)/.3); }
.sidebar-logo-tag { color: hsl(var(--sidebar-indicator)); border: 1px solid hsl(var(--sidebar-indicator)/.5); }

/* DEPOIS — decorative consumers migram */
.login-brand-orbs::before { background: hsl(var(--sidebar-decorative)); }
.sidebar-brand-text { background: hsl(var(--sidebar-decorative)/.18); border: 1px solid hsl(var(--sidebar-decorative)/.3); }
.sidebar-logo-tag { color: hsl(var(--sidebar-decorative)); border: 1px solid hsl(var(--sidebar-decorative)/.5); }

/* Selection consumers FICAM com --sidebar-indicator */
.nav-item.active::before { background: hsl(var(--sidebar-indicator)); }  /* unchanged */
.user-panel.account-active::before { background: hsl(var(--sidebar-indicator)); }  /* unchanged */
.nav-item.active .nav-badge { color: hsl(var(--sidebar-indicator)); }  /* unchanged */
```

**B. `ia-da-plus`** — espelhar mesma lógica (decorative likely fica accent, selection fica accent também porque brand=accent, **então split pode não fazer sentido em ia-da-plus** — re-validar antes de aplicar).

### Update token-map.json

Trocar `sidebar-indicator.drift: true` para `false`. Adicionar `sidebar-decorative` como token novo.

### Commit msg

```
refactor(tokens): split sidebar-indicator → selection vs decorative

DR-01 sec 127: misturar selection + decorative no mesmo token
= inconsistência clássica.

Antes: --sidebar-indicator usado em 6 lugares (3 selection + 3 decorative).
Depois:
  --sidebar-indicator (= primary) → selection (active pill, badge active)
  --sidebar-decorative (= accent) → decorative (orbs, logo-tag, brand-text)

Refs docs/token-map.json (drift_summary cleared P2).
```

---

## Iron rules durante execução

1. **NÃO inventar regras de derivação** fora do DR-01. Cada decisão cita seção DR.
2. **NÃO modificar presets manualmente** — token editor é o consumer único.
3. **NÃO tocar `success/warning/destructive/info`** — DR sec 125 manual.
4. **Caveman mode** ativo. Respostas terse.
5. **PT-BR** sempre.
6. **Push após cada step** — Patrick autorizou main pushes.
7. **Commit format** — tipo(scope): mensagem 1ª linha + body explicando + refs DR.
8. **Verify locally** antes de push (CRM template HTML server, ia-da-plus bun dev).
9. **Iron Law-1** se mexer em SKILL.md/CLAUDE.md/iron-laws — não aplica aqui (só CSS/JSON/JS de produto).

---

## Boundaries / não-escopo

- Patrick **adiou** auditar Wiki Sage / Ops Logística / outros presets. Aplicar mesma lógica depois (não bloqueante).
- Token editor refactor estrutural (UI re-design) **fora de escopo** — só adicionar derivação WCAG por baixo.
- Mobile / responsive **fora** — desktop-first.
- Dark/light mode toggle UI **fora** — mode é input do `deriveColorTokens` mas UI já existe.
- Animation polish **fora** — focus é correctness de cor.

---

## Verificações por step

### Step 1
- [ ] Cada preset tem `--sidebar-accent-foreground` declarado
- [ ] user-panel + .user-name + .avatar + .user-action-btn[-wide] usam novo token
- [ ] Fallback `var(--token, var(--sidebar-foreground))` aplicado
- [ ] CRM template browser teste: dark, light, wiki sage → user-panel legível
- [ ] ia-da-plus: bun dev → user-panel legível
- [ ] Commit + push CRM
- [ ] Commit + push ia-da-plus
- [ ] token-map.json: status `gaps[].fixed: true`

### Step 2
- [ ] culori CDN no `<head>` do CRM template
- [ ] `Color.luminance` + `Color.contrast` implementados (WCAG)
- [ ] `Color.hslToRgb` + `Color.rgbToHsl` (HSL parser)
- [ ] `culori.hexToOKLCH` working
- [ ] `classifySeed` retorna 1 dos 9 profiles esperados
- [ ] `clampLightness/Chroma` por profile (DR refs)
- [ ] `chooseForeground` retorna candidato que passa 4.5:1
- [ ] `deriveColorTokens` retorna 6 tokens HSL strings válidas
- [ ] Token editor wired: input color → deriveColorTokens → setProperty
- [ ] Bonus: contrast ratio panel mostra 11 pares
- [ ] 8 edge case seeds testadas, todas passam DR sec 149-158 checklist
- [ ] Commit + push
- [ ] Update token-map.json (next_actions[1].status: done)

### Step 3
- [ ] `--sidebar-decorative` declarado em todos presets
- [ ] 3 consumers decorative migrados (orbs, brand-text, logo-tag)
- [ ] 3 consumers selection ficam com `--sidebar-indicator`
- [ ] Visual teste: orbs/logo cores diferentes da pill ativa (split visível)
- [ ] ia-da-plus avaliado (decorative=accent, selection=accent? skip se redundante)
- [ ] Commit + push
- [ ] token-map.json: drift cleared, sidebar-decorative adicionado

---

## Skills relevantes (caso precise)

- `ui-design-system --apply` — pode ajudar quando rodar deriveColorTokens (Phase 6 emit Tailwind/CSS)
- `react-patterns --audit` — não aplicável (HTML estático)
- `architecture-guard` — não aplicável (sem business logic)
- `trident --mode dir --target ui_kits/default` — review final antes de push final do step 2

---

## Recover / debugging tips

- Se culori não carregar: fallback hand-roll OKLCH → sRGB (15 linhas extras). Implementação ref: github.com/Evercoder/culori/blob/main/src/oklch
- Se contraste falhar pra seed extreme após derivation: adjustToneAwayFromForeground (DR sec 86-90) — sub-loop até passar. Limite max iterations 5.
- Se setProperty não propaga: verificar que tokens são strings HSL `H S% L%` (sem hsl()), porque CSS usa `hsl(var(--token))`.
- Se ia-da-plus build break: rollback tokens.css, mexe só primitives.css consumers.
