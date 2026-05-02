// ui_kits/default/components/showcase/FooterShowcase.jsx
// FooterShowcase — footer editorial reusable pra páginas técnicas do Anti-AI DS.
// Direção: kinetic typography, assimétrico, terracotta accents, dark bg.
// CSS externo: _footer.css (deve ser linkado na página host).
// Replicável: qualquer showcase page inclui este componente via script tag.

/* ── Constellation decorativa ───────────────────────────── */
const CONSTELLATION_DOTS = [
  { cx: "8%",  cy: "28%" },
  { cx: "20%", cy: "70%" },
  { cx: "42%", cy: "18%" },
  { cx: "66%", cy: "60%" },
  { cx: "85%", cy: "32%" },
  { cx: "55%", cy: "85%" },
];
const CONSTELLATION_LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [3, 5],
];

const ConstellationBg = () => {
  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <svg
      className="footer-constellation"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {CONSTELLATION_LINES.map(([a, b], i) => {
        const da = CONSTELLATION_DOTS[a];
        const db = CONSTELLATION_DOTS[b];
        return (
          <line
            key={i}
            x1={da.cx} y1={da.cy}
            x2={db.cx} y2={db.cy}
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="0.25"
            style={prefersReduced ? {} : {
              strokeDasharray: 40,
              strokeDashoffset: 40,
              animation: `constellation-draw 2.5s ${i * 0.25}s ease forwards`,
            }}
          />
        );
      })}
      {CONSTELLATION_DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r="0.6"
          fill="white"
          fillOpacity="0.15"
          style={prefersReduced ? {} : {
            animation: `constellation-pop 0.4s ${i * 0.2}s ease both`,
          }}
        />
      ))}
    </svg>
  );
};

/* ── Kinetic title: letra por letra ─────────────────────── */
const KineticTitle = ({ text }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("in");
        io.unobserve(el);
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Split into words, then letters — each letter gets a stagger delay
  let letterIndex = 0;
  const words = text.split(" ").map((word, wi) => {
    const letters = word.split("").map((ch) => {
      const delay = `${letterIndex * 28}ms`;
      letterIndex++;
      return (
        <span
          key={`${wi}-${ch}-${letterIndex}`}
          className="footer-letter"
          aria-hidden="true"
          style={{ animationDelay: delay }}
        >
          {ch}
        </span>
      );
    });
    return (
      <span key={wi} className="word" style={{ display: "inline-block", marginRight: "0.25em" }}>
        {letters}
      </span>
    );
  });

  return (
    <h2
      ref={ref}
      className="footer-editorial footer-kinetic-title"
      aria-label={text}
      style={{ background: "none", color: "inherit", padding: 0, margin: 0, overflow: "visible" }}
    >
      {words}
    </h2>
  );
};

/* ── Main FooterShowcase component ──────────────────────── */
const FooterShowcase = ({
  version = "v1.0",
  lastUpdate = "2026",
  githubUrl = "https://github.com/patrick-neuhaus/anti-ai-design-system",
}) => {
  const footerRef = React.useRef(null);

  return (
    <footer className="footer-editorial" ref={footerRef} aria-label="Rodapé do site">
      <ConstellationBg />

      {/* Wave decorativo no topo */}
      <svg className="footer-wave-svg" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 20 Q300 0 600 20 T1200 20 V40 H0Z" fill="white" />
      </svg>

      {/* Upper: título editorial + nav assimétrico */}
      <div className="footer-upper">
        <div className="footer-upper-left">
          <div>
            <div
              className="footer-kinetic-title"
              style={{ display: "block", position: "relative" }}
              aria-label="Anti-AI Design System"
            >
              <KineticTitle text="Anti-AI" />
              <br />
              <KineticTitle text="Design System" />
            </div>
          </div>

          <p className="footer-tagline">
            Componentes com personalidade. Neutrals hue-aware, tipografia editorial,
            motion proposital. O oposto do output genérico de IA.
          </p>

          <div className="footer-signature">
            <span className="footer-sig-label">by</span>
            <span className="footer-sig-divider" aria-hidden="true" />
            <span className="footer-sig-name">Patrick Neuhaus</span>
            <span className="footer-sig-divider" aria-hidden="true" />
            <span className="footer-sig-label">{lastUpdate}</span>
          </div>
        </div>

        <nav aria-label="Links do footer">
          <div className="footer-nav-cols">
            <div className="footer-nav-col">
              <h4>Recursos</h4>
              <ul>
                <li><a href="./base.html">Components</a></li>
                <li><a href="./display.html">Display</a></li>
                <li><a href="./dashboard.html">Dashboard</a></li>
                <li><a href="#como-usar">Como usar</a></li>
              </ul>
            </div>
            <div className="footer-nav-col">
              <h4>Repositório</h4>
              <ul>
                <li><a href={githubUrl} target="_blank" rel="noopener">GitHub</a></li>
                <li><a href={`${githubUrl}/blob/main/LICENSE`} target="_blank" rel="noopener">MIT License</a></li>
                <li><a href={`${githubUrl}/issues`} target="_blank" rel="noopener">Issues</a></li>
              </ul>
              <div className="footer-status-row" style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Status</h4>
                <div className="footer-status-item">
                  <span className="footer-status-dot" />
                  <span>{version} · estável</span>
                </div>
                <div className="footer-status-item">
                  <span className="footer-status-dot" style={{ background: "hsl(var(--info))", boxShadow: "none" }} />
                  <span>56+ componentes</span>
                </div>
                <div className="footer-status-item">
                  <span className="footer-status-dot" style={{ background: "hsl(var(--accent))", boxShadow: "none" }} />
                  <span>Atualizado {lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Accent stripe terracotta */}
      <div className="footer-accent-stripe" aria-hidden="true">
        <div className="footer-accent-line" />
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-bottom-brand">
          Anti-AI Design System · Patrick Neuhaus · {lastUpdate}
        </span>
        <nav className="footer-bottom-links" aria-label="Links legais">
          <a href={githubUrl} target="_blank" rel="noopener">GitHub</a>
          <a href={`${githubUrl}/blob/main/LICENSE`} target="_blank" rel="noopener">MIT</a>
          <a href="./index.html">Visão geral</a>
        </nav>
      </div>
    </footer>
  );
};

window.FooterShowcase = FooterShowcase;
