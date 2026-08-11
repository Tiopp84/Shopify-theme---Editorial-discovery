# Phase 8 — Secondary templates owner review

Status: **READY FOR LIVE REVIEW — 2026-08-09**

This runbook operationalizes `Specifications/secondary-templates-contract.md` and the Phase 8 evidence row in `Specifications/theme-store-submission-gap-register.md`. Run it on a Shopify preview URL; test Theme Editor lifecycle separately. Record **PASS**, **FAIL**, or **NOT EVIDENCED** for every row. A source scan or static check is not evidence of storefront behavior.

## Preconditions

1. Start a development theme from the repository root:

   ```sh
   shopify theme dev --path theme
   ```

2. Keep the preview URL and current theme ID in the owner evidence record; do not publish the development theme.
3. Test each applicable route at 320, 375, 768, 1024 and 1440 CSS px, plus 200% browser zoom, keyboard-only operation and reduced motion.
4. For every failure, save the route, viewport, fixture/state, reproduction steps and screenshot/video. Record unavailable Shopify data as **NOT EVIDENCED**, never PASS.

## Fixture inventory

| Fixture | Required setup |
|---|---|
| Ordinary Page | Long title, long rich text, headings, list, link and no banner image; a second page uses an intentional image-backed hero. |
| Contact Page | Assign `page.contact`; submit a valid form and an invalid form; retain one no-JavaScript browser profile. |
| FAQ Page | Assign `page.faq`; prepare empty, two-block and long-answer states. |
| Blog / Article | One empty blog, one multi-article blog, one long article; include author, date, tags, image and missing-image examples where the catalogue permits. |
| Collections / Search | Empty and populated collection; mixed Product/Collection/Page/Article search results, no-result query and pagination-capable query. |
| Password | Storefront password enabled; test with and without store message, valid and invalid password submission. |
| Gift Card | Active, disabled, expired and expiry-dated cards; logo configured and removed; Apple Wallet capable card if Shopify makes it available. |

## Preview routing smoke — 2026-08-09

The configured development preview returned HTTP 200 for `/`, `/products/missing-media`, `/products/long-title-product-to-see-the-effect-of-long-title-on-product-card-ui-everything-only-use-for-testing`, `/collections/all`, `/search?q=shirt` and `/password`; an intentionally invalid route returned HTTP 404. This confirms server-side route rendering only. It is **not** visual, keyboard, no-JavaScript, Theme Editor or feature acceptance evidence.

The preview also returned server-rendered HTML without `Liquid error`, `translation missing` or `internal server error` markers for `/pages/contact`, `/pages/faq`, `/pages/about`, `/pages/size-guide`, `/blogs/news` and `/blogs/news/summer-layering-guide`. Contact and FAQ markup were present on their intended Page routes. This does not prove that the correct alternate template is selected in the Theme Editor, nor that a form/disclosure interaction works.

Available public product fixtures discovered from the preview:

- `missing-media` — three variants, no product images.
- `long-title-product-to-see-the-effect-of-long-title-on-product-card-ui-everything-only-use-for-testing` — two variants, no product images.
- `sold-out-product` — nine variants, no product images.
- `weekend-wool-topcoat`, `vintage-taper-jeans`, `vintage-straight-jeans`, `resort-stripe-shirt`, `sky-stripe-camp-shirt`, `relaxed-pocket-shirt`, `refined-layering-coat`, `indigo-relaxed-jeans` and `modern-camel-car-coat` — media-bearing products available for baseline PDP checks.

Available public collections include `all`, `best-sellers`, `denim`, `everyday-essentials`, `new-arrivals`, `outerwear`, `shirts` and `test-collection`. Product media, selling plan, pickup, Shop Pay, accelerated checkout and Gift Card fixture eligibility still require store-admin verification.

## A. Page, Contact and FAQ

### Ordinary Page

