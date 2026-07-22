# Current step — Điểm tiếp tục của dự án

> Tệp này là nguồn trạng thái ngắn gọn để tiếp tục dự án giữa các phiên làm việc. Sau mỗi thay đổi đã được kiểm tra, cập nhật mục **Đã hoàn thành**, **Bằng chứng** và **Việc tiếp theo**. Không đánh dấu hoàn thành nếu chưa đạt tiêu chí nghiệm thu tương ứng trong roadmap.

## Checklist bắt buộc khi bắt đầu mỗi phiên

1. Đọc trạng thái, blocker và **Việc tiếp theo** trong tệp này; kiểm tra Git status trước khi sửa.
2. Với mọi flow tương tác nhiều bước hoặc async, đọc và áp dụng [`../Specifications/interaction-architecture-standard.md`](../Specifications/interaction-architecture-standard.md) trước khi thiết kế UI/code.
3. Xác định trước state, controller ownership, render boundary, Shopify ownership, URL/history, continuity, async/concurrency, fallback và lifecycle; không triển khai theo từng bản vá rời rạc.
4. Kiểm tra cả initial render và trạng thái sau interaction/async DOM replacement ở viewport mục tiêu.
5. Chỉ cập nhật gate/evidence sau khi các kiểm tra tương ứng thực sự pass.

## Trạng thái hiện tại

| Trường | Giá trị |
|---|---|
| Cập nhật lần cuối | 2026-07-22 (Asia/Bangkok) |
| Phase | Phase 5 — Product detail |
| Milestone | M0 — ACHIEVED; M1 — ACHIEVED (visual polish deferred); M2 — ACHIEVED |
| Trạng thái tổng thể | IN PROGRESS |
| Release readiness | NOT READY |
| Roadmap nguồn | `docs/Roadmap/01-product-and-eligibility.md` |

## Mục tiêu đang thực hiện

Triển khai Phase 5 Product detail: media gallery/modal/video/3D, variant source of truth, product form, merchant blocks, selling plans và recommendations.

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
- [x] Tạo clickable prototype Phase 1 cho home → collection → product → cart và mobile navigation, kèm state reviewer và Shopify architecture map.
- [x] Owner chấp nhận prototype làm hướng thiết kế để chuyển sang foundation; visual polish không bị coi là final UI.
- [x] Khóa foundation architecture, token roles, typography settings, semantic main/skip link, focus và reduced-motion primitives.
- [x] Hoàn thiện foundation price/pagination snippets và button/form/visually-hidden primitives; áp dụng vào product, collection và search baseline.
- [x] Hoàn thiện responsive image và original icon primitives; bổ sung accessible navigation/account/cart labels cho header baseline.
- [x] Review Phase 2 exit criteria: clean development-store render, local validator, Theme Check và CI đều đạt; cho phép chuyển sang Phase 3.

## Đang thực hiện

