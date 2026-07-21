# Interaction architecture standard

Status: **MANDATORY — 2026-07-20**

Tài liệu này là tiêu chuẩn mặc định cho mọi flow storefront có nhiều thao tác liên tiếp như filter, sort, pagination, predictive search, variant selection, cart update và quick add. Mỗi phiên triển khai phải đọc tiêu chuẩn này từ `Roadmap/current-step.md` trước khi sửa code liên quan.

## Nguyên tắc quyết định

- Thiết kế toàn bộ flow và nguồn trạng thái trước khi triển khai từng control hoặc vá từng hành vi.
- Liquid/HTML và URL chuẩn là nền tảng hoạt động được khi JavaScript không chạy.
- JavaScript chỉ progressive-enhance trải nghiệm; không sao chép business logic, pricing, inventory hoặc query logic của Shopify.
- Một interaction boundary có một controller và một nguồn trạng thái. Sort, filter, pagination và history của cùng collection không được tách thành các controller cạnh tranh.
- Chọn rendering boundary nhỏ nhất chứa trọn trạng thái cần cập nhật. Không reload document nếu chỉ một section cần thay đổi.
- Không mặc định dùng AJAX cho tương tác đơn giản. Dùng khi người dùng dự kiến thao tác liên tiếp và lợi ích lớn hơn chi phí quản lý loading, lỗi, history và concurrency.

## Thiết kế bắt buộc trước khi viết UI

Với mỗi flow tương tác, phải xác định và ghi rõ:

1. **State:** nguồn sự thật nằm ở URL, form, Shopify response hay component nào.
2. **Event:** thao tác nào kích hoạt cập nhật và thao tác nào cần debounce.
3. **Render boundary:** phần nhỏ nhất được fetch và thay thế atomically.
4. **Server ownership:** phần dữ liệu/quy tắc nào Shopify phải tiếp tục xử lý.
5. **URL/history:** trạng thái có bookmark/share được không; Back/Forward xử lý thế nào.
6. **Continuity:** scroll, drawer, nhóm mở, focus và input đang thao tác được giữ ra sao.
7. **Async states:** loading, empty, error, retry và live announcement.
8. **Concurrency:** hủy request cũ và chặn stale response ghi đè kết quả mới.
9. **Fallback:** hành vi chuẩn khi JavaScript không tải hoặc fetch thất bại.
10. **Lifecycle:** listener, observer và controller tồn tại thế nào sau section render hoặc Theme Editor event.

Nếu chưa trả lời được các mục trên, flow chưa sẵn sàng để triển khai production.

## Luồng chuẩn cho server-rendered interaction

```text
User action
  → controller đọc state từ form/URL
  → chuẩn hóa params và bỏ giá trị rỗng
  → hủy request cũ
  → đặt loading/aria-busy
  → fetch Shopify section với URL chuẩn
  → parse và kiểm tra response
  → chỉ request mới nhất được commit
  → thay render boundary atomically
  → cập nhật URL/history
  → khôi phục drawer/group/focus/scroll cần thiết
  → announce kết quả và xóa loading
```

Back/Forward phải đi qua cùng pipeline nhưng không tạo thêm history entry.

## Quy tắc implementation

- Ưu tiên event delegation trên boundary ổn định thay vì gắn listener lại cho từng control sau mỗi render.
- Giữ outer controller ổn định nếu thay `innerHTML`; không tạo controller lồng nhau hoặc listener tích lũy.
- Dùng `AbortController` và request sequence/token; chỉ abort là chưa đủ để bảo vệ khỏi mọi stale response.
- Chỉ cập nhật URL sau response hợp lệ; dùng `pushState` cho action mới và `popstate` cho Back/Forward.
- Response phải được parse và tìm đúng section/controller trước khi thay DOM. Response lỗi không được phá UI hiện tại.
- Loading không được khóa khả năng thoát drawer hoặc navigation thiết yếu.
- Focus restore phải ưu tiên control vừa thao tác; nếu control biến mất, dùng fallback hợp lý trong component.
- CSS wrapper mới phải được kiểm tra trong layout context thực tế. Tránh `display: contents` cho element là grid/flex item hoặc interaction boundary nếu chưa chứng minh an toàn cho layout và accessibility tree.
- Form GET/link chuẩn phải còn hợp lệ để no-JavaScript, open-in-new-tab và direct URL vẫn hoạt động.

## Performance budget theo hành vi

- Không full-page reload cho filter, sort hoặc pagination khi Shopify Section Rendering có thể cập nhật đúng boundary.
- Không fetch toàn bộ catalog về client để tự lọc; server tiếp tục query/paginate.
- Không phát nhiều request có thể tránh được; debounce text/range input, thay đổi lựa chọn rời rạc có thể phản hồi ngay.
- Không tải thêm runtime/dependency khi Web APIs hiện có đủ đáp ứng.
- DOM replacement phải giới hạn trong interaction boundary; header, footer và section không liên quan không được render lại.

## Definition of Done

- [ ] Có fallback không JavaScript và direct URL hoạt động.
- [ ] State kết hợp đúng qua nhiều thao tác liên tiếp; không bắt người dùng xóa lựa chọn cũ để chọn mới.
- [ ] Không document reload nếu flow đã chọn section rendering.
- [ ] Back/Forward, bookmark và share URL đúng.
- [ ] Rapid actions không tạo stale UI; loading luôn được dọn.
- [ ] Drawer/group/focus/scroll continuity được kiểm tra theo contract.
- [ ] Loading, empty, error và accessibility announcement được kiểm tra.
- [ ] Mobile 320/375, desktop, keyboard và Theme Editor lifecycle pass.
- [ ] Đo layout trước và sau async replacement; không chỉ kiểm tra initial render.
- [ ] Validator, JavaScript syntax, Theme Check và `git diff --check` pass.
- [ ] Evidence và trạng thái gate được cập nhật trong `Roadmap/current-step.md`.

## Collection discovery áp dụng chuẩn

Collection dùng URL/form GET làm source of truth, Shopify Section Rendering làm server renderer và một `collection-discovery` controller điều phối filter, sort, active filters, pagination và history. Controller giữ outer boundary ổn định, chống stale response, thay nội dung atomically và khôi phục drawer/group/focus. Đây là implementation tham chiếu cho các flow server-rendered tương tự, không phải đoạn code để sao chép máy móc sang mọi component.
