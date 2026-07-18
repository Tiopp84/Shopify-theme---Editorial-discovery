# Tier 1 live-demo audit — Fashion editorial/discovery themes

Ngày bắt đầu: 2026-07-17 (Asia/Bangkok)

Trạng thái: **COMPLETE FOR PHASE 0 — 7/7 structural audit + 3/3 owner spot-checks**

## 1. Phạm vi và nguyên tắc bằng chứng

Audit bảy theme Tier 1 trên năm luồng: home, collection, product, cart và mobile navigation. Chỉ đánh dấu một theme `COMPLETE` khi đã:

- mở live demo công khai và kiểm tra đủ năm luồng;
- ghi URL, ngày kiểm tra và interaction notes;
- lưu screenshot desktop/mobile cho các trạng thái quan trọng;
- phân biệt quan sát trực tiếp với nội dung do listing/developer công bố;
- không dùng markup, CSS, JavaScript hoặc asset của đối thủ làm source implementation.

Ký hiệu:

- `VERIFIED`: đã quan sát trực tiếp trên live demo;
- `PARTIAL`: đã kiểm tra một phần nhưng thiếu viewport/state evidence;
- `PENDING`: chưa kiểm tra trực tiếp;
- `CLAIM`: chỉ được xác nhận bởi listing hoặc tài liệu nhà phát triển.

## 2. Ma trận tiến độ

| Theme | Home | Collection | Product | Cart | Mobile navigation | Screenshot | Trạng thái |
|---|---|---|---|---|---|---|---|
| Prestige — Couture | VERIFIED | VERIFIED | PARTIAL | PENDING | PARTIAL | PENDING | PARTIAL |
| Palo Alto — SoMa | VERIFIED | PARTIAL | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |
| Blum — Celia | VERIFIED | VERIFIED | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |
| Pipeline — Clean | VERIFIED | PARTIAL | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |
| Stiletto — Stiletto | VERIFIED | VERIFIED | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |
| Sleek — Glossy | VERIFIED | PARTIAL | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |
| Concept — Tech | VERIFIED | VERIFIED | VERIFIED | PARTIAL | PARTIAL | PENDING | PARTIAL |

## 3. Prestige — Couture preset

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/prestige/presets/prestige>
- Live demo: <https://prestige-theme-couture.myshopify.com/>
- Collection: <https://prestige-theme-couture.myshopify.com/collections/shop>
- Developer demo reference: <https://support.maestrooo.com/article/769-prestige-demo-store-reference>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage tạo narrative bằng hero collection, editorial copy, collection modules, countdown, shop-the-look, featured product, journal và store information.
- Shop-the-look nối campaign image với nhiều product cards nhưng vẫn trình bày như một module độc lập; journey chưa cho thấy shared outfit state xuyên collection/product/cart.
- Featured product cho chọn color, size, quantity và add-to-cart ngay trong homepage; đây là conversion parity cần có, không phải USP.
- Trang dài và giàu media tạo cảm giác premium, nhưng số module lớn có thể làm loãng ưu tiên discovery nếu merchant không có art direction tốt.

### Collection — VERIFIED

- Information architecture chia `Women's Clothing` và `Capsules`; mega-menu kết hợp taxonomy với promotional imagery/link.
- Collection có category shortcuts, availability/color/size/price filters và product cards có color context, sale/sold-out state cùng `Choose options`.
- Điểm mạnh là breadth và merchandising rõ; cơ hội cho Narrivelle là giữ card anatomy nhất quán từ story tới grid và giảm tải lựa chọn trên mobile.

### Product — PARTIAL

- Product summary quan sát được gồm gallery/media, rating, description, color, size, quantity và add-to-cart.
- Variant options rõ ở mức nội dung, nhưng chưa kiểm chứng focus behavior, unavailable combinations, sticky purchase UI, gallery gestures và validation/error states.
- Product-confidence hierarchy cho fit, material, care, delivery và returns chưa nổi bật trong bằng chứng đã quan sát; đây vẫn là khoảng trống cần Narrivelle prototype chứng minh.

