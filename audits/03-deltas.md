# Deltas — Choco vs Dwg

> Comparação estrutural entre `chocotracking` (baseline known-good) e `dwg-insight-ext` (subject pós-fixes desta sessão). Cada delta tem uma pergunta direta pro Patrick decidir o canon do design system.

---

## Delta 1: `table.tsx` defaults (TableHead/TableCell)

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| TableHead className | `h-12 px-4 text-left align-middle font-medium text-muted-foreground` | `h-12 align-middle font-medium text-muted-foreground px-0 pr-4 text-center` |
| TableHead padding | `px-4` simétrico (16px ambos) | `px-0 pr-4` assimétrico (0 esq, 16px dir) |
| TableHead text-align | `text-left` | `text-center` |
| TableCell className | `p-4 align-middle` | `p-4 align-middle text-center px-0 py-[8px]` |
| TableCell padding | `p-4` simétrico (16px ambos) | `px-0 py-[8px]` (0 horizontal, 8px vertical) |
| TableCell text-align | default (left, herdado de th) | `text-center` |

**Por que importa:** O `pr-4` sem `pl-4` no dwg é a causa direta do bug "Nome não centralizado" — o header tem 16px de padding direito e zero esquerdo, descentralizando visualmente. Choco preserva o shadcn original (simétrico, left).
**Pergunta pro Patrick:** Canon = choco (simétrico + text-left), ou volta pro shadcn original (idem), ou mantém dwg modificado (text-center default)?

---

## Delta 2: Tabelas como shared component vs duplicadas inline

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Componentes de tabela | 2 (RomaneiosTable, DeliveriesTable) | 0 |
| Tabelas inline em pages | 0 | 5 (Projects, Admin, History, Review, Prompts) |
| Estratégia | raw HTML `<table>` em componente compartilhado, com columns config + bulk actions inline | shadcn `<Table>` + JSX inline em cada page, sem extração |
| Bug fix propaga? | sim (1 lugar) | não (5 lugares — AdminPage ainda com `text-right` mesmo após fix nas outras) |

**Por que importa:** Esta é a raiz estrutural. A sessão de fixes desta tarde provou empiricamente: AdminPage não foi corrigido porque ninguém lembrou que ele existia. Sem componente compartilhado, design system vira manual de boas intenções.
**Pergunta pro Patrick:** Canon = extrair `AppTable` shared component (estilo choco), ou criar wrapper mais leve só do shadcn `<Table>` configurando defaults, ou manter inline e documentar como regra em prosa?

---

## Delta 3: Action column alignment

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Header alignment | `text-left w-20` (coluna apertada justifica botões à esquerda naturalmente) | misto: `text-right` (Admin), default `text-center` (Projects/History/Prompts pós-fix), variável (Review) |
| Cell flex | `flex gap-1` (sem justify, default flex-start) | `flex justify-center gap-1/2` (Projects/History/Prompts) ou `text-right` sem flex (Admin) |
| Tamanho da coluna | fixo `w-20` (80px) | percentual via colgroup (Projects), sem controle (outras) |

**Por que importa:** Choco resolve alinhamento por geometria (coluna apertada empurra conteúdo). Dwg resolve por flex justify, mas inconsistente entre pages. Patrick reclamou da terceira variação ("já é a vigésima vez que peço").
**Pergunta pro Patrick:** Canon = coluna apertada estilo choco (geometria resolve), ou justify-center explícito em todo cell de Ação (estilo dwg pós-fix), ou justify-end (que ele rejeitou hoje)?

---

## Delta 4: Sidebar — NavLink shared vs inline

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| `NavLink` wrapper compartilhado existe? | SIM (`src/components/NavLink.tsx`, 28 linhas, com activeClassName/pendingClassName) | NÃO |
| AppSidebar usa o NavLink shared? | NÃO — usa `NavLink` do react-router-dom direto | NÃO — idem |
| Conclusão | wrapper existe mas órfão | nem wrapper existe |

**Por que importa:** Choco deixou um NavLink.tsx criado mas não usado — é dead code. dwg pelo menos é honesto e usa o de router. Não é problema crítico, mas é sintoma de "criou abstração e esqueceu".
**Pergunta pro Patrick:** Ignorar este delta (não é crítico) ou matar o NavLink.tsx órfão do choco (dívida técnica)?

---

