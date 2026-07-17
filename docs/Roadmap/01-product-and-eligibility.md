# 01 — Product strategy và điều kiện đủ để đăng bán

## 1. Mục tiêu

Xác lập một sản phẩm có thị trường, có quyền phân phối, khác biệt đủ mạnh và có khả năng được Shopify xét duyệt. Phase này hoàn thành trước khi viết component production.

## 2. Điều kiện nguồn gốc code

- [ ] Tạo repository mới từ Shopify Skeleton Theme hoặc code nguyên bản.
- [ ] Lưu commit khởi tạo và lịch sử phát triển liên tục.
- [ ] Không copy file hoặc đoạn code đáng kể từ Dawn/Horizon.
- [ ] Không port nguyên markup rồi chỉ đổi class hoặc styling.
- [ ] Không dùng code lấy từ commercial theme khác.
- [ ] Lập `THIRD_PARTY_NOTICES.md` cho dependency và asset bên thứ ba.
- [ ] Lưu invoice/license của font, icon, ảnh demo và thư viện.
- [ ] Review license trước khi thêm dependency.

Có thể dùng theme hiện tại để lập feature specification, test merchant workflow và ghi nhận edge case. Không dùng nó làm source code cho bản submission.

## 3. Product brief bắt buộc

Điền đầy đủ trước khi qua phase tiếp theo:

| Trường | Quyết định |
|---|---|
| Tên nội bộ | TBD |
| Tên theme dự kiến | TBD |
| Merchant mục tiêu | Fashion/apparel/lifestyle |
| Quy mô catalog | TBD: small, medium, large |
| Vấn đề chính | TBD |
| Lợi thế cạnh tranh | TBD |
| Mức giá mục tiêu | $320 launch; $350–400 sau validation |
| Số preset | 2 ở bản đầu |
| Ngôn ngữ support | TBD |
| SLA support | Phản hồi trong 2 business days |

Một positioning statement mẫu:

> Theme editorial commerce cho thương hiệu thời trang có catalog trung bình đến lớn, kết hợp trải nghiệm hình ảnh, lookbook có thể mua và discovery tối ưu trên mobile.

## 4. Trụ cột khác biệt

Chọn tối đa 3–5 trụ cột; mỗi trụ cột phải thể hiện xuyên suốt home, collection, product và cart.

- Editorial merchandising: layout, typography và media treatment riêng.
- Shoppable storytelling: lookbook/shop-the-look tích hợp product thật.
- Fashion discovery: swatch, filter, product card và mega menu được thiết kế như một hệ thống.
- Product confidence: size guide, fit information, material/care, delivery/returns.
- Mobile commerce: navigation, filters, gallery, variants và cart tối ưu cho ngón tay.

Không coi đổi màu, font, spacing, radius, shadow hoặc animation đơn lẻ là khác biệt sản phẩm.

## 5. Nghiên cứu thị trường

- [ ] Chọn 15 theme cạnh tranh trực tiếp trên Shopify Theme Store.
- [ ] Ghi giá, rating, số preset, ngành, feature và art direction.
- [ ] Audit ít nhất home, collection, product, cart và mobile navigation.
- [ ] Ghi khoảng trống chưa được phục vụ tốt.
- [ ] Không tái tạo một theme cụ thể hoặc combination quá giống.
- [ ] Chốt feature nào tạo giá trị và feature nào chỉ tăng support burden.

Đầu ra: `competitive-analysis.md` hoặc Figma board có ngày khảo sát và URL nguồn.

## 6. Naming và thương hiệu

- [ ] Tên theme không trùng hoặc gần giống Shopify products/events.
- [ ] Không dùng tên công ty, platform, ngành hoặc lợi ích SEO chung chung.
- [ ] Kiểm tra Theme Store, search engine và trademark cơ bản.
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

- [ ] Product brief được duyệt.
- [ ] Có bằng chứng codebase hợp lệ và kế hoạch license.
- [ ] Có competitive analysis.
- [ ] Có 3–5 trụ cột khác biệt đo được.
- [ ] Có danh sách out-of-scope để kiểm soát dự án.
- [ ] Có tên nội bộ và hướng naming.
