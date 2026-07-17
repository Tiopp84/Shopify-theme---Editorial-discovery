# 05 — Build roadmap theo phase

Ước lượng một developer full-time: 18–28 tuần, chưa tính Shopify review.

## Phase 0 — Discovery/eligibility, tuần 1–2

Product brief, competitor study, feature matrix, Skeleton/original decision, license/risk register. Gate: tài liệu 01–02 được duyệt.

## Phase 1 — Design, tuần 3–5

Core desktop/mobile screens, tokens, prototype discovery → add-to-cart, UI-to-component map. Gate: uniqueness và accessibility annotations đạt.

## Phase 2 — Foundation, tuần 6–7

Repo/dev store, layout shell, SEO, tokens, typography/buttons/forms, image/icon/price/pagination snippets, locales và CI. Gate: clean render, Theme Check sạch.

## Phase 3 — Global shell, tuần 8–10

Announcement, header, mega menu, mobile drawer, search entry, footer blocks, newsletter/localization. Gate: keyboard/mobile/browser smoke test.

## Phase 4 — Discovery, tuần 11–14

Product/collection cards, featured modules, collection grid/banner, sort/filter/mobile drawer, search/predictive search. Gate: filter → product flow và error/empty states đạt.

## Phase 5 — Product detail, tuần 15–18

Gallery/modal/video/3D, product form, variants/swatches/quantity/selling plans, product blocks, recommendations. Gate: product data matrix pass, không stale state.

## Phase 6 — Cart, tuần 19–20

Cart drawer/page, quantity/remove/note/discount, empty/loading/error/live region, checkout buttons, focus behavior. Gate: product → cart → checkout smoke test.

## Phase 7 — Differentiation, tuần 21–23

Editorial hero, shoppable lookbook/outfit, collage/story, video, trust/material/fit. Gate: ít nhất ba trải nghiệm khác biệt nhất quán trong presets.

## Phase 8 — Secondary templates, tuần 24–25

Blog/article, pages/contact/FAQ, list collections/search/404, password/gift card/customer. Gate: required templates render với real và empty data.

## Phase 9 — Hardening, tuần 26–27

Accessibility, performance, browsers/devices, Theme Editor lifecycle, locales/multi-currency/errors, dead code removal. Gate: mục tiêu 75 Performance/95 Accessibility và zero offenses.

## Phase 10 — Packaging, tuần 28+

Hai presets, clean install, docs/FAQ/support, listing assets/release notes, submission dry-run. Gate: `10-release-gate.md` hoàn thành.

## Milestones

| ID | Milestone | Dự kiến |
|---|---|---|
| M0 | Product approved | Tuần 2 |
| M1 | Design approved | Tuần 5 |
| M2 | Foundation stable | Tuần 10 |
| M3 | Commerce alpha | Tuần 20 |
| M4 | Feature complete | Tuần 25 |
| M5 | Release candidate | Tuần 28 |
| M6 | Submitted | Sau release gate |

## Chống scope creep

- Feature mới cần merchant problem, acceptance và support estimate.
- Không chặn submission thì đưa post-launch.
- Không thêm preset thứ ba trước khi hai preset đầu đạt parity.
- Không lấy số lượng section thay cho chất lượng core flows.
