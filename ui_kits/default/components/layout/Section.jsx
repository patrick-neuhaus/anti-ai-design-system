// ui_kits/default/components/layout/Section.jsx
// Section — semantic content section with optional title/subtitle and tone background.
// When to use: marketing landing blocks, settings sections, grouping under a header.
// When NOT to use: data card (use Card). Page chrome (PageHeader + AppLayout).

const Section = ({ title, subtitle, eyebrow, tone = "base", children, maxWidth = 1200 }) => (
  <Surface tone={tone} padding="64px 24px" radius={0} fullBleed>
    <div style={{ maxWidth, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {(eyebrow || title || subtitle) && (
        <header style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {eyebrow && (
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: ".12em",
              textTransform: "uppercase", color: "hsl(var(--accent))",
            }}>{eyebrow}</div>
          )}
          {title && (
            <h2 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.15, color: "hsl(var(--foreground))" }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ fontSize: 16, color: "hsl(var(--muted-foreground))", maxWidth: 640, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </div>
  </Surface>
);

window.Section = Section;
