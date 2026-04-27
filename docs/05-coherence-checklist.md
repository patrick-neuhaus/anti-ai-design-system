# Coerência Estrutural — Checklist Universal

> **Quando rodar:** depois de qualquer refator de UI feito por IA (Lovable, Cursor, v0). Antes de "validar" visualmente, rode `trident --design` no escopo modificado. Trident captura objetivamente o que olho humano NÃO acostumado perde.

> **Origem:** Wave 5 do anti-ai-design-system (2026-04-27). Trident comparativo entre chocotracking (baseline known-good) e dwg-insight-ext (refator subject) detectou 7/7 dos problemas estruturais que Patrick (designer-eye) identificou manualmente. Caso confirmado: trident é suficiente pra coerência. Esse checklist codifica os 10 padrões aprendidos.

---

## Como usar este checklist

1. **Antes de Write/Edit em UI nova:** consulta os 10 itens, codifica preventivamente.
2. **Depois de refator de IA:** roda `anthropic-skills:trident --mode dir --target <path> --design`.
3. **Trident output negativo (zero findings) + olho diz "tá estranho":** usa o checklist manual abaixo.
4. **Conflito entre trident e olho:** trident é fonte primária. Olho descreve o sintoma, trident achou a causa.

---

## Os 10 padrões de coerência

### 1. Header line continuity

**Faça:** sidebar header e main header devem ter **mesma altura**. Border-b deles forma UMA linha horizontal contínua atravessando sidebar→main.

**Não faça:** alturas diferentes (`h-12` no main + `px-4 py-4` no sidebar = 48px vs ~56px). A linha quebra na junção visualmente.

**Como verificar:**
- Visual: linha horizontal contínua passa de borda sidebar→main sem deslocamento? Se quebra = bug.
- Trident: `[P1] [visual]` flagga "Header height mismatch between layout and sidebar".
- Manual: medir bounding rect dos 2 headers. Se altura diferente, fix.

