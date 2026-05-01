// ui_kits/default/components/navigation/UserMenu.jsx
// UserMenu — avatar + nome + dropdown (Config / Sair).
// When to use: footer da Sidebar logada. Substitui o user-row + logout-row antigos.
// When NOT to use: header de marketing (use NavLink + Button). Settings page interna (use Avatar puro).
// Layout decisão (Patrick): SEM email visível, SEM separador entre avatar/nome/botões.

const initialsFromName = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "··";

const UserMenu = ({ user, onConfig, onLogout, collapsed = false, align = "top" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [open]);

  const name = user?.name ?? "Usuário";
  const avatarUrl = user?.avatarUrl;
  const initials = initialsFromName(name);

  const handleConfig = () => { setOpen(false); onConfig?.(); };
  const handleLogout = () => { setOpen(false); onLogout?.(); };

  // Collapsed: só avatar (sidebar mode), dropdown abre lateral à direita
  if (collapsed) {
    return (
      <div ref={ref} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          aria-label={`Menu de ${name}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: avatarUrl ? "transparent" : "hsl(var(--accent))",
            color: "hsl(var(--accent-foreground))",
            border: "0", cursor: "pointer", padding: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
            fontSize: 13, fontWeight: 600,
          }}
        >
          {avatarUrl ? <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
        </button>
        {open && (
          <div role="menu" style={{
            position: "absolute", left: "calc(100% + 8px)", bottom: 0,
            background: "hsl(var(--card))", color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))", borderRadius: 10,
            boxShadow: "0 8px 24px -4px rgb(0 0 0 / .15)",
            minWidth: 180, padding: 4, zIndex: 50,
          }}>
            <DropdownItem icon={Icon.Settings} label="Config." onClick={handleConfig} />
            <DropdownItem icon={Icon.LogOut} label="Sair" onClick={handleLogout} />
          </div>
        )}
      </div>
    );
  }

  // Expanded: row clicável avatar+nome+chevron, dropdown abre acima ou abaixo
  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        aria-label={`Menu de ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: 10,
          background: open ? "hsl(var(--sidebar-accent) / .5)" : "transparent",
          color: "inherit", border: 0, cursor: "pointer",
          fontFamily: "inherit", textAlign: "left",
          transition: "background-color .15s",
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = "hsl(var(--sidebar-accent) / .35)"; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <span style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: avatarUrl ? "transparent" : "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", fontSize: 12, fontWeight: 600,
        }}>
          {avatarUrl ? <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
        </span>
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 500,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{name}</span>
        <Icon.ChevronUp size={14} style={{
          transform: open ? "rotate(0deg)" : "rotate(180deg)",
          transition: "transform .15s",
          opacity: 0.6,
        }} />
      </button>

      {open && (
        <div role="menu" style={{
          position: "absolute",
          left: 0, right: 0,
          [align === "top" ? "bottom" : "top"]: "calc(100% + 6px)",
          background: "hsl(var(--card))", color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))", borderRadius: 10,
          boxShadow: "0 8px 24px -4px rgb(0 0 0 / .15)",
          padding: 4, zIndex: 50,
        }}>
          <DropdownItem icon={Icon.Settings} label="Config." onClick={handleConfig} />
          <DropdownItem icon={Icon.LogOut} label="Sair" onClick={handleLogout} />
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon: I, label, onClick }) => (
  <button
    type="button"
    role="menuitem"
    onClick={onClick}
    style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "8px 10px", fontSize: 13, fontFamily: "inherit",
      background: "transparent", color: "hsl(var(--foreground))",
      border: 0, borderRadius: 6,
      textAlign: "left", cursor: "pointer",
      transition: "background-color .15s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(var(--muted))"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
  >
    {I && <I size={14} style={{ color: "hsl(var(--muted-foreground))" }} />}
    <span>{label}</span>
  </button>
);

window.UserMenu = UserMenu;
