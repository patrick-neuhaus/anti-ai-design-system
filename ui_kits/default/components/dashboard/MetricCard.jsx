// ui_kits/default/components/dashboard/MetricCard.jsx
// MetricCard — KPI tile with delta arrow, comparison label, and optional sparkline placeholder.
// When to use: dashboards with comparison context ("vs. last week", "+12% MoM").
// When NOT to use: pure stat without context (StatCard). Detailed analytics (use ChartCard — Round C).

const formatDelta = (delta) => {
  if (delta == null) return null;
  const positive = delta >= 0;
  return {
    sign: positive ? "+" : "−",
    abs: Math.abs(delta),
    positive,
    icon: positive ? Icon.TrendingUp : Icon.TrendingDown,
    color: positive ? "hsl(var(--success))" : "hsl(var(--destructive))",
  };
};

const MetricCard = ({ label, value, unit, delta, deltaSuffix = "%", comparison, sparkline }) => {
  const d = formatDelta(delta);
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, color: "hsl(var(--foreground))", letterSpacing: "-.01em" }}>{value}</span>
        {unit && <span style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{unit}</span>}
      </div>
      {sparkline && <div style={{ height: 36 }}>{sparkline}</div>}
      {(d || comparison) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          {d && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: d.color, fontWeight: 600 }}>
              <d.icon size={12} />
              {d.sign}{d.abs}{deltaSuffix}
            </span>
          )}
          {comparison && (
            <span style={{ color: "hsl(var(--muted-foreground))" }}>{comparison}</span>
          )}
        </div>
      )}
    </div>
  );
};

window.MetricCard = MetricCard;
