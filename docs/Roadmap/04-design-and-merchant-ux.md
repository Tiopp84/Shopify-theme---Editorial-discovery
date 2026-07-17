# 04 — Design system và merchant UX

## Art direction

Theme phải khác biệt ở header/navigation, card anatomy, typography hierarchy, media treatments, product information architecture, collection merchandising, mobile interactions và cart presentation. Đổi palette/font/radius/shadow/animation không đủ tạo uniqueness.

## Design tokens

- [ ] Color roles/schemes; typography scale; spacing scale.
- [ ] Containers, grid/gutters, breakpoints theo layout.
- [ ] Media ratios, borders, radius, shadows.
- [ ] Button/form states; motion duration/easing.

## Màn hình thiết kế trước build

- Home, collection/filter, product/media modal desktop/mobile.
- Header, mega menu, mobile drawer.
- Cart drawer/page; search/predictive search.
- Blog/article, 404, contact, password, gift card.
- Với mỗi màn hình: normal, empty, loading, error, long content, missing image.

## Storefront UX

- Action chính rõ; button cho action, link cho navigation.
- Availability/price không gây hiểu nhầm; unavailable variant đọc được.
- Mobile controls dễ chạm; filter có reset/context rõ.
- Drawer/modal dùng Escape, focus trap và restore focus.
- Motion không cản thao tác; long content không vỡ layout.

## Theme Editor UX

- Controls phổ biến trước, advanced settings sau header rõ.
- Defaults đẹp và không cần code/metafield để bắt đầu.
- Missing resource tự ẩn hoặc có onboarding fallback.
- Preset nói rõ mục đích; add/remove/reorder/reload ổn định.
- Setting copy đúng Shopify terminology và locale-backed.

## Core acceptance

Product card: nhận diện riêng, media ổn định, price/badges rõ, swatch accessible, quick-add variant-safe, focus tương đương hover.

Product page: hỗ trợ đủ media, variant đồng bộ URL/media/price/SKU/availability, selling plans/quantity rules, size/fit/material hierarchy và mobile one-hand usability.

## Exit criteria

- [ ] Clickable prototype core flows.
- [ ] Comparison chứng minh khác Dawn/competitors.
- [ ] Desktop/mobile/accessibility design review đạt.
- [ ] Setting map cho từng section/block được duyệt.
