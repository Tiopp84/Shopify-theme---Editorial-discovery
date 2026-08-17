# Product brief — Đã phê duyệt

Ngày nghiên cứu: 2026-07-17 (Asia/Bangkok)

Trạng thái: **APPROVED — 2026-07-17**

## 1. Đề xuất tổng thể

Xây một theme **editorial discovery cho thương hiệu thời trang độc lập có catalog trung bình đến lớn**, giúp khách hàng đi từ cảm hứng hình ảnh đến lựa chọn đúng sản phẩm/biến thể nhanh trên mobile.

Theme không cạnh tranh bằng số lượng section hoặc một lookbook đơn lẻ. Điểm khác biệt nằm ở một hệ thống xuyên suốt navigation → editorial content → collection discovery → product confidence → outfit/cart.

## 2. Product brief đề xuất

| Trường | Phương án đề xuất | Lý do |
|---|---|---|
| Tên nội bộ | Project Loomline | Dễ dùng trong development; chưa dùng làm tên thương mại |
| Tên thương mại | Chưa chốt; thực hiện naming/trademark audit riêng | Tránh chọn tên đẹp nhưng trùng Theme Store hoặc nhãn hiệu |
| Merchant mục tiêu | Independent fashion/apparel/lifestyle brands | Đủ tập trung để tạo art direction nhưng vẫn có thị trường rộng |
| Quy mô catalog | Medium–large, khoảng 100–2.000 sản phẩm | Có nhu cầu thật về navigation, swatch, filter và merchandising |
| Vấn đề chính | Store giàu hình ảnh thường hy sinh khả năng tìm sản phẩm; store catalog lớn thường thiếu storytelling và product confidence | Tạo bài toán thống nhất thay vì tập hợp feature rời rạc |
| Positioning | Editorial discovery theme for growing fashion brands—turning campaign imagery into fast, confident mobile shopping | Nêu merchant, outcome và trải nghiệm khác biệt |
| Giá launch | USD 350 | Nằm dưới nhóm premium USD 400–420 nhưng tránh tín hiệu giá rẻ; review lên USD 400 sau validation |
| Preset | 2: Narrivelle và Still | Narrivelle là hướng high-end editorial/campaign; Still là hướng tối giản, quiet commerce. Capabilities ngang nhau nhưng homepage composition khác nhau có chủ đích. |
| Ngôn ngữ launch | English hoàn chỉnh; kiến trúc locale-ready | Giảm QA/support ban đầu; không hard-code copy để thêm locale sau |
| SLA support | Phản hồi trong 2 business days | Yêu cầu Theme Store hiện hành |
| Nguồn code | Shopify Skeleton Theme + implementation/art direction nguyên bản | Giảm rủi ro eligibility và chi phí foundation so với viết toàn bộ shell từ số 0 |

## 3. Bốn trụ cột khác biệt đề xuất

### A. Editorial-to-product journey

Campaign, story, collection và product dùng cùng một ngôn ngữ merchandising. Editorial media có đường dẫn mua hàng rõ, nhưng không biến mọi ảnh thành hotspot gây nhiễu.

Tiêu chí đo:

- Có thể đi từ editorial module đến product phù hợp trong tối đa 2 tương tác trên mobile.
- Product reference bị thiếu có fallback/onboarding rõ và không làm vỡ layout.
- Cùng một art direction nhận diện được trên home, collection, product và cart.

### B. Outfit-aware merchandising

Shop-the-outfit là một flow hoàn chỉnh: trình bày outfit, xem từng item/variant, xử lý sold-out và thêm sản phẩm an toàn; không giả lập bundle/discount hoặc phụ thuộc app.

Tiêu chí đo:

- Mỗi item giữ đúng variant, availability và price state.
- Sold-out/missing item không chặn các item còn lại.
- Keyboard, screen reader và Theme Editor lifecycle đều hoạt động.

### C. Fashion discovery system

Mega menu, collection cards, product cards, swatches, filters và search dùng chung một mô hình nhận diện sản phẩm. Trọng tâm là tìm nhanh theo màu, fit/category và collection thay vì chỉ hiển thị grid.

Tiêu chí đo:

- Filter → product flow dùng một tay trên mobile và giữ context rõ.
- Swatch không truyền thông tin chỉ bằng màu; trạng thái unavailable đọc được.
- Quick add an toàn cho sản phẩm một và nhiều variant.

### D. Product confidence on mobile

Size/fit, material/care, delivery/returns, gallery và variant state được tổ chức theo mức độ cần thiết tại thời điểm mua.

Tiêu chí đo:

- Variant thay đổi đồng bộ URL, media, price, SKU, availability và selling-plan state.
- Size/fit/material truy cập được mà không che hoặc đẩy mất CTA chính.
- Core flow đạt keyboard, zoom 200%, reduced-motion và screen-reader QA.

## 4. Art direction đề xuất

- Editorial grid bất đối xứng có quy tắc, không phải masonry tùy ý.
- Typography tạo nhịp “magazine → catalog → detail”, ưu tiên khả năng đọc và long translation.
- Product card có hai tầng: nhận diện hình ảnh và quyết định biến thể nhanh.
- Navigation kết hợp collection taxonomy với campaign/story, nhưng không quá sâu.
- Mobile là composition riêng có cùng identity, không chỉ thu nhỏ desktop.
- Motion tiết chế, dùng để giải thích chuyển trạng thái; luôn hỗ trợ reduced motion.

## 5. Phạm vi launch đề xuất

### Bắt buộc cho MVP