- [x] Hoàn thành prototype implementation checkpoint: desktop/mobile responsive, filters/history, variant-safe product decision, cart states và accessible bottom sheets.
- [x] Hoàn thành internal comparison chứng minh khác biệt ở cấp hệ thống so với Dawn/competitor patterns; không dùng palette/font làm bằng chứng.
- [x] Owner duyệt hướng prototype để đóng M1 và chuyển phase; visual/mobile polish tiếp tục tại component reviews.
- [x] Thiết lập CI cho Theme Check, schema/locale validation và scan debug/remote URL; GitHub Actions run PASS.
- [x] Development-theme storefront clean-render pass trên các route chính; semantic/token inspection pass.
- [x] Hoàn tất Theme Editor lifecycle/settings persistence và manual keyboard/mobile/reduced-motion review theo owner confirmation.
- [x] Owner retest page width Narrow/Standard/Wide và console sau remediation hoàn tất.
- [x] Keyboard/focus, true 375/320 và zoom 200% được owner xác nhận hoàn tất.
- [x] Phase 3 account decision: giữ direct Shopify account route; authenticated account/order/address coverage chuyển sang hardening test.
- [x] Khóa Phase 3 global-shell contract và triển khai announcement, responsive header/navigation, native-dialog mobile drawer, search entry, footer Theme Blocks, newsletter và localization controls.
- [x] Manual Theme Editor/keyboard/375/browser smoke test cho global shell trên Shopify preview origin được owner xác nhận PASS.
- [x] Remediate Phase 3 desktop navigation typography regression: menu có type scale riêng, nowrap labels và responsive gap để không vỡ từng từ trong header grid.
- [x] Remediate Phase 3 desktop submenu continuity: sửa invalid spacing token giữa brand/menu; single-open submenu, outside-click close và Escape/focus restoration với native-details fallback.
- [x] Khóa Phase 4 discovery contract; triển khai shared product-card cho collection/search với stable ratio, price/sale/sold-out semantics, missing-media fallback và focus=hover parity.
- [x] Product-card live edge-state review: sold-out, missing media và representative long title PASS ở desktop/375/320 theo owner evidence 2026-07-22.
- [x] Product-card visual remediation implemented và owner/live edge-state review PASS: status trên media, metadata nhẹ, title/price decision row, sold-out/missing-media/long-title đúng ở desktop/375/320.
- [x] Triển khai collection filter/sort GET contract, desktop facets, active remove/reset và native-dialog mobile facets; automated preview sort/filter state pass.
- [x] Collection facets browser gate: true 320/375, Escape/backdrop/close focus restore, browser Back/Forward, no-results, price boundaries và post-AJAX layout pass 27/27 assertions.
- [x] Remediate collection state composition: sort và checkbox filter desktop/mobile submit ngay; active filters cộng dồn; sort được giữ; empty price params bị loại; browser interaction test pass.
- [x] Owner review collection spacing remediation PASS: compact hero/toolbar, 15rem facet rail, shrink-safe price controls, wider product grid và mobile no-overflow.
- [x] Owner review desktop filter layout setting PASS: Sidebar/left Drawer, collapsed groups, full-width grid, focus behavior và responsive handoff sang mobile drawer.
- [x] Hoàn tất static audit và owner runbook cho Phase 4 edge review; không phát hiện regression có bằng chứng trong product-card/collection code hoặc ảnh review hiện có.
- [x] Remediate drawer continuity: sau auto-filter drawer mở lại, giữ group đang mở và restore focus vào option vừa chọn; true 375 CSS px browser test pass.
- [x] Refactor collection discovery sang một AJAX section-rendering controller: không document reload, GET fallback, URL/history, AbortController/stale guard, loading/error/live status, drawer/group/focus continuity và pagination interception; browser sort/filter/Back/rapid-change pass.
- [x] Triển khai predictive search progressive enhancement: GET fallback, product/collection/page/article rendering contract, debounce, AbortController/stale guard, loading/error/live status, ArrowDown và Escape/focus; browser mobile/error regression pass.
- [x] Thêm Header `Search behavior` setting: điều hướng `/search` hoặc mở search drawer; desktop dùng left drawer, mobile dùng bottom sheet, tái sử dụng predictive controller/form và luôn giữ link tới full search page. Browser gate pass cho focus restore, `sh` trả 4 products, 375 px không overflow và `/search` vẫn là dropdown.
- [x] Remediate predictive-search missing-media live regression: product không có featured image vẫn render placeholder 4:5 trong media column, giữ alignment với các result khác.
- [x] Clamp predictive-search product title còn hai dòng trên mobile drawer; dấu ellipsis giữ result list gọn trong viewport nhỏ mà không thay đổi accessible text/destination.
- [x] Owner retest predictive missing-media, mobile title clamp và search-query casing PASS, 2026-07-22.
- [x] Owner/live-data Article fixture PASS: predictive search render đúng nhóm Articles, destination hợp lệ và không overflow ở desktop/375, 2026-07-22.
- [x] Đóng Phase 4 Discovery: filter → product flow, collection merchandising, product-card edge states, search/predictive search type coverage và error/empty/mobile gates đều đạt.
- [x] Triển khai collection banner/media và story insertion trong product grid: nội dung story lấy theo từng collection qua `custom.collection_story` metaobject reference, không tạo product giả, không thay đổi Shopify product count/filter/pagination semantics; validator và Theme Check pass.
- [x] Owner/live-data smoke pass collection story, 2026-07-22: entry metaobject riêng được gán và render đúng theo collection; collection không gán không hiển thị; filter/sort/pagination và product-count semantics không regression.

