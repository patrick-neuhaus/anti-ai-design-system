# 07 — Component Patterns

> Regras concretas pra componentes recorrentes. Estas regras saem da comparação empírica em `audits/03-deltas.md` e das decisões do Patrick em `audits/04-decisions.md`.

## Action Column

**Regra:** colunas de ação em tabelas usam **geometria, não flex justify**. Width fixa apertada (`w-20` pra 2 botões, `w-28` pra 3) + `flex gap-1` sem `justify-*`. Conteúdo encosta à esquerda da coluna naturalmente.

**Por quê:** evita o problema de `justify-end` vs `justify-center` vs `text-right` competindo. Quando a coluna já é apertada, alinhamento se resolve por geometria.

**Como verificar:**
- Grep `justify-end\|justify-center\|text-right` em arquivos com `<TableCell>` — não deveria aparecer em colunas de ação
- Inspect: action cell tem width fixa em `w-N`?

**Exemplo do erro real:** `dwg-insight-ext/src/pages/AdminPage.tsx` linha ~125 tem `<TableCell className="text-right">` com Button direto — bug que persistiu mesmo após fix em outras pages porque cada tabela é inline.

**Exemplo correto:** `chocotracking/src/components/dashboard/RomaneiosTable.tsx` linha ~311: `<td className="px-3"><div className="flex gap-1">...buttons</div></td>` (com header `w-20`).

**Helper disponível:** `presets/_shared/AppTable.tsx` exporta `<ActionCell>` que já implementa esse padrão.

---

## NavLink

**Regra:** **não crie wrapper de NavLink no projeto**. Use direto do `react-router-dom`.

**Por quê:** wrapper adiciona 28+ linhas que ninguém usa (sintoma observado em choco — wrapper órfão). NavLink nativo aceita className como função recebendo `{isActive}` — suficiente.

**Como verificar:**
- `grep -r "from \"@/components/NavLink\"" src/` — se vazio, ok
- Se houver `NavLink.tsx` em `src/components/`, conferir se é usado; se não, deletar

**Exemplo do problema:** `chocotracking/src/components/NavLink.tsx` existe (28 linhas) mas `AppSidebar.tsx` importa NavLink do router direto — wrapper morto.

---

## Page Header

**Regra:** `h2 + subtítulo + ações top-right`. Sem ícone inline com título. `font-display` opcional (preset decide).

**Estrutura canônica:**

```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="font-display text-2xl font-semibold text-foreground">
      {title}
    </h2>
    <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
  </div>
  {actions && <div>{actions}</div>}
</div>
```

**Regras específicas:**
- **Tag:** sempre `<h2>` (não `h1`). h1 fica reservado pra app title (raro, landing page).
- **Ícone inline:** NÃO. Ícone puxa atenção do título errado. Se quiser identidade visual, use `font-display` (preset decide qual fonte serif/distintiva).
- **Subtítulo:** sempre presente. `text-sm text-muted-foreground` + `mt-0.5`.
- **Ações:** top-right via `flex items-center justify-between`. Botão primário (`size="sm"`) com ícone + label.
- **Wrapper:** `space-y-5` em volta (gap consistente com filters/table).

**Como verificar:**
- Grep `<h1.*flex items-center gap-2>` em pages — se aparecer com ícone irmão, refatorar pra h2 sem ícone
- Espaçamento: `space-y-5` no wrapper da página (não `space-y-6` ou outro)

**Exemplo do erro real:** `dwg-insight-ext/src/pages/HistoryPage.tsx`: `<h1 className="text-2xl font-bold flex items-center gap-2"><History className="h-6 w-6" /> Histórico de Extrações</h1>` — tag errada, ícone inline, sem font-display.

**Exemplo correto:** `chocotracking/src/pages/Romaneios.tsx`: `<h2 className="text-xl font-semibold">Romaneios</h2><p className="text-sm text-muted-foreground">...</p>`.

---

## Quando criar shared component vs deixar inline

**Regra de bolso:** se o padrão aparece em 2+ pages, extrair pra `_shared/` (ou equivalente do projeto).

**Sinais que indicam "deve ser shared":**
1. Mesmo JSX repetido em 2+ pages
2. Bug-fix em 1 não propagaria pra outra
3. Tem config map (status, types, categorias) que outras páginas precisariam

