# Dwg Current — UI Patterns

> Capturado de `dwg-insight-ext` na branch `main` (estado pós-fixes da sessão atual: preset warm-editorial aplicado, sidebar refatorada, tabelas parcialmente corrigidas).

## 1. Table Pattern

### 1.1 Base component (table.tsx)

- Path: `dwg-insight-ext/src/components/ui/table.tsx`
- TableHead default className: `h-12 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 px-0 pr-4 text-center`
- TableCell default className: `p-4 align-middle [&:has([role=checkbox])]:pr-0 text-center px-0 py-[8px]`
- Padding: **assimétrico** (`px-0 pr-4` no head = 0 esq + 16px dir; `p-4 px-0 py-[8px]` no cell = 0 horizontal + 8px vertical, sobrescrevendo o `p-4`)
- Default text-align: **center**

### 1.2 Custom table wrappers

**Não existem.** Cada page reimplementa a tabela inline usando o `<Table>` shadcn diretamente.

#### `src/pages/ProjectsPage.tsx`
- Linhas totais: ~880
- Usa shadcn `<Table>` ou raw `<table>`? **shadcn `<Table>`**
- Tem colgroup? **YES** (única page que tem)
- Tem table-fixed? **YES** — `<Table className="table-fixed w-full">`
- Headers: `<TableHead>Nome</TableHead>` `<TableHead>Status</TableHead>` etc — sem overrides (default text-center)
- Action column header: `<TableHead>Ações</TableHead>` (default text-center)
- Action column cell: `<TableCell>` com `<div className="flex items-center justify-center gap-1">`
- Action column flex: **justify-center**

#### `src/pages/AdminPage.tsx`
- Linhas totais: ~200
- Usa shadcn `<Table>` ou raw `<table>`? **shadcn `<Table>`**
- Tem colgroup? **NO**
- Tem table-fixed? **NO**
- Headers: `<TableHead>Email</TableHead>` (default), `<TableHead className="text-center">Criado em</TableHead>`, **`<TableHead className="text-right">Ações</TableHead>` ← BUG, ficou pra trás**
- Action cell: `<TableCell className="text-right">` com `<Button>` direto (sem flex container) **← BUG, não foi atualizado**
- Action column flex: **text-right** (não justify-*)

#### `src/pages/HistoryPage.tsx`
- Linhas totais: ~320
- Usa shadcn `<Table>` ou raw `<table>`? **shadcn `<Table>`**
- Tem colgroup? **NO**
- Tem table-fixed? **NO**
- Headers: alguns com `text-center` explícito, `<TableHead>Ações</TableHead>` (corrigido nesta sessão pra default)
- Action column flex: **justify-center** (corrigido nesta sessão de justify-end)

#### `src/pages/ReviewPage.tsx`
- Linhas totais: ~1700+ (gigante)
- Usa shadcn `<Table>` ou raw `<table>`? **shadcn `<Table>`** (múltiplas tabelas — pelo menos 4 instâncias diferentes)
- Tem colgroup? **NO** (em nenhuma)
- Tem table-fixed? **NO**
- Headers: usam `w-16`/`w-24`/`w-32` direto no TableHead pra controlar largura. Action columns variam: algumas `<TableHead className="w-10">` vazias no fim
- Padrão de alinhamento: misturado — `text-center` em colunas de número, default em texto
- Action column flex: variável — `<div className="flex justify-end">` em algumas, sem flex em outras

#### `src/pages/PromptsPage.tsx`
- Linhas totais: ~310
- Usa shadcn `<Table>` ou raw `<table>`? **shadcn `<Table>`**
- Tem colgroup? **NO**
- Tem table-fixed? **NO**
- Headers: `<TableHead>Ações</TableHead>` (corrigido nesta sessão)
- Action column flex: **justify-center** (corrigido nesta sessão de justify-end)

### 1.3 Onde é usado

5 pages, 5 implementações inline. **Nenhum reuso.** Bug corrigido em uma não propaga pra outra.

---

## 2. Sidebar Pattern

### 2.1 AppSidebar

