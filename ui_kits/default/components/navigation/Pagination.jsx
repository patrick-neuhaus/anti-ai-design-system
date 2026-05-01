// ui_kits/default/components/navigation/Pagination.jsx
// Pagination — page-by-page navigation for lists/tables. Numeric + prev/next.
// When to use: large lists with stable page boundaries (search results, archives).
// When NOT to use: infinite-scroll feeds. Cursor-based APIs without page numbers (use Load more button).

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const buildPages = (current, total, edge = 1, around = 1) => {
  if (total <= 7) return range(1, total);
  const out = new Set([
    ...range(1, edge),
    ...range(total - edge + 1, total),
    ...range(Math.max(1, current - around), Math.min(total, current + around)),
  ]);
  const sorted = [...out].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
};

const Pagination = ({ page = 1, totalPages = 1, onChange }) => {
  const pages = buildPages(page, totalPages);
  const navBtn = (label, target, disabled, ariaLabel) => (
    <button
      onClick={() => !disabled && onChange?.(target)}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        height: 32, minWidth: 32, padding: "0 10px",
        background: "hsl(var(--card))",
        color: disabled ? "hsl(var(--muted-foreground) / .5)" : "hsl(var(--foreground))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 6,
        fontSize: 13, fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
      }}
    >{label}</button>
  );
  return (
    <nav aria-label="Pagination" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {navBtn(<><Icon.ChevronLeft size={14} /> Prev</>, page - 1, page <= 1, "Previous page")}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} style={{ padding: "0 6px", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange?.(p)}
            aria-current={p === page ? "page" : undefined}
            style={{
              height: 32, minWidth: 32, padding: "0 10px",
              background: p === page ? "hsl(var(--primary))" : "hsl(var(--card))",
              color: p === page ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              border: `1px solid hsl(var(--${p === page ? "primary" : "border"}))`,
              borderRadius: 6,
              fontSize: 13, fontFamily: "inherit", fontWeight: p === page ? 600 : 400,
              cursor: "pointer",
            }}
          >{p}</button>
        )
      )}
      {navBtn(<>Next <Icon.ChevronRight size={14} /></>, page + 1, page >= totalPages, "Next page")}
    </nav>
  );
};

window.Pagination = Pagination;
