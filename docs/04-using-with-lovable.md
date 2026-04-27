# Como usar com Lovable

Esse design system é consumido por projetos Lovable via 3 conjuntos de arquivos. O Lovable lê esses arquivos e segue como regra.

---

## Setup (uma vez por projeto novo)

### Passo 1: Escolher preset

Olha em `presets/`. Pega o mais próximo da vibe que quer:

- **`warm-editorial`** — apps editoriais, marcas com personalidade (food, fashion, lifestyle, conteúdo). Referência: chocotracking (Barry Callebaut)
- **`minimalist-tech`** — apps técnicos, dashboards pra dev/ops, ferramentas técnicas. Referência: openstatus.dev
- **`data-dense`** — apps com muita info numérica, BI, fintech, logística. Referência: Stripe Dashboard, Linear

### Passo 2: Copiar 3 arquivos pro projeto Lovable

Do preset escolhido pro projeto:

| De (no anti-ai-design-system) | Para (no projeto Lovable) |
|---|---|
| `presets/<seu-preset>/tokens.css` | `src/index.css` (substituir) |
| `presets/<seu-preset>/tailwind.config.ts` | `tailwind.config.ts` (mergear) |
| `presets/<seu-preset>/lovable-memory/design/*.md` | `.lovable/memory/design/` (criar pasta + colar) |

### Passo 3: Garantir que Lovable lê

Abra o projeto no Lovable e mande:

> Acabei de aplicar um design system. Lê os arquivos em `.lovable/memory/design/` e me confirma que entendeu as regras. A partir de agora, TODA UI nova segue essas regras estritamente. Se você não tem certeza de alguma regra, pergunta antes de gerar.

Espere a confirmação. Se Lovable parafrasear errado as regras, corrija antes de continuar.

---

## Customização (por projeto)

### Trocar cor primary
Edite `--primary` em `src/index.css` apenas. Mantém o resto inalterado.

### Trocar a fonte
1. Edite `font-family` em `src/index.css`
2. Atualize `import` em `src/main.tsx` ou `index.html`
3. Atualize `tailwind.config.ts` se você usa custom families

### Adicionar tokens próprios
Adicione em `src/index.css` no bloco `:root`. Documente em `.lovable/memory/design/tokens.md` o que cada token significa.

---

## Verificação (depois do Lovable aplicar)

Antes de aceitar a primeira tela gerada:

- [ ] Sidebar não tem cara de default shadcn (settings panel destacado, spacing diferente)
- [ ] Sem `<Card>/<CardHeader>/<CardContent>` no código (busca: `Card[A-Z]`)
- [ ] Sem `<table>` HTML em UI (busca: `<table` em src/components ou src/pages)
- [ ] Fonte trocou (não é system font default)
- [ ] Foreground tem hue (procure `0 0% X%` em index.css — não deve ter)
- [ ] Tabelas são grid CSS (busca: `grid-cols-` em data lists)
- [ ] Page titles são `<h2>`, não `<h1>` (busca: `<h1` em src/pages)
- [ ] Ícones com propósito (não em todo botão/label)

Se algum item falhou, mande pro Lovable:

> Você está violando a regra X do design system (referência: `.lovable/memory/design/page-layout.md`). Refaz seguindo a regra.

---

## Quando NÃO usar este design system

- Projeto onde a marca já tem design system próprio em uso
- App com >50 componentes existentes (custo de migração alto, faça por feature nova)
- Landing page marketing (usa regras diferentes — h1 OK, gradientes OK em hero)
- Wizards/onboarding multi-step (precisam de progress patterns próprios não cobertos aqui)

---

## Troubleshooting

**Lovable continua usando Card mesmo depois de copiar os memory files**
- Re-confirme que `.lovable/memory/design/page-layout.md` foi lido pelo Lovable
- Mande explicitamente: "Não use o componente Card do shadcn em nada que você gerar. Use as classes manuais documentadas."

**Tipografia não trocou**
- Confirme que o import da fonte está em `src/main.tsx` ou `index.html`
- Verifique no DevTools que `font-family` é a esperada (computed style)
- Se fontsource: rode `npm install @fontsource/<font-name>`

**Dark mode quebrou**
- Cada preset assume light-only por default
- Se precisa de dark, copie variáveis `[data-theme=dark]` do preset (se existir) ou peça pro Lovable gerar

---

## Lovable memory: preset vs projeto

`.lovable/memory/` aceita estrutura hierárquica. O preset escreve apenas em `design/`:

- `.lovable/memory/design/page-layout.md` — regras de layout (do preset, **não mexer**)
- `.lovable/memory/design/tokens.md` — documentação dos tokens (do preset, **não mexer**)

O **projeto** adiciona o seu próprio `index.md` na raiz com:
- Glossário de termos do domínio
- Regras de negócio específicas
- Convenções do projeto que não saem do design system

Não misturar: preset = regras universais; `index.md` = contexto do projeto.

Exemplo:
- `chocotracking/.lovable/memory/index.md` — existe (custom do projeto)
- `chocotracking/.lovable/memory/design/page-layout.md` — existe (do preset)