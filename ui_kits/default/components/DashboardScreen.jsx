// DashboardScreen — 4 stat cards + recent romaneios table.
const DashboardScreen = ({ onOpenRomaneios }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader title="Dashboard" subtitle="Visão geral da expedição logística" />

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <StatCard icon={Icon.Package}        value="1.247" label="Total Deliveries" sublabel="Cadastradas no sistema" trend="+12%" />
      <StatCard icon={Icon.FileText}       value="183"   label="Romaneios" sublabel="Gerados este mês" trend="+5%" />
      <StatCard icon={Icon.ScanBarcode}    value="42"    label="Em Conferência" sublabel="Aguardando bipagem" />
      <StatCard icon={Icon.ClipboardCheck} value="29"    label="Carregamentos" sublabel="Concluídos hoje" trend="+18%" />
    </div>

    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Romaneios recentes</h3>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>Últimos romaneios gerados</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onOpenRomaneios}>Ver todos</button>
      </div>
      <table className="tbl">
        <thead><tr>
          <th>ID</th><th>Transportadora</th><th>Placa</th><th>Motorista</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>
          {RECENT_ROMANEIOS.map((r) => (
            <tr key={r.id}>
              <td className="mono" style={{ fontSize: 12 }}>{r.id}</td>
              <td className="muted">{r.transportadora}</td>
              <td className="mono" style={{ fontSize: 12 }}>{r.placa}</td>
              <td>{r.motorista}</td>
              <td><StatusBadge value={r.status} /></td>
              <td style={{ width: 36 }}>
                <button className="btn btn-ghost btn-icon btn-sm"><Icon.MoreHorizontal size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RECENT_ROMANEIOS = [
  { id: "RM-2024-001847", transportadora: "TransLog Brasil",   placa: "ABC1D23", motorista: "Carlos Andrade", status: "conferido" },
  { id: "RM-2024-001846", transportadora: "Expresso Mineiro",   placa: "DEF2E45", motorista: "Marcos Silva",   status: "pendente" },
  { id: "RM-2024-001845", transportadora: "Rodovia Sul",        placa: "GHI3F67", motorista: "Pedro Lima",     status: "em_conferencia" },
  { id: "RM-2024-001844", transportadora: "TransLog Brasil",    placa: "JKL4G89", motorista: "Ana Souza",      status: "divergente" },
  { id: "RM-2024-001843", transportadora: "Cargas Paulista",    placa: "MNO5H01", motorista: "José Ferreira",  status: "conferido" },
];

const StatusBadge = ({ value }) => {
  const map = {
    conferido:        { cls: "badge-success", label: "Conferido" },
    pendente:         { cls: "badge-pending", label: "Pendente" },
    em_conferencia:   { cls: "badge-outline", label: "Em conferência" },
    divergente:       { cls: "badge-error",   label: "Divergente" },
    finalizado:       { cls: "badge-success", label: "Finalizado" },
  };
  const m = map[value] || { cls: "badge-pending", label: value };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
};

window.DashboardScreen = DashboardScreen;
window.StatusBadge = StatusBadge;
