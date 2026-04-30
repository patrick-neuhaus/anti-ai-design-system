// ui_kits/default/components/LoginScreen.jsx
// LoginScreen — split-panel (primary left, background right with form).
// Brand-agnostic via tokens; appName/tagline/brand arrive as props.
const LoginScreen = ({ onLogin, brand, appName, tagline }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";
  const brandAlt = brand?.name ?? appName ?? "App";
  const titleText = appName ?? "App Name";
  const taglineText = tagline ?? "Tagline";

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      <div style={{
        flex: 1,
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <img src={logoSrc} alt={brandAlt} style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{titleText}</h1>
          <p style={{ color: "hsl(var(--primary-foreground) / .6)", fontSize: 18 }}>{taglineText}</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))" }}>Entrar</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>Acesse sua conta para continuar</p>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={(e) => { e.preventDefault(); onLogin?.(); }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }}>Email</label>
              <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }}>Senha</label>
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
