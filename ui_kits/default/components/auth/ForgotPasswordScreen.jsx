// ui_kits/default/components/auth/ForgotPasswordScreen.jsx
// ForgotPasswordScreen — single-step email request. No password reveal here.
// When to use: password-reset entry point. Pairs with email link → ConfirmEmailScreen.
// When NOT to use: SSO-only flows. Combined login+reset (split into separate screens).

const ForgotPasswordScreen = ({ onSubmit, onGoLogin, brand, appName, tagline }) => {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      <div style={{ flex: 1, background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img src={logoSrc} alt={brand?.name ?? "App"} style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{appName ?? "App Name"}</h1>
          <p style={{ color: "hsl(var(--primary-foreground) / .6)", fontSize: 18 }}>{tagline ?? "Tagline"}</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 24 }}>
          {!sent ? (
            <>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))" }}>Recuperar senha</h2>
                <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                  Digite seu email e enviaremos instruções pra redefinir
                </p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(email); setSent(true); }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FormField label="Email" required>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                </FormField>
                <Button type="submit" fullWidth>Enviar instruções</Button>
              </form>
            </>
          ) : (
            <Alert intent="success" title="Enviado">
              Se houver uma conta com <strong>{email}</strong>, você receberá um email em instantes.
            </Alert>
          )}
          <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", textAlign: "center" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin?.(); }}
               style={{ color: "hsl(var(--accent))", textDecoration: "none", fontWeight: 500 }}>← Voltar pro login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

window.ForgotPasswordScreen = ForgotPasswordScreen;
