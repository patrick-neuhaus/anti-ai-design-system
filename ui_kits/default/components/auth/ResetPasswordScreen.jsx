// ui_kits/default/components/auth/ResetPasswordScreen.jsx
// ResetPasswordScreen — finaliza fluxo: usuário chega via link de email + define nova senha.
// When to use: landing do email "redefinir senha". Token na URL é validado upstream.
// When NOT to use: change password de usuário logado (use SettingsScreen). Forgot init (ForgotPasswordScreen).

const ResetPasswordScreen = ({ onSubmit, onGoLogin, brand, appName, tagline }) => {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [done, setDone] = React.useState(false);

  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";
  const brandAlt = brand?.name ?? appName ?? "App";

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = password.length >= 8 && password === confirm;

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      <div style={{
        flex: 1, background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
      }}>
        <div style={{ textAlign: "center" }}>
          <img src={logoSrc} alt={brandAlt} style={{ height: 40, margin: "0 auto 24px" }}/>
          <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{appName ?? "App Name"}</h1>
          <p style={{ color: "hsl(var(--primary-foreground) / .6)", fontSize: 18 }}>{tagline ?? "Tagline"}</p>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 24 }}>
          {!done ? (
            <>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--foreground))" }}>Nova senha</h2>
                <p style={{ color: "hsl(var(--muted-foreground))", marginTop: 4 }}>
                  Crie uma senha forte. Mínimo 8 caracteres.
                </p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) { onSubmit?.(password); setDone(true); } }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FormField label="Nova senha" required helper="Mínimo 8 caracteres">
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" invalid={tooShort} />
                </FormField>
                <FormField label="Confirmar senha" required>
                  <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" invalid={mismatch} />
                </FormField>
                {mismatch && <div style={{ fontSize: 12, color: "hsl(var(--destructive))" }}>As senhas não conferem</div>}
                <Button type="submit" disabled={!canSubmit} fullWidth>Salvar nova senha</Button>
              </form>
            </>
          ) : (
            <>
              <Alert intent="success" title="Senha redefinida">
                Sua senha foi atualizada com sucesso. Você já pode entrar.
              </Alert>
              <Button onClick={onGoLogin} fullWidth>Voltar pro login</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.ResetPasswordScreen = ResetPasswordScreen;
