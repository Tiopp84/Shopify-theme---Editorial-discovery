# Narrivelle visual design tokens

Status: **APPROVED DESIGN DIRECTION — 2026-07-27**

This document is the visual source of truth for the next homepage design and all subsequent component remediation. It replaces ad-hoc visual choices in the Phase 7 static slices; those slices remain functionally valid but are not approved visual references.

## Reference precedence

`stitch_fashion_cart_redesign/narrivelle/DESIGN.md` is a supporting Stitch reference only. `stitch_fashion_cart_redesign/narrivelle_homepage_desktop_full_width_hero/` and `stitch_fashion_cart_redesign/narrivelle_homepage_mobile_editorial_overlay/` are the approved homepage composition references. They inform the full-bleed desktop hero, mobile editorial overlay, divider-led hierarchy, tonal layering, sharp geometry and responsive grid discipline. Where any Stitch export conflicts with this contract, this contract wins: use the mineral-neutral palette and Moss accent below, Francus Italic rather than Bodoni Moda for campaign type, and the 8px spacing base rather than 4px.

## Foundation principle

**Quiet Modern Wardrobe**: warm mineral neutrals, a single seasonal accent, and disciplined type roles. The interface must feel composed and practical: commerce information stays compact and legible, while expressive typography is reserved for editorial moments.

## Colour roles

| Role | Value | Intended use |
|---|---:|---|
| Paper | `#F5F3EE` | Default page background and light text surface. |
| Panel 01 | `#EBE7DD` | Soft grouped surface, secondary panels. |
| Panel 02 | `#E1DBCC` | Stronger tonal separation between adjacent chapters. |
| Panel 03 | `#D6CFBC` | Quiet emphasis, selected neutral surface. |
| Ink | `#242119` | Primary text, primary action and strong borders. |
| Accent — Moss | `#5C6A4B` | The only current seasonal accent: links, focused emphasis and intentional editorial markers. |
| Accent tint | `#E4E8DC` | Low-emphasis accent background and selected/quiet state. |

Moss may rotate by collection or season in a future merchant-safe system (for example, a dust-blue seasonal accent). The neutral roles stay fixed. No component may introduce a second arbitrary accent colour, and colour alone may never communicate sale, availability, selection or an error.

## Typography roles

| Role | Typeface | Use | Rules |
|---|---|---|---|
| Campaign serif | Francus Italic | Campaign headlines and story titles only | Never use for product cards, PDP decisions, cart, filters, form labels or prices. One dominant campaign headline per viewport. |
| Commerce sans | Inter | Navigation, section headings, body, labels, product names, controls and prices | Default typeface for every commerce surface. |
| Price | Inter with tabular numerals | Current, compare-at and unit prices | Use `font-variant-numeric: tabular-nums`; align price columns without relying on whitespace. |

The exact font files must be supplied by Shopify's font library or entered in the asset license register before implementation. Until then, use only approved local/platform fallbacks; do not add a remote font runtime.

## Component language

- **Primary action:** Ink fill, Paper text, compact uppercase label with restrained tracking; minimum 44 px target.
- **Secondary action:** Paper/transparent fill, 1 px Ink border, Ink text; visually secondary to the primary action.
- **Size selector:** compact outlined controls; selected state uses Ink fill/Paper text; disabled state remains textual and not colour-only.
- **Swatch:** circular 32–36 px target with visible selected ring and an accessible text label.
- **Select:** quiet outlined control with explicit label and native fallback.
- **Dividers:** thin low-contrast neutral lines establish cadence; avoid heavy borders around every card.

## Spacing and hierarchy

The base unit is **8 px**. Approved major steps are **8 / 16 / 24 / 40 / 64 px**. Use the next step deliberately rather than arbitrary values.

- Major homepage chapters: 64 px desktop and 40–48 px mobile separation.
- Inside a component: 16–24 px by default; 8 px for tight label/value relationships.
- A new chapter must change at least one of surface, grid, type role or media treatment. Repeating white panels with the same oversized heading is not hierarchy.
- Product grids prioritise media, compact product name and price. Product titles are capped at two lines in dense grids; price aligns consistently and does not compete with the title.
- Mobile uses one clear reading sequence: editorial message, destination, then commerce items. No staggered desktop composition may create disconnected content or blank columns on mobile.

## Adoption rules

1. The forthcoming approved homepage design defines the composition and responsive layouts; this token document defines the reusable visual language.
2. Update shared CSS variables and component primitives only after the homepage reference is accepted. Do not patch individual sections to imitate a visual direction in isolation.
3. Every token migration must preserve existing accessibility, Shopify ownership and no-JavaScript behavior.
4. Test the applied system at 1440, 375 and 320 px, including long copy, zoom 200%, keyboard focus and reduced motion.

## Foundation migration — 2026-07-27

- Applied to shared primitives: the approved Paper/Ink/Moss/default-border palette, sharp default controls, semantic 8/16/24/40/64 px aliases, commerce/campaign font roles and tabular price figures.
- Commerce headings, cart product titles, facet labels and mobile navigation use the commerce role. Campaign hero/story/composition headings and the brand use the campaign role.
- The actual font faces still come from Shopify Theme Settings. Select Inter for the commerce font and a licensed Shopify-hosted Francus Italic (when available) for the campaign font; no remote font runtime is introduced.
- No route-specific layout was changed in this migration. PDP adaptive media and header dropdown stacking are retained functional fixes and require visual verification in Shopify preview.
