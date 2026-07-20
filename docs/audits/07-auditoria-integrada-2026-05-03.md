# Auditoria integrada — anti-ai-design-system

Data: 2026-05-03  
Base auditada: working tree local atual, com alteracoes nao commitadas.  
Browser: `http://127.0.0.1:8000/ui_kits/default/showcase/index.html`

## 1. O que foi auditado

Lentes usadas:

- `maestro`: composicao de skills e ordem da auditoria.
- `ui-design-system`: tokens, contraste, papeis semanticos, consistencia visual.
- `motion-design`: motion funcional, microinteracao, reduced motion, loops.
- `ux-audit`: navegacao, affordance, fluxo do showcase, hierarquia.
- `component-architect`: contrato de componentes, reuse, estado visual/semantico.
- `react-patterns` + `trident`: runtime React/Babel, dead code, duplicacao, a11y e risco tecnico.
- Browser real via Codex in-app browser: home, paginas de showcase e demos `crm/wiki`.

Observacao: `animations.dev` foi usado so como referencia conceitual de qualidade de microinteracao. Nao usei `composio.dev` como referencia visual.

## 2. Veredito curto

O DS esta bem melhor do que um scaffold generico, mas ainda nao esta "ultima vez que mexe". O problema principal nao e paleta nem tipografia. E **contrato quebrado**: o repo tem `Button`, `Card`, `Tabs`, `Skeleton`, `Dialog` etc, mas partes importantes do produto e do showcase continuam recriando a mesma coisa por CSS/JS inline. Por isso varias correcoes anteriores "nao pegam" em tudo.

A cor laranja do botao primario parece corrigida no `Button.jsx` atual (`accent-foreground` escuro, contraste 4.61:1). Mas essa correcao nao resolve os elementos que parecem botao e nao consomem o contrato do botao.

## 3. Findings integrados

