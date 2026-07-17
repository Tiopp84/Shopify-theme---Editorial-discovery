# Narrivelle MVP feature matrix

Ngày khóa scope: 2026-07-17

Trạng thái: **MVP SCOPE LOCKED — acceptance may be refined, scope changes require review**

Priority: `P0` Theme Store/release blocker, `P1` Narrivelle core value, `P2` polish/support reducer. Owner là role cho đến khi project board có tên cụ thể.

## 1. Platform và templates

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| PLAT-01 | P0 | Required templates | Engineering/QA | Tất cả template trong requirement hiện hành render với real/empty data; JSON sections ngoại trừ customer/gift card/checkout |
| PLAT-02 | P0 | Header/footer section groups | Engineering | Add/remove/reorder/reload ổn định; keyboard/mobile pass |
| PLAT-03 | P0 | Custom Liquid + app insertion | Engineering | Custom Liquid available đúng template; app blocks chỉ ở integration points hợp lý |
| PLAT-04 | P0 | SEO/social/structured data | Engineering/QA | Title, description, canonical, page image và product structured data hợp lệ; không có `robots.txt.liquid` |
| PLAT-05 | P0 | Localization/country/language | Engineering/Content | Selector xuất hiện khi khả dụng; `request.locale`, currency/country đúng; English keys complete và locale-ready |
| PLAT-06 | P0 | Customer accounts/sign-in | Engineering/QA | Required auth/account/order/address flows render và keyboard usable theo platform hiện hành |

## 2. Global shell và discovery

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| DISC-01 | P1 | Editorial mega navigation | Design/Engineering | Collection taxonomy + campaign entry; desktop keyboard, mobile drawer, long labels và missing image pass |
| DISC-02 | P0 | Search/predictive search | Engineering/QA | Product/page/article/collection types, empty/loading/error, correct object type và focus/live-region behavior |
| DISC-03 | P0 | Collection filtering/sorting | Engineering/QA | Price/active filters/remove/reset/mobile drawer; URL/history và no-results states đúng |
| DISC-04 | P1 | Product card system | Design/Engineering | Stable media, price/badge, accessible swatch, focus=hover parity và unavailable states |
| DISC-05 | P1 | Variant-safe quick add | Engineering/QA | One variant adds directly; multi-variant opens accessible choice; errors/stale responses handled |
| DISC-06 | P1 | Collection merchandising | Design/Engineering | Editorial insertions không phá pagination/filter context hoặc product count semantics |

## 3. Product detail

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| PDP-01 | P0 | Product media/gallery | Engineering/QA | Image, video, external video, 3D, modal/zoom và variant media; dimensions/lazy loading đúng |
| PDP-02 | P0 | Variant source of truth | Engineering/QA | URL, media, price, compare-at, unit price, SKU, inventory, availability đồng bộ; không stale state |
| PDP-03 | P0 | Product form/buy buttons | Engineering/QA | Validation, quantity, accelerated checkout, selling plans, quantity rules/pricing và errors pass |
| PDP-04 | P0 | Merchant-managed product blocks | Engineering | Title/vendor/SKU/rating/price/inventory/variant/quantity/buy/description/collapsible/icon/popup/size guide/complementary/custom Liquid/share/app blocks |
| PDP-05 | P1 | Product confidence hierarchy | Product/Design | Size/fit/material/care/delivery/returns rõ theo context; mobile CTA không bị che; missing data degrades gracefully |
| PDP-06 | P1 | Outfit-aware product context | Design/Engineering | Related outfit items giữ variant/availability/price; sold-out item không chặn item khác |

## 4. Cart và checkout path

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| CART-01 | P1 | Cart drawer | Engineering/QA | AJAX add/update/remove, stale/error/loading, focus trap/Escape/restore, live region và section reload pass |
| CART-02 | P0 | Cart page | Engineering/QA | Quantity/remove/note, line/cart discounts, unit price/selling plan, errors và accelerated checkout pass |
| CART-03 | P1 | Outfit continuity | Design/Engineering | Cart presentation giữ editorial identity nhưng không che giá/discount/checkout; cross-sell không gây hiểu nhầm bundle |
| CART-04 | P0 | Checkout smoke path | QA | Product → cart → accelerated/standard checkout navigation hoạt động trên browser/device matrix |

