// ui_kits/default/components/app.jsx
// App shell — sidebar + page content; routes between screens via state.
const PLACEHOLDER = (label) => () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader title={label} subtitle="Tela demonstrativa — não implementada neste UI kit." />
    <div className="card" style={{ padding: 32, textAlign: "center", color: "hsl(var(--muted-foreground))" }}>
      <Icon.FileText size={32} color="hsl(var(--muted-foreground))" /><div style={{ marginTop: 8 }}>Sem dados</div>
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

  if (!authed) return (
    <LoginScreen
      onLogin={() => setAuthed(true)}
      brand={{ logo: "../../assets/placeholder-logo.svg", name: "App" }}
      appName="App Name"
      tagline="Tagline"
    />
  );

  const Screen = SCREENS[route] || SCREENS.dashboard;
  return (
    <>
    <div style={{ display: "flex", minHeight: "100dvh", background: "hsl(var(--background))" }}>
      <Sidebar
        active={route}
        onNavigate={setRoute}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onLogout={() => { setAuthed(false); setRoute("dashboard"); }}
        brand={{
          logo: "../../assets/placeholder-logo.svg",
          mark: "../../assets/placeholder-mark.svg",
          name: "App",
        }}
        user={{ name: "Nome Sobrenome", email: "email@exemplo.com" }}
      />
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        <Screen goto={setRoute} />
      </main>
    </div>
    {typeof ToastHost !== "undefined" && <ToastHost />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
