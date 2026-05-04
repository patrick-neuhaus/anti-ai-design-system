// ui_kits/default/components/navigation/_sidebar-data.jsx
// SOURCE OF TRUTH — sidebar nav items (groups, keys, icons, labels).
// Consumido por Sidebar.jsx (componente real) + MiniSidebar mock no hero
// (showcase/index.html). Move data pra ca elimina drift entre mock e real.
//
// Ordem de carga obrigatoria: depois de Icon.jsx (depende de Icon.*).

window.DEFAULT_SIDEBAR_GROUPS = [
  { label: "Operação", items: [
    { key: "dashboard", icon: Icon.LayoutDashboard, label: "Dashboard" },
    { key: "deliveries", icon: Icon.Package, label: "Deliveries" },
    { key: "romaneios", icon: Icon.FileText, label: "Romaneios" },
    { key: "conferencia", icon: Icon.ScanBarcode, label: "Conferência" },
    { key: "carregamento", icon: Icon.ClipboardCheck, label: "Carregamento" },
    { key: "import", icon: Icon.Upload, label: "Importação" },
  ]},
  { label: "Cadastros", items: [
    { key: "transportadoras", icon: Icon.Truck, label: "Transportadoras" },
    { key: "rotas", icon: Icon.Route, label: "Rotas" },
    { key: "skus", icon: Icon.Box, label: "SKUs" },
  ]},
  { label: "Administração", items: [
    { key: "usuarios", icon: Icon.Users, label: "Usuários" },
    { key: "motivos", icon: Icon.AlertCircle, label: "Motivos" },
    { key: "config", icon: Icon.Settings, label: "Config. Sistema" },
  ]},
];
