# Motion Audit — anti-ai-design-system

> **Skill:** `motion-design --audit` v1
> **Data:** 2026-05-02
> **Escopo:** motion patterns aplicados em 13 páginas (showcase + pages técnicas + login + 3 templates)
> **Método:** análise estática CSS (`@keyframes`, `animation:`, `transition:`) + visual inspection Chrome
> **Framework:** 4 pilares DR-05 (Funcional · Vetorial/Branding · Narrativo · Espacial/Imersivo)

## 1. Resumo Executivo

| Pilar | Cobertura atual | Veredicto |
|---|---|---|
| **Pilar 1 — Funcional/Estrutural** | ⚠️ Parcial (60%) | hover/transitions presentes mas inconsistentes; falta feedback em vários botões |
| **Pilar 2 — Vetorial/Branding** | ⚠️ Mínimo (30%) | logo Artemis estático, ícones sem morphing; SVG line drawing ausente |
| **Pilar 3 — Narrativo/Editorial** | ⚠️ Mínimo (20%) | hero entry sem animation, sem reveal on scroll, sem progress indicator |
| **Pilar 4 — Espacial/Imersivo** | ❌ Ausente (0%) | sem 3D/WebGL/AR — alinhado com tipo de produto, decisão correta |

**Veredicto:** o produto tem **motion presente mas sub-aproveitado** pra um DS que se chama "Anti-AI". O que existe está bem (transitions consistentes, easing único `--ease`, sem motion gratuito) mas falta **animação que comunica identidade** (Pilar 2 + Pilar 3) — e o login template tem **motion overload com violação WCAG 2.2.2** (Pilar 1 mau uso).

**Patrick estava certo:** "hero cards floating sem interação mouse perceptível" + "resto da home com pouca anim" = exatamente o que o audit confirma. O DS é visual-first, então motion mais expressivo pagaria muito.

**3 prioridades:**
1. **Fix WCAG 2.2.2** no login (5 loops infinitos sem pause) — F-MO-001
2. **Adicionar Pilar 1 funcional onde falta** — feedback de click, hover lift em cards do hero
3. **Adicionar Pilar 3 narrativo no hero + categorias** — reveal staggered, parallax sutil, scroll progress

## 2. Inventário factual de motion

### 2.1 Counts por arquivo

| File | `@keyframes` + `animation:` + `transition:` |
|---|---|
| `ui_kits/default/index.html` (login + templates) | 43 ocorrências |
| `ui_kits/default/showcase/index.html` (institucional) | 63 ocorrências |
| `colors_and_type.css` | 4 ocorrências |
| `presets/default/tokens.css` | 0 ocorrências |
| `ui_kits/default/showcase/*.html` (10 técnicas) | (não contado, mas presente em hover/focus) |

### 2.2 Animations identified

#### Loops infinitos (login template)
- `orb-float-a` 16s ease-in-out infinite — translate+scale (380px blur orb)
- `orb-float-b` 18s ease-in-out infinite — idem (320px blur orb)
- `bf-drift` 12s/14s/16s ease-in-out infinite — 3 floating glyphs

**5 loops simultâneos no `.login-brand` panel.**

#### Reveal/transitions
- `app-shell` collapsed transition 250ms (sidebar collapse/expand)
- `tpl-card` border + bg transition 150ms (hover card)
- `field-input` focus border + box-shadow 150ms
- `btn-login` background 150ms
- `nav-item` background + color 120ms
- `sidebar-toggle` bg + shadow + transform 150ms (hover)
- `user-action-btn` bg + color 120ms
- `tab-item` color 150ms
- `forgot-link` opacity (no duration declared)

#### Hover lifts (showcase home + surfaces page)
- `Card hover lift` — `transform: translateY(-2px)` em surfaces.html "Card — INTERACTIVE (HOVER LIFT)" — ✅ bom Pilar 1
- Hero floating cards — **sem hover** detectado. F-UX-006.

### 2.3 Easing

✅ **Único:** `--ease: cubic-bezier(0.4, 0, 0.2, 1)` (Material standard).
⚠️ **Mas:** maioria das `transition:` usam `ease-out` literal, não `var(--ease)`. Drift.

### 2.4 Reduced motion

❌ **Não detectado** `@media (prefers-reduced-motion: reduce)` em nenhum dos files lidos. **Falha cross-cutting WCAG 2.3.3 + best practice**.

## 3. Pilar 1 — Funcional/Estrutural

### 3.1 Cobertura

