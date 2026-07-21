# Foundation development-store smoke test

Status: **FOUNDATION REVIEW COMPLETE — 2026-07-20**

Development-theme evidence received from owner: 2026-07-20. Store URL and preview/theme IDs are intentionally not committed.

## Recorded result

| Check | Result |
|---|---|
| Home, collection, product, cart, search, blog, page, list-collections | PASS — HTTP 200, non-empty response, no detected Liquid error |
| 404 template | PASS — HTTP 404 with rendered response body |
| Semantic foundation | PASS — `MainContent` target, skip link, heading/accent/type-scale tokens present |
| Desktop clean render | PASS — `foundation-home-1440.png` |
| Typography live refresh, undo/redo, colors, save/reload, cross-template persistence | PASS — owner review, 2026-07-20 |
| Layout settings | PASS — margin pass; owner confirmed visible Narrow/Standard/Wide behavior after 70/90/110rem remediation |
| Skip link | PASS — owner keyboard check |
| Theme Editor lifecycle | PASS — owner review |
| Reduced motion | PASS — owner confirmation; media query returns `true` and manual review complete |
| Keyboard/focus, 375 px, 320 px, zoom 200% | PASS — owner confirmation, 2026-07-20 |
| Console | PASS FOR FOUNDATION — owner retest complete after account fallback remediation |
| Visual layout/scale | NEEDS ITERATION — owner reports layout and scale are not yet stable |

## Remediation after owner review

- Page-width choices are now 70rem (Narrow), 90rem (Standard), and 110rem (Wide), preserving saved values while making Narrow visibly testable at a 1440 px viewport.
- The baseline header now uses `routes.account_url` instead of the Storefront account web component. This removes the missing-menu request and localhost Shop account iframe/pre-auth noise; richer account UI can return during the global-shell phase with an authenticated-origin test.

## Deferred account follow-up — Phase 3

The standard account link is a Foundation fallback, not the final account interaction. During Global shell implementation:

- Decide whether Narrivelle keeps direct account navigation or restores a Shopify account popover.
- If restoring `shopify-account`, provide a clean missing-menu fallback and test Storefront API, CSP, iframe, login, and authenticated states on the Shopify preview origin rather than localhost alone.
- Confirm login, account, order, and address navigation without console errors before declaring the account shell complete.

Owner retest confirmation: **COMPLETE — 2026-07-20**.

## Start preview

From the repository root:

```sh
shopify theme dev --path theme
```

This creates or updates a temporary development theme; it does not publish the live theme.

## Storefront checks

- Home, collection, product, cart, search, 404, blog/article, page, password, and list-collections templates render without Liquid errors.
- “Skip to content” appears on keyboard focus and moves focus to the single `main` landmark.
- Body and heading typography render independently; changing either font setting refreshes without an error.
- Type scale, background, foreground, accent, border, page width, margin, and input radius settings update cleanly.
- Focus remains visible on links, buttons, inputs, selects, and Theme Editor controls.
- With reduced motion enabled at OS/browser level, transitions and animations are effectively removed.
- Empty or missing menu/resource settings do not create Liquid errors or broken layout.

## Theme Editor lifecycle

- Load editor, change each new global setting, undo, redo, and save.
- Navigate among home, collection, product, and cart previews.
- Add/remove/reorder existing sections where supported and confirm no duplicate output or console errors.
- Reload the editor and confirm saved global settings persist.

## Evidence to record

- Storefront preview URL or development theme ID (do not commit credentials or store URL).
- Browser/device and date.
- PASS/FAIL for storefront render, settings refresh, editor lifecycle, keyboard focus, and reduced motion.
- Screenshot only if it contains no private store/customer information.
