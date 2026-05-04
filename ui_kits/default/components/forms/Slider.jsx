// ui_kits/default/components/forms/Slider.jsx
// Slider — single-value range input. Native <input type="range"> with token styling.
// When to use: continuous numeric input (volume, opacity, threshold).
// When NOT to use: discrete pick (Radio). Two-handle range (Round E).

const Slider = ({ value = 0, onChange, min = 0, max = 100, step = 1, showValue = true, unit = "", disabled = false }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{
          position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)",
          height: 4, borderRadius: 999, background: "hsl(var(--muted))",
        }}/>
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: `${pct}%`, height: 4, borderRadius: 999,
          background: "hsl(var(--primary))",
        }}/>
        <input type="range" value={value} onChange={(e) => onChange?.(Number(e.target.value))}
          min={min} max={max} step={step} disabled={disabled}
          style={{
            position: "relative", width: "100%", appearance: "none",
            background: "transparent", outline: "none", margin: 0,
            cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1,
          }}
        />
      </div>
      {showValue && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
          <span>{min}{unit}</span>
          <span style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{value}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
};

if (typeof document !== "undefined" && !document.getElementById("slider-keyframes")) {
  const s = document.createElement("style");
  s.id = "slider-keyframes";
  s.textContent = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: hsl(var(--card)); border: 2px solid hsl(var(--primary));
      cursor: pointer; box-shadow: var(--shadow-control);
    }
    input[type="range"]::-moz-range-thumb {
      width: 16px; height: 16px; border-radius: 50%;
      background: hsl(var(--card)); border: 2px solid hsl(var(--primary));
      cursor: pointer;
    }
  `;
  document.head.appendChild(s);
}

window.Slider = Slider;
