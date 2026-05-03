// ui_kits/default/components/display/Alert.jsx
// Alert — page-level inline feedback strip (info, success, warning, error).
// When to use: persistent state messaging on a screen ("Verification pending — 2 days left").
// When NOT to use: ephemeral feedback (Toast — Round B). Form-field errors (FormField error prop).

const ALERT_INTENTS = {
  info: { bg: "hsl(var(--info) / .08)", border: "hsl(var(--info) / .25)", fg: "hsl(var(--info))", icon: Icon.AlertCircle },
  success: { bg: "hsl(var(--success) / .08)", border: "hsl(var(--success) / .25)", fg: "hsl(var(--success))", icon: Icon.CheckCircle },
  warning: { bg: "hsl(var(--warning) / .12)", border: "hsl(var(--warning) / .35)", fg: "hsl(var(--warning-foreground))", icon: Icon.AlertTriangle },
  destructive: { bg: "hsl(var(--destructive) / .08)", border: "hsl(var(--destructive) / .25)", fg: "hsl(var(--destructive))", icon: Icon.XCircle },
};

const Alert = ({ children, title, intent = "info", icon: IconOverride, onClose }) => {
  const c = ALERT_INTENTS[intent] ?? ALERT_INTENTS.info;
  const I = IconOverride ?? c.icon;
  return (
    <div role="alert" style={{
      display: "flex", gap: 12,
      padding: 12,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "var(--radius-md, 8px)",
      color: "hsl(var(--foreground))",
    }}>
      {I && (
        <span style={{ display: "flex", color: c.fg, marginTop: 1 }}>
          <I size={18} />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 14, fontWeight: 600, marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss alert" style={{
          background: "transparent", border: 0, padding: 4, borderRadius: 4,
          color: "hsl(var(--muted-foreground))", cursor: "pointer", display: "flex",
          alignSelf: "flex-start",
        }}>
          <Icon.X size={14} />
        </button>
      )}
    </div>
  );
};

window.Alert = Alert;
