// ui_kits/default/components/base/Button.jsx
// Button — primary, secondary, outline, ghost, destructive variants × sm/md/lg sizes.
// When to use: any user-actionable click target with a verb.
// When NOT to use: navigation between routes (use NavLink). Pure toggles (use Switch/Checkbox).

const BTN_BASE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontWeight: 500,
  border: "1px solid transparent",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background-color .15s, color .15s, border-color .15s, opacity .15s",
  whiteSpace: "nowrap",
  fontFamily: "inherit",
  textDecoration: "none",
};

const BTN_SIZES = {
  sm: { height: 32, padding: "0 12px", fontSize: 13, borderRadius: 6 },
  md: { height: 40, padding: "0 16px", fontSize: 14, borderRadius: 8 },
  lg: { height: 48, padding: "0 20px", fontSize: 15, borderRadius: 10 },
};

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
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  iconLeft: IL,
  iconRight: IR,
  iconOnly = false,
  disabled = false,
  type = "button",
  onClick,
  fullWidth = false,
  ...rest
}) => {
  const sz = BTN_SIZES[size] ?? BTN_SIZES.md;
  const vr = BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary;
  const iconOnlyPad = iconOnly ? { padding: 0, width: sz.height } : {};
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...BTN_BASE,
        ...sz,
        ...vr,
        ...iconOnlyPad,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        width: fullWidth ? "100%" : iconOnlyPad.width,
      }}
      {...rest}
    >
      {IL && <IL size={size === "sm" ? 14 : 16} />}
      {!iconOnly && children}
      {IR && <IR size={size === "sm" ? 14 : 16} />}
    </button>
  );
};

window.Button = Button;
