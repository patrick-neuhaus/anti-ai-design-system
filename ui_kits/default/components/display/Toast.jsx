// ui_kits/default/components/display/Toast.jsx
// Toast + ToastHost — ephemeral feedback strip. Use via window.toast(msg, opts).
// When to use: post-action confirmation ("Saved"), recoverable error ("Couldn't save — retry?").
// When NOT to use: persistent state (Alert). Modal blocking confirmation (Dialog — Round D).

const TOAST_INTENTS = {
  info:        { icon: Icon.AlertCircle,  color: "hsl(var(--info))" },
  success:     { icon: Icon.CheckCircle,  color: "hsl(var(--success))" },
  warning:     { icon: Icon.AlertTriangle, color: "hsl(var(--warning-foreground))" },
  destructive: { icon: Icon.XCircle,      color: "hsl(var(--destructive))" },
};

const ToastItem = ({ toast, onDismiss }) => {
  const c = TOAST_INTENTS[toast.intent ?? "info"] ?? TOAST_INTENTS.info;
  const I = c.icon;
  return (
    <div role="status" style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      padding: "12px 14px",
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderLeft: `3px solid ${c.color}`,
      borderRadius: 10,
      boxShadow: "var(--shadow-toast)",
      minWidth: 280, maxWidth: 420,
      color: "hsl(var(--foreground))",
      fontSize: 13,
    }}>
      <span style={{ color: c.color, display: "flex", marginTop: 1 }}><I size={16} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <div style={{ fontWeight: 600, marginBottom: toast.body ? 2 : 0 }}>{toast.title}</div>}
        {toast.body && <div style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.4 }}>{toast.body}</div>}
      </div>
      <button onClick={() => onDismiss(toast.id)} aria-label="Dismiss"
        style={{ background: "transparent", border: 0, color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 2, display: "flex" }}>
        <Icon.X size={12} />
      </button>
    </div>
  );
};

const ToastHost = () => {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const push = (e) => {
      const t = e.detail;
      setToasts((arr) => [...arr, t]);
      if (t.duration !== 0) {
        setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== t.id)), t.duration ?? 4000);
      }
    };
    window.addEventListener("__toast", push);
    return () => window.removeEventListener("__toast", push);
  }, []);

  const dismiss = (id) => setToasts((arr) => arr.filter((x) => x.id !== id));

  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8,
      pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastItem toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
};

// Imperative API
window.toast = (input, opts = {}) => {
  const t = typeof input === "string"
    ? { title: input, ...opts, id: Math.random().toString(36).slice(2) }
    : { ...input, ...opts, id: Math.random().toString(36).slice(2) };
  window.dispatchEvent(new CustomEvent("__toast", { detail: t }));
};

window.ToastHost = ToastHost;
