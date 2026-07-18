# Narrivelle design principles and prototype acceptance criteria

Status: **APPROVED FOR PHASE 0 — 2026-07-18**

This document turns the Tier 1 market audit into original product rules. It is a specification for Narrivelle, not a recreation guide for any reference theme. Evidence is recorded in `../Discovery/tier-1-live-demo-audit.md` and `../Discovery/tier-1-interaction-checklist.md`.

## 1. Measurable design principles

### DP-01 — Editorial context must lead to a shoppable decision

- Home and collection editorial modules must expose a clear product or collection destination without relying on image-only hotspots.
- A shopper reaches a product detail page or a variant-safe add path in at most two interactions from every shoppable editorial module on mobile.
- Merchandising inserts must not alter collection product count, filter state, pagination semantics, or keyboard reading order.
- Acceptance: test with a hero, lookbook, collection insertion, missing image, and long translated heading.

### DP-02 — Product confidence is visible before commitment

- Product card and PDP hierarchy must communicate product title, current price, availability, and the next valid action before decorative content.
- PDP must offer merchant-managed size/fit, material/care, and delivery/returns information; absent content must hide cleanly rather than leave empty UI.
- Variant changes must synchronize URL, media, price, availability, SKU, and purchase state without stale values.
- Acceptance: pass available, sold-out, one-variant, multi-variant, compare-at, unit-price, and missing-confidence-content cases.

### DP-03 — Quick add accelerates only unambiguous purchases

- A single available variant may add directly. Products with choices open an explicit, accessible choice state; they must never silently add a default variant.
- On pointer devices, sizes/options may be progressively revealed. The same control must be reachable with keyboard focus and must have a usable touch/mobile equivalent.
- Unavailable options are conveyed by more than color alone, cannot be added, and preserve a clear recovery path.
- Acceptance: keyboard focus equals hover capability; touch viewport 320 px; unavailable option; out-of-stock response; repeated/late AJAX response.

### DP-04 — Mobile controls favour one-handed task completion

- Header owns brand and global context near the top; a mobile task bar may expose Home, Menu, Search, Shop, Cart, and Account only when it does not cover a required CTA or system UI.
- Header/menu and task bar must not duplicate the same task affordance at the same scroll position without a purpose. Visibility changes require no layout jump and remain reachable by keyboard.
- Product, filter, menu, and cart overlays may use a bottom sheet on mobile when task completion benefits from thumb reach; desktop behavior may use a side drawer or modal where appropriate.
- Acceptance: 320 px and 375 px screens, scroll direction changes, safe-area inset, virtual keyboard, zoom 200%, Escape/back, and focus restoration.

### DP-05 — Cart keeps checkout information dominant

- Cart surfaces show item, selected variant, quantity, current line price, discounts where present, subtotal, and checkout action before cross-sell/editorial material.
- Cross-sell or outfit continuity is optional and must not imply a bundle, discount, or unavailable selection.
- Loading, error, empty, and update confirmation states are explicit, announced, and recoverable.
- Acceptance: empty cart, populated cart, quantity update, remove, invalid quantity, network failure, discount/selling plan, and standard/accelerated checkout paths.

## 2. Deliberate product boundaries

The following patterns were useful reference observations but are not product requirements: competitor-specific composition, logo treatment, typography, exact bottom-bar styling, populated-cart incentives, recently viewed, and theme-specific animation.

Narrivelle keeps the underlying customer outcome: editorial discovery, product confidence, variant-safe speed, one-handed mobile access, and an unambiguous checkout path. Features that require external services or create disproportionate support burden remain outside MVP, as listed in `mvp-feature-matrix.md`.

## 3. Prototype scope

The prototype must demonstrate one coherent fashion/lifestyle preset with the following flows:

| Flow | Required screens/states | Prototype acceptance |
|---|---|---|
| Home to product | Announcement/header, editorial hero, shoppable story, product destination | Shopper reaches a real product or safe quick-add choice in two mobile interactions or fewer. |
| Collection discovery | Collection header, grid, product card, filters/sort, no-results | Filters retain URL/history context; card has focus=hover parity and unavailable state. |
| Product decision | Media, product form, variant options, confidence blocks, add path | Every variant-dependent value changes together; no stale media, price, or add state. |
| Cart and checkout | Empty cart, populated cart, update/error, checkout | Commerce information is visible before optional editorial content; focus and live messaging are defined. |
| Mobile navigation | Header, menu/search entry, task bar, at least one bottom sheet | No control blocks the PDP CTA; open/close restores focus and supports Escape/back. |

## 4. Prototype-wide acceptance criteria

- Use original Narrivelle composition, copy, tokens, and component structure; no screen may be traced from a competitor reference.
- Demonstrate desktop at 1440 px and mobile at 320 px and 375 px for every flow above.
- Annotate normal, loading, empty, error, unavailable, focus, and reduced-motion behavior for interactive components in scope.
- Show semantic landmarks, visible focus, target labels, contrast intent, and keyboard sequence for the home-to-cart path.
- Use representative long product names, sale price, sold-out variants, missing optional media/content, and an empty cart.
- Map each prototype region to a future Shopify section, block, snippet, or global-shell component before Phase 1 sign-off.

## 5. Phase 1 design gate

Phase 1 may begin when the prototype satisfies all rows in section 3 and the cross-cutting criteria in section 4. Any new feature must follow the MVP scope-change rule; visual polish cannot substitute for a defined commerce or accessibility state.
