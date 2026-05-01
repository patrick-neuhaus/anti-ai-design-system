// ui_kits/default/components/navigation/Breadcrumb.jsx
// Breadcrumb — hierarchical trail showing where the user is in the app.
// When to use: nested navigation (Settings > Team > Roles > Edit).
// When NOT to use: flat apps (Dashboard / Romaneios siblings — Sidebar is enough). Wizards (Stepper).

const Breadcrumb = ({ items = [], separator = "/" }) => (
  <nav aria-label="Breadcrumb" style={{ fontSize: 13 }}>
    <ol style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6,
      listStyle: "none", margin: 0, padding: 0,
    }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {it.href && !last ? (
              <a href={it.href} onClick={it.onClick} style={{
                color: "hsl(var(--muted-foreground))",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                {it.icon && <it.icon size={13} />}
                {it.label}
              </a>
            ) : (
              <span style={{
                color: last ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                fontWeight: last ? 500 : 400,
                display: "inline-flex", alignItems: "center", gap: 4,
              }} aria-current={last ? "page" : undefined}>
                {it.icon && <it.icon size={13} />}
                {it.label}
              </span>
            )}
            {!last && (
              <span aria-hidden="true" style={{ color: "hsl(var(--muted-foreground) / .5)" }}>
                {separator}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

window.Breadcrumb = Breadcrumb;
