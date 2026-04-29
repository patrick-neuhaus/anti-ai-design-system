// Stat tile — accent-tinted icon chip + 28-px stat + divider + label/sublabel/trend.
// Mirrors chocotracking/src/components/dashboard/StatsCards.tsx.
const StatCard = ({ icon: I, value, label, sublabel, trend }) => (
  <div className="card" style={{ padding: 20 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "hsla(33 47% 53% / .1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <I size={20} color="hsl(33 47% 53%)" />
      </div>
      <div style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 500, color: "var(--foreground)" }}>{value}</div>
    </div>
    <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }}/>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{sublabel}</div>}
      </div>
      {trend && <span style={{ fontSize: 12, fontWeight: 500, color: trend.startsWith("-") ? "var(--destructive)" : "hsl(152 85% 30%)" }}>{trend}</span>}
    </div>
  </div>
);

window.StatCard = StatCard;
