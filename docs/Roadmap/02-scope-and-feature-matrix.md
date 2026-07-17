# 02 — Phạm vi và feature matrix

## Nguyên tắc

MVP nên có 18–22 sections và 25–35 Theme Blocks thật sự hoàn thiện. Mỗi component phải đạt responsive, accessibility, merchant configurability, section-reload và clean-install behavior.

Scope chi tiết đã khóa tại `../Specifications/mvp-feature-matrix.md` ngày 2026-07-17. Tài liệu này giữ checklist yêu cầu cấp cao; thay đổi scope phải cập nhật cả hai nơi.

## Required templates

- [ ] `theme.liquid`, `404.json`, `article.json`, `blog.json`, `cart.json`
- [ ] `collection.json`, `index.json`, `list-collections.json`
- [ ] `page.json`, `page.contact.json`, `password.json`
- [ ] `product.json`, `search.json`, `gift_card.liquid`
- [ ] Customer account/auth/order/address templates
- [ ] `settings_schema.json` và clean `settings_data.json`

Ngoại trừ customer, gift card và checkout, template phải dùng JSON sections. Header/footer dùng section groups; có Custom Liquid và app-block insertion points hợp lý.

## Commerce matrix

| Nhóm | Mức | Acceptance |
|---|---|---|
| Price/compare-at/unit price | Required | Đổi đúng variant/currency, xuất hiện trong cart/order |
| Selling plans | Required | Product form, cart line và order |
| Quantity rules/pricing | Required | Picker, cart và bulk flow nếu có |
| Accelerated checkout | Required | Product và cart |
| Discounts | Required | Line-item và cart-level |
| Gift card recipient | Required khi hỗ trợ | Validation và scheduled delivery |
| Product media | Required | Image, video, external video, 3D |
| Variant media | Required | Gallery đổi đúng variant |
| Search | Required | Product/page/article/collection và `object_type` |
| Storefront filters | Required | Price, active filters, mobile drawer |
| Localization | Required | Country/language khi khả dụng |
| Cart drawer | Product decision | AJAX, focus, errors/live region |
| Quick add | Product decision | An toàn với một/nhiều variants |

## Product Theme Blocks

- [ ] Title, vendor, SKU, rating, price, inventory
- [ ] Variant picker, quantity selector, buy buttons
- [ ] Description, collapsible content, icon with text
- [ ] Popup, size guide, complementary products
- [ ] Custom Liquid, disclosures/material/care, share, app blocks

Main product section chỉ giữ layout, media và product context; feature merchant-managed nằm trong blocks.

## Sections MVP

Foundation: announcement, header/footer groups, Apps, Custom Liquid, rich text, image with text, contact, newsletter.

Commerce: featured collection/product, collection list/tiles, product editorial grid, recommendations.

Khác biệt: editorial hero, shoppable lookbook, shop-the-outfit, editorial collage, media story, video banner, material/fit story.

## Out of scope mặc định

- Wishlist cần API/storage, booking, fake urgency/viewer/stock.
- Cart discount hacks, Instagram API feed, remote runtime framework.
- App-like feature không hoạt động đầy đủ nếu thiếu app/API.
- Nested page-builder quá sâu hoặc settings gây support burden.

## Definition of Done cho component

- [ ] Có states và acceptance criteria.
- [ ] Semantic, keyboard usable, responsive từ 320px.
- [ ] Empty/missing resource có fallback.
- [ ] Settings rõ và dùng locale keys; merchant-addable block có preset.
- [ ] Asset chỉ load khi cần; section reload không duplicate listener.
- [ ] Test long text, zoom, reduced motion và error state.
- [ ] Có evidence QA.

## Exit criteria

- [x] Scope MVP đã khóa; mỗi feature có role owner/priority/acceptance. Evidence: `../Specifications/mvp-feature-matrix.md`.
- [x] Optional features sang post-launch backlog. Evidence: explicit product decisions trong `../Specifications/mvp-feature-matrix.md`.
- [x] Support burden đã được review ở mức scope. Evidence: loại app-like features, recently viewed, voice search, deep builder và preset thứ ba.
