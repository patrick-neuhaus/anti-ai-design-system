// ui_kits/default/components/dashboard/Chart.jsx
// Chart — inline SVG charts sem dependências externas.
// Variantes: LineChart, BarChart, SparklineChart, AreaChart
// Props comuns: data (number[] ou {x,y}[]), height, color, animated, showGrid, aria-label

/* ── Inject shared CSS once ─────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("chart-css")) {
  const s = document.createElement("style");
  s.id = "chart-css";
  s.textContent = `
    .chart-root {
      display: block;
      width: 100%;
      overflow: visible;
    }

    /* Draw-on animation via stroke-dashoffset */
    @keyframes chart-draw {
      from { stroke-dashoffset: var(--chart-path-len, 1000); }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes chart-bar-in {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @keyframes chart-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .chart-line-path {
      stroke-dasharray: var(--chart-path-len, 1000);
      stroke-dashoffset: 0;
    }
    .chart-line-path.animated {
      animation: chart-draw 900ms cubic-bezier(.4,0,.2,1) both;
    }
    .chart-area-path.animated {
      animation: chart-fade-in 600ms cubic-bezier(.4,0,.2,1) both;
      animation-delay: 100ms;
    }
    .chart-bar-rect {
      transform-origin: bottom;
    }
    .chart-bar-rect.animated {
      animation: chart-bar-in 500ms cubic-bezier(.2,.8,.2,1) both;
    }
    .chart-sparkline-path.animated {
      animation: chart-draw 700ms cubic-bezier(.4,0,.2,1) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .chart-line-path.animated,
      .chart-sparkline-path.animated { animation: chart-fade-in 300ms ease both; }
      .chart-bar-rect.animated { animation: chart-fade-in 300ms ease both; }
      .chart-area-path.animated { animation: none; opacity: 1; }
    }

    /* Dot on hover */
    .chart-dot {
      cursor: default;
      transition: r 150ms ease;
    }
    .chart-dot:hover { r: 5; }
  `;
  document.head.appendChild(s);
}

/* ── Helpers ────────────────────────────────────────────── */
const normalize = (data) =>
  data.map((d) => (typeof d === "object" ? d.y ?? d : d));

const calcPoints = (values, width, height, padX = 0, padY = 4) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = width - padX * 2;
  const h = height - padY * 2;
  return values.map((v, i) => ({
    x: padX + (i / (values.length - 1 || 1)) * w,
    y: padY + h - ((v - min) / range) * h,
  }));
};

const pointsToPath = (pts) =>
  pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

const pointsToSmooth = (pts) => {
  if (pts.length < 2) return pointsToPath(pts);
  let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur  = pts[i];
    const cpx  = (prev.x + cur.x) / 2;
    d += ` C${cpx.toFixed(2)},${prev.y.toFixed(2)} ${cpx.toFixed(2)},${cur.y.toFixed(2)} ${cur.x.toFixed(2)},${cur.y.toFixed(2)}`;
  }
  return d;
};

/* Rough path length estimate for dasharray animation */
const estimateLen = (pts) => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.ceil(len) || 1000;
};

const getCssColor = (token) => {
  if (!token) return "hsl(var(--accent))";
  if (token.startsWith("--")) return `hsl(var(${token}))`;
  return token;
};

/* ── Grid lines ─────────────────────────────────────────── */
const GridLines = ({ width, height, lines = 4, padX = 0, padY = 4 }) => {
  const steps = Array.from({ length: lines }, (_, i) => i / (lines - 1));
  return (
    <g aria-hidden="true">
      {steps.map((t, i) => {
        const y = padY + (height - padY * 2) * t;
        return (
          <line
            key={i}
            x1={padX}
            y1={y.toFixed(2)}
            x2={width - padX}
            y2={y.toFixed(2)}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        );
      })}
    </g>
  );
};

/* ── LineChart ──────────────────────────────────────────── */
const LineChart = ({
  data = [],
  height = 80,
  color = "--accent",
  animated = true,
  showGrid = false,
  smooth = true,
  "aria-label": ariaLabel,
}) => {
  const svgRef = React.useRef(null);
  const [width, setWidth] = React.useState(300);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || 300));
    ro.observe(el.parentElement || el);
    return () => ro.disconnect();
  }, []);

  const values = normalize(data);
  if (values.length < 2) return null;
  const pts = calcPoints(values, width, height);
  const pathD = smooth ? pointsToSmooth(pts) : pointsToPath(pts);
  const pathLen = estimateLen(pts);
  const stroke = getCssColor(color);

  return (
    <svg
      ref={svgRef}
      className="chart-root"
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      role="img"
      aria-label={ariaLabel || `Gráfico de linha com ${values.length} pontos`}
    >
      {showGrid && <GridLines width={width} height={height} />}
      <path
        className={`chart-line-path${animated ? " animated" : ""}`}
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ "--chart-path-len": pathLen }}
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          className="chart-dot"
          cx={p.x}
          cy={p.y}
          r="3"
          fill={stroke}
          aria-hidden="true"
        />
      ))}
    </svg>
  );
};

/* ── AreaChart ──────────────────────────────────────────── */
const AreaChart = ({
  data = [],
  height = 80,
  color = "--accent",
  animated = true,
  showGrid = true,
  smooth = true,
  "aria-label": ariaLabel,
}) => {
  const svgRef = React.useRef(null);
  const [width, setWidth] = React.useState(300);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || 300));
    ro.observe(el.parentElement || el);
    return () => ro.disconnect();
  }, []);

  const values = normalize(data);
  if (values.length < 2) return null;
  const padY = 4;
  const pts = calcPoints(values, width, height, 0, padY);
  const lineD = smooth ? pointsToSmooth(pts) : pointsToPath(pts);
  const areaD = `${lineD} L${pts[pts.length - 1].x.toFixed(2)},${(height - padY).toFixed(2)} L${pts[0].x.toFixed(2)},${(height - padY).toFixed(2)} Z`;
  const pathLen = estimateLen(pts);
  const stroke = getCssColor(color);
  const gradId = `area-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      ref={svgRef}
      className="chart-root"
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      role="img"
      aria-label={ariaLabel || `Gráfico de área com ${values.length} pontos`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {showGrid && <GridLines width={width} height={height} />}
      <path
        className={`chart-area-path${animated ? " animated" : ""}`}
        d={areaD}
        fill={`url(#${gradId})`}
      />
      <path
        className={`chart-line-path${animated ? " animated" : ""}`}
        d={lineD}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ "--chart-path-len": pathLen }}
      />
    </svg>
  );
};

