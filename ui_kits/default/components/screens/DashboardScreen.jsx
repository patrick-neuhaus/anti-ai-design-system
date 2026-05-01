// ui_kits/default/components/screens/DashboardScreen.jsx
// DashboardScreen — 4 stat cards + recent table. Composition reference.
// Depends on: StatCard, PageHeader, StatusBadge (display/StatusBadge.jsx).
// DEMO CONTENT: this screen uses Romaneios/TransLog/Choco-flavored data as
// illustrative example. For production, replace data + labels via props.
// Brand-agnostic refactor (prop-driven data) is a Round E candidate.
const DashboardScreen = ({ onOpenRomaneios }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader title="Dashboard" subtitle="Visão geral da expedição logística" />

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      <StatCard icon={Icon.Package}        value="1.247" label="Total Deliveries" sublabel="Cadastradas no sistema" trend="+12%" />
      <StatCard icon={Icon.FileText}       value="183"   label="Romaneios" sublabel="Gerados este mês" trend="+5%" />
      <StatCard icon={Icon.ScanBarcode}    value="42"    label="Em Conferência" sublabel="Aguardando bipagem" />
      <StatCard icon={Icon.ClipboardCheck} value="29"    label="Carregamentos" sublabel="Concluídos hoje" trend="+18%" />
    </div>

    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>Romaneios recentes</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Últimos romaneios gerados</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onOpenRomaneios}>Ver todos</Button>
      </div>
      <div style={{ overflowX: "auto" }}>
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
                  <Button variant="ghost" size="sm" iconOnly aria-label="Mais opções" iconLeft={Icon.MoreHorizontal} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const RECENT_ROMANEIOS = [
  { id: "RM-2024-001847", transportadora: "TransLog Brasil",   placa: "ABC1D23", motorista: "Carlos Andrade", status: "conferido" },
  { id: "RM-2024-001846", transportadora: "Expresso Mineiro",  placa: "DEF2E45", motorista: "Marcos Silva",   status: "pendente" },
  { id: "RM-2024-001845", transportadora: "Rodovia Sul",       placa: "GHI3F67", motorista: "Pedro Lima",     status: "em_conferencia" },
  { id: "RM-2024-001844", transportadora: "TransLog Brasil",   placa: "JKL4G89", motorista: "Ana Souza",      status: "divergente" },
  { id: "RM-2024-001843", transportadora: "Cargas Paulista",   placa: "MNO5H01", motorista: "José Ferreira",  status: "conferido" },
];

window.DashboardScreen = DashboardScreen;
