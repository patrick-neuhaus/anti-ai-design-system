# Gestos de Identidade — Camada Crítica

> **Por que existe esse doc:** o `05-coherence-checklist.md` cobre **coerência técnica** (alinhamento, contraste, tokens consistentes). Mas coerência é o piso — não é o teto. Um app pode passar em todos os 10 testes do 05 e AINDA parecer cara de IA. O que falta nesse caso é **identidade**: gestos visuais que sinalizam "isso foi pensado, não gerado".
>
> Aprendizado da Wave 6 (2026-04-27): a sidebar do dwg-experiment v2 passou em coerência (trident 0 findings críticos no shell) mas Patrick imediatamente sentiu "cara de IA padrão". A diferença vs chocotracking não era técnica — era ausência de gestos de identidade.

---

## A diferença coerência vs identidade

**Coerência** (`05-coherence-checklist.md`) responde: "isso está QUEBRADO?"
- Linha quebra na junção?
- Hover sem contraste?
- Tokens inconsistentes?
- Header alinhado às cells?

**Identidade** (este doc) responde: "isso foi PENSADO?"
- Sidebar parece zona separada ou apenas tinted area do main?
- Active state tem caráter ou só muda bg?
- User aparece como pessoa ou como string de email?
- Larguras/alturas decididas ou Tailwind defaults?

Trident pega coerência. **Trident NÃO pega identidade** — é dimensão de presença/ausência de gestos, não de "isso aqui tá errado". Inspeção humana ainda é necessária pra essa dimensão.

---

## Os 7 gestos de identidade (Camada de Craft)

### 1. Surface differentiation

**Faça:** sidebar, header (se houver), main content e cards têm **cores claramente distintas** entre si. Cada superfície deve poder ser identificada de relance, sem precisar olhar conteúdo.

**Não faça:** sidebar com bg apenas levemente mais escuro/claro que main. Delta de luminosidade <5% = sidebar parece "main com tinte", não zona separada.

**Como verificar:**
- Squint test: feche os olhos parcialmente, olha a tela. Sidebar destaca como zona OU some no main?
- Métrica: delta de luminosidade entre `--sidebar-background` e `--background` deve ser ≥10% OU diferença de hue family (warm vs cool).

**Exemplo positivo:**
- chocotracking: sidebar `bg-primary` borgonha (`338 55% 23%`) vs main creme (`30 33% 96%`). Delta extremo, hue families opostas. Drama imediato.
- Vercel/Linear dashboards: sidebar quase preta vs main pure white. Drama via luminosidade.

**Exemplo negativo (o erro):**
- dwg v2: sidebar `222 15% 97%` vs main `222 15% 99%`. Delta 2%. Sidebar invisível como zona.

---

### 2. Active state com caráter

**Faça:** o item de nav ativo tem um **gesto visual identificável** além de mudança de background. Pode ser:
- Barra vertical à esquerda (`absolute left-0 w-1 h-5 bg-accent`)
- Dot no início (`[●] Item`)
- Border-l grosso (`border-l-2 border-accent`)
- Indent diferente
- Cor do texto + peso

**Não faça:** active state só com `bg-accent + font-medium`. Esse é o padrão default de QUALQUER dashboard shadcn — invisível como decisão.

**Como verificar:**
- Olhe o item ativo. Você consegue descrever o gesto em 5 palavras? ("barra dourada à esquerda", "dot mono no início", etc.) Se a resposta for "fundo um pouco diferente", falta gesto.

**Exemplo positivo:**
- chocotracking: `<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />` quando ativo. Barra dourada vertical. Identificável instantaneamente.

**Exemplo negativo:**
- dwg v2: `activeClassName="bg-accent text-foreground font-medium"`. Genérico.

---

### 3. Brand mark visual (não só texto)

**Faça:** o brand mark do app na sidebar/header deve ter **componente visual** além de texto puro. Pode ser:
- Logo SVG/PNG da marca
- Letra inicial em caixa colorida
- Símbolo proprietário
- Tipografia distinta do resto (ex: serif num app sans, ou mono accent num app sans)

**Não faça:** brand como `<h1 className="text-sm font-semibold">App Name</h1>`. Genérico — qualquer dashboard tem isso.

**Como verificar:**
- Tampe o nome do app no brand. Sobra alguma identidade visual? Se a resposta é "só vejo um texto bold pequeno", falta gesto.

**Exemplo positivo:**
- chocotracking: `<BarryCallebautLogo />` — SVG do logo. Pra collapsed: ícone proprietário em caixa branca.

**Exemplo negativo:**
- dwg v2: `<h1 className="text-sm font-semibold">Supply MEP</h1>`. Texto puro.

**Solução low-cost (sem logo da marca):** caixa colorida com inicial + nome em mono. Ex:
```tsx
<div className="flex items-center gap-2">
  <span className="size-7 bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold">SM</span>
  <h1 className="text-sm font-semibold">Supply MEP</h1>
</div>
```

---

### 4. Hierarquia em listas longas (sections)

**Faça:** quando nav tem 6+ items, agrupe em sections com label. Isso é hierarquia visível.