### Cart — PENDING

- Listing xác nhận quick buy, slide-out cart và sticky cart là feature của Prestige.
- Chưa thao tác add-to-cart trên live demo trong phiên này, vì vậy không ghi nhận behavior, upsell, error, focus hoặc empty-cart state như quan sát trực tiếp.

### Mobile navigation — PARTIAL

- DOM công khai cho thấy navigation drawer có Home, Shop, Blog, About, Presets, login và country selector.
- Country selector hiện diện trong navigation context là benchmark tốt cho localization-ready architecture.
- Chưa có viewport screenshot và chưa kiểm chứng drawer depth, back behavior, focus trap, close behavior hoặc one-hand reach.

### Kết luận áp dụng cho Narrivelle

1. Không cạnh tranh bằng “premium imagery + nhiều section”; Prestige đã rất mạnh và có lịch sử lâu dài ở vùng này.
2. Shop-the-look phải trở thành flow variant-aware với availability/error/focus state, không chỉ hotspot cộng product cards.
3. Collection card, product form và cart cần dùng chung variant language để tạo journey xuyên suốt.
4. Product confidence phải có hierarchy rõ trên mobile thay vì nằm rải rác trong tabs/icons.
5. Country/language selector phải có vị trí dự kiến trong header/mobile drawer ngay cả khi v1.0 chỉ phát hành English.

## 4. Palo Alto — SoMa demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/palo-alto/presets/palo-alto>
- Developer documentation: <https://palo-alto.presidiocreative.com/>
- Live demo: <https://palo-alto-theme-soma.myshopify.com/>
- Product evidence: <https://palo-alto-theme-soma.myshopify.com/collections/shirts/products/playa-shirt-lines>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Hero và featured collections dùng nhịp editorial đơn giản, xen story, product tabs, featured product, press, blog và shop-the-look content.
- Featured products cho add-to-cart ngay tại home; CTA mua hàng xuất hiện sau context thay vì promotion dày đặc.
- Shop-the-look vẫn là các grouped product links theo hình/story, chưa chứng minh shared outfit state xuyên cart.

### Collection — PARTIAL

- Navigation taxonomy chia shirts, jackets, pants và shorts; menu có product links sâu ngay dưới category.
- Homepage và search evidence xác nhận collection routes/cards, nhưng trang `/collections/all` không tải được qua audit reader nên filter/sort/pagination chưa được quan sát trực tiếp.

### Product — VERIFIED

- Product form có media gallery, size, quantity, add-to-cart và back-in-stock notification.
- Guarantee và shipping được đặt ngay trong PDP, tạo product-confidence context tốt hơn việc chỉ có generic icons.
- Form hỗ trợ recurring-purchase disclosure trên product phù hợp; đây là edge case đáng đưa vào QA contract dù Narrivelle không tự cung cấp subscription feature.

### Cart — PARTIAL

- Live DOM có open/close cart drawer controls; Theme Store listing công bố slide-out và sticky cart.
- Chưa tạo populated-cart state, nên quantity update, removal, upsell, error và focus restoration vẫn `PENDING`.

### Mobile navigation — PARTIAL

- Menu structure có explicit open/close controls, category drill-down, account/search/cart và language/currency controls.
- Chưa có mobile viewport evidence cho back behavior, focus trap, scroll locking, touch targets và one-hand reach.

### Kết luận áp dụng cho Narrivelle

1. Editorial pacing hiệu quả không cần promotion density cao; narrative cần dẫn tới CTA đúng thời điểm.
2. Guarantee/shipping nên xuất hiện theo decision hierarchy trên PDP, nhưng cần bổ sung fit/material/care cho fashion.
3. Không đưa product links quá sâu vào mobile menu nếu làm tăng độ dài và cognitive load; ưu tiên category-first progressive disclosure.
4. Subscription/deferred-purchase disclosure là compatibility edge case cần được test trong product form.

