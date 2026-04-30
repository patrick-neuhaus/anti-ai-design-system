// ui_kits/default/components/screens/SettingsScreen.jsx
// SettingsScreen — tabbed settings template. Sections grouped by Tabs.
// When to use: app config screen w/ multiple categories.
// When NOT to use: single-section preferences (use PageShell + Card directly). Wizards.

const SettingsScreen = ({ onSave }) => {
  const [tab, setTab] = React.useState("profile");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notifPush, setNotifPush] = React.useState(true);
  const [notifEmail, setNotifEmail] = React.useState(false);
  const [theme, setTheme] = React.useState("light");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Configurações" subtitle="Preferências da conta e do sistema" />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "profile",   label: "Perfil",       icon: Icon.Users },
          { value: "notif",     label: "Notificações", icon: Icon.AlertCircle },
          { value: "appearance",label: "Aparência",    icon: Icon.Settings },
          { value: "danger",    label: "Conta",        icon: Icon.AlertTriangle },
        ]}
      />
      {tab === "profile" && (
        <Card>
          <CardHeader title="Informações pessoais" subtitle="Como você aparece pros outros" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
            <FormField label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} /></FormField>
            <FormField label="Email" helper="Usado pra login e recuperação">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
            <div><Button onClick={onSave}>Salvar alterações</Button></div>
          </div>
        </Card>
      )}
      {tab === "notif" && (
        <Card>
          <CardHeader title="Notificações" subtitle="Quando avisar você" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Switch checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} label="Push em tempo real" />
            <Switch checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} label="Resumo diário por email" />
          </div>
        </Card>
      )}
      {tab === "appearance" && (
        <Card>
          <CardHeader title="Aparência" />
          <RadioGroup direction="horizontal">
            <Radio name="theme" value="light" checked={theme === "light"} onChange={(e) => setTheme(e.target.value)} label="Claro" />
            <Radio name="theme" value="dark"  checked={theme === "dark"}  onChange={(e) => setTheme(e.target.value)} label="Escuro" />
            <Radio name="theme" value="auto"  checked={theme === "auto"}  onChange={(e) => setTheme(e.target.value)} label="Sistema" />
          </RadioGroup>
        </Card>
      )}
      {tab === "danger" && (
        <Alert intent="destructive" title="Zona perigosa">
          Excluir sua conta é irreversível. Todos os dados serão removidos em até 30 dias.
          <div style={{ marginTop: 12 }}>
            <Button variant="destructive" size="sm">Excluir conta</Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

window.SettingsScreen = SettingsScreen;
