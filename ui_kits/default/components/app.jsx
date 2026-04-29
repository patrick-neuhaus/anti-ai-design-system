// App shell — sidebar + page content; routes between screens via state.
const PLACEHOLDER = (label) => () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader title={label} subtitle="Tela demonstrativa — não implementada neste UI kit." />
    <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--muted-foreground)" }}>
      <Icon.FileText size={32} color="var(--muted-foreground)" /><div style={{ marginTop: 8 }}>Sem dados</div>
    </div>
  </div>
);

const SCREENS = {
  dashboard: ({ goto }) => <DashboardScreen onOpenRomaneios={() => goto("romaneios")} />,
  deliveries: () => <DeliveriesScreen />,
  romaneios: ({ goto }) => <RomaneiosScreen onConfer={() => goto("conferencia")} />,
  conferencia: () => <ConferenciaScreen />,
  carregamento: PLACEHOLDER("Carregamento"),
  import: PLACEHOLDER("Importação"),
  transportadoras: PLACEHOLDER("Transportadoras"),
  rotas: PLACEHOLDER("Rotas"),
  skus: PLACEHOLDER("SKUs"),
  usuarios: PLACEHOLDER("Usuários"),
  motivos: PLACEHOLDER("Motivos"),
  config: PLACEHOLDER("Config. Sistema"),
};

const App = () => {
  const [authed, setAuthed] = React.useState(false);
  const [route, setRoute] = React.useState("dashboard");
  const [collapsed, setCollapsed] = React.useState(false);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const Screen = SCREENS[route] || SCREENS.dashboard;
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
      <Sidebar
        active={route}
        onNavigate={setRoute}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onLogout={() => { setAuthed(false); setRoute("dashboard"); }}
      />
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        <Screen goto={setRoute} />
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
