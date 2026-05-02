// ui_kits/default/components/base/ToggleGroup.jsx
// ToggleGroup — grupo de toggle buttons, single ou multiple selection.
// Props: items (array { value, label, icon? }), value (string|string[]), onChange,
//        type ("single"|"multiple"), size ("sm"|"md"), variant ("default"|"outline")

/* Inject CSS once */
if (typeof document !== "undefined" && !document.getElementById("toggle-group-css")) {
  const s = document.createElement("style");
  s.id = "toggle-group-css";
  s.textContent = `
    .toggle-group {
      display: inline-flex;
      align-items: center;
      border-radius: var(--radius-md, 8px);
      border: 1px solid hsl(var(--border));
      overflow: hidden;
      background: hsl(var(--background));
    }

    .toggle-group-item {
      flex: 1 1 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2, 8px);
      background: transparent;
      border: none;
      border-right: 1px solid hsl(var(--border));
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      color: hsl(var(--muted-foreground));
      transition:
        background var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1)),
        color var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
      white-space: nowrap;
    }
    .toggle-group-item:last-child {
      border-right: none;
    }
    .toggle-group-item:hover:not([aria-pressed="true"]):not(:disabled) {
      background: hsl(var(--muted) / .6);
      color: hsl(var(--foreground));
    }
    .toggle-group-item[aria-pressed="true"] {
      background: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    .toggle-group-item:focus-visible {
      outline: 2px solid hsl(var(--ring));
      outline-offset: -2px;
      z-index: 1;
    }
    .toggle-group-item:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .toggle-group-item:active:not(:disabled) {
      transform: scale(0.97);
    }

    /* Sizes */
    .toggle-group[data-size="sm"] .toggle-group-item {
      height: 32px;
      padding: 0 var(--space-3, 12px);
      font-size: 13px;
    }
    .toggle-group[data-size="md"] .toggle-group-item {
      height: 40px;
      padding: 0 var(--space-4, 16px);
      font-size: 14px;
    }

    /* Outline variant — no filled bg on selected, just border */
    .toggle-group[data-variant="outline"] .toggle-group-item[aria-pressed="true"] {
      background: hsl(var(--accent) / .12);
      color: hsl(var(--accent));
      font-weight: 600;
    }

    @media (prefers-reduced-motion: reduce) {
      .toggle-group-item { transition: none; }
    }
  `;
  document.head.appendChild(s);
}

const ToggleGroup = ({
  items = [],
  value,
  onChange,
  type = "single",
  size = "md",
  variant = "default",
  "aria-label": ariaLabel,
}) => {
  // Normalize value to Set for uniform handling
  const selected = React.useMemo(() => {
    if (type === "multiple") return new Set(Array.isArray(value) ? value : value ? [value] : []);
    return new Set(value ? [value] : []);
  }, [value, type]);

  const handleClick = (itemValue) => {
    if (!onChange) return;
    if (type === "single") {
      // click active item again = deselect
      onChange(selected.has(itemValue) ? null : itemValue);
    } else {
      const next = new Set(selected);
      if (next.has(itemValue)) next.delete(itemValue);
      else next.add(itemValue);
      onChange(Array.from(next));
    }
  };

  return (
    <div
      className="toggle-group"
      data-size={size}
      data-variant={variant}
      role="group"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const isPressed = selected.has(item.value);
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            className="toggle-group-item"
            role="button"
            aria-pressed={isPressed}
            disabled={item.disabled}
            onClick={() => handleClick(item.value)}
            aria-label={item.ariaLabel || (Icon && !item.label ? item.value : undefined)}
          >
            {Icon && <Icon size={size === "sm" ? 14 : 16} />}
            {item.label && <span>{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

window.ToggleGroup = ToggleGroup;
