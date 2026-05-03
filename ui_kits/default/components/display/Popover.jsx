// ui_kits/default/components/display/Popover.jsx
// Popover — click-triggered floating panel anchored to a trigger element.
// When to use: contextual menus, filter forms, color pickers, inline rich content.
// When NOT to use: persistent navigation (Sidebar). Single-line hint (Tooltip). Modal task (Dialog).

const Popover = ({ trigger, children, side = "bottom", align = "start" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const panelPos = side === "top"
    ? { bottom: "calc(100% + 6px)" }
    : { top: "calc(100% + 6px)" };
  const alignPos = align === "end" ? { right: 0 } : align === "center" ? { left: "50%", transform: "translateX(-50%)" } : { left: 0 };

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <span onClick={() => setOpen((v) => !v)}>{trigger}</span>
      {open && (
        <div style={{
          position: "absolute", ...panelPos, ...alignPos,
          minWidth: 200, zIndex: 100,
          background: "hsl(var(--card))", color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))", borderRadius: 10,
          boxShadow: "var(--shadow-popover)",
          padding: 6,
          animation: "dialog-pop .14s ease-out",
        }}>
          {typeof children === "function" ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </span>
  );
};

window.Popover = Popover;
