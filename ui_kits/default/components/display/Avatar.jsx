// ui_kits/default/components/display/Avatar.jsx
// Avatar — circular user/entity image with initial fallback.
// When to use: identifying a person or org inline (sidebar footer, comments, table cell).
// When NOT to use: brand logos (use <img> directly). Decorative icons (use Icon).

const Avatar = ({ src, name, size = 32, color = "accent" }) => {
  const initials = String(name || "")
    .trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "").join("") || "··";
  const fontSize = Math.max(10, Math.round(size * 0.4));
  const palette = color === "primary"
    ? { bg: "hsl(var(--primary))", fg: "hsl(var(--primary-foreground))" }
    : color === "muted"
      ? { bg: "hsl(var(--muted))", fg: "hsl(var(--muted-foreground))" }
      : { bg: "hsl(var(--accent))", fg: "hsl(var(--accent-foreground))" };
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
