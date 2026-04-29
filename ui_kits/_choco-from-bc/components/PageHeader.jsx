// Page-level chrome: title, subtitle, optional action slot.
const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--foreground)", letterSpacing: "-.005em" }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 14, color: "var(--muted-foreground)", marginTop: 2 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
  </div>
);

window.PageHeader = PageHeader;