## 5. Blum — Celia demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/blum/presets/blum>
- Live demo: <https://blum-celia.myshopify.com/>
- Collection: <https://blum-celia.myshopify.com/collections/new-arrivals>
- Product: <https://blum-celia.myshopify.com/collections/new-arrivals/products/monette-mini-dress-white>
- Feature reference: <https://blum-celia.myshopify.com/pages/theme-features>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage kết hợp sustainability narrative, collection/product grids, lookbook, featured categories, countdown, store locations, testimonials và newsletter.
- Visual storytelling phong phú nhưng nội dung lặp và trang rất dài; điều này củng cố hướng Narrivelle dùng opinionated section sequencing thay vì cạnh tranh bằng số section.
- Outfit content hiện dưới dạng grouped products/slider; chưa thấy variant-safe outfit bundle state.

### Collection — VERIFIED

- Collection có description, availability/price/size/brand filters, sort, product count, pagination và supporting editorial/trust content dưới grid.
- Product cards trong evidence chủ yếu hiển thị vendor/title/price; variant context chưa rõ ngay tại grid.
- Filter breadth phù hợp catalog vừa, nhưng Narrivelle cần ưu tiên color/size availability và retained state cho fashion discovery.

### Product — VERIFIED

- PDP có gallery, size variants, stock count, size guide, add-to-cart, care accordions và `Style With` cross-sell có add action.
- Product-confidence content về fabric care/washing/hand-dyed/no-bleach rõ, nhưng shipping/returns/fit chưa cùng một hierarchy tại purchase point.
- `Style With` là parity hữu ích; Narrivelle phải khác bằng variant/availability/error behavior, không chỉ bằng cross-sell UI.

### Cart — PARTIAL

- Empty cart, continue-shopping action và cart drawer labels được quan sát; feature page công bố upsell, free-shipping threshold và discount behavior.
- Populated-cart interaction chưa được tạo, nên các công bố upsell không được nâng từ `CLAIM` thành `VERIFIED`.

### Mobile navigation — PARTIAL

- Navigation structure bao gồm collection imagery/counts, multi-level shop taxonomy, story/presets, account, market/language và contact/social links.
- Cấu trúc rất rộng; Narrivelle nên tránh đưa toàn bộ taxonomy và support content vào một drawer không có progressive disclosure rõ.
- Chưa kiểm chứng viewport, keyboard/focus, scroll lock và touch-target dimensions.

### Kết luận áp dụng cho Narrivelle

1. Blum chứng minh “editorial fashion” và lookbook đã là vocabulary cạnh tranh ở mức giá thấp; đó không thể là USP độc lập.
2. Product confidence nên hợp nhất size, fit, material, care, delivery và returns quanh decision point thay vì phân tán.
3. Outfit flow phải quản lý variant và availability của từng item trước khi add; `Style With` đơn thuần chỉ là parity.
4. Opinionated defaults và section sequencing gọn là cơ hội rõ trước demo nhiều module và content lặp.

## 6. Pipeline — Clean demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/pipeline/presets/pipeline>
- Live demo: <https://pipeline-theme-fashion.myshopify.com/>
- Product: <https://pipeline-theme-fashion.myshopify.com/products/leith-sweater-brown>
- Feature reference: <https://pipeline-theme-fashion.myshopify.com/pages/theme-features>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage kết hợp editorial hero, fabric-led tabs, product grids, curated collections, lookbooks và shop-the-look.
- Product cards hiển thị số màu, sold-out/pre-order state, size options và quick add; đây là benchmark mạnh cho fashion discovery ngay tại grid.
- Mật độ sản phẩm và tùy chọn rất cao; Narrivelle cần giữ variant confidence nhưng tránh biến homepage thành catalog dài khó định hướng.

### Collection — PARTIAL

- Taxonomy chia ready-to-wear, shoes/accessories, curated edits và lookbooks; navigation có progressive expand/hide controls.
- Live homepage và feature reference xác nhận subcollections/progressive filters, nhưng collection route trực tiếp không tải qua audit reader nên filter retention và empty-result state chưa verified.

### Product — VERIFIED

