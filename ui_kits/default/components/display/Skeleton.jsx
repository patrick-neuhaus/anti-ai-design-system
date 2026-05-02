// ui_kits/default/components/display/Skeleton.jsx
// Skeleton — shimmering placeholder for loading content.
// When to use: data-fetch states where layout is known but content is pending.
// When NOT to use: indeterminate progress (Spinner). Empty states (EmptyState).

/* F-UX-012: aria-busy + visually-hidden label for screen readers
   F-MO-004: shimmer animation via background-position keyframe */
const Skeleton = ({ width = "100%", height = 16, radius = 6, label = "Carregando...", style }) => (
  <div
    role="status"
    aria-busy="true"
    aria-label={label}
    className="skeleton-shimmer"
    style={{
      position: "relative",
      width, height,
      borderRadius: radius,
      overflow: "hidden",
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

// Inject keyframes + shimmer class once — F-MO-004
if (typeof document !== "undefined" && !document.getElementById("skeleton-keyframes")) {
  const s = document.createElement("style");
  s.id = "skeleton-keyframes";
  s.textContent = `
    @keyframes skeleton-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        hsl(var(--muted))                  0%,
        hsl(var(--muted-foreground) / .15) 50%,
        hsl(var(--muted))                  100%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .skeleton-shimmer {
        animation: none;
        background: hsl(var(--muted));
        background-size: 100% 100%;
      }
    }
  `;
  document.head.appendChild(s);
}

window.Skeleton = Skeleton;
