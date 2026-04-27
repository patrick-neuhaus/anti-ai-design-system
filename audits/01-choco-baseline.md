# Choco Baseline — UI Patterns

> Capturado de `chocotracking` na branch `main`. Esta é a referência known-good usada como baseline pro design system anti-AI.

## 1. Table Pattern

### 1.1 Base component (table.tsx)

- Path: `chocotracking/src/components/ui/table.tsx`
- TableHead default className: `h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0`
- TableCell default className: `p-4 align-middle [&:has([role=checkbox])]:pr-0`
- Padding: **simétrico** (`px-4` em head, `p-4` em cell)
- Default text-align: **left**

### 1.2 Custom table wrappers

#### `chocotracking/src/components/dashboard/RomaneiosTable.tsx`
- Linhas totais: ~370
- Usa shadcn `<Table>` ou raw `<table>`? **raw HTML `<table>`** (não usa o shadcn Table component)
- Action column header: `<th className="px-3 py-2.5 text-left w-20">Ações</th>`
- Action column cell: `<td className="px-3">` com `<div className="flex gap-1">` dentro
- Action column flex direction: **flex-start (default)** — sem `justify-*`. Coluna `w-20` (80px) força os 2 botões 28×28px (`w-7 h-7`) a ficarem encostados à esquerda
- Tem colgroup? **no**
- Tem table-fixed? **no**

#### `chocotracking/src/components/dashboard/DeliveriesTable.tsx`
- Linhas totais: ~600+
- Usa shadcn `<Table>` ou raw `<table>`? **raw HTML `<table>`**
- Action column: mesma estrutura de RomaneiosTable (Pencil + MoreHorizontal, w-7 h-7, flex gap-1, sem justify)
- Tem colgroup? **no**
- Tem table-fixed? **no**

### 1.3 Onde é usado

- `RomaneiosTable` → importado por `src/pages/Romaneios.tsx`
- `DeliveriesTable` → importado por `src/pages/DeliveriesPage.tsx`

**Padrão arquitetural:** cada tabela é um componente único com responsabilidades inline (columns config, bulk actions, sort, pagination, column visibility). Pages só configuram filtros + estado e passam pra tabela.

---

## 2. Sidebar Pattern

### 2.1 AppSidebar

- Path: `chocotracking/src/components/layout/AppSidebar.tsx`
- Linhas totais: 208
- Tem NavLink shared? **NÃO** — usa `NavLink` direto do `react-router-dom` (importa em linha 1). Existe um `src/components/NavLink.tsx` (compat wrapper com activeClassName/pendingClassName), mas o AppSidebar não usa esse, usa o direto do router.
- User panel: card destacado `bg-sidebar-accent rounded-2xl mx-3 mb-4 p-4`. Mostra avatar circular (initial sobre `bg-accent/20`), nome do usuário (`profile.nome`) e username (`profile.username`). Botões "Configurações" e "Sair" lado a lado em flex.
- Active indicator: barra lateral `absolute left-0 w-1 h-5 bg-accent rounded-r-full` + `bg-sidebar-accent text-primary-foreground` no item ativo. Cor do bar = `--accent`.
- Collapse toggle: botão circular flutuante `absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border` na borda direita do sidebar. Anima width `w-[272px] ↔ w-[72px]` com `transition-all duration-250`.

### 2.2 Estrutura de seções

- Section labels: `Operação`, `Cadastros`, `Administração`
- Separação: `space-y-3` entre seções, label uppercase `text-[10px] tracking-wider text-primary-foreground/40` em cima. **Sem border-b entre seções.**
- Filtragem por role: `Administração` só aparece se `isAdmin`. Cada item passa por `canAccess(item.path, roles)`.

---

## 3. Status Indicator Pattern

### 3.1 StatusBadge

- Path: `chocotracking/src/components/StatusBadge.tsx`
- Tipo: **shared component** (27 linhas, isolado)
- Como recebe status: prop tipada `status: DeliveryStatus` (union literal) + `className?: string` opcional
- Como mapeia status→cor: **config map** `statusConfig: Record<DeliveryStatus, { label, className }>` no topo do arquivo
- Estrutura visual: pill — `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium` com bg+text via tokens `--status-*-bg / --status-*-fg`

