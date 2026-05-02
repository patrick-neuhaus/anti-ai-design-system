// ui_kits/default/components/StatCard.jsx
// Stat tile — accent-tinted icon chip + 28-px stat + divider + label/sublabel/trend.
// Props:
//   loading?: boolean — renders shimmer skeleton (F-CA-012)
//   icon, value, label, sublabel, trend — normal data props
// Tokens only — uses --space-*, --shadow-*, --radius-* (F-UI-001/002).
const StatCard = ({ icon: I, value, label, sublabel, trend, loading = false }) => {
  if (loading) {
    return (
      <div className="card" style={{ padding: "var(--space-5, 20px)", display: "flex", flexDirection: "column", gap: "var(--space-4, 16px)" }}
        aria-busy="true" aria-label="Carregando...">
        {/* Icon + value row */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3, 12px)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "hsl(var(--muted))", flexShrink: 0 }} />
          <div style={{ width: 80, height: 24, borderRadius: 6, background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/.08) 50%, hsl(var(--muted)) 100%)", backgroundSize: "200% 100%", animation: "skeleton-shimmer 1.4s linear infinite" }} />
        </div>
        <div style={{ height: 1, background: "hsl(var(--border))" }} />
        {/* Label row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ width: "60%", height: 14, borderRadius: 4, background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/.08) 50%, hsl(var(--muted)) 100%)", backgroundSize: "200% 100%", animation: "skeleton-shimmer 1.4s linear infinite 0.2s" }} />
          <div style={{ width: "40%", height: 12, borderRadius: 4, background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground)/.08) 50%, hsl(var(--muted)) 100%)", backgroundSize: "200% 100%", animation: "skeleton-shimmer 1.4s linear infinite 0.4s" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "var(--space-5, 20px)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3, 12px)", marginBottom: "var(--space-4, 16px)" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "hsl(var(--accent) / .12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {I && <I size={20} color="hsl(var(--accent))" />}
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 500, color: "hsl(var(--foreground))" }}>{value}</div>
      </div>
      <div style={{ height: 1, background: "hsl(var(--border))", marginBottom: "var(--space-3, 12px))" }}/>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--foreground))" }}>{label}</div>
          {sublabel && <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{sublabel}</div>}
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 500,
            color: trend.startsWith("-") ? "hsl(var(--destructive))" : "hsl(var(--success))",
          }}>{trend}</span>
        )}
      </div>
    </div>
  );
};

window.StatCard = StatCard;
