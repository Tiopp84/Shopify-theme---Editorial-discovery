# Checklist đầy đủ để bán theme trên Shopify Theme Store (2026)

> Cập nhật theo yêu cầu chính thức của Shopify (áp dụng từ 15/5/2025 trở đi). Nguồn: shopify.dev/docs/storefronts/themes/store/requirements

## 0. Điều kiện tiên quyết — codebase

- **Chỉ được phép build mới từ Shopify Skeleton Theme** (github.com/shopify/skeleton-theme), hoặc code hoàn toàn nguyên bản (original).
- Theme mới build dựa trên **Dawn hoặc Horizon sẽ KHÔNG được chấp nhận** để nộp mới.
- Theme phải **khác biệt căn bản** so với mọi theme khác trên Theme Store (kể cả theme khác của chính bạn) — không chỉ đổi màu/spacing/font mà phải khác về kiến trúc, hệ thống header/nav, product card, layout tổng thể. Merchant mua theme của bạn rồi tùy chỉnh không được ra kết quả giống hệt theme khác.

## 1. Tính độc quyền (Exclusivity)

- Theme đã lên Theme Store **chỉ được bán trên Theme Store**, không được bán song song ở marketplace khác.
- Không được có link/credit designer, affiliate link trong code.

## 2. Thiết kế & UX (bắt buộc đạt MỌI tiêu chí)

- Visual: hình ảnh/icon chất lượng cao, không mờ/vỡ/pixel; bảng màu hài hòa, nhất quán.
- Layout: theo lưới rõ ràng, spacing/alignment nhất quán; phân cấp nội dung rõ (size/color/contrast); layout vẫn đẹp khi nội dung dài/ngắn khác nhau (không bị vỡ/hụt trống).
- Consistency: typography nhất quán (không dùng quá nhiều font), các thành phần tương tác (nút, link, form) đồng bộ style; settings trong theme editor được đặt tên/nhóm dễ hiểu cho merchant.
- Trải nghiệm mua hàng: điều hướng rõ ràng từ trang chủ → sản phẩm → giỏ hàng → checkout; gợi ý sản phẩm hợp lý; thao tác chọn variant/thêm giỏ hàng mượt, phản hồi tức thì.
- Demo store: phải là cửa hàng thực tế hoàn chỉnh, ảnh chuyên nghiệp, nội dung viết thật (không Lorem Ipsum), sections phù hợp với ngành hàng được gắn tag.

## 3. Tính năng bắt buộc phải có

Theme phải hỗ trợ đầy đủ (không thể thiếu bất kỳ mục nào):

- Sections everywhere (chuẩn Online Store 2.0)
- Hiển thị discount (item-level & order-level) trên cart/checkout/order
- Accelerated checkout buttons trên Product page & Cart page (không đổi màu nút mặc định)
- Faceted search filtering trên collection & search page
- Gift card template
- Image focal points
- Ảnh cho social sharing (`page_image`)
- Country selector & Language selector (đúng UX guideline)
- Multi-level menu (dropdown lồng nhau)
- Newsletter signup form
- Pickup availability trên Product page
- Related product recommendations & Complementary product recommendations
- Rich product media (3D model, video Vimeo/YouTube)
- Search box + predictive search
- Selling plans (subscriptions) hiển thị trên Cart page
- Shop Pay Installments banner trên Product page
- Unit pricing trên Collection/Product/Cart page
- Variant images
- Follow on Shop button (không đổi màu)
- `<shopify-account>` component ở header (cả desktop & mobile)

## 4. Templates / Sections / Blocks bắt buộc

- Đủ file: `theme.liquid`, `404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.contact.json`, `password.json`, `product.json`, `search.json`, `gift_card.liquid`, `settings_data.json`, `settings_schema.json`.
- Mọi template (trừ Customer Account, Gift Card, Checkout) phải hỗ trợ sections.
- Bắt buộc có **section "Custom Liquid"** (có setting kiểu `liquid`) — làm điểm chèn cho app.
- Header/Footer phải nằm trong section groups.
- Product page: hầu hết phần tử (giá, vendor, mô tả...) phải tách thành block riêng; hỗ trợ **app block** (`@app`) ở main product section & featured product section.
- Không nộp kèm file `config/markets.json`.

