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
- [x] Product brief được phê duyệt; English-only v1.0 với localization contract từ đầu.
- [x] Hoàn thành desk research competitive analysis 15 theme và xác định năm khoảng trống thị trường.
- [x] Hoàn thành basic naming screen; loại Loomline/Atelier khỏi public naming và chọn Narrivelle làm provisional lead.
- [x] Narrivelle được chấp thuận làm commercial name provisional; professional clearance vẫn là release/public-brand gate.
- [x] Khóa source provenance, dependency và asset license policy cho Skeleton import.
- [x] Khóa MVP feature matrix với priority, role owner, acceptance và explicit out-of-scope.
- [x] Import official Shopify Skeleton Theme HEAD `a4f32d3` bằng Shopify CLI 4.5.1.
- [x] Chạy baseline Theme Check: 39 files, zero offenses.
- [x] Lưu Skeleton baseline trong commit riêng `7fdb6a1` cùng provenance/license evidence.
- [x] Refactor tài liệu: Roadmap chỉ còn 12 tệp điều hành; discovery/specification/governance được tách riêng.
- [x] Loại `theme/shopify.theme.toml` khỏi Git để không commit development store URL.

## Đang thực hiện

- [ ] Audit trực tiếp demo Tier 1 trên home/collection/product/cart/mobile navigation trước design gate.
- [ ] Kết nối development store và chạy baseline storefront/Theme Editor smoke test.

## Quyết định đã chốt

- Merchant mục tiêu ban đầu: fashion/apparel/lifestyle.
- Số preset cho bản phát hành đầu tiên: 2.
- SLA support dự kiến: phản hồi trong 2 business days.
- Không sử dụng Dawn, Horizon hoặc commercial theme khác làm source code cho bản submission.
- Product: editorial discovery cho fashion/lifestyle catalog medium–large (100–2.000 sản phẩm).
- Giá launch: USD 350; xem xét USD 400 sau validation.
- Source baseline: Shopify Skeleton Theme, implementation và art direction nguyên bản.
- Locale v1.0: English-only nhưng mọi storefront/schema copy phải dùng translation keys; locale expansion là yêu cầu kiến trúc ngay từ đầu.

## Quyết định còn thiếu

- Professional trademark clearance cho commercial theme/preset names.
- Owner và target date cho từng workstream.

## Blocker và rủi ro hiện tại

- Cần development store URL/account permission để preview và kiểm chứng Skeleton storefront/Theme Editor baseline.
- Desk research đã có; chưa có screenshot/interaction evidence từ demo audit Tier 1.
- Yêu cầu Shopify Theme Store có thể thay đổi; phải đối chiếu tài liệu chính thức tại đầu Phase 0, trước beta và trong tuần submission.

## Bằng chứng

| Hạng mục | Vị trí | Kết quả |
|---|---|---|
| Roadmap dự án | `docs/Roadmap/README.md` đến `10-release-gate.md` | Có đủ khung phase/gate |
| Trạng thái implementation | `theme/`, `tests/` | Chưa có file production/test |
| Điểm tiếp tục | `docs/Roadmap/current-step.md` | Đã thiết lập |
| Git baseline | Commit `978cf11` trên nhánh `main` | Roadmap đã được lưu từ root commit |
| Product brief | `docs/Discovery/product-brief.md` | APPROVED — 2026-07-17 |
| Competitive analysis | `docs/Discovery/competitive-analysis.md` | 15 theme; desk research complete 2026-07-17 |
| Naming screen | `docs/Discovery/naming-audit.md` | Basic screen complete; Narrivelle provisional, legal clearance pending |
| Provenance/license plan | `docs/Governance/source-provenance-and-licenses.md`, `docs/Governance/asset-license-register.md`, root `THIRD_PARTY_NOTICES.md` | APPROVED FOR FOUNDATION IMPORT |
| MVP scope | `docs/Specifications/mvp-feature-matrix.md` | LOCKED — priority/owner/acceptance/out-of-scope defined |
| Skeleton baseline | `theme/`, upstream `a4f32d393b9eadf6c4403318ca39116832e5d1df`, commit `7fdb6a1` | 39 files inspected; Theme Check zero offenses |
| Documentation structure | `docs/README.md` | Roadmap/Discovery/Specifications/Governance separated |

## Việc tiếp theo — theo thứ tự

1. Kết nối development store và chạy storefront/Theme Editor smoke test.
2. Audit demo Tier 1 và lưu screenshot/interaction notes trước design gate.
3. Gán tên owner và target date cho workstreams.
4. Thực hiện professional trademark clearance trước khi public brand/listing assets.
5. Review toàn bộ exit criteria 01–02 để đóng Phase 0 và chuyển Phase 1.

## Nhật ký phiên làm việc

### 2026-07-17 — Thiết lập dự án

- Đã rà soát toàn bộ `docs/Roadmap`.
- Xác định dự án đang ở Phase 0 và chưa có implementation trong `theme/`/`tests/`.
- Tạo cấu trúc lưu trạng thái xuyên phiên trong tệp này.
- Khởi tạo Git repository trên nhánh `main`.
- Tạo root commit `978cf11` để lưu baseline roadmap và provenance ban đầu.
- Nghiên cứu yêu cầu Theme Store hiện hành và một số đối thủ định hướng trong nhóm fashion/editorial.
- Tạo `docs/Discovery/product-brief.md` với segment, positioning, bốn trụ cột, pricing, locale, source strategy và trade-off.
- Product brief được phê duyệt; cập nhật quyết định chính thức vào tài liệu 01.
- Khóa localization contract: English-only v1.0 nhưng không hard-code UI copy; storefront/schema keys và locale parity là yêu cầu bắt buộc.
- Hoàn thành `docs/Discovery/competitive-analysis.md`: 15 theme, price/preset/positioning/feature/art direction và năm khoảng trống thị trường.
- Xác nhận lookbook/hotspot/swatch/mega-menu/quick-buy là feature parity, không phải differentiation.
- Hoàn thành `docs/Discovery/naming-audit.md`; loại public names Loomline, Atelier và các candidate có xung đột rõ.
- Chọn `Narrivelle` làm provisional lead; giữ Project Loomline chỉ làm codename.
- Chủ dự án tiếp tục dự án với `Narrivelle`; ghi nhận tên provisional đã được chấp thuận.
- Tạo provenance/license plan, asset register và third-party notices baseline.
- Khóa `docs/Specifications/mvp-feature-matrix.md` với các quyết định cart drawer/quick add/predictive search/two presets in scope; recently viewed/voice search/app-like features out.
- Import official Skeleton vào `theme/` qua Shopify CLI; ghi upstream SHA `a4f32d393b9eadf6c4403318ca39116832e5d1df` và license notice.
- Shopify CLI tự nâng từ 4.5.0 lên 4.5.1 trong lúc init.
- Baseline Theme Check pass: 39 files, zero offenses.
- Lưu baseline source và provenance trong commit `7fdb6a1`.
- Refactor `docs/`: giữ Roadmap chỉ cho phase/gate/tracking; chuyển research sang Discovery, scope sang Specifications và provenance/license sang Governance.
- Next: kết nối dev store để smoke test storefront và Theme Editor.
