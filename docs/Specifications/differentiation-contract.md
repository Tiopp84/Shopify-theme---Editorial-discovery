# Phase 7 differentiation contract

Status: **STATIC VERTICAL SLICES IMPLEMENTED — 2026-07-27**

Visual direction for these slices is governed by `visual-design-tokens.md`. The approved desktop and mobile Stitch homepage exports drive the shared-token and layout remediation; final visual acceptance still requires Shopify preview evidence.

Phase 7 turns Narrivelle's approved product direction into three reusable, merchant-safe storefront experiences. It does not add a generic page builder, fabricate bundle pricing, or change Shopify product, inventory, cart, or checkout ownership.

## Scope and non-goals

| Capability | Phase 7 decision | Product outcome |
|---|---|---|
| Editorial hero | `editorial-hero` section | A campaign thesis with a clear collection, page, or product destination. |
| Shoppable story | `shoppable-story` section with ordered story-product blocks | A shopper reaches an actual product or an unambiguous product decision in two mobile interactions or fewer. |
| Outfit composition | `outfit-composition` section with independent outfit-item blocks | A merchant can compose a multi-product look without implying a bundle, discount, or shared availability. |

Collection story insertion is not part of the Collection product grid. Video/material/fit story is deferred until the three required experiences pass their gate. Recently viewed, fake urgency, product bundles, automatic discounts, app/API-dependent personalization, and remote motion runtimes remain out of scope.

## Shared architecture

- Each experience is a self-contained OS 2.0 section with a scoped root, explicit settings and explicit block allowlist. They do not use generic `@theme`; `@app` appears only if a documented integration point is genuinely needed.
- The server-rendered Liquid result is the complete no-JavaScript experience. Images use the shared `image` snippet; product price and sale semantics use the shared `price` snippet; all customer-facing copy and schema labels use locale keys.
- Sections own editorial layout and merchant configuration. Shopify owns products, variant availability, prices, inventory, discounts, cart mutations and checkout. `CartStore`, `product-form`, and product recommendation controllers are not duplicated in Phase 7.
- A product destination always uses Shopify's canonical product URL. A direct add is permitted only for exactly one available variant through the established variant-safe quick-add contract; all multi-variant products route to their PDP and never silently add a default variant.
- Missing images, product references, links and optional copy omit or degrade cleanly. A missing resource may not leave a blank oversized frame, a dead CTA, or a fabricated product state.
- No section adds URL/history state, fetches a catalog client-side, or requires animation to reveal content. If an approved enhancement is introduced later, it must follow `interaction-architecture-standard.md` and `motion-architecture.md`, including idempotent Theme Editor init/destroy.

## 1. Editorial hero

### Ownership and data

`editorial-hero` owns its image/media art direction, eyebrow, heading, body, layout emphasis and one optional primary CTA. The CTA accepts one Shopify resource destination or no destination; an image never becomes the only route to shop. The section renders without a selected image, using its text content and a non-decorative layout rather than a fake placeholder image.

### Interaction and accessibility

- Heading is the first meaningful content heading for the section; the CTA is an ordinary link when present.
- The image is decorative only when the text fully communicates the destination; otherwise it receives merchant-provided alt text through Shopify media data.
- Desktop and mobile are deliberate compositions, not a cropped desktop hero. At 320 px the CTA remains visible without horizontal overflow, and long localized headings wrap without covering it.
- Motion, if later approved, is decorative and renders its final readable state immediately with reduced motion enabled.

### Merchant settings

Required settings: heading, body, image, image focal treatment, desktop/mobile height policy, eyebrow, CTA label and CTA link. Defaults must look complete with text only. Only one primary CTA is allowed; secondary actions belong in later editorial modules when there is a distinct customer decision.

## 2. Shoppable story

### Ownership and data

`shoppable-story` owns a story introduction and an ordered list of `story-product` blocks. Each block owns its ordinal display, optional editorial image/caption and one Shopify product reference. The linked product remains the source for its title, price and availability. A block with no product reference is omitted from shopper output and remains visible as a clear incomplete setting in the Theme Editor.

### Product decision contract

