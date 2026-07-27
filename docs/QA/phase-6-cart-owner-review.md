# Phase 6 — Cart owner review

Status: **PHASE 6 CLOSED FOR CURRENT FIXTURES — 2026-07-27**

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
4. For a tracked, deny-oversell variant, click `+` or type a quantity above available stock. The UI may update optimistically, then Shopify must reject or partially accept the request. The controller must read `cart.js`, show the accepted quantity, retain the item position, and show Shopify's inventory error in the summary; PDP must show Available/Sold out rather than an exact Liquid inventory count.
5. Remove the final drawer line. It must immediately show the empty state with no checkout controls; if Shopify rejects the mutation, the confirmed line must return.
6. Where present, verify custom properties, selling plan, original/final price, unit price, line discount and cart-level discount. Change across a quantity-price threshold or automatic discount threshold: the local total updates immediately, then reconciles to the price/discount returned by Shopify.
7. Block one `/cart/add.js` or `/cart/change.js` request. The old drawer contents remain usable, an error is announced, and View cart still works.
8. Confirm drawer checkout goes straight to Shopify checkout; it must not be intercepted or replaced.

## Shared enhanced cart state

With JavaScript enabled on the cart page:

1. Change a quantity rapidly using both buttons and direct input. The page line total, subtotal, header count and the drawer must update immediately; Shopify receives only the final quantity after the 650 ms debounce.
2. Remove a line from the page. It must disappear immediately from both surfaces; removing the final line shows the page and drawer empty state immediately. Force a failed request and verify the confirmed line returns in both places.
3. Enter an order note on the page. It must show Saving then Saved, persist after reload, and remain serialized behind any quantity mutation. Then open the drawer and proceed to checkout. The drawer need not display an editor, but its native checkout form must submit the saved note.
4. Cross a quantity-price or automatic-discount threshold. Both surfaces must reconcile to the server's final price/discount without duplicate listeners or stale totals.

## Theme Editor and recording

- Reload the preview, open/close the drawer, then add/remove/re-add the cart drawer section if Shopify exposes it. There must be no duplicated listener, duplicate dialog or console error.
- Record each row as **PASS**, **FAIL** or **NOT EVIDENCED**, with viewport, cart fixture and screenshot/video for a failure.
- Do not close Phase 6 until product → cart → standard/accelerated checkout smoke paths pass on the Shopify preview origin.

## Recorded owner smoke result — 2026-07-27

| Check | Result | Evidence / limitation |
|---|---|---|
| PDP add → cart drawer | PASS | Drawer opened after a confirmed add. |
| Rapid quantity and remove | PASS | Shared cart state remained responsive and no error was reported. |
| Cart page quantity and order note | PASS | Note persisted through the cart-page flow. |
| Standard checkout | PASS | Native Shopify checkout handoff succeeded. |
| JavaScript-off cart fallback | PASS | Native cart form and checkout fallback succeeded. |
| Theme Editor lifecycle | PASS | No duplicate UI/listener or console error was reported. |
| Console/network | PASS | No error; only resource warnings were observed. |
| Inventory preflight | NOT EVIDENCED | No tracked, deny-oversell fixture was available. |
| Accelerated checkout | NOT EVIDENCED | `content_for_additional_checkout_buttons` is present in the cart-page source, but Shopify preview returned no accelerated checkout buttons for the current payment/preview context. |

## Owner gate decision — 2026-07-27

The owner accepts the completed cart smoke evidence as sufficient to close Phase 6 for the current development-store fixtures. Accelerated checkout remains **NOT EVIDENCED**, because the active Test payment gateway does not supply accelerated checkout buttons and Shopify Payments onboarding must not be completed with false KYC information. This is a deferred regression row: when a legitimate accelerated provider is enabled, test its native handoff and record the result. Inventory preflight is likewise deferred until a tracked, deny-oversell fixture exists.
