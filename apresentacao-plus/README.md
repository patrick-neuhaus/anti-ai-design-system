# Apresentação Plus by Artemis

Deck de 15 slides explicando o agente de prospecção da Plus desenvolvido pela Artemis.

## Como abrir

Requer servidor estático local (iframes do CRM precisam servir do mesmo host). Escolha uma:

```bash
# Opção A — Python 3 (já vem em quase todo PC)
cd apresentacao-plus
python -m http.server 8000

# Opção B — Node (npx serve)
cd apresentacao-plus
npx serve -p 8000 .

# Opção C — PHP
cd apresentacao-plus
php -S localhost:8000
```

Depois abrir browser em `http://localhost:8000`.

> **Importante:** o deck importa o CRM via iframe relativo (`../ui_kits/default/index.html`), então o servidor precisa rodar no diretório **pai** se você quiser servir tudo junto. Alternativa: rode no diretório `apresentacao-plus` mesmo — os iframes carregam direto do filesystem do navegador via path relativo.
>
> Se aparecer tela branca nos slides 6/7/8/9: rode o servidor um nível acima (`cd anti-ai-design-system && python -m http.server 8000`) e abra `http://localhost:8000/apresentacao-plus/`.

## Navegação

| Tecla | Ação |
|-------|------|
| `→` ou `Espaço` | próximo slide |
| `←` | slide anterior |
| `Home` | volta capa |
| `End` | último slide |
| `F` | fullscreen / sair |
| Click direita | próximo |
| Click esquerda | anterior |

URL hash (`#7`) deep-linka pro slide N.

## Estrutura

```
apresentacao-plus/
  index.html      ← 15 slides
  deck.css        ← imports anti-ai tokens + layouts
  deck.js         ← slide engine vanilla JS
  assets/         ← logos Plus + Artemis
  README.md       ← este arquivo
```

## Distribuição

Pra mandar pra alguém: zipa a pasta inteira **incluindo o repo `anti-ai-design-system`** (porque o deck depende do CRM em `../ui_kits/default/`).

```bash
cd ..
zip -r plus-by-artemis.zip apresentacao-plus ui_kits colors_and_type.css
```

Receptor extrai e roda `python -m http.server 8000` na pasta raiz extraída.
