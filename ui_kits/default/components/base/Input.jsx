// ui_kits/default/components/base/Input.jsx
// Input — thin wrapper sobre aa-input (canonical CSS in _aa-input.css).
// Source of truth visual: _aa-input.css. Componente apenas mapeia props -> classes.
// When to use: any single-line text capture inside a form.
// When NOT to use: multi-line (use Textarea). Pre-defined value sets (use Select/Radio/Checkbox).

const Input = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  type = "text",
  size = "md",
  disabled = false,
  invalid = false,
  readOnly,
  iconLeft: IL,
  iconRight: IR,
  className: extraClassName,
  ...rest
}) => {
  // Controlled vs uncontrolled bindings.
  // If onChange present → controlled (value required).
  // If value without onChange → uncontrolled with defaultValue + readOnly fallback.
  // If only defaultValue → uncontrolled.
  const valueBindings = onChange
    ? { value: value ?? "", onChange }
    : value !== undefined
      ? { defaultValue: value, readOnly: readOnly ?? true }
      : defaultValue !== undefined
        ? { defaultValue, readOnly }
        : { readOnly };

  const inputClasses = [
    "aa-input",
    `aa-input--${size}`,
    IL && "aa-input--icon-left",
    IR && "aa-input--icon-right",
    invalid && "is-invalid",
    extraClassName,
  ].filter(Boolean).join(" ");

  const inputEl = (
    <input
      type={type}
      {...valueBindings}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={inputClasses}
      {...rest}
    />
  );

  /* Sem icons -> retorna input direto, sem wrapper extra */
  if (!IL && !IR) return inputEl;

  return (
    <div className="aa-input-wrap">
      {IL && (
        <span className="aa-input-wrap__icon aa-input-wrap__icon--left">
          <IL size={16} />
        </span>
      )}
      {inputEl}
      {IR && (
        <span className="aa-input-wrap__icon aa-input-wrap__icon--right">
          <IR size={16} />
        </span>
      )}
    </div>
  );
};

window.Input = Input;
