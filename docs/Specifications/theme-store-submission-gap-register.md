# Theme Store submission gap register

Status: **IMPLEMENTATION COMPLETE / LIVE EVIDENCE DEFERRED — 2026-08-11**

This register converts the current code audit into release-gated work. It is not a substitute for Shopify's requirements or test checklist. Shopify documentation remains authoritative and must be rechecked before beta and submission.

## Baseline

- Static audit date: 2026-08-07.
- Baseline validation: `node scripts/validate-theme.mjs` passed (141 files, 191 storefront keys, 495 schema keys); `shopify theme check --path theme --fail-level error --no-color` passed (86 files, zero offenses); `git diff --check` passed.
- Static validation does not prove Theme Editor behavior, store configuration, visual quality, browser compatibility, performance, or any flow that requires real Shopify data.
- Sources: [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements), [theme test checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist), and [submission process](https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme), reviewed 2026-08-07.

## 2026-08-11 — implementation QA decision

- The owner confirms the implemented GAP surfaces are functionally acceptable for the current development-store fixtures.
- Full local static QA passed against the working tree: repository validator (151 files, 206 storefront keys, 523 schema keys), Theme Check (95 files, zero offenses), JavaScript syntax checks for every `theme/assets/*.js` asset, and `git diff --check`.
- A development store cannot supply the legitimate provider/account/data states required for accelerated checkout, Shop Pay Installments, Follow on Shop eligibility, complete pickup data, Apple Wallet, the Gift Card expiry matrix, benchmark fixtures, fresh-install testing, or the browser/webview matrix. These rows are therefore **LIVE EVIDENCE DEFERRED**, not passed and not a submission gate closure.
- Treat GAP-01 through GAP-10 as implementation-complete unless a regression is found. Re-run the relevant live rows before a Theme Store submission, on a properly configured client-transfer/demo store.

## 2026-08-11 — EVD static readiness run

| Evidence gate | Static result | Remaining live/release evidence |
|---|---|---|
| EVD-01 Secondary templates | Required JSON/Liquid templates are present: 404, Article, Blog, Cart, Collection, Home, List collections, Page, Contact Page, Password, Product, Search and Gift Card. Existing route smoke remains source-level only. | Real/empty content, responsive, keyboard, zoom, reduced motion and Theme Editor lifecycle on Preview. |
| EVD-02 Product/cart fixture matrix | Theme-side product, cart, pickup, payment terms and Gift Card surfaces pass static QA. | Qualified Shopify data for provider-owned and inventory/fulfilment states. |
| EVD-03 Accessibility/performance | Validator, Theme Check and all asset JavaScript syntax checks pass. Hosted Development Theme Lighthouse QA is closed for Mobile Home, PDP, Cart, Collection grid and List collections (Performance 70–82; Accessibility 92–100; SEO 85–100; CLS 0), with Desktop smoke accepted by owner. | Manual screen-reader, reduced-motion and browser/device evidence; provider-owned pages and a qualified final benchmark store remain required for release. |
| EVD-04 Browser/webview matrix | No static substitute exists. | Current Safari, Chrome, Firefox, Edge, mobile browsers and social webviews. |
| EVD-05 Clean install/Theme Editor | `shopify theme package` produced a valid 149-file archive (1,038,712 bytes); archive scan found no `markets.json`, `.git`, `.env`, `node_modules` or `shopify.theme.toml`. | Fresh-store install and lifecycle. Package currently uses inherited `Skeleton-0.1.0` metadata and has no `/listings/`; it is deliberately not a submission package. |

## P0 — implementation gaps

