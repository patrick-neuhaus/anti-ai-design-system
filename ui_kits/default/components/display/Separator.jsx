// ui_kits/default/components/display/Separator.jsx
// Separator — divisor horizontal/vertical, decorative vs semantic.
// Props: orientation ("horizontal"|"vertical"), decorative (bool), label (string, optional)
// decorative=true → role="none", aria-hidden. decorative=false → role="separator".

/* Inject CSS once */
if (typeof document !== "undefined" && !document.getElementById("separator-css")) {
  const s = document.createElement("style");
  s.id = "separator-css";
  s.textContent = `
    .separator {
      flex-shrink: 0;
      background: hsl(var(--border));
    }
    .separator[data-orientation="horizontal"] {
      height: 1px;
      width: 100%;
      margin: var(--space-4, 16px) 0;
    }
    .separator[data-orientation="vertical"] {
      width: 1px;
      align-self: stretch;
      margin: 0 var(--space-4, 16px);
    }

    /* Label variant — centered text on a line */
    .separator-with-label {
      display: flex;
      align-items: center;
      gap: var(--space-3, 12px);
      margin: var(--space-4, 16px) 0;
    }
    .separator-with-label .separator-line {
      flex: 1;
      height: 1px;
      background: hsl(var(--border));
    }
    .separator-with-label .separator-label {
      font-size: 12px;
      font-family: var(--font-mono);
      color: hsl(var(--muted-foreground));
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(s);
}

const Separator = ({
  orientation = "horizontal",
  decorative = true,
  label,
  className,
  style,
}) => {
  if (label && orientation === "horizontal") {
    return (
      <div
        className={`separator-with-label${className ? ` ${className}` : ""}`}
        role={decorative ? "none" : "separator"}
        aria-hidden={decorative ? "true" : undefined}
        aria-orientation={!decorative ? orientation : undefined}
        style={style}
      >
        <span className="separator-line" aria-hidden="true" />
        <span className="separator-label">{label}</span>
        <span className="separator-line" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`separator${className ? ` ${className}` : ""}`}
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-hidden={decorative ? "true" : undefined}
      aria-orientation={!decorative ? orientation : undefined}
      style={style}
    />
  );
};

window.Separator = Separator;