## 5. Hiệu năng & Accessibility (Lighthouse)

- Điểm **Performance trung bình tối thiểu 60** (product, collection, home page — cả desktop & mobile).
- Điểm **Accessibility trung bình tối thiểu 90** (cùng 3 trang, cả desktop & mobile).
- Test bằng bộ dữ liệu benchmark của Shopify trước khi nộp (Theme Check, Lighthouse CI).
- Accessibility chi tiết: keyboard-accessible toàn bộ, focus state rõ, alt cho mọi ảnh, label liên kết đúng input id, HTML hợp lệ, contrast ≥4.5:1 (text thường) / ≥3:1 (text lớn, icon/border), touch target ≥24x24px, heading h1–h6 phân biệt trực quan.

## 6. Trang bắt buộc & yêu cầu chi tiết

Mỗi loại trang có checklist riêng khá dài (Product, Collection, Collection list, Cart, Page, Blog, Article, Search, 404, Gift card, Password) — ví dụ:
- Product page: đủ title/giá/unit price/compare-at/mô tả/option, swatch màu-hình, add-to-cart, recommendations, accelerated checkout mặc định bật...
- Cart page: đủ line item info, tổng tiền, cart note, discount code, cập nhật số lượng...
- Gift card page: hỗ trợ Apple Wallet, hiện QR code ≥120x120px...

👉 Phần này rất chi tiết, bạn nên mở trực tiếp trang requirements gốc và làm theo từng mục khi code từng template.

## 7. Tương thích trình duyệt

- Desktop: Safari (2 bản mới nhất - Mac), Chrome (3 bản - Mac/PC), Firefox (3 bản), Edge (2 bản - PC).
- Mobile: responsive bắt buộc; Mobile Safari, Chrome Mobile, Samsung Internet (các bản mới nhất).
- Webview: phải hoạt động khi mở trong app Instagram, Facebook, Pinterest (bản mới nhất).

## 8. Asset & code

- Không dùng Sass/`.scss`; chỉ CSS thuần (`.css`/`.css.liquid`).
- Không nộp file `.css`/`.js` đã minify (trừ ES6 và thư viện bên thứ 3) — Shopify tự minify.
- Không script/code can thiệp vào theme editor hay Shopify admin.
- Link nội bộ dùng `routes` object; link trỏ về domain Shopify phải có `rel="nofollow"`.
- Asset link dùng protocol-relative URL.
- Theme không được phụ thuộc vào app để hoạt động, không giả lập tính năng kiểu app (wishlist, đặt lịch, Instagram feed...) nếu chưa hoàn chỉnh.
- Không dùng chiêu trò lừa dối (đếm ngược giả, số lượng tồn kho giả, viewer giả).

## 9. SEO

- Có snippet SEO metadata (title, meta description, canonical URL).
- Có rich product snippets (test bằng Google Structured Data Testing Tool).
- Không có file `robots.txt.liquid`.

## 10. Settings, Font, Color

- Settings đặt tên rõ ràng, đúng thuật ngữ Shopify (có bảng thuật ngữ chuẩn — ví dụ "home page" không phải "homepage", "slideshow" không phải "slider"...), câu văn ở thể mệnh lệnh/khẳng định, dùng American English.
- Font: dùng `font_picker`, có default font, load đủ bold/italic/bold-italic; không dùng custom font ngoài danh sách cho phép.
- Màu: tối thiểu 4 màu, mỗi background color phải có foreground color tương ứng.

## 11. Đặt tên theme & preset

- Tên theme/preset: 1-2 từ, dưới 30 ký tự, là danh từ, không trùng tên sản phẩm/sự kiện Shopify, không trùng tên công ty bạn, không dùng tên ngành hàng (Fashion, Jewelry...), không trùng theme đã có trên Theme Store.
- Nếu có nhiều preset: phải đóng gói theo cấu trúc `/listings/<preset-name>/templates/...` trong file zip.

## 12. Demo store