- [x] Audit trực tiếp demo Tier 1 trên home/collection/product/cart/mobile navigation trước design gate.
- [x] Hoàn tất structural live-demo notes cho Palo Alto/SoMa và Blum/Celia.
- [x] Hoàn tất structural live-demo notes cho Pipeline/Clean và Stiletto/Stiletto.
- [x] Hoàn tất structural live-demo notes cho Sleek/Glossy và Concept/Tech; đủ 7/7 Tier 1 themes.
- [x] Hoàn tất owner spot-check cho Stiletto, Pipeline và Concept.
- [x] Nhận và lưu Stiletto owner spot-check: mobile quick view/cart gọn, ngắn nhưng đủ thông tin.
- [x] Nhận và lưu Pipeline owner spot-check: cart bình thường; hover quick-add sizes hữu ích.
- [x] Nhận và lưu Concept owner spot-check: mobile UI tối giản, bottom task bar và bottom sheets hiệu quả.
- [x] Chuyển findings Tier 1 thành năm measurable design principles và prototype acceptance criteria.
- [x] Review exit criteria 01–02; Phase 0 đủ điều kiện chuyển sang Phase 1.
- [x] Thiết lập single-owner plan, workstream owner và target gate dates trong `09-project-board.md`.

## Quyết định đã chốt

- Merchant mục tiêu ban đầu: fashion/apparel/lifestyle.
- Số preset cho bản phát hành đầu tiên: 2.
- SLA support dự kiến: phản hồi trong 2 business days.
- Không sử dụng Dawn, Horizon hoặc commercial theme khác làm source code cho bản submission.
- Product: editorial discovery cho fashion/lifestyle catalog medium–large (100–2.000 sản phẩm).
- Giá launch: USD 350; xem xét USD 400 sau validation.
- Source baseline: Shopify Skeleton Theme, implementation và art direction nguyên bản.
- Locale v1.0: English-only nhưng mọi storefront/schema copy phải dùng translation keys; locale expansion là yêu cầu kiến trúc ngay từ đầu.
- Phase 0 được đóng ngày 2026-07-19; Phase 1 bắt đầu bằng prototype, không viết component production trước design gate.

## Quyết định còn thiếu

- Professional trademark clearance cho commercial theme/preset names.
- Owner và target date cho từng workstream.

## Blocker và rủi ro hiện tại

