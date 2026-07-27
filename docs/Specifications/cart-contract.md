# Phase 6 cart contract and data matrix

Status: **LOCKED FOR PHASE 6 VERTICAL SLICE — 2026-07-24**

This contract covers CART-01 through CART-04. Shopify's cart object and cart endpoints remain the source of truth for prices, discounts, inventory and checkout eligibility. The enhanced drawer may calculate the displayed line total and subtotal from Shopify-provided unit prices and the shopper's local quantity while a mutation is pending.

## Ownership and boundaries

| Concern | Source of truth | Boundary |
|---|---|---|
| Initial cart, line properties, selling plans, discounts, totals and checkout | Shopify Liquid and standard cart form POST | `main-cart` section |
| Drawer content | Shopify Liquid initially; Shopify Section Rendering after an enhanced mutation | `cart-drawer` section |
| Add, change and remove mutation | Standard product/cart forms without JavaScript; one shared Cart Ajax mutation queue as enhancement | `cart-drawer` and `cart-page` renderers over `CartStore` |
| Quantity rules and final validation | Shopify cart mutation and server response | `CartStore` updates optimistically, then accepts Shopify's final quantity or restores the last confirmed quantity |
| Cart count | Shopify response `item_count` | Header controls marked `data-cart-count` |
| Drawer focus and scroll lock | Drawer controller only | Native `dialog` |

## State and interaction contract

- The cart page uses `POST /cart` with `updates[]`, `note`, and `checkout` as the complete no-JavaScript path. Line removal is a direct Shopify cart-change URL.
- The drawer is optional enhancement. A product form posts normally unless the cart controller is available; enhancement sends the same `FormData` to `/cart/add.js`.
- Quantity and remove actions send only the line key and requested quantity to `/cart/change.js`. The latest valid server response is the only response that may commit UI.
- Quantity, line total and subtotal update from one shared local `CartStore` state. A customer interaction on either cart page or drawer updates both surfaces immediately. Once the queued Shopify response arrives, the relevant section redraws only when Shopify returns a different unit price, cart-level discount or total; this reconciles quantity breaks and automatic discounts without sacrificing immediate feedback.
- Page and drawer don't treat Liquid aggregate inventory as a client-side hard cap. Quantity changes remain optimistic and the sequential `cart/change.js` response is the authoritative inventory check. On rejection, the controller immediately reads `cart.js` because Shopify can partially accept an available quantity; it reconciles the affected unchanged line to that authoritative cart state and exposes Shopify's error text on that line item, not as a drawer-wide notice. A new interaction on that line clears its previous error.
- Quantity changes are collected by line-item key for 650 ms after the most recent interaction. Each dirty line is then sent through a sequential `cart/change.js` request using its line key, so Shopify validates the intended line. These ordinary mutations request cart JSON only; drawer section HTML is fetched only if Shopify returns a different unit price or cart-level discount. Remove is a major mutation: it is sent immediately through the same queue. If a request is already in flight, remove is next with no additional debounce; requests are never cancelled merely because the shopper continues adjusting quantity.
- Checkout controls, including accelerated checkout buttons where present, are disabled from the first local cart change until the queue confirms or rolls back that change. The standard Checkout button replaces its label with an in-button loading indicator during that interval. This prevents checkout from starting with a cart state that is still awaiting Shopify inventory validation.
- The controller records the last Shopify-confirmed quantity for every line. If a batch fails, only unchanged values from that failed batch roll back to that confirmed state; later shopper input remains queued. The cart page is always the server-rendered fallback.
- Product add first performs a PDP preflight: it reads `cart.js`, renders the selected variant through the Online Store Section Rendering API, and blocks a tracked deny-oversell request when `requested quantity > current inventory − cart quantity for that variant`. This does not use Storefront API/token and avoids opening the drawer or accepting a partial add in the normal over-limit case. On a valid preflight it uses Cart Ajax API, then reads the authoritative cart once before rendering and opening the drawer. Shopify still remains final authority if stock changes concurrently. The returned cart-drawer section is used to preserve Shopify-rendered cart data; a section-rendering request is the fallback. This prevents an empty drawer from opening during an add request. `CartDrawer` and `CartPage` remain independent renderers; neither renders the other.
- Order note is a cart-page-only editor. With JavaScript, it debounces through the same sequential mutation queue to Shopify `cart/update.js`, shows saving/saved/error feedback, and mirrors its current value to the drawer's hidden native form field. Without JavaScript the cart-page form remains authoritative.
- The drawer opens from an ordinary cart link only after JavaScript has loaded. Without JavaScript it remains a direct `/cart` navigation. Escape, backdrop click, Close, and browser-native dialog behavior restore the opener focus.
- Checkout is always Shopify-owned. The standard submit button and accelerated checkout buttons are not intercepted, delayed, or simulated.

