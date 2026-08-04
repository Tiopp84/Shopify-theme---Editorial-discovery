# Phase 3 global shell contract

Status: **GLOBAL SHELL GATE PASS — 2026-07-20**

## Ownership

- `announcement-bar` owns optional, locale-safe announcement content and link behavior. It has one canonical, preconfigured instance in the Header group; its schema `limit: 1` prevents duplicates and it has no add-section preset, while Enable announcement controls visibility.
- `header` owns logo, desktop navigation, mobile drawer, search/account/cart entry points, and sticky behavior.
- `footer` owns layout, localization controls, payment presentation, and the Theme Block integration point.
- `footer-menu` and `newsletter` are merchant-addable Theme Blocks with independent settings.
- `header-shell.js` owns native dialog open/close/backdrop/focus restoration and desktop submenu single-open/click-outside/Escape behavior.

## Interaction contract

- Desktop navigation remains usable without JavaScript; child menus use native `details`. Progressive enhancement limits the desktop header to one open submenu, closes it on outside click/Escape and restores summary focus after keyboard dismissal.
- Mobile navigation uses native `dialog`: opening moves focus into the modal, Escape closes it, and closing restores focus to the menu trigger.
- Header search behavior is merchant-selectable: `Search page` preserves direct navigation to `/search`, while `Search drawer` opens a shared predictive-search form and retains an explicit link to the full search page.
- The search drawer uses one native-dialog contract with a right-side panel on desktop and a full-width, bottom-aligned sheet on mobile. It owns backdrop, Escape, initial input focus, opener-focus restoration, reduced-motion behavior, and overflow-safe responsive bounds.
- Drawer search and the `/search` page reuse the same predictive-search form and controller; presentation remains context-specific (`static` results inside the drawer, an anchored dropdown on the full search page).
- Search, account, cart, menu and close controls have locale-backed accessible names and at least a 44 px target.
- Account remains a direct Shopify route during this slice. A richer popover requires authenticated-origin, CSP, missing-menu and full account-flow tests.
- Footer country/language selectors render only when more than one option exists; newsletter uses Shopify's customer form and exposes success/error status.

## Gate

Automated requirements:

- Theme validation and Theme Check pass with zero offenses.
- JavaScript syntax passes; no remote runtime or debug output.
- Header/footer section groups parse through the repository JSONC validator.
- Development preview returns HTTP 200 without Liquid errors on home, collections, products, cart, and search; announcement/header/footer contracts are present on every checked route.
- Search behavior browser coverage verifies the desktop left drawer, mobile bottom sheet, focus restoration, live product suggestions, no horizontal overflow, and unchanged `/search` dropdown behavior.

Manual requirements before closing M2:

- Theme Editor add/remove/reorder/reload and setting persistence.
- Keyboard order, Escape, focus trap/restore, and desktop child-menu behavior.
- True 320/375 px, zoom 200%, reduced motion, and current browser smoke coverage.
- Search, direct account, cart, localization and newsletter flows on the Shopify preview origin without console errors.

Owner confirmation: sticky on/off behavior, 375 px drawer width/backdrop/Escape/focus restoration, footer block lifecycle, newsletter interaction, and console review **PASS — 2026-07-20**. Direct account navigation is the Phase 3 decision; authenticated account/order/address coverage remains a hardening test.
