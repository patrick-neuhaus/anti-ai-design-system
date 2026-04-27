# Sistema de Tokens (sem cor)

Camada 1 define a ESTRUTURA dos tokens. Camada 2 (preset) define os VALORES de cor.

Esta doc é o scaffold: o que precisa existir, com que escala, organizado como.

---

## Typography

### Font families (declarar 2-3, no máximo)
- `--font-display`: para H2 de página, hero (ex: serif distinta, ou sans display como CalSans)
- `--font-body`: para texto corrido (ex: Inter, Poppins, Geist)
- `--font-mono`: para código, tabular numbers, status indicators

### Escala
```
text-xs    12px  — labels, captions, meta
text-sm    14px  — body, table cells, form fields
text-base  16px  — body em densidade normal
text-lg    18px  — section headings (h3)
text-xl    20px  — page title (h2) — DEFAULT do anti-AI
text-2xl   24px  — hero/feature title
text-3xl   30px  — landing apenas
```

### Weights
- `font-normal`  (400) — body
- `font-medium`  (500) — labels, links importantes
- `font-semibold` (600) — page titles, CTAs
- **NÃO usar** `font-bold` (700) — over-statement comum em IA

### Line-height
- `leading-tight` (1.25) — headers
- `leading-normal` (1.5) — body
- `leading-relaxed` (1.625) — long-form prose

### Tracking (letter-spacing)
- `tracking-tight` (-0.025em) — display fonts, headers grandes
- `tracking-normal` — body default
- Evitar `tracking-wide` (+0.025em) — vira "fancy" cara de IA

---

## Spacing

### Base
4px (Tailwind default). NÃO mexer.

### Escala curta (use APENAS estes valores)
```
1   = 4px
1.5 = 6px
2   = 8px
4   = 16px
5   = 20px  ← container vertical
6   = 24px  ← shell padding
8   = 32px  ← section gaps grandes
```

**NÃO usar** 3, 7, 9, 10+ na escala. Improvisação visual.

### Aplicação
- `space-y-1.5` — within form field (label → input)
- `space-y-4`   — between form fields
- `space-y-5`   — container vertical (padrão)
- `gap-2`       — inline elements
- `p-6`         — shell padding (no AppLayout)
- `px-5 py-3`   — section header
- `px-5 py-4`   — section content

---

## Radius

### Decisão obrigatória: ESCALA OU ZERO

**Opção A: escala variável** (warm-editorial, data-dense)
```
--radius-sm:   0.375rem  /* 6px  — input, badge */
--radius-md:   0.5rem    /* 8px  — input grande, select */
--radius-lg:   0.75rem   /* 12px — botão */
--radius-xl:   1rem      /* 16px — row */
--radius-2xl:  1.25rem   /* 20px — card */
```

**Opção B: zero radius** (minimalist-tech)
```css
--radius: 0;
* { border-radius: 0 !important; }
```

**Não permitido:** `--radius: 0.5rem` único pra tudo. Decisão deliberada obrigatória.

---

## Shadows

### Escala
```
shadow-sm:  cards estáticos
shadow-md:  hover/lift de cards interativos
shadow-lg:  modals, popovers, dropdowns
```

**NÃO usar:**
- `shadow-xl`, `shadow-2xl` — over-elevation, cara de IA
- `shadow` (default) — vago, prefira o tier explícito

### Alternativa: borders no lugar de shadows
Preset `minimalist-tech` usa `border border-border` em vez de shadows. Decisão por preset.

---

## Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1400px (container max)
```

### Container widths
- App shell: `max-w-7xl` (80rem) ou full-width
- Conteúdo editorial: `max-w-3xl` (48rem)
- Form pages: `max-w-xl` (36rem)
- Landing hero: `max-w-5xl` (64rem)

**NÃO usar** `container mx-auto` — largura fluida = sem identidade.

---

## Animations

### Durations
- `duration-150` — hover (color, opacity)
- `duration-200` — state change (toggle, focus)
- `duration-300` — layout shift, accordion

### Easing
- `transition-colors` — apenas color transitions (mais barato)
- `transition-all` — usar com parcimônia (perf cost)
- Default ease (Tailwind: `cubic-bezier(0.4, 0, 0.2, 1)`)

**NÃO usar:**
- `duration-500+` — fica lento, cara de IA "dramática"
- `ease-bounce`, `ease-spring` — efeito decorativo desnecessário

---

## Tokens semânticos obrigatórios (estrutura, valor por preset)

```css
:root {
  /* Cores base — Camada 2 define HSL */
  --background: ...;
  --foreground: ...;        /* DEVE ter hue (S > 0) */
  --card: ...;
  --card-foreground: ...;
  --popover: ...;
  --popover-foreground: ...;
  --muted: ...;
  --muted-foreground: ...;
  --border: ...;
  --input: ...;
  --ring: ...;

  /* Cores de marca — Camada 2 */
  --primary: ...;
  --primary-foreground: ...;
  --secondary: ...;
  --secondary-foreground: ...;
  --accent: ...;
  --accent-foreground: ...;

  /* Status — Camada 2 alinhado à temperatura da marca */
  --destructive: ...;
  --destructive-foreground: ...;
  --success: ...;            /* não verde-neon puro */
  --warning: ...;
  --info: ...;

  /* Sidebar — Camada 2 */
  --sidebar-background: ...;
  --sidebar-foreground: ...;
  --sidebar-border: ...;
  --sidebar-accent: ...;

  /* Radius — Camada 2 escolhe escala ou zero */
  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
  --radius-xl: ...;
  --radius-2xl: ...;
}
```

---

## Resumo do que decide cada camada

| Aspecto | Camada 1 | Camada 2 |
|---------|----------|----------|
| Existir os tokens | ✅ obrigatório | — |
| Estrutura da escala (curta, deliberada) | ✅ obrigatório | — |
| Foreground com hue | ✅ regra | escolhe qual hue |
| Family das fontes | escolhe categoria | escolhe nome específico |
| Radius scale OU zero | ✅ uma das duas | escolhe valores |
| Shadow vs border pra hierarquia | ✅ uma das duas | escolhe abordagem |
| Status colors com temperatura | ✅ regra | escolhe os HSL |
| Spacing escala curta | ✅ regra | — |
| Animations 150-300ms | ✅ regra | — |