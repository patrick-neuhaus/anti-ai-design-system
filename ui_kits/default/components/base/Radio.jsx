// ui_kits/default/components/base/Radio.jsx
// Radio — mutually-exclusive single choice. Use as group via RadioGroup.
// When to use: 2–4 short options visible at once.
// When NOT to use: 5+ options (Select). Visual layout (segmented control — out of scope here).

const Radio = ({ checked, onChange, label, name, value, disabled = false, ...rest }) => {
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
          type="radio"
          name={name}
          value={value}
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }}
          {...rest}
        />
        <span aria-hidden="true" style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "hsl(var(--card))",
          border: `1px solid hsl(var(--${checked ? "primary" : "border"}))`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
        }}>
          {checked && (
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(var(--primary))" }} />
          )}
        </span>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};

const RadioGroup = ({ children, direction = "vertical" }) => (
  <div style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap: direction === "horizontal" ? 16 : 8 }}>
    {children}
  </div>
);

window.Radio = Radio;
window.RadioGroup = RadioGroup;
