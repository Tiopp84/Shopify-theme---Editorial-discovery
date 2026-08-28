Không thể đổi trực tiếp một **Dev store** thành **Client transfer store** trong Dev Dashboard. Hai loại này được tạo riêng; dev store dùng cho theme development/test, còn client transfer store dùng cho store được chuẩn bị để handoff/demo. Shopify hiện nói dev store không transfer được. [Shopify store types](https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores)

Nhưng không cần setting lại hoàn toàn bằng tay. Không có chức năng “clone toàn bộ store” native, nhưng có thể copy phần lớn theo luồng này:

```text
Dev demo hiện tại
├─ Theme code + Theme Editor settings → copy gần như nguyên vẹn
├─ Products/variants → export CSV → import
├─ Product images → đi theo URL trong CSV, cần kiểm tra lại
├─ Collections/pages/menus → tạo lại một phần
└─ Policies, payment, markets → cấu hình lại tối thiểu
```

Cách làm ít mệt và an toàn nhất:

1. Giữ nguyên 4 store hiện tại  
   Không xoá/sửa: hai demo dev store là “bản nguồn”, hai clean-test vẫn là nơi QA.

2. Tạo 2 Client transfer store mới  
   - `narrivelle-listing-demo`
   - `still-listing-demo`  
   Chọn cùng country/region với demo hiện tại. Chưa transfer ownership cho bất kỳ ai.

3. Copy catalog bằng CSV  
   Tại dev demo source: `Products → Export → All products → CSV for Excel/Numbers`.  
   Tại Client transfer store mới: `Products → Import` file đó.

   CSV giúp copy product/variant và có thể mang theo liên kết ảnh. Shopify xác nhận đây là luồng native để sao chép product data; collections có thể được hỗ trợ qua cột Collection, nhưng collection rules, image, description cần kiểm tra/tạo lại. [Shopify store duplication guidance](https://help.shopify.com/en/manual/shopify-admin/duplicate-store/)

4. Copy theme và Theme Editor settings  
   Đây là phần quan trọng nhất để không phải set lại giao diện.

   Ta sẽ pull **theme đang chạy trên dev demo** ra một thư mục tạm, gồm cả `config/settings_data.json` và templates, rồi push/upload nguyên trạng vào Client transfer store tương ứng.

   Không dùng package submit làm bản copy demo, vì package submit cần sạch demo-specific references. Bản copy demo có thể chứa setting trình bày thực tế của store.

5. Chỉ map lại các resource không thể tự khớp  
   Sau khi import catalog và push theme, vào Theme Editor kiểm tra các section chọn cụ thể Product/Collection/Page. Nếu resource ID khác giữa store, chỉ cần chọn lại ở những block đó — không phải dựng lại layout, typography, palette hay thứ tự section.

6. Tạo lại phần Shopify không nằm trong theme  
   Menu, collection rules, pages/blog, policies và payment-test mode không nằm trọn trong theme ZIP nên cần tái tạo/kiểm tra. Shopify cũng nêu rõ menus, pages và nhiều store settings cần cấu hình lại khi duplicate store. [Shopify duplication limitations](https://help.shopify.com/en/manual/shopify-admin/duplicate-store/)

Sau khi hoàn tất, hai Client transfer store sẽ là demo URL cho listing; hai Dev store tiếp tục là staging/QA. Shopify yêu cầu mỗi preset có demo store hoàn chỉnh, nên với Narrivelle và Still là hai preset khác nhau, hai demo store riêng là phương án đúng và an toàn. [Theme listing requirements](https://shopify.dev/docs/storefronts/themes/store/review-process/listings)

Bước tiếp theo: tạo **một** Client transfer store cho Narrivelle trước. Khi bạn ở màn hình `Stores → Add store`, gửi ảnh, tôi sẽ đi tiếp từng lựa chọn và sau đó hướng dẫn copy theme/settings mà không động vào source hiện tại.