// ui_kits/default/components/display/Avatar.jsx
// Avatar — circular user/entity image with initial fallback.
// When to use: identifying a person or org inline (sidebar footer, comments, table cell).
// When NOT to use: brand logos (use <img> directly). Decorative icons (use Icon).

const AVATAR_INTENTS = {
  primary:  { bg: "hsl(var(--primary))",  fg: "hsl(var(--primary-foreground))" },
  accent:   { bg: "hsl(var(--accent))",   fg: "hsl(var(--accent-foreground))" },
  neutral:  { bg: "hsl(var(--muted))",    fg: "hsl(var(--muted-foreground))" },
  success:  { bg: "hsl(var(--success))",  fg: "hsl(var(--success-foreground, var(--card)))" },
};

// color prop mantido como alias retrocompat (muted → neutral, accent → accent)
const resolveIntent = (intent, color) => {
  if (intent) return AVATAR_INTENTS[intent] || AVATAR_INTENTS.primary;
  if (color === "muted") return AVATAR_INTENTS.neutral;
  if (color === "primary") return AVATAR_INTENTS.primary;
  return AVATAR_INTENTS.primary;
};

const Avatar = ({ src, name, size = 32, intent = "primary", color }) => {
  const initials = String(name || "")
    .trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "").join("") || "··";
  const fontSize = Math.max(10, Math.round(size * 0.4));
  const palette = resolveIntent(intent, color);
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: palette.bg, color: palette.fg,
      fontSize, fontWeight: 600,
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {src
        ? <img src={src} alt={name ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        : initials}
    </span>
  );
};

window.Avatar = Avatar;
