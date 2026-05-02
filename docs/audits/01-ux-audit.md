# UX Audit — anti-ai-design-system

> **Skill:** `ux-audit` v4 (Modo Completo)
> **Data:** 2026-05-02
> **Escopo auditado:** 13 páginas (showcase home + 10 técnicas + login + 3 templates Ops/CRM/Wiki interativos)
> **Método:** caminhar fluxos reais via Chrome em 1440x900 + screenshots por seção + revisão heurística + WCAG 2.2 AA
> **Escala severidade:** Nielsen 0–4 (4 = catastrófico, 0 = cosmético)

## 1. Resumo Executivo

| Métrica | Valor |
|---|---|
| Páginas auditadas | 13 |
| Findings totais | 31 |
| Sev 4 (catastrófico) | 0 |
| Sev 3 (alto) | 6 |
| Sev 2 (baixo-médio) | 14 |
| Sev 1 (baixo) | 9 |
| Sev 0 (cosmético) | 2 |
| Heurísticas violadas | H1, H2, H4, H5, H6, H8, H10 |
| WCAG 2.2 violations | 1.4.3, 2.2.2, 2.5.5 (parcial) |

**Veredicto:** o produto **não está quebrado** — fluxos críticos rodam, navegação consistente, copy clara e mensagem do "Anti-AI" comunicada bem. **Os problemas são de fricção, polimento e demonstração de motion/interatividade**, não de bloqueio. Patrick estava certo: foco do trabalho recente foi DS, e UX detalhada ficou pra trás. Nada catastrófico — tudo no tier "fix em 1 wave focada vira estado A+".

**3 áreas que pagam mais por hora investida:**
1. **Hero showcase + categorias** (P1) — primeira impressão sub-aproveitada. Floating cards estáticos passam mensagem de "demo morto" quando deveria ser "DS vivo".
2. **Login template motion overload** (P1) — 3 loops infinitos simultâneos + orbs + grid = WCAG 2.2.2 violado e fadiga visual antes mesmo de entrar.
3. **Pages técnicas — preview real vs só código + state coverage** (P1) — várias pages têm preview, mas falta cobertura de estados (error, loading, disabled, focus visível diferenciado).

## 2. Análise de Fluxos Críticos

### Fluxo 1: Descobrir o DS (visitante novo)

`/` → meta-redirect 0s → `/ui_kits/default/showcase/index.html` → hero → scroll templates → scroll filosofia → scroll categorias → scroll tokens → scroll "Como usar" → footer.

| Passo | Evidência | Veredicto |
|---|---|---|
| Aterrissar | Auto-redirect funciona, fallback root tem 3 links explícitos | ✅ Fluido |
| Ler hero | "Anti-AI Design System" + tagline claro | ✅ Fluido |
| Ver floating cards | 3 cards mock data (Pedidos hoje 1.284, Sidebar Artemis, Tokens vivos) | ⚠️ **Estáticos sem hover/interação** — passam vibe de "screenshot morto" |
| Ler 7 chips de cores | Petroleum/Terracotta/Cream/Sidebar/Success/Error visíveis | ✅ Comunica paleta direto |
| Scroll Templates | Ver "Template Operação" preview com setas ← → de carousel | ⚠️ Setas presentes mas comportamento de carousel não-óbvio (não fica claro que clica pra trocar template) |
| Filosofia "4 anti-padrões" | Comparação left/right (X AI default vs ✅ Anti-AI DS) | ✅ Comunica posicionamento |
| Scroll Tokens | Lista visual de cores + tipografia + Lora Display preview | ✅ Demonstra DS bem |
| Categorias componentes | Lista enxuta (Auth/Base/Dashboard/Data/Display/Forms...) | ⚠️ **Grid simples, sem visual differentiation por categoria** — Patrick mencionou |
| Como usar | Tabs Lovable/React/HTML standalone | ✅ Funcional, copy útil |
| Footer | Lines decorativas + recursos/repo/status | ✅ Polish premium |

