// ui_kits/default/components/StatCard.jsx
// Stat tile — accent-tinted icon chip + 28-px stat + divider + label/sublabel/trend.
// Tokens only.
const StatCard = ({ icon: I, value, label, sublabel, trend }) => (
  <div className="card" style={{ padding: 20 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "hsl(var(--accent-decorative) / .1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <I size={20} color="hsl(var(--accent))" />
      </div>
      <div style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 500, color: "hsl(var(--foreground))" }}>{value}</div>
    </div>
    <div style={{ height: 1, background: "hsl(var(--border))", marginBottom: 12 }}/>
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

window.StatCard = StatCard;
