// ui_kits/default/components/surfaces/Card.jsx
// Card — base content surface (paper). Subtle border + radius, no shadow by default.
// When to use: any grouped content block (stat tile, form section, list panel).
// When NOT to use: full-page chrome (use Section + AppLayout). Floating ephemeral content (Popover/Toast — Round B).

const Card = ({ children, padding = 20, as: As = "div", className = "card", style, onClick, ...rest }) => {
  /* F-CA-003: interactive Card must be keyboard-focusable + receive focus ring */
  const isInteractive = Boolean(onClick);
  return (
    <As
      className={className}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive && As === "div" ? "button" : undefined}
      onKeyDown={isInteractive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined}
      style={{
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 12,
        padding,
        cursor: isInteractive ? "pointer" : undefined,
        /* No outline:none override — inherits :focus-visible ring from colors_and_type.css */
        ...style,
      }}
      {...rest}
    >
      {children}
    </As>
  );
};

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