- PDP có color, size, quantity, size guide, stock/unavailable states và add-to-cart state copy (`Adding`, `Added`).
- Fit, material, model sizing, care, shipping và returns được trình bày theo nhóm; có complementary `Buy it with` và `Pairs well with`.
- Đây là benchmark gần nhất cho product-confidence pillar; Narrivelle cần làm hierarchy ngắn gọn hơn trên mobile và giữ nội dung metafield-safe.

### Cart — PARTIAL

- Empty drawer cho thấy free-shipping threshold, continue browsing, cart note, shipping estimator, tax/checkout context và empty state.
- Populated-cart quantity, removal, upsell, discount, error và focus restoration chưa verified.

### Mobile navigation — PARTIAL

- DOM có explicit expand/hide state cho từng nhóm menu, account/search/cart và country selector.
- Review trên Theme Store nêu rủi ro selector chỉ ở footer khó được nhận thấy; Narrivelle phải đặt market/language access trong header hoặc drawer khi khả dụng.
- Chưa có viewport evidence cho touch targets, depth, scroll lock, focus trap và back behavior.

### Kết luận áp dụng cho Narrivelle

1. Product cards cần truyền đạt color/size/availability rõ, nhưng progressive disclosure phải tránh tạo visual noise.
2. Product-confidence content phải dùng structured data/metafields và có thứ tự theo quyết định mua, không chỉ nhiều accordion.
3. Cart threshold, notes và shipping context là parity tốt; outfit state vẫn phải tồn tại xuyên drawer/cart.
4. Localization selector visibility là acceptance criterion, không chỉ là locale-file requirement.

### Owner spot-check — COMPLETE, 2026-07-17

- Cart không có pattern đặc sắc cần đưa vào differentiation.
- Product card hover quick add để lộ size là pattern hữu ích; unavailable size được thể hiện ngay trên card.
- Narrivelle chỉ dùng hover như enhancement; mobile/keyboard phải có trigger tương đương.
- Evidence: `evidence/tier-1/pipeline/pipeline-desktop-product-card-quick-add.png`, `evidence/tier-1/pipeline/pipeline-desktop-product-card-unavailable-size.png`.

## 7. Stiletto — Stiletto demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/stiletto/presets/stiletto>
- Live demo entry: <https://stiletto-theme-vogue.myshopify.com/>
- Live demo canonical: <https://stiletto-theme-stiletto.myshopify.com/>
- Collection: <https://stiletto-theme-stiletto.myshopify.com/collections/summer-set>
- Product: <https://stiletto-theme-stiletto.myshopify.com/products/piper-dress-in-noir-1>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage dùng city/resort collections, mix-and-match philosophy, category discovery, countdown, product grids và `Recreate the look` modules.
- Cards cho biết color count, size count/options, sale và choose-options state; outfit content vẫn dẫn tới từng product selection riêng.
- Theme cho phép browse theo category và editorial edit song song, phù hợp benchmark medium–large fashion catalog.

### Collection — VERIFIED

- Collection kết hợp editorial intro/story modules với grid, filter, sort, result count và load-more pagination.
- Cards thể hiện color/size options ngay trong grid, giúp giảm click mù nhưng tạo nhiều controls trên màn hình nhỏ.
- Narrivelle cần kiểm tra retained filter/sort state và chỉ lộ variant controls theo intent/touch-safe pattern.

### Product — VERIFIED

- PDP có color, size, size guide, quantity validation, recurring-purchase disclosure, add-to-bag, sticky purchase summary và stock-exceeded message.
- Product-confidence hierarchy rất đầy đủ: model/fit, composition, contact-for-fit, shipping threshold, secure payment, description, size & fit, care, shipping và returns.
- Đây là benchmark trực tiếp mạnh nhất cho pillar product confidence; Narrivelle phải tập trung vào scannability, mobile ordering và merchant data onboarding để khác biệt.

### Cart — PARTIAL

- Empty drawer có recommended collection paths; listing xác nhận slide-out/sticky cart và cart upsell.
- Populated-cart, free-shipping progress, upsell acceptance, removal, error và focus restoration chưa verified.

