// ui_kits/default/components/base/Checkbox.jsx
// Checkbox — multi-select boolean. Pair with a label.
// When to use: 0..N from a set; opt-in toggles in forms.
// When NOT to use: mutually-exclusive choice (Radio). On/off setting (Switch).

const Checkbox = ({ checked, onChange, label, disabled = false, ...rest }) => {
  const id = React.useId();
  return (
    <label htmlFor={id} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: 14, color: "hsl(var(--foreground))",
    }}>
      <span style={{ position: "relative", display: "inline-flex", width: 18, height: 18 }}>
        <input
          id={id}
          type="checkbox"
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }}
          {...rest}
        />
        <span aria-hidden="true" style={{
          width: 18, height: 18, borderRadius: 4,
          background: checked ? "hsl(var(--primary))" : "hsl(var(--card))",
          border: `1px solid hsl(var(--${checked ? "primary" : "border"}))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "hsl(var(--primary-foreground))",
          transition: "background-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1)), border-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
        }}>
          {checked && <Icon.Check size={12} />}
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};

window.Checkbox = Checkbox;
