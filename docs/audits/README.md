# Audits — anti-ai-design-system

> **Data:** 2026-05-02
> **Escopo:** repositório completo (showcase institucional + 10 pages técnicas + login + 3 templates Ops/CRM/Wiki)
> **Tipo:** audit-only — **NÃO modifica design system**, apenas documenta findings
> **Server:** http://127.0.0.1:8000/

## Objetivo

Auditoria multi-skill do anti-ai-design-system aplicando 5 lentes complementares:

1. **UX** (`ux-audit`) — fluxos reais, heurísticas Nielsen, WCAG 2.2 AA, dark patterns
2. **UI / Design System** (`ui-design-system --audit`) — maturidade visual, drift de tokens, identidade
3. **Motion** (`motion-design --audit`) — motion atual vs 4 pilares DR-05 (funcional/branding/narrativo/imersivo)
4. **Componentes** (`component-architect`) — anatomia + 17 estados visuais (states-inventory)
5. **React Patterns** (`react-patterns --audit-cross-browser`) — JSX patterns, hooks, cross-browser compat

## Estrutura

```
docs/audits/
├── README.md                    ← este arquivo (índice + glossário)
├── _inventory.md                ← inventário factual (páginas, componentes, tokens, motion, react)
├── 00-resumo-geral.md           ← cross-skill: P0–P3 unificada + backlog priorizado
├── 01-ux-audit.md               ← Nielsen 0–4 + WCAG 2.2 AA + fluxos
├── 02-ui-design-system-audit.md ← maturidade DS + drift tokens
├── 03-motion-audit.md           ← motion atual vs 4 pilares DR-05
├── 04-component-anatomy.md      ← 17 estados × cada componente
├── 05-react-patterns-audit.md   ← JSX hooks + cross-browser
├── RETOMADA.md                  ← prompt de retomada pra /compact
└── screenshots/
    ├── ux-audit/                ← evidências visuais ux
    ├── ui-design-system/
    ├── motion-design/
    ├── component-architect/
    └── react-patterns/
```

## Como ler

1. **Começa em `00-resumo-geral.md`** — visão consolidada, P0–P3 unificada cross-skill, backlog priorizado pronto pra virar tasks.
2. **Aprofunda nos audits individuais** quando quiser entender um finding específico — cada finding tem ID único.
3. **`_inventory.md`** é o ground-truth factual sem opinião. Use pra cross-reference quando descrição de algum finding não bater com o que vê.

## Glossário de severidade

### Severidade nativa (por skill)

Cada audit usa a escala canônica da sua disciplina:

| Skill | Escala | Significado |
|---|---|---|
| ux-audit | **Nielsen 0–4** | 0=cosmético · 1=baixo · 2=baixo-médio · 3=alto · 4=catastrófico |
| ui-design-system | **Maturidade L0–L4** | L0=ad-hoc · L1=básico · L2=consistente · L3=tokenizado · L4=sistêmico |
| motion-design | **Pilar DR-05 + risco a11y** | Bom uso / Mau uso / Risco WCAG 2.3.3 |
| component-architect | **Estados cobertos / faltando** | Por componente × 17 estados |
| react-patterns | **P0–P3 + cross-browser** | P0=catastrófico · P3=tech debt |

### Severidade unificada (no resumo geral)

Escala P0–P3 cross-skill pra priorização:

| Tier | Significado | Tradução |
|---|---|---|
| **P0** | Bloqueador — quebra produto, viola WCAG AA, regression de DS | corrigir AGORA |
| **P1** | Crítico — afeta percepção de qualidade, fricção alta no fluxo | corrigir esta wave de fix |
| **P2** | Médio — debt visível, melhoria perceptível mas não bloqueia | próxima wave |
| **P3** | Baixo — cosmético, polish, micro-melhoria | quando sobrar tempo |

Mapeamento sev nativa → P0–P3 documentado em `00-resumo-geral.md`.

## ID convention

IDs únicos pra cross-ref entre audits:

| Prefixo | Skill |
|---|---|
| `F-UX-NNN` | ux-audit |
| `F-UI-NNN` | ui-design-system |
| `F-MO-NNN` | motion-design |
| `F-CA-NNN` | component-architect |
| `F-RP-NNN` | react-patterns |

Cross-refs aparecem em cada finding quando outro audit toca o mesmo elemento.

## Skills usadas (versões)

| Skill | Versão | Lock-in |
|---|---|---|
| ux-audit | v4 (2026-05-01) | sim, validated |
| ui-design-system | v2 (2026-05-01) | sim, validated |
| motion-design | v1 (2026-05-02) | sim, validated |
| component-architect | v3 + states-inventory.md (2026-05-01) | parcial |
| react-patterns | v3 + cross-browser refs (2026-05-01) | sim, validated |

## Próximos passos pós-audit

1. Patrick lê `00-resumo-geral.md`
2. Decide ordem de fix waves (sugestão de ordem em `00-resumo-geral.md` § "Roadmap")
3. Cada wave de fix usa as skills modificadoras (ui-design-system `--apply`, motion-design `--spec`, etc) com base nos findings
4. NÃO modificar tokens core do DS em fix wave — Patrick decisão explícita

## Limites do audit

- **Não testou** Safari iOS / Edge enterprise reais — apenas Chromium baseline. react-patterns levanta requisitos cross-browser, não valida.
- **Não auditou** `preview/` (13 pages warm-*) — fora do escopo solicitado, são previews históricos.
- **Não rodou** Lighthouse/axe-core programático — análise visual + heurística manual via Chrome.
- **Login mock** aceito (passa direto qualquer credencial).
