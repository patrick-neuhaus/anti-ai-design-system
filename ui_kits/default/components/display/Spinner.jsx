// ui_kits/default/components/display/Spinner.jsx
// Spinner — indeterminate loading indicator.
// When to use: <2s loads, button busy state, inline indicator.
// When NOT to use: layout-known loads (Skeleton). >5s ops (progress bar — Round D).

const Spinner = ({ size = 16, color = "currentColor", thickness = 2 }) => (
  <span
    role="status"
    aria-label="Loading"
    style={{
      display: "inline-block",
      width: size, height: size,
      border: `${thickness}px solid ${color}`,
      borderRightColor: "transparent",
      borderRadius: "50%",
      animation: "spinner-rotate .8s linear infinite",
    }}
  />
);

if (typeof document !== "undefined" && !document.getElementById("spinner-keyframes")) {
  const style = document.createElement("style");
  style.id = "spinner-keyframes";
  style.textContent = `@keyframes spinner-rotate { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

window.Spinner = Spinner;
