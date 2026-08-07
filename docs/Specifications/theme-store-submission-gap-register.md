# Theme Store submission gap register

Status: **ACTIVE — 2026-08-07**

This register converts the current code audit into release-gated work. It is not a substitute for Shopify's requirements or test checklist. Shopify documentation remains authoritative and must be rechecked before beta and submission.

## Baseline

- Static audit date: 2026-08-07.
- Baseline validation: `node scripts/validate-theme.mjs` passed (141 files, 191 storefront keys, 495 schema keys); `shopify theme check --path theme --fail-level error --no-color` passed (86 files, zero offenses); `git diff --check` passed.
- Static validation does not prove Theme Editor behavior, store configuration, visual quality, browser compatibility, performance, or any flow that requires real Shopify data.
- Sources: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), [theme test checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist), and [submission process](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme), reviewed 2026-08-07.

## P0 — implementation gaps

| ID | Gap | Current evidence | Required completion / acceptance |
|---|---|---|---|
| GAP-01 | Dynamic accelerated checkout on PDP | `cart.liquid` has `content_for_additional_checkout_buttons`; `blocks/product-form.liquid` has no native payment button. | Product and Cart render native accelerated checkout when the store/provider permits it; branded button styling is untouched; unavailable-provider state remains valid; test standard and accelerated handoff. |
| GAP-02 | Faceted filtering on Search | `sections/search.liquid` has standard and predictive search but no `search.filters` UI or Search filtering controller. | Search supports Shopify facets for availability, price, product type, vendor and variant options, with GET/no-JS fallback, URL/history, pagination, rapid interaction and empty/error coverage. |
| GAP-03 | Pickup availability on PDP | No pickup availability implementation found. | Native Shopify pickup availability updates with the selected variant and has the correct unavailable/no-pickup fallback. |
| GAP-04 | Shop Pay Installments on PDP | No `payment_terms` implementation found. | Render Shopify-native payment terms for the selected variant when eligible; verify provider-absent and variant-change states. |
| GAP-05 | Follow on Shop | No `login_button` Follow on Shop implementation found. | Render the Shopify-native Follow on Shop button without modifying its branded colors; test eligible and unavailable states. |
| GAP-06 | Three-level navigation | Header renders top-level links and children only. | Desktop and mobile support one-, two-, and three-level menus; long labels, keyboard traversal, Escape, focus restoration and no-JS navigation pass. |
| GAP-07 | Custom Liquid insertion surfaces | No `liquid` setting or Custom Liquid section/block found. | Add a Custom Liquid section available on every section-enabled template and Custom Liquid blocks at app insertion surfaces; rendering is scoped, locale-backed and documented. |
| GAP-08 | Featured product with app blocks | No featured-product section exists. | A merchant-selectable Featured product section supports product media, product form behavior, all required data fallbacks, rich media, `@app`, and Custom Liquid insertion. |
| GAP-09 | Gift Card QR code | Gift card template renders balance/code/pass URL but no QR identifier/image. | Active card renders Shopify-native QR code at least 120 x 120 px; active, disabled, expired, expiry, logo fallback, Apple Wallet and print/copy behavior are verified. |
| GAP-10 | Tax-inclusive cart notice | Cart has a configurable checkout note but does not use `cart.taxes_included`. | Cart page visibly distinguishes tax-inclusive pricing when `cart.taxes_included` is true, without replacing native tax/checkout behavior. |

## P0 — evidence and release gaps

| ID | Gap | Required completion / acceptance |
|---|---|---|
| EVD-01 | Secondary-template Phase 8 evidence | Page, Contact, FAQ, Blog, Article, List collections, Search, 404, Password and Gift Card pass with real/empty data, missing media, long copy, 320/375/768/1024/desktop, keyboard, 200% zoom, reduced motion and relevant Theme Editor lifecycle. |
| EVD-02 | Product/cart fixture matrix | A development store contains variants, variant media, tracked inventory, discounts, unit pricing, selling plan, pickup availability, Shop Pay eligibility, rich media and an accelerated checkout provider where supported. Every P0 commerce row has a recorded result. |
| EVD-03 | Accessibility/performance | Shopify benchmark-data Lighthouse measurements for Home, Product and Collection on desktop/mobile meet Shopify minimums; keyboard, focus, contrast, labels/errors, screen-reader core flow and reduced motion have evidence. |
| EVD-04 | Browser/webview matrix | Required current desktop/mobile browsers and supported social webviews are tested with recorded defects/results. |
| EVD-05 | Clean install and Theme Editor | Fresh-store ZIP installation, empty-resource behavior, add/remove/reorder/duplicate/select/load/unload lifecycle and no demo handles/IDs pass. |

## Commercial and packaging gates

| ID | Gap | Required completion / acceptance |
|---|---|---|
| COM-01 | Theme metadata | Replace Skeleton/Shopify name, author, version, support and documentation URLs only after professional name clearance. Metadata names the release candidate, not its baseline. |
| COM-02 | Presets and listings | Ship two parity presets. One preset takes the theme name; listing templates match each demo store and are included under `/listings/` in the submission ZIP. |
| COM-03 | Demo stores and assets | Client transfer demo store per preset with real products/copy/images, correct catalog tags, no fake commerce signals and registered redistribution rights. |
| COM-04 | Public docs and support | Public merchant documentation, FAQ, support policy and support contact form include name, email, store URL, theme/version, issue description, attachment route and autoresponder. Support SLA and escalation ownership are defined. |
| COM-05 | Eligibility | Professional trademark clearance, exclusivity decision, provenance review and complete asset/dependency notices are signed off before public listing assets are created. |

## Fixture plan

| Fixture | Purpose | Minimum states |
|---|---|---|
| Product A — commerce matrix | Variant and price behavior | 3+ options, variant image, available/sold out/unavailable combinations, compare-at, unit price, quantity rule and price breaks. |
| Product B — delivery/subscription | Platform-owned PDP integrations | Pickup-enabled and pickup-unavailable variants, selling plan, eligible Shop Pay terms, accelerated checkout where supported. |
| Product C — media | Media and accessibility | Image, hosted video, YouTube/Vimeo external video, 3D model, alt text, missing media. |
| Cart | Price and checkout | Line/cart discounts, tax-inclusive and tax-exclusive stores, note, selling plan, quantity/remove errors, empty cart. |
| Discovery | Search/navigation | Three-level menu, 10+ top-level menu items, long labels, Collection and Search filters, zero and mixed results, pagination. |
| Content | Secondary templates | Empty/long Blog/Article/Page/FAQ, Contact success/error/no-JS, Password states, Gift Card state matrix. |

## Delivery order

1. Close EVD-01 planning and capture the existing Phase 8 preview evidence.
2. Implement GAP-01 through GAP-10 in dependency order: search/navigation and reusable insertion architecture first; PDP platform integrations second; Gift Card/Cart third.
3. Re-run the full fixture plan after each surface changes; record results in QA runbooks and `Roadmap/current-step.md`.
4. Start Phase 9 hardening only when no P0 implementation gap remains.
5. Start commercial packaging only after the hardening gate is demonstrably passing.

## Rules

- Do not mark an item done from a source scan or Theme Check alone.
- Shopify owns payments, pickup availability, installments, Follow on Shop, customer accounts and checkout. JavaScript may enhance presentation but must not reimplement these rules.
- Any new dependency, demo asset or app integration needs provenance/license review before it enters production.
- A scope addition requires a merchant problem, acceptance criteria, performance/accessibility impact and support estimate under `mvp-feature-matrix.md`.
