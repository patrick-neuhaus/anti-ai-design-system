// ui_kits/default/components/forms/Combobox.jsx
// Combobox — searchable single-select dropdown.
// When to use: 20+ options, or any list where typing is faster than scanning.
// When NOT to use: <20 known options (Select). Multi-select (Round E).

const Combobox = ({ value, onChange, options = [], placeholder = "Selecionar…", disabled = false }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, [open]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button type="button" disabled={disabled} onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", height: 40, padding: "0 36px 0 12px", fontSize: 14, fontFamily: "inherit",
          color: selected ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
          background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8,
          textAlign: "left", cursor: "pointer", opacity: disabled ? .5 : 1,
        }}>
        {selected ? selected.label : placeholder}
        <Icon.ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}/>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
          background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8,
          boxShadow: "var(--shadow-popover)",
          maxHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ padding: 8, borderBottom: "1px solid hsl(var(--border))" }}>
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" iconLeft={Icon.Search} size="sm" />
          </div>
          <div style={{ overflowY: "auto", padding: 4 }}>
            {filtered.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>Sem resultados</div>}
            {filtered.map((o) => (
              <button key={o.value} type="button" onClick={() => { onChange?.(o.value); setOpen(false); setQ(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 10px", fontSize: 14, fontFamily: "inherit",
                  background: o.value === value ? "hsl(var(--muted))" : "transparent",
                  color: "hsl(var(--foreground))", border: 0, borderRadius: 6,
                  textAlign: "left", cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = "hsl(var(--muted) / .5)"; }}
                onMouseLeave={(e) => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.value === value && <Icon.Check size={12} color="hsl(var(--accent))" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

window.Combobox = Combobox;