| ID | Sev | Lente | Achado | Evidencia | Por que importa |
|---|---:|---|---|---|---|
| F-INT-001 | P1 | Component + UI + Motion | Elementos com cara de botao continuam fora do contrato `Button`. | `ui_kits/default/showcase/index.html:245`, `:565`, `:1558`, `:1617`, `:1953`; `ui_kits/default/index.html:200` | E exatamente o bug mental que o Patrick apontou: se parece/funciona como acao, precisa herdar tamanho, cor, press, foco, reduced-motion e contraste do Button. Hoje a correcao em `Button.jsx` nao chega nesses casos. |
| F-INT-002 | P1 | Component + A11y | Cards clicaveis no app demo sao `div` com `onClick`, sem teclado/role/focus. | `ui_kits/default/index.html:1295`, `:1535`; comparar com `components/surfaces/Card.jsx` | O `Card.jsx` compartilhado ja resolve isso com `tabIndex`, `role=button` e `onKeyDown`. O demo reimplementa e perde acessibilidade. |
| F-INT-003 | P1 | Architecture | `ui_kits/default/index.html` e um app-demo monolitico que recria primitives em vez de consumir a biblioteca. | `.btn` em `ui_kits/default/index.html:200`; funcoes locais `Checkbox`, `Drawer`, `Dialog`, `Skeleton`, `EmptyState` em `:884`, `:918`, `:935`, `:952`, `:964` | Esse e o maior motivo de drift. O showcase melhora, mas os templates reais continuam com outra camada de componentes. |
| F-INT-004 | P1 | Code health + UX | Paginas tecnicas mantem nav legado morto/duplicado apos extrair `NavHeader`. | `const Nav` em 10 paginas; `Dropdown click-to-open` em 10 paginas; `nav-cta-mini` morto em 10 paginas | Duas fontes de verdade aumentam chance de regressao. Hoje o browser ainda abre dropdown, mas o codigo esta armando retrabalho futuro. |
| F-INT-005 | P2 | UI tokens | Contraste dos tokens principais esta bom, mas `success-foreground` branco falha para texto normal. | Medido: `success/white = 4.20:1`; token em `presets/default/tokens.css` | Se alguem usar `--success-foreground` em label normal, nao passa AA. Para badge forte, precisa foreground calculado/escuro ou uso restrito a texto large/icon. |
| F-INT-006 | P2 | Motion + Tokens | Motion tokens existem, mas o repo usa nomes e duracoes fragmentadas. | `--motion-fast`, `--duration-normal`, `--ease`, `--ease-out`, `--ease-standard`, duracoes inline `150ms/200ms/300ms` | A skill de motion pede especificacao por funcao observavel. Hoje cada componente decide easing/duracao sozinho. Isso impede polish coerente. |
| F-INT-007 | P2 | Motion + A11y | Reduced-motion e forte no CSS global, mas componentes injetados nao sao autocontidos. | `Button.jsx:35-42`, `Spinner.jsx:15`, `Dialog.jsx:66-75`, `Drawer.jsx:58-70` | Se o componente for consumido sem `colors_and_type.css`, ele perde fallback. DS bom nao depende de contexto invisivel para acessibilidade basica. |
| F-INT-008 | P2 | UI + Code | Sombras hardcoded `rgb(0 0 0 / ...)` continuam em componentes. | `Combobox.jsx`, `UserMenu.jsx`, `Tabs.jsx`, `Sidebar.jsx`, `Dialog.jsx`, `Popover.jsx`, `Toast.jsx`, `Slider.jsx` | O proprio DS critica sombra generica. Se a biblioteca exporta sombras genericas, o discurso e a implementacao entram em conflito. |
| F-INT-009 | P2 | UX | O showcase comunica bem a filosofia, mas algumas demos sao "teatro visual" sem contrato real. | Anti-patterns usa `mock-btn-ds`; templates usam iframes reais, mas botoes/links de entrada usam CSS proprio | A narrativa fica forte, mas a confianca tecnica cai quando o exemplo bonito nao usa o mesmo componente que o produto usaria. |
| F-INT-010 | P2 | Responsividade | Ha muitos grids 2 colunas e larguras fixas protegidos parcialmente por media queries, mas nao ha teste automatizado de viewport. | `forms.html`, `auth.html`, `index.html`; browser atual so validou desktop | Nao vi overflow gritante no desktop, mas falta garantia sistematica para 390px/768px/1440px. |
| F-INT-011 | P3 | Cleanup | CSS morto de `sticky-cta` e `nav-cta-mini` permanece apos mudancas. | `showcase/index.html:23`, `auth/base/...:22` | Baixo risco visual, alto ruido para proximas auditorias. |
| F-INT-012 | P3 | React/runtime | Showcase ainda usa React dev + Babel standalone em runtime. | `package.json` declara browserslist, mas paginas carregam `react.development.js` e `@babel/standalone` | Aceitavel para demo local. Se isso for virar site publico, precisa build estatico/producao. |
| F-INT-013 | P1 | UX + A11y + Auth | O showcase de Auth troca telas por `opacity:0`/`pointer-events:none`, mas mantem todas as variantes no DOM acessivel. | `ui_kits/default/showcase/auth.html:31-39`, `:122-136`; teste browser: `innerText` contem Login, Register, Forgot, Reset e Confirm em todas as tabs | `pointer-events:none` nao remove foco nem semantica. Leitor de tela/teclado pode encontrar controles invisiveis. A demo tambem mascara bugs de layout porque todas as telas existem ao mesmo tempo. |
| F-INT-014 | P1 | UX + Component | `ConfirmEmailScreen` quebra o contrato visual do Auth: nao usa split-panel 50/50 como Login/Register/Forgot/Reset. | `ConfirmEmailScreen.jsx:27-54` vs `LoginScreen.jsx:17-80`; `auth.html` promete "Telas full-bleed split-panel" | A pagina Auth vende uma familia de telas, mas uma das variantes vira card central. Isso e inconsistencia estrutural, nao preferencia estetica. |
| F-INT-015 | P2 | UI + Component + Motion | O card flutuante `Artemis` do hero e um mock manual ruim e nao bate com o Sidebar real/template. | `ui_kits/default/showcase/index.html:1075`, `:1091-1096`, `:1507-1513`; imagem reportada pelo Patrick | Parece torto, infantil e desconectado do template real. O lado "anti-AI" do hero deveria usar um mini-sidebar derivado do componente/contrato real, ou ser removido. |
| F-INT-016 | P1 | A11y + Navigation | Sidebar colapsada perde nomes acessiveis dos itens de navegacao. | Browser: apos clicar `Toggle sidebar`, DOM exposto mostra so `Toggle sidebar` e `Menu de Nome Sobrenome`; `Sidebar.jsx` renderiza label apenas quando `!collapsed` e nao adiciona `aria-label` em `SidebarItem`. | Icon-only nav precisa nome acessivel. Colapsar sidebar nao pode transformar Dashboard/Romaneios/etc. em botoes sem nome. |
| F-INT-017 | P2 | Showcase + Component state | Exemplo de `Tag` removivel nao remove nada. | `display.html` passa `<Tag onRemove={() => {}}>removível</Tag>`; teste browser: clicar `Remove tag` mantem o botao/tag no DOM. | Showcase de componente interativo precisa demonstrar estado real. Do jeito atual, ensina contrato errado: parece removivel, mas nao muda. |
| F-INT-018 | P1 | UX + Conversion | Falta CTA forte no header/primeira dobra para abrir templates/demos. | Home atual deixa `Ver template completo` dentro do carousel em `index.html:1953`; nav nao tem CTA primario. | O showcase vende templates interativos, mas a acao principal fica longe e pouco chamativa. Primeiro viewport precisa reduzir friccao. |
| F-INT-019 | P1 | Visual QA + Component | Sidebar do template colapsado esta pior que o exemplo de categoria/screens: icones soltos, logo torto, avatar comprimido, sem labels acessiveis. | Screenshot reportado; `Sidebar.jsx` colapsado usa icon-only sem label e logo/mark em container proprio; screens/category preview parece mais alinhado visualmente. | Nao basta o componente existir: o estado colapsado real usado pelos templates precisa ser o melhor exemplo, nao o pior. |
| F-INT-020 | P2 | Visual QA | Focus ring do Accordion aparece exagerado/duplo e briga com o layout. | Screenshot do `data.html`: item focado recebe outline teal grande + box interno. | Focus precisa ser visivel, mas nao pode parecer bug visual. Ajustar ring token/offset para estado focado em accordion/list rows. |
| F-INT-021 | P2 | Visual QA + Screens | `screens.html` tem preview do Token Editor grande e sem framing suficiente; tabs e preview parecem pagina administrativa solta, nao showcase polido. | Screenshots de `screens.html` basico/avancado e Empty Dashboard. | A pagina Screens deveria vender telas compostas; hoje algumas variantes parecem jogadas no canvas, com hierarquia fraca e espacamento grande demais. |

