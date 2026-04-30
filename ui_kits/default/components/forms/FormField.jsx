// ui_kits/default/components/forms/FormField.jsx
// FormField — wraps a label + control + helper/error text. Use for every field in a form.
// When to use: any labeled form input. Pairs with Input/Textarea/Select/Checkbox/Radio/Switch.
// When NOT to use: standalone control without label context (rare). Form-level errors (Alert).

const FormField = ({ label, htmlFor, required = false, helper, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
    {children}
    {(error || helper) && (
      <div style={{
        fontSize: 12,
        color: error ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))",
        lineHeight: 1.4,
      }}>
        {error || helper}
      </div>
    )}
  </div>
);

window.FormField = FormField;
