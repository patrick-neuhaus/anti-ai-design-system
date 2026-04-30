// ui_kits/default/components/dashboard/KpiGrid.jsx
// KpiGrid — responsive grid container for StatCard / MetricCard tiles.
// When to use: top-of-dashboard 3-6 KPI strip.
// When NOT to use: variable-size cards (use CSS grid manually). Single hero stat (just render one card).

const KpiGrid = ({ children, columns = 4, gap = 16 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap,
  }}>
    {children}
  </div>
);

window.KpiGrid = KpiGrid;
