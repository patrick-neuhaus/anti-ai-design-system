// LoginScreen — split-panel (primary left, cream right with form).
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = React.useState("joao@barry-callebaut.com");
  const [password, setPassword] = React.useState("••••••••");

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      <div style={{ flex: 1, background: "hsl(338 55% 23%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img src="../../assets/barry-callebaut-logo.svg" alt="Default app" style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 600, marginBottom: 8 }}>ChocoTracking</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 18 }}>Gestão de Embarques</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "var(--background)" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Entrar</h2>
            <p style={{ color: "var(--muted-foreground)", marginTop: 4 }}>Acesse sua conta para continuar</p>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
              <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>Senha</label>
              <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <Icon.LogIn size={16} /> Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
