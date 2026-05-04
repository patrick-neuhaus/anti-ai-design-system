# Iteração 2 — pós audit chain (autonomous)

> Patrick autorizou rodar sequencial sem checkpoint humano. Plan + execute.

## Decisões UX (sem perguntar Patrick)

- **Conversas**: top-level sidebar item dentro grupo "Vendas". Click contato/pipeline card → navega + foca conversa específica. Nielsen #6 visibility + standard CRM pattern (HubSpot, Intercom).
- **Cenário pill A-F**: ambos Pipeline cards + Contatos table column. Atributo core de lead.
- **Bump fontes**: global no DS (`colors_and_type.css`), token-level. Showcase + templates afetados.

## Ordem de execução

| # | Action | Risk |
|---|---|---|
| A1 | user-panel.account-active igual nav-item.active (bg + border-left primary) | low |
| A2 | bump globals: --text-xs 12→13, --text-sm 14→15 | medium (afeta showcase também — visual diff esperado) |
| A3 | sidebar logo SVG: stroke + fill → currentColor (já está) — confirmar via Token Editor pickFg auto | low |
| B1 | TokenEditorPreview deriveFromAccent: accent-foreground = pickFg(accent) (não força white) | medium |
| B2 | sidebar-foreground auto-pick via Token Editor logic (depend sidebar-bg luminance) | medium |
| B3 | re-test extremos: #00ff2a → preto, dark accent → white | verify |
| C2 | Cenário pill A-F: util constants + render em Pipeline cards + Contatos table | low |
| C3 | Telemetria IA card no Dashboard (custo modelo + latência + taxa resposta) | low |
| C1 | Conversa page — sidebar item novo + chat thread WhatsApp-style | high (heavy) |
| C4 | Prompts library page (tabs cobrança/follow-up/qualificação) | medium |
| D1+D2 | Drawer/Dialog focus trap + return focus | medium |

## Self-check

- IL-1 (instruction edits): NÃO
- IL-10 (lock-in): NÃO (CRM template + Token Editor in showcase scope; TokenEditorPreview já editado em sessões anteriores, lock-in não aplica pra refactor de logic)
- Boundary: A2 token bump afeta DS — informação clara no commit. B1/B2 mexe Token Editor logic — escopo legítimo (continua trabalho prévio).
- Apply gate humano: BYPASSED (autorizado)

Pass.
