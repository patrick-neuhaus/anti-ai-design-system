// RomaneiosScreen — full romaneio list, no dashboard chrome.
const ROMANEIOS = [
  { id: "RM-2024-001847", date: "28/04/2026", transportadora: "TransLog Brasil",   placa: "ABC1D23", motorista: "Carlos Andrade", deliveries: 12, status: "conferido" },
  { id: "RM-2024-001846", date: "28/04/2026", transportadora: "Expresso Mineiro",  placa: "DEF2E45", motorista: "Marcos Silva",   deliveries:  8, status: "pendente" },
  { id: "RM-2024-001845", date: "28/04/2026", transportadora: "Rodovia Sul",       placa: "GHI3F67", motorista: "Pedro Lima",     deliveries: 14, status: "em_conferencia" },
  { id: "RM-2024-001844", date: "27/04/2026", transportadora: "TransLog Brasil",   placa: "JKL4G89", motorista: "Ana Souza",      deliveries:  9, status: "divergente" },
  { id: "RM-2024-001843", date: "27/04/2026", transportadora: "Cargas Paulista",   placa: "MNO5H01", motorista: "José Ferreira",  deliveries: 11, status: "conferido" },
  { id: "RM-2024-001842", date: "27/04/2026", transportadora: "Expresso Mineiro",  placa: "PQR6I12", motorista: "Lucas Mendes",   deliveries:  7, status: "finalizado" },
  { id: "RM-2024-001841", date: "26/04/2026", transportadora: "Rodovia Sul",       placa: "STU7J34", motorista: "Renata Alves",   deliveries: 13, status: "finalizado" },
];

const RomaneiosScreen = ({ onConfer }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader
      title="Romaneios"
      subtitle="Romaneios gerados nas últimas 72 horas"
      actions={<>
        <button className="btn btn-outline btn-sm"><Icon.Calendar size={14} /> 26/04 – 28/04</button>
        <button className="btn btn-primary"><Icon.Plus size={14} /> Novo romaneio</button>
      </>}
    />

    <div className="card" style={{ padding: 0 }}>
      <table className="tbl">
        <thead><tr>
          <th>ID</th><th>Data</th><th>Transportadora</th><th>Placa</th><th>Motorista</th>
          <th style={{ textAlign: "right" }}>Deliveries</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
          {ROMANEIOS.map((r) => (
            <tr key={r.id} onClick={onConfer} style={{ cursor: "pointer" }}>
              <td className="mono" style={{ fontSize: 12 }}>{r.id}</td>
              <td className="muted">{r.date}</td>
              <td>{r.transportadora}</td>
              <td className="mono" style={{ fontSize: 12 }}>{r.placa}</td>
              <td>{r.motorista}</td>
              <td style={{ textAlign: "right" }}>{r.deliveries}</td>
              <td><StatusBadge value={r.status} /></td>
              <td style={{ width: 40 }}>
                <button className="btn btn-ghost btn-icon btn-sm"><Icon.ChevronRight size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

window.RomaneiosScreen = RomaneiosScreen;
