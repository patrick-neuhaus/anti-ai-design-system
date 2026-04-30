// ui_kits/default/components/layout/AppLayout.jsx
// AppLayout — sidebar + main content shell. Composes Sidebar + page content.
// When to use: any logged-in app surface with persistent navigation.
// When NOT to use: marketing pages (top-only nav). Auth screens (split-panel — see LoginScreen).

const AppLayout = ({ sidebar, children }) => (
  <div style={{
    display: "flex",
    minHeight: "100vh",
    background: "hsl(var(--background))",
    color: "hsl(var(--foreground))",
  }}>
    {sidebar}
    <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      {children}
    </main>
  </div>
);

window.AppLayout = AppLayout;
