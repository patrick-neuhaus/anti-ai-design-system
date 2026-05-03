// ui_kits/default/components/display/Drawer.jsx
// Drawer — side-panel for detail views, secondary content, filters.
// When to use: contextual detail without losing main page (item detail, filters, audit log).
// When NOT to use: blocking confirmation (Dialog). Persistent nav (Sidebar).

const Drawer = ({ open, onClose, side = "right", title, children, footer, width = 420 }) => {
  const drawerRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    /* Store trigger for focus restore — F-RP-014 */
    triggerRef.current = document.activeElement;

    /* Move focus into drawer */
    const rafId = requestAnimationFrame(() => {
      if (drawerRef.current) {
        const first = drawerRef.current.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )[0];
        if (first) first.focus();
      }
    });

    const onKey = (e) => {
      if (e.key === "Escape") { onClose?.(); return; }
      /* Focus trap */
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(drawerRef.current.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", onKey);
      /* Restore focus to trigger */
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  const isRight = side === "right";

  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--overlay-backdrop)", animation: "dialog-fade var(--motion-fast,150ms) var(--ease-out, cubic-bezier(0,0,.2,1))" }}
    >
      <aside ref={drawerRef} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={title || "Painel lateral"}
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
            <button onClick={onClose} aria-label="Fechar painel" style={{ background: "transparent", border: 0, color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 4, display: "flex" }}>
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
