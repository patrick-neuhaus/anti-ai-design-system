// ui_kits/default/components/screens/SettingsScreen.jsx
// SettingsScreen — color editor completo +1 a +7.
// +1 WCAG AA real-time badges por par token, warning <4.5:1, block save <3:1
// +2 Presets prontos (Ops Default, CRM Dark, Wiki Sage, Dark Mode)
// +3 Export/import JSON + URL share (?theme=base64)
// +4 History/undo/redo (last 10) + diff view
// +5 Named themes (save/load multiple)
// +6 Dark auto-derive toggle (inverte luminance)
// +7 Workspace-wide flag toggle
// Persiste em localStorage["ds-tokens-override"]. Live apply via document.documentElement.style.setProperty.

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

// — token registry —
const TOKEN_SECTIONS = [
  {
    title: "Marca",
    description: "Cores principais usadas em CTAs, botões e destaques.",
    tokens: [
      { id: "--primary",   label: "Primária",   helper: "Botões principais, links", contrastWith: "--primary-foreground" },
      { id: "--accent",    label: "Acento",     helper: "CTAs e highlights",         contrastWith: null },
      { id: "--ring",      label: "Foco (ring)", helper: "Anel de foco em inputs",   contrastWith: null },
    ],
  },
  {
    title: "Sidebar",
    description: "Cores da barra lateral fixa.",
    tokens: [
      { id: "--sidebar-background", label: "Fundo" },
      { id: "--sidebar-foreground", label: "Texto" },
      { id: "--sidebar-accent",     label: "Item ativo / hover" },
      { id: "--sidebar-indicator",  label: "Indicador (barrinha)" },
      { id: "--sidebar-primary",    label: "Fundo de switch/grupos" },
    ],
  },
  {
    title: "Superfícies",
    description: "Fundos da aplicação e cartões.",
    tokens: [
      { id: "--background",        label: "Fundo da página" },
      { id: "--card",              label: "Fundo do card" },
      { id: "--foreground",        label: "Texto principal",   contrastWith: "--background" },
      { id: "--muted-foreground",  label: "Texto secundário",  contrastWith: "--background" },
      { id: "--border",            label: "Bordas" },
    ],
  },
  {
    title: "Status semânticos",
    description: "Cores de feedback (success, warning, erro).",
    tokens: [
      { id: "--success",     label: "Sucesso" },
      { id: "--warning",     label: "Aviso" },
      { id: "--destructive", label: "Erro / destrutivo" },
      { id: "--info",        label: "Informação" },
    ],
  },
];

// +2 Presets
const COLOR_PRESETS = {
  "Ops Default": {
    "--primary": "184 100% 18%", "--accent": "12 65% 55%",
    "--background": "30 33% 96%", "--foreground": "16 38% 12%",
    "--card": "0 0% 100%", "--border": "30 20% 87%",
    "--sidebar-background": "184 100% 18%", "--sidebar-accent": "184 80% 25%", "--sidebar-indicator": "12 65% 55%",
    "--success": "152 85% 30%", "--warning": "38 92% 50%", "--destructive": "0 100% 43%",
    "--ring": "184 100% 18%", "--primary-foreground": "0 0% 100%",
    "--sidebar-foreground": "0 0% 100%", "--sidebar-primary": "184 80% 22%",
    "--muted-foreground": "20 29% 33%", "--info": "217 91% 45%",
  },
  "CRM Dark": {
    "--primary": "220 90% 55%", "--accent": "280 70% 65%",
    "--background": "222 20% 10%", "--foreground": "220 15% 92%",
    "--card": "222 20% 14%", "--border": "222 20% 20%",
    "--sidebar-background": "222 20% 7%", "--sidebar-accent": "222 20% 15%", "--sidebar-indicator": "220 90% 65%",
    "--success": "152 70% 45%", "--warning": "38 90% 55%", "--destructive": "0 85% 55%",
    "--ring": "220 90% 55%", "--primary-foreground": "0 0% 100%",
    "--sidebar-foreground": "0 0% 90%", "--sidebar-primary": "222 20% 12%",
    "--muted-foreground": "220 10% 55%", "--info": "200 80% 60%",
  },
  "Wiki Sage": {
    "--primary": "145 40% 35%", "--accent": "38 80% 55%",
    "--background": "120 10% 96%", "--foreground": "130 25% 12%",
    "--card": "0 0% 100%", "--border": "120 10% 85%",
    "--sidebar-background": "145 40% 30%", "--sidebar-accent": "145 40% 38%", "--sidebar-indicator": "38 80% 60%",
    "--success": "152 80% 32%", "--warning": "38 90% 50%", "--destructive": "0 90% 45%",
    "--ring": "145 40% 35%", "--primary-foreground": "0 0% 100%",
    "--sidebar-foreground": "0 0% 100%", "--sidebar-primary": "145 40% 25%",
    "--muted-foreground": "130 15% 40%", "--info": "200 70% 45%",
  },
  "Dark Mode": {
    "--primary": "200 80% 55%", "--accent": "25 90% 60%",
    "--background": "220 15% 8%", "--foreground": "220 10% 90%",
    "--card": "220 15% 12%", "--border": "220 15% 20%",
    "--sidebar-background": "220 15% 5%", "--sidebar-accent": "220 15% 13%", "--sidebar-indicator": "25 90% 60%",
    "--success": "152 70% 50%", "--warning": "38 90% 55%", "--destructive": "0 80% 60%",
    "--ring": "200 80% 55%", "--primary-foreground": "0 0% 100%",
    "--sidebar-foreground": "0 0% 88%", "--sidebar-primary": "220 15% 10%",
    "--muted-foreground": "220 10% 55%", "--info": "200 75% 55%",
  },
};

