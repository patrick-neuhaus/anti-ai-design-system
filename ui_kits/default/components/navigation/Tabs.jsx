// ui_kits/default/components/navigation/Tabs.jsx
// Tabs — segmented horizontal navigation between sibling views inside a single screen.
// When to use: switching between related views ("Overview / Activity / Settings") in one URL.
// When NOT to use: top-level app navigation (Sidebar). Filtered list state (Filter chips). Step flows (Stepper — Round C).

const Tabs = ({ items = [], value, onChange, variant = "underline" }) => {
  const isUnderline = variant === "underline";
  return (
    <div role="tablist" style={{
      display: "flex",
      gap: isUnderline ? 0 : 6,
      borderBottom: isUnderline ? "1px solid hsl(var(--border))" : "none",
      background: isUnderline ? "transparent" : "hsl(var(--muted))",
      padding: isUnderline ? 0 : 4,
      borderRadius: isUnderline ? 0 : 10,
      width: isUnderline ? "100%" : "fit-content",
    }}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(it.value)}
            style={{
              position: "relative",
              padding: isUnderline ? "10px 14px" : "6px 14px",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "inherit",
              border: 0,
              background: !isUnderline && active ? "hsl(var(--card))" : "transparent",
              color: active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              borderRadius: isUnderline ? 0 : 8,
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "color .15s, background-color .15s",
              boxShadow: !isUnderline && active ? "0 1px 2px rgb(0 0 0 / .05)" : "none",
              flex: isUnderline ? "1" : undefined,
            }}
          >
            {it.icon && <it.icon size={14} />}
            {it.label}
            {it.count != null && (
              <span style={{
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: 999,
                background: active ? "hsl(var(--accent-decorative) / .15)" : "hsl(var(--muted))",
                color: active ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}>{it.count}</span>
            )}
            {isUnderline && active && (
              <span aria-hidden="true" style={{
                position: "absolute", left: 0, right: 0, bottom: -1, height: 2,
                background: "hsl(var(--accent-decorative))",
              }}/>
            )}
          </button>
        );
      })}
    </div>
  );
};

window.Tabs = Tabs;
