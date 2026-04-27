---
name: Page layout patterns — minimalist-tech preset
description: Padrões de layout, composição de componentes, anti-patterns proibidos neste preset
type: design
---

# Page layout — minimalist-tech

Padrões obrigatórios. Lovable: siga ESTES exatamente. Não improvise.

## Container

- App shell: `max-w-7xl mx-auto p-6` (NÃO usar `container` Tailwind)
- Vertical gap entre seções: `space-y-5`
- NÃO aninhar paddings — shell já tem `p-6`

## Page header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-xl font-semibold">Page Title</h2>
    <p className="text-sm text-muted-foreground">Subtitle opcional</p>
  </div>
  <Button size="sm">Action</Button>
</div>
```

- SEMPRE `<h2>`. NUNCA `<h1>` (h1 reservado para landing/marketing)
- Subtitle é `<p className="text-sm text-muted-foreground">`
- Action buttons usam `size="sm"`

## Cards e Sections — NUNCA usar shadcn Card

**PROIBIDO:**
```tsx
<Card>
  <CardHeader><CardTitle>...</CardTitle></CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**OBRIGATÓRIO:**
```tsx
<div className="bg-card border border-border">
  <div className="px-5 py-3 border-b border-border">
    <h3 className="text-sm font-medium">Section Title</h3>
  </div>
  <div className="px-5 py-4">{children}</div>
</div>
```

Notas:
- SEM `rounded-*` (radius é zero por design)
- SEM `shadow-*` (border-only hierarchy)
- Section title é `<h3 className="text-sm font-medium">`, não `<CardTitle>`

## Tables — NUNCA usar `<table>` HTML em UI

**PROIBIDO:** `<table><thead><tr><th>...</th></tr></thead></table>`

**OBRIGATÓRIO** (grid CSS):
```tsx
<div className="border border-border">
  {/* Header row */}
  <div className="grid grid-cols-[1fr_120px_80px] gap-2 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
    <span>Name</span>
    <span>Status</span>
    <span></span>
  </div>
  {/* Data rows */}
  <div className="px-3 py-2 space-y-px">
    {rows.map(r => (
      <div
        key={r.id}
        className="grid grid-cols-[1fr_120px_80px] gap-2 items-center px-2 h-12 hover:bg-muted/50 transition-colors text-sm"
      >
        <span>{r.name}</span>
        <StatusBadge status={r.status} />
        <Button size="sm" variant="ghost">Edit</Button>
      </div>
    ))}
  </div>
</div>
```

Exceção: `<table>` é OK em conteúdo MDX/markdown editorial.

## Sidebar

```tsx
<aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
  {/* Logo/title */}
  <div className="px-4 py-4 border-b border-sidebar-border">
    <h1 className="text-sm font-semibold">App Name</h1>
  </div>

  {/* Nav */}
  <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
    {navItems.map(item => (
      <a
        key={item.href}
        href={item.href}
        className="flex items-center px-3 h-9 text-sm hover:bg-sidebar-accent transition-colors"
        data-active={isActive(item.href)}
      >
        {item.label}
      </a>
    ))}
  </nav>

  {/* User/settings — destacado pelo border-t */}
  <div className="border-t border-sidebar-border p-3">
    <UserMenu />
  </div>
</aside>
```

Note: settings/user panel SEMPRE no fundo, separado por `border-t`. Nunca no topo.

## Form fields

```tsx
<div className="space-y-1.5">
  <label className="text-xs text-muted-foreground" htmlFor="email">
    Email
  </label>
  <input
    id="email"
    type="email"
    className="w-full px-3 h-9 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
  />
</div>
```

- Label: `text-xs text-muted-foreground`
- Spacing dentro do field: `space-y-1.5`
- Spacing entre fields: `space-y-4`
- Buttons em form: `size="sm"`

## Status indicators

```tsx
<span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono">
  <span className="size-1.5 bg-success" />
  Operational
</span>
```

- Use semantic colors (`bg-success`, `bg-warning`, `bg-info`, `bg-destructive`)
- Font mono no label (caráter técnico)
- Size 1.5 (6px) pro indicador é o suficiente — não over-design

## Buttons

- Variantes: `default`, `outline`, `ghost`, `destructive` apenas
- Sizes: `sm`, `default`, `icon`
- Texto SEM ícone por default
- Ícone apenas se carrega informação (status, file type, etc.)
- Pode usar `[brackets]` em CTAs internas pra reforçar caráter técnico (`[copy]`, `[edit]`)

## Anti-patterns — PROIBIDOS NESTE PRESET

NUNCA gere código com:

- `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardTitle>` do shadcn
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` em UI
- `<h1>` em página de app (OK em landing isolada)
- `rounded-*` em qualquer componente (radius é zero)
- `shadow-*` em qualquer componente (border-only)
- `bg-purple-*`, `bg-pink-*`, `bg-violet-*`, `bg-cyan-*` ou qualquer accent não-semantic
- `font-bold` (use `font-semibold`)
- Background ou foreground sem hue (`0 0% X%`)
- Gradients em hero/cards
- Animations > 300ms
- Ícone Lucide em label/nav/botão secundário (apenas em ações primárias raras + status)
- `<input>` sem hue no border (use `border-input`)
- Padding random (use escala: 1, 1.5, 2, 4, 5, 6, 8 — evitar 3, 7)

## Density

Este preset é BAIXA densidade (mais espaçamento, menos info por tela):
- Row height: `h-12` (48px)
- Form field height: `h-9` (36px)
- Section padding: `px-5 py-4`
- Container padding: `p-6`
- Vertical gap entre seções: `space-y-5`

Se o app precisa ALTA densidade (BI, dashboards densos), considere o preset `data-dense` em vez deste.

## Reference docs

Doc completa do design system (Camada 1 universal):
https://github.com/patrick-neuhaus/anti-ai-design-system

- `docs/01-anti-patterns.md` — todos os 10 padrões anti-IA com exemplos
- `docs/02-structural-rules.md` — Camada 1 universal completa
- `docs/03-token-system.md` — sistema de tokens detalhado