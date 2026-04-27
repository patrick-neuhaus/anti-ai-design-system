# Camada 1: Regras Estruturais Universais

Regras que se aplicam a qualquer projeto, independente de marca. **Não há flexibilidade aqui** — se viola uma dessas, o app vai parecer IA.

## Layout

- Page title é `<h2 className="text-xl font-semibold text-foreground">`. **NUNCA `<h1>`** em UI de app.
- Subtitle é `<p className="text-sm text-muted-foreground">`.
- Container vertical: `space-y-5` (não `space-y-4` nem `space-y-6`).
- Padding do shell vem do AppLayout (`p-6`). **NUNCA aninhar paddings** em filhos.
- Width: `max-w-*` decidido (não fluido com `container mx-auto`).

## Componentes

- **NUNCA** `<Card>/<CardHeader>/<CardContent>` do shadcn. Use sempre:
  ```tsx
  <div className="bg-card rounded-{XL} border border-border">
    <div className="px-5 py-3 border-b border-border">
      <h3 className="text-sm font-medium">Título</h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
  ```
- **NUNCA** `<table>` HTML em UI. Use grid CSS:
  ```tsx
  <div className="grid grid-cols-[...] gap-2 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
    {/* header */}
  </div>
  <div className="px-3 py-2 space-y-1">
    {/* rows como divs com mesmo grid */}
  </div>
  ```
  Exceção: `<table>` em conteúdo MDX/editorial é OK.
- Form fields:
  - Label: `<label className="text-xs text-muted-foreground">`
  - Spacing dentro do field: `space-y-1.5`
  - Spacing entre fields: `space-y-4`
  - Botões em form: `size="sm"`

## Tokens (estrutura, valores ficam em Camada 2)

- Foreground SEMPRE com hue (`H S% L%` com S > 0). **NUNCA** `0 0% X%`.
- Background SEMPRE com hue alinhado à mesma família (mesma faixa de H ± 30°).
- Font-family DEFINIDA explicitamente (`@import` ou Next/font) com fallback.
- Radius scale variável por componente (escala curta: 3-4 valores) OU zero deliberado em tudo.
- Spacing scale curta: 1, 1.5, 2, 4, 5, 6, 8 (evitar 3, 7).

## Comportamento

- Ícone só quando carrega informação que texto não carrega. Default = sem ícone.
  - OK: ícone em status badge (verde/vermelho), ação primária (botão "Salvar"), tipo de arquivo
  - NÃO: ícone em label de campo, nav item simples, botão secundário
- Dark mode: opcional por preset, NÃO um toggle default. Implementar só se há motivo claro.
- Animations: 150-300ms, função (não decoração). Evitar `transition-all duration-500+`.

## Hierarquia tipográfica

- Page title: `text-xl font-semibold` (h2)
- Section title (dentro de card): `text-sm font-medium` (h3)
- Body: `text-sm`
- Label: `text-xs text-muted-foreground`
- Caption/meta: `text-[10px] text-muted-foreground/70`
- **NÃO** usar `font-bold` (700). Use `font-semibold` (600) max.

## Cores semânticas

Toda paleta deve ter explicitamente definidos:
- `--foreground` e `--background` (com hue)
- `--card` e `--card-foreground`
- `--muted` e `--muted-foreground`
- `--border` (alinhado à temperatura)
- `--primary` e `--primary-foreground` (decisão Camada 2)
- `--accent` e `--accent-foreground` (decisão Camada 2)
- `--destructive` (para erros)
- Status: `--success`, `--warning`, `--error` (NÃO usar verde-neon ou vermelho puro)

## Anti-checklist

Antes de aceitar um PR/output do Lovable, verifica:
- [ ] Zero `<Card>`, `<CardHeader>`, `<CardContent>` no código novo
- [ ] Zero `<table>` em UI (só em conteúdo MDX é OK)
- [ ] Zero `<h1>` em página de app
- [ ] Zero `0 0% X%` em CSS variables
- [ ] Font-family declarada e importada
- [ ] Radius scale visível (3+ valores diferentes ou zero em tudo)
- [ ] Padding consistente (escala curta sendo respeitada)
- [ ] Ícones com propósito informacional (não decoração)

## Coerência estrutural + Identidade (verificação dupla)

As regras mecânicas acima cobrem a Camada 1 (sem Card, sem table, etc.). Mas mesmo passando em todas, o resultado pode AINDA parecer cara de IA. Por quê: existem 2 dimensões diferentes a verificar.

### Dimensão 1: Coerência técnica (`05-coherence-checklist.md`)
Pergunta: "isso está QUEBRADO?" — alinhamento, contraste, tokens consistentes, header line continuity, hover affordance, etc.
**Verificável por trident:** `anthropic-skills:trident --mode dir --target <path> --design` captura objetivamente os 10 padrões.

### Dimensão 2: Identidade / craft (`06-identity-gestures.md`)
Pergunta: "isso foi PENSADO?" — surface differentiation, active state com caráter, brand mark visual, sections agrupando nav, humanização do user, dimensões intencionais (não Tailwind defaults), micro-gestos.
**NÃO verificável por trident:** trident audita o que está lá, não o que está faltando. Inspeção humana ou comparação A/B (vs reference app polido) é necessária.

**Workflow obrigatório pós-refator de IA:**

1. Rode trident --design — passa nos 10 padrões de coerência? Se não, fix.
2. Aplica squint test + checklist 06 — pelo menos 5/7 gestos de identidade presentes? Se não, fix.
3. **Apenas depois das duas dimensões OK, abre preview pra validação visual humana.**

Inverter essa ordem custa retrabalho real:
- Wave 4 (skip trident, validar visual primeiro): 7 problemas técnicos perdidos
- Wave 6 (trident clean mas skip identity check): sidebar passou em coerência mas Patrick imediatamente sentiu "cara de IA padrão" — faltavam gestos de identidade.