// ui_kits/default/components/surfaces/Surface.jsx
// Surface — generic background tile. Tonal differentiator without becoming a Card.
// When to use: shaded background regions, hero panels, neutral grouping without border.
// When NOT to use: content that needs hierarchy (Card). One-off page chrome (Section).

const TONES = {
  base: "hsl(var(--background))",
  card: "hsl(var(--card))",
  muted: "hsl(var(--muted))",
  primary: "hsl(var(--primary))",
  primaryFg: "hsl(var(--primary-foreground))",
};

const Surface = ({ children, tone = "base", padding = 20, radius = 12, fullBleed = false, style, ...rest }) => {
  const isPrimary = tone === "primary";
  return (
    <div style={{
      background: TONES[tone] ?? TONES.base,
      color: isPrimary ? TONES.primaryFg : "hsl(var(--foreground))",
      padding,
      borderRadius: fullBleed ? 0 : radius,
      ...style,
    }} {...rest}>
      {children}
    </div>
  );
};

window.Surface = Surface;
