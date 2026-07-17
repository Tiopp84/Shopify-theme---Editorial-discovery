# Roadmap xây dựng Shopify Theme để bán trên Theme Store

Thư mục này là bộ tài liệu điều hành cho dự án rebuild theme thương mại. Mục tiêu là tạo một theme Shopify Online Store 2.0 nguyên bản, có chất lượng thiết kế, kỹ thuật, accessibility, performance, tài liệu và hỗ trợ đủ để gửi xét duyệt Shopify Theme Store.

> Cảnh báo pháp lý: codebase hiện tại dựa trên Dawn chỉ được dùng để nghiên cứu hành vi, lập specification và kiểm chứng ý tưởng. Không copy Liquid, CSS, JavaScript hoặc cấu trúc trải nghiệm Dawn sang sản phẩm nộp mới. Shopify hiện không chấp nhận theme mới phát triển từ Dawn hoặc Horizon; hãy khởi tạo repository mới từ Shopify Skeleton Theme hoặc code hoàn toàn nguyên bản.

## Cách sử dụng bộ tài liệu

Đọc và thực hiện theo thứ tự:

1. [01-product-and-eligibility.md](01-product-and-eligibility.md) — điều kiện đăng bán, định vị, quyền sở hữu và bằng chứng nguồn gốc.
2. [02-scope-and-feature-matrix.md](02-scope-and-feature-matrix.md) — phạm vi MVP, tính năng bắt buộc và khác biệt.
3. [03-architecture-and-engineering.md](03-architecture-and-engineering.md) — kiến trúc, conventions và nguyên tắc implementation.
4. [04-design-and-merchant-ux.md](04-design-and-merchant-ux.md) — art direction, storefront UX và Theme Editor UX.
5. [05-build-roadmap.md](05-build-roadmap.md) — thứ tự build theo phase và tiêu chí nghiệm thu.
6. [06-quality-accessibility-performance.md](06-quality-accessibility-performance.md) — QA, accessibility, performance và browser matrix.
7. [07-demo-documentation-support.md](07-demo-documentation-support.md) — presets, demo stores, tài liệu và support operation.
8. [08-submission-and-release.md](08-submission-and-release.md) — clean package, review, release và vận hành sau bán.
9. [09-project-board.md](09-project-board.md) — backlog cấp cao và trạng thái dự án.
10. [10-release-gate.md](10-release-gate.md) — checklist cuối; không submit nếu còn mục bắt buộc chưa đạt.

## Quy tắc trạng thái

Mỗi hạng mục dùng một trạng thái:

- `NOT STARTED`: chưa bắt đầu.
- `IN PROGRESS`: đang triển khai.
- `BLOCKED`: có blocker được ghi rõ.
- `IN REVIEW`: đã code xong, đang review/QA.
- `DONE`: đạt Definition of Done và có bằng chứng.

Không đánh dấu `DONE` chỉ vì đã viết code. Mỗi mục phải có test, kiểm tra Theme Editor, responsive, keyboard và ghi nhận bằng chứng phù hợp.

## Definition of Done toàn dự án

- [ ] Codebase đủ điều kiện pháp lý và tính nguyên bản để submit.
- [ ] Theme có định vị ngành và art direction khác biệt rõ ràng.
- [ ] Tất cả template, feature và interaction bắt buộc hoạt động.
- [ ] `shopify theme check` đạt zero unapproved offenses.
- [ ] Lighthouse trung bình đạt ít nhất 60 Performance và 90 Accessibility trên home, product, collection; mục tiêu nội bộ là 75/95.
- [ ] Core commerce flows được smoke test trên desktop, mobile và browser matrix.
- [ ] Clean install không phụ thuộc dữ liệu của demo store.
- [ ] Demo, documentation, support form và release notes đã public.
- [ ] License của font, icon, hình ảnh và dependency đã được lưu hồ sơ.
- [ ] Release gate trong `10-release-gate.md` được ký duyệt đầy đủ.

## Nguồn chính thức cần kiểm tra trước mỗi submission

- Shopify Theme Store requirements: https://shopify.dev/docs/storefronts/themes/store/requirements
- Theme review process: https://shopify.dev/docs/storefronts/themes/store/review-process/submit-theme
- Theme testing checklist: https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist
- Theme architecture: https://shopify.dev/docs/storefronts/themes/architecture
- Theme Check: https://shopify.dev/docs/storefronts/themes/tools/theme-check
- Revenue share: https://shopify.dev/docs/storefronts/themes/store/revenue-share

Yêu cầu Shopify có thể thay đổi. Product owner phải kiểm tra lại các trang trên khi bắt đầu dự án, trước beta và ngay trước submission.
