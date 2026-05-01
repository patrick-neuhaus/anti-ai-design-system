// ui_kits/default/components/data/Table.jsx
// Table — semantic <table> with token-driven styling. Plain. No sort/filter/state.
// When to use: real tabular data — rows × columns where row identity matters.
// When NOT to use: layout (flex/grid). Sortable interactive table (use AppTable).

const Table = ({ children, dense = false, ...rest }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: dense ? 13 : 14,
        color: "hsl(var(--foreground))",
      }}
      {...rest}
    >
      {children}
    </table>
  </div>
);

const Th = ({ children, align = "left", style, ...rest }) => (
  <th
    style={{
      textAlign: align,
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: ".02em",
      color: "hsl(var(--muted-foreground))",
      padding: "12px 16px",
      borderBottom: "1px solid hsl(var(--border))",
      background: "hsl(var(--muted) / .5)",
      whiteSpace: "nowrap",
      ...style,
    }}
    {...rest}
  >{children}</th>
);

const Td = ({ children, align = "left", muted = false, mono = false, style, ...rest }) => (
  <td
    style={{
      textAlign: align,
      padding: "12px 16px",
      borderBottom: "1px solid hsl(var(--border))",
      color: muted ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
      fontFamily: mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
      verticalAlign: "middle",
      ...style,
    }}
    {...rest}
  >{children}</td>
);

const Tr = ({ children, onClick, hoverable = false, ...rest }) => (
  <tr
    onClick={onClick}
    style={{
      cursor: onClick || hoverable ? "pointer" : "default",
      transition: "background-color .12s",
    }}
    onMouseEnter={(e) => {
      if (onClick || hoverable) e.currentTarget.style.background = "hsl(var(--muted) / .4)";
    }}
    onMouseLeave={(e) => {
      if (onClick || hoverable) e.currentTarget.style.background = "transparent";
    }}
    {...rest}
  >{children}</tr>
);

window.Table = Table;
window.Th = Th;
window.Td = Td;
window.Tr = Tr;
