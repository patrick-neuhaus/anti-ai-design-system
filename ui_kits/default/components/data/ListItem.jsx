// ui_kits/default/components/data/ListItem.jsx
// ListItem — vertically stacked list row with leading slot, title, subtitle, trailing slot.
// When to use: feed-style or settings lists where rows are heterogeneous.
// When NOT to use: real tabular data (Table). Equal-weight grid items (Card grid).

const ListItem = ({ leading, title, subtitle, trailing, onClick, divider = true }) => (
  <div
    onClick={onClick}
    role={onClick ? "button" : undefined}
    tabIndex={onClick ? 0 : undefined}
    style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px",
      borderBottom: divider ? "1px solid hsl(var(--border))" : "none",
      cursor: onClick ? "pointer" : "default",
      transition: "background-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
    }}
    onMouseEnter={(e) => { if (onClick) e.currentTarget.style.background = "hsl(var(--muted) / .4)"; }}
    onMouseLeave={(e) => { if (onClick) e.currentTarget.style.background = "transparent"; }}
  >
    {leading && <div style={{ flexShrink: 0 }}>{leading}</div>}
    <div style={{ flex: 1, minWidth: 0 }}>
      {title && <div style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--foreground))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
    </div>
    {trailing && <div style={{ flexShrink: 0, color: "hsl(var(--muted-foreground))" }}>{trailing}</div>}
  </div>
);

window.ListItem = ListItem;