| Product state | Required outcome |
|---|---|
| Single available variant | Render a clear product destination; a future quick-add may use the shared safe path. |
| Multiple variants | Render `Choose options`/product destination; never auto-add a selected-or-first variant. |
| Sold out | Render Shopify-derived sold-out state and product destination; no add action. |
| Missing image | Preserve the block's reading order and destination without a broken image. |
| Missing product | Omit the block; do not render stale title, price or availability. |

The ordered semantic list is the reading order. Visual numbering must not cause screen-reader duplication. On mobile, a shopper reaches the linked PDP in at most two interactions from the section entry point.

## 3. Outfit composition

### Ownership and data

`outfit-composition` owns one look image/introduction and independently rendered `outfit-item` blocks. Every block has its own product reference, product destination and Shopify-rendered price/availability. The section never calculates a combined total, posts multiple products, changes cart state as a group, labels the composition a bundle, or promises a discount.

### Interaction and continuity

- A shopper may open each item independently; an unavailable item never disables, hides, or changes another item.
- The default experience is ordinary links and disclosed item cards. Any optional hotspot enhancement must have an equivalent visible keyboard/touch control, an accessible name, Escape/focus restoration when it uses a dialog, and the same product destination without JavaScript.
- No section-local state survives by pretending to own variant selection. The PDP owns variants; the cart owns cart state.
- The composition image is optional. Without it, the item list and its heading remain usable and visually intentional.

## Theme Editor and lifecycle

All three sections require a preset, explicit locale-backed schema copy and a safe default. Test add, remove, reorder, duplicate, save/reload and rapid setting changes. A section may not duplicate listeners, IDs, dialogs, media observers or product controls after `shopify:section:load`/`unload`.

## Phase 7 acceptance gate

- Three experiences above render on the intended templates and are recognizably one Narrivelle system across both presets.
- Hero, story and outfit all pass text-only/missing-image, long-copy, missing-product, available, sold-out and multi-variant-recovery cases as applicable.
- Mobile 320/375, desktop, keyboard, visible focus, zoom 200%, reduced motion and Theme Editor lifecycle pass.
- Story/outfit product paths preserve Shopify product price, availability and variant ownership; no fake bundle/discount or silent default-variant add exists.
- All changed theme files pass JavaScript syntax, repository validator, Theme Check and `git diff --check`; live preview evidence is recorded before the Phase 7 gate is updated.

## Static implementation evidence — 2026-07-27

- `editorial-hero`, `shoppable-story`, and `outfit-composition` have explicit schemas, presets and locale-backed schema labels. The home template starts with `editorial-hero`; story and outfit remain merchant-addable through their presets so the baseline home does not fabricate product fixtures.
- `editorial-hero` supports responsive media and a text-only layout. `shoppable-story` and `outfit-composition` use ordinary product destinations and Shopify-derived product data; neither creates an add, bundle, combined price, or client-side product state.
- Repository validator: **81 files, 134 storefront keys, 125 schema keys**. Theme Check: **62 files, zero offenses**.
- Shopify preview, true 320/375/desktop, long-copy/missing-resource/product-state cases, and Theme Editor lifecycle are still pending and must be recorded before Phase 7 can close.

## Homepage composition remediation — 2026-07-27

- Implemented the approved reference inside the Phase 7 homepage boundaries: mineral-neutral panel tokens, campaign-only serif headings, divider-led story cards, and compact product presentation. Existing global header, PDP, collection, cart and product-card visual systems remain outside this visual migration.
- `editorial-hero` now uses a full-bleed desktop image with a readable tonal overlay and becomes a bottom editorial overlay on mobile. `shoppable-story` uses a desktop lead plus boxed product cards and becomes a compact image/product decision list on mobile. `outfit-composition` uses a dark lead band and responsive product grid, retaining independent Shopify product links at every breakpoint.
- The exact export paths are local references only; no remote fonts, Tailwind runtime, Material icon runtime, fake product data, or unsafe multi-variant add action was copied into the theme.
- Static gate: repository validator **81 files, 134 storefront keys, 125 schema keys**; Theme Check **62 files, zero offenses**; `git diff --check` passes. Shopify preview evidence remains required.