## 5. Content sections

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| SEC-01 | P0 | Foundation sections | Engineering | Announcement, rich text, image with text, newsletter, contact, Apps và Custom Liquid polished |
| SEC-02 | P0 | Commerce sections | Engineering | Featured collection/product, collection list, recommendations và product editorial grid |
| SEC-03 | P1 | Editorial hero | Design/Engineering | Recognizable Narrivelle composition; desktop/mobile art direction; safe text/media fallback |
| SEC-04 | P1 | Shoppable story | Design/Engineering | Story → product trong tối đa 2 mobile interactions; accessible, variant-aware, missing resource safe |
| SEC-05 | P1 | Outfit composition | Design/Engineering | Multi-product story với independent item states; không giả bundle/discount |
| SEC-06 | P1 | Editorial collage/media story | Design/Engineering | Rule-based asymmetric composition, reading order đúng và long text/zoom pass |
| SEC-07 | P2 | Video/material/fit story | Design/Engineering | Gated media, poster/fallback, no autoplay with sound, reduced motion/data-conscious defaults |

## 6. Quality và merchant UX

| ID | Priority | Capability | Owner | Acceptance tối thiểu |
|---|---|---|---|---|
| QUAL-01 | P0 | Accessibility | QA/Engineering | WCAG-oriented keyboard, focus, labels/errors, landmarks, contrast, zoom 200%, reduced motion và screen-reader core flow |
| QUAL-02 | P0 | Performance | Engineering/QA | Lighthouse average ≥60/90 required, target ≥75/95; CLS <0.1 internal; real content home/product/collection desktop/mobile |
| QUAL-03 | P0 | Theme Editor lifecycle | Engineering/QA | Add/remove/reorder/duplicate/select/load/unload/rapid settings; no duplicate listener/state loss |
| QUAL-04 | P0 | Browser/webview | QA | Required current Safari/Chrome/Firefox/Edge/Samsung Internet và Instagram/Facebook/Pinterest webviews |
| QUAL-05 | P1 | Clean install/onboarding | Product/QA | No demo URI/handle/ID; missing resources hide/onboard; preset install state matches demo structure |
| QUAL-06 | P1 | Locale resilience | Content/QA | No hard-coded UI copy; key parity checks; long text/pseudo-locale; selector discoverable |
| QUAL-07 | P2 | Supportability | Product/Support | Setting copy/doc mapping rõ; error messages actionable; no excessive nested builder/settings burden |

## 7. MVP section/block budget

- Sections target: 20–22 polished sections, counting header/footer group components separately only when merchant-facing.
- Theme Blocks target: 25–35 reusable blocks; không chạy theo limit 300.
- Nesting: dùng mức tối thiểu cần thiết; không thiết kế page builder sâu dù platform cho phép tối đa 8 levels.
- Mỗi merchant-addable block có preset và locale-backed schema copy.
- Main product section giữ layout/media/context; product capabilities nằm trong blocks.

## 8. Explicit product decisions

- Cart drawer: **IN MVP**.
- Quick add: **IN MVP**, variant-safe.
- Predictive search: **IN MVP**.
- Two presets: **IN MVP**, capability parity.
- Recently viewed: **OUT** version 1.0.
- Wishlist/back-in-stock service/booking/loyalty: **OUT**, app territory.
- Voice search: **OUT**.
- Infinite scroll: **OUT by default**; dùng pagination/load-more chỉ nếu accessibility/history acceptance được duyệt sau prototype.
- RTL/full EU locale pack: **POST-LAUNCH**, nhưng architecture phải locale/RTL-aware.
- Fake countdown/stock/viewer/urgency: **PROHIBITED**.
- Instagram API feed/cart discount hacks/remote runtime: **PROHIBITED**.

## 9. Scope change rule

Feature mới chỉ vào MVP khi có merchant problem, owner, acceptance, accessibility/performance impact và support estimate. Nếu không chặn submission hoặc bốn trụ cột đã duyệt, đưa vào post-launch backlog.

