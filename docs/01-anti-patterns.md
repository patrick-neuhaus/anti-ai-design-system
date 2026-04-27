# Anti-Patterns: o que faz parecer IA

10 padrões que IA generators (Lovable, v0, Cursor) usam como default. Codifique seu projeto pra evitá-los todos.

---

## 1. Card soup

**AI default:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Stats</CardTitle>
  </CardHeader>
  <CardContent>{...}</CardContent>
</Card>
```
Cada bloco da tela usa o mesmo padrão de Card, criando monotonia visual.

**Anti-AI:**
```tsx
<div className="bg-card rounded-2xl border border-border">
  <div className="px-5 py-3 border-b border-border">
    <h3 className="text-sm font-medium">Stats</h3>
  </div>
  <div className="px-5 py-4">{...}</div>
</div>
```

**Por quê:** Classes manuais permitem variar padding/radius/borda por contexto. Card empacota tudo no mesmo padrão — sinal claro de geração automática.

---

## 2. Tabela HTML em UI

**AI default:**
```tsx
<table>
  <thead><tr><th>Nome</th><th>Status</th></tr></thead>
  <tbody>{rows.map(r => <tr key={r.id}>...</tr>)}</tbody>
</table>
```

**Anti-AI:**
```tsx
<div className="grid grid-cols-[1fr_120px_80px] gap-2 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border">
  <span>Nome</span><span>Status</span><span></span>
</div>
<div className="px-3 py-2 space-y-1">
  {rows.map(r => (
    <div key={r.id} className="grid grid-cols-[1fr_120px_80px] gap-2 items-center px-2 h-[48px] rounded-xl hover:bg-muted/50 transition-colors text-sm">
      ...
    </div>
  ))}
</div>
```

**Por quê:** `<table>` HTML traz comportamento de browser default (alinhamento, espaçamento, fonte) que é difícil de domar. Grid CSS dá controle total.

---

## 3. H1 em página de app

**AI default:** `<h1>Dashboard</h1>` no topo de toda tela.

**Anti-AI:** `<h2 className="text-xl font-semibold">Dashboard</h2>` — h1 reservado pra landing/marketing.

**Por quê:** H1 em SaaS interno é desnecessário (só uma área principal por página). Usar h2 abre espaço pra hierarquia menor (h3 dentro de cards) e mantém escala tipográfica enxuta.

---

## 4. Foreground preto puro

**AI default:** `--foreground: 0 0% 0%` (preto puro), `--background: 0 0% 100%` (branco puro). Sem temperatura.

**Anti-AI:**
- `--foreground: 16 38% 12%` (marrom escuro com hue) — choco
- `--background: 30 33% 96%` (creme quente) — choco

**Por quê:** Marcas reais não usam preto puro. Preto puro = ausência de decisão. Foreground com hue (mesmo sutil) sinaliza intenção.

---

## 5. Background sem temperatura

**AI default:** `--background: 0 0% 100%` ou `210 20% 96%` (branco/azul-cinza frio do shadcn).

**Anti-AI:** Background com hue alinhado à mesma família que foreground. Toda a paleta compartilha temperatura.

**Por quê:** Temperatura unificada cria coesão visual. Background frio + accent quente = dissonância. Toda paleta em hue family = harmonia.

---

## 6. Sem font-family explícita

**AI default:** Sem `font-family` no CSS = system font stack. Resultado: cada SO mostra fonte diferente, perdendo identidade.

**Anti-AI:**
- Choco: `font-family: 'Poppins', sans-serif;` + import de `@fontsource/poppins`
- Openstatus: Inter (Google Fonts) + CalSans (LocalFont)

**Por quê:** Fonte é metade da identidade visual. System font é o tell mais óbvio de gerador automático.

---

## 7. Container fluido com padding genérico

**AI default:** `<div className="container mx-auto p-8">{children}</div>` em tudo.

**Anti-AI:**
- Choco: `space-y-5` no container, `p-6` provido pelo AppLayout, sem nesting de paddings
- Openstatus: `max-w-5xl flex flex-col gap-4` — largura fixa, gap deliberado

**Por quê:** `container mx-auto` é o "lorem ipsum" do layout. Largura decidida + gap deliberado = controle visível.

---

## 8. Spacing scale livre

**AI default:** `p-2`, `p-3`, `p-4`, `p-6`, `p-8` — varia conforme conveniência.

**Anti-AI:**
- Choco: `space-y-1.5` (campos), `space-y-4` (entre campos), `space-y-5` (container) — escala fixa
- Openstatus: `p-4` em TUDO + `gap-px` (border) — religião do p-4

**Por quê:** Spacing varia random = parece improvisado. Escala curta e religiosa = parece pensado.

---

## 9. Ícone Lucide em cada elemento

**AI default:**
```tsx
<Button><PlusIcon /> Adicionar</Button>
<Label><InfoIcon /> Email</Label>
<Nav><DashboardIcon /> Dashboard</Nav>
```
Ícone em CADA botão, label, nav item.

**Anti-AI:**
- Choco: ícone em ações primárias e status badges. Não em labels, navs simples, cards.
- Openstatus: text-first total — `[copy]` em colchetes, chevron `▲` Unicode.

**Por quê:** Ícone decorativo é ruído. Quando tudo tem ícone, nada se destaca. Ícone só com propósito informacional.

---

## 10. Radius default 0.5rem em tudo

**AI default:** `--radius: 0.5rem` aplicado uniformemente em botão, card, input, badge.

**Anti-AI:**
- Choco: `rounded-2xl` (cards), `rounded-xl` (rows), `rounded-lg` (botões) — escala variável por contexto
- Openstatus: `rounded-none` em UI inteira (decisão brutalista)

**Por quê:** Radius uniforme = sem hierarquia visual. Escala variável OU zero deliberado = decisão estética.

---

## Checklist rápido

Se um app tem 5+ desses, é cara de IA:
- [ ] Card/CardHeader/CardContent em uso
- [ ] `<table>` HTML em UI (não em conteúdo)
- [ ] H1 no topo de página de app
- [ ] Foreground `0 0% X%` (sem hue)
- [ ] Background sem temperatura
- [ ] Sem font-family declarada
- [ ] `container mx-auto` em uso
- [ ] Padding varia random (p-2/3/4/6/8 misturados)
- [ ] Ícone Lucide em cada botão/label
- [ ] Radius 0.5rem em tudo