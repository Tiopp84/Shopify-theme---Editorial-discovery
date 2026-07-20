# Narrivelle foundation architecture

Status: **APPROVED FOR FOUNDATION — 2026-07-20**

The Phase 1 prototype is an interaction and art-direction contract, not production source. Foundation implementation starts from the imported Shopify Skeleton and follows `docs/Roadmap/03-architecture-and-engineering.md`.

## Decisions

- Global CSS owns reset, design tokens, typography, focus, layout primitives, and reduced-motion fallback only.
- Sections own layout and context; reusable merchant capabilities become Theme Blocks or snippets with explicit inputs.
- Storefront and schema interface copy use locale keys. No prototype copy is copied into production without a translation key.
- Body and editorial heading typography are separate merchant settings. Spacing uses a fixed token scale; components may not invent arbitrary global spacing variables.
- Colour roles begin with background, foreground, accent, and border. Component states must not communicate through colour alone.
- `main` is the single page landmark and receives the skip-link target. Overlays must use native dialog semantics or equivalent focus/Escape/restore behavior.
- Prototype CSS and JavaScript remain outside `theme/`; production components are implemented progressively and tested against real Shopify data.

## Definition of done for foundation changes

- Theme Check has zero offenses.
- JSON schemas and locale files parse; storefront/schema locale keys remain valid.
- No remote runtime, credential, store identifier, debug output, or unapproved asset is introduced.
- Keyboard focus is visible, reduced motion is honored, and a clean store can render without demo resources.
- Changed components are tested in Theme Editor lifecycle when a development-store render is available.
