# Execution Plan — CRM Template Audit Chain (2026-05-03)

> **Master plan da skill chain** rodando exclusivamente no template CRM do `claude-anti-ai-design-system`. Lê primeiro este file e o `00-prestep-findings.md`.

## Estrutura desta pasta

```
audit-snapshots/crm-2026-05-03/
├── _PLAN.md                    ← este file (master execution plan)
├── 00-prestep-findings.md      raw findings da pre-step (11 telas inspecionadas)
├── 01-ui-design-system.md      Skill #1 plan + apply log + verify
├── 02-component-architect.md   Skill #2
├── 03-ux-audit.md              Skill #3
├── 04-motion-design.md         Skill #4
├── 05-trident-design.md        Skill #5 (final review do diff acumulado)
└── screenshots/                PNGs persistidos quando precisarem persistir
```

## Plano global (referência cruzada)

Plano alto-nível: `~/.claude/plans/crm-template-audit.md` (cobre contexto, escopo, IL aplicáveis, retomada). Este `_PLAN.md` cobre só execução desta run.

## Escopo

- **Worktree:** `C:/Users/Patrick Neuhaus/Documents/Github/claude-anti-ai-design-system`
- **Preview server:** `claude-anti-ia` (port 8002), URL `http://localhost:8002/ui_kits/default/index.html?demo=crm`
- **Files in scope:**
  - `ui_kits/default/index.html` (App + componentes inline do CRM template)
  - `ui_kits/default/components/screens/SettingsScreen.jsx` (acessível via CRM bottom-bar)
  - `ui_kits/default/components/screens/ProfileScreen.jsx` (idem)
  - `ui_kits/default/components/base/*.css` consumidos pelo CRM
  - `colors_and_type.css` SOMENTE se finding require token level fix; senão off-limits
- **Files OFF-limits:**
  - `ui_kits/default/showcase/**` (showcase é escopo separado, não tocar)
  - `SKILL.md`, `~/.claude/rules/*`, `~/.claude/library/*` (IL-1, IL-10)
  - Componentes em lock-in (verificar `FIXES-APLICADOS.md` antes de editar)

## Workflow (loop 5x — uma por skill)

Cada skill segue 10 steps:

1. **Read prior context.** Ler todos `0N-*.md` da pasta + `00-prestep-findings.md`. Skill #N só executa após `0(N-1)` ter section `## Results` populada.
2. **Read source.** Ler files in scope relevantes pra esta skill.
3. **Re-screenshot if needed.** preview_screenshot fresh quando precisar visual recheck (caveman: só se finding visual-dependent).
4. **Plan section.** Append `## Plan` no `0N-*.md` com:
   - Tabela `Findings`: severity (P0-P3) + evidence + location + proposed fix
   - Tabela `Apply`: file + change + risk + rollback strategy
5. **Self-check gate** (algorítmico, sem human):
   - IL-1: nenhum edit em SKILL.md / rules / library
   - IL-10: nenhum edit em componente listado em `FIXES-APLICADOS.md` validated
   - Boundary: skill não pisa território de outra (ex: ui-design-system não toca anatomy de componente — passa pra component-architect)
   - Tudo passou → prossegue. Falhou → documenta no `0N-*.md`, escala finding pra skill correta, segue.
6. **Apply.** Edits aplicados. **Apply gate humano BYPASSED por autorização do Patrick** (registrado: 2026-05-03, scope = CRM template only).
7. **Verify preview.** Reload + snapshot/screenshot key states (expanded/collapsed/mobile).
8. **Results section.** Append `## Results` no `0N-*.md`: diff summary + visual confirmation + regressions detected (none vs N).
9. **Commit atomico.** `audit(<skill>): <resumo curto>` no worktree.
10. **Próxima skill.** Skill #(N+1) começa.

## Skills sequence

| # | Skill | Foco | Output |
|---|---|---|---|
| 1 | `ui-design-system --audit` | Tokens, primitives, motion-as-system, breakpoints, DR-01 | maturity scorecard 3×7 + ranked gaps + remediations |
| 2 | `component-architect --audit` | Anatomy, slots, prop count (max 7), reuse map | god components > 200ln, > 7 props, plug-in opportunities |
| 3 | `ux-audit` | Nielsen heuristics, WCAG 2.2 AA, dark patterns, fluxo | heuristic violations + WCAG fails + flow gaps |
| 4 | `motion-design` | Animations, transitions, charts entry, reduced-motion | spec motion + lottie/rive recs |
| 5 | `trident --design` | Final code review (visual + a11y + perf, 3 layers) | P0-P3 findings cumulativos |

## Iron Laws checklist (per skill)

- ✅ IL-1: validar antes de qualquer edit em arquivo de instrução (off-limits aqui — só código do CRM)
- ✅ IL-5: composição 2+ skills passa por maestro? — N/A, chain explícita pelo Patrick (autorizado)
- ✅ IL-10: skill validated em FIXES-APLICADOS.md = lock-in. Verificar antes de editar componente compartilhado.
- ✅ IL-12: maestro V2 query context-tree em Phase 0 — N/A nesta run direta

## Rollback strategy

Cada skill commita atomico. Se trident #5 detectar regressão crítica → `git revert <commit-da-skill-X>`. Não precisa rebase.

## Pre-bugs do Patrick (carry-over pras skills)

Já listados em `00-prestep-findings.md`. Skills #1-#4 cobrem todos. Skill #5 valida nada quebrou.

## Estado atual

- ✅ Pre-step screenshot capture (11 telas)
- ✅ `00-prestep-findings.md` (raw observations)
- ⏳ Skill #1 ui-design-system — start agora
- ⏸️ Skills #2-#5 pendentes
