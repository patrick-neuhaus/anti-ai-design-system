# Pattern Extraction — Research Wave 1

**Data:** 2026-04-26
**Refs analisadas:**
- `openstatusHQ/openstatus` (apps/web/src) — clonado parcial via degit
- `chocotracking/.lovable/memory/design/` — repo local do Patrick (referência positiva)
- `dwg-insight-ext/src/index.css` — repo local (referência negativa, "cara de IA")

---

## Filosofia

Apps gerados por IA têm cara genérica não por causa de cor — por causa de **decisões estruturais conservadoras**: usam o default do shadcn em tudo, `<Card>` empilhado, `<table>` HTML, hierarquia previsível, fonte system, radius uniforme, ícone em cada coisa. O resultado é tecnicamente funcional mas sem opinião.

Apps com identidade visível **violam intencionalmente** essas defaults. Não porque são contrários por capricho — porque cada decisão é uma escolha consciente de comunicar algo.

OpenStatus (technical/brutal) e Chocotracking (warm/editorial) são vibes opostas, mas compartilham o mesmo princípio: **rejeitam defaults da IA e codificam regras explícitas no projeto**.

---

## Os 10 padrões estruturais universais (Camada 1)

### 1. Card soup eliminado
**AI default:** `<Card><CardHeader><CardTitle/></CardHeader><CardContent/></Card>` em tudo. Mesmo padding, mesma sombra, mesma borda em cada bloco da tela.

**Anti-AI:**
- chocotracking: `bg-card rounded-2xl border border-border` (classes manuais, controle total)
- openstatus: nem isso — borders criados por `grid gap-px` com `bg-border` no parent

**Regra:** NUNCA usar `<Card>/<CardHeader>/<CardContent>` do shadcn. Sempre classes manuais ou estrutura grid.

---

### 2. Sem tabelas HTML
**AI default:** `<table><thead><tr><th>` para qualquer lista de dados.

**Anti-AI:**
- chocotracking: grid CSS — `grid grid-cols-[...] gap-2 px-5 py-3` para header row, `grid grid-cols-[...] gap-2 items-center px-2 h-[48px] rounded-xl hover:bg-muted/50` para data rows
- openstatus: `<table>` apenas em prose/MDX content (legítimo). Em UI: grid-based.

**Regra:** UI tables = grid CSS. `<table>` HTML só pra conteúdo editorial/MDX.

---

### 3. Sem H1
**AI default:** `<h1>Page Title</h1>` no topo de toda página.

**Anti-AI:**
- chocotracking: explicitamente proibido `h1`. Page title = `h2 text-xl font-semibold`.
- openstatus: prose H1 só em conteúdo. UI usa hierarquia menor.

**Regra:** Page title = `h2`. H1 reservado para landing/marketing apenas.

---

### 4. Foreground com temperatura
**AI default:** `foreground: 0 0% 0%` (preto puro), `background: 0 0% 100%` (branco puro). Sem temperatura, sem caráter.

**Anti-AI:**
- chocotracking: `foreground: 16 38% 12%` (marrom escuro com hue)
- openstatus: usa `text-foreground` derivado de tokens com hue específico
- dwg (cara de IA): `foreground: 222 47% 11%` (azul escuro genérico)

**Regra:** Foreground SEMPRE com hue (mesmo que sutil). Nunca `0 0% X%`.

---

### 5. Background com temperatura
**AI default:** `background: 0 0% 100%` ou `210 20% 96%` (branco/azul-cinza frio).

**Anti-AI:**
- chocotracking: `background: 30 33% 96%` (creme quente)
- openstatus: usa CSS vars com identidade própria

**Regra:** Background com hue alinhado à mesma família de temperatura do foreground. Toda a paleta compartilha temperatura.

---

### 6. Tipografia explícita (não system font)
**AI default:** sem `font-family` definido = system font stack. Resultado: cada SO mostra fonte diferente.

**Anti-AI:**
- chocotracking: Poppins (importada via @fontsource)
- openstatus: Inter + CalSans (Next.js Google Fonts + LocalFont)

**Regra:** SEMPRE definir uma fonte explícita. Mínimo 1 font-family declarada e importada.

---

### 7. Hierarquia de container deliberada
**AI default:** `<div className="container mx-auto p-8">` em tudo. Largura fluida, padding genérico.

**Anti-AI:**
- chocotracking: `space-y-5` (gap vertical), AppLayout fornece `p-6` do container, sem nesting de paddings
- openstatus: `max-w-5xl flex flex-col gap-4` — largura fixa, gap deliberado, sem container Tailwind

