# Source provenance and license plan

Ngày phê duyệt: 2026-07-17

Trạng thái: **APPROVED FOR FOUNDATION IMPORT**

## 1. Quyết định nguồn code

Narrivelle dùng **Shopify Skeleton Theme** làm baseline duy nhất. Mọi art direction, component, commerce behavior và interaction model phía trên baseline phải được phát triển nguyên bản trong repository này.

Không dùng Dawn, Horizon, commercial theme hoặc source code không xác định nguồn gốc làm implementation reference. Có thể dùng storefront/demo của theme khác để quan sát hành vi và lập acceptance criteria, nhưng không copy markup, Liquid, CSS, JavaScript, schema hoặc composition đặc trưng.

Nguồn chính thức:

- https://shopify.dev/changelog/skeleton-theme-is-now-available
- https://shopify.dev/docs/storefronts/themes/getting-started/create
- https://shopify.dev/docs/storefronts/themes/store/requirements#2-uniqueness-from-other-themes

## 2. Import protocol

1. Xác nhận Shopify CLI và Git hoạt động.
2. Tạo Skeleton ở thư mục tạm bằng `shopify theme init` hoặc clone repository được CLI trỏ tới.
3. Ghi URL nguồn, commit SHA/tag và ngày import vào mục Evidence bên dưới.
4. Review license và file notices trước khi copy.
5. Copy baseline vào `theme/` trong một commit riêng, không có feature/custom styling.
6. Chạy inventory file, Theme Check và clean render smoke test.
7. Ghi diff/command/test result vào `current-step.md`.
8. Mọi lần đồng bộ Skeleton sau đó phải là quyết định explicit; không merge upstream mù quáng.

## 3. Provenance rules

- Mỗi file production phải thuộc một trong ba nguồn: Skeleton baseline, original Narrivelle hoặc approved third party.
- File từ Skeleton được truy vết về import commit; thay đổi sau import thuộc lịch sử Narrivelle.
- Không paste code từ blog, Stack Overflow, AI output hoặc snippet marketplace nếu license/provenance không rõ.
- AI-assisted code phải được review như code nguyên bản: kiểm tra similarity, API support, accessibility, security và license risk.
- PR/commit không được chứa code Dawn/Horizon chỉ vì official docs dùng chúng làm ví dụ.
- Không commit theme credentials, store IDs, `.env`, demo handles/URIs hoặc customer data.
- Không dùng remote runtime hoặc CDN script ngoài những trường hợp Shopify cho phép và đã review license.

## 4. Dependency policy

Mặc định **zero runtime dependency** ngoài Shopify platform và code baseline.

Dependency chỉ được thêm khi:

- Giải quyết vấn đề không hợp lý khi viết native.
- License cho phép commercial redistribution trong paid theme.
- Không tải runtime từ remote host.
- Có version pin, source URL, license text/notice và owner nội bộ.
- Có đánh giá performance, accessibility, security, update/support burden.
- Có phương án remove/replace.

Không thêm framework frontend, slider/modal library hoặc icon font theo mặc định. Ưu tiên web platform APIs, custom elements nhỏ, inline SVG nguyên bản và CSS native.

GSAP Core (và ScrollTrigger khi cần) có thể được phê duyệt như motion runtime ngoại lệ theo `Specifications/motion-architecture.md`; không phải là dependency mặc định. AOS `2.3.4` cũng được phê duyệt cho các one-time viewport reveal tự quản lý bởi script của theme. Mỗi dependency production phải self-host bản pin version, ghi source/license/notice, bundle impact và removal path vào evidence register. CDN không được dùng làm production runtime.

## 5. Asset policy

- Demo imagery không nằm trong submission ZIP trừ khi có quyền redistribution rõ.
- Font ưu tiên Shopify font library/system stack; font bên ngoài cần commercial license và proof.
- Icon tự thiết kế hoặc dùng bộ có license redistribution rõ; lưu source/license.
- Không dùng logo, trademark, artwork hoặc người mẫu nếu thiếu model/property release cần thiết.
- Placeholder/default không được phụ thuộc `shopify://shop_images`, custom handle hoặc metafield của demo store.

## 6. Evidence register

| Thành phần | Nguồn/version | License | Import commit | Trạng thái |
|---|---|---|---|---|
| Shopify Skeleton Theme | `https://github.com/Shopify/skeleton-theme.git`, HEAD `a4f32d393b9eadf6c4403318ca39116832e5d1df`, imported 2026-07-17 via Shopify CLI 4.5.1 | Shopify restricted MIT-style license in `theme/LICENSE.md` | `7fdb6a1` | IMPORTED / THEME CHECK PASS |
| Narrivelle original code | Repository này | Proprietary submission source | Từ commit sau baseline | IN PROGRESS |
| GSAP Core + ScrollTrigger | `https://www.npmjs.com/package/gsap`, version `3.13.0`, imported 2026-07-28 | GSAP Standard “No Charge” License | Uncommitted working tree | APPROVED — self-hosted for homepage reveals and one desktop-only `pinned-visual-story` scrub timeline. CSS owns the sticky layout; ScrollTrigger never pins or changes document layout. Reduced motion and mobile omit the choreography. Core 72 KB + ScrollTrigger 44 KB minified; remove the two script tags and `home-reveal.js` to disable the effect |
| AOS | `https://www.npmjs.com/package/aos`, version `2.3.4`, imported 2026-07-30 | MIT License, Copyright (c) 2015 Michał Sajnóg | Uncommitted working tree | APPROVED — self-hosted CSS for one-time viewport reveals on index, collection and list-collections templates. Theme-owned `aos-home.js` and `catalog-reveal.js` provide the trigger state; reduced-motion users receive the unanimated content. No CDN, scroll scrub or JavaScript pinning. Remove the CSS asset, both scripts and their layout tags to disable it. |
| Fonts | Shopify/system only ở baseline | Shopify/platform terms | TBD | POLICY APPROVED |
| Icons | Original inline SVG plus Phosphor Icons Regular subset `v2.0.8` (`d42782b2abe747d904b971ccab48b182a1455f86`) | Original + MIT | Uncommitted working tree | APPROVED — 20 Phosphor SVG files are self-hosted as CSS masks for Editorial details only; no icon font, package, CDN or remote runtime is used. License notice and asset register entry are required. |
| Demo imagery | TBD per asset | Commercial proof required | N/A | BLOCKED UNTIL REGISTERED |

## 7. Gate trước production component

- [x] Skeleton được chọn làm baseline hợp lệ.
- [x] Import protocol và provenance rules được định nghĩa.
- [x] Dependency/asset license policy được định nghĩa.
- [x] Root `THIRD_PARTY_NOTICES.md` được tạo.
- [x] Asset/license register được tạo.
- [x] Skeleton được import với upstream SHA và commit riêng. Evidence: SHA `a4f32d393b9eadf6c4403318ca39116832e5d1df`, commit `7fdb6a1`.
- [x] Theme Check baseline pass: 39 files, zero offenses, 2026-07-17.
- [x] Dev-store storefront/Theme Editor smoke test pass. Evidence: owner confirmation, 2026-07-17.
