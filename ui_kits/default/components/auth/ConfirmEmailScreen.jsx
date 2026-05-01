// ui_kits/default/components/auth/ConfirmEmailScreen.jsx
// ConfirmEmailScreen — token-landing screen showing verification result.
// When to use: link from confirmation email. Pass status="success"/"error"/"pending".
// When NOT to use: in-flow OTP (use Input + Form). Active session re-verification (Dialog).

const ConfirmEmailScreen = ({ status = "pending", email, onContinue, onResend, brand, appName }) => {
  const variants = {
    pending: {
      icon: Icon.AlertCircle, iconColor: "hsl(var(--info))",
      title: "Verificando…", body: "Aguarde enquanto confirmamos seu email.",
    },
    success: {
      icon: Icon.CheckCircle, iconColor: "hsl(var(--success))",
      title: "Email confirmado", body: email ? `${email} foi verificado com sucesso.` : "Sua conta está pronta pra uso.",
    },
    error: {
      icon: Icon.XCircle, iconColor: "hsl(var(--destructive))",
      title: "Link inválido ou expirado", body: "Solicite um novo link de confirmação.",
    },
  };
  const v = variants[status] ?? variants.pending;
  const I = v.icon;
  const logoSrc = brand?.logo ?? "../../assets/placeholder-logo.svg";

  return (
    <div style={{
      minHeight: "100%",
      background: "hsl(var(--background))",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 440, padding: 32, textAlign: "center" }}>
        <img src={logoSrc} alt={brand?.name ?? "App"} style={{ height: 32, margin: "0 auto 24px" }}/>
        <span style={{
          display: "inline-flex", width: 56, height: 56, borderRadius: 16,
          background: `${v.iconColor.replace("hsl(", "hsl(").replace(")", " / .12)")}`,
          color: v.iconColor,
          alignItems: "center", justifyContent: "center", marginBottom: 16,
        }}>
          <I size={28} />
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 8 }}>{v.title}</h2>
        <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", lineHeight: 1.5, marginBottom: 24 }}>{v.body}</p>
        {status === "success" && (
          <Button onClick={onContinue} fullWidth>Continuar pro app</Button>
        )}
        {status === "error" && (
          <Button onClick={onResend} variant="outline" fullWidth>Reenviar email</Button>
        )}
      </div>
    </div>
  );
};

window.ConfirmEmailScreen = ConfirmEmailScreen;