**Sinais que indicam "deixar inline":**
1. Usado apenas 1 vez E improvável ganhar 2º consumidor
2. Lógica é acoplada ao state da page específica
3. Extrair geraria abstração prematura (config explosa, props demais)

**Componentes já extraídos no preset (`presets/_shared/`):**
- `AppTable.tsx` — wrapper minimal com columns config + `<ActionCell>` helper
- `StatusBadge.tsx` — pill com dot opcional, recebe variant via prop


---

## AppTable usage (API contract)

`<AppTable>` renderiza internamente `<Table><TableHeader>...</TableHeader><TableBody>{children}</TableBody></Table>`. Caller passa **rows direto como children**, NÃO envolvido em `<TableBody>`.

**Correto:**
```tsx
<AppTable columns={[
  { key: "name", label: "Nome", width: "w-[300px]" },
  { key: "status", label: "Status", align: "center" },
]}>
  {data.map((row) => (
    <TableRow key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell className="text-center">{row.status}</TableCell>
    </TableRow>
  ))}
</AppTable>
```

**Errado** (gera HTML inválido `<tbody><tbody>`):
```tsx
<AppTable columns={[...]}>
  <TableBody>  // ❌ AppTable já renderiza TableBody internamente
    {rows}
  </TableBody>
</AppTable>
```

**Sintoma quando errado:** apenas o primeiro header aparece, restante quebra silenciosamente (browser tenta corrigir HTML inválido).

**Como detectar:** console mostra `validateDOMNesting: <tbody> cannot appear as a child of <tbody>`.

---

## Login layout (split 50/50)

**Regra:** AuthPage (login/signup/recovery) usa **split 50/50** em desktop, stack em mobile. Painel esquerdo = brand + contexto/proposta de valor. Painel direito = formulário em surface neutra.

**Por quê:** login default shadcn (card centralizado em fundo neutro) é a cara de IA #1 de todo app SaaS gerado. Split 50/50 ancora a marca (gesto de identidade) e separa visualmente "estou autenticando" de "estou usando o produto".

**Estrutura canônica:**

```tsx
<div className="min-h-screen grid lg:grid-cols-2">
  {/* Left: brand + context (preset decide surface — sidebar-bg ou primary) */}
  <aside className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-12">
    <Brand />
    <PitchHeadline />  {/* h2 font-display, 1 frase do que o produto faz */}
    <Footer />          {/* © year, version, etc */}
  </aside>

  {/* Right: form */}
  <main className="flex items-center justify-center p-8 lg:p-12 bg-background">
    <Form />            {/* max-w-sm */}
  </main>
</div>
```

**Regras específicas:**
- **Esquerda:** brand mark + nome no topo, headline (font-display, 28-36px) no meio com pitch de 1 frase, subtítulo de 1 linha, footer com versão/ano. **Não** lista features. **Não** carousel.
- **Direita:** título da ação (`Entre na sua conta` / `Crie sua conta`), subtítulo de 1 linha, formulário, link de alternância (login ↔ signup) + esqueceu senha em rodapé pequeno.
- **Mobile:** painel esquerdo `hidden`, formulário ocupa tela inteira (sem nenhuma referência ao brand panel). Não tente fazer painel esquerdo virar topbar — vira chapéu inútil.
- **Texto no painel esquerdo:** sempre passa contraste AA contra o fundo escolhido (validar via tabela `--sidebar-foreground` sobre `--sidebar-background` ou `--primary-foreground` sobre `--primary`).

**Como verificar:**
- Grep `min-h-screen flex items-center justify-center bg-background.*max-w-sm` em pages/ — se aparecer em AuthPage, é card centralizado, refatorar pra split.
- AuthPage tem `grid lg:grid-cols-2`?

**Exemplo do erro real:** `gascat-configurator/src/pages/AuthPage.tsx` antes do fix: card de 384px centralizado em fundo neutro, sem nenhum elemento de brand identidade. Look genérico shadcn.

**Exemplo correto:** chocotracking AuthPage (split sidebar dark + form), aw control (split com Lora display à esquerda).

---

## Configurações = user panel button (quando há admin section)

**Regra:** se o app tem **seção admin separada** na sidebar (`adminItems`), Configurações **não vai** lá — fica como **botão admin-only no user panel** (rodapé da sidebar, junto do logout).

