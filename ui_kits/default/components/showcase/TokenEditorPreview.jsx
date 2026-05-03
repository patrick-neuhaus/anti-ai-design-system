/*
  TokenEditorPreview.jsx — Wave 6.2
  Componente reusável do Token Editor (Básico/Avançado + WCAG + presets).
  Carregado via <script type="text/babel"> — helpers ficam no escopo global Babel.

  Props:
    compact (bool, default false) — modo compacto pra uso no screens.html Picker
*/

// ── Helpers (escopo global Babel) ─────────────────────────────────────────

const _te_hexToHsl = (hex) => {
  try {
    const [h, s, l] = chroma(hex).hsl();
    const hDeg = isNaN(h) ? 0 : Math.round(h);
    const sPct = Math.round((isNaN(s) ? 0 : s) * 100);
    const lPct = Math.round((isNaN(l) ? 0 : l) * 100);
    return `${hDeg} ${sPct}% ${lPct}%`;
  } catch { return "0 0% 50%"; }
};

const _te_hslVarToHex = (hslStr) => {
  try {
    const parts = hslStr.trim().split(/\s+/);
    if (parts.length < 3) return "#888888";
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    return chroma.hsl(h, s, l).hex();
  } catch { return "#888888"; }
};

const _te_getWcagBadge = (ratio) => {
  if (ratio >= 7)   return { cls: "aaa",    label: "AAA" };
  if (ratio >= 4.5) return { cls: "aa",     label: "AA" };
  if (ratio >= 3)   return { cls: "aa-low", label: "AA-" };
  return               { cls: "fail",   label: "FAIL" };
};

const _te_ADVANCED_TOKENS = [
  { group: "Marca",       tokens: ["--primary","--accent","--ring"] },
  { group: "Status",      tokens: ["--success","--warning","--info","--destructive"] },
  { group: "Sidebar",     tokens: ["--sidebar-background","--sidebar-accent","--sidebar-indicator"] },
  { group: "Superfícies", tokens: ["--background","--card","--muted","--border"] },
];
const _te_ALL_TOKENS = _te_ADVANCED_TOKENS.flatMap(g => g.tokens);

const _te_readCurrentTokens = () => {
  const result = {};
  _te_ALL_TOKENS.concat(["--foreground","--primary-foreground","--accent-foreground"]).forEach(t => {
    result[t] = getComputedStyle(document.documentElement).getPropertyValue(t).trim();
  });
  return result;
};

const _te_applyToken = (name, hslVal) => {
  document.documentElement.style.setProperty(name, hslVal);
};

const _te_resetAllTokens = () => {
  _te_ALL_TOKENS.concat(["--foreground","--primary-foreground","--accent-foreground"]).forEach(t => {
    document.documentElement.style.removeProperty(t);
  });
};