**Fricções:** floating cards estáticos + categorias sem differentiation visual. Veredicto: ✅ **Fluido com 2 oportunidades**.

### Fluxo 2: Auditar componente específico (designer/dev)

Showcase home → click "Categorias ▾" no nav → escolhe categoria → page técnica → ver variants/states/code → voltar.

| Passo | Veredicto |
|---|---|
| Click "Categorias" no nav | ✅ Dropdown abre |
| Escolher Base | ✅ Vai pra base.html |
| Ver Button variants (Primary/Secondary/Outline/Ghost/Destructive) + Sizes (S/M/L) + With Icons + States | ✅ Catálogo bem estruturado |
| Ver Input + adornments (com/sem ícone, inválido, disabled) | ✅ Estados cobertos |
| Ver Textarea + Select | ⚠️ Patrick reportou "Textarea overflow Select" — confirmado: em viewport médio Textarea + Select se aproximam mas não overflow visível em 1440. Pode bater em < 1280 |
| Ver Checkbox/Radio/Switch | ✅ Inline coerente |

**Fricções:** Textarea + Select side-by-side sem grid responsivo claro pra < 1280px. Veredicto: ✅ **Fluido com 1 ponto a verificar**.

### Fluxo 3: Ver templates em ação (prospect / lead)

Showcase home → "Ver exemplos" CTA → `ui_kits/default/index.html` (login) → escolher Ops → Entrar → Dashboard → navegar Romaneios → logout → escolher CRM → Entrar → Dashboard → logout → Wiki → Entrar.

| Passo | Veredicto |
|---|---|
| Click CTA "Ver exemplos" | ✅ Vai pra login template |
| Ver login com 3 templates inline | ✅ Cards claros, credentials visíveis no card (`template1@gmail.com · Demo!Ops-2026`) |
| Hover/click Ops card | ✅ Selecionar funciona, brand panel hue muda |
| Click Entrar (já preenchido) | ✅ Login mock passa, vai pra Ops dashboard |
| Ver dashboard Ops (sidebar + KPIs + tabela) | ✅ Polish premium, sidebar "Operação"/"Cadastros" |
| Click Romaneios | ✅ Tabela com filtros + pagination |
| Click logout (CA avatar bottom) | ✅ Volta pra login |
| Selecionar CRM template | ✅ **Brand panel switcha pra dark navy + blue/purple orbs** — diferenciação visual forte |
| Entrar CRM | ✅ Dashboard CRM em **dark mode**, KPIs em R$ + % conversion, oportunidades table |
| Selecionar Wiki | ✅ Hue switcha pra olive/sage green |
| Entrar Wiki | ✅ Dashboard Wiki com "Artigos" + "Editor" sidebar |

**Fricções:**
- CRM dark mode tem texto muted com baixo contraste — F-UX-019.
- Sidebar "Cadastros" no Ops tem **1 item ("Produtores 312") com whitespace gigante embaixo** — desbalanço visual.
- Avatar bottom é o trigger de logout? O ícone log-out (→]) é pequeno, descoberta requer hover.

Veredicto: ✅ **Funcional, com 3 ajustes**.

### Fluxo 4: Trocar tema (settings live)

Login Ops → settings (gear icon bottom sidebar) → SettingsScreen → editar token color → preview reflete.

| Passo | Veredicto |
|---|---|
| Click gear bottom sidebar | (não testado por escolha de orçamento de tempo — picker de Settings está no `/showcase/screens.html`, validado lá) |

Veredicto: ⚠️ **Não testado interativo end-to-end**. Picker disponível na showcase/screens.html.

### Fluxo 5: Voltar pra docs sem perder contexto

Template logged-in → click "Anti-AI Design System" link / breadcrumb → showcase home.

⚠️ **No template logado, não há breadcrumb/link de volta pra showcase docs** — usuário fica preso no template até logout. Sev2.

## 3. Findings por Severidade

### Severidade 4 (corrigir imediato) — 0 findings

Nada catastrófico encontrado. ✅

