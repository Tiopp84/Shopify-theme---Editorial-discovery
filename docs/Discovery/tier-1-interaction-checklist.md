# Tier 1 interaction spot-check

Ngày tạo: 2026-07-17 (Asia/Bangkok)

Trạng thái: **COMPLETE — 3/3 OWNER SPOT-CHECKS**

## Mục đích

Structural audit đã phủ đủ 7/7 theme. Không cần chụp hàng loạt screenshot hoặc kiểm thử accessibility của theme đối thủ. Những việc đó không phải yêu cầu Shopify Theme Store và không trực tiếp nâng chất lượng source code của Narrivelle.

Chỉ giữ ba spot-check ngắn để trả lời ba quyết định thiết kế còn quan trọng:

- [x] **Stiletto — product confidence:** bố cục mobile rất gọn; thông tin ngắn gọn nhưng đầy đủ. Quick view giữ product, color, size, mô tả và CTA rõ; populated cart ưu tiên variant, quantity, shipping status, subtotal và checkout. Evidence: `evidence/tier-1/stiletto/`.
- [x] **Pipeline — variant cards/cart:** cart không có gì đặc sắc; product card hover để lộ quick-add sizes là pattern hữu ích và thể hiện size unavailable rõ. Evidence: `evidence/tier-1/pipeline/`.
- [x] **Concept — mobile tasks:** UI tối giản, không rối mắt; bottom task bar luân phiên với header theo scroll và bottom-sheet drawers rất hợp lý cho mobile. Evidence: `evidence/tier-1/concept/`.

Mỗi theme tối đa khoảng 5–10 phút. Không cần test bốn theme còn lại.

## Screenshot có cần không?

Không bắt buộc. Chỉ chụp một ảnh khi gặp pattern đặc biệt khó mô tả bằng một câu hoặc muốn dùng làm visual reference trong design phase. Không cần tạo bộ evidence đầy đủ.

## Cách gửi kết quả

Chỉ cần gửi lại ba dòng:

```text
Stiletto: ...
Pipeline: ...
Concept: ...
```

## Kết quả đã nhận

### Stiletto — COMPLETE

- Nhận xét của chủ dự án: **bố cục rất gọn, thông tin ngắn gọn nhưng đầy đủ**.
- Pattern nên học: progressive disclosure trong quick view, CTA mua cố định và cart hierarchy tập trung vào tác vụ chính.
- Điều cần tránh: không để panel cuộn dài che mất CTA hoặc khiến nội dung mô tả cạnh tranh với variant controls.
- Acceptance direction cho Narrivelle: trên mobile, product purchase panel phải hiển thị product context, variant selectors và primary CTA trong một flow dễ quét; cart phải nhìn thấy item/variant/quantity/subtotal/checkout mà không cần tìm kiếm.
- Screenshots do chủ dự án cung cấp:
  - `evidence/tier-1/stiletto/stiletto-mobile-product-quick-view.png`
  - `evidence/tier-1/stiletto/stiletto-mobile-cart-populated.png`

### Pipeline — COMPLETE

- Nhận xét của chủ dự án: cart không có gì đặc sắc; hover quick add để hiện size khá hay.
- Pattern nên học: desktop card giữ giao diện gọn ở trạng thái nghỉ, chỉ lộ size controls khi người dùng thể hiện intent; size unavailable được phân biệt ngay.
- Điều cần tránh: không phụ thuộc hover duy nhất vì mobile/keyboard không có hover tương đương.
- Acceptance direction cho Narrivelle: desktop có thể progressive-reveal quick add; mobile và keyboard phải có trigger/fallback rõ, variant unavailable không được cho add nhầm.
- Screenshots: `evidence/tier-1/pipeline/pipeline-desktop-product-card-quick-add.png`, `evidence/tier-1/pipeline/pipeline-desktop-product-card-unavailable-size.png`.

### Concept — COMPLETE

- Nhận xét của chủ dự án: giao diện tối giản, không gây rối mắt; đánh giá rất cao mobile UI.
- Pattern nên học: bottom task bar giữ Home/Menu/Search/Shop/Cart/Account trong tầm ngón tay và luân phiên với header theo scroll.
- Pattern nên học: drawer mở từ dưới như bottom sheet phù hợp mobile hơn side drawer, đồng thời giữ context nền rõ.
- Điều cần tránh: không để task bar che nội dung/CTA; cơ chế show/hide theo scroll phải ổn định, có reduced-motion consideration và không làm mất focus.
- Acceptance direction cho Narrivelle: high-frequency mobile tasks phải reachable bằng một tay; overlay commerce ưu tiên bottom sheet khi nội dung phù hợp; header và bottom bar không cùng chiếm diện tích thường trực.
- Screenshots: `evidence/tier-1/concept/concept-mobile-header-hero.png`, `evidence/tier-1/concept/concept-mobile-bottom-task-bar.png`, `evidence/tier-1/concept/concept-mobile-cart-bottom-sheet.png`.

## Kết luận 3/3

- Stiletto: học hierarchy gọn và đầy đủ cho product/cart.
- Pipeline: học progressive-reveal quick-add sizes, có unavailable state và non-hover fallback.
- Concept: học one-hand task access và bottom-sheet overlays trên mobile.

Spot-check hoàn tất. Không cần kiểm tra thêm bốn theme còn lại.

Nếu không muốn thực hiện spot-check, có thể bỏ qua và dùng structural audit hiện tại để chuyển sang design principles. Rủi ro chấp nhận được là một vài interaction detail của đối thủ có thể chưa được ghi nhận; chúng ta vẫn kiểm thử accessibility và commerce behavior đầy đủ trên chính Narrivelle trong các phase build/QA.
