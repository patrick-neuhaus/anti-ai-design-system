// ui_kits/default/components/base/Switch.jsx
// Switch — on/off toggle for settings (effect typically immediate).
// When to use: persistent setting that takes effect now (notifications on, dark mode).
// When NOT to use: form submit toggle (Checkbox). One of N (Radio).

const Switch = ({ checked, onChange, label, disabled = false, ...rest }) => {
  const id = React.useId();
  return (
    <label htmlFor={id} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: 14, color: "hsl(var(--foreground))",
    }}>
      <span style={{ position: "relative", display: "inline-block", width: 36, height: 20 }}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={!!checked}
          onChange={onChange}
          disabled={disabled}
          style={{ position: "absolute", inset: 0, opacity: 0, margin: 0, cursor: "inherit" }}
          {...rest}
        />
        <span aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: checked ? "hsl(var(--primary))" : "hsl(var(--muted))",
          borderRadius: 999,
          transition: "background-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
        }}/>
        <span aria-hidden="true" style={{
          position: "absolute", top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: "50%",
          background: "hsl(var(--card))",
          boxShadow: "var(--shadow-control)",
          transition: "left var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
        }}/>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
};

window.Switch = Switch;