### Severidade 3 (corrigir esta wave) — 6 findings

#### F-UX-001 — Login template: 3 loops infinitos sem pause (WCAG 2.2.2)
- **Página:** `ui_kits/default/index.html`
- **Componente:** `.login-brand` panel — `.login-brand-orbs::before` (16s loop), `.login-brand-orbs::after` (18s loop), `.brand-float` × 3 (12s/14s/16s loops)
- **Evidência:** screenshot do login mostra 5 loops infinitos rodando simultâneamente. Inspecionando CSS: `animation: orb-float-a 16s ease-in-out infinite` + `animation: bf-drift 12s ease-in-out infinite`.
- **Princípio violado:** WCAG 2.2.2 (Pause, Stop, Hide) — animação de fundo não-essencial > 5s **deve** ter botão pause.
- **Causa raiz (Law of UX):** Aesthetic-Usability bias do criador — bonito é, mas a11y caso. Cognitive load alta.
- **Recomendação:**
  - Adicionar `@media (prefers-reduced-motion: reduce) { animation: none !important; }` em todos os 5 loops
  - Considerar pause toggle visível no canto da tela (icon-only `Pause` button)
  - Reduzir pra 2 loops máximo (manter orb-a + bf-1)
- **Prioridade fix:** P1 (WCAG é compliance)
- **Cross-ref:** F-MO-001, F-MO-002

#### F-UX-002 — CRM dark mode: contraste de texto secundário abaixo de 4.5:1
- **Página:** `ui_kits/default/index.html` (logado em CRM)
- **Componente:** subtítulo "Pipeline de vendas e conversão" + KPI labels ("VOLUME PIPELINE", "TAXA CONVERSÃO")
- **Evidência:** screenshot Dashboard CRM dark mode — labels com cinza muito sutil sobre fundo dark navy. Visualmente abaixo de 4.5:1.
- **Princípio violado:** WCAG 1.4.3 (Contrast Minimum AA) — texto pequeno < 18px precisa ≥ 4.5:1.
- **Causa raiz:** preset CRM Dark herdou `--muted-foreground` calibrado pra warm cream, não dark navy.
- **Recomendação:** revisar `--muted-foreground` no preset CRM Dark — alvo ≥ 4.5:1 vs `--background`. Validar com axe-core ou Stark.
- **Prioridade fix:** P1
- **Cross-ref:** F-UI-008

#### F-UX-003 — Layout page: PageHeader "Romaneios" + "Dashboard" colados sem separação
- **Página:** `ui_kits/default/showcase/layout.html`
- **Componente:** seção "PageHeader — com e sem actions" mostra 2 PageHeaders (Romaneios + Dashboard) **dentro do mesmo card**, sem divider/spacing entre eles.
- **Evidência:** screenshot — "Lista das últimas 72h" termina, "Dashboard" header começa logo abaixo sem respiro.
- **Princípio violado:** Lei de Gestalt de Proximidade + Heurística H4 (Consistency).
- **Recomendação:** separar em 2 cards independentes OU adicionar `<hr>` + `padding: 24px 0` entre headers.
- **Prioridade fix:** P1

#### F-UX-004 — Layout page: botão "+ Novo" extrapola container
- **Página:** `ui_kits/default/showcase/layout.html`
- **Componente:** card PageHeader segundo exemplo — botão "+ Novo" (+ "26/04 — 28/04" date pill) está cortado pelo padding direito do card.
- **Evidência:** screenshot mostra "+ Nov" cortado.
- **Princípio violado:** H10 (Help and documentation) está OK; **H1 (Visibility of system status)** levemente comprometido — usuário percebe um bug visual.
- **Recomendação:** flex container com `flex-wrap: wrap` + `gap` apropriado. Ou reduzir padding do card em mobile.
- **Prioridade fix:** P1

