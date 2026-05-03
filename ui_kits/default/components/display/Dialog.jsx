// ui_kits/default/components/display/Dialog.jsx
// Dialog — modal overlay for blocking confirmation/forms.
// When to use: critical confirms, focused single-task forms, destructive actions.
// When NOT to use: ephemeral feedback (Toast). Persistent settings (own screen). Side-panel detail (Drawer).

// Focus trap helpers — F-RP-014
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Dialog = ({ open, onClose, title, description, children, footer, size = "md", dismissable = true }) => {
  const dialogRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    /* Store element that opened the dialog for focus restore */
    triggerRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* Move focus into dialog */
    const rafId = requestAnimationFrame(() => {
      if (dialogRef.current) {
        const first = dialogRef.current.querySelectorAll(FOCUSABLE)[0];
        if (first) first.focus();
      }
    });

    const onKey = (e) => {
      if (e.key === "Escape" && dismissable) { onClose?.(); return; }
      /* Focus trap — cycle through focusable elements */
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE));
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
      document.body.style.overflow = prev;
      /* Restore focus to trigger element */
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
      }
    };
  }, [open, dismissable, onClose]);

  if (!open) return null;
  const widths = { sm: 360, md: 480, lg: 640 };
  const titleId = title ? "dialog-title-" + Math.random().toString(36).slice(2, 7) : undefined;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}
      onClick={dismissable ? onClose : undefined}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "var(--overlay-backdrop)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "dialog-fade var(--motion-fast,150ms) var(--ease-out, cubic-bezier(0,0,.2,1))",
      }}
    >
      <div ref={dialogRef} onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: widths[size] ?? widths.md,
        background: "hsl(var(--card))", color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))", borderRadius: "var(--radius-xl, 16px)",
        boxShadow: "var(--shadow-dialog)",
        overflow: "hidden",
        animation: "dialog-pop var(--motion-fast,150ms) var(--ease-out, cubic-bezier(0,0,.2,1))",
      }}>
        {(title || dismissable) && (
          <header style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 20px 0" }}>
            <div style={{ flex: 1 }}>
              {title && <div id={titleId} style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
              {description && <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{description}</div>}
            </div>
            {dismissable && (
              <button onClick={onClose} aria-label="Fechar diálogo"
                style={{ background: "transparent", border: 0, color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 4, display: "flex" }}>
                <Icon.X size={14} />
              </button>
            )}
          </header>
        )}
        <div style={{ padding: 20, fontSize: 14, lineHeight: 1.5 }}>{children}</div>
        {footer && (
          <footer style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 20px 20px", borderTop: "1px solid hsl(var(--border))" }}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

/* W3.4 / F-INT-007: reduced-motion local autocontido — Dialog/Drawer compartilham keyframes. */
if (typeof document !== "undefined" && !document.getElementById("dialog-keyframes")) {
  const s = document.createElement("style");
  s.id = "dialog-keyframes";
  s.textContent = `
    @keyframes dialog-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dialog-pop  { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) {
      @keyframes dialog-fade { from { opacity: 1; } to { opacity: 1; } }
      @keyframes dialog-pop  { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
    }
  `;
  document.head.appendChild(s);
}

window.Dialog = Dialog;
