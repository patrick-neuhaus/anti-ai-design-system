// ui_kits/default/components/surfaces/Card.jsx
// Card — base content surface (paper). Subtle border + radius, no shadow by default.
// When to use: any grouped content block (stat tile, form section, list panel).
// When NOT to use: full-page chrome (use Section + AppLayout). Floating ephemeral content (Popover/Toast — Round B).

const Card = ({ children, padding = 20, as: As = "div", className = "card", style, ...rest }) => (
  <As className={className} style={{
    background: "hsl(var(--card))",
    color: "hsl(var(--card-foreground))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 12,
    padding,
    ...style,
  }} {...rest}>
    {children}
  </As>
);

const CardHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
    <div>
      {title && <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{subtitle}</div>}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
  </div>
);

window.Card = Card;
window.CardHeader = CardHeader;