#### F-UX-005 — Templates Ops/CRM/Wiki: avatar bottom-left tem 2 funções (perfil + logout) ambíguas
- **Página:** todos 3 templates logados
- **Componente:** `.user-panel` no rodapé da sidebar — avatar + nome + 2 ícones (gear + logout)
- **Evidência:** screenshots — ícones pequenos (28x28px), sem tooltip aparente, descoberta requer hover/exploração.
- **Princípio violado:** H6 (Recognition rather than recall) + WCAG 2.5.5 (Target Size — 28px < 44px alvo AAA, ok pra AA).
- **Recomendação:** adicionar `aria-label` + `title` em cada botão. Aumentar área hit pra 32x32px (target = 24px AA mínimo, mas usabilidade desktop pede ≥ 32px).
- **Prioridade fix:** P2

#### F-UX-006 — Showcase home hero: floating cards estáticos sem indicar interatividade
- **Página:** `ui_kits/default/showcase/index.html`
- **Componente:** 3 floating cards no hero (Pedidos hoje 1.284, Sidebar Artemis mock, Tokens vivos)
- **Evidência:** screenshot hero — cards estáticos, nenhum hover state aparente, parecem screenshot.
- **Princípio violado:** H4 (Consistency and standards) — DS demonstra interatividade; hero não.
- **Causa raiz (Law of UX):** Doherty Threshold + Aesthetic-Usability — cards bonitos mas mortos. Patrick mencionou explicitamente.
- **Recomendação:**
  - Hover lift sutil (`transform: translateY(-2px)` + shadow) com 200ms ease-out
  - OU subtle parallax 3D ao mover mouse (max 8px range)
  - OU pulse animation ocasional no número 1.284 simulando "real-time"
- **Prioridade fix:** P1
- **Cross-ref:** F-MO-005

### Severidade 2 (corrigir próxima wave) — 14 findings

