# Anti-AI Design System — Implementation Plan

> **Note (Apr 2026):** Wave 8 reorganization consolidated to single preset `default` (warm-editorial flavor). `minimalist-tech` removed entirely. See `README.md` for current state.

## Context

Apps gerados por IA (Lovable, v0, Cursor) compartilham uma cara visual genérica:
azul `#213` como primary, fonte system, Card/CardHeader/CardContent em tudo,
spacing previsível, ícone Lucide em cada elemento, sidebar padrão, hierarquia
H1→subhead→card grid. O resultado é "tecnicamente funcional, mas sem alma".

Patrick tem dois apps que provam isso:
- `dwg-insight-ext` — exemplo do problema (shadcn defaults puros, sem `.lovable/memory/`,
  primary azul `213 94% 48%`, system font, Card soup)
- `chocotracking` — exemplo da solução (paleta Barry Callebaut + regras estruturais
  documentadas em `.lovable/memory/design/page-layout.md`)

A virada do choco aconteceu em UM ÚNICO commit (`435415f`): troca de tokens + memory
files com regras estruturais. As regras estruturais desse memory file são
brand-agnostic — não falam de borgonha, falam de "no Card soup", "grid-based tables",
"radius variável por componente". Esse é o insight central: dá pra codificar regras
universais que removem a cara de IA, separadas da identidade da marca.

Outcome esperado: repo público `anti-ai-design-system` que serve como starter pack
plugável em qualquer projeto Lovable, em duas camadas:
- Camada 1 (universal): regras estruturais anti-IA + sistema de tokens (tipografia,
  spacing, radius, shadows) — sem cor.
- Camada 2 (preset de vibe): 3 starting points — warm editorial (tipo choco),
  minimalist tech (tipo Linear), data-dense (tipo Stripe).

Validação final: aplicar no `dwg-insight-ext` e provar visualmente que perde a cara de IA.

---

## Approach (4 waves)

### Step 0 — Criar repositório
- gh repo create anti-ai-design-system --public
- Estrutura inicial vazia, README placeholder
- Local: C:\Users\Patrick Neuhaus\Documents\Github\anti-ai-design-system

### Wave 1 — Pattern study
- Skill: pattern-importer --analyze
- Alvos: calcom/cal.com (packages/ui/) + openstatusHQ/openstatus (apps/web/src/components/)
- Output: docs/research/pattern-extraction.md
- Cleanup: .tmp/ deletada (IRON LAW da skill)

### Wave 2 — Definir estrutura
- Skills: component-architect --plan + ui-design-system --generate
- Output:
  - docs/01-anti-patterns.md — os 7+ padrões de IA a evitar
  - docs/02-structural-rules.md — Camada 1 universal
  - docs/03-token-system.md — typography, spacing, radius, shadows (sem cor)
  - Definição dos 3 presets (palette + fonte + radius scale por preset)

### Wave 3 — Escrever consumables do Lovable
- Skills: lovable-knowledge project + prompt-engineer --validate --type system-prompt
- Estrutura final do repo:
  anti-ai-design-system/
  ├── README.md
  ├── docs/{00-philosophy,01-anti-patterns,02-structural-rules,03-token-system,04-using-with-lovable}.md
  │   └── research/pattern-extraction.md
  ├── presets/
  │   ├── warm-editorial/{tokens.css, tailwind.config.ts, lovable-memory/design/*.md}
  │   ├── minimalist-tech/[mesma estrutura]
  │   └── data-dense/[mesma estrutura]
  └── templates/new-project/[esqueleto vazio]
- Cada .md em docs/ e lovable-memory/ passa por prompt-engineer --validate antes do Write (IL-1)

### Wave 4 — Validar contra dwg-insight-ext  ✅ DONE
- Branch experiment/anti-ai-ds no dwg
- Aplicar Camada 1 + preset minimalist-tech
- Skill: trident --design
- Acceptance:
  - Sidebar deixou de ser default
  - Card soup eliminado
  - Tipografia trocada (não system)
  - Foreground com temperatura
  - Tabelas grid-based, não <table>
- Documentar em examples/dwg-before-after/README.md com screenshots

### Wave 5 — Coherence checklist (trident comparison)  ✅ DONE
- Trident --design em chocotracking (baseline) + dwg-experiment (subject)
- Resultado: trident pegou **7/7** problemas estruturais que olho humano não viu
- Output: `docs/05-coherence-checklist.md` com 10 padrões de coerência codificados
- Update: `docs/02-structural-rules.md` agora aponta pro 05 + define workflow pós-refator
- Aprendizado: rodar trident SEMPRE antes de validar visual. Inverter custou Wave 4 em retrabalho.

---

## Critical files

### A criar (no repo anti-ai-design-system)
Toda a estrutura listada na Wave 3.

### Referenciados (existem, devem ser estudados)
- chocotracking/.lovable/memory/design/page-layout.md — gold standard formato regras
- chocotracking/.lovable/memory/design/tokens.md — gold standard formato tokens
- chocotracking/src/index.css — referência de CSS variables
- chocotracking/tailwind.config.ts — referência Tailwind extension
- dwg-insight-ext/src/index.css — referência negativa (a "cara de IA")

### Fontes externas (Wave 1)
- github.com/calcom/cal.com — clone parcial via degit
- github.com/openstatusHQ/openstatus — clone parcial via degit

---

## Verification

End-to-end test:
1. Repo público existe em github.com/<user>/anti-ai-design-system
2. Branch experiment/anti-ai-ds no dwg com preset minimalist-tech aplicado
3. Comparação visual antes/depois
4. trident --design reporta como sem cara de IA
5. README testado

Acceptance:
- Camada 1 aplicada no dwg sem intervenção manual além de copy/paste
- Diff visual é óbvio (transformação, não tweak)
- 3 presets funcionais e documentados

---

## Out of scope

- Skill (no skillforge-arsenal) — adiada até validar manual
- Mais de 3 presets — começa com 3, expande depois
- Suporte fora do Lovable (Cursor, Claude Code direto) — versões futuras
- Brand identity guidance (logo, naming) — fora do escopo do anti-IA puro
- Dark mode obrigatório por preset — decisão por preset
- Tradução en/pt — repo em PT-BR

---

## Dependencies & gotchas

- IL-1: cada .md em docs/, presets/*/lovable-memory/, templates/ passa por
  prompt-engineer --validate antes do Write. Hook V2 bloqueia sem marker.
- pattern-importer cleanup: .tmp/ deletada antes de fechar Wave 1.
- Wave 3 é pesada: muitos arquivos validados. Pode precisar handoff antes de Wave 4.
- Cal.com é grande: usar degit calcom/cal.com/packages/ui ao invés de clone full.
- gh CLI precisa estar autenticado: verificar com gh auth status.