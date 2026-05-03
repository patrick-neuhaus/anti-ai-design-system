// ui_kits/default/components/auth/RegisterScreen.jsx
// RegisterScreen — split-panel signup. Mirrors LoginScreen structure.
// When to use: new account creation. Pairs with LoginScreen via toggle link.
// When NOT to use: invite-only flows (use ConfirmEmailScreen + token). Single-field magic-link (custom).

const RegisterScreen = ({ onRegister, onGoLogin, brand, appName, tagline }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [accept, setAccept] = React.useState(false);

  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";
  const brandAlt = brand?.name ?? appName ?? "App";

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      {/* W1.5 followup: padding normalizado pra bater com LoginScreen/ResetPasswordScreen (consistencia split-panel). */}
      <div style={{
        flex: 1, background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
      }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <img src={logoSrc} alt={brandAlt} style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{appName ?? "App Name"}</h1>
          <p style={{ color: "hsl(var(--primary-foreground) / .6)", fontSize: 18 }}>{tagline ?? "Tagline"}</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))" }}>Criar conta</h2>
            <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>É grátis e leva menos de 1 minuto</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); accept && onRegister?.({ name, email, password }); }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <FormField label="Nome completo" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </FormField>
            <FormField label="Senha" required helper="Mínimo 8 caracteres, 1 número">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </FormField>
            <Checkbox checked={accept} onChange={(e) => setAccept(e.target.checked)}
                      label="Aceito os termos de uso e política de privacidade" />
            <Button type="submit" disabled={!accept} fullWidth>Criar conta</Button>
          </form>
          <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            Já tem conta?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin?.(); }}
               style={{ color: "hsl(var(--accent))", textDecoration: "none", fontWeight: 500 }}>Entrar</a>
          </div>
        </div>
      </div>
    </div>
  );
};

window.RegisterScreen = RegisterScreen;