## 3.1 Matriz de QA interativo executado

| Area | Interacoes testadas no browser | Resultado |
|---|---|---|
| Home nav | Abrir dropdown Categorias | Abre. Fechamento por Escape precisa teste manual extra porque o wrapper do browser limitou keypress global. |
| Home carousel | Clique em proximo/anterior apos navegar para `#templates` | Clique executa sem crash; DOM contem todos os slides, entao validacao visual precisa screenshot/viewport. |
| Home token editor | Tabs Basico/Avancado, Reset, Exportar CSS, copiar token | Sem crash; copy mostra feedback textual/icone. Validacao visual de modal/toast de export ainda pendente. |
| Como usar | Tabs Lovable/React/HTML standalone | Trocam sem crash. |
| Auth | 5 tabs, forgot submit, reset initial disabled | Bug real: todas as telas seguem no DOM acessivel em todas as tabs. Forgot success funciona. |
| Base | Botoes variants/sizes/icon-only | Icon-only Search tem nome acessivel. Variants nao tem acao, servem como amostra visual. |
| Forms | NumberField steppers | Clique executa; body text nao reflete valor de input, entao validacao visual/DOM de input value ainda precisa abordagem com evaluate ou manual. |
| Data | Accordion single, ToggleGroup single/multiple | Funcionam; falso negativo inicial veio de seletor ruim. |
| Display | Remove tag, toasts Default/Success/Destructive | Toasts funcionam. Remove tag nao remove porque callback e no-op. |
| Layout | AppLayout nav buttons | Troca sem crash. |
| Navigation | Pagination, Sidebar collapse, UserMenu | UserMenu abre. Pagination muda estado. Sidebar collapse revela bug de nomes acessiveis. |
| Screens | Token editor reset/export, picker visual | Reset/export sem crash. Picker precisa QA visual por screen porque varias telas sao grandes. |
| Surfaces | Action/PDF/Cancelar/Confirmar | Cliques sem crash; botoes sao demonstrativos. |
| Demos | Operacao login, CRM pipeline/card drawer, Wiki lista/card | CRM/Wiki funcionam no mouse. Cards seguem com problema de contrato teclado ja coberto por F-INT-002. |

## 4. Conflitos entre lentes

1. **Motion bonito vs acessibilidade**
   - Hero e floating cards tem personalidade.
   - Mas loop/pulse so deve existir quando paga aluguel e deve ser autocontido com `prefers-reduced-motion`.
   - Decisao: manter motion expressivo, mas tokenizar e limitar por papel.

