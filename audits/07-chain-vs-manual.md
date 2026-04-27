# 07 — Chain vs Manual: Validação

> Comparação entre o audit manual (audits/01-03) e o output do chain de skills (audits/05-06). Determina se a chain `code-dedup-scanner → component-architect → ui-design-system` substitui ou complementa o audit manual.

## Setup
- **Manual:** `audits/01-choco-baseline.md`, `02-dwg-current.md`, `03-deltas.md` (esta sessão)
- **Chain:** `audits/05-choco-chain-report.md`, `06-dwg-chain-report.md`

---

## Tabela de cobertura — 8 deltas do manual vs chain

| # | Delta manual | Chain pegou? | Skill que pegou | Citação da chain |
|---|--------------|--------------|------------------|------------------|
| 1 | `table.tsx` defaults assimétricos (px-0 pr-4 text-center em dwg vs px-4 text-left em choco) | **NO** | — | Chain registra "Table: 6 imports (shadcn Table component)" mas não inspeciona o arquivo `table.tsx` em si. Cada execução é intra-repo, então não compara as duas versões do shadcn override. |
| 2 | Tabela duplicada 5x em dwg, 2x em choco | **YES** | code-dedup-scanner | Choco: "DeliveriesTable & RomaneiosTable — EXTRACT 🔄... 95% identical table logic". Dwg: "6 Table pages...all repeat: `<Table><TableHeader><TableRow>{columns.map}...`". Pegou em ambos. |
| 3 | Action column inconsistente (justify-end vs justify-center vs text-right) | **NO** | — | Nenhuma das 3 skills inspeciona alinhamento de coluna específica. Chain reconhece duplicação, não nuance visual. |
| 4 | NavLink shared órfão em choco | **NO** | — | code-dedup-scanner lista NavLink em "Custom UI Components" mas não detecta que é dead code (sem cross-reference de imports vs definitions). |
| 5 | StatusBadge shared vs config inline | **PARCIAL** | code-dedup-scanner | Choco: "Match 1: StatusBadge — REUSE ✅" pegou. Dwg: "Match 4: Badge/Status Badges — EXTEND" pegou conceito mas pra ProcessingQueuePanel/JobCard, NÃO pra `STATUS_CONFIG` em ProjectsPage que o manual achou. |
| 6 | Page header inconsistente (h1/h2/font-display/ícone-inline mistos) | **NO** | — | Headers não são tratados como "componentes" nem "tokens" — caem em zona cinza que nenhuma das 3 skills mira. |
| 7 | Tokens extras (par bg+fg estilo choco vs cor única dwg) | **PARCIAL** | ui-design-system | Choco: capturou `--status-pending-bg`, `--status-success-bg/fg`, etc. Dwg: capturou que só tem `--success/warning/info`. Mas chain NÃO comparou lado a lado pra concluir "choco tem par, dwg só tem cor única" — só listou independentemente. |
| 8 | Lovable memory split (preset vs index.md projeto) | **NO** | — | `.lovable/memory/` não é UI/component/token. Fora do escopo das 3 skills. |

**Cobertura total:** **1/8 pegos completamente, 2/8 parciais, 5/8 não pegos.**

Score efetivo: **~25-30%** dos deltas críticos do design system foram capturados pela chain.

---

## Achados extras da chain (que o manual perdeu)

A chain encontrou findings reais que o audit manual não cobriu:

| # | Finding | Skill | Severity | Vale incorporar? |
|---|---------|-------|----------|------------------|
| E1 | **Choco SystemSettingsPage (690 linhas)** — God Component multi-domain | component-architect | Alta | Não no design system core (é problema de arquitetura do projeto, não regra universal). Documentar em "anti-patterns gerais". |
| E2 | **Choco DashboardFilters + RomaneioFilters** — duplicação de filter pattern | code-dedup-scanner | Média | Sim — adicionar `<FilterPanel />` à lista de "componentes recorrentes que merecem extração" em `07-component-patterns.md`. |
| E3 | **Choco ImportStepX** — multi-step form pattern sem wrapper | code-dedup-scanner | Baixa | Talvez — `<FormStepper />` é abstração comum, mas só vale extrair se 2+ apps tiverem multi-step. |
| E4 | **Dwg ProcessingQueuePanel (888 linhas), PdfRegionSelector (690), pages 40-80K** — God Components | component-architect | Alta | Não no design system (problema do projeto). Vale como exemplo do que NÃO fazer. |
| E5 | **Dwg sidebar-primary + sidebar-accent ambos `184 80% 25%`** — token redundante | ui-design-system | Média | Sim — fixar diretamente em `presets/warm-editorial/tokens.css`. Achado limpo e acionável. |
| E6 | **Dwg 5 foreground tokens = white** — redundância | ui-design-system | Baixa | Sim — consolidar em `--on-dark` ou similar. Limpa CSS. |
| E7 | **Falta de dark mode em ambos**, typography scale, shadow system, hover/focus | ui-design-system | Média | Já parcial em manual (delta 7), chain detalhou melhor. Vale referenciar em `03-token-system.md`. |
| E8 | **Choco custom Tailwind classes `bg-[hsl(var(--token))]`** — usar Tailwind config pra expor tokens como utilities | ui-design-system | Baixa | Vale como nota de DX — adicionar `theme.extend.colors` no Tailwind config. |

