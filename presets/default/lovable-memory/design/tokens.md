---
name: Design tokens — default preset
description: Tokens semânticos do preset default (warm-editorial flavor — caloroso, editorial, com personalidade)
type: design
---

# Tokens — default preset (warm-editorial flavor)

Source of truth: `src/index.css`. Estrutura literal do chocotracking (Barry Callebaut), brand-agnostic.

## Filosofia

- **Background creme quente** (`30 33% 96%`) — caloroso, não branco frio
- **Foreground marrom escuro** (`16 38% 12%`) — hue alinhado, não preto puro
- **Primary borgonha** (`338 55% 23%`) — drama e personalidade
- **Accent dourado** (`33 47% 53%`) — pontuações de identidade
- **Sidebar usa primary** (mesmo borgonha) — surface dramaticamente diferente do main
- **Radius variável** — `lg/md/sm` baseado em `--radius: 0.5rem`, plus `xl: 12px`, `2xl: 20px` pra hierarquia

## Tokens disponíveis

### Backgrounds
- `bg-background` — creme quente principal
- `bg-card` — branco puro (contraste com bg)
- `bg-popover` — branco
- `bg-muted` — cinza-bege sutil
- `bg-sidebar` — borgonha escuro (primary)

### Foregrounds
- `text-foreground` — marrom escuro principal
- `text-muted-foreground` — marrom médio (texto secundário)
- `text-primary-foreground` — branco (texto sobre primary/sidebar)

### Brand
- `bg-primary text-primary-foreground` — botões CTA, sidebar
- `bg-accent text-accent-foreground` — accent dourado, indicadores

### Status (hue alinhado à temperatura warm)
- `bg-success / text-success` — verde com hue (não neon)
- `bg-warning / text-warning` — âmbar warm
- `bg-info / text-info` — azul mas saturação moderada
- `bg-destructive / text-destructive` — vermelho

### Sidebar specific
- `bg-sidebar` — borgonha escuro (background)
- `text-sidebar-foreground` — branco
- `bg-sidebar-accent` — borgonha levemente mais claro (hover, user panel)
- `bg-sidebar-indicator` — dourado (active state bar)
- `border-sidebar-border` — borgonha mais escuro

## Tipografia

- `font-sans` — Poppins (corpo, default)
- `font-display` — Lora serif (títulos hero, page heros, marcos editoriais)

Use Lora APENAS em h2 de página/hero. Body sempre Poppins.

## Radius scale

- `rounded-sm` — input, campos pequenos
- `rounded-md` — botões pequenos
- `rounded-lg` — botões grandes, dialogs
- `rounded-xl` — rows de tabela, items de lista
- `rounded-2xl` — cards, containers principais

## NÃO criar

- Cor accent custom (use accent dourado existente)
- Variantes saturadas tipo `bg-purple-500`
- Gradientes em backgrounds
- Box shadows pesadas (use border + radius pra hierarquia)