/* ── BarChart ───────────────────────────────────────────── */
const BarChart = ({
  data = [],
  height = 80,
  color = "--accent",
  animated = true,
  showGrid = false,
  gap = 4,
  "aria-label": ariaLabel,
}) => {
  const svgRef = React.useRef(null);
  const [width, setWidth] = React.useState(300);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || 300));
    ro.observe(el.parentElement || el);
    return () => ro.disconnect();
  }, []);

  const values = normalize(data);
  if (!values.length) return null;
  const max = Math.max(...values) || 1;
  const barW = (width - gap * (values.length - 1)) / values.length;
  const stroke = getCssColor(color);

  return (
    <svg
      ref={svgRef}
      className="chart-root"
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      role="img"
      aria-label={ariaLabel || `Gráfico de barras com ${values.length} barras`}
    >
      {showGrid && <GridLines width={width} height={height} />}
      {values.map((v, i) => {
        const barH = (v / max) * height;
        const x = i * (barW + gap);
        const delay = animated ? `${i * 40}ms` : "0ms";
        return (
          <rect
            key={i}
            className={`chart-bar-rect${animated ? " animated" : ""}`}
            x={x.toFixed(2)}
            y={(height - barH).toFixed(2)}
            width={barW.toFixed(2)}
            height={barH.toFixed(2)}
            rx="3"
            ry="3"
            fill={stroke}
            opacity="0.85"
            style={{ animationDelay: delay }}
            aria-hidden="true"
          />
        );
      })}
    </svg>
  );
};

/* ── SparklineChart ─────────────────────────────────────── */
const SparklineChart = ({
  data = [],
  height = 32,
  color = "--accent",
  animated = true,
  "aria-label": ariaLabel,
}) => {
  const svgRef = React.useRef(null);
  const [width, setWidth] = React.useState(120);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width || 120));
    ro.observe(el.parentElement || el);
    return () => ro.disconnect();
  }, []);

  const values = normalize(data);
  if (values.length < 2) return null;
  const pts = calcPoints(values, width, height, 2, 2);
  const pathD = pointsToSmooth(pts);
  const pathLen = estimateLen(pts);
  const stroke = getCssColor(color);
  const last = pts[pts.length - 1];
  const first = values[0];
  const lastV = values[values.length - 1];
  const trend = lastV >= first ? "--success" : "--destructive";
  const trendColor = getCssColor(trend);

  return (
    <svg
      ref={svgRef}
      className="chart-root"
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      role="img"
      aria-label={ariaLabel || `Sparkline mostrando tendência de ${values.length} pontos`}
    >
      <path
        className={`chart-sparkline-path${animated ? " animated" : ""}`}
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ "--chart-path-len": pathLen }}
      />
      <circle cx={last.x} cy={last.y} r="3" fill={trendColor} aria-hidden="true" />
    </svg>
  );
};

/* ── Exports ────────────────────────────────────────────── */
window.LineChart      = LineChart;
window.AreaChart      = AreaChart;
window.BarChart       = BarChart;
window.SparklineChart = SparklineChart;