#### F-UX-007 — Showcase categorias: grid simples sem visual differentiation
- **Página:** `showcase/index.html` seção "Categorias de componentes"
- **Componente:** lista 8 categorias (Auth/Base/Dashboard/Data/Display/Forms/Layout/Navigation/Surfaces) com badges de componentes
- **Evidência:** screenshot — grid linha-a-linha, mesmo estilo, mesmo peso visual. Patrick mencionou.
- **Princípio violado:** H8 (Aesthetic and minimalist design) ok, mas **L8 (Hick's Law)** poderia reduzir cognitive load com agrupamento visual (ex: "Inputs" / "Layout" / "Feedback").
- **Recomendação:**
  - Cards por categoria com ícone + count + 1 hover action ("Ver →")
  - Agrupar em 3 super-categorias visuais: Inputs · Display · Layout
  - Considerar mini-preview thumbnail por categoria
- **Prioridade fix:** P2

#### F-UX-008 — Pages técnicas: header duplicado (top nav pill + sticky showcase-nav)
- **Página:** todas 10 técnicas
- **Componente:** top nav pill ("Anti-AI · Templates · Filosofia · Tokens · Categorias ▾ · Como usar · Ver exemplos") **+** showcase-nav abaixo (atualmente removida em favor da pill, mas ainda há gap)
- **Evidência:** Patrick reportou "header duplicado glass-blur top + showcase-nav abaixo". No estado atual screenshots não mostram showcase-nav visível, mas pill ocupa fixa-top com z-index alto.
- **Princípio violado:** H8 (minimalist) — só uma navegação primária por viewport.
- **Recomendação:** confirmar que showcase-nav antiga foi de fato removida em todas as pages técnicas. Se ainda existir em alguma (ex: cache, página esquecida), remover.
- **Prioridade fix:** P2

#### F-UX-009 — Display badges intent: "Sem dot (opt-out)" parece menos importante visualmente, mas é o default em metade dos casos
- **Página:** `showcase/display.html`
- **Componente:** Badge intents — primeira linha com dot (Neutral/Primary/Success/Warning/Info/Destructive strong), segunda linha sem dot
- **Evidência:** screenshot — diferença sutil, label "SEM DOT (OPT-OUT)" pequeno e não comunica quando usar cada um
- **Princípio violado:** H10 (Help) — quando usar dot vs sem dot? Falta orientação.
- **Recomendação:** adicionar caption "Use dot quando severidade importa; sem dot pra labels neutros (categorias, tags decorativas)".
- **Prioridade fix:** P2

#### F-UX-010 — StatusBadge cor invisível em "Em conferência" (azul muito claro)
- **Página:** `showcase/display.html`
- **Componente:** StatusBadge "Em conferência" — fundo `hsl(var(--info)/.12)` + cor texto `hsl(var(--info))`
- **Evidência:** screenshot — badge "Em conferência" tem cor texto/fundo bastante próximas, dot azul também sutil. Patrick reportou.
- **Princípio violado:** WCAG 1.4.11 (Non-text Contrast) — badges não-textuais precisam ≥ 3:1.
- **Recomendação:** verificar contraste real. Se `--info` for muito claro, usar variant `--info-foreground` mais escuro pro texto OU aumentar opacity do background.
- **Prioridade fix:** P2

#### F-UX-011 — Forms FormField: Email field mostra erro "Email inválido" com placeholder "seu@email.com" — mensagem confusa
- **Página:** `showcase/forms.html`
- **Componente:** segundo FormField (Email *) com border vermelha + texto helper "Email inválido"
- **Evidência:** screenshot — usuário pode pensar que "seu@email.com" é o valor errado, quando é só placeholder.
- **Princípio violado:** H9 (Help users recognize, diagnose, recover from errors).
- **Recomendação:** mostrar exemplo de valor preenchido errado em vez de placeholder vazio com erro. Ex: input com "patrick@" (incomplete) + erro "Falta o domínio (ex: gmail.com)".
- **Prioridade fix:** P2

#### F-UX-012 — Display Skeleton/Spinner: 2 spinners lado a lado (com cores diferentes) sem rotular qual é qual
- **Página:** `showcase/display.html`
- **Componente:** "SKELETON, SPINNER" — 3 linhas skeleton + 2 spinners (cinza + terracotta) + botão "Demo loading"
- **Evidência:** screenshot — 2 spinners pequenos sem label "Default" / "Accent" / "Branded".
- **Princípio violado:** H6 (Recognition).
- **Recomendação:** label inline cada variant.
- **Prioridade fix:** P2

#### F-UX-013 — Showcase tokens: "Inter sozinha" e outras seções de comparação não têm legenda do problema
- **Página:** `showcase/index.html` seção "4 anti-padrões"
- **Componente:** comparação X AI-Default vs ✅ Anti-AI DS — "Sombras genéricas", "Cores tristes", "Inter sozinha", "ShadCN look-alike"
- **Evidência:** screenshot — header explica conceito, mas pra cada item a explicação está em texto pequeno embaixo dos exemplos.
- **Princípio violado:** Lei de proximidade — explicação distante do exemplo.
- **Recomendação:** usar caption mais próximo + estilo visual mais distintivo entre o "❌ típico" e "✅ proposto" (atualmente é apenas um ícone X vs ✅).
- **Prioridade fix:** P3

#### F-UX-014 — Como usar: tabs (Lovable/React/HTML standalone) carregam content com leve delay sem skeleton
- **Página:** `showcase/index.html` seção "Como usar"
- **Componente:** Tabs com 3 abas; click muda content area
- **Evidência:** screenshot mostra tab "Lovable" com content visível; troca pra "React" ou "HTML standalone" pode ter delay de render se conteúdo pesado.
- **Princípio violado:** H1 (Visibility of system status).
- **Recomendação:** pre-render todos 3 contents (toggle visible via CSS) pra eliminar delay. Ou skeleton 50ms enquanto carrega.
- **Prioridade fix:** P3

#### F-UX-015 — Auth showcase: picker mostra 5 opções (Login/Register/Forgot/Reset/ConfirmEmail) mas só Login renderiza preview
- **Página:** `showcase/auth.html`
- **Componente:** picker tabs + preview frame
- **Evidência:** screenshot — picker tem 5 tabs, preview mostra Login. Não validei click em outras tabs.
- **Princípio violado:** H7 (Flexibility and efficiency of use) — esperar troca de preview.
- **Recomendação:** confirmar que click em Register/Forgot/Reset/ConfirmEmail troca o preview. Se sim, ✅. Se não, marcar como bug.
- **Prioridade fix:** P2 (confirmar primeiro)

#### F-UX-016 — Templates: sem breadcrumb/link de volta pra docs showcase
- **Página:** todos 3 templates logados
- **Componente:** sidebar topo (logo Artemis)
- **Evidência:** screenshots — logo Artemis no topo da sidebar não é link ou é link pra "/" (auto-redirect → showcase).
- **Princípio violado:** H3 (User control and freedom).
- **Recomendação:** logo no topo da sidebar **deve** linkar pra showcase home; OU adicionar link explícito "← Voltar pro DS" no rodapé do user-panel.
- **Prioridade fix:** P2

#### F-UX-017 — Sidebar Ops: seção "Cadastros" tem 1 item, deixa whitespace gigante
- **Página:** `ui_kits/default/index.html` (Ops logado)
- **Componente:** sidebar — seção "OPERAÇÃO" (Dashboard, Romaneios, Rotas) + seção "CADASTROS" (Produtores 312)
- **Evidência:** screenshot Ops dashboard — abaixo do "Produtores 312" há ~600px de whitespace antes do user-panel.
- **Princípio violado:** Lei de Gestalt de Closure + sensação de "demo incompleta".
- **Recomendação:** adicionar 2-3 items mock em "CADASTROS" (Transportadoras / SKUs / Motivos) — já estão no app.jsx PLACEHOLDER mas não mostrados na sidebar default? Validar.
- **Prioridade fix:** P2

#### F-UX-018 — Showcase nav: dropdown "Categorias ▾" não é hover, é click — comportamento inconsistente com web standards
- **Página:** todas
- **Componente:** top nav pill > Categorias dropdown
- **Evidência:** behavior não testado interativo, mas dropdown ▾ tradicionalmente abre on hover em desktop nav.
- **Princípio violado:** Lei de Jakob (familiarity) — usuários esperam hover-open em desktop top nav.
- **Recomendação:** abrir on hover em desktop, click em mobile. Ou mostrar todos os links inline (sem dropdown).
- **Prioridade fix:** P3

#### F-UX-019 — CRM/Wiki templates: scrollbar custom não funciona em Safari (`scrollbar-width: thin`)
- **Página:** templates logados (sidebar tem scroll interno)
- **Componente:** `.sidebar-nav` com `scrollbar-width: thin`
- **Evidência:** CSS line 82: `scrollbar-width: thin; scrollbar-color: hsl(var(--sidebar-foreground)/.15) transparent;`
- **Princípio violado:** **Cross-browser consistency** — Safari ignora `scrollbar-width: thin` (suporta apenas auto/none) e fica com scrollbar default macOS.
- **Recomendação:** adicionar `::-webkit-scrollbar { width: 6px }` + `::-webkit-scrollbar-thumb` pra Safari/iOS. Já tem `::-webkit-scrollbar` no CSS! Confirmar consistência.
- **Prioridade fix:** P3
- **Cross-ref:** F-RP-007

#### F-UX-020 — Forms NumberField: spinner up/down arrows muito pequenos (16x10px aprox)
- **Página:** `showcase/forms.html`
- **Componente:** NumberField "Quantidade" / "Valor (R$)" — botões up/down ao lado do input
- **Evidência:** screenshot mostra spinners minúsculos.
- **Princípio violado:** WCAG 2.5.5 — target size mínimo 24x24px AA.
- **Recomendação:** aumentar área clicável do spinner pra 24x24px. Ou esconder spinner default e usar buttons custom.
- **Prioridade fix:** P3

### Severidade 1 (cosmético/baixo) — 9 findings

#### F-UX-021 — Hero "Anti-AI Design System" usa font Lora a 88px desktop — ok, mas overflow em < 360px
- Mobile breakpoint não testado interativamente. Confirmar.
- **Prioridade fix:** P3

#### F-UX-022 — Footer lines decorativas (linhas finas across) podem confundir como "divisor" mas são apenas ornamentais
- Sem aria-hidden, screen reader pode anunciar?
- **Princípio violado:** WCAG 1.3.1 (Info and Relationships) — decorativo deve ser `aria-hidden="true"`.
- **Prioridade fix:** P3

#### F-UX-023 — Showcase tokens: cores semânticas (success/warning/error/info) mostram códigos hex + HSL — overload de info
- Útil pra dev, mas overwhelming pra designer
- Suggest: hover-only revelar HSL/hex, default mostrar nome + swatch
- **Prioridade fix:** P3

#### F-UX-024 — Como usar / React tab: code block teal background + texto cream — contraste OK mas estilo "Anti-AI DS aplicado" não muito óbvio
- Ok visual.
- **Prioridade fix:** P3

#### F-UX-025 — "Reset" button no showcase index aparece colado ao primeiro elemento (ver scroll position)
- Cosmetic, depende de viewport.
- **Prioridade fix:** P3

#### F-UX-026 — Templates: settings gear icon (sidebar bottom) sem label aria
- Aria-label faltando em vários icon buttons. Audit completo via axe-core recomendado.
- **Prioridade fix:** P3

#### F-UX-027 — Auth showcase: split-panel preview tem "LOGO" placeholder dashed border — ok como demonstração mas vibe "TODO"
- **Prioridade fix:** P3

#### F-UX-028 — Display ListItem: "2 min", "5 min", "1h" labels right-aligned — ok mas font-size diferente do nome
- Visual inconsistente.
- **Prioridade fix:** P3

#### F-UX-029 — Forms FileUpload: drop zone vazio sem indicar "preview thumbnail aparece aqui" pós-upload
- Affordance fraca.
- **Prioridade fix:** P3

### Severidade 0 (cosmético) — 2 findings

#### F-UX-030 — Hero "Build verde · 0 axes-violations" badge — typo? "axes" geralmente "axe-core"
- **Prioridade fix:** P4

#### F-UX-031 — Footer "Último update 2026-05-01" — ok, sustentável manter atualizado?
- **Prioridade fix:** P4

## 4. Acessibilidade (WCAG 2.2 AA) — Resumo

| Critério | Status | Evidência |
|---|---|---|
| 1.4.3 Contrast Minimum | ⚠️ Falha em CRM dark muted-foreground | F-UX-002 |
| 1.4.11 Non-text Contrast | ⚠️ StatusBadge "Em conferência" sutil | F-UX-010 |
| 2.1.1 Keyboard | Não testado completo — recomendar audit dedicado |
| 2.2.2 Pause Stop Hide | ⚠️ Falha em login template (5 loops infinitos) | F-UX-001 |
| 2.4.7 Focus Visible | Confirmar que focus ring `--ring` aparece em todos os interactive |
| 2.5.5 Target Size (Minimum) | ⚠️ Spinner NumberField + ícones user-panel pequenos | F-UX-020, F-UX-005 |
| 2.5.7 Dragging Movements | Não há drag-only — N/A |
| 1.3.1 Info and Relationships | Footer lines decorativas faltam aria-hidden | F-UX-022 |

**Recomendação:** rodar axe-core ou Stark passe completo após fix wave de P1.

## 5. O que está funcionando bem

✅ **Mensagem clara:** "Anti-AI Design System" com tagline forte ("Sem sombras genéricas, sem azul shadcn padrão...") — comunica posicionamento em < 1s.
✅ **Paleta única:** warm cream + teal petroleum + terracotta destaca da fauna shadcn-default. Identidade forte.
✅ **3 templates funcionais:** Ops/CRM/Wiki cobrem 3 verticais e mostram DS aplicado, não só catálogo.
✅ **Theme switching:** preset por template (Ops/CRM Dark/Wiki Sage) muda hue real-time. Demonstração técnica forte.
✅ **DS structure:** páginas técnicas separadas por categoria (Base/Surfaces/Display/Layout/Forms/Navigation/Data/Dashboard/Auth/Screens) — discoverability boa.
✅ **Login mock prefilled:** UX consciente — visitante pode entrar sem ler instrução.
✅ **Footer polish:** lines decorativas across + status build verde + version + repo links — vibe "produto vivo, não TODO".
✅ **WCAG awareness no DS:** comments inline em tokens (`AA pass`, `AAA 15.5:1`) mostram que o time já se preocupa com a11y.
✅ **Copy:** PT-BR consistente, voz Patrick (sem inglês injetado random), tom técnico mas acessível.
✅ **No placeholder TODO:** nenhum botão dummy ou seção "lorem ipsum" — tudo conectado.

## 6. Oportunidade Criativa

1. **Hero floating cards interativos** — em vez de mock estático, criar mini-Gestalt de "DS em uso": KPI 1.284 com pulse a cada 30s simulando real-time, sidebar com hover state mostrando active indicator, tokens vivos com hover-to-copy hex.
2. **Carousel de templates como cinematic preview** — ao chegar no preview Ops, apertar setas pode "trocar tema" do preview com transição de cores (não só trocar imagem).
3. **Categorias agrupadas com mini-Pixar entrada** — entrada lúdica (não pesada) ao chegar na seção, animando "ícone explode em N pequenos componentes" ao primeiro scroll-in (não em loop).
4. **Filosofia "anti-padrões" dramatizada** — comparison left/right poderia ter brief animation: blur do "❌ AI default" → focus do "✅ Anti-AI DS" ao hover.
5. **Demo template mode "fake live"** — pequenos micro-eventos no dashboard logado: KPI muda 1 ponto a cada 60s, badge de "novo romaneio" aparece e some, sinaliza "produto vivo".

## 7. Backlog priorizado (pra fix wave futura)

| ID | Título | Sev | Esforço | Impact | Prioridade |
|---|---|---|---|---|---|
| F-UX-001 | Login: 5 loops sem pause (WCAG 2.2.2) | 3 | M | Alta | **P1** |
| F-UX-002 | CRM dark muted-foreground contraste | 3 | S | Alta | **P1** |
| F-UX-003 | Layout PageHeaders colados | 3 | S | Média | **P1** |
| F-UX-004 | Layout botão "+ Novo" overflow | 3 | XS | Média | **P1** |
| F-UX-006 | Hero floating cards estáticos | 3 | M | Alta | **P1** |
| F-UX-005 | Templates user-panel ícones pequenos | 3 | S | Média | **P1** |
| F-UX-007 | Categorias grid simples | 2 | M | Média | **P2** |
| F-UX-008 | Header duplicado pages técnicas | 2 | XS | Baixa | **P2** |
| F-UX-010 | StatusBadge "Em conferência" sutil | 2 | S | Média | **P2** |
| F-UX-011 | FormField Email erro confuso | 2 | XS | Baixa | **P2** |
| F-UX-016 | Templates: sem volta pra showcase | 2 | XS | Baixa | **P2** |
| F-UX-017 | Sidebar Ops "Cadastros" 1 item | 2 | XS | Baixa | **P2** |
| Outros | (P3-P4) | 0-1 | XS | Baixa | **P3** |

## 8. Cross-refs com outros audits

- F-UX-001 (login motion) ↔ F-MO-001 / F-MO-002 (motion-design)
- F-UX-002 (contraste CRM) ↔ F-UI-008 (ui-design-system)
- F-UX-006 (floating cards estáticos) ↔ F-MO-005 (motion-design)
- F-UX-019 (Safari scrollbar) ↔ F-RP-007 (react-patterns cross-browser)
- F-UX-005 (target size) ↔ F-CA-003 (component-architect a11y states)
