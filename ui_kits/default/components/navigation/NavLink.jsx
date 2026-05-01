// ui_kits/default/components/navigation/NavLink.jsx
// NavLink — primitive used to wrap a route-aware link. Sidebar/Tabs/Breadcrumb compose this.
// When to use: any clickable item that maps to a route boundary in the harness.
// When NOT to use: pure action buttons (Button). Within prose (plain <a>).

const NavLink = ({ href, active, onClick, children, leading, trailing, dense = false }) => {
  const padY = dense ? 6 : 8;
  return (
    <a
      href={href ?? "#"}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: `${padY}px 12px`,
        borderRadius: 8,
        textDecoration: "none",
        background: active ? "hsl(var(--accent-decorative) / .12)" : "transparent",
        color: active ? "hsl(var(--accent))" : "hsl(var(--foreground))",
        fontSize: 14, fontWeight: active ? 500 : 400,
        transition: "background-color .15s, color .15s",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "hsl(var(--muted))"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {leading}
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {children}
      </span>
      {trailing}
    </a>
  );
};

window.NavLink = NavLink;
