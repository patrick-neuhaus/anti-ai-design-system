// ui_kits/default/components/forms/FormField.jsx
// FormField — wraps a label + control + helper/error text. Use for every field in a form.
// When to use: any labeled form input. Pairs with Input/Textarea/Select/Checkbox/Radio/Switch.
// When NOT to use: standalone control without label context (rare). Form-level errors (Alert).
//
// Live validation pattern — F-CA-005 / F-UX-011:
//   Pass `error` on blur, clear on change (onBlur + onChange pattern in parent).
//   `invalid` prop = true when field is visually invalid (border + icon + message).
//   `success` prop = true when field value is valid post-blur (green border).
//   `errorId` is auto-generated if not provided — links to aria-describedby.

const FormField = ({
  label,
  htmlFor,
  required = false,
  helper,
  error,
  success = false,
  id: fieldId,
  children,
}) => {
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  const helperId = fieldId ? `${fieldId}-helper` : undefined;
  const describedBy = [error && errorId, helper && helperId].filter(Boolean).join(" ") || undefined;

  /* Clone children to inject aria-describedby + aria-invalid */
  const wrappedChildren = React.Children.map(children, (child) => {
    if (!child || !child.props) return child;
    return React.cloneElement(child, {
      "aria-describedby": describedBy || child.props["aria-describedby"],
      "aria-invalid": error ? "true" : child.props["aria-invalid"],
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1-5, 6px)" }}>
      {label && (
        <label htmlFor={htmlFor} style={{
          fontSize: 13, fontWeight: 500,
          color: "hsl(var(--foreground))",
        }}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ color: "hsl(var(--destructive))", marginLeft: 4 }}>*</span>
          )}
        </label>
      )}
      {wrappedChildren}
      {error && (
        <div id={errorId} role="alert" style={{
          display: "flex", alignItems: "flex-start", gap: "var(--space-1, 4px)",
          fontSize: 12,
          color: "hsl(var(--destructive-text, 0 65% 35%))",
          lineHeight: 1.4,
        }}>
          {/* Alert icon */}
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm.75-4.75a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 1 1.5 0v1.5z"/>
          </svg>
          {error}
        </div>
      )}
      {!error && success && (
        <div id={helperId} style={{
          display: "flex", alignItems: "center", gap: "var(--space-1, 4px)",
          fontSize: 12,
          color: "hsl(var(--success-text, 152 60% 22%))",
          lineHeight: 1.4,
        }}>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.03 5.47-3.75 3.75a.75.75 0 0 1-1.06 0l-1.75-1.75a.75.75 0 1 1 1.06-1.06l1.22 1.22 3.22-3.22a.75.75 0 1 1 1.06 1.06z"/>
          </svg>
          Válido
        </div>
      )}
      {!error && !success && helper && (
        <div id={helperId} style={{
          fontSize: 12,
          color: "hsl(var(--muted-foreground))",
          lineHeight: 1.4,
        }}>
          {helper}
        </div>
      )}
    </div>
  );
};

window.FormField = FormField;