| Padrão | Status | Onde |
|---|---|---|
| Botão pressed (active state) | ⚠️ Parcial — não detectado `:active { transform: scale(0.98) }` em CSS | Buttons em geral |
| Toggle on/off | ✅ — `.app-shell.collapsed` 250ms | Sidebar collapse |
| Radio/checkbox tick | ❓ | Não testado interativo |
| Chip remove | ❓ | Tag remove na display.html — não testado |
| Tooltip aparece | ❓ | Não detectado tooltip em CSS |
| Input label float | ❓ | Não detectado label float |
| Dropdown open | ❓ | Não testado interativo |
| Card hover lift | ✅ | surfaces.html — exemplo dedicado |
| Toast in/out | ❓ | display.html tem botões "Default/Success/Destructive" — não testado interactive |
| Skeleton loading shimmer | ⚠️ | display.html mostra skeleton estático sem shimmer animation visível |
| Spinner | ✅ | display.html — 2 spinners visíveis |
| Page transitions | ❌ | Trocas entre showcase pages são `<a href>` plain — sem View Transitions API |

### 3.2 Findings Pilar 1

#### F-MO-001 — Login template: 5 loops infinitos sem `prefers-reduced-motion`
- **Severidade:** alta (WCAG 2.2.2 fail)
- **Componentes:** `.login-brand-orbs::before/::after` + `.brand-float.bf-1/2/3`
- **Recomendação:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    .login-brand-orbs::before,
    .login-brand-orbs::after,
    .brand-float { animation: none !important; }
  }
  ```
- **Esforço:** XS
- **Prioridade:** P1
- **Cross-ref:** F-UX-001

#### F-MO-002 — Login template: motion overload (5 loops + grid + glyphs)
- **Severidade:** média
- **Princípio violado:** Pilar 1 — "ambient nunca compete com tarefa". Aqui compete.
- **Recomendação:** reduzir pra 2 loops (1 orb + 1 glyph). Manter sense of life sem fadiga.
- **Esforço:** XS
- **Prioridade:** P2

#### F-MO-003 — Buttons sem `:active` pressed feedback
- **Componente:** `.btn`, `.btn-primary`, `.btn-outline`, `.btn-login`
- **Recomendação:** adicionar `transform: scale(0.98)` ou `translateY(1px)` em `:active` 80–120ms.
- **Esforço:** XS
- **Prioridade:** P2

#### F-MO-004 — Skeleton loading sem shimmer animation
- **Componente:** `.skeleton` em display.html
- **Recomendação:** keyframes shimmer com `linear-gradient` movendo de left to right, 1.5s linear infinite. Ver Pilar 1 catalogo.
- **Esforço:** S
- **Prioridade:** P2

#### F-MO-005 — Hero floating cards sem hover ou pulse
- **Componente:** `.hero-cards` em showcase home (KPI 1.284 / Sidebar Artemis / Tokens vivos)
- **Recomendação:**
  - Hover lift `translateY(-3px)` + shadow 200ms (Pilar 1)
  - Pulse sutil no número 1.284 a cada 30s simulando real-time (Pilar 1 + light Pilar 3)
- **Esforço:** S
- **Prioridade:** P1
- **Cross-ref:** F-UX-006

#### F-MO-006 — Page transitions: navegação entre showcase pages sem View Transitions API
- **Severidade:** baixa (trade-off OK pra static HTML)
- **Recomendação opcional:** se SPA fizer sentido futuro, adotar View Transitions API com `view-transition-name` pra continuidade entre páginas (ex: hero do showcase → header da page técnica).
- **Esforço:** M
- **Prioridade:** P3

#### F-MO-007 — Sidebar collapsed 250ms — bom, mas content interno não staggered
- **Componente:** `.app-shell.collapsed`
- **Observação:** quando collapse, labels somem com `display:none` (instant) — should fade out + slide left antes de display:none.
- **Recomendação:** transition opacity 150ms + width 250ms + delayed display:none.
- **Esforço:** S
- **Prioridade:** P3

#### F-MO-008 — Durations literais (120/150/200/250/400/600/800ms) sem token
- **Recomendação:** criar `--motion-fast/normal/slow/page` (ver F-UI-003).
- **Esforço:** S (refactor)
- **Prioridade:** P2
- **Cross-ref:** F-UI-003

## 4. Pilar 2 — Vetorial/Branding

### 4.1 Cobertura

| Padrão | Status | Onde |
|---|---|---|
| Logo reveal animado | ❌ | Logo Artemis estático no showcase + templates |
| Signature draw (SVG path animation) | ❌ | Ausente |
| Line animation | ❌ | Ausente |
| Morphing (menu ↔ close) | ❓ | Sidebar collapse usa toggle bolinha, sem morph icon |
| Animated icon hover | ⚠️ | Ícones Lucide statics, sem hover animation |
| Kinetic typography | ❌ | Hero "Anti-AI Design System" estático |
| Word/letter swap | ❌ | Ausente |
| Mascot/character | ❌ | Ausente (e ok pra tipo de produto) |
| Doodle | ❌ | Ausente (ok pra B2B-feel) |

### 4.2 Findings Pilar 2

#### F-MO-009 — Logo Artemis estático no hero (oportunidade Pilar 2)
- **Componente:** logo Artemis em sidebar templates
- **Recomendação opcional:** SVG path draw 1500ms one-shot na primeira carga do template (memoizado por sessão). Cria sense of "produto vivo".
- **Esforço:** M
- **Prioridade:** P3

#### F-MO-010 — Hero "Anti-AI Design System" sem kinetic typography
- **Componente:** `<h1>` no showcase home
- **Recomendação opcional:** stagger reveal por palavra (180ms entre palavras, 600ms total). Ver Pilar 2 § 2.4.
- **Esforço:** S
- **Prioridade:** P3

#### F-MO-011 — Ícones Lucide hover sem animation
- **Componente:** todos ícones SVG inline (Icon.jsx, ic() em index.html)
- **Recomendação opcional:** subtle scale(1.1) + color change on hover, 150ms.
- **Esforço:** XS (single CSS rule cobrindo `.icon:hover`)
- **Prioridade:** P3

#### F-MO-012 — Sidebar collapse toggle: bolinha sem morph entre `<` e `>`
- **Componente:** `.sidebar-toggle` — usa SVG ChevronLeft/ChevronRight
- **Observação:** parece troca de SVG (instant) em vez de morph rotation
- **Recomendação:** rotate 180deg 250ms ease-in-out + crossfade icon. Ou usar 1 chevron e rotacionar conforme estado.
- **Esforço:** S
- **Prioridade:** P3

## 5. Pilar 3 — Narrativo/Editorial

### 5.1 Cobertura

| Padrão | Status | Onde |
|---|---|---|
| Hero entry stagger | ❌ | Showcase home — sem reveal on load |
| Visual key art reveal | ❌ | Idem |
| Background loop ambient | ⚠️ Parcial | Login tem orbs ambient (mas overdose) |
| Number/metric count-up | ❌ | KPIs nos templates mostram número estático |
| Logo wall scroll (marquee) | ❌ | Ausente |
| Sticky frame + scrolling text | ❌ | Ausente |
| Step-by-step diagram reveal | ❌ | Ausente |
| Section reveal (fade+up) | ❌ | Não detectado IntersectionObserver ou whileInView |
| Parallax | ❌ | Ausente |
| Reading progress bar | ❌ | Ausente (poderia ficar bem em pages técnicas) |
| Animated gradient mesh background | ⚠️ | Showcase home tem gradient subtle, sem animation |
| Particle field | ❌ | Ausente |

### 5.2 Findings Pilar 3

#### F-MO-013 — Showcase hero: sem entry animation
- **Componente:** showcase/index.html hero section (h1 + tagline + 7 chips + CTA + 3 floating cards)
- **Recomendação:**
  - Stagger fade+up nas palavras de "Anti-AI Design System" (Pilar 2 + Pilar 3 combinados)
  - Slide+fade dos floating cards com 100ms entre cards (300-600ms total)
- **Esforço:** S
- **Prioridade:** P2
- **Cross-ref:** F-UX-006

#### F-MO-014 — Categorias section: lista chega sem reveal
- **Componente:** showcase/index.html "Categorias de componentes"
- **Recomendação:** IntersectionObserver + CSS class toggle, fade+up 200ms cada item com 80ms stagger. Visualiza estrutura ao chegar.
- **Esforço:** S
- **Prioridade:** P2
- **Cross-ref:** F-UX-007

#### F-MO-015 — KPIs nos templates: número não anima ao trocar
- **Componente:** kpi-value (1.247, 183, 42, 29 etc)
- **Observação:** como é demo estático, não há trigger natural de "número mudou" — mas no boot da page poderia animar count-up de 0 → valor (800ms cada KPI, staggered).
- **Recomendação opcional:** count-up animation no first render. Se troca de preset ocorrer, pulse no valor.
- **Esforço:** M
- **Prioridade:** P3

#### F-MO-016 — Pages técnicas: sem reading progress
- **Componente:** pages técnicas (forms.html, base.html, etc) que têm scroll longo
- **Recomendação opcional:** progress bar fixed top usando `animation-timeline: scroll()` (CSS scroll-driven, Chrome 115+, fallback JS).
- **Esforço:** S
- **Prioridade:** P3

#### F-MO-017 — Showcase home: sem section reveal on scroll
- **Componente:** seções "4 anti-padrões" / "Tokens" / "Categorias" / "Como usar"
- **Recomendação:** cada seção fade+up 400ms ao entrar 30% no viewport.
- **Esforço:** S
- **Prioridade:** P2

## 6. Pilar 4 — Espacial/Imersivo

### 6.1 Cobertura
Ausente (0%). **Decisão correta** pra tipo de produto: documentation site + DS showcase **NÃO precisa** de WebGL/3D/AR. Pilar 4 é luxo desnecessário aqui.

### 6.2 Recomendações Pilar 4
**Nenhuma.** Não adicionar 3D — quebraria positioning "Anti-AI" pelo lado oposto (tech-show-off).

Possível exceção: **CSS 3D faux** (perspective + transform 3D) em hero floating cards — Pilar 4 § 2.3 (faux 3D). Cabe se for sutil:
- Mouse parallax 8px em cards do hero (perspective 1000px + rotateY based on cursor)
- **Esforço:** S
- **Prioridade:** P3

## 7. Reduced motion — checklist global

| Comportamento | Status |
|---|---|
| `@media (prefers-reduced-motion: reduce)` global | ❌ Não detectado |
| Fallback `animation-duration: 0.01ms` | ❌ |
| Skeleton/spinner mantém estado em reduced-motion | ❓ A confirmar |
| Hover state instantâneo em reduced-motion | ❓ |

**Recomendação cross-cutting:** adicionar bloco em `colors_and_type.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Loops específicos: desligar completamente */
  .login-brand-orbs::before,
  .login-brand-orbs::after,
  .brand-float { animation: none !important; }
}
```

**Prioridade:** **P1** (compliance + best practice, esforço XS, impacto cross-cutting).

## 8. Backlog priorizado

| ID | Título | Severidade | Esforço | Prioridade |
|---|---|---|---|---|
| F-MO-001 | Login: 5 loops sem reduced-motion (WCAG 2.2.2) | Alta | XS | **P1** |
| (Cross-cutting) | Adicionar `@media (prefers-reduced-motion)` global | Alta | XS | **P1** |
| F-MO-005 | Hero floating cards sem hover/pulse | Média | S | **P1** |
| F-MO-002 | Login motion overload (reduzir 5 → 2 loops) | Média | XS | **P2** |
| F-MO-003 | Buttons sem `:active` feedback | Média | XS | **P2** |
| F-MO-004 | Skeleton sem shimmer | Média | S | **P2** |
| F-MO-008 | Tokens de motion ausentes | Média | S | **P2** |
| F-MO-013 | Hero sem entry animation | Média | S | **P2** |
| F-MO-014 | Categorias sem reveal | Média | S | **P2** |
| F-MO-017 | Section reveal on scroll | Média | S | **P2** |
| F-MO-007 | Sidebar collapse content stagger | Baixa | S | P3 |
| F-MO-009 | Logo Artemis path draw | Baixa | M | P3 |
| F-MO-010 | Kinetic typography hero | Baixa | S | P3 |
| F-MO-011 | Ícones hover scale | Baixa | XS | P3 |
| F-MO-012 | Sidebar toggle morph | Baixa | S | P3 |
| F-MO-015 | KPI count-up | Baixa | M | P3 |
| F-MO-016 | Reading progress | Baixa | S | P3 |
| F-MO-006 | View Transitions API | Baixa | M | P3 |

## 9. Observação estratégica

O DS é **declaradamente "Anti-AI"** — a estética foge do shadcn-default. **Mas a falta de motion expressivo (Pilar 2 + 3) faz com que o produto pareça mais "Anti-AI estático" do que "Anti-AI vivo"**. Pequenas adições no Pilar 1 (microinteractions, hover lift, button pressed) e Pilar 3 (hero entry, section reveal) **transformam a percepção de "screenshot de DS bonito" pra "produto vivo demonstrando filosofia"**.

Não adicionar Pilar 4 (3D/WebGL) — quebraria positioning. Faux 3D leve em hero cards (mouse parallax 8px) é o limite recomendado.

## 10. Cross-refs

- F-MO-001/002 ↔ F-UX-001 (login motion WCAG)
- F-MO-005 ↔ F-UX-006 (hero cards estáticos)
- F-MO-008 ↔ F-UI-003 (motion tokens)
- F-MO-013/014 ↔ F-UX-007 (categorias)