### Mobile navigation — PARTIAL

- Navigation taxonomy sâu nhưng có category/editorial routes, account và cart; market selector có danh sách quốc gia lớn.
- Chưa quan sát viewport nên không kết luận được drill-down/back, scroll lock, focus trap hoặc one-hand reach.

### Kết luận áp dụng cho Narrivelle

1. Product confidence đã là vùng cạnh tranh mạnh; Narrivelle cần chứng minh hierarchy tốt hơn, không chỉ cung cấp cùng fields.
2. Fit guide phải mở gần size selection, accessible và không mất selected variant/focus.
3. Quantity/stock validation copy và recurring-purchase disclosure phải nằm trong test contract.
4. Editorial collection modules cần hỗ trợ discovery nhưng không đẩy grid quá sâu hoặc phá retained filter state.

### Owner spot-check — COMPLETE, 2026-07-17

- Kết luận: bố cục mobile rất gọn; thông tin ngắn gọn nhưng đầy đủ.
- Quick view giữ color, size, mô tả và CTA `Add to bag` rõ trong cùng purchase flow.
- Populated cart ưu tiên product/variant, quantity, free-shipping state, subtotal và checkout.
- Evidence: `evidence/tier-1/stiletto/stiletto-mobile-product-quick-view.png`, `evidence/tier-1/stiletto/stiletto-mobile-cart-populated.png`.

## 8. Sleek — Glossy demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/sleek/presets/sleek>
- Live demo: <https://sleek-theme-demo.myshopify.com/>
- Product: <https://sleek-theme-demo.myshopify.com/products/sunscreen-lotion>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage rất dày product grids, category storytelling, bundles, trust content, promotions và editorial modules.
- Product cards có sale/new/stock messaging, direct add hoặc choose-options; bundle module cho chọn variant từng item và `Add all to cart`.
- Mật độ section/product cao củng cố cơ hội cho Narrivelle ở opinionated sequencing và focus, không phải breadth.

### Collection — PARTIAL

- Navigation taxonomy và collection links rõ; homepage có collection counts và product tabs.
- Collection route không tải qua audit reader trong phiên này, nên filter/sort/retained-state/empty-result chưa verified.

### Product — VERIFIED

- PDP có media modal, stock urgency, size/variant unavailable states, quantity, recurring-purchase disclosure, shipping threshold, returns và pickup fallback.
- Product content gồm overview, usage, ingredients, question form, reviews, trust/ingredient narrative và FAQs.
- Content confidence mạnh nhưng rất dài; Narrivelle cần ưu tiên decision-critical fit/material/care/delivery trước supporting editorial content.

### Cart — PARTIAL

- Theme Store listing xác nhận slide-out/sticky cart, gift wrapping và cart notes; homepage chứng minh multi-item add intent qua bundle.
- Empty/populated cart behavior, bundle partial failure, quantity update, removal và focus restoration chưa verified trực tiếp.

### Mobile navigation — PARTIAL

- Menu structure có taxonomy, promotional products, account, market selector và social links.
- Chưa có viewport evidence cho hierarchy, drill-down, gestures, focus trap, scroll lock và touch targets.

### Kết luận áp dụng cho Narrivelle

1. Multi-item outfit add phải xử lý variant/availability và partial failure rõ hơn generic `Add all`.
2. Product content dài cần progressive disclosure theo decision stage; không để trust/editorial content đẩy thông tin mua xuống quá sâu.
3. Section breadth không phải lợi thế phù hợp; preset defaults và merchant onboarding cần giảm content burden.

## 9. Concept — Tech demo

Nguồn:

- Theme Store: <https://themes.shopify.com/themes/concept/presets/concept>
- Live demo: <https://concept-theme-tech.myshopify.com/>
- Collection: <https://concept-theme-tech.myshopify.com/collections/headphones>
- Product: <https://concept-theme-tech.myshopify.com/products/flow-harmony>

Ngày kiểm tra: 2026-07-17.

### Home — VERIFIED

