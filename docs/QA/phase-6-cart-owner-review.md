# Phase 6 — Cart owner review

Status: **READY FOR LIVE REVIEW — 2026-07-24**

Use a Shopify preview URL for cart and drawer browser behavior. Test Theme Editor lifecycle separately. The required behavior is defined by [`cart-contract.md`](../Specifications/cart-contract.md).

## Prepare

Use a cart with at least two distinct variants. Where available, include a sale line, a line discount, a cart discount, a selling-plan line, and a line with custom properties. Do not mark data unavailable in the catalogue as pass.

## Cart page — no JavaScript baseline

With JavaScript disabled, verify at desktop, 375 CSS px and 320 CSS px:

- Empty cart has useful copy and a continue-shopping link, with no checkout controls.
- A populated cart exposes product, selected variant, properties/selling plan when present, line price, line/cart discount, quantity, remove, subtotal, note and checkout in that order of importance.
- Change a quantity, add/edit a note, submit Update, and confirm Shopify persists both values.
- Remove a line through the normal link and confirm only that line is removed.
- Standard checkout and accelerated checkout, when available, navigate to Shopify checkout without a theme error.

## Enhanced cart drawer

With JavaScript enabled:

1. Open Cart from the header at desktop, 375 px and 320 px. It opens a dialog; Close, Escape and backdrop return focus to the original header control.
2. Add an available product from PDP. The drawer opens, announces the update, refreshes quantity/subtotal and updates the header count.
3. Change quantity several times rapidly and remove a line. Quantity, line total and subtotal must update immediately on every interaction. Confirm that each changed line is sent once through a sequential Shopify update after the final quantity interaction; removing a line must be next in the queue without the 650 ms debounce.
4. For a tracked, deny-oversell variant, increase the drawer quantity to its inventory. The `+` control must become disabled; typing a larger value must clamp to that inventory, and the subtotal must use the clamped quantity. On PDP, the availability text must continue to show raw inventory, while its quantity maximum is inventory minus that variant's cart quantity.
5. Block one `/cart/add.js` or `/cart/change.js` request. The old drawer contents remain usable, an error is announced, and View cart still works.
6. Confirm drawer checkout goes straight to Shopify checkout; it must not be intercepted or replaced.

## Theme Editor and recording

- Reload the preview, open/close the drawer, then add/remove/re-add the cart drawer section if Shopify exposes it. There must be no duplicated listener, duplicate dialog or console error.
- Record each row as **PASS**, **FAIL** or **NOT EVIDENCED**, with viewport, cart fixture and screenshot/video for a failure.
- Do not close Phase 6 until product → cart → standard/accelerated checkout smoke paths pass on the Shopify preview origin.
