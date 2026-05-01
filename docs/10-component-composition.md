# Component composition rules

Rules for composing UI when the component you need is **not** in the library, or when you need to extend an existing one. The library covers ~33 components; everything else should be derivable from these rules without forking.

This doc is a companion to `docs/07-component-patterns.md` (which describes how the existing components should be used) and `docs/08-variation-axes.md` (which describes how axes alter components across classes).

---

## 1. Composition primitives

The library is built from a small primitive set. Compose new components from these before reaching for new tokens.

| Primitive | Role |
|---|---|
| `Surface` | Background tile, tone-driven (base/card/muted/primary). |
| `Card` | Elevated content tile with hairline border + radius. |
| `Section` | Semantic marketing/settings block with optional eyebrow/title/subtitle. |
| `PageShell` | Padding wrapper inside `AppLayout`. |
| `AppLayout` | Sidebar + main content shell. |
| `PageHeader` | Title + subtitle + actions; one per screen. |
| `Button` | Click target with verb. Variants: primary/secondary/outline/ghost/destructive. |
| `Input`/`Textarea`/`Select`/`Checkbox`/`Radio`/`Switch` | Form controls. |
| `FormField` | Label + control + helper/error wrapper. |
| `Badge`/`Tag`/`Avatar`/`Alert`/`EmptyState` | Display primitives. |

Rule: a new component is built **out of** primitives, not next to them.

---

## 2. Token consumption

Every color value in component CSS:

```jsx
// ✅ correct
color: "hsl(var(--foreground))",
background: "hsl(var(--card))",
border: "1px solid hsl(var(--border))",
boxShadow: `0 0 0 3px hsl(var(--ring) / .15)`,

// ❌ wrong — tokens.css stores HSL triples, not full color strings
color: "var(--foreground)",
```

Non-color tokens (radius, spacing) read directly:

```jsx
borderRadius: "var(--radius)",
```

If a value can't be expressed via existing tokens, **flag it** with `// FIXME: needs new token --foo` instead of inventing inline values.

---

## 3. Variants by prop, not by component

If a component has 2+ visual flavors, expose a `variant`/`intent`/`size` prop. Do **not** create `Button2` or `ButtonAlt`.

```jsx
// ✅ correct
<Button variant="destructive">Delete</Button>
<Badge intent="success" strong>Active</Badge>

// ❌ wrong
<DangerButton>Delete</DangerButton>
<StrongSuccessBadge>Active</StrongSuccessBadge>
```

If two components share <60% of code, they're allowed to be separate (Card vs. Surface). If they share 60%+, fold into one with a prop.

---

## 4. Compound components for parts that travel together

When a UI element is naturally multi-part, expose a compound API:

```jsx
// ✅ correct — parts addressable, composable
<Card>
  <CardHeader title="Recent" actions={<Button>View all</Button>} />
  <CardBody>...</CardBody>
</Card>

// ❌ wrong — one prop bag with nested objects
<Card title="Recent" actions={...} body={...} />
```

Rule of thumb: if a consumer might want to skip or reorder a part, it's a compound. If parts always render together in the same order, props are fine.

---

## 5. Slots, not magic

When a component needs a customizable section, expose it as a React node prop (`actions`, `leading`, `trailing`, `footer`), **not** as a string or icon name.

```jsx
// ✅ correct
<PageHeader title="Romaneios" actions={<><Button>Filter</Button><Button variant="primary">New</Button></>} />

// ❌ wrong
<PageHeader title="Romaneios" actions={["filter", "new"]} />
```

Children are the implicit "main" slot. Named slots fill specific positions.

---

## 6. Sizing scale

Components that have a `size` prop use the same three steps:

| Size | Height | Font | Use |
|---|---|---|---|
| `sm` | 32px | 13px | Dense rows, table actions, compact filters. |
| `md` | 40px | 14px | Default. |
| `lg` | 48px | 15px | Hero CTAs, marketing surfaces, primary auth submit. |

Don't introduce `xs`/`xl` unless the existing scale demonstrably can't reach. If you need a 24px row, you're probably building a different component (Tag, dot indicator).

---

## 7. Density via class swap, not via component variant

When the same screen needs to swap densities for an axis change, do it at the layout level:

```jsx
<div className="density-compact">  /* or density-comfortable, density-spacious */
  <PageShell>...</PageShell>
</div>
```

