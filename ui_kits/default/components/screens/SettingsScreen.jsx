// ui_kits/default/components/screens/SettingsScreen.jsx
// SettingsScreen — admin pode editar tokens (cores) via UI + localStorage.
// When to use: Settings/Configurações de admin que controla tema do app.
// When NOT to use: preferências de usuário individual (use ProfileScreen).
// Persiste em localStorage["ds-tokens-override"]. Live apply via document.documentElement.style.setProperty.
// Mostra warn se par bg/fg cair abaixo de WCAG AA (4.5:1).

// — utils HSL/HEX —
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
};
const rgbToHex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};
const hslToRgb = (h, s, l) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
};
const hexToHslString = (hex) => {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  return `${h} ${s}% ${l}%`;
};
const hslStringToHex = (str) => {
  const m = String(str).trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!m) return "#000000";
  const [r, g, b] = hslToRgb(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  return rgbToHex(r, g, b);
};

// WCAG contrast — relative luminance
const relLum = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};
const contrastRatio = (hex1, hex2) => {
  const l1 = relLum(...hexToRgb(hex1));
  const l2 = relLum(...hexToRgb(hex2));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// — token registry (sections) —
const TOKEN_SECTIONS = [
  {
    title: "Marca",
    description: "Cores principais usadas em CTAs, botões e destaques.",
    tokens: [
      { id: "--primary", label: "Primária", helper: "Botões principais, links" },
      { id: "--accent", label: "Acento", helper: "CTAs e highlights" },
      { id: "--ring", label: "Foco (ring)", helper: "Anel de foco em inputs" },
    ],
  },
  {
    title: "Sidebar",
    description: "Cores da barra lateral fixa.",
    tokens: [
      { id: "--sidebar-background", label: "Fundo" },
      { id: "--sidebar-foreground", label: "Texto" },
      { id: "--sidebar-accent", label: "Item ativo / hover" },
      { id: "--sidebar-indicator", label: "Indicador (barrinha)" },
      { id: "--sidebar-primary", label: "Fundo de switch/grupos" },
    ],
  },
  {
    title: "Superfícies",
    description: "Fundos da aplicação e cartões.",
    tokens: [
      { id: "--background", label: "Fundo da página" },
      { id: "--card", label: "Fundo do card" },
      { id: "--foreground", label: "Texto principal", contrastWith: "--background" },
      { id: "--muted-foreground", label: "Texto secundário", contrastWith: "--background" },
      { id: "--border", label: "Bordas" },
    ],
  },
  {
    title: "Status semânticos",
    description: "Cores de feedback (success, warning, erro).",
    tokens: [
      { id: "--success", label: "Sucesso" },
      { id: "--warning", label: "Aviso" },
      { id: "--destructive", label: "Erro / destrutivo" },
      { id: "--info", label: "Informação" },
    ],
  },
];

const STORAGE_KEY = "ds-tokens-override";

const readDefaultTokens = () => {
  if (typeof window === "undefined") return {};
  const root = getComputedStyle(document.documentElement);
  const out = {};
  TOKEN_SECTIONS.forEach((sec) => sec.tokens.forEach((t) => {
    const v = root.getPropertyValue(t.id).trim();
    if (v) out[t.id] = v;
  }));
  return out;
};

const readOverrides = () => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};

const applyOverride = (tokenId, value) => {
  document.documentElement.style.setProperty(tokenId, value);
};

