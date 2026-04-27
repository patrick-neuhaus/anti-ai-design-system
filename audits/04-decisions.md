# 04 — Decisions Log

> Decisões do Patrick sobre os 8 deltas levantados em `audits/03-deltas.md`. Capturado em sessão de planning de 2026-04-27.

## Delta 1: table.tsx defaults
- **Decisão:** canon = choco / shadcn original (`px-4` simétrico, `text-left`)
- **Justificativa:** "text-left é padrão universal de tabelas — maioria das colunas tem texto. text-center é exceção. Padding simétrico mata o bug do Nome de raiz."
- **Ação:** `presets/_shared/table.tsx` criado (Phase A1)

## Delta 2: Tabela shared vs inline
- **Decisão:** canon = wrapper minimal `<AppTable>` no preset
- **Justificativa:** "Choco tem RomaneiosTable pra 1 só uso — não é DRY de verdade. Wrapper minimal abstrai defaults sem ditar columns config."
- **Ação:** `presets/_shared/AppTable.tsx` criado (Phase A2)

## Delta 3: Action column alignment
- **Decisão:** canon = choco (geometria + `w-20` + `flex gap-1` sem justify)
- **Justificativa:** "Sem justify-* competindo. Width baseada em qtd de botões."
- **Ação:** documentado em `docs/07-component-patterns.md` + helper `ActionCell` em AppTable.tsx (Phases A2/A5)

## Delta 4: NavLink shared
- **Decisão:** canon = dwg (sem wrapper)
- **Justificativa:** "Dead code. NavLink do react-router-dom basta."
- **Ação:** documentado em `docs/07-component-patterns.md` (Phase A5)

## Delta 5: Status indicator
- **Decisão:** canon = híbrido (shared component estilo choco, visual estilo dwg dot+text)
- **Justificativa:** "Choco vence em arquitetura, dwg vence em discrição visual. Junta: shared component, dot+text default, pill opcional."
- **Ação:** `presets/_shared/StatusBadge.tsx` criado (Phase A3)

## Delta 6: Page header
- **Decisão:** canon = choco com font-display opcional (h2, sem ícone, subtítulo, ações top-right)
- **Justificativa:** "h2 consistente. Ícone inline puxa atenção do título errado. Subtítulo sempre."
- **Ação:** documentado em `docs/07-component-patterns.md` (Phase A5)

## Delta 7: Tokens extras
- **Decisão:** canon = par bg+fg estilo choco com nomes genéricos (`--status-*-bg/fg`)
- **Justificativa:** "Par explícito > cor única + opacidade inline. Mas usar nomes semânticos."
- **Ação:** tokens adicionados em `presets/warm-editorial/tokens.css` e `presets/minimalist-tech/tokens.css` (Phase A4)

## Delta 8: Lovable memory
- **Decisão:** canon = preset NÃO toca em `index.md` (só `design/`); projeto cria seu `index.md`
- **Justificativa:** "Preset = regras universais. index.md = contexto do projeto. Mistura confunde."
- **Ação:** documentado em `docs/04-using-with-lovable.md` (Phase A6)
