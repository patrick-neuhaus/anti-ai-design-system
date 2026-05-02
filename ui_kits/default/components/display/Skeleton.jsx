// ui_kits/default/components/display/Skeleton.jsx
// Skeleton — shimmering placeholder for loading content.
// When to use: data-fetch states where layout is known but content is pending.
// When NOT to use: indeterminate progress (Spinner). Empty states (EmptyState).

/* F-UX-012: aria-busy + visually-hidden label for screen readers */
const Skeleton = ({ width = "100%", height = 16, radius = 6, label = "Carregando...", style }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label={label}
    style={{
      width, height,
      borderRadius: radius,
      background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / .08) 50%, hsl(var(--muted)) 100%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-shimmer 1.4s linear infinite",
      ...style,
    }}
  >
    {/* visually-hidden text */}
    <span style={{
      position: "absolute", width: 1, height: 1,
      padding: 0, margin: -1, overflow: "hidden",
      clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
    }}>{label}</span>
  </div>
);

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("skeleton-keyframes")) {
  const style = document.createElement("style");
  style.id = "skeleton-keyframes";
  style.textContent = `@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;
  document.head.appendChild(style);
}

window.Skeleton = Skeleton;
