// ui_kits/default/components/layout/NavHeader.jsx
// Floating glass nav header — shared across all showcase pages.
// Wave 6.1: DRY extraction from 11 HTML files.
//
// Props:
//   currentCategory (string | null) — slug of active category for dropdown highlight (e.g. "base", "auth")
//   mode ("home" | "category")      — home: brand is non-link span; category: brand links back to ./index.html
//
// Usage (home):     <NavHeader mode="home" />
// Usage (category): <NavHeader currentCategory="base" mode="category" />
//
// Requires: _nav.css loaded in the HTML <head>
// Requires: dropdown JS init script (see bottom of each showcase HTML)

const CATEGORIES = [
  { slug: "index",      label: "Visão geral" },
  { slug: "auth",       label: "Auth" },
  { slug: "base",       label: "Base" },
  { slug: "dashboard",  label: "Dashboard" },
  { slug: "data",       label: "Data" },
  { slug: "display",    label: "Display" },
  { slug: "forms",      label: "Forms" },
  { slug: "layout",     label: "Layout" },
  { slug: "navigation", label: "Navigation" },
  { slug: "screens",    label: "Screens" },
  { slug: "surfaces",   label: "Surfaces" },
];

const NavHeader = ({ currentCategory = null, mode = "category" }) => {
  const isHome = mode === "home";

  // Init dropdown after mount — querySelector only works once DOM is ready
  React.useEffect(() => {
    const dd  = document.querySelector(".fh-dropdown");
    const btn = document.querySelector(".fh-dropdown-btn");
    const menu = document.querySelector(".fh-dropdown-menu");
    if (!dd || !btn || !menu) return;

    const openDD  = () => { dd.setAttribute("data-open", "true");  btn.setAttribute("aria-expanded", "true"); };
    const closeDD = () => { dd.removeAttribute("data-open");        btn.setAttribute("aria-expanded", "false"); };

    const onBtnClick = (e) => { e.stopPropagation(); dd.hasAttribute("data-open") ? closeDD() : openDD(); };
    const onDocClick = (e) => { if (!dd.contains(e.target)) closeDD(); };
    const onDocKey   = (e) => { if (e.key === "Escape") { closeDD(); btn.focus(); } };
    const onMenuKey  = (e) => {
      const items = Array.from(menu.querySelectorAll("a"));
      const idx   = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); const next = items[(idx + 1) % items.length]; if (next) next.focus(); }
      if (e.key === "ArrowUp")   { e.preventDefault(); const prev = items[(idx - 1 + items.length) % items.length]; if (prev) prev.focus(); }
      if (e.key === "Escape")    { closeDD(); btn.focus(); }
      if (e.key === "Tab" && !e.shiftKey && idx === items.length - 1) closeDD();
    };

    btn.addEventListener("click", onBtnClick);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onDocKey);
    menu.addEventListener("keydown", onMenuKey);

    return () => {
      btn.removeEventListener("click", onBtnClick);
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onDocKey);
      menu.removeEventListener("keydown", onMenuKey);
    };
  }, []);

  // href for "Ver exemplos" CTA — always goes to showcase index
  const ctaHref = isHome ? "#templates" : "./index.html";

  // Nav links — home uses anchor hash, categories use relative paths
  const navLinks = isHome
    ? [
        { href: "#templates", label: "Templates" },
        { href: "#filosofia", label: "Filosofia" },
        { href: "#tokens",    label: "Tokens" },
        { href: "#como-usar", label: "Como Usar" },
      ]
    : [
        { href: "./index.html#templates", label: "Templates" },
        { href: "./index.html#filosofia", label: "Filosofia" },
        { href: "./index.html#tokens",    label: "Tokens" },
        { href: "./index.html#como-usar", label: "Como Usar" },
      ];

  const Brand = () =>
    isHome ? (
      <span className="nav-brand">
        <span className="nav-brand-dot"></span>Anti-AI
      </span>
    ) : (
      <a className="nav-brand" href="./index.html">
        <span className="nav-brand-dot"></span>Anti-AI
      </a>
    );

  return (
    <nav className="nav-header" aria-label="Navegação principal">
      <Brand />
      <div className="nav-links">
        {navLinks.slice(0, -1).map(({ href, label }) => (
          <a key={label} className="nav-link" href={href}>{label}</a>
        ))}
        <div className="fh-dropdown">
          <button
            className="fh-dropdown-btn"
            aria-expanded="false"
            aria-haspopup="true"
          >
            Categorias <span className="fh-arrow">&#9662;</span>
          </button>
          <div className="fh-dropdown-menu">
            {CATEGORIES.map(({ slug, label }) => {
              const href = isHome ? `./${slug === "index" ? "" : slug + ".html"}` : `./${slug === "index" ? "index.html" : slug + ".html"}`;
              const isActive = slug === currentCategory || (slug === "index" && currentCategory === null && !isHome);
              return (
                <a
                  key={slug}
                  href={href}
                  className={isActive ? "fh-active" : ""}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
        {navLinks.slice(-1).map(({ href, label }) => (
          <a key={label} className="nav-link" href={href}>{label}</a>
        ))}
      </div>
      <a className="nav-cta-mini" href={ctaHref}>
        <span className="nav-cta-text">Ver exemplos</span>
        <span className="nav-cta-icon">&#8594;</span>
      </a>
    </nav>
  );
};

window.NavHeader = NavHeader;
