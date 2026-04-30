// ui_kits/default/components/display/Tag.jsx
// Tag — neutral inline label, optionally removable. Categories, filters, chips.
// When to use: user-applied labels (filter chips, tag lists).
// When NOT to use: status (use Badge with intent). Counts (use Badge neutral).

const Tag = ({ children, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 12, fontWeight: 500, lineHeight: 1.4,
    background: "hsl(var(--muted))",
    color: "hsl(var(--foreground))",
    border: "1px solid hsl(var(--border))",
  }}>
    {children}
    {onRemove && (
      <button
        onClick={onRemove}
        aria-label="Remove tag"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, padding: 0,
          background: "transparent", border: 0, borderRadius: 3,
          color: "hsl(var(--muted-foreground))",
          cursor: "pointer",
        }}
      >
        <Icon.X size={10} />
      </button>
    )}
  </span>
);

window.Tag = Tag;