**Regra:** Container com largura DECIDIDA (não fluida). Gap entre seções DECIDIDO (não default). Nunca aninhar paddings.

---

### 8. Spacing scale com religião
**AI default:** `p-2 p-3 p-4 p-6 p-8` — varia conforme conveniência.

**Anti-AI:**
- chocotracking: `space-y-1.5` (campos), `space-y-4` (entre campos), `space-y-5` (container) — escala fixa, deliberada
- openstatus: `p-4` em TUDO (1rem) + `gap-px` (border) + `gap-1/gap-2` (componentes) — religião do p-4

**Regra:** Definir escala de spacing curta (3-5 valores) e usar religiosamente. Não improvisar.

---

### 9. Ícone com propósito, não decoração
**AI default:** `<Button><PlusIcon/> Add</Button>`, `<Label><InfoIcon/> Field</Label>` — ícone Lucide em CADA elemento.

**Anti-AI:**
- chocotracking: ícones em ações (botões primários) e status badges. Não em labels, navs, cards.
- openstatus: text-first total — `[copy]`, `[light]`, `▲` Unicode no lugar de chevron-icon

**Regra:** Ícone só quando carrega informação que texto não carrega. Default = sem ícone.

---

### 10. Radius decidido (não default 0.5rem)
**AI default:** `--radius: 0.5rem` em tudo — botão, card, input, badge.

**Anti-AI:**
- chocotracking: `rounded-2xl` (cards), `rounded-xl` (rows), `rounded-lg` (botões) — escala variável
- openstatus: `rounded-none` em UI inteira (decisão brutalista deliberada)

**Regra:** Definir escala de radius por componente OU adotar zero (`rounded-none`) como decisão. Nunca o default sem pensar.

---

## Decisões que vão pra Camada 2 (preset)

Padrões onde **a vibe muda mas a regra de ter uma decisão explícita não muda**:

| Decisão | warm-editorial (choco) | minimalist-tech (openstatus) | data-dense (a definir) |
|---------|------------------------|------------------------------|------------------------|
| Família de fonte | Poppins | Inter + CalSans | Inter Tight ou Geist Mono |
| Radius scale | rounded-lg/xl/2xl | rounded-none | rounded-md/sm |
| Cor primary | borgonha (338 55% 23%) | preto/cinza neutro | cinza-azul corporate |
| Cor accent | dourado (33 47% 53%) | semantic only (green/red/yellow/blue 700) | um único accent |
| Hierarquia visual | shadow + radius | border + gap-px | border + zebra rows |
| Text style | título serif, body sans | tudo mono ou Inter | sans tight, números mono |
| Densidade | média (h-[48px] rows) | baixa (p-4 generoso) | alta (rows compactas) |
| Filosofia ícones | ações + status | quase nenhum (Unicode) | numérico-first |

---

## Anti-patterns observados em apps com cara de IA

(referência: dwg-insight-ext, dashboards genéricos do Lovable/v0/Cursor sem custom)

1. `--primary: 213 94% 48%` — azul SaaS-padrão
2. `--background: 0 0% 100%` — branco puro
3. `--foreground: 222 47% 11%` — azul-escuro genérico
4. Sem font-family explícita
5. Sem `.lovable/memory/` ou equivalente
6. `<Card>` em tudo
7. `<table>` HTML
8. Lucide icons em cada botão/label
9. Gradientes purple→blue em hero
10. Dark mode toggle como feature default (mesmo sem necessidade)

---

## Estrutura de arquivos do projeto-alvo

Para um projeto Lovable não parecer IA, ele precisa de NO MÍNIMO:
1. `src/index.css` com CSS variables que violem TODOS os 10 anti-patterns acima
2. `tailwind.config.ts` com font-family explícita + radius scale própria
3. `.lovable/memory/design/page-layout.md` com regras estruturais (formato choco)
4. `.lovable/memory/design/tokens.md` com semântica dos tokens
5. `.lovable/memory/design/components.md` com regras de composição (no Card soup, etc.)

Se faltar 1 desses 5, o Lovable vai voltar pro default em algum lugar.

---

## Próximos passos (Wave 2)

Com esses 10 padrões + tabela de presets, Wave 2 vai:
1. Escrever `docs/01-anti-patterns.md` com exemplos antes/depois de cada anti-padrão
2. Escrever `docs/02-structural-rules.md` com Camada 1 formal (regras nomeadas, copy-pasteable)
3. Escrever `docs/03-token-system.md` com sistema de tokens semânticos sem cor
4. Definir CSS variables base de cada um dos 3 presets (apenas as decisões — código vem em Wave 3)