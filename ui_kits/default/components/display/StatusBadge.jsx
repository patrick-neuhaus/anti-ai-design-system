// ui_kits/default/components/display/StatusBadge.jsx
// StatusBadge — semantic status pill mapping domain values to visual intents.
// When to use: tabular row state (conferido, pendente, divergente, etc).
// When NOT to use: generic counts (Badge neutral). User tags (Tag).

const STATUS_MAP = {
  conferido:      { intent: "success",     label: "Conferido" },
  pendente:       { intent: "warning",     label: "Pendente" },
  em_conferencia: { intent: "info",        label: "Em conferência" },
  divergente:     { intent: "destructive", label: "Divergente" },
  finalizado:     { intent: "success",     label: "Finalizado", strong: true },
};

const StatusBadge = ({ value, map }) => {
  const m = (map ?? STATUS_MAP)[value] ?? { intent: "neutral", label: String(value ?? "") };
  return <Badge intent={m.intent} strong={!!m.strong} dot>{m.label}</Badge>;
};

window.StatusBadge = StatusBadge;
window.STATUS_MAP_DEFAULT = STATUS_MAP;
