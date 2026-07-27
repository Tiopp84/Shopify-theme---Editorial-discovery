# Phase 5 — PDP owner review

Status: **READY FOR LIVE REVIEW — 2026-07-24**

Use a Shopify preview URL, not the Theme Editor iframe, for browser behavior. Test the Theme Editor lifecycle separately in the final section. The product and form behavior under review is defined by [`product-detail-contract.md`](../Specifications/product-detail-contract.md).

## 1. Prepare the smallest useful fixture set

| Fixture | Minimum data needed | Covers |
|---|---|---|
| Variant-rich product | At least two options, one available and one sold-out combination; different price/SKU and one variant featured image | URL, picker, price, SKU, availability, unavailable state and gallery synchronization |
| No-media product | No product media; a purchasable variant | Safe omission of gallery without losing purchase flow |
| Media product | One image, one Shopify-hosted video, one external video and one 3D model, if the catalogue has them | Every media conditional path and modal behavior |
| Subscription product | Selling-plan group/allocation, if the store uses subscriptions | Selling-plan control and one-time purchase fallback |
| Recommendations product | Configured Related and/or Complementary products | Full-width section, merchant settings and empty state |

Do not create fake data solely to mark a path pass. If a supported storefront data type is unavailable, record it as **not evidenced**, not pass.

## 2. Baseline and responsive render

For the variant-rich product, test desktop, 375 CSS px and 320 CSS px.

- No horizontal overflow, clipped button, overlapping option controls or inaccessible content.
- Default Product blocks remain visible in order: vendor, title, price, SKU, availability, form and description.
- The product form remains usable when Vendor, SKU, Availability or Quantity settings are hidden.
- Recommendations are below PDP, span the page content width and do not leave the former blank left-side column.
- With reduced-motion enabled in the browser/OS, no media begins automatically and no essential content depends on animation.

## 3. Variant state and direct URLs

Use the variant-rich product.

1. Open the product with no query string. Record the selected variant and verify price, compare-at price, SKU, availability, submit state and featured media agree.
2. Select every available option combination. For each, verify that the hidden form `id`, URL `?variant=`, price, sale state, SKU, stock text and featured media update as one state.
3. Select a sold-out variant. It must remain selected, show the correct unavailable/sold-out state and disable purchase; it must not silently switch to another variant.
4. Create an impossible option tuple where the catalogue permits it. Purchase must stay unavailable with clear feedback; URL and displayed price must not claim a different variant.
5. Paste a known-valid `?variant=<id>` URL into a new tab. It must select that exact variant on first render.
6. Use Back and Forward after several selections. The picker and all variant-dependent fields must match the URL; focus stays on the option control used.

## 4. Quantity and purchase fallback

- Change quantity with minus/plus and direct typing. It cannot drop below the Shopify minimum or exceed a tracked, deny-oversell variant cap.
- Add a quantity above available stock for a tracked, deny-oversell variant. The PDP preflight must read current cart quantity and current Online Store inventory, block the add before `cart/add.js`, leave the cart/header unchanged, keep the drawer closed, and show the availability error directly below the PDP form; PDP must not claim an exact stock count.
- When changing variant, quantity constraints and disabled controls update for that variant only.
- Submit one valid quantity to the cart in the normal browser flow. Shopify remains the final authority; an invalid quantity must not result in a misleading success state.
- If the store has quantity rules, volume pricing or selling plans, verify their server-rendered labels and values match Shopify data. If it has none, verify no empty subscription/volume-pricing UI is present.

## 5. Media and modal

### Image and no-media

- For images, open the gallery/modal, go next/previous where applicable, close with button, Escape and backdrop, then verify focus returns to the opener.
- For a product with no media, no empty gallery frame or thumbnail rail appears; title, options, quantity and Add to cart remain usable.

### Video, external video and 3D

- Video and external video do not autoplay. Their native/provider controls remain reachable.
- Closing the modal stops or resets playback; focus returns to the media opener.
- An external provider failure must not blank the PDP or prevent purchase.
- A 3D model appears only for a product that has one; its viewer controls are usable and it does not affect variant/form state.

## 6. JavaScript-off and failure fallback

In a separate browser profile or with JavaScript disabled:

- Open a direct valid `?variant=` URL. The server-selected variant, price and form `id` must be correct.
- The no-JS `Variant` selector and quantity input must submit a valid Shopify product form. Sold-out variants are disabled in that selector, and a direct URL to a sold-out variant renders a disabled purchase button.
- Size guide remains a normal page link.
- Recommendations may safely be omitted; they must not leave an empty visible shell.

Then re-enable JavaScript and use DevTools Network to block the recommendations request once:

- The section hides cleanly, no console exception appears and the rest of PDP remains interactive.

## 7. Recommendations and Theme Editor lifecycle

On a configured product:

- Verify Related results, then change the section to Complementary if data exists.
- Change heading and limit; test 2 and 8 items where enough recommendations exist.
- Verify a product with no configured results hides the section.
- In Theme Editor, add, reorder, save, reload and remove/re-add the Product recommendations section. It is available only on Product templates.
- Change Product section visibility settings and confirm form actions still work.
- Inspect the console while selecting variants, opening/closing media and after Theme Editor section reload. There must be no error.

## Exit recording

Record each row as **PASS**, **FAIL** or **NOT EVIDENCED**, with the product handle, viewport, URL and a screenshot/video for failures. Do not update Phase 5 to complete until all applicable rows pass and unavailable fixture types are explicitly documented.