| ID | Gap | Current evidence | Required completion / acceptance |
|---|---|---|---|
| GAP-01 | Dynamic accelerated checkout on PDP | `cart.liquid` has `content_for_additional_checkout_buttons`; `blocks/product-form.liquid` has no native payment button. | Product and Cart render native accelerated checkout when the store/provider permits it; branded button styling is untouched; unavailable-provider state remains valid; test standard and accelerated handoff. |
| GAP-02 | Faceted filtering on Search | `sections/search.liquid` has standard and predictive search but no `search.filters` UI or Search filtering controller. | Search supports Shopify facets for availability, price, product type, vendor and variant options, with GET/no-JS fallback, URL/history, pagination, rapid interaction and empty/error coverage. |
| GAP-03 | Pickup availability on PDP | `product-pickup-availability` is a merchant Product block. It requests Shopify's native variant section renderer and has static verification only. | Native Shopify pickup availability updates with the selected variant and has the correct unavailable/no-pickup fallback; Preview must cover pickup-enabled, pickup-unavailable and no-pickup/sold-out variants. |
| GAP-04 | Shop Pay Installments on PDP | `product-payment-terms` is an addable Product block using native `form | payment_terms`; static verification only. | Render Shopify-native payment terms for the selected variant when eligible; verify provider-absent and variant-change states. |
| GAP-05 | Follow on Shop | No `login_button` Follow on Shop implementation found. | Render the Shopify-native Follow on Shop button without modifying its branded colors; test eligible and unavailable states. |
| GAP-06 | Three-level navigation | Header renders top-level links and children only. | Desktop and mobile support one-, two-, and three-level menus; long labels, keyboard traversal, Escape, focus restoration and no-JS navigation pass. |
| GAP-07 | Custom Liquid insertion surfaces | No `liquid` setting or Custom Liquid section/block found. | Add a Custom Liquid section available on every section-enabled template and Custom Liquid blocks at app insertion surfaces; rendering is scoped, locale-backed and documented. |
| GAP-08 | Featured product with app blocks | `sections/featured-product.liquid` now provides native Product blocks, `@app`, Custom Liquid, responsive media, variant-aware form and merchant layout controls; static verification passes. | A merchant-selectable Featured product section supports product media, product form behavior, all required data fallbacks, rich media, `@app`, and Custom Liquid insertion; real Product/Theme Editor evidence is still required. |
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
| COM-01 | Theme metadata | Theme Editor metadata names `Narrivelle`, author `AmazinPro` and version `1.0.0`. Replace inherited Shopify documentation and support URLs only with owner-provided public Narrivelle destinations after professional name clearance; metadata must name the release candidate, not its baseline. |
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

## Progress log

### 2026-08-09 — GAP-01 static implementation

- Added the native `form | payment_button` filter within the PDP product form.
- Added the Product form block setting `Show dynamic checkout button`, default on; disabling it omits the native payment-button surface.
- Preserved Shopify ownership by leaving payment-button submissions outside the Product Form inventory-preflight and Cart Drawer AJAX interception; normal Add to cart behavior is unchanged.
- JavaScript syntax, repository validator, Theme Check and `git diff --check` pass. Development preview HTML for `products/weekend-wool-topcoat` contains both `data-shopify="payment-button"` and `shopify-accelerated-checkout`.
- GAP-01 remains open until an eligible accelerated provider, keyboard behavior and real native handoff are evidenced in Shopify Preview.

### 2026-08-10 — GAP-02 implementation contract

- Search facets use Shopify's native `search.filters`, `search.sort_options` and GET URL parameters. The Search URL remains source of truth; every form and link remains a direct GET/no-JavaScript fallback.
- `search-discovery` is its own Section Rendering controller rather than a reuse of Collection's controller. It owns filter/sort/pagination events, abort/sequence protection, loading/error announcements, history, drawer group/focus continuity and atomic replacement of the complete Search response boundary.
- The facet form preserves `q`; Shopify supplies all filter/remove URLs. This keeps filter combinations, sorting, pagination and browser history in the URL without theme-side URL composition.
- Search settings default filters and sorting on and expose the same desktop Sidebar/Drawer choice as Collection. Controls are rendered only when the current result set contains products; the native no-JavaScript fallback remains available even when Drawer is selected. Shopify may return no filters before filters are configured in Admin, when none are relevant, or for searches over its documented result limit.

### 2026-08-10 — GAP-08 static implementation

- Added a Featured product section for index, collection, page, blog and article templates. It uses the Product section's native blocks and variant state, including `@app`, Custom Liquid, vendor/title/price/SKU/availability/product-form/description, collapsible and reassurance blocks.
- Product media supports desktop Left/Right placement, a 35–60% media-column slider that includes thumbnails, side/bottom thumbnails, mobile swipe plus selected-state dots, original media proportions and desktop sticky positioning with an announcement-safe top offset. Images intentionally do not expose a Featured zoom modal; video uses native controls and a play cursor only.
- Static validation passes at 145 files, 192 storefront keys and 512 schema keys; Theme Check inspects 89 files with zero offenses. GAP-08 remains open until Product fixture media/variants, all merchant settings, app-block lifecycle, long content and compact/tablet/desktop behavior are evidenced in Shopify Preview/Theme Editor.

### 2026-08-10 — GAP-03 static implementation

