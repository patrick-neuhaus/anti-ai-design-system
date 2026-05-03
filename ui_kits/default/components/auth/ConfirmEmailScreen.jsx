// ui_kits/default/components/auth/ConfirmEmailScreen.jsx
// ConfirmEmailScreen — token-landing screen showing verification result.
// When to use: link from confirmation email. Pass status="success"/"error"/"pending".
// When NOT to use: in-flow OTP (use Input + Form). Active session re-verification (Dialog).
//
// W1.5 / F-INT-014: split-panel 50/50 alinha com Login/Register/Forgot/Reset.

const ConfirmEmailScreen = ({ status = "pending", email, onContinue, onResend, brand, appName, tagline }) => {
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
  const brandAlt = brand?.name ?? appName ?? "App";
  const titleText = appName ?? "App Name";
  const taglineText = tagline ?? "Tagline";

  return (
    <div style={{ minHeight: "100%", display: "flex" }}>
      {/* Left brand panel — espelha LoginScreen/Register/Forgot/Reset */}
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
      {/* Right content — verification result */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "hsl(var(--background))" }}>
        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <span style={{
            display: "inline-flex", width: 56, height: 56, borderRadius: 16,
            background: v.iconColor.replace(")", " / .12)"),
            color: v.iconColor,
            alignItems: "center", justifyContent: "center", marginBottom: 16,
          }}>
            <I size={28} />
          </span>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 8 }}>{v.title}</h2>
          <p style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", lineHeight: 1.5, marginBottom: 24 }}>{v.body}</p>
          {status === "success" && (
            <Button onClick={onContinue} fullWidth>Continuar pro app</Button>
          )}
          {status === "error" && (
            <Button onClick={onResend} variant="outline" fullWidth>Reenviar email</Button>
          )}
        </div>
      </div>
    </div>
  );
};

window.ConfirmEmailScreen = ConfirmEmailScreen;
