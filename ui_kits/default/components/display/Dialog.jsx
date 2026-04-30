// ui_kits/default/components/display/Dialog.jsx
// Dialog — modal overlay for blocking confirmation/forms.
// When to use: critical confirms, focused single-task forms, destructive actions.
// When NOT to use: ephemeral feedback (Toast). Persistent settings (own screen). Side-panel detail (Drawer).

const Dialog = ({ open, onClose, title, description, children, footer, size = "md", dismissable = true }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && dismissable) onClose?.(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, dismissable, onClose]);

  if (!open) return null;
  const widths = { sm: 360, md: 480, lg: 640 };

  return (
    <div role="dialog" aria-modal="true"
      onClick={dismissable ? onClose : undefined}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgb(0 0 0 / .45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "dialog-fade .15s ease-out",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: widths[size] ?? widths.md,
        background: "hsl(var(--card))", color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))", borderRadius: 14,
        boxShadow: "0 24px 48px -12px rgb(0 0 0 / .35)",
        overflow: "hidden",
        animation: "dialog-pop .18s ease-out",
      }}>
        {(title || dismissable) && (
          <header style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 20px 0" }}>
            <div style={{ flex: 1 }}>
              {title && <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>}
              {description && <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{description}</div>}
            </div>
            {dismissable && (
              <button onClick={onClose} aria-label="Close"
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

if (typeof document !== "undefined" && !document.getElementById("dialog-keyframes")) {
  const s = document.createElement("style");
  s.id = "dialog-keyframes";
  s.textContent = `
    @keyframes dialog-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dialog-pop  { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(s);
}

window.Dialog = Dialog;