**Por quê:** "Configurações" geralmente é admin-only mas tem cara de "preferência pessoal". Botar em adminItems duplica caminho semântico (admin já é uma zona; configurações são meta-config do app, não conteúdo). User panel é onde mora "controles do usuário/sessão" — Configurações encaixa lá com `isAdmin && <button>`.

**Estrutura canônica:**

```tsx
<div className="user-panel">
  <Avatar /> <Name+Email />
  <div className="flex gap-2 mt-2">
    {isAdmin && <button onClick={() => goto("cfg")}><Wrench/> Config.</button>}
    <button onClick={signOut}><LogOut/> Sair</button>
  </div>
</div>
```

**Não aplica em:** apps single-role (sem admin separado) — nesses Configurações pode entrar no nav principal direto.

**Exemplo do erro real:** gascat antes do fix tinha Configurações em `adminItems` na sidebar (tabelas, **configurações**, usuários, log). User panel só tinha logout. **Duplicação estrutural** com a regra de admin section.

**Exemplo correto:** chocotracking, aw control, gascat (após fix).

---

# WAVE 6.5 — Library inventory

A partir da Wave 6.5, o `ui_kits/default/components/` virou biblioteca completa organizada em subpastas. Este inventário lista o que existe; cada componente carrega no próprio file um cabeçalho `// When to use / // When NOT to use` que é a referência canônica de uso.

## Estrutura

```
ui_kits/default/components/
├── Icon.jsx          registry de ícones (Lucide-style inline SVG)
├── app.jsx           harness React do kit
├── base/             primitivos de input/ação (7)
├── surfaces/         Card, Surface (2)
├── display/          Badge/Tag/Avatar/Alert/EmptyState/StatusBadge/Skeleton/Spinner/Toast (9)
├── layout/           PageHeader/Section/PageShell/AppLayout (4)
├── forms/            FormField + NumberField/DateField/FileUpload (4)
├── navigation/       Tabs/Breadcrumb/Pagination/NavLink/Sidebar (5)
├── data/             Table/AppTable/ListItem (3)
├── dashboard/        StatCard/KpiGrid/MetricCard (3)
├── auth/             Login/Register/ForgotPassword/ConfirmEmail (4)
└── screens/          Dashboard/Romaneios/Settings/Profile/EmptyDashboard (5)
```

## Convenções obrigatórias

1. **Cor via `hsl(var(--token))`**, nunca `var(--token)` direto. Tokens em `tokens.css` são HSL triples sem `hsl()` wrap; o wrap acontece no consumidor. Falhar isso resolve `color: 16 38% 12%` que CSS rejeita.
2. **Variantes por prop**, não por fork. `<Button variant="destructive">`, não `DangerButton`.
3. **Slots para customização**, não strings: `actions={<Button … />}`, não `actions={["filter","new"]}`.
4. **Brand via props** no consumidor, nunca hardcoded. Componentes default para placeholder SVG/copy genérica.
5. **Icons como prop** (`iconLeft`, `iconRight`, `icon`), passados pelo consumidor a partir do registry.

Detalhes completos em `docs/10-component-composition.md`.

## Quando criar componente novo

Antes de criar:
- O caso pode ser uma **variante por prop** num componente existente?
- O caso pode ser uma **composição** dos primitivos via slots?
- O caso pode ser um **token override** sem novo componente?

Se sim a qualquer das três, **não** crie file novo. A biblioteca tem ~33 componentes e qualquer composição derivada disso deve viver no consumidor (`screens/`, `app.jsx`, ou no projeto que usa o kit).

Caso genuinamente novo (cobrindo um caso que nenhum dos 33 cobre), seguir as regras de `docs/10`:
- escolher subpasta correta (`base/`, `display/`, etc.)
- comentário-cabeçalho com `When to use` / `When NOT to use`
- consumir tokens via `hsl(var(--*))`
- expor via `window.<Nome> = <Nome>` (sem ESM/import)
- adicionar entrada em `docs/07` (este arquivo)
- adicionar showcase em `ui_kits/default/showcase/<categoria>.html`

## Showcase

`ui_kits/default/showcase/index.html` é a porta de entrada navegável. Cada categoria tem sua page (`base.html`, `display.html`, etc.) com exemplos vivos dos componentes daquela subpasta. Use o showcase pra validar visualmente após token swap ou novo componente.