## End-to-end runtime flow

### 1. PDP add

1. The shopper chooses a variant and quantity.
2. Before enhanced add, PDP reads the current cart and renders the selected variant through the Online Store Section Rendering API. For a Shopify-tracked, deny-oversell variant, it calculates `addable = current inventory − cart quantity for that variant`.
3. If requested quantity exceeds `addable`, or preflight cannot verify availability, it blocks add, keeps the shopper on PDP, does not open the drawer, and announces the error below the product form.
4. If valid, PDP calls `cart/add.js`, reads the authoritative cart, updates the shared `CartStore`, and opens the drawer only when Shopify confirms at least one cart item. Shopify remains final authority for concurrent inventory changes.

### 2. Drawer and cart-page quantity

1. Both surfaces render from the same `CartStore`; quantity, line total, subtotal and header count change locally in the same event.
2. Quantity input is debounced for 650 ms and sent sequentially by line key through `cart/change.js`. Pressing Enter in a quantity input prevents native form submission and sends that line immediately through the same queue. Remove is immediate; cart note on the cart page uses the same queue through `cart/update.js`.
3. The normal mutation response is cart JSON only. If Shopify changes unit price, cart-level discount or total, the controller fetches drawer section HTML once to reconcile complete Shopify-rendered pricing data.
4. A monotonically increasing local revision prevents a late pricing section response from overwriting a later shopper action.

### 3. Inventory rejection and recovery

1. When a quantity mutation fails, the controller immediately reads `cart.js` because Shopify can retain an available partial quantity.
2. It reconciles only the affected unchanged line to Shopify's quantity; if the cart cannot be read, it restores that line's last confirmed quantity.
3. The error is attached to the affected line item on both drawer and cart page. A new interaction on that line clears its previous error.

### 4. Checkout and fallback

1. From the first local cart mutation until confirmed or rolled back, standard and accelerated checkout controls are disabled. The standard button shows an in-button loading indicator and `aria-busy` state.
2. Checkout itself stays Shopify native; it is never simulated through Ajax.
3. Without JavaScript, PDP product form and cart-page form remain the authoritative Shopify fallback for add, quantity, remove, note and checkout. The drawer falls back to ordinary `/cart` navigation.

## Data matrix

| Case | Required behavior |
|---|---|
| Empty cart | Clear empty-state copy and continue-shopping path; no empty checkout shell. |
| Line item | Image fallback, product/variant/properties, selling plan, original/final and unit price, line discounts, quantity, remove action and line price render from Shopify objects. |
| Cart discounts | Cart-level discounts render next to subtotal; line-level discounts stay with their line. |
| Quantity/remove | Native POST/link works; enhanced state has loading, error, stale-response protection and live feedback. |
| Cart note | The editor appears only on the cart page. It persists through standard form submission without JavaScript, or through debounced `cart/update.js` with saving/saved/error feedback when enhanced. |
| Error/network failure | Existing UI remains usable, loading is cleared, error is announced, and the cart-page link remains available. |
| Checkout | Standard and accelerated paths remain Shopify controls and preserve cart state. |
| Theme Editor lifecycle | Controller initializes idempotently and cleans up on section removal/replacement. |

## Vertical-slice exit criteria

- Cart page has an accessible no-JavaScript path for empty, populated, quantity, remove, note, discounts and checkout.
- Drawer has native dialog focus, Escape/backdrop/Close restoration, loading/error/live-region handling and a direct cart fallback.
- Rapid enhanced mutations cannot paint stale cart state.
- Product → drawer/page → standard and accelerated checkout smoke paths work with Shopify data.
- Validator, JavaScript syntax, Theme Check, `git diff --check`, 320/375/desktop, keyboard and Theme Editor lifecycle checks pass before the Phase 6 gate is updated.
