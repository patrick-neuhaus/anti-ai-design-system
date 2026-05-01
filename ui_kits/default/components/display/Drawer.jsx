// ui_kits/default/components/display/Drawer.jsx
// Drawer — side-panel for detail views, secondary content, filters.
// When to use: contextual detail without losing main page (item detail, filters, audit log).
// When NOT to use: blocking confirmation (Dialog). Persistent nav (Sidebar).

const Drawer = ({ open, onClose, side = "right", title, children, footer, width = 420 }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const isRight = side === "right";

  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgb(0 0 0 / .35)", animation: "dialog-fade .15s ease-out" }}
    >
      <aside onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, bottom: 0,
          [isRight ? "right" : "left"]: 0,
          width, maxWidth: "100vw",
          background: "hsl(var(--card))", color: "hsl(var(--card-foreground))",
          borderLeft: isRight ? "1px solid hsl(var(--border))" : 0,
          borderRight: isRight ? 0 : "1px solid hsl(var(--border))",
          display: "flex", flexDirection: "column",
          animation: `drawer-${side} .2s ease-out`,
        }}
      >
        {title && (
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid hsl(var(--border))" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
            <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: 0, color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 4, display: "flex" }}>
              <Icon.X size={14} />
            </button>
          </header>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{children}</div>
        {footer && (
          <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 20px", borderTop: "1px solid hsl(var(--border))" }}>
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
};

if (typeof document !== "undefined" && !document.getElementById("drawer-keyframes")) {
  const s = document.createElement("style");
  s.id = "drawer-keyframes";
  s.textContent = `
    @keyframes drawer-right { from { transform: translateX(100%); } to { transform: none; } }
    @keyframes drawer-left  { from { transform: translateX(-100%); } to { transform: none; } }
  `;
  document.head.appendChild(s);
}

window.Drawer = Drawer;