## Delta 5: Status indicator — shared component vs config inline

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Existe componente shared? | SIM — `src/components/StatusBadge.tsx` (27 linhas) | NÃO |
| Tipo de mapeamento | config map de objeto literal `Record<DeliveryStatus, {label, className}>` | constante inline `STATUS_CONFIG` em ProjectsPage |
| Estrutura visual | pill (`rounded-full px-3 py-1`) | dot+text (`w-1.5 h-1.5 rounded-full` + label) |
| Uso atual | 2 consumidores (RomaneiosTable, DeliveriesTable) | 1 consumidor (ProjectsPage); HistoryPage/PromptsPage têm Badge ad-hoc |
| Tokens usados | `--status-*-bg/fg` (par bg+fg pareado) | `--success`/`--warning`/`--info` (cor única, opacidade aplicada inline com `/15`) |

**Por que importa:** Choco tem 1 source of truth pra status; dwg tem 3 padrões diferentes em 3 pages. Mudança de cor/label requer 3 edits em locais diferentes.
**Pergunta pro Patrick:** Canon = shared StatusBadge component (qual estrutura: pill ou dot+text)? Tokens = par bg+fg estilo choco ou cor única estilo dwg?

---

## Delta 6: Page header structure

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Tipo de heading | `h2` consistente | misto (`h2` em ProjectsPage, `h1` em HistoryPage/AdminPage) |
| Font family | default Poppins | misto (font-display Lora em ProjectsPage, default em outras) |
| Ícone inline com título | NÃO | SIM em HistoryPage/AdminPage, NÃO em ProjectsPage |
| Subtítulo/descrição | SIM (sempre `<p text-sm text-muted-foreground>`) | SIM (mas spacing varia: `mt-0.5` vs `mt-1`) |
| Posição das ações | top-right via `flex justify-between` (quando aplicável) | só ProjectsPage tem ação top-right |
| Wrapper container | `space-y-5` consistente | `space-y-5` (Projects), `space-y-6` (Admin), variável |

**Por que importa:** Header é o primeiro contato visual da página. Inconsistência aqui faz cada tela parecer um app diferente. Choco tem 1 padrão; dwg tem 3.
**Pergunta pro Patrick:** Canon = h2 sem ícone + subtítulo + ações top-right (estilo choco), ou h2+font-display sem ícone (estilo ProjectsPage atual), ou outra coisa?

---

## Delta 7: Tokens extras

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Sidebar-indicator | `--sidebar-indicator: 33 47% 53%` (accent dourado) | `--sidebar-indicator: 0 0% 95%` (near-white pós-fix) |
| Status tokens | par `--status-{pending,success,error}-{bg,fg}` (bg light + fg saturado) | `--success/warning/info` + `-foreground` (cor única, opacidade inline) |
| Decorativos | `--icon-green`, `--trend-positive` | nenhum |
| Dark mode | não tem `.dark { }` | não tem (removido nesta sessão) |
| Fonts | Poppins | Poppins + Lora |

**Por que importa:** Sistema de status determina como badges/dots/pills se comportam. Choco tem rich tokens (bg/fg pareado pra design pill); dwg só tem hue (precisa fazer opacidade inline pra criar variantes).
**Pergunta pro Patrick:** Canon = par bg+fg estilo choco (mais tokens, mais explícito), ou cor única estilo dwg (menos tokens, mais flexível)? Adicionar `--icon-green`/`--trend-positive` no design system geral?

---

## Delta 8: Lovable memory

| Aspecto | Choco | Dwg |
|---------|-------|-----|
| Pasta `.lovable/memory/` existe? | SIM | SIM |
| `index.md` raiz | SIM | NÃO |
| `design/page-layout.md` | SIM (custom do projeto) | SIM (copiado do preset) |
| `design/tokens.md` | SIM (custom do projeto) | SIM (copiado do preset) |

**Por que importa:** Choco tem memory custom. Dwg tem memory genérica do preset (significa que Lovable lê instruções do design system, mas sem customização do projeto).
**Pergunta pro Patrick:** Canon = preset escreve só `design/page-layout.md` + `design/tokens.md` e o projeto adiciona `index.md` próprio? Ou preset deve incluir um template de `index.md` também?

---

## Resumo dos deltas

| # | Padrão | Choco | Dwg | Severity |
|---|--------|-------|-----|----------|
| 1 | table.tsx defaults | simétrico + left | assimétrico + center | **Alta** (causa de bug ativo) |
| 2 | Tabela shared vs inline | shared | inline 5x | **Crítica** (causa raiz) |
| 3 | Action column alignment | flex-start + w-20 | misto | **Alta** (UX inconsistente) |
| 4 | NavLink shared | wrapper órfão | sem wrapper | Baixa |
| 5 | Status indicator | shared component | config inline | **Alta** (3 padrões em 3 pages) |
| 6 | Page header | h2 consistente | h1/h2/font-display misto | Média |
| 7 | Tokens extras | par bg+fg + decorativos | cor única + status básico | Média |
| 8 | Lovable memory | custom + template | só template | Baixa |

**Total: 8 deltas, 4 com severity alta/crítica.**
