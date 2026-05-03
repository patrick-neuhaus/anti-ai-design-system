// ui_kits/default/components/display/Accordion.jsx
// Accordion — collapse expandable, single ou multiple selection.
// Props: items (array { id, header, content }), multiple (bool), defaultOpen (array ids)
// CSS-driven via tokens. No external deps.

/* Inject CSS once */
if (typeof document !== "undefined" && !document.getElementById("accordion-css")) {
  const s = document.createElement("style");
  s.id = "accordion-css";
  s.textContent = `
    .accordion {
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius-md, 8px);
      overflow: hidden;
      background: hsl(var(--card));
    }

    .accordion-item {
      border-bottom: 1px solid hsl(var(--border));
    }
    .accordion-item:last-child {
      border-bottom: none;
    }

    .accordion-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4, 16px);
      padding: var(--space-4, 16px) var(--space-5, 20px);
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: hsl(var(--foreground));
      text-align: left;
      transition: background var(--motion-fast, 150ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
    }
    .accordion-trigger:hover {
      background: hsl(var(--muted) / .5);
    }
    /* W1.9 / F-INT-020: focus inset (parent .accordion tem overflow:hidden,
       o box-shadow ring global ficaria cortado). Anula box-shadow global
       e desenha ring interno limpo, sem caixa dupla. */
    .accordion-trigger:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 2px hsl(var(--ring));
    }

    .accordion-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      color: hsl(var(--muted-foreground));
      transition: transform var(--motion-normal, 200ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
    }
    .accordion-item[data-open="true"] .accordion-icon {
      transform: rotate(180deg);
    }

    /* Height animation via grid trick — no JS height calculation */
    .accordion-body {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows var(--motion-normal, 200ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
    }
    .accordion-item[data-open="true"] .accordion-body {
      grid-template-rows: 1fr;
    }
    @media (prefers-reduced-motion: reduce) {
      .accordion-body { transition: none; }
      .accordion-icon { transition: none; }
    }

    .accordion-body-inner {
      overflow: hidden;
      min-height: 0;
    }

    .accordion-content {
      padding: 0 var(--space-5, 20px) var(--space-4, 16px);
      font-size: 14px;
      color: hsl(var(--muted-foreground));
      line-height: 1.6;
    }
  `;
  document.head.appendChild(s);
}

const ChevronDown = () => (
  <svg className="accordion-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Accordion = ({
  items = [],
  multiple = false,
  defaultOpen = [],
}) => {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="accordion" role="list">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const triggerId = `accordion-trigger-${item.id}`;
        return (
          <div
            key={item.id}
            className="accordion-item"
            data-open={isOpen ? "true" : "false"}
            role="listitem"
          >
            <button
              id={triggerId}
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span>{item.header}</span>
              <ChevronDown />
            </button>
            <div
              id={panelId}
              className="accordion-body"
              role="region"
              aria-labelledby={triggerId}
              hidden={false}
            >
              <div className="accordion-body-inner">
                <div className="accordion-content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

window.Accordion = Accordion;