- Path: `dwg-insight-ext/src/components/AppSidebar.tsx` (note: **não está em `layout/`** como em choco)
- Linhas totais: ~210
- Tem NavLink shared? **NÃO** — usa `NavLink` direto do `react-router-dom` (mesma escolha que choco)
- User panel: card destacado `bg-sidebar-accent rounded-2xl mx-3 mb-4 p-4`. Mostra avatar circular (initial sobre `bg-sidebar-foreground/20` — corrigido nesta sessão pra contraste), nome do usuário com lógica custom `email.split("@")[0].split(".")[0]` capitalizado (ex: "patrick.studioartemis@..." → "Patrick"). Email removido nesta sessão. Botões "Configurações" e "Sair" lado a lado.
- Active indicator: barra lateral `absolute left-0 w-1 h-5 bg-sidebar-indicator rounded-r-full` + `bg-sidebar-accent text-sidebar-foreground` no item ativo. Cor do bar = `--sidebar-indicator` (mudada nesta sessão de terracotta `12 65% 55%` pra near-white `0 0% 95%`).
- Collapse toggle: botão circular flutuante `absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border` (idêntico ao choco).

### 2.2 Estrutura de seções

- Section labels: `Operação`, `Ajustes`, `Administração`
- Separação: `space-y-3` entre seções, label uppercase `text-[10px] tracking-wider text-sidebar-foreground/40` em cima. Sem border-b (igual choco).
- Filtragem por role: `Administração` só aparece se `isAdmin`. **Sem `canAccess(...)`** — filtro mais simples que choco.
- Adição própria do dwg: badge de count em "Processamento" (`{pendingCount}` quando há jobs pendentes/em processo).

---

## 3. Status Indicator Pattern

### 3.1 STATUS_CONFIG (não tem componente compartilhado)

- Path: **inline em `src/pages/ProjectsPage.tsx`** (linhas ~65-75)
- Tipo: **constante local**, não componente
- Estrutura:
  ```tsx
  const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; icon: typeof CheckCircle2 }> = {
    regions_pending: { label: 'Selecionar regiões', dot: 'bg-warning', text: 'text-warning', icon: Clock },
    seal_pending: { label: 'Processar selo', dot: 'bg-warning', text: 'text-warning', icon: Clock },
    extraction_pending: { label: 'Extrair tabelas', dot: 'bg-info', text: 'text-info', icon: Zap },
    processing: { label: 'Processando', dot: 'bg-info', text: 'text-info', icon: Loader2 },
    incomplete: { label: 'Incompleto', dot: 'bg-destructive', text: 'text-destructive', icon: AlertTriangle },
    review_pending: { label: 'Revisar', dot: 'bg-accent', text: 'text-accent', icon: Eye },
    completed: { label: 'Concluído', dot: 'bg-success', text: 'text-success', icon: CheckCircle2 },
    draft: { label: 'Rascunho', dot: 'bg-muted-foreground', text: 'text-muted-foreground', icon: FileText },
  };
  ```
- Estrutura visual: **dot+text** (não pill) — `<span className="inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}">` com `<span className="w-1.5 h-1.5 rounded-full ${cfg.dot}">` antes do label.

### 3.2 Onde é usado

- **Apenas `ProjectsPage.tsx`** — config inline, não exportada.
- HistoryPage e PromptsPage têm seus próprios badges/indicadores (Badge shadcn com classes ad-hoc).

---

## 4. Page Header Pattern

### 4.1 Estrutura

#### `src/pages/Index.tsx`
```tsx
<div className="flex min-h-screen items-center justify-center bg-background">
  <div className="text-center">
    <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
    <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
  </div>
</div>
```
**(Index.tsx é placeholder do Lovable, não é uma page real do app — auth manda direto pra /projetos)**

#### `src/pages/ProjectsPage.tsx`
```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="font-display text-2xl font-semibold text-foreground">Projetos</h2>
    <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus projetos de extração.</p>
  </div>
  <Button size="sm" onClick={handleNewProject}>
    <Plus className="h-4 w-4 mr-1.5" /> Novo projeto
  </Button>
</div>
```

#### `src/pages/HistoryPage.tsx` (do contexto da sessão)
```tsx
<h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
  <History className="h-6 w-6" /> Histórico de Extrações
</h1>
<p className="text-muted-foreground mt-1">128 extrações salvas</p>
```

