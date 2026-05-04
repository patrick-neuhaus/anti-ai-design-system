// ui_kits/default/components/base/Button.jsx
// Button — thin wrapper sobre aa-btn (canonical CSS in _aa-btn.css).
// Source of truth visual: _aa-btn.css. Componente apenas mapeia props -> classes.
// When to use: any user-actionable click target with a verb.
// When NOT to use: navigation between routes (use NavLink). Pure toggles (use Switch/Checkbox).

/* Whitelist HTML attrs we forward — avoids Babel _objectWithoutProperties
   leaking custom props (variant/size/fullWidth) into the DOM <button>. */
const _BUTTON_DOM_ATTRS = [
  "id", "name", "title", "form", "formAction", "formMethod", "formNoValidate",
  "formTarget", "tabIndex", "autoFocus", "style",
];

const Button = (props) => {
  const {
    children,
    variant = "primary",
    size = "md",
    iconLeft: IL,
    iconRight: IR,
    iconOnly = false,
    disabled = false,
    loading = false,
    type = "button",
    onClick,
    fullWidth = false,
    className: extraClassName,
    "aria-label": ariaLabel,
    "aria-busy": ariaBusy,
  } = props;

  const isDisabled = disabled || loading;
  /* aria-label required for icon-only buttons — F-RP-013 */
  const a11yLabel = ariaLabel || (iconOnly && typeof children === "string" ? children : undefined);

  const classes = [
    "aa-btn",
    `aa-btn--${variant}`,
    `aa-btn--${size}`,
    iconOnly && "aa-btn--icon",
    fullWidth && !iconOnly && "aa-btn--full",
    extraClassName,
  ].filter(Boolean).join(" ");

  const iconSize = size === "sm" ? 14 : 16;

  /* Forward only known HTML attrs + on* event handlers + data-/aria- attrs */
  const forwarded = {};
  for (const k in props) {
    if (_BUTTON_DOM_ATTRS.includes(k)) forwarded[k] = props[k];
    else if (k.startsWith("on") && k !== "onClick") forwarded[k] = props[k];
    else if (k.startsWith("data-") || k.startsWith("aria-")) forwarded[k] = props[k];
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={a11yLabel}
      aria-busy={ariaBusy ?? (loading || undefined)}
      data-loading={loading || undefined}
      className={classes}
      {...forwarded}
    >
      {loading && <span className="aa-btn__spinner" aria-hidden="true" />}
      {!loading && IL && <IL size={iconSize} />}
      {!iconOnly && children}
      {!loading && IR && <IR size={iconSize} />}
    </button>
  );
};

window.Button = Button;
