// ui_kits/default/components/base/Button.jsx
// Button — primary, secondary, outline, ghost, destructive variants × sm/md/lg sizes.
// When to use: any user-actionable click target with a verb.
// When NOT to use: navigation between routes (use NavLink). Pure toggles (use Switch/Checkbox).

const BTN_BASE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-2, 8px)",
  fontWeight: 500,
  border: "1px solid transparent",
  borderRadius: "var(--radius-lg, 12px)",
  cursor: "pointer",
  /* Use motion tokens — F-UI-003 / F-MO-008 */
  transition: "background-color var(--motion-fast, 150ms) var(--ease, cubic-bezier(.4,0,.2,1)), color var(--motion-fast, 150ms) var(--ease, cubic-bezier(.4,0,.2,1)), border-color var(--motion-fast, 150ms) var(--ease, cubic-bezier(.4,0,.2,1)), opacity var(--motion-fast, 150ms) var(--ease, cubic-bezier(.4,0,.2,1)), transform var(--motion-instant, 80ms) var(--ease-out, cubic-bezier(0,0,.2,1))",
  whiteSpace: "nowrap",
  fontFamily: "inherit",
  textDecoration: "none",
  /* Shadow token on hover — added via onMouseEnter/Leave below */
  userSelect: "none",
};

const BTN_SIZES = {
  sm: { height: 32, padding: "0 var(--space-3, 12px)", fontSize: 13, borderRadius: "var(--radius-sm, 6px)" },
  md: { height: 40, padding: "0 var(--space-4, 16px)", fontSize: 14, borderRadius: "var(--radius-md, 8px)" },
  lg: { height: 48, padding: "0 var(--space-5, 20px)", fontSize: 15, borderRadius: "var(--radius-lg, 12px)" },
};

/* Inject :active + loading styles once — F-CA-004 / F-MO-003.
   W3.4 / F-INT-007: reduced-motion local autocontido (nao depende de colors_and_type.css). */
if (typeof document !== "undefined" && !document.getElementById("btn-states-css")) {
  const s = document.createElement("style");
  s.id = "btn-states-css";
  s.textContent = `
    button:not([disabled]):active { transform: scale(0.97) translateY(1px); }
    .btn-loading { pointer-events: none; opacity: 0.75; }
    .btn-spinner {
      width: 14px; height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: btn-spin 0.6s linear infinite;
      flex-shrink: 0;
    }
    @keyframes btn-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      button:not([disabled]):active { transform: none; }
      .btn-spinner { animation-duration: 1.5s; }
    }
  `;
  document.head.appendChild(s);
}

const BTN_VARIANTS = {
  primary: {
    background: "hsl(var(--primary))",
    color: "hsl(var(--primary-foreground))",
    borderColor: "hsl(var(--primary))",
  },
  secondary: {
    background: "hsl(var(--secondary))",
    color: "hsl(var(--secondary-foreground))",
    borderColor: "hsl(var(--secondary))",
  },
  outline: {
    background: "transparent",
    color: "hsl(var(--foreground))",
    borderColor: "hsl(var(--border))",
  },
  ghost: {
    background: "transparent",
    color: "hsl(var(--foreground))",
    borderColor: "transparent",
  },
  destructive: {
    background: "hsl(var(--destructive))",
    color: "hsl(var(--destructive-foreground))",
    borderColor: "hsl(var(--destructive))",
  },
  /* accent — terracotta CTA. Use for primary call-to-action outside primary teal context. */
  accent: {
    background: "hsl(var(--accent))",
    color: "#fff",
    borderColor: "hsl(var(--accent))",
  },
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  iconLeft: IL,
  iconRight: IR,
  iconOnly = false,
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  fullWidth = false,
  "aria-label": ariaLabel,
  ...rest
}) => {
  const sz = BTN_SIZES[size] ?? BTN_SIZES.md;
  const vr = BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary;
  const iconOnlyPad = iconOnly ? { padding: 0, width: sz.height } : {};
  const isDisabled = disabled || loading;
  /* aria-label required for icon-only buttons — F-RP-013 */
  const a11yLabel = ariaLabel || (iconOnly && typeof children === "string" ? children : undefined);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={a11yLabel}
      aria-busy={loading || undefined}
      className={loading ? "btn-loading" : undefined}
      style={{
        ...BTN_BASE,
        ...sz,
        ...vr,
        ...iconOnlyPad,
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? "none" : "auto",
        /* N5: iconOnly precedence — square shape vence fullWidth (combo semanticamente nonsense) */
        width: iconOnly ? sz.height : (fullWidth ? "100%" : undefined),
      }}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && IL && <IL size={size === "sm" ? 14 : 16} />}
      {!iconOnly && children}
      {!loading && IR && <IR size={size === "sm" ? 14 : 16} />}
    </button>
  );
};

window.Button = Button;
