# Narrivelle Phase 1 prototype

This is a dependency-free, original interaction prototype for the Phase 1 design gate. It is intentionally outside `theme/`: no prototype code is production theme code.

## Run

Open `index.html` directly in a browser, or serve the repository root with any static file server. The prototype contains no remote assets, fonts, analytics, or network requests.

## Review path

1. Home: use **Explore the edit** or a story product.
2. Collection: open filters, try **No results**, focus a product card, then choose a product.
3. Product: change colour and size, including the unavailable size; add to bag.
4. Cart: change quantity, trigger the simulated update error, remove the line, and continue to checkout.
5. Mobile (320 px and 375 px): use the bottom task bar and menu bottom sheet. Confirm the bar does not cover the sticky PDP action.

The **Review states** control exposes loading, empty, error, unavailable, focus, long-copy, and missing-media examples without requiring separate files.

## Prototype boundaries

- Checkout is represented as a disabled hand-off confirmation; the prototype never creates an order.
- Search, account, and sort are labelled prototype affordances, not complete feature flows.
- Product and cart data are local fixtures. Delayed cart updates simulate stale-response handling.
- Motion is reduced when `prefers-reduced-motion: reduce` is active.

See `prototype-map.md` for acceptance coverage and the future Shopify section/block/snippet map.
