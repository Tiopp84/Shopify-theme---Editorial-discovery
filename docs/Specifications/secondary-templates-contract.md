# Phase 8 secondary templates contract

Status: **IN PROGRESS — 2026-07-31**

Phase 8 completes the non-core storefront routes without weakening Shopify-native ownership. Every template must render a meaningful real-data and empty-data state; JavaScript is optional enhancement, never a prerequisite for navigation, forms or recovery.

## Shared rules

- Keep each template section-scoped with explicit `enabled_on`; do not create a generic content builder to solve unrelated routes.
- Use storefront and schema translation keys, semantic landmarks, visible focus and the three responsive ranges in `foundation-architecture.md`.
- A customer/account flow belongs to Shopify. Do not recreate authentication, account state, gift-card balance, search queries or form validation in client JavaScript.
- Test missing media, long localized copy, keyboard, 200% zoom, reduced motion and Theme Editor add/remove/reload where the route has editable sections.

## Inventory and acceptance

| Surface | Current implementation | Phase 8 acceptance | Status |
|---|---|---|---|
| Blog | `sections/blog.liquid`; editorial/compact card density, optional media and metadata | Real and empty blog; pagination; missing image; long title/excerpt; all metadata combinations; Theme Editor reload | Existing slice; review required |
| Article | `sections/article.liquid` plus `related-stories`; reading context, optional media and author profile | Real and empty/short article; comments when enabled; missing image/author; related-story omission; long content; Theme Editor lifecycle | Existing slice; review required |
| Page / contact / FAQ | `sections/page.liquid` is an editorial reading composition; `contact-form` and `faq` are explicit Page-template sections, with `page.contact` and `page.faq` alternate templates | Page content remains Shopify-authored; contact uses the native form with server-rendered success/errors; FAQ uses native disclosure controls | Static slice complete; preview required |
| List collections | `sections/collections.liquid`; editorial collection links | Real and empty collection index; missing image; long title; 320–desktop; keyboard link treatment | Existing slice; review required |
| Search | `sections/search.liquid` and predictive-search enhancement | Initial, no-result and mixed object result states; pagination; blocked JS fallback; missing image; keyboard and responsive result grid | Existing slice; review required |
| 404 | Minimal `sections/404.liquid` | Clear recovery action, localized copy, no broken layout with long text; keyboard and 320–desktop | Needs vertical slice |
| Password | Minimal `sections/password.liquid` using native `storefront_password` form | Store message present/absent; native validation/error; label, focus and password submission without JS | Needs vertical slice |
| Gift card | `templates/gift_card.liquid` with Shopify-native balance/code/pass URL | Active, disabled, expired and expiry states; logo fallback; Apple Wallet URL when available; print/copy only if Shopify-native and accessible | Needs review/vertical slice |
| Customer | No customer templates currently exist | Decide the supported Shopify customer-account model before adding routes; every required native route needs a real-data/empty/error acceptance record | Discovery required; do not add speculative templates |

## Page/contact/FAQ vertical-slice boundary

1. `page.liquid` owns only the base page heading and rich-text reading composition.
2. Contact is a distinct Page-template section using Shopify's native `contact` form, with server-rendered success/errors, labels and no-JS submission.
3. FAQ is a distinct Page-template section with merchant-owned question/answer blocks, semantic disclosure controls and keyboard-safe native fallback.
4. Neither section may appear on product, collection, article or shell surfaces; both require explicit allowlists and locale-backed schema labels.
5. Before code, record the form/error/render boundary and Theme Editor lifecycle plan under `interaction-architecture-standard.md`.

## Phase 8 gate

- Required secondary templates render with real and empty data.
- Native Shopify forms and URLs remain functional without JavaScript.
- Each changed route passes 320, 375, 768, 1024 and desktop checks, keyboard, zoom, reduced motion and relevant Theme Editor lifecycle checks.
- Validator, Theme Check and `git diff --check` pass; evidence is recorded in `Roadmap/current-step.md`.

## Static implementation evidence — 2026-07-31

- `page.liquid` now renders one semantic heading and an optional bounded rich-text reading column, without inventing page content or a runtime controller.
- `contact-form.liquid` uses Shopify's native `contact` form, native success/error responses, labelled fields and normal POST submission. It is scoped to the Page template and is instantiated only by `page.contact.json`.
- `faq.liquid` uses server-rendered merchant question/answer blocks and native `details`/`summary`, and is instantiated only by `page.faq.json`.
- Repository validator passes with 102 files, 157 storefront keys and 232 schema keys; Theme Check inspects 73 files with zero offenses; `git diff --check` passes.
