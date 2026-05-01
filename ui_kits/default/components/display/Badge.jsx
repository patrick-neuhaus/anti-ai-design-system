// ui_kits/default/components/display/Badge.jsx
// Badge — small inline status/count pill. Subtle by default; intent-coloured.
// When to use: counts ("3 new"), state pills ("Pending"), tag-like labels.
// When NOT to use: full status row in tables (use StatusBadge — semantic mapping). Buttons (use Button).

const BADGE_INTENTS = {
  neutral: { bg: "hsl(var(--muted))", fg: "hsl(var(--muted-foreground))" },
  primary: { bg: "hsl(var(--primary) / .12)", fg: "hsl(var(--primary))" },
  success: { bg: "hsl(var(--success) / .12)", fg: "hsl(var(--success))" },
  warning: { bg: "hsl(var(--warning) / .16)", fg: "hsl(var(--warning))" },
  info: { bg: "hsl(var(--info) / .10)", fg: "hsl(var(--info))" },
  destructive: { bg: "hsl(var(--destructive) / .10)", fg: "hsl(var(--destructive))" },
};

const Badge = ({ children, intent = "neutral", strong = false, dot = intent !== "neutral" }) => {
  const c = BADGE_INTENTS[intent] ?? BADGE_INTENTS.neutral;
  const isStrong = strong;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.4,
      background: isStrong ? c.fg : c.bg,
      color: isStrong ? "hsl(var(--card))" : c.fg,
    }}>
      {dot && (
        <span aria-hidden="true" style={{
          width: 6, height: 6, borderRadius: "50%",
          background: isStrong ? "hsl(var(--card))" : c.fg,
        }}/>
      )}
      {children}
    </span>
  );
};

window.Badge = Badge;
