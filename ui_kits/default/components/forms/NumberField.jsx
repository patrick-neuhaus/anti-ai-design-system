// ui_kits/default/components/forms/NumberField.jsx
// NumberField — numeric input with optional stepper buttons. Composes Input.
// When to use: integers/decimals with bounded range (qty, age, threshold).
// When NOT to use: free numeric strings (CPF, phone — use Input with mask). Currency (use NumberField + unit prop).

/* F-UX-020: stepper buttons target size bumped 24 → 32px width min */
const stepperBtn = (isUp) => ({
  flex: 1,
  minWidth: 32,  /* WCAG 2.5.8 target size */
  padding: "0 10px",
  background: "hsl(var(--muted))",
  color: "hsl(var(--muted-foreground))",
  border: 0,
  borderBottom: isUp ? "1px solid hsl(var(--border))" : "0",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "background var(--motion-fast, 150ms)",
});

const NumberField = ({
  value, onChange, min, max, step = 1,
  unit, prefix, size = "md",
  showStepper = true, disabled = false, invalid = false, ...rest
}) => {
  const heights = { sm: 32, md: 40, lg: 48 };
  const fs = { sm: 13, md: 14, lg: 15 };
  const h = heights[size] ?? 40;

  const clamp = (n) => {
    if (Number.isNaN(n)) return value;
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const bump = (delta) => {
    const next = clamp((Number(value) || 0) + delta);
    onChange?.({ target: { value: String(next) } }, next);
  };

  return (
    <div style={{
      display: "flex", alignItems: "stretch", width: "100%",
      border: `1px solid hsl(var(--${invalid ? "destructive" : "border"}))`,
      borderRadius: 8,
      background: "hsl(var(--card))",
      overflow: "hidden",
      opacity: disabled ? 0.5 : 1,
    }}>
      {prefix && (
        <span style={{
          display: "inline-flex", alignItems: "center", padding: "0 10px",
          background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))",
          fontSize: fs[size] ?? 14, borderRight: "1px solid hsl(var(--border))",
        }}>{prefix}</span>
      )}
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange?.(e, clamp(Number(e.target.value)))}
        disabled={disabled}
        min={min} max={max} step={step}
        style={{
          flex: 1, height: h, padding: "0 12px",
          fontSize: fs[size] ?? 14, fontFamily: "inherit",
          color: "hsl(var(--foreground))",
          background: "transparent", border: 0, outline: "none",
        }}
        {...rest}
      />
      {unit && (
        <span style={{
          display: "inline-flex", alignItems: "center", padding: "0 10px",
          color: "hsl(var(--muted-foreground))", fontSize: fs[size] ?? 14,
          borderLeft: "1px solid hsl(var(--border))",
        }}>{unit}</span>
      )}
      {showStepper && (
        <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid hsl(var(--border))" }}>
          {/* aria-label required on icon-only buttons — F-RP-013 */}
          <button type="button" aria-label="Aumentar" onClick={() => bump(step)} disabled={disabled} style={stepperBtn(true)}>
            <Icon.ChevronUp size={12} />
          </button>
          <button type="button" aria-label="Diminuir" onClick={() => bump(-step)} disabled={disabled} style={stepperBtn(false)}>
            <Icon.ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

window.NumberField = NumberField;
