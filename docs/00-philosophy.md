# Filosofia

Apps gerados por IA têm cara genérica não por causa de cor — por causa de **decisões estruturais conservadoras**. Card soup, `<table>` HTML, sidebar default, fonte system, ícone em tudo, hierarquia previsível. O resultado é tecnicamente funcional mas sem opinião.

Esse design system não substitui a identidade da sua marca. Ele te dá **infraestrutura** pra que sua identidade APAREÇA — em vez de ser engolida pelos defaults do shadcn/Lovable.

## Duas camadas

### Camada 1 — Universal anti-IA (este repo provê)
- 10 regras estruturais que se aplicam a qualquer projeto
- Sistema de tokens sem cor (typography, spacing, radius, shadows)
- Independente de marca, cliente ou domínio

### Camada 2 — Preset de vibe (este repo provê 3 starting points)
- Decisões consistentes de palette + fonte + radius scale
- `warm-editorial` (referência: chocotracking, tom Barry Callebaut)
- `minimalist-tech` (referência: openstatus.dev, brutal/mono)
- `data-dense` (referência: Stripe/Linear, alta densidade informacional)

Cada projeto Lovable consome: Camada 1 (sempre) + UM preset da Camada 2 (com customizações de cor/marca em cima).

## O que NÃO está aqui

- Logo, naming, conceito de marca — isso é discovery de produto, fora do escopo
- Componentes React prontos — usamos shadcn/ui como base, design system só configura como ele se comporta
- Geração automática de identidade — você decide cor/fonte por projeto, presets são starting points não constraints