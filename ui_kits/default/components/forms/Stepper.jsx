// ui_kits/default/components/forms/Stepper.jsx
// Stepper — horizontal multi-step indicator for wizards.
// When to use: 3-7 step linear flows (checkout, onboarding, multi-page form).
// When NOT to use: navigation between siblings (Tabs). Single-form pages (FormField only).

const Stepper = ({ steps = [], current = 0, onClick }) => (
  <ol style={{ display: "flex", listStyle: "none", padding: 0, margin: 0, gap: 0, width: "100%" }}>
    {steps.map((s, i) => {
      const done = i < current;
      const active = i === current;
      const clickable = !!onClick && i <= current;
      return (
        <li key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <button type="button" disabled={!clickable} onClick={clickable ? () => onClick(i) : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 10, minWidth: 0,
              background: "transparent", border: 0, padding: 0,
              cursor: clickable ? "pointer" : "default", textAlign: "left", fontFamily: "inherit",
            }}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600,
              background: done ? "hsl(var(--success))" : active ? "hsl(var(--primary))" : "hsl(var(--muted))",
              color: done || active ? "hsl(var(--card))" : "hsl(var(--muted-foreground))",
              border: active ? "2px solid hsl(var(--primary) / .25)" : "0",
            }}>
              {done ? <Icon.Check size={12} /> : i + 1}
            </span>
            <span style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: active ? 600 : 500,
                color: active ? "hsl(var(--foreground))" : done ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{s.label}</div>
              {s.description && (
                <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{s.description}</div>
              )}
            </span>
          </button>
          {i < steps.length - 1 && (
            <span aria-hidden="true" style={{
              flex: 1, height: 2, minWidth: 16,
              background: done ? "hsl(var(--success))" : "hsl(var(--border))",
            }}/>
          )}
        </li>
      );
    })}
  </ol>
);

window.Stepper = Stepper;
