# CRM Audit — Pre-step findings (2026-05-03)

Telas capturadas via preview_screenshot (visualizadas inline pelo agent — usadas como base pras skills 1-5).

## Telas verificadas

| # | Tela | Status |
|---|---|---|
| 01 | Login (template selector) | OK |
| 02 | Dashboard (default = dark) | Capturado |
| 03 | Pipeline kanban | Capturado |
| 04 | Pipeline lista | Capturado — **BUG crítico** |
| 05 | Pipeline drawer | Capturado |
| 06 | Contatos | Capturado |
| 07 | Relatórios | Capturado |
| 08 | Perfil | Capturado |
| 09 | Settings (Token Editor) | Capturado |
| 10 | Dashboard sidebar collapsed | Capturado |
| 11 | Mobile 375px | Capturado — **BUGS críticos reflow** |

## Bugs detectados pre-skill (raw — skills vão re-categorizar)

### P0 (críticos)

1. **Pipeline → Lista: column FASE bars brancas vazias.** Bars de progress não renderizam fill (provavelmente ProgressBar usa cor que choca com dark surface).
2. **Mobile 375px: page title overflow.** "Dashboard" / "Pipeline de vendas e conversão" cortado horizontal. Cards Funil/Volume estouram viewport. Reflow WCAG 1.4.10 fail.
3. **CRM default = dark sem toggle.** Sem theme switcher. Patrick provavelmente quer ambos modos seleção.
4. **A11y: nav-item, user-action-btn, são DIVs sem role=button.** Sidebar inteira não acessível por teclado/SR (Configurações, Sair, Dashboard, Pipeline, Contatos, Relatórios todos `<div>`).

### P1 (altos)

5. **Inconsistência page title position:** Dashboard + Relatórios têm título TOP-RIGHT. Pipeline + Contatos têm título TOP-LEFT abaixo do breadcrumb. (Patrick reportou: dashboard breadcrumb estilo "shadcn" vs Contatos/Relatórios "mais bonito".)
6. **Sidebar collapsed: toggle "▶" floating fora dos limites.** Posicionado deslocado pra direita, parece bug visual.
7. **Sidebar lost active state em rotas profile/settings.** Nav-item `.active` não persiste quando user navega pra Perfil ou Configurações.
8. **Avatar Perfil page: edit-camera icon misaligned.** Pequeno detalhe abaixo do círculo MC.

### P2 (médios)

9. **Sidebar collapsed: badges "14"/"89" desaparecem.** Inconsistente com expanded onde badges são proeminentes (info loss).
10. **Logo expanded sidebar: badge "CRM" overlap mark.** Patrick reportou "logo não centralizada" — mark + badge "CRM" não alinham bem.
11. **Icon Contatos cortado** (Patrick reportou — confirmar com inspeção pixel-level na skill #1/#2).

## Pré-bugs Patrick confirmados

- ✅ Logo não centralizada sidebar expanded → confirmado (#10)
- ⏳ Icon Contatos cortado → pendente confirmação visual pixel
- ✅ Breadcrumb Dashboard "shadcn" vs Contatos/Relatórios "bonito" → reframe (#5: é position diff, não estilo diff)

## Próximo

Skill #1 `ui-design-system --audit` consume estas observações + screenshots inline + colors_and_type.css.
