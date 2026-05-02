// ui_kits/default/components/dashboard/MetricCard.jsx
// MetricCard — KPI tile with delta arrow, comparison label, and optional sparkline placeholder.
// Props:
//   animate?: boolean — count-up 0→value on viewport entry (Wave 4 P3, F-MO-015)
// When to use: dashboards with comparison context ("vs. last week", "+12% MoM").
// When NOT to use: pure stat without context (StatCard). Detailed analytics (use ChartCard — Round C).

// Hook: count-up 0→target (numeric) on IntersectionObserver. rAF-based, respects prefers-reduced-motion.
const useMetricCountUp = (ref, target, duration = 800) => {
  const [count, setCount] = React.useState(0);
  const hasRun = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || target == null) return;
    const numeric = parseFloat(target);
    if (isNaN(numeric)) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setCount(numeric); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const cur = eased * numeric;
          // Preserve decimal places from original
          const decimals = String(target).includes(".") ? String(target).split(".")[1].length : 0;
          setCount(parseFloat(cur.toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(numeric);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return count;
};

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

const MetricCard = ({ label, value, unit, delta, deltaSuffix = "%", comparison, sparkline, animate = true }) => {
  const d = formatDelta(delta);
  const valueRef = React.useRef(null);
  const numericValue = animate ? useMetricCountUp(valueRef, value) : value;
  // Format display: if value has comma (pt-BR decimal like "47,2"), handle as string
  const displayValue = animate ? numericValue : value;
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span ref={valueRef} style={{ fontSize: 32, fontWeight: 500, lineHeight: 1, color: "hsl(var(--foreground))", letterSpacing: "-.01em", fontVariantNumeric: "tabular-nums" }}>{displayValue}</span>
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
