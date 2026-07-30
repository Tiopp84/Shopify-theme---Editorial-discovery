# Phase 4 owner edge review

Status: **PASS — 2026-07-22**

Owner evidence received 2026-07-22 confirms at desktop width: long title wraps without price overlap, missing-media placeholder preserves the card frame, sold-out badge/opacity are correct, and Sidebar spacing/price inputs/product grid render without visible overflow.

Owner subsequently confirmed Drawer interaction and 375/320 mobile checks pass. A separate predictive-search missing-media regression was discovered from live data and remediated in the predictive result media frame.

Mục tiêu của review này là đóng các bằng chứng live-data còn thiếu cho product card và collection layout. Không cần sửa code nếu tất cả tiêu chí dưới đây pass.

## Chuẩn bị

1. Chạy development theme từ repository root:

   ```sh
   shopify theme dev --path theme
   ```

2. Trong development store, tạo hoặc chuẩn bị một collection test có ít nhất sáu product và ba fixture sau:

   - Sold out: product Active, có media, mọi variant hết inventory và tắt Continue selling when out of stock.
   - Missing media: product Active, không có image/video.
   - Long title: product Active với title dài ít nhất 80 ký tự và có media.

3. Chỉ dùng dữ liệu test hoặc ghi lại giá trị cũ trước khi sửa product hiện có. Không publish development theme lên live store.

## A. Product-card edge states

Kiểm tra collection test ở 1440 px, 375 px và 320 px.

- Sold out: badge `Sold out` nằm trên media, không đồng thời hiện `Sale`, card vẫn mở đúng product, media chỉ giảm opacity chứ title/price vẫn đọc rõ.
- Missing media: placeholder giữ đúng tỷ lệ đã chọn, không làm thay đổi chiều cao hàng, toàn bộ placeholder mở đúng product và có accessible name.
- Long title: title xuống dòng tự nhiên, không đè price/card kế bên và không gây horizontal overflow.
- Ở 375/320 px, title và price chuyển thành hai hàng khi cần; text không bị cắt và grid không vượt viewport.
- Dùng Tab tới từng card: focus visible, link destination đúng và focus state không làm layout dịch chuyển.

## B. Collection spacing

Ở Theme Editor, chọn collection test và `Desktop filter layout = Sidebar`.

- 1440/1920 px: collection hero không chiếm quá mức first viewport; toolbar nằm gọn giữa hero và results.
- Facet rail rộng ổn định khoảng 15rem; product grid nhận phần chiều ngang còn lại.
- Hai price input co lại trong rail, không tràn hoặc đè nhau.
- Product grid, story insert và pagination thẳng hàng với vùng results.
- 375/320 px: hero, toolbar, active filters và product grid không horizontal overflow.

## C. Desktop filter layout

1. Chọn `Sidebar`: facets hiển thị bên trái, groups mở, sort nằm trên toolbar và product grid ở bên phải.
2. Chọn `Drawer`: facet rail biến mất, product grid dùng toàn bộ chiều rộng, nút Filters mở dialog từ bên trái và groups đóng mặc định.
3. Trong Drawer, kiểm tra Escape, click backdrop và nút Close đều đóng dialog và trả focus về nút Filters.
4. Chọn một checkbox filter: URL và product results cập nhật, drawer mở lại đúng group và focus quay về option vừa chọn.
5. Dùng browser Back/Forward: filter/sort, product count và layout đang chọn vẫn đúng.
6. Ở 375/320 px: cả hai desktop setting đều handoff sang cùng mobile filter drawer; không xuất hiện desktop sidebar hoặc desktop filter button.

## Exit criteria

- Tất cả mục A, B và C pass trên Shopify preview origin.
- Không có Liquid error, console error mới hoặc horizontal overflow.
- Filter/sort/pagination và collection story vẫn hoạt động sau AJAX replacement.
- Owner phản hồi theo mẫu: `PASS Phase 4 edge review — product cards / spacing / filter layouts` hoặc ghi rõ mục fail kèm viewport và screenshot.
