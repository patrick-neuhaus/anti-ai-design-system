// DeliveriesScreen — filter row + paginated table.
const DELIVERIES = [
  { id: "DL-2024-009124", romaneio: "RM-2024-001847", cliente: "Cacau Show",        rota: "SP-Capital-01", caixas: 240, peso: "1.234,56", status: "conferido" },
  { id: "DL-2024-009123", romaneio: "RM-2024-001847", cliente: "Brasil Cacau",      rota: "SP-Capital-01", caixas: 180, peso:   "918,40", status: "conferido" },
  { id: "DL-2024-009122", romaneio: "RM-2024-001846", cliente: "Lugano Chocolates", rota: "MG-Sul-02",     caixas: 320, peso: "1.654,80", status: "pendente" },
  { id: "DL-2024-009121", romaneio: "RM-2024-001846", cliente: "Kopenhagen",        rota: "MG-Sul-02",     caixas: 410, peso: "2.115,20", status: "pendente" },
  { id: "DL-2024-009120", romaneio: "RM-2024-001845", cliente: "Lindt Brasil",      rota: "RJ-Litoral-01", caixas: 156, peso:   "806,45", status: "em_conferencia" },
  { id: "DL-2024-009119", romaneio: "RM-2024-001845", cliente: "Garoto",            rota: "ES-Capital",    caixas: 224, peso: "1.122,80", status: "em_conferencia" },
  { id: "DL-2024-009118", romaneio: "RM-2024-001844", cliente: "Nestlé Suisse",     rota: "PR-Curitiba",   caixas:  98, peso:   "498,30", status: "divergente" },
  { id: "DL-2024-009117", romaneio: "RM-2024-001843", cliente: "Cacau Show",        rota: "SP-ABC-01",     caixas: 312, peso: "1.611,90", status: "conferido" },
];

const DeliveriesScreen = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader
      title="Deliveries"
      subtitle="Gerenciamento de deliveries da expedição"
      actions={<>
        <button className="btn btn-outline"><Icon.Upload size={14} /> Importar</button>
        <button className="btn btn-primary"><Icon.Plus size={14} /> Nova delivery</button>
      </>}
    />

    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Icon.Search size={14} color="var(--muted-foreground)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}/>
          <input className="field" style={{ paddingLeft: 34 }} placeholder="Buscar por ID, cliente, rota..." />
        </div>
        <button className="btn btn-outline btn-sm"><Icon.SlidersHorizontal size={14} /> Filtros</button>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={14} /> Período</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm"><Icon.Settings2 size={14} /> Colunas</button>
      </div>
    </div>

    <div className="card" style={{ padding: 0 }}>
      <table className="tbl">
        <thead><tr>
          <th style={{ width: 32 }}><input type="checkbox" /></th>
          <th>ID <Icon.ArrowUpDown size={11} style={{ display: "inline", verticalAlign: "middle" }} /></th>
          <th>Romaneio</th>
          <th>Cliente</th>
          <th>Rota</th>
          <th style={{ textAlign: "right" }}>Caixas</th>
          <th style={{ textAlign: "right" }}>Peso (kg)</th>
          <th>Status</th>
          <th style={{ width: 40 }}></th>
        </tr></thead>
        <tbody>
          {DELIVERIES.map((d) => (
            <tr key={d.id}>
              <td><input type="checkbox" /></td>
              <td className="mono" style={{ fontSize: 12 }}>{d.id}</td>
              <td className="mono" style={{ fontSize: 12 }}>{d.romaneio}</td>
              <td>{d.cliente}</td>
              <td className="muted">{d.rota}</td>
              <td style={{ textAlign: "right" }}>{d.caixas}</td>
              <td style={{ textAlign: "right" }} className="mono">{d.peso}</td>
              <td><StatusBadge value={d.status} /></td>
              <td><button className="btn btn-ghost btn-icon btn-sm"><Icon.MoreHorizontal size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>1.247 resultados • Página 1 de 25</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="btn btn-outline btn-sm btn-icon"><Icon.ChevronLeft size={14} /></button>
          <button className="btn btn-outline btn-sm btn-icon"><Icon.ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  </div>
);

window.DeliveriesScreen = DeliveriesScreen;
