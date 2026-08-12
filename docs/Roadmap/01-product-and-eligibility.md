# 01 — Product strategy và điều kiện đủ để đăng bán

## 1. Mục tiêu

Xác lập một sản phẩm có thị trường, có quyền phân phối, khác biệt đủ mạnh và có khả năng được Shopify xét duyệt. Phase này hoàn thành trước khi viết component production.

## 2. Điều kiện nguồn gốc code

- [x] Tạo repository mới từ Shopify Skeleton Theme. Evidence: import commit `7fdb6a1`.
- [x] Lưu commit khởi tạo và lịch sử phát triển liên tục. Evidence: Git history từ commit `978cf11`.
- [x] Không copy file hoặc đoạn code đáng kể từ Dawn/Horizon.
- [x] Không port nguyên markup rồi chỉ đổi class hoặc styling.
- [x] Không dùng code lấy từ commercial theme khác.
- [x] Lập `THIRD_PARTY_NOTICES.md` cho dependency và asset bên thứ ba.
- [x] Thiết lập asset/license register; chưa có font, icon, ảnh demo hoặc thư viện mới được phép dùng nếu chưa có proof/license.
- [x] Review license của Skeleton baseline; mọi dependency mới phải được review trước khi thêm.

Có thể dùng theme hiện tại để lập feature specification, test merchant workflow và ghi nhận edge case. Không dùng nó làm source code cho bản submission.

## 3. Product brief bắt buộc

Điền đầy đủ trước khi qua phase tiếp theo:

| Trường | Quyết định |
|---|---|
| Tên nội bộ | Project Loomline |
| Tên theme | Narrivelle — selected by owner; professional trademark clearance pending for public listing |
| Merchant mục tiêu | Fashion/apparel/lifestyle |
| Quy mô catalog | Medium–large, khoảng 100–2.000 sản phẩm |
| Vấn đề chính | Store giàu hình ảnh thường hy sinh discovery; store catalog lớn thường thiếu storytelling và product confidence |
| Lợi thế cạnh tranh | Editorial-to-product, outfit-aware merchandising, fashion discovery system và mobile product confidence |
| Mức giá mục tiêu | $350 launch; xem xét $400 sau validation |
| Số preset | 2 ở bản đầu |
| Ngôn ngữ support | English ở v1.0; kiến trúc localization-ready |
| SLA support | Phản hồi trong 2 business days |

Một positioning statement mẫu:

> Editorial discovery theme for growing fashion brands—turning campaign imagery into fast, confident mobile shopping.

## 4. Trụ cột khác biệt

Chọn tối đa 3–5 trụ cột; mỗi trụ cột phải thể hiện xuyên suốt home, collection, product và cart.

- Editorial merchandising: layout, typography và media treatment riêng.
- Shoppable storytelling: lookbook/shop-the-look tích hợp product thật.
- Fashion discovery: swatch, filter, product card và mega menu được thiết kế như một hệ thống.
- Product confidence: size guide, fit information, material/care, delivery/returns.
- Mobile commerce: navigation, filters, gallery, variants và cart tối ưu cho ngón tay.

Không coi đổi màu, font, spacing, radius, shadow hoặc animation đơn lẻ là khác biệt sản phẩm.

## 5. Nghiên cứu thị trường

- [x] Chọn 15 theme cạnh tranh trực tiếp trên Shopify Theme Store. Evidence: `../Discovery/competitive-analysis.md`, 2026-07-17.
- [x] Ghi giá, rating, số preset, ngành, feature và art direction. Evidence: `../Discovery/competitive-analysis.md`.
- [x] Audit home, collection, product, cart và mobile navigation. Evidence: `../Discovery/tier-1-live-demo-audit.md`, `../Discovery/tier-1-interaction-checklist.md`, 2026-07-17.
- [x] Ghi khoảng trống chưa được phục vụ tốt. Evidence: `../Discovery/competitive-analysis.md`.
- [x] Không tái tạo một theme cụ thể hoặc combination quá giống. Evidence: `../Specifications/design-principles-and-prototype-criteria.md` xác định customer outcomes thay vì competitor composition/code.
- [x] Chốt feature nào tạo giá trị và feature nào chỉ tăng support burden. Evidence: `../Specifications/design-principles-and-prototype-criteria.md`, `../Specifications/mvp-feature-matrix.md`.

Đầu ra: `../Discovery/competitive-analysis.md` hoặc Figma board có ngày khảo sát và URL nguồn.

## 6. Naming và thương hiệu

- [x] Basic screen loại tên trùng Shopify products/themes; professional clearance vẫn pending. Evidence: `../Discovery/naming-audit.md`.
- [ ] Không dùng tên công ty, platform, ngành hoặc lợi ích SEO chung chung.
- [x] Kiểm tra Theme Store, search engine và trademark cơ bản. Evidence: `../Discovery/naming-audit.md`, 2026-07-17.
- [ ] Chốt tên preset riêng biệt, dễ hiểu.
- [ ] Thiết kế logo/listing identity sau khi tên được duyệt nội bộ.

## 7. Business model

Lập mô hình tối thiểu:

- Giá niêm yết dự kiến.
- Shopify revenue share và processing fee hiện hành.
- Chi phí demo content, QA, documentation và support.
- Số ticket dự kiến trên 100 sales.
- Ngân sách cập nhật platform mỗi quý.
- Điểm hòa vốn theo số license.

Không định giá chỉ dựa trên số section. Giá trị đến từ độ tin cậy, khác biệt, demo, support và khả năng giúp merchant bán hàng.

## Exit criteria

- [x] Product brief được duyệt. Evidence: `../Discovery/product-brief.md`, 2026-07-17.
- [x] Có kế hoạch provenance/license; bằng chứng Skeleton import sẽ bổ sung ở Foundation. Evidence: `../Governance/source-provenance-and-licenses.md`, `../Governance/asset-license-register.md`.
- [x] Có competitive analysis. Evidence: `../Discovery/competitive-analysis.md`, 2026-07-17.
- [x] Có 3–5 trụ cột khác biệt đo được. Evidence: `../Specifications/design-principles-and-prototype-criteria.md`, DP-01 đến DP-05.
- [x] Có danh sách out-of-scope để kiểm soát dự án. Evidence: `../Specifications/mvp-feature-matrix.md`.
- [x] Có tên nội bộ và hướng naming. Evidence: `../Discovery/naming-audit.md`; commercial name provisional.