- Added `product-pickup-availability` as an addable, removable and reorderable Product block. Its `pickup-availability` section renderer has a Product-template schema so Shopify can resolve the native `section_id` request; the host remains empty until Shopify returns pickup data, so no-pickup and sold-out variants leave no visual gap.
- Shopify owns pickup locations, availability, transfer-aware pickup time and addresses. The host requests `/variants/<id>/?section_id=pickup-availability`; the renderer uses `product_variant.store_availabilities` and never infers inventory, locations or ETA. A native Liquid no-JavaScript summary is available for the initially selected direct-variant URL when pickup locations exist.
- `product:variant-change` now carries the committed variant object. The pickup controller aborts its old request, uses a sequence guard before atomic replacement, preserves `preview_theme_id` so Section Rendering uses the active development preview, and clears both initial and subsequently selected sold-out variants. A purchasable `Continue selling when out of stock` variant renders the exact Shopify-returned pickup state (including pickup-available when Shopify permits it); the theme never infers pickup state from quantity. It preserves the PDP URL/state owner and is cleaned up on section unload. Its native dialog uses the shared `data-overlay-motion="modal"` controller for existing open/close/backdrop motion, scroll lock, reduced-motion fallback, Close/Escape/backdrop-close and opener focus restoration.
- Compact pickup dialog layout uses a two-column header so Close remains top-aligned, a bounded dialog width, and compact heading tokens; tablet/desktop retain the editorial dialog scale.
- Static checks pass: validator 147 files, 201 storefront keys and 513 schema keys; JavaScript syntax, Theme Check (91 files, zero offenses) and `git diff --check`. GAP-03 remains open pending Shopify Preview: a pickup-enabled variant, purchasable pickup-unavailable variant, no-pickup/sold-out variant, rapid variant changes, dialog keyboard/focus, 320/375/tablet/desktop, no-JavaScript direct variant URL, and Product block add/remove/reorder/save/reload lifecycle.

### 2026-08-10 — GAP-04 static implementation

- Added `product-payment-terms` as an addable, removable and reorderable Product block. It uses its own native Shopify product form with a hidden `id` and `form | payment_terms`, so Shopify owns eligibility, installment amount, disclosures and branded Learn more UI. No payment-terms markup, colours or disclosures are recreated by the theme.
- The stable `product-form` controller updates that hidden `id` when a variant is committed, including `change` notification for Shopify's native banner update. The block safely collapses if Shopify outputs no payment-terms component, preserving the provider-absent state without a visual gap.
- Static checks pass: validator 148 files, 201 storefront keys and 514 schema keys; JavaScript syntax, Theme Check (92 files, zero offenses) and `git diff --check`. GAP-04 remains open until Shopify Preview with an eligible US Shop Pay Installments provider proves initial render, variant amount update, Learn more/disclosures, ineligible/absent provider, keyboard, Compact/Tablet/Desktop and Theme Editor lifecycle.

### 2026-08-10 — GAP-05 static implementation

- Added the Footer setting `Show Follow on Shop button`, enabled by default. It renders Shopify's native `{{ shop | login_button: action: 'follow' }}` filter and remains available even when social links are disabled. The theme does not alter the button's branded colours, authentication flow or follow state.
- GAP-05 remains open until Shopify Preview proves eligible and unavailable states, keyboard behavior, Compact/Tablet/Desktop layout, and Footer setting toggle/save/reload lifecycle.

### 2026-08-10 — GAP-09 static implementation

- The standalone Gift Card template now loads Shopify's `vendor/qrcode.js` asset and, only for an active non-expired card with `gift_card.qr_identifier`, generates a 128 × 128 px QR code from that identifier. It does not expose the redeemable QR for disabled or expired cards.
- The existing server-rendered balance, disabled/expired status, expiry, logo/card fallback, formatted code and Apple Wallet pass remain unchanged; disabled and expired now use distinct locale-backed status copy. QR has a localized visible label and accessible name; the visible code remains the non-JavaScript redemption fallback.
- GAP-09 remains open until a real issued-card URL proves active/disabled/expired/expiry, logo fallback, Apple Wallet, print/copy behavior, keyboard/zoom/reduced-motion and 320/375/tablet/desktop states.
- Merchant Shopify Preview evidence, 2026-08-10: an active card rendered its 128 px QR alongside an expiry date and a selectable/copyable code; a manually deactivated card rendered no QR. Apple Wallet, an actually expired card, compact/tablet layout, keyboard/zoom and reduced-motion remain unverified.

### 2026-08-10 — GAP-10 static implementation

- The Cart summary now renders the locale-backed `Taxes included` notice only when Shopify returns `cart.taxes_included`. It is adjacent to the cart total and makes no tax calculation, price mutation or checkout change.
- Merchant Shopify Preview evidence, 2026-08-10: enabling tax-inclusive pricing rendered the notice; disabling it hid the notice. GAP-10 is complete for its required native Cart state. Quantity-update and responsive regression coverage remain part of the broader cart QA matrix.

## Rules

- Do not mark an item done from a source scan or Theme Check alone.
- Shopify owns payments, pickup availability, installments, Follow on Shop, customer accounts and checkout. JavaScript may enhance presentation but must not reimplement these rules.
- Any new dependency, demo asset or app integration needs provenance/license review before it enters production.
- A scope addition requires a merchant problem, acceptance criteria, performance/accessibility impact and support estimate under `mvp-feature-matrix.md`.