- Tạo qua **Client transfer store** trong Partner Dashboard (dev store bật developer preview thì KHÔNG transfer được).
- Mỗi preset cần ít nhất 1 demo store, đúng ngành hàng + catalog size đã gắn tag.
- Bật Bogus Gateway hoặc Shopify Payments test mode, tắt các cổng thanh toán khác.
- Nội dung thật 100%, không Lorem Ipsum, không chèn app, không nút/text giả lập trong ảnh.
- Phải xin phép bản quyền ảnh/thương hiệu dùng trong demo (gợi ý dùng Shopify Burst — ảnh free).

## 13. Tài liệu hướng dẫn (Documentation) & Contact form — BẮT BUỘC trước khi submit

- Phải có **trang tài liệu hướng dẫn sử dụng theme** cho merchant + **form liên hệ hỗ trợ công khai**, cả hai phải sẵn sàng trước khi launch và được link trong listing page.
- Tài liệu: đúng chính tả/ngữ pháp, khớp với nội dung trong theme settings, có mục FAQ, cập nhật liên tục theo bản theme mới.
- Nêu rõ chính sách support (support gì, không support gì).
- Contact form: có trường Tên, Email, URL cửa hàng (kèm ví dụ dạng `yourstore.myshopify.com`), mô tả vấn đề (textarea), cho phép đính kèm ảnh, có auto-responder xác nhận đã nhận yêu cầu. Tránh hỏi ngân sách/số điện thoại/loại dự án không cần thiết.

## 14. Trách nhiệm support sau khi được duyệt

- Phải trả lời yêu cầu hỗ trợ merchant **trong vòng 2 ngày làm việc**.
- Phải sửa lỗi kỹ thuật (layout vỡ, link chết, lỗi logic) kịp thời; **lỗi nghiêm trọng phải fix ngay lập tức**, nếu không theme có thể bị gỡ tạm thời khỏi Theme Store.
- ⚠️ Shopify cảnh báo: làm Theme Partner gần như là công việc full-time — số lượng ticket hỗ trợ hàng tháng khá lớn, nhiều người mới thường đánh giá thấp khối lượng công việc này. Bạn nên có kế hoạch nhân sự/quy trình support trước khi launch.

## 15. Quy trình nộp & review (5 giai đoạn)

1. Chuẩn bị: đọc kỹ toàn bộ checklist trên, tự test bằng Theme Check + Lighthouse.
2. Đóng gói file zip theme (dùng Shopify CLI để build zip, có cấu trúc `/listings` nếu nhiều preset).
3. Đăng nhập **Partner Dashboard** → mục Themes → nộp theme, điền form listing cho từng preset (mỗi preset có 1 trang listing riêng, gắn tối đa 2 ngành + 1 catalog size).
4. Shopify review qua 5 giai đoạn — 3 giai đoạn đầu chủ yếu check yêu cầu kỹ thuật/kỹ thuật cơ bản (feedback UX chỉ là gợi ý sơ bộ), giai đoạn 4 mới review sâu về Design/UX. Nếu cần sửa, bạn nhận email liệt kê chi tiết, có thể phản hồi qua email để trao đổi với đội review.
5. Theme không đạt sẽ bị từ chối kèm lý do; nếu nộp lại mà không sửa đúng lỗi đã nêu, có thể bị **tạm khóa quyền nộp theme**.

## 16. Doanh thu

- Theme bán qua Shopify Theme Store chịu **revenue share 15%** (Shopify giữ 15%, bạn nhận 85%).

---

### Gợi ý hành động cho người mới bắt đầu
1. Clone **Skeleton Theme**, học kiến trúc OS 2.0 (sections/blocks/section groups) trước khi thiết kế.
2. Định hình rõ **1 ngành hàng + phong cách thị giác riêng biệt** — đây là điểm dễ bị từ chối nhất (yêu cầu "Uniqueness").
3. Build đủ tính năng bắt buộc ở mục 3 trước, rồi mới tối ưu design.
4. Dùng **Shopify Theme Check** (CLI/VS Code extension) + **Lighthouse CI** liên tục trong lúc code, đừng để tới cuối mới test.
5. Chuẩn bị tài liệu + contact form song song với code, đừng để tới sát ngày nộp.
6. Set kỳ vọng đúng: quá trình review có thể mất nhiều vòng chỉnh sửa; và sau khi được duyệt, support merchant là công việc dài hạn, liên tục.

