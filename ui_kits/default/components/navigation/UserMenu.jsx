// ui_kits/default/components/navigation/UserMenu.jsx
// UserMenu — 2-row card pattern (dwg-insight inspired, validated em CRM template).
// Row 1: avatar + name (clickable -> profile) + optional theme toggle (icon-only).
// Row 2: Configurações + Sair full-width buttons (label visivel).
// Collapsed: tudo stacked icon-only (avatar -> theme -> settings -> logout).
//
// When to use: footer da Sidebar logada (substitui dropdown legacy).
// When NOT to use: header marketing (use NavLink + Button). Avatar puro em outros contextos.
//
// Boundary: este componente assume que vive dentro de .sidebar (CSS herda --sidebar-foreground etc).

const initialsFromName = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "··";

/* Inject CSS once. Tokens-driven, fallback chain garante funcionar mesmo
   quando preset nao declarou --sidebar-accent-foreground (DR-01 sec 82-90). */
if (typeof document !== "undefined" && !document.getElementById("aa-user-menu-css")) {
  const s = document.createElement("style");
  s.id = "aa-user-menu-css";
  s.textContent = `
    .aa-user-panel {
      flex-shrink: 0;
      display: flex; flex-direction: column; gap: 10px;
      padding: 12px; margin-top: 8px;
      border-radius: 16px;
      background: hsl(var(--sidebar-accent));
      border: 1px solid hsl(var(--sidebar-border));
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground)));
      min-width: 0; position: relative;
      transition: border-color 150ms, box-shadow 150ms;
    }
    .aa-user-panel.account-active::before {
      content: ""; position: absolute; left: -14px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 20px;
      background: hsl(var(--sidebar-indicator));
      border-radius: 0 3px 3px 0;
    }
    .aa-user-panel-row1 { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .aa-user-panel-row2 { display: flex; gap: 6px; }
    .aa-user-panel-clickable {
      flex: 1; display: flex; align-items: center; gap: 10px;
      min-width: 0; cursor: pointer; padding: 0;
      background: none; border: none; color: inherit;
      text-align: left; font-family: inherit;
      transition: transform var(--motion-fast,150ms) var(--ease-out, cubic-bezier(0,0,.2,1));
    }
    .aa-user-panel-clickable:active { transform: scale(0.97); }
    .aa-user-panel-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: hsl(var(--accent)/.3);
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground)));
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-mono, monospace);
      font-weight: 600; font-size: 12px;
      border: 1px solid hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))/.3);
      flex-shrink: 0; overflow: hidden;
    }
    .aa-user-panel-info { flex: 1; min-width: 0; overflow: hidden; }
    .aa-user-panel-name {
      font-size: 13px; font-weight: 600;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .aa-user-action-btn {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))/.7);
      transition: background 120ms, color 120ms, transform var(--motion-fast,150ms);
      cursor: pointer; background: none; border: none; padding: 0;
      font-family: inherit; flex-shrink: 0;
    }
    .aa-user-action-btn:hover {
      background: hsl(var(--sidebar-background)/.5);
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground)));
    }
    .aa-user-action-btn:active { transform: scale(0.92); }
    .aa-user-action-btn-wide {
      flex: 1; display: flex; align-items: center; justify-content: center;
      gap: 6px; padding: 8px 10px; border-radius: 8px;
      font-size: 12px;
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground))/.7);
      background: none; border: none; cursor: pointer;
      transition: background 120ms, color 120ms, transform var(--motion-fast,150ms);
      font-family: inherit; white-space: nowrap;
    }
    .aa-user-action-btn-wide:hover {
      background: hsl(var(--sidebar-background)/.4);
      color: hsl(var(--sidebar-accent-foreground, var(--sidebar-foreground)));
    }
    .aa-user-action-btn-wide:active { transform: scale(0.96); }
    .aa-user-action-btn-wide svg { flex-shrink: 0; opacity: .85; }
    /* Collapsed variant: stack vertical icon-only */
    .aa-user-panel.is-collapsed { padding: 8px 6px; gap: 6px; border-radius: 12px; }
    .aa-user-panel.is-collapsed .aa-user-panel-info { display: none; }
    .aa-user-panel.is-collapsed .aa-user-panel-row1 { flex-direction: column; gap: 6px; align-items: center; }
    .aa-user-panel.is-collapsed .aa-user-panel-clickable { flex: 0 0 auto; justify-content: center; gap: 0; }
    .aa-user-panel.is-collapsed .aa-user-panel-row2 { flex-direction: column; gap: 4px; }
    .aa-user-panel.is-collapsed .aa-user-action-btn-wide { padding: 0; width: 32px; height: 32px; align-self: center; }
    .aa-user-panel.is-collapsed .aa-user-action-btn-wide span { display: none; }
    .aa-user-panel.is-collapsed .aa-user-panel-avatar { width: 30px; height: 30px; font-size: 10px; }
    /* Focus */
    .aa-user-panel-clickable:focus-visible,
    .aa-user-action-btn:focus-visible,
    .aa-user-action-btn-wide:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(s);
}

const UserMenu = ({
  user,
  onProfile,
  onConfig,
  onLogout,
  onToggleTheme,
  themeMode,
  active = false,
  collapsed = false,
}) => {
  const name = user?.name ?? "Usuário";
  const avatarUrl = user?.avatarUrl;
  const initials = initialsFromName(name);

  return (
    <div className={`aa-user-panel${active ? " account-active" : ""}${collapsed ? " is-collapsed" : ""}`}>
      <div className="aa-user-panel-row1">
        <button
          type="button"
          className="aa-user-panel-clickable"
          onClick={onProfile}
          title="Meu perfil"
          aria-label={`Perfil de ${name}`}
        >
          <span className="aa-user-panel-avatar">
            {avatarUrl
              ? <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </span>
          <span className="aa-user-panel-info">
            <span className="aa-user-panel-name">{name}</span>
          </span>
        </button>
        {onToggleTheme && (
          <button
            type="button"
            className="aa-user-action-btn"
            title={themeMode === "light" ? "Modo escuro" : "Modo claro"}
            aria-label="Alternar tema"
            onClick={onToggleTheme}
          >
            {themeMode === "light" ? <Icon.Moon size={14} /> : <Icon.Sun size={14} />}
          </button>
        )}
      </div>
      <div className="aa-user-panel-row2">
        <button
          type="button"
          className="aa-user-action-btn-wide"
          title="Configurações"
          onClick={onConfig}
        >
          <Icon.Settings size={14} />
          <span>Configurações</span>
        </button>
        <button
          type="button"
          className="aa-user-action-btn-wide"
          title="Sair"
          onClick={onLogout}
        >
          <Icon.LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

window.UserMenu = UserMenu;
