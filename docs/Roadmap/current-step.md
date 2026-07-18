# Current step — Điểm tiếp tục của dự án

> Tệp này là nguồn trạng thái ngắn gọn để tiếp tục dự án giữa các phiên làm việc. Sau mỗi thay đổi đã được kiểm tra, cập nhật mục **Đã hoàn thành**, **Bằng chứng** và **Việc tiếp theo**. Không đánh dấu hoàn thành nếu chưa đạt tiêu chí nghiệm thu tương ứng trong roadmap.

## Trạng thái hiện tại

| Trường | Giá trị |
|---|---|
| Cập nhật lần cuối | 2026-07-18 (Asia/Bangkok) |
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
- [x] Baseline storefront và Theme Editor smoke test trên development store đã pass theo xác nhận của chủ dự án.

## Đang thực hiện

- [x] Audit trực tiếp demo Tier 1 trên home/collection/product/cart/mobile navigation trước design gate.
- [x] Hoàn tất structural live-demo notes cho Palo Alto/SoMa và Blum/Celia.
- [x] Hoàn tất structural live-demo notes cho Pipeline/Clean và Stiletto/Stiletto.
- [x] Hoàn tất structural live-demo notes cho Sleek/Glossy và Concept/Tech; đủ 7/7 Tier 1 themes.
- [x] Hoàn tất owner spot-check cho Stiletto, Pipeline và Concept.
- [x] Nhận và lưu Stiletto owner spot-check: mobile quick view/cart gọn, ngắn nhưng đủ thông tin.
- [x] Nhận và lưu Pipeline owner spot-check: cart bình thường; hover quick-add sizes hữu ích.
- [x] Nhận và lưu Concept owner spot-check: mobile UI tối giản, bottom task bar và bottom sheets hiệu quả.
- [x] Chuyển findings Tier 1 thành năm measurable design principles và prototype acceptance criteria.

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

- Tier 1 market audit hoàn tất: 7/7 structural notes và 3/3 owner spot-checks; findings sẵn sàng chuyển thành design criteria.
- Design criteria hoàn tất: prototype phải chứng minh editorial-to-product, product confidence, variant-safe quick add, one-handed mobile controls và cart clarity.
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
| Tier 1 live-demo audit | `docs/Discovery/tier-1-live-demo-audit.md` | COMPLETE FOR PHASE 0 — 7/7 structural + 3/3 spot-checks |
| Tier 1 interaction checklist | `docs/Discovery/tier-1-interaction-checklist.md` | COMPLETE — Stiletto, Pipeline, Concept |
| Stiletto owner spot-check | `docs/Discovery/evidence/tier-1/stiletto/` | COMPLETE — product quick view + populated cart |
| Pipeline owner spot-check | `docs/Discovery/evidence/tier-1/pipeline/` | COMPLETE — product-card quick add + unavailable size |
| Concept owner spot-check | `docs/Discovery/evidence/tier-1/concept/` | COMPLETE — header/task bar + cart bottom sheet |
| Naming screen | `docs/Discovery/naming-audit.md` | Basic screen complete; Narrivelle provisional, legal clearance pending |
| Provenance/license plan | `docs/Governance/source-provenance-and-licenses.md`, `docs/Governance/asset-license-register.md`, root `THIRD_PARTY_NOTICES.md` | APPROVED FOR FOUNDATION IMPORT |
| MVP scope | `docs/Specifications/mvp-feature-matrix.md` | LOCKED — priority/owner/acceptance/out-of-scope defined |
| Skeleton baseline | `theme/`, upstream `a4f32d393b9eadf6c4403318ca39116832e5d1df`, commit `7fdb6a1` | 39 files inspected; Theme Check zero offenses |
| Documentation structure | `docs/README.md` | Roadmap/Discovery/Specifications/Governance separated |
| Dev-store baseline | Storefront + Theme Editor smoke test | PASS — owner confirmation, 2026-07-17 |
| Design principles/prototype gate | `docs/Specifications/design-principles-and-prototype-criteria.md` | APPROVED FOR PHASE 0 — 2026-07-18 |

## Việc tiếp theo — theo thứ tự

1. Gán tên owner và target date cho workstreams.
2. Thực hiện professional trademark clearance trước khi public brand/listing assets.
3. Review toàn bộ exit criteria 01–02 để đóng Phase 0 và chuyển Phase 1.

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
- Baseline storefront/Theme Editor smoke test pass theo xác nhận của chủ dự án.
- Bắt đầu Tier 1 live-demo audit; lưu partial evidence cho Prestige/Couture trên home, collection, product và navigation structure.
- Không đánh dấu Prestige complete vì chưa kiểm chứng cart, viewport/mobile interactions và screenshots.
- Hoàn tất structural live-demo notes cho Palo Alto/SoMa và Blum/Celia; cả hai giữ trạng thái partial vì thiếu populated-cart/mobile screenshots.
- Xác nhận outfit/cross-sell UI là parity; differentiation phải nằm ở variant-aware state, product-confidence hierarchy và opinionated merchant defaults.
- Hoàn tất structural live-demo notes cho Pipeline/Clean và Stiletto/Stiletto; cả hai giữ trạng thái partial vì thiếu populated-cart/mobile screenshots.
- Ghi nhận Pipeline là benchmark variant-rich product cards/cart threshold và Stiletto là benchmark product-confidence hierarchy.
- Hoàn tất structural live-demo notes cho Sleek/Glossy và Concept/Tech; Tier 1 đạt 7/7 themes ở mức structural audit.
- Ghi nhận Sleek là benchmark bundle/content breadth và Concept là benchmark mobile task access/variant switching.
- Đơn giản hóa interaction checklist: bỏ deep audit và screenshot bắt buộc vì không phải Theme Store requirement và không đáng chi phí ở Phase 0.
- Chấp nhận structural audit 7/7 là đủ; accessibility và commerce behavior sẽ được test trên chính Narrivelle.
- Next: tạo measurable design principles/prototype acceptance criteria.
- Nhận Stiletto spot-check từ chủ dự án; lưu hai ảnh mobile và kết luận hierarchy gọn, đầy đủ.
- Nhận Pipeline spot-check; progressive-reveal size quick add là pattern nên học nhưng cần mobile/keyboard fallback.
- Nhận Concept spot-check; xác nhận one-hand task bar và bottom-sheet overlays là mobile patterns nên đưa vào design criteria.
- Hoàn tất Tier 1 market audit cho Phase 0; không cần audit thêm đối thủ.
- Chuyển findings thành `docs/Specifications/design-principles-and-prototype-criteria.md`: năm principle đo được, boundaries chống sao chép và prototype gate cho home, collection, product, cart, mobile navigation.
