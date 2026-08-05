# PDP contract and product data matrix

Status: **LOCKED FOR PHASE 5 VERTICAL SLICE — 2026-07-23**

This is the implementation contract for PDP-01 through PDP-03. It precedes UI work so variant-dependent UI cannot drift from Shopify data.

## Ownership and rendering boundary

| Concern | Owner / source of truth | Boundary |
|---|---|---|
| Product, variants, inventory policy, quantity rules, selling-plan allocations, price and availability | Shopify Liquid on first render; product-form/cart endpoints remain authoritative on submit | `main-product` section |
| Selected variant | `?variant=<variant-id>` when valid; otherwise `product.selected_or_first_available_variant` | `product-form` custom element and serialized variant JSON |
| Variant option controls | Native form controls; controller derives a matching variant from serialized Shopify data | Picker and variant-dependent fields inside `main-product` |
| Main gallery item | Selected variant's `featured_media`, otherwise the current gallery selection | Gallery only; changing it must never overwrite the selected variant |
| Media playback, modal, model viewer | Native Shopify media markup/browser APIs; later gallery controller | Individual media item/modal only |
| Quantity input | Native product form owns POST fallback. Enhanced controller applies Shopify quantity rules and performs a fresh Online Store section/cart preflight before Ajax add; Shopify cart mutation remains final validation | Product form |
| Selling plan | Native `selling_plan` form control; Shopify validates allocations and price | Product form |
| Size guide | A Product Form block selects and renders one Shopify Page | `size-guide` owns only dialog open/close state; the page link remains the no-JS fallback |

The Phase 5 vertical slice has one stable `product-form` controller per main product section. It does not fetch or recalculate money. A valid selection updates the URL with `history.replaceState`, then atomically updates every variant-dependent node in the section. Back/Forward reads the URL through the same selection pipeline. The controller is re-created on Shopify section load and destroyed on section unload.

## Data matrix

| Case | Server render / no-JS behavior | Enhanced behavior | Required result |
|---|---|---|---|
| Image media | Responsive `image_tag`, width/height and lazy loading outside the first visible item | Gallery selection may change the displayed image through thumbnails; desktop previous/next controls; or a horizontal touch swipe in either the inline gallery or zoom modal. During touch drag, the current media follows the finger; a committed swipe slides the adjacent media in from the opposite edge, while an uncommitted drag returns to its start. A normal media click still opens zoom. | Never broken media or CLS from missing dimensions; vertical touch gestures retain page scroll; reduced motion may resolve the transition without animation. |
| Shopify-hosted video | Shopify `media_tag` with controls and poster | Future gallery/modal preserves controls and stops playback on close | No autoplay with sound; reduced-motion does not auto-play |
| External video | Shopify `external_video_tag`, provider embed only when configured | Future modal is optional enhancement | Missing/blocked provider leaves title/link/fallback, not a blank frame |
| 3D model | Shopify `model_viewer_tag` with model UI | Future modal follows the same selected-media state | Model viewer is not fabricated when no model exists |
| No media | Gallery frame and thumbnails are omitted | No gallery controller work | Product decision remains usable and layout stable |
| Single available variant | Selected variant renders; ID is posted by the form | No unnecessary picker interaction | Price, availability and add action remain valid |
| Multiple variants | Native option controls submit the selected `id` | Controller finds one exact option tuple | URL, form ID, media, price, compare-at, unit price, SKU and availability change together |
| Unavailable combination / sold out variant | Shopify selection remains visible; add button is disabled only for the selected unavailable variant | Controls expose unavailable state with text/ARIA, never silently substitute a variant | No add path for unavailable selection; valid selection remains recoverable |
| Selling plans absent | No selling-plan UI | None | No empty subscription shell |
| Selling plans present | Native `selling_plan` control posts its value | Later controller may synchronize allocation price only from serialized Shopify data | One-time purchase remains an explicit valid choice where Shopify permits it |
| Quantity rules / volume pricing absent | Quantity starts at 1; Shopify validates on submit | None | No invented constraints |
| Quantity rules / volume pricing present | `min`, `max`, `step`, rule copy and price breaks render from Shopify objects | Later enhancement only mirrors Shopify-rendered data | Browser constraints assist; Shopify remains authoritative |
| Optional vendor, SKU, unit price, compare-at, description, rating, confidence blocks | Omit empty elements | Variant updates hide/show their fields | No empty labels, stale text, or fake values |

## Interaction contract for the vertical slice

- **Event:** a native option `change` requests selection; `popstate` restores the URL-selected variant. No debounce is needed.
- **Validation:** only an exact Shopify variant tuple is committed. An impossible tuple preserves the current committed variant, disables purchase with an explicit unavailable message, and does not change URL/media/price.
- **Render:** serialized variant data atomically changes hidden `id`, price, availability, SKU, option disabled state, quantity rule, buttons, selected media marker and URL. The theme exposes availability, not an exact inventory count.
- **URL/history:** initial valid `?variant=` is respected. User changes use `replaceState` so option exploration does not flood history; Back/Forward applies URL state without creating history.
- **Focus and continuity:** native control retains focus after a selection. Updating text/media never moves focus. A future gallery dialog must restore its opener focus and pause/reset video on close.
- **Quick Add media:** the Quick Add dialog may show a product-preview carousel when multiple media exist. Thumbnail, previous/next and horizontal touch swipe only select another preview. During a touch drag, the current preview follows the finger and the adjacent preview enters from the opposite edge; an uncommitted drag returns to its start. It has no zoom dialog, does not autoplay media and does not change the selected variant. Variant featured media may still select its matching preview.
- **Size guide modal:** the selected Page is server-rendered. The `size-guide` controller intercepts its link only when native dialog support exists, moves focus to Close, closes by Escape/backdrop/Close, and returns focus to the link. It has no URL state, fetch, animation, or reduced-motion behavior. Without JavaScript it remains a normal page link.
- **Async/error:** before enhanced add, PDP reads the fresh cart and requests its own Online Store section for the selected variant. For tracked deny-oversell inventory, it blocks the request when `requested quantity > fresh inventory − cart quantity for that variant`, with the error shown at the PDP; it never opens the drawer in that case. This uses neither Storefront API nor a public token. A failed preflight blocks add; Shopify remains the final validator for a concurrent inventory change. The cart drawer exposes a shared `cart:state` event aggregated by `variant_id` to keep PDP state aligned after cart mutations.
- **Fallback:** without JavaScript, server-selected variant, native controls and the Shopify product form remain fully functional. Direct variant URLs remain bookmarkable. If JavaScript fails, it must not hide form content.
- **Lifecycle/reduced motion:** controller initialization is idempotent and listens for Shopify section load/unload. No automatic media motion is introduced; media controls are user initiated.

## Vertical-slice exit criteria

- Image/video/external-video/3D/no-media render paths are conditional and valid Liquid.
- Single, multi, unavailable and invalid option combinations have deterministic, non-stale output.
- The selected form `id`, URL, price, compare-at, unit price, SKU, availability, add state and variant media are one committed state.
- Native product form POST and direct `?variant=` URL work with JavaScript disabled.
- Selling-plan/quantity-rule/volume-price data have an explicit safe rendering or omission path before their controls are added.
- Keyboard selection, 320/375/desktop, reduced motion, Theme Editor load/unload, validator, Theme Check and `git diff --check` pass before the Phase 5 gate is updated.
