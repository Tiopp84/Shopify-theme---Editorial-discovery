# Narrivelle foundation architecture

Status: **APPROVED FOR FOUNDATION — 2026-07-20**

The Phase 1 prototype is an interaction and art-direction contract, not production source. Foundation implementation starts from the imported Shopify Skeleton and follows `docs/Roadmap/03-architecture-and-engineering.md`.

## Decisions

- Global CSS owns reset, design tokens, typography, focus, layout primitives, and reduced-motion fallback only.
- Sections own layout and context; reusable merchant capabilities become Theme Blocks or snippets with explicit inputs.
- Section block schemas are allowlists. Declare each surface-owned Theme Block explicitly in its section; do not use generic `@theme`. Use `@app` only at genuine app integration points. Private underscore block targeting may be adopted only when the active Shopify editor supports it end-to-end.
- Every Liquid section declares exactly one placement policy: `enabled_on` for its allowed templates/section groups, or `disabled_on` when an explicit denylist is the clearer contract. Shell sections are limited to their owning group; page-owned commerce/content sections are limited to their owner template; editorial sections are limited to their deliberate editorial templates. A section that intentionally spans contexts must document the exception and name each allowed context (for example, Announcement bar is allowed in the Header group and body templates). Do not leave a public section unscoped.
- Theme Blocks are targeted by their parent section allowlist, not merely by being present in `/blocks`. Product blocks remain Product-owned, and footer blocks remain Footer-owned. The repository validator enforces placement policy on every Liquid section and rejects generic `@theme` section schemas.
- Storefront and schema interface copy use locale keys. No prototype copy is copied into production without a translation key.
- Body and editorial heading typography are separate merchant settings. Spacing uses a fixed token scale; components may not invent arbitrary global spacing variables. The approved role mapping, palette and component rules are defined in `visual-design-tokens.md`.
- Colour roles begin with background, foreground, accent, and border. Component states must not communicate through colour alone; the only seasonal accent is governed by `visual-design-tokens.md`.
- `main` is the single page landmark and receives the skip-link target. Overlays must use native dialog semantics or equivalent focus/Escape/restore behavior.
- Prototype CSS and JavaScript remain outside `theme/`; production components are implemented progressively and tested against real Shopify data.

## Responsive layout contract

Every storefront surface must explicitly support these three layout ranges. A range describes an interaction and composition mode, not only a different column count. Do not let a component inherit a compressed desktop or expanded mobile layout accidentally between breakpoints.

| Range | CSS range | Required composition and interaction ownership |
|---|---|---|
| Compact | `<48rem` | Keep one clear reading sequence and the compact task/overlay composition. Essential commerce actions remain discoverable without hover. |
| Tablet | `48rem–63.99rem` | Use a deliberate intermediate composition: retain drawer-based header navigation, search and collection facets; use the width for balanced two-column editorial/cards where appropriate; keep PDP details stacked; do not enable desktop-only pinned motion or compact-scrolling header behavior. A section may keep CSS-only sticky media when its tablet layout remains explicitly side-by-side and its contract documents the exception. |
| Desktop | `≥64rem` | Enable desktop navigation, supported dense grid modes, desktop side panels and editorial sticky/pinned choreography. The component still owns its no-JavaScript fallback and keyboard behavior. |

The pixel values assume the default 16 px root size: compact is below 768 px, tablet is 768–1023 px, and desktop begins at 1024 px. Wider media queries may tune density or spacing, but must not create a fourth interaction layout without an explicit contract update.

### Implementation rules

- Build mobile-first and make each component's behavior concrete in all three ranges. Use the same `64rem` boundary for desktop-only navigation, sticky/pinned choreography and desktop gallery controls unless the component contract documents a justified exception.
- Hover is progressive enhancement only: put hover affordances inside `@media (hover: hover) and (pointer: fine)`, and provide an equivalent keyboard-focus state. On compact and tablet, an essential action must remain visible or have a clear non-hover trigger.
- Preserve direct manipulation on touch: horizontal gestures must not steal ordinary vertical scrolling (`touch-action: pan-y` where relevant), and overlays use viewport-safe sizing/anchoring such as `dvh`.
- Use viewport width, not device name or orientation, to choose ownership. A 1024 px landscape check is the desktop handoff test; a device's physical category never overrides the three declared CSS ranges.
- Verify a responsive change at 320 px, 375 px, 768 × 1024, 820 × 1180, 1024 × 768 and 1440 px. Include long copy, missing media, 200% zoom, keyboard focus, reduced motion and—where applicable—the state after asynchronous DOM replacement.

## Definition of done for foundation changes

- Theme Check has zero offenses.
- JSON schemas and locale files parse; storefront/schema locale keys remain valid.
- No remote runtime, credential, store identifier, debug output, or unapproved asset is introduced.
- Keyboard focus is visible, reduced motion is honored, and a clean store can render without demo resources.
- Changed components are tested in Theme Editor lifecycle when a development-store render is available.