- Default Page has one meaningful `page.title` and Shopify-authored `page.content`, without an empty fixed-height banner.
- Long localized title/content, lists and headings stay inside the reading column with no overflow or heading-order regression.
- Image-backed Above, Overlay and Split Page treatments still work when intentionally selected; missing image remains legible.
- Breadcrumbs, footer transition and Page canvas have no accidental blank or mismatched-color band.

### Contact

- `page.contact` renders the native Shopify contact form with labels, required email/message fields, valid form POST, server-rendered success and server-rendered error.
- With JavaScript disabled, submit remains valid; no enhanced behavior is required for recovery.
- At desktop the optional sticky intro does not cover or trap fields; compact/tablet return to ordinary document flow.
- Add/remove/save/reload in Theme Editor works where the section picker exposes the section; `limit: 1` is respected.

### FAQ

- `page.faq` renders native `details`/`summary` disclosure with two or more long blocks; keyboard opens and closes each item.
- Empty FAQ remains intentional and does not expose broken layout, hidden controls or demo copy.
- Add, reorder, duplicate, delete, save and reload blocks in Theme Editor; confirm no state/listener accumulation.

## B. Blog, Article, Collections and Search

### Blog and Article

- Blog has real and empty results, pagination, optional media, long title/excerpt and metadata combinations without broken cards.
- Article supports long reading content, missing image/author, related-story omission, comments when enabled and direct pagination/navigation where applicable.
- All links are keyboard reachable and focus visible; no card/image is the only source of essential text.

### List collections

- Real and empty collection index render with full, untruncated collection titles.
- Collection image uses the expected Shopify fallback path; missing image does not create a collapsed/unlabelled card.
- Pagination or deliberate lazy loading works for a large collection inventory.

### Search

- Standard GET search, direct result URL, no-JavaScript fallback, mixed resources, product-only, text-only, no result and pagination work.
- Predictive search loading, empty, error and missing-image states never block normal search navigation.
- Record Search facets as **NOT EVIDENCED / GAP-02** until their required Shopify filtering surface is implemented; do not treat current search results as compliant filtering.

## C. 404, Password and Gift Card

### 404

- Invalid route has localized recovery copy and a working recovery action at every viewport.
- Long translated copy does not obscure the action or create horizontal overflow.

### Password

- Password page works with and without store message; labels, focus, native invalid-password error and normal submission work without JavaScript.
- No design treatment leaks main storefront header/footer assumptions into the password route.

### Gift Card

- Active card renders balance, code, image/logo fallback and expiry correctly.
- Disabled and expired cards communicate state without relying on color alone.
- Apple Wallet works when `gift_card.pass_url` exists.
- Record QR code as **NOT EVIDENCED / GAP-09** until native QR rendering at 120 x 120 CSS px minimum exists.
- If print/copy is added later, verify keyboard access, focus return and no JavaScript failure path.

## D. Shared quality checks

- Verify initial render and post-interaction / DOM replacement state; inspect console for new errors.
- Verify skip link, landmarks, visible focus, dialog Escape/backdrop/focus return, 200% zoom and `prefers-reduced-motion`.
- Use a long route and a missing resource on compact, tablet and desktop; there must be no horizontal overflow, clipped action or inaccessible content.
- In Theme Editor, test section load/unload/reload after add/remove/reorder/duplicate/select where that route is editable.

## Exit record

| Surface | Fixture / URL | Viewports | Result | Evidence / limitation |
|---|---|---|---|---|
| Page | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | Preview run pending |
| Contact | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | Preview run pending |
| FAQ | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | Preview run pending |
| Blog / Article | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | Preview run pending |
| Collections / Search | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | GAP-02 remains open |
| 404 / Password | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | Preview run pending |
| Gift Card | TBD | 320/375/768/1024/1440 | NOT EVIDENCED | GAP-09 remains open |

Phase 8 cannot close while a required implementation gap is open or a relevant row lacks recorded live evidence.
