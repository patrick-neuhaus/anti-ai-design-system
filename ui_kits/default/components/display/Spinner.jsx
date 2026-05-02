// ui_kits/default/components/display/Spinner.jsx
// Spinner — indeterminate loading indicator.
// When to use: <2s loads, button busy state, inline indicator.
// When NOT to use: layout-known loads (Skeleton). >5s ops (progress bar — Round D).

/* F-UX-012: aria-busy + visually-hidden label in PT-BR */
const Spinner = ({ size = 16, color = "currentColor", thickness = 2, label = "Carregando..." }) => (
  <span role="status" aria-busy="true" aria-label={label} style={{ display: "inline-flex", alignItems: "center" }}>
    <span aria-hidden="true" style={{
      display: "inline-block",
      width: size, height: size,
      border: `${thickness}px solid ${color}`,
      borderRightColor: "transparent",
      borderRadius: "50%",
      animation: "spinner-rotate .8s linear infinite",
      flexShrink: 0,
    }} />
    {/* visually-hidden text for screen readers */}
    <span style={{
      position: "absolute", width: 1, height: 1,
      padding: 0, margin: -1, overflow: "hidden",
      clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
    }}>{label}</span>
  </span>
);

if (typeof document !== "undefined" && !document.getElementById("spinner-keyframes")) {
  const style = document.createElement("style");
  style.id = "spinner-keyframes";
  style.textContent = `@keyframes spinner-rotate { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

window.Spinner = Spinner;
