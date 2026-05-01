// ui_kits/default/components/base/Textarea.jsx
// Textarea — multi-line text input.
// When to use: free-form prose, notes, descriptions, comments.
// When NOT to use: short single-line input (use Input). Rich text (out of scope — needs editor).

const Textarea = ({ value, defaultValue, onChange, readOnly, placeholder, rows = 4, disabled = false, invalid = false, ...rest }) => {
  const valueBindings = onChange
    ? { value: value ?? "", onChange }
    : value !== undefined
      ? { defaultValue: value, readOnly: readOnly ?? true }
      : defaultValue !== undefined
        ? { defaultValue, readOnly }
        : { readOnly };
  return (
  <textarea
    {...valueBindings}
    placeholder={placeholder}
    disabled={disabled}
    rows={rows}
    style={{
      width: "100%",
      padding: 12,
      fontSize: 14,
      fontFamily: "inherit",
      color: "hsl(var(--foreground))",
      background: "hsl(var(--card))",
      border: `1px solid hsl(var(--${invalid ? "destructive" : "border"}))`,
      borderRadius: 8,
      outline: "none",
      resize: "vertical",
      maxHeight: 320,
      lineHeight: 1.5,
      transition: "border-color .15s, box-shadow .15s",
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
  );
};

window.Textarea = Textarea;
