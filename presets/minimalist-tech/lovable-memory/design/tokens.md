---
name: Design tokens — minimalist-tech preset
description: Tokens semânticos do preset minimalist-tech (Camada 2 do anti-ai-design-system)
type: design
---

# Tokens — minimalist-tech

Source of truth: `src/index.css`. Este doc explica O QUE existe e POR QUÊ.

## Filosofia

- **Off-white background** com hue azul sutil. Nunca branco puro (`0 0% 100%`).
- **Foreground com hue** (`222 20% 11%`). Nunca preto puro.
- **Zero accent custom** — usar semantic colors only (success/warning/info/destructive).
- **Zero radius** em tudo (decisão brutalista).
- **Zero shadow** — border-based hierarchy.

## Tokens disponíveis

### Backgrounds
- `bg-background` — off-white principal (`222 15% 99%`)
- `bg-card` — branco puro pra contraste com bg
- `bg-popover` — branco puro
- `bg-muted` — cinza muito sutil (`222 12% 93%`)
- `bg-sidebar` — levemente mais clara que bg (`222 15% 97%`)

### Foregrounds
- `text-foreground` — primary text (`222 20% 11%`)
- `text-muted-foreground` — secondary text (`222 12% 38%`)
- `text-primary-foreground` — texto sobre primary

### Status (use SEMPRE estes pra states)
- `bg-success` / `text-success` — operational, ok, completed
- `bg-warning` / `text-warning` — degraded, attention
- `bg-info` / `text-info` — informational, in-progress
- `bg-destructive` / `text-destructive` — error, deleted, critical

### Borders
- `border-border` — default border (use sempre)
- `border-input` — inputs (mesmo valor, diferenciação semântica)

## NÃO criar

- Cor accent custom (use semantic)
- Variantes saturadas tipo `bg-purple-500`, `bg-pink-400`
- Gradients em backgrounds
- Glow effects ou shadows coloridas

## Quando customizar

Se você PRECISA de uma cor além das semantic (ex: brand color do cliente), adicione em `src/index.css`:

```css
:root {
  --brand: 220 90% 56%;        /* descreva contexto no comentário */
  --brand-foreground: 0 0% 100%;
}
```

E declare em `tailwind.config.ts`:

```ts
colors: {
  // ...
  brand: {
    DEFAULT: "hsl(var(--brand))",
    foreground: "hsl(var(--brand-foreground))",
  }
}
```

NUNCA hardcode hex no componente (`bg-[#3b82f6]`). Sempre via token.