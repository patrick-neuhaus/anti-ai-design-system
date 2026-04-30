// ui_kits/default/components/layout/PageShell.jsx
// PageShell — content padding wrapper inside an AppLayout. Holds PageHeader + body.
// When to use: every screen rendered into AppLayout's content slot.
// When NOT to use: marketing pages (use Section directly). Modal/dialog content.

const PageShell = ({ children, maxWidth = "100%", padding = 24, gap = 20 }) => (
  <div style={{
    width: "100%",
    maxWidth,
    margin: "0 auto",
    padding,
    display: "flex",
    flexDirection: "column",
    gap,
  }}>
    {children}
  </div>
);

window.PageShell = PageShell;
