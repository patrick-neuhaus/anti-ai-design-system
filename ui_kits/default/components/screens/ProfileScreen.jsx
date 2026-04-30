// ui_kits/default/components/screens/ProfileScreen.jsx
// ProfileScreen — read-mostly user profile w/ avatar, summary, activity list.
// When to use: viewing another user / public-facing identity page.
// When NOT to use: editing own profile (SettingsScreen). Org/team page (different shape).

const PROFILE_ACTIVITY = [
  { id: "a1", title: "Conferiu RM-2024-001847", subtitle: "TransLog Brasil · 28/04/2026" },
  { id: "a2", title: "Criou romaneio RM-2024-001846", subtitle: "Expresso Mineiro · 28/04/2026" },
  { id: "a3", title: "Atualizou cadastro de SKU", subtitle: "Caixa 12kg · 27/04/2026" },
];

const ProfileScreen = ({ user, onEdit }) => {
  const u = user ?? { name: "Nome Sobrenome", email: "email@exemplo.com", role: "Operador", since: "Mar/2024" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Perfil" subtitle="Informações da conta" actions={<Button variant="outline" onClick={onEdit} iconLeft={Icon.Pencil}>Editar</Button>} />
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={u.name} size={64} color="primary" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "hsl(var(--foreground))" }}>{u.name}</div>
            <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{u.email}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <Badge intent="primary">{u.role}</Badge>
              <Badge intent="neutral">Desde {u.since}</Badge>
            </div>
          </div>
        </div>
      </Card>
      <Card padding={0}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid hsl(var(--border))" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Atividade recente</div>
        </div>
        {PROFILE_ACTIVITY.map((a, i) => (
          <ListItem
            key={a.id}
            leading={<Avatar name={u.name} size={28} color="muted" />}
            title={a.title}
            subtitle={a.subtitle}
            divider={i < PROFILE_ACTIVITY.length - 1}
          />
        ))}
      </Card>
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