- Toàn bộ template/feature Shopify Theme Store yêu cầu.
- Header/footer groups, mega menu, predictive search, localization entry points.
- Product/collection cards, filtering/sorting, swatches và variant-safe quick add.
- Product media đầy đủ; product blocks cho size/fit/material/care/delivery/returns.
- Selling plans, quantity rules/pricing, unit price, discounts và accelerated checkout.
- Cart drawer và cart page có loading/error/live-region/focus behavior.
- Editorial hero, editorial collection, shoppable story và outfit composition.
- Hai preset capability parity, clean install, documentation và support form.

### Không đưa vào launch

- Wishlist, loyalty, booking, back-in-stock service hoặc tính năng cần API/app.
- Recently viewed nếu cần storage/logic làm tăng privacy và support burden.
- Fake urgency, fake stock/viewer, discount hack hoặc Instagram API feed.
- RTL và bộ locale EU đầy đủ ở version 1.0 nếu chưa có nguồn lực dịch/QA bản địa.
- Preset thứ ba trước khi hai preset đầu đạt parity.

## 6. Lựa chọn kỹ thuật đề xuất

Chọn **Shopify Skeleton Theme làm baseline duy nhất được phép**, sau đó xây component, layout, interaction và art direction nguyên bản. Không lấy Dawn/Horizon làm reference implementation hoặc port markup/classes.

Biện pháp provenance:

- Ghi hash/version Skeleton tại thời điểm nhập source.
- Commit import riêng, không trộn feature code.
- Duy trì `THIRD_PARTY_NOTICES.md` và asset/license register.
- Mỗi dependency cần license review trước khi merge.
- PR/commit nhỏ kèm test notes và screenshot evidence.

## 7. Giá và economics sơ bộ

Giá đề xuất USD 350 tạo khoảng trống so với các theme premium đang ở USD 400–420, nhưng vẫn phản ánh nghĩa vụ support. Theo tài liệu Shopify tại ngày nghiên cứu, Theme Store áp dụng revenue share 15% trên gross sales và processing fee 2,9%, chưa tính tax/chi phí vận hành.

Không giảm giá để cạnh tranh với theme USD 100–170. Lợi thế phải đến từ design system, reliability, demo, documentation và support.

## 8. Trade-off cần chấp nhận

- Medium–large catalog làm scope collection/search/filter và QA data matrix lớn hơn.
- Hai preset làm tăng demo/QA nhưng cần thiết để chứng minh flexibility.
- English-only giảm thời gian launch nhưng hạn chế một phần thị trường; phải locale-ready ngay từ code.
- Skeleton giảm rủi ro nền tảng nhưng không tự tạo uniqueness; uniqueness vẫn cần chứng minh ở kiến trúc trải nghiệm.
- Cart drawer tăng conversion UX nhưng kéo theo nhiều error/focus/lifecycle test.

## 9. Bằng chứng nghiên cứu ban đầu

- Shopify Theme Store requirements: https://shopify.dev/docs/storefronts/themes/store/requirements
- Revenue share: https://shopify.dev/docs/storefronts/themes/store/revenue-share
- Prestige — USD 400, premium/high-end fashion: https://themes.shopify.com/themes/prestige/presets/prestige
- Palo Alto — USD 420, shop-the-look/merchandising: https://themes.shopify.com/themes/palo-alto/presets/pluma
- Enterprise — USD 420, speed/conversion/large feature set: https://themes.shopify.com/themes/enterprise/presets/enterprise
- Blum — USD 170, định vị trực tiếp editorial fashion/lookbook: https://themes.shopify.com/themes/blum/presets/blum

Đây mới là market scan định hướng, chưa thay thế competitive analysis 15 theme bắt buộc của Phase 0.

## 10. Quyết định đã phê duyệt

- [x] Duyệt merchant segment và catalog medium–large.
- [x] Duyệt product problem và positioning.
- [x] Duyệt bốn trụ cột khác biệt.
- [x] Duyệt mức giá launch USD 350.
- [x] Duyệt English-only ở version 1.0, locale-ready.
- [x] Duyệt Shopify Skeleton Theme làm baseline.
- [x] Chốt hai preset: Narrivelle (high-end editorial/campaign) và Still (tối giản, quiet commerce). Cần recheck trademark/domain và Shopify naming conflicts ngay trước lần public upload đầu tiên.

## 11. Localization contract cho version 1.0

English-only nghĩa là chỉ phát hành bản dịch English ở version 1.0, không có nghĩa hard-code English trong component.

- Storefront copy dùng key trong `locales/en.default.json` và Liquid filter `t`.
- Theme Editor labels, info và option text dùng key trong `locales/en.default.schema.json`.
- Key được nhóm theo domain/component và giữ ổn định sau release.
- Interpolation dùng biến có tên; pluralization dùng `count`, không nối chuỗi theo ngữ pháp English.
- Ngày/giờ, tiền tệ, country/language và URL dùng object/filter localization của Shopify.
- Layout dùng `request.locale.iso_code` cho thuộc tính `lang` và không giả định hướng chữ trong component API.
- CSS tránh width cố định cho text; QA long text/pseudo-locale ngay trong v1.0.
- JavaScript nhận message đã dịch từ DOM/data hoặc JSON locale; không chứa UI copy hard-code.
- CI/Theme Check kiểm tra missing/orphan schema và storefront translation keys.
- Khi thêm locale mới, storefront locale và schema locale phải có key parity với English trước khi release.

Với contract này, thêm locale Latin-script sau này chủ yếu là translation + linguistic/layout QA. RTL hoặc các hệ chữ có typography/line-breaking khác vẫn cần một workstream thiết kế và browser QA riêng.
