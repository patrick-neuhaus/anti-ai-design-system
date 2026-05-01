// ui_kits/default/components/screens/ProfileScreen.jsx
// ProfileScreen — perfil próprio com edit inline + ações sensíveis (alterar senha, excluir conta).
// When to use: tela "Meu perfil" do usuário logado.
// When NOT to use: perfil público de outro usuário (use Card + Avatar puro). Admin de usuário (admin panel).

const ProfileScreen = ({ user, onSave, onChangePassword, onDeleteAccount, onUploadAvatar }) => {
  const u = user ?? { name: "Nome Sobrenome", email: "email@exemplo.com", role: "Operador", since: "Mar/2024", avatarUrl: null };
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(u.name);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSave = () => {
    onSave?.({ name });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(u.name);
    setEditing(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Perfil" subtitle="Suas informações pessoais e configurações de conta" />

      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar name={u.name} src={u.avatarUrl} size={88} color="primary" />
            {onUploadAvatar && (
              <button
                type="button"
                aria-label="Trocar foto"
                onClick={onUploadAvatar}
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 32, height: 32, borderRadius: "50%",
                  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 1px 3px rgb(0 0 0 / .08)",
                  color: "hsl(var(--foreground))",
                }}
              >
                <Icon.Pencil size={14} />
              </button>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
                <FormField label="Nome">
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </FormField>
                <FormField label="Email" helper="Pra alterar email, contato suporte">
                  <Input value={u.email} disabled />
                </FormField>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={handleSave} size="sm">Salvar</Button>
                  <Button variant="outline" onClick={handleCancel} size="sm">Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 600, color: "hsl(var(--foreground))" }}>{u.name}</div>
                <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{u.email}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                  <Badge intent="primary">{u.role}</Badge>
                  {u.since && <Badge intent="neutral">Desde {u.since}</Badge>}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Button variant="outline" size="sm" iconLeft={Icon.Pencil} onClick={() => setEditing(true)}>Editar perfil</Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Segurança</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Senha e autenticação</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Senha</div>
            <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Última alteração há mais de 30 dias</div>
          </div>
          <Button variant="outline" size="sm" onClick={onChangePassword}>Alterar senha</Button>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--destructive))", margin: 0 }}>Zona perigosa</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Ações irreversíveis</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Excluir conta</div>
            <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Remove permanentemente todos os seus dados</div>
          </div>
          <Button variant="destructive" size="sm" iconLeft={Icon.Trash2} onClick={() => setConfirmDelete(true)}>Excluir conta</Button>
        </div>
      </Card>

      {confirmDelete && (
        <Dialog
          title="Excluir conta?"
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="destructive" size="sm" onClick={() => { onDeleteAccount?.(); setConfirmDelete(false); }}>Sim, excluir</Button>
            </>
          }
        >
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "hsl(var(--foreground))" }}>
            Esta ação <strong>não pode ser desfeita</strong>. Todos os dados associados a {u.email} serão removidos em até 30 dias.
          </p>
        </Dialog>
      )}
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
