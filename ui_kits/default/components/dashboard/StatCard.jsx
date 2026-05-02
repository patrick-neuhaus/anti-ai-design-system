// ui_kits/default/components/StatCard.jsx
// Stat tile — accent-tinted icon chip + 28-px stat + divider + label/sublabel/trend.
// Props:
//   loading?: boolean — renders shimmer skeleton (F-CA-012)
//   icon, value, label, sublabel, trend — normal data props
//   animate?: boolean — count-up 0→value on viewport entry (Wave 4 P3, F-MO-015)
// Tokens only — uses --space-*, --shadow-*, --radius-* (F-UI-001/002).

// Parse numeric prefix from value string (e.g. "1.247" → 1247, "183" → 183)
const parseNumeric = (v) => {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? null : n;
};

// Format back: if original had thousands dot separator keep it
const formatLike = (original, current) => {
  const orig = String(original);
  const hasDotThousands = /^\d{1,3}(\.\d{3})+$/.test(orig);
  if (hasDotThousands) {
    // Brazilian thousands format: 1.247
    return current.toLocaleString("pt-BR").replace(",", ".");
  }
  return String(current);
};

// Hook: count-up 0→target on IntersectionObserver. Respects prefers-reduced-motion.
const useStatCountUp = (ref, targetStr, duration = 800) => {
  const [display, setDisplay] = React.useState(targetStr);
  const hasRun = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const numeric = parseNumeric(targetStr);
    if (numeric === null) return; // non-numeric value, skip
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const start = performance.now();
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
          const current = Math.round(eased * numeric);
          setDisplay(formatLike(targetStr, current));
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(targetStr); // snap to exact original string
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetStr, duration]);
  return display;
};

const StatCard = ({ icon: I, value, label, sublabel, trend, loading = false, animate = true }) => {
  const valueRef = React.useRef(null);
  const displayValue = animate ? useStatCountUp(valueRef, value) : value;
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
        <div ref={valueRef} style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 500, color: "hsl(var(--foreground))", fontVariantNumeric: "tabular-nums" }}>{displayValue}</div>
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
