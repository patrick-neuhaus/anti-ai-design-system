// ui_kits/default/components/showcase/FooterShowcase.jsx
// Footer editorial do showcase — dark bg + terracotta accent stripe.
// Kinetic letter-by-letter reveal via IntersectionObserver.
// Reduced-motion: letras aparecem direto (sem animacao).
// Props opcionais: version, updatedAt, links (recursos/repo).
// Dependencias: React global, _footer.css carregado no head.

const FooterShowcase = ({
  version    = "v6.5",
  updatedAt  = "2026-05-02",
  resources  = [
    { label: "Showcase tecnico", href: "./base.html" },
    { label: "Templates demo",   href: "../index.html" },
    { label: "Tokens",           href: "#tokens" },
    { label: "Como usar",        href: "#como-usar" },
  ],
  repo = [
    { label: "GitHub",      href: "https://github.com/patrick-neuhaus/anti-ai-design-system", external: true },
    { label: "License MIT", href: "https://github.com/patrick-neuhaus/anti-ai-design-system/blob/main/LICENSE", external: true },
    { label: "Issues",      href: "https://github.com/patrick-neuhaus/anti-ai-design-system/issues", external: true },
  ],
}) => {
  const nameRef = React.useRef(null);
  const prefersReduced = React.useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  []);

  // Kinetic: adiciona classe quando footer entra no viewport
  React.useEffect(() => {
    const el = nameRef.current;
    if (!el || prefersReduced) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("kinetic-visible");
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced]);

  // Divide o nome DS em letras para animacao individual
  const dsName = "Anti-AI Design System";
  const letters = dsName.split("").map((char, i) => (
    <span
      key={i}
      className="kinetic-letter"
      aria-hidden="true"
      style={prefersReduced ? {} : { transitionDelay: `${i * 28}ms` }}
    >
      {char === " " ? " " : char}
    </span>
  ));

  // SVG constelacao decorativa (pontos + linhas sutis)
  const ConstellationBg = () => (
    <svg
      className="footer-constellation-bg"
      viewBox="0 0 1100 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g opacity="0.06" stroke="hsl(var(--background))" strokeWidth="0.5" fill="hsl(var(--background))">
        {/* Pontos */}
        {[
          [80,40],[200,90],[340,30],[420,120],[560,60],[700,100],[820,45],[950,80],[1040,30],
          [150,180],[300,200],[480,170],[640,210],[780,185],[920,160],[1060,200],
          [50,240],[240,260],[390,230],[530,250],[670,240],[810,265],[990,235],
        ].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" />
        ))}
        {/* Linhas de conexao */}
        <line x1="80"  y1="40"  x2="200" y2="90" />
        <line x1="200" y1="90"  x2="340" y2="30" />
        <line x1="340" y1="30"  x2="420" y2="120"/>
        <line x1="420" y1="120" x2="560" y2="60" />
        <line x1="560" y1="60"  x2="700" y2="100"/>
        <line x1="700" y1="100" x2="820" y2="45" />
        <line x1="820" y1="45"  x2="950" y2="80" />
        <line x1="200" y1="90"  x2="150" y2="180"/>
        <line x1="420" y1="120" x2="480" y2="170"/>
        <line x1="700" y1="100" x2="640" y2="210"/>
        <line x1="150" y1="180" x2="300" y2="200"/>
        <line x1="300" y1="200" x2="480" y2="170"/>
        <line x1="480" y1="170" x2="640" y2="210"/>
        <line x1="640" y1="210" x2="780" y2="185"/>
        <line x1="780" y1="185" x2="920" y2="160"/>
      </g>
    </svg>
  );

  const year = new Date().getFullYear();

  return (
    <footer className="footer-editorial" role="contentinfo">
      <ConstellationBg />

      <div className="footer-ed-inner">
        <div className="footer-ed-grid">

          {/* Col 1 — Assinatura */}
          <div className="footer-ed-brand">
            <h2
              className="footer-ed-ds-name"
              ref={nameRef}
              aria-label={dsName}
            >
              {letters}
            </h2>
            <p className="footer-ed-tagline">
              Design system artesanal — tokens declarativos, componentes sem cara de IA, identidade visual que nao parece gerada.
            </p>
            <p className="footer-ed-by">by Patrick Neuhaus</p>
          </div>

          {/* Col 2 — Recursos */}
          <nav className="footer-ed-col" aria-label="Recursos do design system">
            <h4>Recursos</h4>
            <ul>
              {resources.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Repositorio */}
          <nav className="footer-ed-col" aria-label="Repositorio">
            <h4>Repositorio</h4>
            <ul>
              {repo.map(({ label, href, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={external ? `${label} (abre em nova aba)` : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4 — Status */}
          <div className="footer-ed-col">
            <h4>Status</h4>
            <div className="footer-ed-status-row">
              <div className="footer-ed-status-item">
                <span className="footer-ed-status-label">Versao</span>
                <span className="footer-ed-status-value">
                  <span className="footer-ed-dot" aria-hidden="true" />
                  {version} · stable
                </span>
              </div>
              <div className="footer-ed-status-item">
                <span className="footer-ed-status-label">Ultimo update</span>
                <span className="footer-ed-status-value">{updatedAt}</span>
              </div>
              <div className="footer-ed-status-item">
                <span className="footer-ed-status-label">Build</span>
                <span className="footer-ed-status-value ok">checkmark stable</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-ed-bottom">
          <span className="footer-ed-copyright">
            &copy; {year} Artemis Studio &middot; MIT License
          </span>
          <div className="footer-ed-bottom-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a
              href="https://github.com/patrick-neuhaus/anti-ai-design-system"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (abre em nova aba)"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

window.FooterShowcase = FooterShowcase;
