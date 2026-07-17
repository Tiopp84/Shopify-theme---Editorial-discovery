# Current step — Điểm tiếp tục của dự án

> Tệp này là nguồn trạng thái ngắn gọn để tiếp tục dự án giữa các phiên làm việc. Sau mỗi thay đổi đã được kiểm tra, cập nhật mục **Đã hoàn thành**, **Bằng chứng** và **Việc tiếp theo**. Không đánh dấu hoàn thành nếu chưa đạt tiêu chí nghiệm thu tương ứng trong roadmap.

## Trạng thái hiện tại

| Trường | Giá trị |
|---|---|
| Cập nhật lần cuối | 2026-07-17 (Asia/Bangkok) |
| Phase | Phase 0 — Discovery/eligibility |
| Milestone | M0 — Product/eligibility approved |
| Trạng thái tổng thể | IN PROGRESS |
| Release readiness | NOT READY |
| Roadmap nguồn | `docs/Roadmap/01-product-and-eligibility.md` |

## Mục tiêu đang thực hiện

Hoàn thành Phase 0 trước khi viết component production: chốt product brief, định vị khác biệt, phạm vi MVP, nghiên cứu cạnh tranh, chiến lược nguồn gốc code và hồ sơ license.

## Đã hoàn thành

- [x] Tạo bộ roadmap từ product strategy đến final release gate.
- [x] Xác nhận trạng thái ban đầu: `theme/` và `tests/` chưa có implementation production.
- [x] Thiết lập tệp `current-step.md` làm điểm tiếp tục xuyên phiên.
- [x] Khởi tạo Git repository với nhánh `main` và tạo baseline commit cho toàn bộ roadmap.
- [x] Hoàn thành market scan định hướng ban đầu và lập product brief đề xuất để phê duyệt.

## Đang thực hiện

- [ ] Hoàn thiện product brief trong Phase 0.
- [ ] Phê duyệt hoặc chỉnh sửa `product-brief-proposal.md`.

## Quyết định đã chốt

- Merchant mục tiêu ban đầu: fashion/apparel/lifestyle.
- Số preset cho bản phát hành đầu tiên: 2.
- Giá mục tiêu ban đầu: USD 320; xem xét USD 350–400 sau validation.
- SLA support dự kiến: phản hồi trong 2 business days.
- Không sử dụng Dawn, Horizon hoặc commercial theme khác làm source code cho bản submission.

## Quyết định còn thiếu

- Tên nội bộ và hướng đặt tên thương mại.
- Quy mô catalog mục tiêu: small, medium hay large.
- Merchant problem chính và positioning statement chính thức.
- 3–5 trụ cột khác biệt có thể kiểm chứng.
- Ngôn ngữ storefront/schema hỗ trợ khi phát hành.
- Chọn Shopify Skeleton Theme hay code hoàn toàn nguyên bản.
- Danh sách tính năng MVP chính thức và backlog post-launch.
- Owner và target date cho từng workstream.

## Blocker và rủi ro hiện tại

- Chưa thể bắt đầu production build khi product brief và nguồn gốc code chưa được chốt.
- Chưa có competitive analysis để chứng minh khoảng trống thị trường và tính khác biệt.
- Yêu cầu Shopify Theme Store có thể thay đổi; phải đối chiếu tài liệu chính thức tại đầu Phase 0, trước beta và trong tuần submission.

## Bằng chứng

| Hạng mục | Vị trí | Kết quả |
|---|---|---|
| Roadmap dự án | `docs/Roadmap/README.md` đến `10-release-gate.md` | Có đủ khung phase/gate |
| Trạng thái implementation | `theme/`, `tests/` | Chưa có file production/test |
| Điểm tiếp tục | `docs/Roadmap/current-step.md` | Đã thiết lập |
| Git baseline | Commit `978cf11` trên nhánh `main` | Roadmap đã được lưu từ root commit |
| Product brief đề xuất | `docs/Roadmap/product-brief-proposal.md` | PROPOSED — chờ phê duyệt |

## Việc tiếp theo — theo thứ tự

1. Người quyết định phê duyệt/chỉnh sửa `product-brief-proposal.md`.
2. Lập `competitive-analysis.md` với 15 theme cạnh tranh và URL/ngày khảo sát.
3. Thực hiện naming/trademark audit; chốt tên theme/preset.
4. Sau phê duyệt, cập nhật quyết định chính thức vào tài liệu 01–02.
5. Chốt chiến lược source code cùng hồ sơ provenance/license.
6. Khóa feature matrix MVP và out-of-scope.
7. Chỉ chuyển sang Phase 1 khi toàn bộ exit criteria của tài liệu 01–02 được duyệt.

## Nhật ký phiên làm việc

### 2026-07-17 — Thiết lập dự án

- Đã rà soát toàn bộ `docs/Roadmap`.
- Xác định dự án đang ở Phase 0 và chưa có implementation trong `theme/`/`tests/`.
- Tạo cấu trúc lưu trạng thái xuyên phiên trong tệp này.
- Khởi tạo Git repository trên nhánh `main`.
- Tạo root commit `978cf11` để lưu baseline roadmap và provenance ban đầu.
- Nghiên cứu yêu cầu Theme Store hiện hành và một số đối thủ định hướng trong nhóm fashion/editorial.
- Tạo `product-brief-proposal.md` với segment, positioning, bốn trụ cột, pricing, locale, source strategy và trade-off.
- Next: người quyết định duyệt/chỉnh phương án; sau đó hoàn thành competitive analysis 15 theme.
