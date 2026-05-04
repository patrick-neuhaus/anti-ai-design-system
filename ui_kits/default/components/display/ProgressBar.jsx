// ui_kits/default/components/display/ProgressBar.jsx
// ProgressBar — determinate progress 0-100. Optional label + percentage.
// When to use: known-duration ops (uploads, batch processing).
// When NOT to use: indeterminate (Spinner). Multi-step flows (Stepper).

const ProgressBar = ({ value = 0, max = 100, label, showPercent = true, intent = "primary", height = 8 }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const colors = {
    primary: "hsl(var(--primary))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning-foreground))",
    destructive: "hsl(var(--destructive))",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(label || showPercent) && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
          {label && <span>{label}</span>}
          {showPercent && <span style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} style={{
        width: "100%", height, borderRadius: 999,
        background: "hsl(var(--muted))", overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: colors[intent] ?? colors.primary,
          transition: "width var(--motion-normal,200ms) var(--ease-out, cubic-bezier(0,0,.2,1))",
          borderRadius: 999,
        }}/>
      </div>
    </div>
  );
};

window.ProgressBar = ProgressBar;
