// ui_kits/default/components/layout/PageHeader.jsx
// Page-level chrome: title, subtitle, optional action slot.
// When to use: top of any screen (Dashboard, Settings, Romaneios). Sets context.
// When NOT to use: nested card header (use CardHeader). Marketing hero (use Section with strong tone).

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-.005em" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>{actions}</div>}
  </div>
);

window.PageHeader = PageHeader;