#### `src/pages/AdminPage.tsx`
```tsx
<div>
  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
    <Users className="h-6 w-6" /> Painel Admin
  </h1>
  <p className="text-muted-foreground mt-1">Gerencie os usuários e seus papéis.</p>
</div>
```

### 4.2 Padrões observados

**Inconsistência:**
- ProjectsPage usa `h2 font-display` (Lora serif), sem ícone, com botão de ação top-right.
- AdminPage e HistoryPage usam `h1 text-2xl font-bold` com **ícone inline ao lado do título** (`<Users className="h-6 w-6">`), sem ação top-right.
- Index.tsx é placeholder Lovable não-curado (h1 "Welcome to Your Blank App").

**Tipo de heading:** misturado (h1 e h2)
**Font family:** ProjectsPage usa `font-display` (Lora). HistoryPage/AdminPage usam default (Poppins).
**Tem ícone inline com título:** SIM em HistoryPage/AdminPage; NÃO em ProjectsPage.
**Tem subtítulo/descrição:** SIM em todas (estilo varia: `mt-0.5` vs `mt-1`).
**Posição das ações:** apenas ProjectsPage tem ação top-right; outras não têm botão primário no header.

---

## 5. Tokens disponíveis (preset warm-editorial)

Definidos em `:root` de `src/index.css` (preset warm-editorial copiado do anti-ai-design-system):

**Tokens shadcn padrão:** background, foreground, card, card-foreground, popover, popover-foreground, primary, primary-foreground, secondary, secondary-foreground, muted, muted-foreground, accent, accent-foreground, destructive, destructive-foreground, border, input, ring, radius.

**Sidebar:** sidebar-background, sidebar-foreground, sidebar-primary, sidebar-primary-foreground, sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring, sidebar-indicator.

**Status (custom):** success, success-foreground, warning, warning-foreground, info, info-foreground.

**Ausentes (que choco tem):** `--icon-green`, `--trend-positive`, `--status-pending-bg/fg`, `--status-success-bg/fg`, `--status-error-bg/fg`. dwg substitui por `--success/warning/info` (semântica diferente — choco tem variantes bg+fg pareadas, dwg tem só uma cor por status).

**Sem dark mode** (`.dark { }` removido nesta sessão, era do template original).

Fonts: `Poppins` (body) + `Lora` (`.font-display`, importadas via Google Fonts).

---

## 6. Lovable memory

`dwg-insight-ext/.lovable/memory/` existe e tem:
- `design/page-layout.md`
- `design/tokens.md`

**Sem `index.md` raiz** (choco tem). Os arquivos de `design/` foram copiados do preset warm-editorial.

---

## 7. Resumo executivo

- **5 tabelas inline em 5 pages, zero shared component.** Cada bug fix tem que ser replicado 5 vezes (e não foi: `text-right` em AdminPage ainda existe).
- **`table.tsx` foi modificado pelo Lovable** com defaults assimétricos (`px-0 pr-4`) e `text-center` global — diferente do shadcn original e diferente de choco. Causa raiz do "Nome não centralizado" reportado pelo Patrick.
- **`STATUS_CONFIG` é constante inline em ProjectsPage**, não componente. Outras pages que precisam de status fazem ad-hoc.
- **Page headers inconsistentes:** ProjectsPage usa h2+font-display sem ícone; HistoryPage/AdminPage usam h1+ícone-inline. Lovable misturou padrões.
- **Index.tsx é placeholder não-curado** ("Welcome to Your Blank App") — auth redireciona, mas o arquivo está lá.
- **Sidebar foi corrigido** nesta sessão (avatar branco, sidebar-indicator near-white, email removido). Estrutura agora ~igual choco.
- **AdminPage tem o bug `text-right` em Ações** que foi corrigido em outras pages mas não nessa — evidência direta da falta de componentização.
- **Tokens divergem:** dwg tem `--success/warning/info` (cor única); choco tem `--status-*-bg/fg` (par bg+fg). Diferentes filosofias.
- **Lovable memory presente** mas conteúdo é o preset (não custom do projeto).