- Professional trademark clearance vẫn bắt buộc trước public brand/listing assets; không chặn prototype nội bộ.
- Demo assets mới vẫn bị chặn cho đến khi có license/provenance trong register.
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
| Phase 0 exit review/workstream plan | `docs/Roadmap/01-product-and-eligibility.md`, `02-scope-and-feature-matrix.md`, `09-project-board.md` | PASS — Phase 1 begins 2026-07-19 |
| Phase 1 core-flow prototype checkpoint | `docs/Prototype/index.html`, `prototype.css`, `prototype.js`, `prototype-map.md` | COMPLETE — syntax/diff checks pass; 4 screens, 3 dialogs, state reviewer and architecture map; owner review pending |
| Prototype differentiation comparison | `docs/Prototype/design-comparison.md` | INTERNAL COMPLETE — journal structure, numbered story grammar, variant-safe actions and commerce-first cart; owner approval pending |
| Desktop visual QA | `docs/Prototype/review-home-1440.png` | PASS WITH FIX — initial route focus scroll corrected; header link styling clarified |
| Mobile visual QA attempt | `docs/Prototype/review-home-375.png`, `review-home-320.png` | INCONCLUSIVE — Chrome headless enforces a wider layout viewport then crops output; true 320/375 CSS viewport review still required |
| M1 owner decision | Owner confirmation, 2026-07-20 | APPROVED FOR FOUNDATION — prototype defines direction/behavior, not final pixel UI |
| Foundation architecture and tokens | `docs/Specifications/foundation-architecture.md`, `theme/config/settings_schema.json`, `theme/snippets/css-variables.liquid`, `theme/assets/critical.css`, `theme/layout/theme.liquid` | STARTED — JSON parse pass; Theme Check 39 files, zero offenses |
| Foundation CI | `.github/workflows/theme-ci.yml`, `scripts/validate-theme.mjs` | PASS — GitHub Actions `Theme CI` owner-confirmed, 2026-07-20; validator and Theme Check successful |
| CI Node 24 remediation | `.github/workflows/theme-ci.yml` | PASS — checkout/setup-node v6 and Node 24; local Node 24.14 and GitHub rerun successful |
| Foundation package | `theme/Skeleton-0.1.0.zip` (Git-ignored build artifact) | PASS — Shopify CLI packaged 39 uploadable files; no `shopify.theme.toml` or credential file in archive |
| Development-store smoke runbook | `docs/Specifications/foundation-smoke-test.md` | COMPLETE — storefront automated checks and owner Theme Editor/keyboard/mobile/reduced-motion review pass |
| Development-store clean render | `docs/Specifications/foundation-smoke-test.md`, `docs/Specifications/foundation-home-1440.png` | PASS — core routes render, 404 behaves correctly, no detected Liquid error, semantic/token checks pass |
| Foundation commerce primitives | `theme/snippets/price.liquid`, `pagination.liquid`, `theme/assets/critical.css`, product/collection/search sections | PASS — Theme Check 41 files zero offenses; live product/collection/search render HTTP 200 with price markup and no Liquid error |
| Foundation media/icon primitives | `theme/snippets/image.liquid`, `icon.liquid`, `theme/sections/header.liquid` | PASS — Theme Check 42 files zero offenses; live preview confirms srcset, lazy loading, labelled navigation and inline account/cart icons |
| Owner foundation review | `docs/Specifications/foundation-smoke-test.md` | PASS — settings/layout/skip link/editor lifecycle, keyboard/focus, 375/320, zoom 200% and reduced-motion review complete |
| Owner remediation retest | `docs/Specifications/foundation-smoke-test.md` | PASS — page-width difference visible and console remediation confirmed, 2026-07-20; account popover functionality explicitly deferred to Phase 3 |
| Phase 2 exit review | `docs/Roadmap/03-architecture-and-engineering.md`, `docs/Roadmap/05-build-roadmap.md` | PASS — validator 55 files/43 storefront keys/64 schema keys; Theme Check 42 files zero offenses; clean render and CI evidence complete, 2026-07-20 |
| Phase 3 global shell slice | `docs/Specifications/global-shell-contract.md`, `theme/sections/announcement-bar.liquid`, `header.liquid`, `footer.liquid`, `theme/blocks/footer-menu.liquid`, `newsletter.liquid`, `theme/assets/header-shell.js` | PASS — validator 59 files/55 storefront keys/72 schema keys; Theme Check 45 files zero offenses; preview render and owner interaction smoke pass, 2026-07-20 |
| Phase 4 product-card slice | `docs/Specifications/discovery-contract.md`, `docs/QA/phase-4-owner-edge-review.md`, `theme/snippets/product-card.liquid`, `theme/sections/collection.liquid`, `search.liquid` | OWNER/LIVE-DATA PASS — sold-out semantics, linked missing-media fallback and long-title wrapping pass at desktop/375/320; collection spacing and Sidebar/Drawer behavior approved 2026-07-22 |
| Phase 4 collection facets | `theme/snippets/facets.liquid`, `theme/assets/collection-facets.js`, `theme/sections/collection.liquid`, `docs/Specifications/collection-facets-review-1440.png` | BROWSER GATE PASS — 27/27 assertions at 1440/375/320 cover sort, cumulative filter continuity, Back/Forward, no-results, price bounds, drawer width, Escape/backdrop/close focus restore, no overflow and post-AJAX layout; Theme Check zero offenses |
| Phase 4 search/predictive search | `theme/sections/search.liquid`, `predictive-search.liquid`, `theme/assets/predictive-search.js`, `docs/Specifications/discovery-contract.md` | OWNER/BROWSER PASS — endpoint/search fallback HTTP 200; rapid typing, missing-media placeholder, mobile title clamp, query casing, 375 no-overflow, ArrowDown, Escape/focus and blocked-network error announcement pass; live Products/Collections/Pages/Articles all observed |
| Phase 4 collection banner/story insertion | `theme/sections/collection.liquid`, `theme/locales/en.default.schema.json` | OWNER/LIVE-DATA PASS — current collection's `custom.collection_story` metaobject reference renders independently; unassigned collections omit the insert; filter/sort/pagination and product-count semantics remain intact; validator 65 files/88 storefront keys/90 schema keys; Theme Check 49 files zero offenses; owner confirmation 2026-07-22 |
| Phase 4 exit review | `docs/Specifications/discovery-contract.md`, `docs/QA/phase-4-owner-edge-review.md`, `docs/Roadmap/05-build-roadmap.md` | PASS — discovery gate closed with complete product/collection/page/article search coverage, filter → product flow, error/empty states and owner mobile evidence; validator 65 files/89 storefront keys/90 schema keys; Theme Check 49 files zero offenses; 2026-07-22 |

