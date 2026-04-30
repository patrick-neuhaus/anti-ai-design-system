// ui_kits/default/components/base/Select.jsx
// Select — native <select> styled to match Input. Uses native dropdown for accessibility.
// When to use: 4–20 known options, single choice, no search.
// When NOT to use: <4 options (use Radio). >20 or needs search (use Combobox — Round B).

const Select = ({ value, onChange, options = [], placeholder, size = "md", disabled = false, invalid = false, ...rest }) => {
  const heights = { sm: 32, md: 40, lg: 48 };
  const fontSizes = { sm: 13, md: 14, lg: 15 };
  const h = heights[size] ?? 40;
  const fs = fontSizes[size] ?? 14;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "100%",
          height: h,
          padding: "0 36px 0 12px",
          fontSize: fs,
          fontFamily: "inherit",
          color: "hsl(var(--foreground))",
          background: "hsl(var(--card))",
          border: `1px solid hsl(var(--${invalid ? "destructive" : "border"}))`,
          borderRadius: 8,
          outline: "none",
          appearance: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color .15s, box-shadow .15s",
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
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        color: "hsl(var(--muted-foreground))", pointerEvents: "none", display: "flex",
      }}>
        <Icon.ChevronDown size={16} />
      </span>
    </div>
  );
};

window.Select = Select;