- Homepage tập trung category discovery, interactive product highlight, bundles, shop-the-feed/look, specs và large-catalog grids.
- Mobile-oriented structure lộ bottom navigation gồm Home, Menu, Search, Shop, Cart và Account; đây là interaction benchmark khác biệt nhất trong Tier 1.
- Bundle builder quản lý variant và sold-out state từng item, minimum item count, quantity/remove và calculated total.

### Collection — VERIFIED

- Collection page cung cấp product grid, filter/sort, variant/color options, availability và product specs ngay tại cards.
- Mật độ technical specs phù hợp electronics nhưng không nên sao chép cho fashion; Narrivelle chỉ giữ decision-critical color/size/availability.

### Product — VERIFIED

- PDP có color variants với sold-out state, accessories, stock/pickup fallback, add-to-cart, trial/warranty/shipping confidence và related bundle flow.
- Variant switching và bundle handling là benchmark interaction; fashion implementation phải bổ sung size/fit/material/care semantics.

### Cart — PARTIAL

- Empty cart có recommended collections, free-shipping goal, gift wrapping, order note, shipping estimator, discount input, subtotal và recently viewed.
- Populated cart, bundle grouping, discount conflict, gift-wrap quantities, errors và focus restoration chưa verified.

### Mobile navigation — PARTIAL

- DOM chứng minh mobile bottom navigation cùng menu/search/cart/account entry points.
- Theme listing công bố carousel swipes và popup-closing gestures, nhưng chưa có viewport/gesture evidence nên vẫn là `CLAIM`.
- Narrivelle không cần mô phỏng app; chỉ nên mượn nguyên tắc giảm reach distance cho high-frequency tasks.

### Kết luận áp dụng cho Narrivelle

1. One-hand access phải được đo theo task completion, không dùng “app-like” như art-direction claim.
2. Outfit builder cần học variant/availability/total/partial-state discipline từ bundle builder nhưng giữ flow nhẹ cho fashion.
3. Cart utilities phải progressive-disclosure để không biến drawer thành form dài.
4. Gesture enhancements phải có button/keyboard fallback và tôn trọng reduced motion.

### Owner spot-check — COMPLETE, 2026-07-17

- Mobile UI tối giản, không gây rối mắt và được chủ dự án đánh giá rất cao.
- Bottom task bar luân phiên với header theo scroll, giữ các tác vụ chính trong tầm ngón tay.
- Cart và các overlay mở dạng bottom sheet thay vì side drawer, phù hợp mobile context.
- Evidence: `evidence/tier-1/concept/concept-mobile-header-hero.png`, `evidence/tier-1/concept/concept-mobile-bottom-task-bar.png`, `evidence/tier-1/concept/concept-mobile-cart-bottom-sheet.png`.

## 10. Tổng hợp structural audit

- 7/7 theme đã có live-demo notes cho các surface truy cập được.
- Home và product patterns đã đủ để chuyển thành design principles/prototype acceptance criteria.
- Structural market audit đã đủ cho Phase 0. Deep interaction và screenshot audit đối thủ không còn là gate bắt buộc; các behavior này sẽ được kiểm thử đầy đủ trên Narrivelle trong build/QA.
- Benchmark nổi bật: Prestige art direction; Palo Alto editorial pacing; Blum price pressure; Pipeline variant-rich cards; Stiletto product confidence; Sleek bundle/content breadth; Concept mobile task access.

## 11. Interaction evidence và batch kế tiếp

Các mục dưới đây là `CLAIM`, chưa thay thế live-demo audit:

- Palo Alto listing công bố shop-the-look, upselling, quick buy, slide-out/sticky cart, infinite scroll, filter/sort và swatch filters.
- Blum listing định vị trực tiếp là editorial fashion; công bố hotspot, outfit-building collections, product siblings, quick view/buy, slide-out/sticky cart và discovery stack.

Owner spot-check hoàn tất cho Stiletto, Pipeline và Concept. Không cần audit thêm đối thủ ở Phase 0; bước kế tiếp là chuyển findings thành measurable design/prototype acceptance criteria.
