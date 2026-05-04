// ui_kits/default/components/surfaces/Card.jsx
// Card — thin wrapper sobre aa-card (canonical CSS in _aa-card.css).
// Source of truth visual: _aa-card.css. Componente apenas mapeia props -> classes.
// When to use: any grouped content block (stat tile, form section, list panel).
// When NOT to use: full-page chrome (use Section + AppLayout). Floating ephemeral content (Popover/Toast).

const Card = ({
  children,
  padding,
  as: As = "div",
  className: extraClassName,
  style,
  onClick,
  ...rest
}) => {
  /* F-CA-003: interactive Card must be keyboard-focusable + receive focus ring */
  const isInteractive = Boolean(onClick);

  const classes = [
    "aa-card",
    isInteractive && "aa-card--interactive",
    padding === 0 && "aa-card--flush",
    extraClassName,
  ].filter(Boolean).join(" ");

  /* padding prop fica como style override quando explicito (numero != 0) */
  const styleOverride = (typeof padding === "number" && padding !== 0)
    ? { padding, ...style }
    : style;

  return (
    <As
      className={classes}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive && As === "div" ? "button" : undefined}
      onKeyDown={isInteractive ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      style={styleOverride}
      {...rest}
    >
      {children}
    </As>
  );
};

const CardHeader = ({ title, subtitle, actions }) => (
  <div className="aa-card-header">
    <div className="aa-card-header__main">
      {title && <h3>{title}</h3>}
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className="aa-card-header__actions">{actions}</div>}
  </div>
);

window.Card = Card;
window.CardHeader = CardHeader;