### 3.2 Onde é usado

- `RomaneiosTable.tsx` (column "Status")
- `DeliveriesTable.tsx` (column "Status")

Ou seja: 1 componente, 2 consumidores. Mudança de cor/label propaga sozinha.

---

## 4. Page Header Pattern

### 4.1 Estrutura

#### `src/pages/Index.tsx`
```tsx
<div>
  <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
  <p className="text-sm text-muted-foreground">Visão geral da expedição logística</p>
</div>
```

#### `src/pages/Romaneios.tsx`
```tsx
<div>
  <h2 className="text-xl font-semibold text-foreground">Romaneios</h2>
  <p className="text-sm text-muted-foreground">Documentos de transporte agrupados por rota e data</p>
</div>
```

#### `src/pages/DeliveriesPage.tsx`
```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-xl font-semibold text-foreground">Deliveries</h2>
    <p className="text-sm text-muted-foreground">Gerenciamento de deliveries da expedição</p>
  </div>
  <Dialog ...>
    <DialogTrigger asChild>
      <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90">
        <Upload className="w-4 h-4" /> Importar
      </button>
    </DialogTrigger>
  </Dialog>
</div>
```

### 4.2 Padrões observados

- Tipo de heading: **h2** (sempre)
- Font family: **default Poppins** (sem `font-display`/serif)
- Tem ícone inline com título? **NÃO** — título é só texto
- Tem subtítulo/descrição? **SIM** — sempre `<p className="text-sm text-muted-foreground">` logo abaixo
- Posição das ações: top-right via `flex items-center justify-between`
- Container: `space-y-5` no wrapper (gap consistente entre header + filters + table)

---

## 5. Tokens disponíveis (extras além do shadcn)

Todos definidos em `:root` de `src/index.css`. Os "extras" (não-shadcn-padrão):

- `--icon-green`
- `--trend-positive`
- `--status-pending-bg`
- `--status-pending-fg`
- `--status-success-bg`
- `--status-success-fg`
- `--status-error-bg`
- `--status-error-fg`
- `--sidebar-indicator`

Tokens shadcn presentes: standard set (background, foreground, primary, secondary, accent, muted, destructive, border, input, ring, radius, card, popover, sidebar-*).

**Sem dark mode** (`.dark { }` não existe). Light-only.

Font: `Poppins` aplicado em `body` via `font-family`.

---

## 6. Lovable memory

`chocotracking/.lovable/memory/` existe e tem:
- `index.md`
- `design/page-layout.md`
- `design/tokens.md`

(Conteúdo desses arquivos não é objeto deste audit — registrar apenas presença.)

---

## 7. Resumo executivo

- **Tabelas custom usam raw HTML `<table>`, não shadcn `<Table>`** — choco bypassa completamente o `<Table>` component pra ter controle total.
- **2 tabelas, 2 pages → reuso 1:1** (cada tabela tem 1 consumidor único). Componente compartilhado, mas não compartilhado entre múltiplas pages.
- **`StatusBadge` é shared component**, status→cor via config map de objeto literal. 1 source of truth.
- **Sidebar não tem `text-accent` no avatar quebrado** — usa `bg-accent/20 + text-accent` (nota: pode ter contraste ruim mas não foi flagged neste app).
- **Page headers são consistentes**: h2, sem ícone, com subtítulo, ações top-right via flex justify-between.
- **Tokens custom de status (`--status-*-bg/fg`)** dão linguagem visual coerente em badges; tokens `--icon-green` e `--trend-positive` reforçam paleta verde-petróleo.
- **Padding simétrico** em table.tsx defaults (`px-4` head, `p-4` cell) — sem assimetria.
- **Action column natural-left** com `w-20` constraint — não usa `justify-end`/`justify-center`, deixa botões fluírem do início porque a coluna já é apertada.
