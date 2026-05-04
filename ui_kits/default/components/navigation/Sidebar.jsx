// ui_kits/default/components/navigation/Sidebar.jsx
// Sidebar — thin wrapper sobre aa-sidebar (canonical CSS in _aa-sidebar.css).
// Source of truth visual: _aa-sidebar.css. Componente apenas mapeia props -> classes.
// When to use: primary navigation aside em apps logados.
// When NOT to use: marketing site nav (use NavHeader). Tabs intra-page (use Tabs).
// Mobile (<768px): hamburger trigger + slide-in drawer + backdrop.
// Footer: UserMenu (carrega ANTES de Sidebar).

const Sidebar = ({
  /* Nav state */
  active,
  onNavigate,
  collapsed,
  onToggleCollapse,
  /* Footer (UserMenu) */
  onLogout,
  onConfig,
  onProfile,
  onToggleTheme,
  themeMode,
  accountActive,
  /* Brand slots */
  brand,
  /* user object */
  user,
  /* nav data */
  groups,
  /* Optional brand decorations */
  brandTag,        // string -> renders aa-sidebar__brand-text (e.g. "TEMPLATE")
  brandLogoTag,    // string -> renders aa-sidebar__logo-tag (rotated diagonal, e.g. "CRM")
  brandHref,       // string -> renders "← DS" link iframe-only (parent != self check)
  brandLogoNode,   // ReactNode -> custom logo (overrides brand.logo img)
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

  const navGroups = groups ?? window.DEFAULT_SIDEBAR_GROUPS;
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

  /* Iframe-only "← DS" back link (linha 783-803 CRM template) */
  const showBackLink = brandHref &&
    typeof window !== "undefined" &&
    window.parent !== window;

  /* Brand block (logo + tag diagonal + back link) — shared mobile/desktop */
  const renderBrand = () => (
    <div className="aa-sidebar__brand">
      <div className="aa-sidebar__logo-wrap">
        {brandLogoNode
          ? brandLogoNode
          : <img src={collapsed ? markSrc : logoSrc} alt={brandAlt} style={{ height: collapsed ? 28 : 22, display: "block" }} />}
        {!collapsed && brandLogoTag && (
          <span className="aa-sidebar__logo-tag">{brandLogoTag}</span>
        )}
      </div>
      {!collapsed && brandTag && (
        <span className="aa-sidebar__brand-text">{brandTag}</span>
      )}
      {showBackLink && !collapsed && (
        <a href={brandHref}
          target="_top"
          title="Voltar para o showcase"
          style={{
            marginLeft: "auto",
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, fontFamily: "var(--font-mono)",
            letterSpacing: ".06em", textTransform: "uppercase",
            color: "hsl(var(--sidebar-foreground) / .5)",
            textDecoration: "none",
            padding: "2px 6px", borderRadius: 4,
            border: "1px solid hsl(var(--sidebar-foreground) / .15)",
            transition: "opacity 150ms",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = ""}
        >← DS</a>
      )}
    </div>
  );

  /* Nav items rendering */
  const renderNav = (compact) => (
    <nav className="aa-sidebar__nav">
      {navGroups.map((g) => (
        <React.Fragment key={g.label}>
          <div className="aa-sidebar__group-label">{g.label}</div>
          {g.items.map((it) => {
            const Icon = it.icon;
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => handleNavigate(it.key)}
                aria-label={it.label}
                aria-current={isActive ? "page" : undefined}
                title={compact ? it.label : undefined}
                className={`aa-sidebar__item${isActive ? " is-active" : ""}`}
              >
                <Icon className="aa-sidebar__item-icon" size={16} />
                <span className="aa-sidebar__item-label">{it.label}</span>
                {it.badge != null && (
                  <span className="aa-sidebar__item-badge">{it.badge}</span>
                )}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );

  const renderFooter = (compact) => (
    <div className="aa-sidebar__footer">
      <UserMenu
        user={user}
        onProfile={onProfile}
        onConfig={onConfig}
        onLogout={isMobile ? handleLogout : onLogout}
        onToggleTheme={onToggleTheme}
        themeMode={themeMode}
        active={accountActive}
        collapsed={compact}
      />
    </div>
  );

  // — MOBILE: hamburger + drawer + backdrop —
  if (isMobile) {
    return (
      <>
        <button
          className="aa-sidebar__hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          style={{ display: mobileOpen ? "none" : "flex" }}
        >
          <Icon.Menu size={20} />
        </button>
        {mobileOpen && (
          <div
            className="aa-sidebar__backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={`aa-sidebar aa-sidebar--drawer${mobileOpen ? " is-open" : ""}`}
          aria-hidden={!mobileOpen}
        >
          <div style={{ position: "relative", padding: "8px 4px", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {brandLogoNode || <img src={logoSrc} alt={brandAlt} style={{ height: 28 }} />}
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
          {renderNav(false)}
          {renderFooter(false)}
        </aside>
      </>
    );
  }

  // — DESKTOP —
  return (
    <aside className={`aa-sidebar aa-sidebar--sticky${collapsed ? " is-collapsed" : ""}`}>
      <button
        className="aa-sidebar__toggle"
        onClick={onToggleCollapse}
        title={collapsed ? "Expandir" : "Recolher"}
        aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        type="button"
      >
        {collapsed ? <Icon.ChevronRight size={14} /> : <Icon.ChevronLeft size={14} />}
      </button>
      {renderBrand()}
      {renderNav(collapsed)}
      {renderFooter(collapsed)}
    </aside>
  );
};

window.Sidebar = Sidebar;
