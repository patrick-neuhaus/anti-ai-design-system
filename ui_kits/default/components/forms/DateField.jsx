// ui_kits/default/components/forms/DateField.jsx
// DateField — native date input styled to match Input. No popover calendar.
// When to use: pick a single date in a form.
// When NOT to use: ranges (Round D — DateRangeField). Time-of-day (DateTimeField).

const DateField = ({ value, onChange, min, max, size = "md", disabled = false, invalid = false, ...rest }) => {
  const heights = { sm: 32, md: 40, lg: 48 };
  const fs = { sm: 13, md: 14, lg: 15 };
  const h = heights[size] ?? 40;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <span style={{
        position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
        color: "hsl(var(--muted-foreground))", display: "flex", pointerEvents: "none",
      }}>
        <Icon.Calendar size={14} />
      </span>
      <input
        type="date"
        value={value ?? ""}
        onChange={onChange}
        min={min} max={max}
        disabled={disabled}
        style={{
          width: "100%", height: h, padding: "0 12px 0 32px",
          fontSize: fs[size] ?? 14, fontFamily: "inherit",
          color: "hsl(var(--foreground))",
          background: "hsl(var(--card))",
          border: `1px solid hsl(var(--${invalid ? "destructive" : "border"}))`,
          borderRadius: 8, outline: "none",
          opacity: disabled ? 0.5 : 1,
          colorScheme: "light",
        }}
        onFocus={(e) => {
          if (!invalid) e.currentTarget.style.borderColor = "hsl(var(--ring))";
          e.currentTarget.style.boxShadow = `0 0 0 3px hsl(var(--${invalid ? "destructive" : "ring"}) / .15)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = `hsl(var(--${invalid ? "destructive" : "border"}))`;
          e.currentTarget.style.boxShadow = "none";
        }}
        {...rest}
      />
    </div>
  );
};

window.DateField = DateField;