2. **Originalidade visual vs contrato de componente**
   - O repo quer fugir de shadcn default.
   - Isso nao autoriza cada pagina a reinventar botao/card/tab.
   - Decisao: preservar identidade no token/variant/motion, nao em CSS paralelo.

3. **Showcase teatral vs DS confiavel**
   - Anti-pattern examples sao bons como storytelling.
   - Mas o lado "nosso DS" deve usar ou espelhar o contrato real, senao a demo vira propaganda falsa.
   - Decisao: exemplos ruins podem ser mockados; exemplos bons devem consumir componentes reais ou uma spec derivada deles.

4. **App demo autocontido vs reuse**
   - `ui_kits/default/index.html` e pratico como arquivo unico.
   - Mas ele e o maior vetor de drift.
   - Decisao: separar "bundle standalone" de "source canonical"; o standalone pode ser gerado, nao mantido manualmente.

## 5. Plano de correcao recomendado

### Wave 1 — Contrato de acao e componentes interativos

Objetivo: qualquer elemento com cara/comportamento de acao herda o contrato correto.

Escopo:

- Criar uma camada de classes/helpers canonicos para `button-like`:
  - `aa-btn`, `aa-btn--primary`, `aa-btn--accent`, `aa-btn--ghost`, `aa-btn--outline`, `aa-btn--icon`.
  - Mesmo token set do `Button.jsx`.
  - `:hover`, `:active`, `:focus-visible`, disabled, loading, reduced-motion.
- Atualizar:
  - `.mock-btn-ds`
  - `.slide-btn-primary`
  - `.slide-btn-ghost`
  - `.editor-btn`
  - `.btn` / `.btn-login` do app demo
- Trocar cards clicaveis do app demo por `Card` compartilhado ou aplicar exatamente o contrato de `Card.jsx`.
- Corrigir Auth showcase para renderizar/expôr apenas a variante ativa:
  - `hidden`/`aria-hidden`/`inert` nas inativas, ou render condicional com fade controlado.
  - preservar animacao sem deixar controles invisiveis no tab order.
- Alinhar `ConfirmEmailScreen` ao mesmo split-panel 50/50 das demais telas Auth, ou documentar explicitamente que ela e uma variante "token landing" fora da familia split.
- Substituir o `fc-side` do hero por mini-sidebar derivado do `Sidebar` real/template, sem perspectiva torta e sem estados visuais paralelos.
- Adicionar `aria-label` aos itens da Sidebar quando `collapsed=true`.
- Reprojetar estado colapsado real da Sidebar para ficar tao bom quanto o exemplo/preview: icones alinhados, logo sem tilt acidental, avatar/footer com proporcao correta, active state claro.
- Fazer o exemplo `Tag onRemove` ter estado real no showcase, removendo a tag ou trocando por demonstracao explicitamente estatica.
- Adicionar CTA primario no header ou primeira dobra:
  - opcoes aceitaveis: `Ver templates`, `Abrir demo`, `Explorar componentes`.
  - usar contrato `Button`/`aa-btn`, nao novo CSS paralelo.
  - manter nav limpa; CTA deve ser forte mas nao virar landing page generica.
- Ajustar focus ring do Accordion para foco visivel sem "caixa dupla" visual.

Aceite:

- Corrigir `Button.jsx` muda todos os botoes reais e button-like.
- Tab navega pelos cards clicaveis.
- Enter/Espaco ativam cards clicaveis.
- `mock-btn-ds` visualmente parece o mesmo sistema do Button, nao um CSS separado.
- Auth tabs mostram uma tela por vez para DOM acessivel e teclado.
- Todas as variantes Auth respeitam o mesmo contrato estrutural, salvo excecao documentada.
- Hero mini-sidebar bate com o template real ou sai do hero.
- Sidebar colapsada mantem nomes acessiveis para todos os itens.
- Sidebar colapsada real fica visualmente melhor ou igual ao exemplo de showcase.
- Todo exemplo "removivel" muda estado quando clicado.
- Primeira dobra tem CTA claro para template/demo e esse CTA segue o contrato de Button.
- Accordion focado parece intencional, nao bug de outline.

### Wave 2 — Remover duplicacao do showcase

Objetivo: uma fonte de verdade para nav, dropdown, progresso e shell.

Escopo:

- Remover `const Nav` morto das 10 paginas tecnicas.
- Remover scripts `Dropdown click-to-open` duplicados das paginas que ja usam `NavHeader`.
- Mover `nav-cta-mini` morto para fora ou deletar.
- Se progress bar/reveal forem padrao, extrair para helper compartilhado; se forem por pagina, documentar.

