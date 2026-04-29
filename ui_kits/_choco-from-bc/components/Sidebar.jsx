// Sidebar — primary fill, accent left bar on active, eyebrow group labels.
// Recreates chocotracking/src/components/layout/AppSidebar.tsx visually.

const SidebarItem = ({ icon: I, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    style={{
      position: "relative",
      display: "flex",
      gap: collapsed ? 0 : 12,
      alignItems: "center",
      justifyContent: collapsed ? "center" : "flex-start",
      padding: collapsed ? "10px 0" : "8px 12px",
      borderRadius: 12,
      background: active ? "hsl(338 50% 30%)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,.7)",
      fontSize: 14,
      fontWeight: 500,
      border: 0,
      width: "100%",
      textAlign: "left",
      transition: "background-color .15s, color .15s",
    }}
    onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "hsl(338 50% 30% / .5)"; e.currentTarget.style.color = "#fff"; }}}
    onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.7)"; }}}
  >
    {active && (
      <span style={{
        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
        width: 3, height: 20, background: "hsl(33 47% 53%)", borderRadius: "0 4px 4px 0",
      }}/>
    )}
    <I size={18} />
    {!collapsed && <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{label}</span>}
  </button>
);

const SidebarGroup = ({ label, children, collapsed }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 14 }}>
    {!collapsed && (
      <div style={{
        padding: "0 12px 6px",
        fontSize: 10, fontWeight: 600, letterSpacing: ".08em",
        textTransform: "uppercase", color: "rgba(255,255,255,.4)",
      }}>{label}</div>
    )}
    {children}
  </div>
);

const NAV = {
  operacao: [
    { key: "dashboard", icon: Icon.LayoutDashboard, label: "Dashboard" },
    { key: "deliveries", icon: Icon.Package, label: "Deliveries" },
    { key: "romaneios", icon: Icon.FileText, label: "Romaneios" },
    { key: "conferencia", icon: Icon.ScanBarcode, label: "Conferência" },
    { key: "carregamento", icon: Icon.ClipboardCheck, label: "Carregamento" },
    { key: "import", icon: Icon.Upload, label: "Importação" },
  ],
  cadastros: [
    { key: "transportadoras", icon: Icon.Truck, label: "Transportadoras" },
    { key: "rotas", icon: Icon.Route, label: "Rotas" },
    { key: "skus", icon: Icon.Box, label: "SKUs" },
  ],
  admin: [
    { key: "usuarios", icon: Icon.Users, label: "Usuários" },
    { key: "motivos", icon: Icon.AlertCircle, label: "Motivos" },
    { key: "config", icon: Icon.Settings, label: "Config. Sistema" },
  ],
};

const Sidebar = ({ active, onNavigate, collapsed, onToggleCollapse, onLogout }) => {
  const width = collapsed ? 72 : 272;
  return (
    <aside style={{
      width, flexShrink: 0,
      background: "hsl(338 55% 23%)",
      color: "#fff",
      height: "100vh",
      position: "sticky", top: 0,
      padding: "14px 12px",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid hsl(338 50% 27%)",
      transition: "width .25s ease-in-out",
    }}>
      {/* Logo / collapse */}
      <div style={{ position: "relative", padding: "8px 4px", height: 44, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start" }}>
        {collapsed ? (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src="../../assets/bc-icon.jpg" alt="BC" style={{ width: 32, height: 32, objectFit: "contain" }} />
          </div>
        ) : (
          <img src="../../assets/barry-callebaut-logo.svg" alt="Default app" style={{ height: 28 }} />
        )}
        <button
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          style={{
            position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)",
            width: 24, height: 24, borderRadius: "50%",
            background: "#fff", color: "hsl(338 55% 23%)",
            border: "1px solid hsl(30 20% 87%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / .05)",
          }}
        >
          {collapsed ? <Icon.ChevronRight size={14} /> : <Icon.ChevronLeft size={14} />}
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", marginTop: 4 }}>
        <SidebarGroup label="Operação" collapsed={collapsed}>
          {NAV.operacao.map((it) => (
            <SidebarItem key={it.key} icon={it.icon} label={it.label} collapsed={collapsed}
              active={active === it.key} onClick={() => onNavigate(it.key)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Cadastros" collapsed={collapsed}>
          {NAV.cadastros.map((it) => (
            <SidebarItem key={it.key} icon={it.icon} label={it.label} collapsed={collapsed}
              active={active === it.key} onClick={() => onNavigate(it.key)} />
          ))}
        </SidebarGroup>
        <SidebarGroup label="Administração" collapsed={collapsed}>
          {NAV.admin.map((it) => (
            <SidebarItem key={it.key} icon={it.icon} label={it.label} collapsed={collapsed}
              active={active === it.key} onClick={() => onNavigate(it.key)} />
          ))}
        </SidebarGroup>
      </nav>

      {/* Footer: user + logout */}
      <div style={{ borderTop: "1px solid hsl(338 50% 27%)", paddingTop: 10, marginTop: 10 }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 8px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "hsl(33 47% 53%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff" }}>JP</div>
            <div style={{ minWidth: 0, lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>João Pereira</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>joao@barry-callebaut.com</div>
            </div>
          </div>
        )}
        <SidebarItem icon={Icon.LogOut} label="Sair" collapsed={collapsed} onClick={onLogout} />
      </div>
    </aside>
  );
};

window.Sidebar = Sidebar;
