---
name: Page layout patterns — default preset
description: Padrões de layout copiados do chocotracking (Barry Callebaut), brand-agnostic
type: design
---

# Page layout — default preset (warm-editorial flavor)

Padrões obrigatórios. Lovable: siga ESTES exatamente. Estrutura copiada do chocotracking que prova funcionar visualmente.

## Container

- App shell: `max-w-7xl mx-auto p-6` (NÃO usar `container` Tailwind sozinho)
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

- SEMPRE `<h2>`. NUNCA `<h1>` em páginas de app.
- Subtitle: `<p className="text-sm text-muted-foreground">`
- Action buttons usam `size="sm"`

## Cards e Sections — NUNCA usar shadcn `<Card>`

**PROIBIDO:**
```tsx
<Card>
  <CardHeader><CardTitle>...</CardTitle></CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**OBRIGATÓRIO:**
```tsx
<div className="bg-card rounded-2xl border border-border">
  <div className="px-5 py-3 border-b border-border">
    <h3 className="text-sm font-medium">Section Title</h3>
  </div>
  <div className="px-5 py-4">{children}</div>
</div>
```

Notas:
- `rounded-2xl` no card principal
- Section title `h3 text-sm font-medium`
- Padding consistente: `px-5 py-3` em headers, `px-5 py-4` em conteúdo

## Tables — NUNCA usar `<table>` HTML em UI

**OBRIGATÓRIO** (grid CSS, copiado do RomaneiosTable do choco):
```tsx
<div className="bg-card rounded-2xl border border-border overflow-hidden">
  {/* Header row */}
  <div className="grid grid-cols-[1fr_120px_120px_80px] gap-2 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
    <span>Nome</span>
    <span>Status</span>
    <span>Data</span>
    <span className="text-right">Ações</span>
  </div>
  {/* Data rows */}
  <div className="px-3 py-2 space-y-1">
    {rows.map(r => (
      <div
        key={r.id}
        className="grid grid-cols-[1fr_120px_120px_80px] gap-2 items-center px-2 h-12 rounded-xl hover:bg-muted/50 transition-colors text-sm cursor-pointer"
      >
        <span>{r.name}</span>
        <StatusBadge status={r.status} />
        <span className="text-muted-foreground">{r.date}</span>
        <Button size="sm" variant="ghost">Editar</Button>
      </div>
    ))}
  </div>
</div>
```

Pontos-chave:
- Container: `bg-card rounded-2xl border` (mesma estrutura de Card)
- Rows: `rounded-xl` + `hover:bg-muted/50` (NÃO usar `<tr>` ou `<table>`)
- Group headers (quando agrupar por categoria): `text-xs font-semibold uppercase tracking-wide text-muted-foreground` numa row separada com `bg-muted/30 py-1.5`

## Sidebar (estrutura literal do chocotracking)

```tsx
<aside className="h-screen sticky top-0 flex flex-col bg-sidebar transition-all duration-200 w-[272px]">
  {/* Brand block */}
  <div className="flex items-center px-4 h-[72px] gap-3">
    <BrandLogo />  {/* logo SVG ou caixa com inicial */}
  </div>

  {/* Nav (com sections agrupando) */}
  <nav className="flex-1 min-h-0 mt-3 px-3 space-y-3 overflow-y-auto overflow-x-hidden">
    {sections.map(section => (
      <div key={section.label} className="space-y-0.5">
        <span className="block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          {section.label}
        </span>
        {section.items.map(item => (
          <NavLink
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative",
              isActive
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            {/* Active indicator: barra dourada à esquerda */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sidebar-indicator rounded-r-full" />
            )}
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    ))}
  </nav>

  {/* User panel — CARD destacado dentro da sidebar */}
  <div className="mx-3 mb-4 rounded-2xl bg-sidebar-accent p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
        <span className="text-accent font-semibold text-sm">{userInitial}</span>
      </div>
      <div className="overflow-hidden">
        <p className="text-sidebar-foreground text-sm font-medium truncate">{userName}</p>
        <p className="text-sidebar-foreground/60 text-xs truncate">{userHandle}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 ... py-1.5 px-2 rounded-lg text-xs">
        <Settings className="w-3.5 h-3.5" /> Configurações
      </button>
      <button className="flex-1 ... py-1.5 px-2 rounded-lg text-xs">
        <LogOut className="w-3.5 h-3.5" /> Sair
      </button>
    </div>
  </div>

  {/* Toggle collapse — botão circular flutuante na borda */}
  <button className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
    <ChevronLeft className="w-3.5 h-3.5" />
  </button>
</aside>
```

Pontos-chave:
- Width `w-[272px]` (collapsed `w-[72px]`) — dimensão intencional
- Brand block `h-[72px]` (não default Tailwind)
- Nav com **sections** + section labels mono uppercase
- Active state: barra dourada `w-1 h-5 bg-sidebar-indicator rounded-r-full` à ESQUERDA
- User panel: **card destacado** `rounded-2xl bg-sidebar-accent`
- Avatar circular dourado com inicial
- Toggle: botão **circular flutuante** na borda direita

## Status indicators (dot + label, copiado choco)

```tsx
const STATUS_CONFIG = {
  pending: { label: 'Pendente', dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  active: { label: 'Em andamento', dot: 'bg-info', text: 'text-info' },
  done: { label: 'Concluído', dot: 'bg-success', text: 'text-success' },
  error: { label: 'Erro', dot: 'bg-destructive', text: 'text-destructive' },
};

<span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cfg.text, 'bg-current/10')}>
  <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
  {cfg.label}
</span>
```

## Buttons

- Variantes: `default`, `outline`, `ghost`, `destructive`
- Sizes: `sm`, `default`, `icon`
- Page action principal: `<Button size="sm">` (não default size)
- Ícone APENAS em ações primárias (criar, salvar) ou status badges. Não em labels, navs simples, ações secundárias.

## Tipografia

- Page title: `<h2 className="text-xl font-semibold">`
- Hero/landing apenas: pode usar `<h2 className="font-display text-3xl">` (Lora serif)
- Section title (dentro de card): `<h3 className="text-sm font-medium">`
- Body: `text-sm`
- Label: `text-xs text-muted-foreground`
- **NÃO** usar `font-bold` (700). Use `font-semibold` (600) max.

## Anti-patterns — PROIBIDOS NESTE PRESET

- `<Card>`, `<CardHeader>`, `<CardContent>` do shadcn
- `<table>` HTML em UI
- `<h1>` em página de app
- Background ou foreground sem hue (`0 0% X%`)
- `font-bold`
- `bg-purple-*`, `bg-pink-*`, `bg-violet-*`, `bg-cyan-*` ou accent não-semantic
- Gradientes em hero/cards
- Animations > 300ms
- Ícone Lucide em cada label/nav/botão secundário
- Container fluido (`container mx-auto`) sem max-width

## Density

Este preset é MÉDIA densidade:
- Row height: `h-12` (48px)
- Form field height: `h-9` (36px)
- Section padding: `px-5 py-4`
- Container padding: `p-6`

## Reference docs

Doc completa do design system:
https://github.com/patrick-neuhaus/anti-ai-design-system

- `docs/05-coherence-checklist.md` — 10 padrões técnicos verificáveis por trident
- `docs/06-identity-gestures.md` — 7 gestos de identidade (squint test)