const _te_exportCss = (tokens) => {
  const lines = Object.entries(tokens)
    .filter(([k]) => _te_ALL_TOKENS.includes(k))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  const css = `:root {\n${lines}\n}\n`;
  const blob = new Blob([css], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "anti-ai-theme.css"; a.click();
  URL.revokeObjectURL(url);
};

const _te_computeWcagPairs = (tokens) => {
  const pairs = [
    { label: "Text / BG",    fg: tokens["--foreground"], bg: tokens["--background"] },
    { label: "Accent / BG",  fg: tokens["--accent"],     bg: tokens["--background"] },
    { label: "Primary / BG", fg: tokens["--primary"],    bg: tokens["--background"] },
    { label: "Text / Card",  fg: tokens["--foreground"], bg: tokens["--card"] },
  ];
  return pairs.map(p => {
    try {
      const fgHex = _te_hslVarToHex(p.fg || "0 0% 10%");
      const bgHex = _te_hslVarToHex(p.bg || "0 0% 99%");
      const ratio = chroma.contrast(fgHex, bgHex);
      return { ...p, ratio: ratio.toFixed(1), badge: _te_getWcagBadge(ratio) };
    } catch {
      return { ...p, ratio: "?", badge: { cls: "fail", label: "ERR" } };
    }
  });
};

const _te_LS_KEY = "anti-ai-theme";

// ── Auto-clamp helpers (DR-01-color-tokens.md / deriveColorTokens algorithm) ──
//
// Filosofia: nunca produz token "feio". Ao invés de gerar accent=#ffffff e deixar
// passar com contraste 1.1:1, normalizamos lightness/chroma ate cada par AA real
// (4.5:1 texto). Se nao da pra alcancar AA, retorna best-effort + flag.
//
// Algoritmo per DR-01:
//   1. Accent: clamp L pra faixa usavel (0.35-0.70 light mode), preservando hue
//   2. Primary: mesma familia de hue (NAO +180°), darken ate contraste(primary,
//      primary-fg) >= 4.5
//   3. Decorative: hue +30° (analogo, padrão Material tonalSpot)
//   4. Ring: herda primary (pertence ao grupo acao)
//   5. Foregrounds: pick branco vs near-black por contraste real

const _te_pickFg = (bg) => {
  try {
    const cBg = chroma(bg);
    const candidates = ["#ffffff", "#0a0a0a"];
    let best = candidates[0], bestR = chroma.contrast(candidates[0], cBg);
    for (const c of candidates) {
      const r = chroma.contrast(c, cBg);
      if (r > bestR) { best = c; bestR = r; }
    }
    return { fg: best, ratio: bestR };
  } catch { return { fg: "#ffffff", ratio: 1 }; }
};

const _te_clampForContrast = (bgHex, fgHex, minRatio = 4.5, maxIter = 40) => {
  let cur = chroma(bgHex);
  for (let i = 0; i < maxIter; i++) {
    if (chroma.contrast(cur, fgHex) >= minRatio) return cur;
    const fgL = chroma(fgHex).get("hsl.l");
    cur = (isNaN(fgL) || fgL > 0.5) ? cur.darken(0.15) : cur.brighten(0.15);
  }
  return cur;
};

// Light-mode accent: cap L em 0.55 — acima disso surface (~0.95) viola
// WCAG 1.4.11 (3:1 UI graphic adjacent contrast). Floor 0.20 evita preto puro.
const _te_clampAccentLightness = (color) => {
  const l = color.get("hsl.l");
  if (isNaN(l)) return color.set("hsl.l", 0.45);
  if (l > 0.55) return color.set("hsl.l", 0.45);
  if (l < 0.20) return color.set("hsl.l", 0.30);
  return color;
};

// Le --background vivo do :root pra clampar accent contra surface real
const _te_getSurfaceHex = () => {
  try {
    const bgHsl = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
    return _te_hslVarToHex(bgHsl) || "#ffffff";
  } catch { return "#ffffff"; }
};

const _te_hslOf = (c) => {
  const [h, s, l] = c.hsl();
  return `${Math.round(isNaN(h) ? 0 : h)} ${Math.round((isNaN(s)?0:s)*100)}% ${Math.round((isNaN(l)?0:l)*100)}%`;
};

// ── Componente ────────────────────────────────────────────────────────────

const TokenEditorPreview = ({ compact = false }) => {
  const [mode, setMode] = React.useState("basic");
  const [accentHex, setAccentHex] = React.useState("#c0845a");
  const [derived, setDerived] = React.useState({});
  const [advTokens, setAdvTokens] = React.useState({});
  const [wcagPairs, setWcagPairs] = React.useState([]);

  React.useEffect(() => {
    const cur = _te_readCurrentTokens();
    const accentHslStr = cur["--accent"] || "20 50% 55%";
    try { setAccentHex(_te_hslVarToHex(accentHslStr)); } catch {}
    setAdvTokens(cur);
    setWcagPairs(_te_computeWcagPairs(cur));
    try {
      const saved = localStorage.getItem(_te_LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([k, v]) => _te_applyToken(k, v));
        const reread = _te_readCurrentTokens();
        setAdvTokens(reread);
        setWcagPairs(_te_computeWcagPairs(reread));
      }
    } catch {}
  }, []);

  const deriveFromAccent = (hex) => {
    try {
      const surface = _te_getSurfaceHex();

      // 1. Accent: clamp L pra faixa usavel; preserva hue + chroma da seed
      const seed = chroma(hex);
      let accent = _te_clampAccentLightness(seed);

      // 2. WCAG 1.4.11: accent precisa 3:1 vs surface (UI graphic adjacent)
      if (chroma.contrast(accent, surface) < 3) {
        accent = _te_clampForContrast(accent.hex(), surface, 3.0);
      }

      // 3. Accent-foreground: pick branco/near-black por contraste real
      const accentFg = _te_pickFg(accent.hex());
      // Se nem branco nem preto bate AA (4.5) na accent, escurece accent ate passar
      const accentFinal = accentFg.ratio >= 4.5
        ? accent
        : _te_clampForContrast(accent.hex(), accentFg.fg, 4.5);

      // 4. Primary: mesma familia hue (NAO +180°); darken ate AA vs fg branco
      //    Tambem precisa 3:1 vs surface
      const primaryFg = "#ffffff";
      let primary = accent.set("hsl.h", accent.get("hsl.h") || 0).darken(1.2);
      primary = _te_clampForContrast(primary.hex(), primaryFg, 4.5);
      if (chroma.contrast(primary, surface) < 3) {
        primary = _te_clampForContrast(primary.hex(), surface, 3.0);
      }

      // 5. Ring: herda primary (action group)
      const ring = primary;

      // 6. Decorative: hue +30° analogo (Material tonalSpot pattern), NAO +180°
      let decorative = accent.set("hsl.h", (accent.get("hsl.h") || 0) + 30).brighten(0.3);
      if (chroma.contrast(decorative, surface) < 3) {
        decorative = _te_clampForContrast(decorative.hex(), surface, 3.0);
      }

      const d = {
        "--accent":              _te_hslOf(accentFinal),
        "--accent-foreground":   _te_hexToHsl(accentFg.fg),
        "--primary":             _te_hslOf(primary),
        "--primary-foreground":  _te_hexToHsl(primaryFg),
        "--ring":                _te_hslOf(ring),
        "--accent-decorative":   _te_hslOf(decorative),
      };
      Object.entries(d).forEach(([k, v]) => _te_applyToken(k, v));
      const cur = _te_readCurrentTokens();
      setWcagPairs(_te_computeWcagPairs({ ...cur, ...d }));
      return d;
    } catch { return {}; }
  };

  const handleAccentChange = (hex) => {
    setAccentHex(hex);
    setDerived(deriveFromAccent(hex));
  };

  const handleAdvancedChange = (tokenName, hex) => {
    const hslVal = _te_hexToHsl(hex);
    _te_applyToken(tokenName, hslVal);
    setAdvTokens(prev => {
      const next = { ...prev, [tokenName]: hslVal };
      setWcagPairs(_te_computeWcagPairs(next));
      return next;
    });
  };

  const handleReset = () => {
    _te_resetAllTokens();
    const cur = _te_readCurrentTokens();
    setAccentHex(_te_hslVarToHex(cur["--accent"] || "20 50% 55%"));
    setAdvTokens(cur);
    setDerived({});
    setWcagPairs(_te_computeWcagPairs(cur));
    localStorage.removeItem(_te_LS_KEY);
  };

  const handleSave = () => {
    const cur = _te_readCurrentTokens();
    localStorage.setItem(_te_LS_KEY, JSON.stringify(cur));
  };

  const handleExport = () => { _te_exportCss(advTokens); };

  const derivedEntries = [
    { var: "--accent",            label: "Accent",     hex: derived["--accent"]            ? _te_hslVarToHex(derived["--accent"])            : accentHex },
    { var: "--primary",           label: "Primary",    hex: derived["--primary"]           ? _te_hslVarToHex(derived["--primary"])           : "#1a3a3a" },
    { var: "--ring",              label: "Ring/Foco",  hex: derived["--ring"]              ? _te_hslVarToHex(derived["--ring"])              : "#1a3a3a" },
    { var: "--accent-decorative", label: "Decorativo", hex: derived["--accent-decorative"] ? _te_hslVarToHex(derived["--accent-decorative"]) : "#c8966e" },
  ];

  return (
    <div className={`token-editor-wrap${compact ? " compact" : ""}`}>
      <div className="token-editor-header">
        <h3 className="token-editor-title">Token Editor</h3>
        <div className="token-editor-tabs">
          <button
            className={`token-editor-tab${mode === "basic" ? " active" : ""}`}
            onClick={() => setMode("basic")}
          >Básico</button>
          <button
            className={`token-editor-tab${mode === "advanced" ? " active" : ""}`}
            onClick={() => setMode("advanced")}
          >Avançado</button>
        </div>
      </div>

      <div className="token-editor-body">
        {mode === "basic" && (
          <div>
            <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", margin: "0 0 16px", lineHeight: 1.5 }}>
              Escolha um accent — o sistema deriva primary, ring e decorativo automaticamente.
            </p>
            <div className="editor-basic-row">
              <div className="editor-color-input-wrap">
                <input
                  type="color"
                  className="editor-color-input"
                  value={accentHex}
                  onChange={e => handleAccentChange(e.target.value)}
                />
                <input
                  type="text"
                  className="editor-color-hex"
                  value={accentHex}
                  onChange={e => {
                    if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                      setAccentHex(e.target.value);
                      if (e.target.value.length === 7) handleAccentChange(e.target.value);
                    }
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Accent principal</span>
            </div>
            <div className="editor-derived-grid">
              {derivedEntries.map(entry => (
                <div key={entry.var} className="editor-derived-item">
                  <div className="editor-derived-swatch" style={{ background: entry.hex }} />
                  <div className="editor-derived-info">
                    <div className="editor-derived-name">{entry.label}</div>
                    <div className="editor-derived-var">{entry.var}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "advanced" && (
          <div>
            <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", margin: "0 0 16px", lineHeight: 1.5 }}>
              Edite cada token individualmente. Preview ao vivo na página inteira.
            </p>
            {_te_ADVANCED_TOKENS.map(group => (
              <div key={group.group} style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "hsl(var(--muted-foreground))", marginBottom: 8 }}>{group.group}</div>
                <div className="editor-advanced-grid">
                  {group.tokens.map(tokenName => {
                    const hslStr = advTokens[tokenName] || "0 0% 50%";
                    const hex = _te_hslVarToHex(hslStr);
                    return (
                      <div key={tokenName} className="editor-advanced-item">
                        <div className="editor-advanced-swatch" style={{ background: hex }} />
                        <div className="editor-advanced-info">
                          <div className="editor-advanced-name">{tokenName.replace("--", "")}</div>
                          <div className="editor-advanced-var">{hslStr.substring(0, 16)}{hslStr.length > 16 ? "…" : ""}</div>
                        </div>
                        <input
                          type="color"
                          className="editor-advanced-input"
                          value={hex}
                          onChange={e => handleAdvancedChange(tokenName, e.target.value)}
                          title={tokenName}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="wcag-panel">
          <div className="wcag-panel-label">Contraste WCAG</div>
          {wcagPairs.map(p => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{p.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "hsl(var(--foreground))" }}>{p.ratio}:1</span>
              <span className={`wcag-badge ${p.badge.cls}`}>{p.badge.label}</span>
            </div>
          ))}
        </div>

        <div className="editor-actions">
          <button className="aa-btn aa-btn--outline aa-btn--sm" onClick={handleReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset
          </button>
          <button className="aa-btn aa-btn--outline aa-btn--sm" onClick={handleSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Salvar tema
          </button>
          <button className="aa-btn aa-btn--accent aa-btn--sm" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar CSS
          </button>
        </div>
      </div>
    </div>
  );
};
