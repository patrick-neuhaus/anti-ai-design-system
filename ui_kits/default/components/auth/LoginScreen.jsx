// ui_kits/default/components/auth/LoginScreen.jsx
// LoginScreen — split-panel (primary left, background right with form).
// Brand-agnostic via tokens; appName/tagline/brand arrive as props.
// Inclui: Esqueceu senha? + Criar conta + Continue with Google (placeholder, OAuth opcional via prop showGoogle).

const LoginScreen = ({
  onLogin, onForgot, onGoRegister, onGoogle,
  brand, appName, tagline, showGoogle = false,
}) => {
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
        padding: 32,
      }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <img src={logoSrc} alt={brandAlt} style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{titleText}</h1>
          <p style={{ color: "hsl(var(--primary-foreground) / .6)", fontSize: 18 }}>{taglineText}</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))" }}>Entrar</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>Acesse sua conta para continuar</p>
          </div>
          <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); onLogin?.({ email, password }); }}>
            <FormField label="Email" required>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </FormField>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }}>Senha</label>
                <a href="#" onClick={(e) => { e.preventDefault(); onForgot?.(); }}
                   style={{ fontSize: 12, color: "hsl(var(--accent))", textDecoration: "none", fontWeight: 500 }}>Esqueceu a senha?</a>
              </div>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" iconLeft={Icon.LogIn} fullWidth>Entrar</Button>
          </form>
          {showGoogle && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />
                <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", letterSpacing: ".06em", textTransform: "uppercase" }}>ou</span>
                <span style={{ flex: 1, height: 1, background: "hsl(var(--border))" }} />
              </div>
              <Button variant="outline" fullWidth onClick={onGoogle}>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Button>
            </>
          )}
          <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            Não tem conta?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onGoRegister?.(); }}
               style={{ color: "hsl(var(--accent))", textDecoration: "none", fontWeight: 500 }}>Criar conta</a>
          </div>
        </div>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
