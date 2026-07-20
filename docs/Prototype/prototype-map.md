# Prototype acceptance and Shopify map

Status: **CHECKPOINT COMPLETE — 2026-07-19**

| Flow | Prototype evidence | Acceptance covered |
|---|---|---|
| Home → product | Hero, shoppable story, collection CTA | Destination in at most two interactions; missing-media and long-copy states |
| Collection | URL-backed filter sheet, cards, no-results | History context, focus/hover parity, unavailable and empty states |
| Product | Media, colour/size, price/SKU/availability, disclosures | Variant values render together; unavailable choices cannot be selected |
| Cart | Empty/populated, quantity/remove, delayed update, error, checkout hand-off | Commerce first; announced, recoverable states |
| Mobile navigation | Header, task bar, menu/filter/cart sheets | Escape close, focus restore, safe area, no PDP CTA overlap |

Review at 1440, 375, and 320 px. The prototype includes landmarks, skip link, native controls, visible focus, labelled dialogs, live status, logical keyboard order, reduced-motion handling, and CSS-generated media without external assets.

## Future Shopify architecture

| Region | Future section/block/snippet |
|---|---|
| Announcement and header | `header-group`; `announcement-bar`, `header`; `mobile-task-bar`, `mobile-menu` snippets |
| Editorial hero | `editorial-hero` section with copy/action blocks |
| Story rail | `shoppable-story` section with `story-product` blocks |
| Collection | `main-collection-banner`, `main-collection-product-grid`; `product-card`, `facet-drawer` snippets |
| Product | `main-product`; title, price, picker, buy and disclosure blocks; `product-media-gallery`, `product-sticky-form` snippets/custom elements |
| Cart | `cart-drawer`, `main-cart`; `cart-line`, `cart-summary` snippets |

The journal-like masthead, numbered story annotations, typographic cards, and task bar that yields to the purchase bar are Narrivelle-specific rules. Formal competitor comparison and owner approval remain required for the full M1 gate.