**8 achados extras válidos.** A chain claramente vê coisas que eu não vi.

---

## Achados do manual que a chain perdeu

| Delta # | Por que chain provavelmente perdeu |
|---------|-------------------------------------|
| 1 (table.tsx defaults) | Cada skill roda intra-repo. Não há comparação cross-repo de arquivos correspondentes. |
| 3 (action column align) | Nuance visual/alinhamento — nenhuma skill mira layout específico. |
| 4 (NavLink órfão) | Falta dead-code detection — exigiria grep de imports vs definitions. |
| 6 (page header) | Headers não são "componentes" no sentido de shadcn — caem fora de framing. |
| 8 (lovable memory) | Convenção de configuração, não código UI — fora do escopo. |

**Pattern claro:** chain é forte em **scan intra-repo** e **detecção de duplicação**. Chain é fraca em **comparação cross-repo**, **dead-code**, **nuances de alinhamento**, e **convenções fora de componentes**.

---

## Conclusão

**Caso atingido nesta execução: C (híbrido).**

Argumento:
- Chain cobriu **1/8 completamente + 2/8 parciais = ~30% efetivo** dos deltas que o audit manual achou.
- Chain encontrou **8 achados extras válidos** que o manual perdeu (especialmente god components e token redundancies).
- A força da chain está em **dedup, god component detection, token captura intra-repo**.
- A fraqueza da chain está em **comparação cross-repo** — que é exatamente o trabalho que o manual fez bem (delta 1, 7) e que faz toda a diferença pra um design system.

Não é Caso A (chain suficiente) — perdeu 5 deltas críticos.
Não é Caso B (chain inútil) — achou 8 findings extras.

**É Caso C: complementar.**

### Recomendação para Phase E

A chain de 3 skills existentes é útil pra **dedup intra-repo + god components + token captura**. O gap principal é **comparação cross-repo**, que nenhuma das 3 skills cobre.

Em vez de criar uma skill nova multi-agente que reimplementa as 3 + adiciona comparação:

**Opção 1 (mínima):** criar **só** uma skill nova `cross-repo-compare` (1 agente) que:
- Recebe 2 codebases
- Roda intra-repo audits básicos em ambos (chama as 3 skills existentes via maestro?)
- Compara findings lado a lado
- Identifica deltas estruturais

Vantagem: reusa skills existentes, adiciona **só** o pedaço que falta. Não duplica.

**Opção 2 (trident-style multi-agente):** criar `design-system-audit` skill com 3 sub-agentes:
- Agente 1: dedup-scanner intra-repo (re-implementa code-dedup-scanner internamente)
- Agente 2: comparison cross-repo (novo)
- Agente 3: synthesis + delta generation (novo)

Vantagem: skill autônoma, focada 100% em design system. Não depende de 3 skills externas.
Desvantagem: duplica funcionalidade de skills existentes.

**Recomendação prática:** **Opção 1**. Princípio IL-7: skill nova só quando algo realmente não existe. O que falta é **só** comparação cross-repo. Construir uma skill enxuta pra isso, e documentar a chain `code-dedup-scanner → component-architect → ui-design-system → cross-repo-compare` em `references/composition-chains.md` do maestro.

A skill `cross-repo-compare` poderia ter modos:
- `--inventory` (lista componentes/tokens dos 2 repos lado a lado)
- `--deltas` (gera tabela de deltas estilo `audits/03-deltas.md`)
- `--decisions` (template pra Patrick preencher canon=A/canon=B/canon=novo)

Custo de implementação: baixo (~1 SKILL.md de 100-200 linhas + scanning-strategies de comparação).
