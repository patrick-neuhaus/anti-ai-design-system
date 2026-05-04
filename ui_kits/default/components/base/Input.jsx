// ui_kits/default/components/base/Input.jsx
// Input — single-line text/email/password/number field with optional left/right adornments.
// When to use: any single-line text capture inside a form.
// When NOT to use: multi-line (use Textarea). Pre-defined value sets (use Select/Radio/Checkbox).

const Input = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = "text",
  size = "md",
  disabled = false,
  invalid = false,
  readOnly,
  iconLeft: IL,
  iconRight: IR,
  ...rest
}) => {
  const heights = { sm: 32, md: 40, lg: 48 };
  const fontSizes = { sm: 13, md: 14, lg: 15 };
  const h = heights[size] ?? 40;
  const fs = fontSizes[size] ?? 14;

  // Controlled vs uncontrolled bindings.
  // If onChange present → controlled (value required).
  // If value without onChange → uncontrolled with defaultValue + readOnly fallback.
  // If only defaultValue → uncontrolled.
  const valueBindings = onChange
    ? { value: value ?? "", onChange }
    : value !== undefined
      ? { defaultValue: value, readOnly: readOnly ?? true }
      : defaultValue !== undefined
        ? { defaultValue, readOnly }
        : { readOnly };

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
      {IL && (
        <span style={{ position: "absolute", left: 10, color: "hsl(var(--muted-foreground))", display: "flex" }}>
          <IL size={16} />
        </span>
      )}
      <input
        type={type}
        {...valueBindings}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          height: h,
          padding: `0 ${IR ? 36 : 12}px 0 ${IL ? 36 : 12}px`,
          fontSize: fs,
          fontFamily: "inherit",
          color: "hsl(var(--foreground))",
          background: "hsl(var(--card))",
          border: `1px solid hsl(var(--${invalid ? "destructive" : "border"}))`,
          borderRadius: 8,
          outline: "none",
          transition: "border-color var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1)), box-shadow var(--motion-fast,150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1))",
          opacity: disabled ? 0.5 : 1,
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
      {IR && (
        <span style={{ position: "absolute", right: 10, color: "hsl(var(--muted-foreground))", display: "flex" }}>
          <IR size={16} />
        </span>
      )}
    </div>
  );
};

window.Input = Input;
