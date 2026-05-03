// ui_kits/default/components/navigation/Sidebar.jsx
// Sidebar — primary fill, accent left bar on active, eyebrow group labels.
// Brand-agnostic. Tokens only via hsl(var(--*)). Brand/user/nav arrive as props.
// Mobile (<768px): hamburger trigger + slide-in drawer + backdrop.
// Footer: usa UserMenu (avatar+nome+dropdown). Carrega UserMenu ANTES de Sidebar.

const initialsFrom = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "··";

const SidebarItem = ({ icon: I, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    /* W1.6 / F-INT-016: aria-label sempre presente; quando collapsed e o unico nome */
    aria-label={label}
    aria-current={active ? "page" : undefined}
    title={collapsed ? label : undefined}
    style={{
      position: "relative",
      display: "flex",
      gap: collapsed ? 0 : 12,
      alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
      padding: collapsed ? "10px 0" : "8px 12px",
      borderRadius: 10,
      background: active ? "hsl(var(--sidebar-accent))" : "transparent",
      color: active ? "hsl(var(--sidebar-foreground))" : "hsl(var(--sidebar-foreground) / .7)",
      fontSize: 14,
      fontWeight: 500,
      border: 0,
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1)), color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "hsl(var(--sidebar-accent) / .5)";
        e.currentTarget.style.color = "hsl(var(--sidebar-foreground))";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "hsl(var(--sidebar-foreground) / .7)";
      }
    }}
  >
    {active && (
      <span aria-hidden="true" style={{
        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
        width: 3, height: 20,
        background: "hsl(var(--sidebar-indicator))",
        borderRadius: "0 4px 4px 0",
      }}/>
    )}
    <I size={18} aria-hidden="true" />
    {!collapsed && <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{label}</span>}
  </button>
);

const SidebarGroup = ({ label, children, collapsed }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 14 }}>
    {!collapsed && (
      <div style={{
        padding: "0 12px 6px",
        fontSize: 10, fontWeight: 600, letterSpacing: ".08em",
        textTransform: "uppercase",
        color: "hsl(var(--sidebar-foreground) / .4)",
      }}>{label}</div>
    )}
    {children}
  </div>
);

const DEFAULT_GROUPS = [
  { label: "Operação", items: [
    { key: "dashboard", icon: Icon.LayoutDashboard, label: "Dashboard" },
    { key: "deliveries", icon: Icon.Package, label: "Deliveries" },
    { key: "romaneios", icon: Icon.FileText, label: "Romaneios" },
    { key: "conferencia", icon: Icon.ScanBarcode, label: "Conferência" },
    { key: "carregamento", icon: Icon.ClipboardCheck, label: "Carregamento" },
    { key: "import", icon: Icon.Upload, label: "Importação" },
  ]},
  { label: "Cadastros", items: [
    { key: "transportadoras", icon: Icon.Truck, label: "Transportadoras" },
    { key: "rotas", icon: Icon.Route, label: "Rotas" },
    { key: "skus", icon: Icon.Box, label: "SKUs" },
  ]},
  { label: "Administração", items: [
    { key: "usuarios", icon: Icon.Users, label: "Usuários" },
    { key: "motivos", icon: Icon.AlertCircle, label: "Motivos" },
    { key: "config", icon: Icon.Settings, label: "Config. Sistema" },
  ]},
];

