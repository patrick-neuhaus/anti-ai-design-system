// ui_kits/default/components/screens/EmptyDashboardScreen.jsx
// EmptyDashboardScreen — first-run state, no data yet. Onboarding entry point.
// When to use: brand-new account, no records ingested yet.
// When NOT to use: filtered empty (table-level EmptyState). System error (Alert destructive).

const EmptyDashboardScreen = ({ onPrimaryAction, onSecondaryAction }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <PageHeader title="Dashboard" subtitle="Visão geral da expedição logística" />
    <Card padding={0}>
      <EmptyState
        icon={Icon.Inbox}
        title="Ainda sem dados pra mostrar"
        description="Crie seu primeiro romaneio ou importe uma planilha pra ver os indicadores aparecerem aqui."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={onPrimaryAction} iconLeft={Icon.Plus}>Novo romaneio</Button>
            <Button variant="outline" onClick={onSecondaryAction} iconLeft={Icon.Upload}>Importar CSV</Button>
          </div>
        }
      />
    </Card>
  </div>
);

window.EmptyDashboardScreen = EmptyDashboardScreen;
