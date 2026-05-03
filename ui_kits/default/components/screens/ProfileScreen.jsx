// ui_kits/default/components/screens/ProfileScreen.jsx
// ProfileScreen — perfil próprio com FileUpload real de avatar (Object URL preview),
// sections: Avatar+Nome / Email read-only / Preferências / Atividade / Segurança / Zona perigosa.
// When to use: tela "Meu perfil" do usuário logado.
// When NOT to use: perfil público de outro usuário. Admin de usuário (admin panel).

const ProfileScreen = ({ user, onSave, onChangePassword, onDeleteAccount, onUploadAvatar }) => {
  const u = user ?? { name: "Nome Sobrenome", email: "email@exemplo.com", role: "Operador", since: "Mar/2024", avatarUrl: null };
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(u.name);
  const [avatarSrc, setAvatarSrc] = React.useState(u.avatarUrl || null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  // FileUpload real — preview via Object URL
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const prev = avatarSrc;
    if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
    onUploadAvatar?.(file, url);
  };

  const handleSave = () => {
    onSave?.({ name, avatarSrc });
    setEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleCancel = () => {
    setName(u.name);
    setEditing(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader title="Perfil" subtitle="Suas informações pessoais e configurações de conta" />

      {savedMsg && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderRadius: 10,
          background: "hsl(var(--success) / .12)", color: "hsl(var(--success))", fontSize: 13,
        }}>
          <Icon.Check size={16} /> Perfil salvo com sucesso.
        </div>
      )}

      {/* ── Section 1: Avatar + Nome ─────────────────────────── */}
      <Card>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Avatar e Nome</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Foto de perfil e nome de exibição</p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          {/* Avatar with real file upload */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "hsl(var(--primary) / .18)",
              border: "2px solid hsl(var(--border))",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 28,
              color: "hsl(var(--primary))",
            }}>
              {avatarSrc
                ? <img src={avatarSrc} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : initials}
            </div>
            <button
              type="button"
              aria-label="Trocar foto"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: 0, right: 0,
                width: 30, height: 30, borderRadius: "50%",
                background: "hsl(var(--card))", border: "1.5px solid hsl(var(--border))",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "var(--shadow-control)",
                color: "hsl(var(--foreground))",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(var(--muted))"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(var(--card))"; }}
            >
              <Icon.Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Name + actions */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
                <FormField label="Nome">
                  <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                </FormField>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button onClick={handleSave} size="sm">Salvar</Button>
                  <Button variant="outline" onClick={handleCancel} size="sm">Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 600, color: "hsl(var(--foreground))" }}>{name}</div>
                <div style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{u.role}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                  <Badge intent="primary">{u.role}</Badge>
                  {u.since && <Badge intent="neutral">Desde {u.since}</Badge>}
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <Button variant="outline" size="sm" iconLeft={Icon.Pencil} onClick={() => setEditing(true)}>Editar nome</Button>
                  <Button variant="outline" size="sm" iconLeft={Icon.Camera} onClick={() => fileInputRef.current?.click()}>Trocar foto</Button>
                </div>
              </>
            )}
          </div>
        </div>
        {avatarSrc && (
          <div style={{ marginTop: 12, fontSize: 12, color: "hsl(var(--muted-foreground))" }}>
            <Icon.Check size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, color: "hsl(var(--success))" }} />
            Preview carregado — clique em Salvar para confirmar.
          </div>
        )}
      </Card>

      {/* ── Section 2: Email read-only ───────────────────────── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Email</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Endereço de login — somente leitura</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{
            flex: 1, padding: "10px 14px", borderRadius: 10,
            background: "hsl(var(--muted) / .4)", border: "1px solid hsl(var(--border))",
            fontSize: 13, color: "hsl(var(--foreground))", fontFamily: "var(--font-mono)",
          }}>
            {u.email}
          </div>
          <Badge intent="neutral">Verificado</Badge>
        </div>
        <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 8, marginBottom: 0 }}>
          Para alterar o email, entre em contato com o suporte.
        </p>
      </Card>

      {/* ── Section 3: Preferências ──────────────────────────── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Preferências</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Notificações e idioma</p>
        </div>
        {[
          ["Notificações por email", "Receber alertas e atualizações por email", true],
          ["Resumo semanal", "Email de resumo toda segunda-feira às 9h", false],
          ["Notificações no app", "Alertas em tempo real dentro da plataforma", true],
        ].map(([label, desc, defaultOn], i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: i < 2 ? "1px solid hsl(var(--border) / .7)" : "none",
            gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{desc}</div>
            </div>
            <PrefsToggle defaultOn={defaultOn} />
          </div>
        ))}
        <div style={{ paddingTop: 12, borderTop: "1px solid hsl(var(--border) / .7)", marginTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Idioma</div>
          <select style={{
            padding: "9px 12px", borderRadius: 10,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))", color: "hsl(var(--foreground))",
            fontSize: 13, fontFamily: "var(--font-body)", cursor: "pointer",
          }}>
            <option value="pt-br">Português (Brasil)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </Card>

      {/* ── Section 4: Atividade recente ─────────────────────── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Atividade recente</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Últimas 5 ações na conta</p>
        </div>
        {[
          ["Entrou no sistema", "Agora há pouco", "Chrome · São Paulo, BR", "success"],
          ["Perfil atualizado", "há 2 dias", "Chrome · São Paulo, BR", "info"],
          ["Senha alterada", "há 14 dias", "Chrome · São Paulo, BR", "warning"],
          ["Login via Google", "há 22 dias", "Safari · Mobile", "info"],
          ["Conta criada", "Mar 2024", "Chrome · São Paulo, BR", "neutral"],
        ].map(([action, when, where, intent], i) => (
          <div key={action} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0",
            borderBottom: i < 4 ? "1px solid hsl(var(--border) / .6)" : "none",
          }}>
            <Badge intent={intent} style={{ flexShrink: 0 }}>{action}</Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", fontFamily: "var(--font-mono)" }}>{where}</div>
            </div>
            <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", whiteSpace: "nowrap" }}>{when}</div>
          </div>
        ))}
      </Card>

      {/* ── Section 5: Segurança ─────────────────────────────── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>Segurança</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Senha e autenticação de dois fatores</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid hsl(var(--border) / .7)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Senha</div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Última alteração há 14 dias</div>
            </div>
            <Button variant="outline" size="sm" iconLeft={Icon.Lock} onClick={onChangePassword}>Alterar senha</Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Autenticação 2FA</div>
                <Badge intent="neutral">Não configurado</Badge>
              </div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Adicione uma camada extra de segurança</div>
            </div>
            <Button variant="outline" size="sm" iconLeft={Icon.Shield}>Configurar 2FA</Button>
          </div>
        </div>
      </Card>

      {/* ── Section 6: Zona perigosa ─────────────────────────── */}
      <Card>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--destructive))", margin: 0 }}>Zona perigosa</h3>
          <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>Ações irreversíveis — tome cuidado</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingBottom: 12, borderBottom: "1px solid hsl(var(--border) / .7)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Exportar meus dados</div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Download de todos os seus dados em JSON</div>
            </div>
            <Button variant="outline" size="sm" iconLeft={Icon.Download}>Exportar dados</Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Excluir conta</div>
              <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Remove permanentemente todos os seus dados</div>
            </div>
            <Button variant="destructive" size="sm" iconLeft={Icon.Trash2} onClick={() => setConfirmDelete(true)}>Excluir conta</Button>
          </div>
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <Dialog
          title="Excluir conta?"
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="destructive" size="sm" onClick={() => { onDeleteAccount?.(); setConfirmDelete(false); }}>
                Sim, excluir permanentemente
              </Button>
            </>
          }
        >
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "hsl(var(--foreground))" }}>
            Esta ação <strong>não pode ser desfeita</strong>. Todos os dados associados a{" "}
            <strong>{u.email}</strong> serão removidos em até 30 dias.
          </p>
        </Dialog>
      )}
    </div>
  );
};

// Small inline toggle (used only in this screen — no global dep)
const PrefsToggle = ({ defaultOn = false }) => {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div
      role="switch"
      aria-checked={on}
      onClick={() => setOn((o) => !o)}
      style={{
        width: 36, height: 20, borderRadius: 999, flexShrink: 0,
        background: on ? "hsl(var(--primary))" : "hsl(var(--muted))",
        position: "relative", cursor: "pointer", transition: "background 150ms",
      }}
    >
      <div style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 16, height: 16, borderRadius: 50, background: "#fff",
        transition: "left 150ms", boxShadow: "0 1px 3px rgba(0,0,0,.15)",
      }} />
    </div>
  );
};

window.ProfileScreen = ProfileScreen;
