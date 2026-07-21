# Phase 4 discovery contract

Status: **PRODUCT CARD VISUAL REVIEW NEEDS ITERATION — 2026-07-20**

## Ownership

- `product-card` owns stable media, title/vendor hierarchy, price, sale/sold-out state, and the product destination.
- Collection/search sections own query context, result count, grid composition, pagination, filters, sorting, and empty/error states.
- Quick add is a separate interaction component. It may add directly only when exactly one available variant exists; products requiring a choice must open an accessible choice state.
- Predictive search owns async loading/error/stale-response handling and must preserve the standard search route as its no-JavaScript fallback.

## Product card data contract

- Required input: a Shopify product object.
- Media uses a fixed merchant-selected ratio and responsive widths; missing media retains the card geometry without a broken image.
- Title, current price, compare-at price, availability, and next navigation action remain visible without hover.
- Sale and sold-out states use locale-backed text and do not rely on colour alone.
- Any pointer reveal must also activate with `:focus-within`; long titles wrap without covering price or action.

## Phase gate

- Product cards pass available, sold-out, sale, missing-media, and long-title data.
- Filter/sort state is URL-backed and supports active removal/reset, no-results, mobile drawer, keyboard and history navigation.
- Search/predictive search distinguishes product, collection, article and page results and passes empty/loading/error/focus/live-region behavior.
- Filter → product navigation preserves a valid destination and does not corrupt pagination or product-count semantics.

## Product card evidence — 2026-07-20

- Validator pass: 60 theme files, 63 storefront keys, 79 schema keys.
- Theme Check pass: 46 files, zero offenses.
- Development preview `/collections/all`: 12 product cards, 12 responsive images, 6 sale badges, no Liquid error.
- Development preview search for “Camel”: 2 product cards rendered through the shared snippet, no Liquid error.
- The current development dataset does not expose sold-out or missing-media products in these result sets. Those live-data states remain pending and must not be inferred from static markup alone.
- Desktop visual review at 1440 px does not pass: the grid remains too close to a generic Skeleton catalog, media dominates the information hierarchy, repeated destination links add noise, dividers are visually heavy, and the card lacks a recognizable Narrivelle editorial anatomy. Evidence: `product-card-review-1440.png`.

## Collection facets evidence — 2026-07-20

- Progressive GET forms render desktop filters, mobile filter dialog, sorting, active removal and clear-all without JavaScript dependency.
- JavaScript syntax, validator and Theme Check pass: 62 files, 72 storefront keys, 79 schema keys; 47 theme files, zero offenses.
- Price-ascending sort changes the first product from “Camel Tailored Overcoat” to “Resort Stripe Shirt”.
- Colour=Camel reduces the development result set from 12 to 3 cards, renders the checked values and active chip, and preserves price-ascending sort.
- Desktop filtered layout review passes without card collision or Liquid error. Evidence: `collection-facets-review-1440.png`.
- Browser gate on 2026-07-21 passes 27/27 assertions at 1440, 375 and 320 CSS px: no horizontal overflow; drawer width remains 85%; checkbox filtering preserves the open drawer/group and focus; close, Escape and backdrop restore opener focus; sort and filter keep the outer controller stable; Back/Forward restore URL state; valid but non-overlapping price bounds render no-results through AJAX and Back recovers products; layout dimensions remain valid after async replacement.
- Remediation after owner review: sort now auto-submits while carrying active filter values; desktop checkbox changes auto-submit while preserving current sort; mobile retains an explicit Apply step for multi-selection. Combined Camel + Gray returns four cards with both values checked and price-ascending preserved.
- Browser-level remediation verification: changing sort navigates immediately to `sort_by=price-ascending` and changes the first product; clicking Gray filters immediately; clicking Beige after the Gray navigation produces additive Beige + Gray parameters with both controls checked and sort preserved. Empty price-range parameters are removed before submission. Mobile checkbox filters use the same immediate-submit controller; Apply remains only for price-range/no-JavaScript fallback.
- Wide-layout spacing remediation constrains the desktop facet rail to 15rem, allows price inputs to shrink inside equal columns, reduces collection-header vertical padding/title scale, and compresses the sort toolbar. Evidence: `collection-spacing-review-1920.png`; owner visual approval remains pending.
- Collection section now exposes a locale-backed Desktop filter layout setting: Sidebar or left-side Drawer. Drawer mode gives the product grid full width, keeps sort in the toolbar, opens filter groups collapsed by default, and shares native dialog Escape/backdrop/focus restoration plus immediate checkbox filtering with mobile.
- AJAX discovery refactor replaces per-form/reload behavior with one `collection-discovery` controller. Standard GET forms remain the no-JavaScript fallback; enhanced filter, sort, active-chip and pagination navigation fetch the current section through Shopify Section Rendering, atomically replace collection content, update History API state, announce loading/update/error, and preserve drawer/group/focus state.
- Browser verification proves no document reload: a page marker and outer controller reference survive sort, mobile filter and Back navigation. At 375 CSS px, Camel filtering keeps the drawer and Color group open with focus on the checked input; Back restores four products. Rapid price-descending → title-ascending changes finish on title-ascending with no stale response and `aria-busy` cleared.