**Tài liệu gốc (nên bookmark):**
- Yêu cầu chi tiết: https://shopify.dev/docs/storefronts/themes/store/requirements
- Quy trình nộp & review: https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
- Trang listing từng preset: https://shopify.dev/docs/storefronts/themes/store/review-process/listings
- Tổng quan Theme Store cho Partner: https://shopify.dev/docs/storefronts/themes/store



Lộ trình hợp lý là: đóng Phase 8 trước, xử lý các capability bắt buộc còn thiếu, rồi mới harden và chuẩn bị submission. Với trạng thái hiện tại, ước tính còn khoảng 8–12 tuần full-time cho code, QA, demo và packaging; chưa gồm thời gian Shopify review.
1. Tuần 1 — Khóa baseline và requirement audit
Đối chiếu lại checklist local với Shopify requirements chính thức trước khi quyết định scope cuối.
Chuyển các phát hiện thành backlog có acceptance criteria và owner.
Giữ main releaseable; mọi thay đổi qua feature branch/PR nhỏ.
Tạo fixture plan cho product: pickup, selling plan, Shop Pay, media 3D/video, discounts, multilingual, long content.
Không đánh dấu hoàn thành nếu chưa có evidence Shopify Preview.
Kết quả: một “submission gap register” duy nhất, không còn phát sinh feature ngoài kế hoạch.
2. Tuần 2–3 — Đóng các capability bắt buộc đang thiếu
Ưu tiên theo rủi ro bị reject:
PDP dynamic checkout / accelerated checkout.
Pickup availability.
Shop Pay Installments (payment_terms).
Follow on Shop button.
Custom Liquid section, scoped hợp lý và có locale/schema.
Menu ba cấp cho desktop và mobile, có keyboard/focus/escape.
Featured product section độc lập, với product blocks và @app.
Mỗi capability phải có:
Native Shopify là source of truth.
No-JS fallback.
Empty/loading/error states nếu áp dụng.
Test desktop, 320/375, 768, 1024, keyboard, zoom và reduced motion.
Validator, Theme Check, JS syntax và git diff --check.
3. Tuần 3–4 — Hoàn thành Phase 8 hiện tại
Theo đúng current-step.md:
Test Page, Contact và FAQ với data thật/rỗng.
Test 404, Password và Gift Card ở toàn bộ state thực.
Review Blog, Article, List collections, Search với empty/long/missing-media/pagination.
Ra quyết định rõ customer account model; không tạo customer templates suy đoán.
Ghi kết quả vào QA evidence và chỉ đóng Phase 8 khi toàn bộ route pass.
4. Tuần 5–6 — Accessibility, responsive và performance hardening
Chạy toàn bộ commerce flow: Home → Collection → PDP → Cart → Checkout.
Audit Lighthouse cho Home, Collection, Product trên mobile/desktop; đạt tối thiểu 60 Performance và 90 Accessibility, mục tiêu nội bộ 75/95.
Test browser matrix: Safari, Chrome, Firefox, Edge; Mobile Safari, Chrome Android, Samsung Internet và webview.
Kiểm tra 200% zoom, focus order, contrast, touch target, headings, form errors, dialogs và reduced motion.
Loại dead code/runtime không cần thiết; đo ảnh hưởng GSAP/AOS trước release.
5. Tuần 7–8 — Submission/package readiness
Đổi metadata Skeleton/Shopify thành Narrivelle: name, author, version, support URL, documentation URL.
Hoàn tất trademark clearance trước public listing.
Tạo hai presets đạt parity, cấu trúc /listings/..., clean-install test.
Hoàn tất demo stores bằng Client transfer store; nội dung/ảnh thật, có license register.
Public merchant documentation, FAQ, support policy và contact form đúng requirement.
Changelog, release notes, asset licenses, third-party notices, support SLA.
6. Tuần 9 — Release gate và dry run
Chạy toàn bộ checklist 10-release-gate.md.
Build ZIP bằng Shopify CLI và kiểm tra package không chứa credentials, demo-only assets hoặc markets.json.
Submission dry-run với từng preset/listing.
Chỉ submit khi mọi mục bắt buộc có evidence, không chỉ “code exists”.
Điểm quan trọng nhất: đừng dàn trải polish visual trước. Hiện nên ưu tiên capability Shopify bắt buộc và evidence Preview trước; sau đó mới harden và đóng gói.