**Exemplo do erro real:**
`dwg-insight-ext` AppLayout: `<header className="h-12">` + AppSidebar brand: `<div className="px-4 py-4">`. Quebra visível na junção (Patrick #1).

---

### 2. Header purpose-driven

**Faça:** `<header>` no shell só existe se carrega **informação semântica** (page context, breadcrumbs, search, notifications, status global).

**Não faça:** header só pra hospedar controles que pertencem a outros lugares (toggle de sidebar pertence à sidebar; theme switch pertence ao user menu na sidebar). Header sem propósito = elemento órfão.

**Como verificar:**
- Liste o que tem no header. Se for SÓ (sidebar trigger + theme toggle + user menu), candidato a eliminar header inteiro.
- Trident: `[P3] [visual]` flagga "header element exists only to host controls — SRP violation".
- Manual: pergunta "se removo o header, quem perde informação?". Se resposta é "só os controles", header é orfão.

**Exemplo do erro real:**
`dwg-insight-ext` AppLayout `<header h-12>` tinha SidebarTrigger + theme toggle. Removendo ambos pra sidebar, header desaparece e a quebra de linha do item #1 some junto. Two birds, one stone.

---

### 3. Hover contrast (affordance mínimo)

**Faça:** `hover:bg-X` tem delta de luminosidade ≥10% sobre o `bg` base. Hover comunica "isso é clicável".

**Não faça:** `--accent` quase igual ao `--background`. Hover invisível = botão parece estático.

**Como verificar:**
- Delta entre `--accent` HSL Lightness e `--background` Lightness. Se <10%, fix.
- Trident: `[P2] [visual/a11y]` flagga "hover near-invisible, contrast delta < 5%".
- Manual: hover no botão. Se você precisa olhar 2 vezes pra ver mudança, falhou.

**Exemplo do erro real:**
`dwg-insight-ext` `--background: 222 15% 99%` (L=99) vs `--accent: 222 12% 95%` (L=95) = 4% delta. Botão `variant="ghost"` parece desabilitado em hover.

**Fix:** mudar `--accent` pra L=88-92 (delta 7-11%), OU usar `border` no hover em vez de `bg`.

---

### 4. Action-style consistency

**Faça:** action buttons na mesma página seguem **UMA filosofia**: ou todos text-first (`[regiões]`, `[revisar]`), ou todos icon-first (`<ImageIcon /> Regiões`).

**Não faça:** misturar icon decorativo com brackets text-first. Brackets eram pra SUBSTITUIR ícones; ter os dois é regra mecânica sem entender o porquê.

**Como verificar:**
- grep `\[\w+\]` em arquivos de página. Se achar, confirma que botões correspondentes NÃO têm ícone.
- Trident: `[P2] [visual]` flagga "action button mixes text-first bracket pattern with decorative icon".
- Manual: leia 3 botões de action seguidos. São consistentes na escolha icon vs text? Se inconsistente, fix.

**Exemplo do erro real:**
`dwg-insight-ext` ProjectsPage: `<Button><ImageIcon /> [regiões]</Button>` mistura ícone decorativo + brackets. Coerente seria: `<Button>[regiões]</Button>` (sem icon) OU `<Button><ImageIcon /> Regiões</Button>` (sem brackets).

---

### 5. Column header alignment

**Faça:** header de coluna em data table tem `text-align` **igual** às cells da mesma coluna. Se cells `justify-end`, header `text-right`.

**Não faça:** header default-aligned (left) com cells right-aligned. Cria desalinhamento horizontal sutil mas perceptível.

**Como verificar:**
- Para cada coluna no grid, compare className do header span vs className do wrapper das cells.
- Trident: `[P2] [visual]` flagga "column header alignment differs from cells".
- Manual: scrolla a tabela, foca uma coluna numérica/ações. Header e cells alinhados na mesma vertical?

**Exemplo do erro real:**
`dwg-insight-ext` ProjectsPage: header `<span>Ações</span>` (default left), cells `<div className="flex justify-end">`. Header esquerda + cells direita.

---

### 6. Border-token consistency em elementos vizinhos

**Faça:** bordas de elementos **visualmente vizinhos** (verticalmente ou horizontalmente) usam o MESMO token. Sidebar header e main header? Mesmo `border-X`. Sidebar footer e main footer? Mesmo.

**Não faça:** misturar `border-sidebar-border` com `border-border` em elementos que se tocam. Tokens diferentes = cor levemente diferente = visual quebrado.

**Como verificar:**
- Identifica elementos vizinhos. Para cada par, confere se o border token é o mesmo.
- Trident: `[P2] [visual]` flagga "adjacent elements use different border tokens".
- Manual: zoom 200% na junção entre dois elementos. Cores das bordas batem ou tem shift?

**Exemplo do erro real:**
`dwg-insight-ext` AppSidebar brand block usa `border-sidebar-border`; AppLayout header usa `border-border`. Visualmente desencontrados.

**Decisão arquitetural:** ou define que sidebar e main shell compartilham `border-border` (1 token só), OU mantém separação de tokens mas garante que elementos não vizinhos usam cada um.

---

### 7. Group header deliberate styling

**Faça:** headers de grupo em listas (clientes, categorias, datas) têm cor/peso/case **decidido explicitamente**. Hierarquia visível: group header > section label > metadata.

**Não faça:** herdar `text-muted-foreground` igual a labels secundários. Mesma cor que metadata = grupo desaparece visualmente.

**Como verificar:**
- Compara className do group header vs className de labels secundários (data, count, etc.) na mesma página. Devem ser visualmente distintos.
- Trident: `[P3] [visual]` flagga "group header inherits muted color, no visual hierarchy distinction".
- Manual: olha a página piscando os olhos (squint test). Os group headers se destacam ou misturam com metadata?

**Exemplo do erro real:**
`dwg-insight-ext` ProjectsPage: "BANCO ABC", "FEMSA" usam `text-xs font-mono uppercase tracking-wide text-muted-foreground` — mesma cor de data/count. Hierarquia perdida.

**Fix:** group header com cor diferente de metadata. Ex: `text-foreground` (não muted) com `font-mono uppercase`. Ou usar `border-t` antes do grupo pra separar visualmente.

---

### 8. Icon-only button accessibility

**Faça:** todo `<Button size="icon">` ou button apenas com ícone tem `aria-label` ou `<span className="sr-only">Action</span>`.

**Não faça:** icon button sem nome acessível. Screen reader anuncia só "button" sem contexto.

**Como verificar:**
- grep por `size="icon"` ou `<Button>\s*<[A-Z]\w+Icon` — para cada match, confere `aria-label` ou `sr-only`.
- Trident: `[P2] [a11y]` flagga "icon-only button missing accessible name".

**Exemplo do erro real:**
`dwg-insight-ext` AppLayout theme toggle: `<Button variant="ghost" size="icon"><Moon /></Button>` sem `aria-label`. Screen reader: "button".

---

### 9. Sortable header keyboard access

**Faça:** `<th>` ou div header com `onClick` é `<button>` (preferível) OU tem `role="button" tabIndex={0}` + keyboard handler (Enter/Space) + `aria-sort`.

**Não faça:** sort mouse-only (`<th onClick={...}>`) sem semântica de botão.

**Como verificar:**
- Para cada `onClick` em `<th>` ou `<div>` dentro de data table, confere keyboard accessibility.
- Trident: `[P2] [a11y]` flagga "sort header has onClick without keyboard equivalent or button role".

**Exemplo do erro real:**
`chocotracking` RomaneiosTable.tsx:262-277 — sortable `<th>` com onClick mas sem `role="button"`, sem `tabIndex`, sem `aria-sort`. Sort é mouse-only.

---

### 10. Click-on-image / non-interactive element keyboard access

**Faça:** `<img>` com `onClick` ou outro elemento não-interativo com handler precisa de `role + tabIndex + keyboard handler`. Idealmente, wrap em `<button>`.

**Não faça:** confiar só em `onClick` em img/div. Keyboard users não conseguem ativar.

**Como verificar:**
- grep `<img.*onClick`. Para cada match, verifica role/tabIndex/onKeyDown.
- Trident: `[P3] [a11y]` flagga "interactive element lacks keyboard handler".

**Exemplo do erro real:**
`dwg-insight-ext` ProjectsPage selo preview: `<img src={...} onClick={...}>` sem keyboard equivalent.

---

## Workflow obrigatório pós-refator de IA

Antes de Patrick (ou eu) "validar" um refator visual:

```
1. Rode anthropic-skills:trident --mode dir --target <path> --design
2. Confira findings vs este checklist (10 padrões cobertos)
3. Se trident achou P1+ visual → fix antes de pedir review
4. Se trident achou só P2-P3 polimento → ok pra showcase, listar como follow-up
5. Apenas DEPOIS, abre preview pra validação visual humana
```

Inverter essa ordem (validar visual → trident depois) custou Wave 4 inteira em retrabalho.

---

## O que este checklist NÃO cobre

- **UX / fluxos / jornadas** — usar `ux-audit` (skill diferente). Trident é code-level.
- **Conceito de marca** (palette, fonte, tom) — Camada 2 do design system, decisão por preset.
- **Conteúdo / copywriting** — usar `copy` skill ou revisão humana.
- **Performance além do trivial** — usar Lighthouse / runtime profiling.

---

## Manutenção deste checklist

Adicionar regra nova só quando:
- Patrick (ou outro designer-eye) identificar manualmente padrão estrutural NOVO
- Trident `--design` capturar consistentemente padrão em 2+ projetos
- Padrão for **estrutural** (não estilo subjetivo)

Remover regra que não dispara em 90 dias = candidata a archive.

Última revisão: 2026-04-27 (criado).