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

// Badge agora respeita tipo do par: texto pede AAA 7:1; UI graphic pede 3:1.
const _te_getWcagBadge = (ratio, type = "text") => {
  if (type === "ui") {
    if (ratio >= 3) return { cls: "aaa", label: "OK" };
    return            { cls: "fail", label: "FAIL" };
  }
  if (ratio >= 7)   return { cls: "aaa",    label: "AAA" };
  if (ratio >= 4.5) return { cls: "aa",     label: "AA" };
  if (ratio >= 3)   return { cls: "aa-low", label: "AA-" };
  return               { cls: "fail",   label: "FAIL" };
};

const _te_ADVANCED_TOKENS = [
  { group: "Marca",       tokens: ["--primary","--accent","--ring"] },
  { group: "Status",      tokens: ["--success","--warning","--info","--destructive"] },
  { group: "Sidebar",     tokens: ["--sidebar-background","--sidebar-foreground","--sidebar-accent","--sidebar-accent-foreground","--sidebar-indicator","--sidebar-decorative","--sidebar-border"] },
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
  _te_ALL_TOKENS.concat([
    "--foreground","--primary-foreground","--accent-foreground","--muted-foreground"
  ]).forEach(t => {
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
  // Pares testam o que importa de fato:
  // - texto sobre superficies (AAA 7:1)
  // - texto sobre cores de marca (texto sobre accent/primary, AAA 7:1)
  // - accent como UI graphic vs surface (1.4.11, 3:1 minimo)
  const pairs = [
    { label: "Text / BG",       fg: tokens["--foreground"],         bg: tokens["--background"], type: "text" },
    { label: "Text / Card",     fg: tokens["--foreground"],         bg: tokens["--card"],       type: "text" },
    { label: "Text on Accent",  fg: tokens["--accent-foreground"],  bg: tokens["--accent"],     type: "text" },
    { label: "Text on Primary", fg: tokens["--primary-foreground"], bg: tokens["--primary"],    type: "text" },
    { label: "User-panel Text", fg: tokens["--sidebar-accent-foreground"], bg: tokens["--sidebar-accent"], type: "text" },
    { label: "Accent vs BG (UI)",     fg: tokens["--accent"],            bg: tokens["--background"], type: "ui" },
    { label: "Decorative vs BG (UI)", fg: tokens["--accent-decorative"], bg: tokens["--background"], type: "ui" },
  ];
  return pairs.map(p => {
    try {
      const fgHex = _te_hslVarToHex(p.fg || "0 0% 10%");
      const bgHex = _te_hslVarToHex(p.bg || "0 0% 99%");
      const ratio = chroma.contrast(fgHex, bgHex);
      return { ...p, ratio: ratio.toFixed(1), badge: _te_getWcagBadge(ratio, p.type) };
    } catch {
      return { ...p, ratio: "?", badge: { cls: "fail", label: "ERR" } };
    }
  });
};

const _te_LS_KEY = "anti-ai-theme";

// ── Surface themes (light/dark) — DR-01 + Material/Radix dark mode best practices ──
//   - Hue tintado (nao flat black/white)
//   - Surface tier (bg < card < muted): cards LIFT em dark, dim em light
//   - Foreground off-white em dark (eye strain), dark cocoa em light
//   - Border com contraste suficiente em ambos
const _te_SURFACE_THEMES = {
  light: {
    "--background":   "30 33% 96%",  // warm cream
    "--card":         "30 33% 99%",  // lifted
    "--muted":        "30 25% 90%",
    "--border":       "30 20% 85%",
    "--foreground":   "16 38% 12%",  // dark cocoa
    "--muted-foreground": "16 25% 38%",
  },
  dark: {
    "--background":   "16 38% 8%",   // deep cocoa
    "--card":         "16 35% 13%",  // lifted (mais leve, nao mais escuro)
    "--muted":        "16 28% 19%",
    "--border":       "16 22% 26%",
    "--foreground":   "30 33% 92%",  // off-white tintado
    "--muted-foreground": "30 20% 65%",
  },
};

const _te_applySurfaceTheme = (modeName) => {
  const theme = _te_SURFACE_THEMES[modeName];
  if (!theme) return;
  Object.entries(theme).forEach(([k, v]) => _te_applyToken(k, v));
};

// Auto: tenta os 2 modes, escolhe o com melhor Accent vs BG (UI 3:1)
const _te_pickAutoTheme = (accentHex) => {
  let best = "light", bestRatio = 0;
  for (const m of ["light", "dark"]) {
    const bgHex = _te_hslVarToHex(_te_SURFACE_THEMES[m]["--background"]);
    try {
      const r = chroma.contrast(accentHex, bgHex);
      if (r > bestRatio) { bestRatio = r; best = m; }
    } catch {}
  }
  return best;
};

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

// DR-01 §Edge cases — classifica seed pra avisar trade-off esperado.
// Nao bloqueia: so informa que algoritmo bateu limite fisico (ex: white seed
// nunca consegue 3:1 vs surface white). Escape hatch é override manual.
const _te_classifySeed = (hex) => {
  try {
    const c = chroma(hex);
    const l = c.get("hsl.l");
    const s = c.get("hsl.s");
    const h = c.get("hsl.h");
    if (l >= 0.92) return { type: "nearWhite",  msg: "Seed quase branca — Accent vs BG some em surface clara (limite físico). Use override pra forçar foreground." };
    if (l <= 0.08) return { type: "nearBlack",  msg: "Seed quase preta — colide com texto e bordas escuras. Override recomendado." };
    if ((isNaN(s) || s < 0.05) && l > 0.15 && l < 0.85) return { type: "neutral", msg: "Seed neutra (cinza) — sem chroma pra gerar decorativo. Resultado vira monocromático." };
    if (s > 0.85 && l > 0.55) return { type: "highChroma", msg: "Seed muito vívida + clara — passa AA texto, mas UI graphic 3:1 vs surface clara falha (esperado)." };
    if (!isNaN(h) && h >= 50 && h <= 75 && l > 0.6) return { type: "yellowLike", msg: "Amarelo claro — contraste fraco em light mode. Algoritmo escurece primary; accent pode parecer pálido." };
    return { type: "ok", msg: null };
  } catch { return { type: "ok", msg: null }; }
};

// ── Inline icons pro surface toggle ───────────────────────────────────────
const _te_IconSun = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const _te_IconMoon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const _te_IconAuto = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>
  </svg>
);

// ── Componente ────────────────────────────────────────────────────────────

const TokenEditorPreview = ({ compact = false }) => {
  const [mode, setMode] = React.useState("basic");
  const [accentHex, setAccentHex] = React.useState("#c0845a");
  const [derived, setDerived] = React.useState({});
  const [advTokens, setAdvTokens] = React.useState({});
  const [wcagPairs, setWcagPairs] = React.useState([]);
  const [themeMode, setThemeMode] = React.useState("light");  // light | dark | auto
  const [seedProfile, setSeedProfile] = React.useState({ type: "ok", msg: null });
  const [fgOverride, setFgOverride] = React.useState(null); // hex ou null

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

      // 1. Accent = input do user. ZERO clamp. Patrick passa verde claro =
      //    accent verde claro. Passa branco = branco. Passa preto = preto.
      //    Accent eh DECORATIVO/BRAND, nao precisa contraste vs surface
      //    (so o foreground sobre accent precisa AAA — esse derivamos).
      const accent = chroma(hex);
      const accentFinal = accent;

      // 2. Accent-foreground: pickFg auto (white OU black baseado em luminance).
      //    Wave 8 fix: forçar white quebrava em accent muito claro (ex: #00ff2a → 1.4:1 FAIL).
      //    Agora: pickFg automaticamente escolhe melhor contraste. Tudo ligado.
      //    Override manual (DR-01 §Critérios "escape hatch") substitui pick automatico.
      const accentFg = fgOverride
        ? { fg: fgOverride, ratio: chroma.contrast(fgOverride, accent.hex()) }
        : _te_pickFg(accent.hex());

      // 3. Primary: deriva direcao da seed pelo surface mode.
      //    - Light surface: primary DARK (text-fg branco AAA)
      //    - Dark surface:  primary LIGHT (text-fg near-black AAA)
      //    Material approach: primary "lifts" em dark mode pra manter contraste vs surface.
      const accentH = accent.get("hsl.h");
      const baseHue = isNaN(accentH) ? 0 : accentH;
      const surfaceL = chroma(surface).get("hsl.l");
      const isSurfaceDark = surfaceL < 0.5;
      // Start L: 0.30 pra light surface, 0.70 pra dark surface
      let primary = chroma.hsl(baseHue, 0.55, isSurfaceDark ? 0.70 : 0.30);
      // pickFg escolhe melhor foreground (branco em primary dark, preto em primary light)
      const primaryFgPick = _te_pickFg(primary.hex());
      const primaryFg = primaryFgPick.fg;
      primary = _te_clampForContrast(primary.hex(), primaryFg, 7.0);
      // primary precisa ser visivel vs surface tambem
      if (chroma.contrast(primary, surface) < 4.5) {
        primary = _te_clampForContrast(primary.hex(), surface, 4.5);
        // re-pick fg se primary mudou bastante
        const repick = _te_pickFg(primary.hex());
        if (repick.ratio > chroma.contrast(primaryFg, primary)) {
          // foreground melhor existe — substitui
        }
      }

      // 4. Ring: herda primary (action group)
      const ring = primary;

      // 5. Decorative: hue +30° analogo (Material tonalSpot). DR-01 sec 152:
      //    UI graphic ≥3:1 vs adjacent. Wave 9 fix: clamp lightness pra garantir
      //    contraste vs surface (era falhando em accent vivido tipo #d32f2f).
      let decorative = chroma.hsl(
        (baseHue + 30) % 360,
        Math.max(0.4, accent.get("hsl.s") || 0.5),
        Math.min(0.7, Math.max(0.4, accent.get("hsl.l") || 0.55))
      );
      // Garante 3:1 vs surface — adjust lightness ate passar (max 40 iter).
      decorative = _te_clampForContrast(decorative.hex(), surface, 3.0);

      // 7. Sidebar harmonizado com primary (era fixo = pagina nao mudava inteira):
      //    - sidebar-background = primary darkened (painel dark coerente)
      //    - sidebar-accent     = primary lighter (hover state na sidebar dark)
      //    - sidebar-indicator  = accent (linha esquerda do item ativo)
      //    - sidebar-border     = primary darker
      let sidebarBg = chroma(primary).darken(0.6);
      // Garante L baixo (sidebar = painel escuro). Se primary ja escuro demais, mantem.
      if (sidebarBg.get("hsl.l") > 0.25) sidebarBg = sidebarBg.set("hsl.l", 0.20);
      const sidebarAccent = chroma(primary).set("hsl.l", Math.max(0.25, primary.get("hsl.l") + 0.07));
      const sidebarBorder = chroma(primary).set("hsl.l", Math.max(0.18, primary.get("hsl.l") - 0.04));
      // Wave 8 fix: sidebar-foreground auto-pick (white OU black) via pickFg(sidebarBg).
      // Antes default white sempre — quebrava se sidebar-bg ficasse claro.
      const sidebarFg = _te_pickFg(sidebarBg.hex());
      // Wave 9 fix (step 1+2): sidebar-accent-foreground derivado via pickFg(sidebar-accent).
      // user-panel text precisa contraste vs --sidebar-accent (bg do card),
      // não vs --sidebar-background. DR-01 sec 82-90 — par real.
      const sidebarAccentFg = _te_pickFg(sidebarAccent.hex());

      const d = {
        "--accent":                    _te_hslOf(accentFinal),
        "--accent-foreground":         _te_hexToHsl(accentFg.fg),
        "--primary":                   _te_hslOf(primary),
        "--primary-foreground":        _te_hexToHsl(primaryFg),
        "--ring":                      _te_hslOf(ring),
        "--accent-decorative":         _te_hslOf(decorative),
        "--sidebar-decorative":        _te_hslOf(decorative),
        "--sidebar-background":        _te_hslOf(sidebarBg),
        "--sidebar-foreground":        _te_hexToHsl(sidebarFg.fg),
        "--sidebar-accent":            _te_hslOf(sidebarAccent),
        "--sidebar-accent-foreground": _te_hexToHsl(sidebarAccentFg.fg),
        "--sidebar-indicator":         _te_hslOf(accentFinal),
        "--sidebar-border":            _te_hslOf(sidebarBorder),
      };
      Object.entries(d).forEach(([k, v]) => _te_applyToken(k, v));
      const cur = _te_readCurrentTokens();
      setWcagPairs(_te_computeWcagPairs({ ...cur, ...d }));
      return d;
    } catch { return {}; }
  };

  const handleAccentChange = (hex) => {
    setAccentHex(hex);
    setSeedProfile(_te_classifySeed(hex));
    // Se mode auto, recalcula surface theme com base no novo accent
    if (themeMode === "auto") {
      const picked = _te_pickAutoTheme(hex);
      _te_applySurfaceTheme(picked);
    }
    setDerived(deriveFromAccent(hex));
    // Recompute WCAG depois de re-deriving (que mudou foregrounds)
    setAdvTokens(_te_readCurrentTokens());
  };

  const handleFgOverride = (hex) => {
    setFgOverride(hex);
    // re-deriva pra propagar fg novo
    setDerived(deriveFromAccent(accentHex));
    setAdvTokens(_te_readCurrentTokens());
  };

  const handleClearOverride = () => {
    setFgOverride(null);
    setDerived(deriveFromAccent(accentHex));
    setAdvTokens(_te_readCurrentTokens());
  };

  const handleThemeModeChange = (newMode) => {
    setThemeMode(newMode);
    const surfaceMode = newMode === "auto" ? _te_pickAutoTheme(accentHex) : newMode;
    _te_applySurfaceTheme(surfaceMode);
    // Re-deriva accent: surface mudou, primary/ring/sidebar precisam recalibrar
    //  vs nova surface
    setDerived(deriveFromAccent(accentHex));
    setAdvTokens(_te_readCurrentTokens());
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
    setThemeMode("light");
    setFgOverride(null);
    setSeedProfile({ type: "ok", msg: null });
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
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                      setAccentHex(v);
                      if (v.length === 7) handleAccentChange(v);
                      else if (v.length === 4) {
                        // expande #abc → #aabbcc
                        const expanded = "#" + v[1]+v[1] + v[2]+v[2] + v[3]+v[3];
                        handleAccentChange(expanded);
                      }
                    }
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>Accent principal</span>
              <span className="editor-row-separator" aria-hidden="true">·</span>
              <span className="theme-mode-label">Surface</span>
              <ToggleGroup
                size="sm"
                value={themeMode}
                onChange={(v) => v && handleThemeModeChange(v)}
                aria-label="Surface mode"
                items={[
                  { value: "light", label: "Light", icon: _te_IconSun  },
                  { value: "dark",  label: "Dark",  icon: _te_IconMoon },
                  { value: "auto",  label: "Auto",  icon: _te_IconAuto },
                ]}
              />
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

        {seedProfile.msg && (
          <div className="seed-warning" role="status" style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            padding: "10px 12px", marginTop: 12, marginBottom: 12,
            background: "hsl(var(--warning) / 0.10)",
            border: "1px solid hsl(var(--warning) / 0.35)",
            borderRadius: 8, fontSize: 12, lineHeight: 1.45
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1, color: "hsl(var(--warning))" }} aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <strong style={{ display: "block", marginBottom: 2 }}>Seed extrema: {seedProfile.type}</strong>
              <span style={{ color: "hsl(var(--muted-foreground))" }}>{seedProfile.msg}</span>
            </div>
          </div>
        )}

        <div className="fg-override-row" style={{
          display: "flex", gap: 10, alignItems: "center",
          padding: "8px 12px", marginTop: 12,
          background: "hsl(var(--muted) / 0.4)",
          borderRadius: 8, fontSize: 12
        }}>
          <span style={{ color: "hsl(var(--muted-foreground))", fontWeight: 500 }}>Accent foreground:</span>
          <input
            type="color"
            value={fgOverride || (advTokens["--accent-foreground"] ? _te_hslVarToHex(advTokens["--accent-foreground"]) : "#ffffff")}
            onChange={e => handleFgOverride(e.target.value)}
            style={{ width: 28, height: 22, border: "1px solid hsl(var(--border))", borderRadius: 4, cursor: "pointer", padding: 0 }}
            title="Auto = pickFg algoritmo. Editar = override manual."
          />
          {fgOverride && (
            <>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{fgOverride}</code>
              <button onClick={handleClearOverride} className="aa-btn aa-btn--ghost aa-btn--sm" style={{ marginLeft: "auto", padding: "2px 8px", fontSize: 11 }}>Auto</button>
            </>
          )}
          {!fgOverride && (
            <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11, marginLeft: "auto" }}>auto (pickFg)</span>
          )}
        </div>

        <div className="wcag-panel">
          <div className="wcag-panel-label">Contraste WCAG</div>
          {wcagPairs.map(p => (
            <div key={p.label} className="wcag-pair-row">
              <span className="wcag-pair-label">{p.label}</span>
              <span className="wcag-pair-ratio">{p.ratio}:1</span>
              <span className={`wcag-badge ${p.badge.cls}`}>{p.badge.label}</span>
            </div>
          ))}
          {wcagPairs.some(p => p.type === "ui" && p.badge.cls === "fail") && (
            <p className="wcag-note">
              <strong>UI graphic FAIL ≠ bug.</strong> Accent vivo (luminance alta) some como UI vs surface — esperado. Borders e focus rings usam <code>--ring</code> (= primary, AAA garantido), continuam visiveis. Trade-off fisico: quanto mais vivo o accent, menos serve como UI graphic 3:1.
            </p>
          )}
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