Components read CSS variables that the density class overrides. They don't carry a `density` prop. (See `docs/08-variation-axes.md` axis 1.)

---

## 8. State by prop, never by string match

```jsx
// ✅ correct
<Badge intent="success">Conferido</Badge>

// ❌ wrong
<Badge>{status === "ok" ? "✓ " : ""}Conferido</Badge>
```

Visual state (intent, disabled, invalid, active, loading) is always a typed prop, not a string parsed inside the component.

---

## 9. Icons are a prop, not an import

Components that may carry an icon accept it as a prop (`icon`, `iconLeft`, `iconRight`):

```jsx
<Button iconLeft={Icon.Plus}>New romaneio</Button>
<EmptyState icon={Icon.Inbox} title="Nothing yet" />
```

Never hardcode an icon inside a component. Icons are passed in by the consumer; the registry (`Icon.jsx`) is the only place that defines them.

Per `docs/07` rule: don't inject a Lucide icon into every label. Most form fields don't need one. Most buttons don't need one. Icons earn their place; they don't fill space.

---

## 10. New screen = composition, not new screen file

If you find yourself writing `MyDashboardScreen.jsx` from scratch, stop. A screen is:

```jsx
<AppLayout sidebar={<Sidebar ... />}>
  <PageShell>
    <PageHeader title="..." actions={...} />
    <Card>...</Card>
    {/* or grid of cards / table / form */}
  </PageShell>
</AppLayout>
```

Screen files live in `screens/` only when they encode a real reusable composition (DashboardScreen with 4 stat cards + recent table). One-off pages don't need their own component file — they live in `app.jsx` directly.

---

## 11. New token only as a last resort

Before adding a CSS var:

1. Can the value come from an existing token? (`--muted-foreground` for any low-emphasis text.)
2. Can it come from an existing token + alpha? (`hsl(var(--primary) / .12)` for a tinted bg.)
3. Can it come from an axis change (density, surface) instead of a literal value?

Only after all three fail, add a token to `presets/default/tokens.css`. New tokens MUST:

- Be semantic, not literal (`--row-h-compact`, not `--height-32`).
- Have an entry in `docs/03-token-system.md`.
- Pair with a foreground token if used as a bg with text on top (AA-tuned).

---

## 12. Class-aware components, not class-specific components

Don't build `OpsButton.jsx`, `FintechButton.jsx`. Build `Button.jsx` and let the class-level token override + axis values change its appearance.

The same `<Button variant="primary">` should:

- Render teal in `default` (ops dashboard).
- Render slate-blue in fintech.
- Render warm-coral in consumer.

…all by token override, with zero component change.

If a class genuinely needs a different shape (radius, padding, font), express it as an axis (`density`, `surface`) or as a token override, not as a parallel component.

---

## 13. Anti-patterns inline check

Every new component review goes through `docs/01-anti-patterns.md`:

- Not using `<table>` as layout (rule #2).
- Not wrapping `<NavLink>` with custom logic (rule #1).
- Not putting a `<Card><CardHeader>` around content that's already a card (rule #3).
- Not stacking multiple AI tropes (gradient + emoji + bold rounded corners + hero hover-lift) on the same screen.

If a new component needs more than two anti-pattern overrides to render correctly, it's the wrong shape.

---

## 14. Brand-agnostic by default

Components in `ui_kits/default/components/` may **not** contain:

- Hardcoded HSL or hex outside tokens.
- Asset paths to specific brands (`barry-callebaut-logo.svg`, `bc-icon.jpg`).
- Persona/email/company strings (`João Pereira`, `joao@barry-callebaut.com`, `ChocoTracking`).
- Copy in any specific language unless it's clearly a placeholder ("App Name", "Tagline", "email@exemplo.com").

Brand arrives via props at the consumer level. Defaults are neutral placeholders.

---

## 15. When in doubt, read the existing components

The fastest answer to "how should X look?" is `cat` an existing component:

- Action button → `base/Button.jsx`
- Data tile → `dashboard/StatCard.jsx`
- Status pill → `display/Badge.jsx` or `display/StatusBadge.jsx` (semantic mapping)
- Page chrome → `layout/PageHeader.jsx` + `layout/PageShell.jsx`

If your invented component looks meaningfully different from these, justify it before shipping.