## Việc tiếp theo — theo thứ tự

1. Khóa Phase 5 PDP contract và product data matrix cho image/video/external video/3D, single/multi/unavailable variants, selling plans, quantity rules/pricing và missing optional data.
2. Triển khai vertical slice đầu tiên: media gallery + variant source of truth, giữ product form GET/POST fallback và không stale URL/media/price/availability state.
3. Thực hiện professional trademark clearance trước khi public brand/listing assets; ghi approval/proof trước mọi demo asset hoặc dependency mới.

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
- Review exit criteria 01–02: tất cả điều kiện exit đã có evidence. Đóng Phase 0 và chuyển Phase 1 — Design ngày 2026-07-19.
- Thiết lập kế hoạch một owner trong `09-project-board.md`; các mốc là baseline điều phối, cần điều chỉnh nếu capacity thay đổi.

### 2026-07-19 — Phase 1 core-flow prototype checkpoint

- Tạo prototype độc lập trong `docs/Prototype/`; không thay đổi component production trong `theme/` trước design gate.
- Hoàn thiện flow home → collection → product → cart và mobile task navigation bằng HTML/CSS/JavaScript không dependency, không remote asset.
- Bổ sung state reviewer cho loading, empty, error, unavailable, focus, long copy và missing media.
- Map các vùng prototype sang future Shopify section/block/snippet/custom element trong `prototype-map.md`.
- Kiểm tra JavaScript syntax và `git diff --check` pass; kiểm tra cấu trúc ghi nhận 4 screen, 3 dialog, 3 live region, reduced-motion, URL filter history, delayed cart state và focus restoration.
- Checkpoint implementation hoàn tất; chưa đóng M1 cho đến khi comparison và owner desktop/mobile/accessibility review đạt.
- Hoàn thành `design-comparison.md`: khác biệt được chứng minh bằng journal issue structure, numbered story grammar, variant-safe action language và commerce-first cart; không tuyên bố các pattern parity riêng lẻ là unique.
- Chạy desktop visual QA bằng Chrome headless và sửa lỗi initial route focus làm trang tự cuộn, đồng thời làm rõ header navigation styling.
- Chụp thử mobile 375/320 cho thấy Chrome headless dùng layout viewport tối thiểu rộng hơn rồi crop ảnh; không dùng hai ảnh này làm bằng chứng pass mobile. M1 vẫn mở cho true device-emulation và owner review.

### 2026-07-20 — M1 direction approval và bắt đầu Phase 2

