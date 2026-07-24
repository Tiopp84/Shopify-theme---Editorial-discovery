# Phase 6 cart contract and data matrix

Status: **LOCKED FOR PHASE 6 VERTICAL SLICE — 2026-07-24**

This contract covers CART-01 through CART-04. Shopify's cart object and cart endpoints remain the source of truth for prices, discounts, inventory and checkout eligibility. The enhanced drawer may calculate the displayed line total and subtotal from Shopify-provided unit prices and the shopper's local quantity while a mutation is pending.

## Ownership and boundaries

| Concern | Source of truth | Boundary |
|---|---|---|
| Initial cart, line properties, selling plans, discounts, totals and checkout | Shopify Liquid and standard cart form POST | `main-cart` section |
| Drawer content | Shopify Liquid initially; Shopify Section Rendering after an enhanced mutation | `cart-drawer` section |
| Add, change and remove mutation | Standard product/cart forms without JavaScript; Shopify Cart Ajax API only as enhancement | `cart-controller` custom element |
| Quantity rules and final validation | Shopify inventory plus server response | The drawer receives tracked, deny-oversell variant inventory from Liquid, enforces it locally, then accepts Shopify's final quantity |
| Cart count | Shopify response `item_count` | Header controls marked `data-cart-count` |
| Drawer focus and scroll lock | Drawer controller only | Native `dialog` |

## State and interaction contract

- The cart page uses `POST /cart` with `updates[]`, `note`, and `checkout` as the complete no-JavaScript path. Line removal is a direct Shopify cart-change URL.
- The drawer is optional enhancement. A product form posts normally unless the cart controller is available; enhancement sends the same `FormData` to `/cart/add.js`.
- Quantity and remove actions send only the line key and requested quantity to `/cart/change.js`. The latest valid server response is the only response that may commit UI.
- Quantity, line total and subtotal update from one local drawer state. A customer interaction changes that state immediately; Shopify does not redraw or overwrite the displayed totals while the drawer remains open.
- For a tracked, deny-oversell variant, the drawer input `max`, increment control and typed value are clamped to the inventory value supplied by Liquid. The PDP continues to display raw inventory; only its purchasable maximum is reduced by the same variant's local cart quantity.
- Quantity changes are collected by line-item key for 650 ms after the most recent interaction. Each dirty line is then sent through a sequential `cart/change.js` request using its line key, so Shopify validates the intended line. Remove is a major mutation: it is sent immediately through the same queue. If a request is already in flight, remove is next with no additional debounce; requests are never cancelled merely because the shopper continues adjusting quantity.
- The controller records the last Shopify-confirmed quantity for every line. If a batch fails, only unchanged values from that failed batch roll back to that confirmed state; later shopper input remains queued. The cart page is always the server-rendered fallback.
- Product add uses the Cart Ajax API, then reads the authoritative cart once before rendering and opening the drawer. The returned cart-drawer section is used to retain inventory limits; a section-rendering request is the fallback. This prevents an empty drawer from opening during an add request. The cart page remains a conventional form and is never replaced by drawer JavaScript.
- The drawer opens from an ordinary cart link only after JavaScript has loaded. Without JavaScript it remains a direct `/cart` navigation. Escape, backdrop click, Close, and browser-native dialog behavior restore the opener focus.
- Checkout is always Shopify-owned. The standard submit button and accelerated checkout buttons are not intercepted, delayed, or simulated.

## Data matrix

| Case | Required behavior |
|---|---|
| Empty cart | Clear empty-state copy and continue-shopping path; no empty checkout shell. |
| Line item | Image fallback, product/variant/properties, selling plan, unit price, line discounts, quantity, remove action and line price render from Shopify objects. |
| Cart discounts | Cart-level discounts render next to subtotal; line-level discounts stay with their line. |
| Quantity/remove | Native POST/link works; enhanced state has loading, error, stale-response protection and live feedback. |
| Cart note | Native cart note persists through standard form submission and appears only when enabled. |
| Error/network failure | Existing UI remains usable, loading is cleared, error is announced, and the cart-page link remains available. |
| Checkout | Standard and accelerated paths remain Shopify controls and preserve cart state. |
| Theme Editor lifecycle | Controller initializes idempotently and cleans up on section removal/replacement. |

## Vertical-slice exit criteria

- Cart page has an accessible no-JavaScript path for empty, populated, quantity, remove, note, discounts and checkout.
- Drawer has native dialog focus, Escape/backdrop/Close restoration, loading/error/live-region handling and a direct cart fallback.
- Rapid enhanced mutations cannot paint stale cart state.
- Product → drawer/page → standard and accelerated checkout smoke paths work with Shopify data.
- Validator, JavaScript syntax, Theme Check, `git diff --check`, 320/375/desktop, keyboard and Theme Editor lifecycle checks pass before the Phase 6 gate is updated.