const SettingsScreen = ({ onSave }) => {
  const [defaults, setDefaults] = React.useState({});
  const [overrides, setOverrides] = React.useState({});

  React.useEffect(() => {
    setDefaults(readDefaultTokens());
    const saved = readOverrides();
    setOverrides(saved);
    Object.entries(saved).forEach(([k, v]) => applyOverride(k, v));
  }, []);

  const valueOf = (tokenId) => overrides[tokenId] ?? defaults[tokenId] ?? "";
  const isOverridden = (tokenId) => overrides[tokenId] !== undefined;

  const handleChange = (tokenId, hex) => {
    const hsl = hexToHslString(hex);
    const next = { ...overrides, [tokenId]: hsl };
    setOverrides(next);
    applyOverride(tokenId, hsl);
  };

  const handleResetToken = (tokenId) => {
    const next = { ...overrides };
    delete next[tokenId];
    setOverrides(next);
    document.documentElement.style.removeProperty(tokenId);
  };

  const handleResetAll = () => {
    Object.keys(overrides).forEach((k) => document.documentElement.style.removeProperty(k));
    setOverrides({});
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    onSave?.(overrides);
  };

  const handleExportCss = () => {
    const lines = [":root {"];
    Object.entries(overrides).forEach(([k, v]) => lines.push(`  ${k}: ${v};`));
    lines.push("}");
    const blob = new Blob([lines.join("\n")], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "tokens-override.css"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader
        title="Design System"
        subtitle="Edite as cores globais do app. Mudanças se aplicam a todos os usuários."
        actions={
          <>
            <Button variant="outline" size="sm" iconLeft={Icon.Copy} onClick={handleExportCss}>Exportar CSS</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.RotateCcw} onClick={handleResetAll}>Restaurar padrão</Button>
            <Button variant="primary" size="sm" iconLeft={Icon.Save} onClick={handleSave}>Salvar tema</Button>
          </>
        }
      />

      {TOKEN_SECTIONS.map((sec) => (
        <Card key={sec.title}>
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", margin: 0 }}>{sec.title}</h3>
            {sec.description && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>{sec.description}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {sec.tokens.map((t) => (
              <TokenRow
                key={t.id}
                token={t}
                value={valueOf(t.id)}
                overridden={isOverridden(t.id)}
                onChange={(hex) => handleChange(t.id, hex)}
                onReset={() => handleResetToken(t.id)}
                contrastValue={t.contrastWith ? valueOf(t.contrastWith) : null}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

const TokenRow = ({ token, value, overridden, onChange, onReset, contrastValue }) => {
  const hex = value ? hslStringToHex(value) : "#000000";
  const ratio = contrastValue ? contrastRatio(hex, hslStringToHex(contrastValue)) : null;
  const ratioOk = ratio === null ? null : ratio >= 4.5;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: 12, borderRadius: 10,
      border: "1px solid hsl(var(--border))",
      background: "hsl(var(--card))",
    }}>
      <label style={{
        position: "relative", flexShrink: 0,
        width: 44, height: 44, borderRadius: 8,
        background: `hsl(${value})`,
        border: "1px solid hsl(var(--border))",
        cursor: "pointer", overflow: "hidden",
      }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
          aria-label={`Cor ${token.label}`}
        />
      </label>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }}>{token.label}</span>
          {overridden && (
            <span style={{
              fontSize: 9, fontWeight: 600, padding: "1px 6px",
              borderRadius: 4, letterSpacing: ".04em",
              background: "hsl(var(--accent) / .15)",
              color: "hsl(var(--accent))",
              textTransform: "uppercase",
            }}>CUSTOM</span>
          )}
          {ratio !== null && (
            <span title={`Contraste ${ratio.toFixed(2)}:1 vs ${token.contrastWith}`} style={{
              fontSize: 10, fontWeight: 600,
              color: ratioOk ? "hsl(var(--success))" : "hsl(var(--destructive))",
            }}>{ratioOk ? "AA ✓" : `AA ✗ ${ratio.toFixed(1)}:1`}</span>
          )}
        </div>
        <div style={{
          fontSize: 11, color: "hsl(var(--muted-foreground))",
          fontFamily: "ui-monospace, monospace", marginTop: 2,
        }}>
          {hex} · {value}
        </div>
        {token.helper && <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{token.helper}</div>}
      </div>
      {overridden && (
        <button
          type="button"
          onClick={onReset}
          aria-label={`Restaurar padrão de ${token.label}`}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: "transparent", border: 0, color: "hsl(var(--muted-foreground))",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(var(--muted))"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Icon.RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};

window.SettingsScreen = SettingsScreen;
