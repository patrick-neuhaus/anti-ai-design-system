// ui_kits/default/components/data/AppTable.jsx
// AppTable — declarative sortable/clickable table. Pass columns + data, rendering is automatic.
// When to use: dashboards / list screens with sortable columns and row-click drill-in.
// When NOT to use: highly custom row layouts (compose Table primitive directly). Spreadsheet editing.

const SortIcon = ({ dir }) => {
  if (dir === "asc")  return <Icon.ChevronUp size={12} />;
  if (dir === "desc") return <Icon.ChevronDown size={12} />;
  return <Icon.ArrowUpDown size={12} />;
};

const AppTable = ({
  columns = [],     // [{ key, header, align, render?, sortable?, mono?, width? }]
  data = [],
  rowKey = "id",
  onRowClick,
  initialSort,
  empty,
}) => {
  const [sort, setSort] = React.useState(initialSort ?? { key: null, dir: null });

  const sorted = React.useMemo(() => {
    if (!sort.key || !sort.dir) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort, columns]);

  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: null };
    });
  };

  if (data.length === 0 && empty) {
    return <div style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}>{empty}</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((c) => (
            <Th key={c.key} align={c.align ?? "left"} style={{ width: c.width, cursor: c.sortable ? "pointer" : "default" }}
                onClick={c.sortable ? () => toggleSort(c.key) : undefined}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {c.header}
                {c.sortable && <SortIcon dir={sort.key === c.key ? sort.dir : null} />}
              </span>
            </Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <Tr key={row[rowKey]} onClick={onRowClick ? () => onRowClick(row) : undefined}>
            {columns.map((c) => (
              <Td key={c.key} align={c.align ?? "left"} mono={!!c.mono}>
                {c.render ? c.render(row[c.key], row) : row[c.key]}
              </Td>
            ))}
          </Tr>
        ))}
      </tbody>
    </Table>
  );
};

window.AppTable = AppTable;