const STORAGE_KEY = "ds-tokens-override";
const NAMED_KEY   = "ds-tokens-named";
const HISTORY_MAX = 10;

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
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};

const applyOverride = (tokenId, value) => {
  document.documentElement.style.setProperty(tokenId, value);
};

const applyAll = (overrides, defaults) => {
  Object.entries(overrides).forEach(([k, v]) => applyOverride(k, v));
  Object.keys(defaults).filter((k) => !(k in overrides)).forEach((k) =>
    document.documentElement.style.removeProperty(k)
  );
};

// ─── SettingsScreen ───────────────────────────────────────────────
const SettingsScreen = ({ onSave }) => {
  const [defaults, setDefaults]     = React.useState({});
  const [overrides, setOverrides]   = React.useState({});
  const [history, setHistory]       = React.useState([{}]); // ring of up to HISTORY_MAX+1 states
  const [histIdx, setHistIdx]       = React.useState(0);
  const [namedThemes, setNamedThemes] = React.useState({});
  const [newThemeName, setNewThemeName] = React.useState("");
  const [darkDerived, setDarkDerived] = React.useState(false);
  const [workspaceWide, setWorkspaceWide] = React.useState(true);
  const [activeTab, setActiveTab]   = React.useState("editor");
  const [toast, setToast]           = React.useState(null);
  const importRef = React.useRef(null);

  React.useEffect(() => {
    const defs = readDefaultTokens();
    setDefaults(defs);
    const saved = readOverrides();
    setOverrides(saved);
    setHistory([saved]);
    setHistIdx(0);
    Object.entries(saved).forEach(([k, v]) => applyOverride(k, v));
    try { setNamedThemes(JSON.parse(localStorage.getItem(NAMED_KEY) || "{}")); } catch {}
    // +3 Apply theme from URL ?theme=
    try {
      const p = new URLSearchParams(window.location.search).get("theme");
      if (p) {
        const data = JSON.parse(atob(p));
        setOverrides(data);
        applyAll(data, defs);
        showToast("✅ Tema carregado da URL");
      }
    } catch {}
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const valueOf = (tokenId) => overrides[tokenId] ?? defaults[tokenId] ?? "";
  const isOverridden = (tokenId) => tokenId in overrides;

  // Push state to history ring
  const pushHistory = (next) => {
    const trimmed = history.slice(0, histIdx + 1);
    const newHist = [...trimmed, next].slice(-(HISTORY_MAX + 1));
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
  };

  const commitOverrides = (next) => {
    setOverrides(next);
    applyAll(next, defaults);
  };

  const handleChange = (tokenId, hex) => {
    const hsl = hexToHslString(hex);
    const next = { ...overrides, [tokenId]: hsl };
    pushHistory(next);
    commitOverrides(next);
  };

  const handleResetToken = (tokenId) => {
    const next = { ...overrides };
    delete next[tokenId];
    pushHistory(next);
    commitOverrides(next);
  };

  const handleResetAll = () => {
    pushHistory({});
    commitOverrides({});
  };

  // +1 Block save if min contrast < 3:1
  const getGlobalMinContrast = () => {
    const bg = hslStringToHex(valueOf("--background"));
    const fg = hslStringToHex(valueOf("--foreground"));
    return contrastRatio(bg, fg);
  };

  const handleSave = () => {
    const ratio = getGlobalMinContrast();
    if (ratio < 3) {
      showToast(`❌ Contraste text/bg (${ratio.toFixed(1)}:1) abaixo de 3:1 — salvar bloqueado`);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    onSave?.(overrides);
    showToast("✅ Tema salvo!");
  };

  // +2 Apply preset
  const applyPreset = (name) => {
    const preset = COLOR_PRESETS[name];
    if (!preset) return;
    pushHistory(preset);
    commitOverrides(preset);
    showToast(`✅ Preset "${name}" aplicado`);
  };

  // +3 Export JSON
  const handleExportJson = () => {
    const lines = JSON.stringify(overrides, null, 2);
    const blob = new Blob([lines], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "theme.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // +3 Export CSS
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

  // +3 Import JSON
  const handleImportJson = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        pushHistory(data);
        commitOverrides(data);
        showToast("✅ Tema importado!");
      } catch {
        showToast("❌ JSON inválido");
      }
    };
    reader.readAsText(f);
  };

  // +3 URL share
  const handleShareUrl = () => {
    try {
      const b64 = btoa(JSON.stringify(overrides));
      const url = new URL(window.location.href);
      url.searchParams.set("theme", b64);
      navigator.clipboard?.writeText(url.toString());
      showToast("📋 Link do tema copiado!");
    } catch {
      showToast("❌ Clipboard não disponível");
    }
  };

  // +4 Undo / Redo
  const handleUndo = () => {
    if (histIdx <= 0) return;
    const ni = histIdx - 1;
    setHistIdx(ni);
    const state = history[ni];
    setOverrides(state);
    applyAll(state, defaults);
  };

  const handleRedo = () => {
    if (histIdx >= history.length - 1) return;
    const ni = histIdx + 1;
    setHistIdx(ni);
    const state = history[ni];
    setOverrides(state);
    applyAll(state, defaults);
  };

  const jumpHistory = (idx) => {
    setHistIdx(idx);
    const state = history[idx];
    setOverrides(state);
    applyAll(state, defaults);
  };

  // +5 Named themes
  const handleSaveNamed = () => {
    if (!newThemeName.trim()) return;
    const next = { ...namedThemes, [newThemeName.trim()]: overrides };
    setNamedThemes(next);
    localStorage.setItem(NAMED_KEY, JSON.stringify(next));
    setNewThemeName("");
    showToast(`✅ Tema "${newThemeName.trim()}" salvo`);
  };

  const handleLoadNamed = (name) => {
    const t = namedThemes[name];
    if (!t) return;
    pushHistory(t);
    commitOverrides(t);
    showToast(`✅ Tema "${name}" carregado`);
  };

  const handleDeleteNamed = (name) => {
    const next = { ...namedThemes };
    delete next[name];
    setNamedThemes(next);
    localStorage.setItem(NAMED_KEY, JSON.stringify(next));
    showToast(`🗑️ Tema "${name}" removido`);
  };

  // +6 Dark auto-derive
  const handleDarkDerive = (on) => {
    setDarkDerived(on);
    if (on) {
      const next = { ...overrides };
      ["--background", "--card", "--foreground", "--muted", "--muted-foreground"].forEach((id) => {
        const val = valueOf(id);
        const m = val.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
        if (m) {
          const l = parseFloat(m[3]);
          next[id] = `${m[1]} ${m[2]}% ${Math.round(100 - l)}%`;
        }
      });
      pushHistory(next);
      commitOverrides(next);
      showToast("🌙 Dark mode derivado aplicado");
    } else {
      handleResetAll();
      showToast("☀️ Light mode restaurado");
    }
  };

  // Contrast check for banner
  const globalRatio = getGlobalMinContrast();
  const globalOk   = globalRatio >= 4.5;
  const globalWarn = globalRatio >= 3 && globalRatio < 4.5;

  const TABS = [
    ["editor",  "Editor de cores"],
    ["presets", "Presets"],
    ["export",  "Export / Import"],
    ["history", "Histórico"],
    ["named",   "Temas salvos"],
    ["options", "Opções"],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
      <PageHeader
        title="Design System"
        subtitle="Editor de tokens de cor com WCAG, presets, export/import, histórico e temas nomeados."
        actions={
          <>
            <Button variant="outline" size="sm" iconLeft={Icon.Undo2} onClick={handleUndo}
              disabled={histIdx <= 0}>Undo</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.Redo2} onClick={handleRedo}
              disabled={histIdx >= history.length - 1}>Redo</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.Copy} onClick={handleExportCss}>Exportar CSS</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.RotateCcw} onClick={handleResetAll}>Restaurar padrão</Button>
            <Button variant="primary" size="sm" iconLeft={Icon.Save} onClick={handleSave}
              style={{ opacity: globalRatio < 3 ? 0.5 : 1 }}>Salvar tema</Button>
          </>
        }
      />

      {/* +1 WCAG AA banner */}
      {!globalOk && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", borderRadius: 10,
          background: globalWarn ? "hsl(var(--warning) / .12)" : "hsl(var(--destructive) / .1)",
          color: globalWarn ? "hsl(35 85% 30%)" : "hsl(0 70% 40%)",
          fontSize: 13, fontWeight: 500,
        }}>
          <Icon.AlertTriangle size={16} />
          {globalWarn
            ? `Contraste text/bg: ${globalRatio.toFixed(1)}:1 — abaixo de WCAG AA (4.5:1). Salvar ainda permitido mas corrija antes de produção.`
            : `Contraste text/bg: ${globalRatio.toFixed(1)}:1 — CRÍTICO (< 3:1). Salvar bloqueado.`}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid hsl(var(--border))" }}>
        {TABS.map(([k, l]) => (
          <button key={k} onClick={() => setActiveTab(k)} style={{
            padding: "10px 16px", fontSize: 13, fontWeight: activeTab === k ? 500 : 400,
            color: activeTab === k ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
            border: "none", background: "none", cursor: "pointer",
            borderBottom: `2px solid ${activeTab === k ? "hsl(var(--accent))" : "transparent"}`,
            marginBottom: -1, transition: "color 150ms",
          }}>{l}</button>
        ))}
      </div>

      {/* ── Tab: Editor ── */}
      {activeTab === "editor" && TOKEN_SECTIONS.map((sec) => (
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

      {/* ── Tab: Presets (+2) ── */}
      {activeTab === "presets" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Presets prontos</h3>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>
              Aplicar preset substitui todos os tokens simultaneamente.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {Object.entries(COLOR_PRESETS).map(([name, preset]) => (
              <div key={name}
                onClick={() => applyPreset(name)}
                style={{
                  cursor: "pointer", borderRadius: 14, border: "1.5px solid hsl(var(--border))",
                  background: "hsl(var(--card))", padding: 16, transition: "border-color 150ms, box-shadow 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary) / .5)"; e.currentTarget.style.boxShadow = "0 4px 12px hsl(var(--foreground) / .07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {["--primary", "--accent", "--background", "--sidebar-background"].map((tk) => (
                    <div key={tk} style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: preset[tk] ? `hsl(${preset[tk]})` : "transparent",
                      border: "1px solid hsl(0 0% 0% / .1)",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>Clique para aplicar</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Tab: Export / Import (+3) ── */}
      {activeTab === "export" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Export / Import</h3>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>
              JSON, CSS e link compartilhável.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <Button variant="outline" size="sm" iconLeft={Icon.Copy} onClick={handleExportCss}>Exportar CSS</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.FileJson} onClick={handleExportJson}>Exportar JSON</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.Upload} onClick={() => importRef.current?.click()}>Importar JSON</Button>
            <input ref={importRef} type="file" accept=".json,application/json" style={{ display: "none" }} onChange={handleImportJson} />
            <Button variant="outline" size="sm" iconLeft={Icon.Link} onClick={handleShareUrl}>Copiar link de tema</Button>
          </div>
          <div style={{
            background: "hsl(var(--sidebar-background))", color: "hsl(var(--sidebar-foreground))",
            borderRadius: 12, padding: "16px 20px",
            fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.7,
            maxHeight: 280, overflow: "auto", whiteSpace: "pre",
          }}>
            {Object.keys(overrides).length === 0
              ? "// Nenhum override ativo — tema padrão em uso"
              : JSON.stringify(overrides, null, 2)}
          </div>
        </Card>
      )}

      {/* ── Tab: Histórico (+4) ── */}
      {activeTab === "history" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Histórico</h3>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>
              Últimos {HISTORY_MAX} estados. Clique para restaurar.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <Button variant="outline" size="sm" iconLeft={Icon.Undo2} onClick={handleUndo} disabled={histIdx <= 0}>Undo</Button>
            <Button variant="outline" size="sm" iconLeft={Icon.Redo2} onClick={handleRedo} disabled={histIdx >= history.length - 1}>Redo</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...history].reverse().map((state, ri) => {
              const idx = history.length - 1 - ri;
              const isCurrent = idx === histIdx;
              const keys = Object.keys(state);
              // diff: tokens that changed from previous
              const prevState = history[idx - 1] || {};
              const changed = keys.filter((k) => state[k] !== prevState[k]);
              return (
                <div key={idx} onClick={() => jumpHistory(idx)} style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 14px",
                  borderRadius: 10, cursor: "pointer",
                  border: `1.5px solid ${isCurrent ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
                  background: isCurrent ? "hsl(var(--primary) / .05)" : "hsl(var(--card))",
                  transition: "border-color 150ms",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    color: "hsl(var(--muted-foreground))", minWidth: 22, paddingTop: 1,
                  }}>#{idx}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {keys.length === 0
                        ? "Estado padrão (sem overrides)"
                        : keys.length >= 12
                          ? `Preset completo (${keys.length} tokens)`
                          : `${keys.length} token${keys.length !== 1 ? "s" : ""} sobrescrito${keys.length !== 1 ? "s" : ""}`}
                    </div>
                    {changed.length > 0 && idx > 0 && (
                      <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                        Δ {changed.slice(0, 4).join(", ")}{changed.length > 4 ? ` +${changed.length - 4} mais` : ""}
                      </div>
                    )}
                  </div>
                  {isCurrent && <Badge intent="primary">ATUAL</Badge>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Tab: Temas salvos (+5) ── */}
      {activeTab === "named" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Temas nomeados</h3>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, margin: 0 }}>
              Salve o estado atual com um nome e carregue depois.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <FormField label="Nome do tema" style={{ flex: 1 }}>
              <Input
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="ex: verão 2026, natal, cliente X…"
                onKeyDown={(e) => e.key === "Enter" && handleSaveNamed()}
              />
            </FormField>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Button size="sm" iconLeft={Icon.Save} onClick={handleSaveNamed}>Salvar atual</Button>
            </div>
          </div>
          {Object.keys(namedThemes).length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>
              Nenhum tema salvo ainda. Personalize e salve acima.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(namedThemes).map(([name, state]) => {
                const keys = Object.keys(state);
                return (
                  <div key={name} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                    borderRadius: 10, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
                        {keys.length} token{keys.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {/* Swatch preview */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {["--primary", "--accent", "--background"].map((tk) => state[tk] && (
                        <div key={tk} style={{ width: 20, height: 20, borderRadius: 5, background: `hsl(${state[tk]})`, border: "1px solid hsl(var(--border))" }} />
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleLoadNamed(name)}>Carregar</Button>
                    <button onClick={() => handleDeleteNamed(name)} style={{
                      width: 28, height: 28, border: 0, borderRadius: 6, cursor: "pointer",
                      background: "transparent", color: "hsl(var(--muted-foreground))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(var(--destructive) / .1)"; e.currentTarget.style.color = "hsl(var(--destructive))"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "hsl(var(--muted-foreground))"; }}
                    >
                      <Icon.Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* ── Tab: Opções (+6 +7) ── */}
      {activeTab === "options" && (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Opções avançadas</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* +6 Dark auto-derive */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid hsl(var(--border) / .7)", gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Gerar dark mode automaticamente</div>
                <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, maxWidth: 480 }}>
                  Inverte a luminance dos tokens de superfície (background, card, foreground, muted).
                  Toggle novamente para restaurar.
                </div>
              </div>
              <OptionToggle
                on={darkDerived}
                onChange={(on) => handleDarkDerive(on)}
              />
            </div>
            {/* +7 Workspace-wide */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Aplicar para todos os usuários</div>
                  <Badge intent="neutral">Workspace-wide</Badge>
                </div>
                <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 2, maxWidth: 480 }}>
                  Quando ativo, o tema salvo é compartilhado com todos os membros do workspace.
                  No quick-start-remix, persiste na tabela <code style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>user_templates</code>.
                </div>
              </div>
              <OptionToggle
                on={workspaceWide}
                onChange={setWorkspaceWide}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "hsl(var(--foreground))", color: "hsl(var(--background))",
          padding: "12px 18px", borderRadius: 14, fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 28px hsl(var(--foreground) / .25)", zIndex: 200,
          animation: "toastRise 200ms ease",
        }}>
          {toast}
        </div>
      )}
      <style>{`@keyframes toastRise{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
};

// ─── TokenRow (with +1 WCAG badges) ──────────────────────────────
const TokenRow = ({ token, value, overridden, onChange, onReset, contrastValue }) => {
  const hex = value ? hslStringToHex(value) : "#000000";
  const contrastHex = contrastValue ? hslStringToHex(contrastValue) : null;
  const ratio = contrastHex ? contrastRatio(hex, contrastHex) : null;
  const ratioAA  = ratio !== null ? ratio >= 4.5 : null;
  const ratioAAA = ratio !== null ? ratio >= 7.0 : null;
  const ratioWarn = ratio !== null && ratio >= 3 && ratio < 4.5;
  const ratioCrit = ratio !== null && ratio < 3;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: 12, borderRadius: 10,
      border: `1px solid ${ratioCrit ? "hsl(var(--destructive) / .5)" : "hsl(var(--border))"}`,
      background: "hsl(var(--card))",
    }}>
      <label style={{
        position: "relative", flexShrink: 0,
        width: 44, height: 44, borderRadius: 8,
        background: value ? `hsl(${value})` : "transparent",
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))" }}>{token.label}</span>
          {overridden && (
            <span style={{
              fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
              letterSpacing: ".04em", textTransform: "uppercase",
              background: "hsl(var(--accent) / .15)", color: "hsl(var(--accent))",
            }}>CUSTOM</span>
          )}
          {/* +1 WCAG badges */}
          {ratio !== null && (
            <span title={`Contraste: ${ratio.toFixed(2)}:1 vs ${token.contrastWith}`} style={{
              fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
              background: ratioCrit
                ? "hsl(var(--destructive) / .12)"
                : ratioWarn
                  ? "hsl(var(--warning) / .15)"
                  : "hsl(var(--success) / .12)",
              color: ratioCrit
                ? "hsl(0 70% 40%)"
                : ratioWarn
                  ? "hsl(35 85% 28%)"
                  : "hsl(var(--success))",
            }}>
              {ratioCrit
                ? `✗ ${ratio.toFixed(1)}:1`
                : ratioWarn
                  ? `⚠ ${ratio.toFixed(1)}:1`
                  : ratioAAA
                    ? `AAA ${ratio.toFixed(1)}:1`
                    : `AA ${ratio.toFixed(1)}:1`}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontFamily: "ui-monospace, monospace", marginTop: 2 }}>
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

// N2: OptionToggle delega pro Switch primitive (era inline duplicado).
const OptionToggle = ({ on, onChange }) => (
  <Switch checked={on} onChange={(e) => onChange(e.target.checked)} />
);

window.SettingsScreen = SettingsScreen;
