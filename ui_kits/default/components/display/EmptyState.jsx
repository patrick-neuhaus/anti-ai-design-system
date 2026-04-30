// ui_kits/default/components/display/EmptyState.jsx
// EmptyState — zero-data state with icon, headline, body, optional CTA.
// When to use: list/table that has no items yet, no search results, blank dashboard panel.
// When NOT to use: loading state (Skeleton — Round B). Errors (Alert with destructive intent).

const EmptyState = ({ icon: I = Icon.AlertCircle, title, description, action }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center",
    padding: "48px 24px",
    color: "hsl(var(--foreground))",
    gap: 8,
  }}>
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 48, height: 48, borderRadius: 14,
      background: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
      marginBottom: 8,
    }}>
      <I size={22} />
    </span>
    {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
    {description && (
      <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", maxWidth: 360, lineHeight: 1.5 }}>
        {description}
      </div>
    )}
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

window.EmptyState = EmptyState;