**Não faça:** lista plana de 8+ items sem agrupamento. Vira soup de links.

**Como verificar:**
- Conte items na nav. Se >6, deveria ter section labels separando.
- Section labels com peso/case próprio: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60` ou similar.

**Exemplo positivo:**
- chocotracking: 3 sections (Operação, Cadastros, Administração) com 3-6 items cada.

**Quando NÃO aplicar:** nav com 4-5 items pode ficar plana. Sections com 1 item cada é overkill.

---

### 5. Humanização do user

**Faça:** mostre o user como pessoa, não como string. Avatar (foto/inicial em círculo), nome (não só email), cargo se relevante.

**Não faça:** `<span className="text-xs text-muted-foreground truncate">user@email.com</span>`. Genérico.

**Como verificar:**
- O user tem representação visual? Inicial em círculo, foto, ou só texto?
- O nome aparece OU só email?

**Exemplo positivo:**
- chocotracking: avatar circular com inicial em cor de marca (`bg-accent/20 rounded-full`) + nome + username. User panel destacado em `rounded-2xl bg-sidebar-accent`.

**Exemplo negativo:**
- dwg v2: só email truncado em texto pequeno. Sem avatar, sem nome.

**Solução low-cost:**
```tsx
<div className="flex items-center gap-2">
  <span className="size-8 rounded-full bg-info/20 text-info flex items-center justify-center font-mono text-xs font-semibold">
    {user.email[0].toUpperCase()}
  </span>
  <div className="flex-1 min-w-0">
    <p className="text-xs font-medium truncate">{user.name || user.email.split('@')[0]}</p>
    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
  </div>
</div>
```

---

### 6. Dimensões intencionais (não Tailwind defaults)

**Faça:** larguras/alturas/spacings que NÃO são exatamente os defaults do Tailwind. Ex: `w-[268px]` em vez de `w-64` (256px) ou `w-72` (288px). `h-[68px]` em vez de `h-16` ou `h-20`.

**Não faça:** `w-60`, `h-12`, `gap-4` em TUDO. É o sinal mais claro de "usei o que veio com a ferramenta".

**Como verificar:**
- Sidebar/header/cards principais têm pelo menos UMA dimensão arbitrária (`-[Xpx]` ou `-[Xrem]`)?
- Se todas as dimensões são default-tailwind exato, falta gesto.

**Exemplo positivo:**
- chocotracking: sidebar `w-[272px]` collapsed `w-[72px]`, brand block `h-[72px]`, section gap `space-y-3`. Decisões deliberadas.

**Exemplo negativo:**
- dwg v2: `w-60` `w-12` `h-14` `h-12` `h-9` — todos defaults Tailwind exatos.

**Quando aceitar default:** spacing menor (gap-2, p-3) pode usar default — micro-decisões. O que precisa ser intencional é dimensão de **bloco** (sidebar width, header height, brand block height).

---

### 7. Micro-gestos (1-3 detalhes que sinalizam craft)

**Faça:** adicione 1-3 micro-decisões visíveis que mostram pensamento:
- Custom scrollbar (`[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-foreground/20`)
- Toggle button flutuante na borda (`absolute -right-3` em vez de inline)
- Badge mono com count (`<span className="font-mono text-info">{count}</span>`)
- Separator com texto pequeno entre seções
- Animação custom no hover (em vez de transition-colors padrão)

**Não faça:** ignorar todos os detalhes. UI sem micro-gestos parece "feita com pressa".

**Como verificar:**
- Você consegue apontar 2 detalhes únicos no shell que NÃO são default? Se não, falta micro-gestos.

**Exemplo positivo:**
- chocotracking: toggle collapse como botão circular flutuante na borda direita da sidebar (`absolute -right-3 w-6 h-6 rounded-full bg-card border shadow-sm`). Detalhe que assina.

---

## Workflow obrigatório

Após passar no `05-coherence-checklist.md` (trident clean), aplique este checklist como camada 2:

```
1. Trident --design clean? OK pra step 2.
2. Squint test no shell — sidebar é zona ou tint?
3. Active state tem gesto identificável em 5 palavras?
4. Brand tem componente visual além de texto?
5. Nav tem >6 items E está plana? Adicione sections.
6. User aparece como pessoa? Adicione avatar/nome.
7. Pelo menos 1 dimensão arbitrária (`-[Xpx]`) em block-level?
8. Pelo menos 2 micro-gestos identificáveis?
```

Se 5+ destes 7 falham, o resultado vai parecer cara de IA mesmo passando em coerência.

---

## O que este doc NÃO cobre

- **Filosofia da marca** (warm vs cool, sério vs leve) — isso é Camada 2 do design system, decisão por preset.
- **Conteúdo / copy** — usar `copy` skill ou revisão humana.
- **UX flows** — usar `ux-audit`.

---

## Manutenção

Adicionar gesto novo só quando:
- Identificado em comparação A/B real (app que parece bom vs app que parece cara de IA)
- Pattern recorrente em 3+ apps polidos (Linear, Vercel, Stripe, openstatus, etc.)

Última revisão: 2026-04-27 (criado, Wave 6).