- Owner chấp nhận prototype hiện tại làm hướng thiết kế để chuyển bước; giao diện production không bị ràng buộc pixel-perfect với prototype.
- Đóng M1 cho mục đích foundation; visual/mobile polish được chuyển thành continuous component-review requirement.
- Tạo `foundation-architecture.md` để khóa ownership, CSS/Liquid/localization conventions và Definition of Done.
- Bổ sung body/heading font roles, type scale, accent/border roles, spacing/focus tokens, semantic `main`, skip link và reduced-motion fallback.
- JSON parse pass; Theme Check pass 39 files, zero offenses; `git diff --check` pass.
- Thêm GitHub Actions `theme-ci.yml` theo Shopify CLI CI guidance, pin CLI 4.5.1 và không dùng store credential vì workflow chỉ lint/validate.
- Thêm `scripts/validate-theme.mjs`: parse JSON/JSONC, kiểm tra translation keys được tham chiếu, chặn debug statement và remote JavaScript runtime.
- Local-equivalent CI pass: 52 theme files, 33 storefront keys, 63 schema keys; Theme Check 39 files, zero offenses. GitHub run đầu tiên vẫn chờ commit/push.
- Codex environment từ chối external upload dù owner đã cho phép; không retry hoặc bypass. Local `shopify theme package` pass và tạo Git-ignored `theme/Skeleton-0.1.0.zip` gồm 39 uploadable files, không chứa `shopify.theme.toml`.
- Tạo `foundation-smoke-test.md` với storefront, global-setting, keyboard/reduced-motion và Theme Editor lifecycle checklist để chạy ngoài môi trường này.
- Owner khởi động development theme thành công. Local preview checks pass cho home, collection, product, cart, search, blog, page và list-collections; 404 trả đúng HTTP 404 với rendered body; không phát hiện Liquid error.
- DOM inspection xác nhận `MainContent`, skip link, heading font, accent và type-scale tokens. Lưu desktop clean-render evidence `foundation-home-1440.png`; không commit store URL/theme ID.
- Thêm LiquidDoc price/pagination snippets, compare-at/unit-price semantics, accessible pagination labels và shared button/form/visually-hidden primitives.
- Áp dụng primitives vào product, collection và search Skeleton sections. Validator pass 55 files/41 storefront keys/63 schema keys; Theme Check pass 41 files zero offenses; live preview routes render không có Liquid error.
- Nâng image snippet với alt override, responsive widths/sizes, lazy-loading default và clean missing-image behavior; thêm original inline SVG icon API cho account/cart/menu/search/close.
- Header baseline dùng navigation label và accessible account/cart names. Validator pass 55 files/43 storefront keys/63 schema keys; Theme Check pass 42 files zero offenses; live preview xác nhận markup và không có Liquid error.
- Nhận owner review: typography, undo/redo, margin, colors, save/reload, cross-template persistence, skip link và Theme Editor lifecycle pass; reduced-motion query true; keyboard/mobile/zoom chưa xác định; layout/scale chưa ổn.
- Sửa page-width scale thành 70/90/110rem để tạo khác biệt đo được và thay `shopify-account` bằng account link baseline, loại bỏ nguồn missing-menu GraphQL/localhost Shop CSP/pre-auth errors. Validator và Theme Check vẫn pass; console cần owner retest.
- Owner xác nhận remediation retest hoàn tất: page-width variants nhìn thấy được và Foundation console đạt. Ghi account link là fallback tạm thời; Phase 3 phải quyết định direct link hay account popover và kiểm tra missing-menu/CSP/authenticated account flows.
- Owner xác nhận hoàn tất manual keyboard/focus, true 375/320, zoom 200% và reduced-motion review; Foundation owner-review checklist đạt.
- GitHub Actions run đầu tiên fail tại Theme Check: Shopify CLI 4.5.1 cần `node:module.enableCompileCache`, không có trong Node 20.20.2. Nâng `checkout`/`setup-node` lên v6 và Node job lên 24; local Node 24.14 validation và Theme Check pass 42 files zero offenses, chờ owner commit/push rerun.
- Owner xác nhận GitHub Actions rerun PASS sau Node 24 remediation. Đóng CI exit criterion của Foundation; bước tiếp theo là Phase 2 exit review và chuẩn bị Phase 3 Global shell.
