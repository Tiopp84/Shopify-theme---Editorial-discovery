# Phase 3 global shell contract

Status: **GLOBAL SHELL GATE PASS — 2026-07-20**

## Ownership

- `announcement-bar` owns optional, locale-safe announcement content and link behavior.
- `header` owns logo, desktop navigation, mobile drawer, search/account/cart entry points, and sticky behavior.
- `footer` owns layout, localization controls, payment presentation, and the Theme Block integration point.
- `footer-menu` and `newsletter` are merchant-addable Theme Blocks with independent settings.
- `header-shell.js` owns only native dialog open/close/backdrop/focus restoration behavior.

## Interaction contract

- Desktop navigation remains usable without JavaScript; child menus use native `details`.
- Mobile navigation uses native `dialog`: opening moves focus into the modal, Escape closes it, and closing restores focus to the menu trigger.
- Search, account, cart, menu and close controls have locale-backed accessible names and at least a 44 px target.
- Account remains a direct Shopify route during this slice. A richer popover requires authenticated-origin, CSP, missing-menu and full account-flow tests.
- Footer country/language selectors render only when more than one option exists; newsletter uses Shopify's customer form and exposes success/error status.

## Gate

Automated requirements:

- Theme validation and Theme Check pass with zero offenses.
- JavaScript syntax passes; no remote runtime or debug output.
- Header/footer section groups parse through the repository JSONC validator.
- Development preview returns HTTP 200 without Liquid errors on home, collections, products, cart, and search; announcement/header/footer contracts are present on every checked route.

Manual requirements before closing M2:

- Theme Editor add/remove/reorder/reload and setting persistence.
- Keyboard order, Escape, focus trap/restore, and desktop child-menu behavior.
- True 320/375 px, zoom 200%, reduced motion, and current browser smoke coverage.
- Search, direct account, cart, localization and newsletter flows on the Shopify preview origin without console errors.

Owner confirmation: sticky on/off behavior, 375 px drawer width/backdrop/Escape/focus restoration, footer block lifecycle, newsletter interaction, and console review **PASS — 2026-07-20**. Direct account navigation is the Phase 3 decision; authenticated account/order/address coverage remains a hardening test.