const Sidebar = ({
  active, onNavigate, collapsed, onToggleCollapse, onLogout, onConfig,
  brand, user, groups,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } else {
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  const navGroups = groups ?? DEFAULT_GROUPS;
  const userName = user?.name ?? "Nome Sobrenome";
  const userEmail = user?.email ?? "email@exemplo.com";
  const userInitials = initialsFrom(userName);
  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";
  const markSrc = brand?.mark ?? "../../assets/placeholder-mark.svg";
  const brandAlt = brand?.name ?? "App";

  const handleNavigate = (key) => {
    onNavigate?.(key);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    onLogout?.();
    if (isMobile) setMobileOpen(false);
  };

  // — MOBILE: hamburger + drawer + backdrop —
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          style={{
            position: "fixed", top: 14, left: 14, zIndex: 100,
            width: 40, height: 40, borderRadius: 10,
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            display: mobileOpen ? "none" : "flex",
            alignItems: "center", justifyContent: "center",
            color: "hsl(var(--foreground))",
            cursor: "pointer",
            boxShadow: "var(--shadow-sidebar)",
            padding: 0,
          }}
        >
          <Icon.Menu size={20} />
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0,
              background: "var(--overlay-backdrop)",
              zIndex: 90,
            }}
          />
        )}

        <aside
          aria-hidden={!mobileOpen}
          style={{
            position: "fixed", top: 0, left: 0, bottom: 0,
            width: 280, zIndex: 95,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform .25s ease-out",
            background: "hsl(var(--sidebar-background))",
            color: "hsl(var(--sidebar-foreground))",
            padding: "14px 12px",
            display: "flex", flexDirection: "column",
            boxShadow: mobileOpen ? "var(--shadow-drawer)" : "none",
          }}
        >
          <div style={{ position: "relative", padding: "8px 4px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={logoSrc} alt={brandAlt} style={{ height: 28 }} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: "transparent", border: 0,
                color: "hsl(var(--sidebar-foreground))",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Icon.X size={20} />
            </button>
          </div>

          <nav style={{ flex: 1, overflowY: "auto", marginTop: 4 }}>
            {navGroups.map((g) => (
              <SidebarGroup key={g.label} label={g.label} collapsed={false}>
                {g.items.map((it) => (
                  <SidebarItem
                    key={it.key} icon={it.icon} label={it.label} collapsed={false}
                    active={active === it.key}
                    onClick={() => handleNavigate(it.key)}
                  />
                ))}
              </SidebarGroup>
            ))}
          </nav>

          <div style={{ paddingTop: 10, marginTop: 10 }}>
            <UserMenu user={user} onConfig={onConfig} onLogout={handleLogout} collapsed={false} align="top" />
          </div>
        </aside>
      </>
    );
  }

  // — DESKTOP —
  const width = collapsed ? 72 : 272;
  return (
    <aside style={{
      width, flexShrink: 0,
      background: "hsl(var(--sidebar-background))",
      color: "hsl(var(--sidebar-foreground))",
      height: "100vh",
      position: "sticky", top: 0,
      padding: "14px 12px",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid hsl(var(--sidebar-border))",
      transition: "width .25s ease-in-out",
      position: "relative",
    }}>
      {/* Collapse toggle — centrado na divisória vertical */}
      <button
        onClick={onToggleCollapse}
        aria-label="Toggle sidebar"
        style={{
          position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)",
          width: 24, height: 24, borderRadius: "50%",
          background: "hsl(var(--sidebar-foreground))",
          color: "hsl(var(--sidebar-background))",
          border: "1px solid hsl(var(--border))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-control)",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {collapsed ? <Icon.ChevronRight size={14} /> : <Icon.ChevronLeft size={14} />}
      </button>

      {/* W1.6 / F-INT-019: collapsed brand mais limpo — height proporcional, mark sem box,
          alinhamento centralizado pra nao ficar torto. */}
      <div style={{ padding: collapsed ? "8px 0" : "8px 4px", height: collapsed ? 56 : 88, display: "flex", alignItems: "center", justifyContent: "center", transition: "height var(--motion-normal,200ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))" }}>
        {collapsed ? (
          <img src={markSrc} alt={brandAlt} style={{ width: 32, height: 32, objectFit: "contain", display: "block" }} />
        ) : (
          <img src={logoSrc} alt={brandAlt} style={{ height: 28 }} />
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", marginTop: 4 }}>
        {navGroups.map((g) => (
          <SidebarGroup key={g.label} label={g.label} collapsed={collapsed}>
            {g.items.map((it) => (
              <SidebarItem key={it.key} icon={it.icon} label={it.label} collapsed={collapsed}
                active={active === it.key} onClick={() => onNavigate?.(it.key)} />
            ))}
          </SidebarGroup>
        ))}
      </nav>

      <div style={{ paddingTop: 10, marginTop: 10 }}>
        <UserMenu user={user} onConfig={onConfig} onLogout={onLogout} collapsed={collapsed} align="top" />
      </div>
    </aside>
  );
};

window.Sidebar = Sidebar;
window.DEFAULT_SIDEBAR_GROUPS = DEFAULT_GROUPS;