Aceite:

- `rg "const Nav = ({ current })" ui_kits/default/showcase` retorna 0.
- `rg "nav-cta-mini" ui_kits/default/showcase` retorna 0, salvo se o CTA existir de fato.
- Dropdown funciona em mouse, teclado, Escape e click fora.

### Wave 3 — Tokens de motion e shadow

Objetivo: polish original, mas previsivel.

Escopo:

- Normalizar tokens:
  - `--motion-instant`
  - `--motion-fast`
  - `--motion-normal`
  - `--motion-slow`
  - `--ease-state`
  - `--ease-enter`
  - `--ease-exit`
  - `--ease-emphasized`
- Mapear uso:
  - press: 80ms, transform only.
  - hover color: 120-150ms.
  - panel enter: 180-220ms.
  - showcase reveal: 500-600ms.
- Criar shadow tokens sem `rgb(0 0 0 / ...)` cru:
  - `--shadow-card`
  - `--shadow-popover`
  - `--shadow-dialog`
  - `--shadow-sidebar`

Aceite:

- `rg "transition:all|transition: all" ui_kits/default` retorna 0.
- Hardcoded `rgb(0 0 0 /` fica restrito a overlays/backdrops justificados ou some.
- Reduced-motion cobre CSS global e componentes autocontidos.

### Wave 4 — App demo como consumidor real

Objetivo: templates CRM/Wiki/Operacao deixam de ser fork visual do DS.

Escopo:

- Decidir arquitetura:
  - curto prazo: importar componentes compartilhados no `ui_kits/default/index.html`;
  - medio prazo: gerar standalone a partir de fonte modular.
- Substituir primitives locais:
  - `.btn` por `Button` ou classes canonicas.
  - `Skeleton` local por `components/display/Skeleton.jsx`.
  - `Dialog/Drawer` locais por componentes compartilhados.
  - `Checkbox` local por `components/base/Checkbox.jsx`.

Aceite:

- Nao existe componente local com mesmo nome/finalidade de componente compartilhado, salvo justificativa no codigo.
- Uma mudanca de token/componente afeta showcase e templates.

### Wave 5 — Responsividade e QA visual sistematico

Objetivo: parar de depender de olho no viewport atual.

Escopo:

- Checklist manual/browser:
  - 390x844
  - 768x1024
  - 1366x768
  - 1440x900
- Pages:
  - showcase home
  - base/forms/data/display/layout/navigation/screens/surfaces/auth
  - demos crm/wiki/operacao
- Verificar:
  - horizontal scroll
  - texto cortado
  - nav escondida intencionalmente
  - focus ring visivel
  - botao/action-like consistente

Aceite:

- Sem horizontal scroll acidental.
- Nenhum texto de botao/action-like estoura.
- Nenhum CTA perde contraste.

## 6. Ordem que eu executaria

1. Wave 1 primeiro. Sem isso, qualquer polish vai continuar vazando por componentes paralelos.
2. Wave 2 em seguida. Remove ruido e evita editar arquivo morto.
3. Wave 3 depois. Motion/shadow ficam melhores quando os alvos ja sao canonicos.
4. Wave 4 quando a biblioteca estiver estabilizada. E maior, mas fecha o gap real do repo.
5. Wave 5 como gate final antes de push.

## 7. Nao-fazer

- Nao copiar estilo de `animations.dev` nem de `composio.dev`.
- Nao trocar paleta central agora; o problema mais caro nao e cor.
- Nao adicionar nova biblioteca de animacao.
- Nao mexer em todos os arquivos de uma vez sem separar wave testavel.
- Nao aceitar "isso e so demo" para elementos do lado "nosso DS"; demo e justamente onde o contrato precisa ser exemplar.

## 8. Checklist final de aceite

- `Button.jsx` e as classes `button-like` compartilham tokens, estados e motion.
- Todo `div` clicavel tem role, tabIndex e teclado, ou vira `button/a`.
- `Card.jsx` e o padrao para card interativo.
- O app demo nao recria primitives ja existentes.
- NavHeader nao tem scripts legados competindo.
- Tokens de foreground passam AA nos pares usados.
- Motion tem reduced-motion local e global.
- Shadows genericas foram substituidas por tokens ou justificadas.
- Browser audit passa em desktop e mobile.

## 9. Status

Pronto para implementacao, mas eu nao implementei as waves neste arquivo. Ele e o plano consolidado para a proxima rodada.
