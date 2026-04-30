// ui_kits/default/components/display/Tooltip.jsx
// Tooltip — hover-revealed inline label. CSS-only via aria-label-style.
// When to use: clarify icon-only buttons, abbreviations, short hints.
// When NOT to use: long content (Popover). Mobile-only — tooltips don't trigger on touch.

const Tooltip = ({ content, side = "top", children }) => {
  const [hovered, setHovered] = React.useState(false);
  const positions = {
    top:    { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
  };
  return (
    <span style={{ position: "relative", display: "inline-flex" }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)} onBlur={() => setHovered(false)}>
      {children}
      {hovered && content && (
        <span role="tooltip" style={{
          position: "absolute", ...positions[side],
          background: "hsl(var(--foreground))", color: "hsl(var(--background))",
          fontSize: 11, fontWeight: 500, lineHeight: 1.4,
          padding: "4px 8px", borderRadius: 6,
          whiteSpace: "nowrap", pointerEvents: "none", zIndex: 100,
          boxShadow: "0 2px 8px rgb(0 0 0 / .2)",
        }}>{content}</span>
      )}
    </span>
  );
};

window.Tooltip = Tooltip;
