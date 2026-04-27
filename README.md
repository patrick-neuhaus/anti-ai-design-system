# anti-ai-design-system

Design system anti-IA pra apps Lovable. Remove a "cara de IA" via regras estruturais universais (Camada 1) + presets de vibe opcionais (Camada 2: warm editorial / minimalist tech / data-dense).

**Status:** em construção. Ver `PLAN.md` pro roadmap.

## Filosofia

Apps gerados por IA têm cara genérica não por causa de cor — por causa de **padrões estruturais**: Card soup, sidebar default, `<table>` HTML, hierarquia H1→subhead→cards, ícone Lucide em tudo, fonte system, foreground preto puro. Esse repo codifica como sair disso.

## Como usar (após Wave 3)

1. Escolha um preset em `presets/` ou parta de `templates/new-project/`
2. Copie `tokens.css` + `tailwind.config.ts` pro seu projeto Lovable
3. Copie `lovable-memory/design/*.md` pra `.lovable/memory/design/` no projeto
4. No Lovable, peça pra aplicar o design system
