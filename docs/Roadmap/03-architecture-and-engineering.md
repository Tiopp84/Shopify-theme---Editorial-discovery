# 03 — Kiến trúc và engineering standards

## Repository

- Repository mới, lịch sử nguồn gốc rõ; `main` luôn releaseable.
- Feature branch/PR nhỏ, có screenshots và test notes.
- Semantic versioning và changelog.
- Không commit secrets, theme credentials hoặc store IDs.

## Directory ownership

```text
assets/     Asset CDN; global tối thiểu
blocks/     Theme Blocks reusable
config/     Global settings và clean install data
layout/     HTML shell, không chứa feature UI
locales/    Storefront/schema translations
sections/   Layout, context và page modules
snippets/   Liquid fragments có API rõ
templates/  JSON composition
```

## Horizontal Architecture

- Section chịu layout/context; block chịu feature merchant-editable.
- Dùng `content_for 'blocks'` và `@theme` khi thích hợp.
- App blocks chỉ ở integration points thật.
- Không dùng `case block.type` lớn cho section mới.
- Merchant-addable block có preset; block không có `target: section`.

## Liquid

- Dùng `render`, LiquidDoc cho snippet có params/static block.
- Truyền dependency rõ; escape merchant text; static copy dùng locale.
- Không ternary/unsupported parentheses; không override global objects.
- Loop bounded, collection lớn dùng paginate.
- Image dùng `image_url`/`image_tag` với widths/sizes.

## CSS

1. Component-scoped stylesheet.
2. Component-gated asset.
3. Global CSS chỉ cho reset, tokens, typography, primitives.

- CSS variable cho setting đơn; class cho multi-property variant.
- Mobile-first, visible focus, reduced motion.
- Không raw CSS setting, Sass hoặc file production minified.

## JavaScript

- Progressive enhancement, component ownership rõ.
- Không remote runtime, debug output hoặc global state tùy tiện.
- Fetch có loading/error/stale-response handling.
- Cleanup listeners/observers; resilient với Theme Editor lifecycle.
- Product form, cart và media có một source of truth.
- Flow nhiều bước/async bắt buộc tuân theo [`../Specifications/interaction-architecture-standard.md`](../Specifications/interaction-architecture-standard.md): thiết kế state và render boundary trước UI, giữ URL/fallback, chống race condition và kiểm tra sau DOM replacement.

## Schema, assets và automation

- Schema JSON hợp lệ; setting IDs ổn định sau release.
- Controls đúng ngữ nghĩa, defaults không phụ thuộc demo resource.
- License/version cho mọi dependency; Shopify CDN; không asset thừa.
- CI chạy Theme Check, schema/locale validation, debug/remote URL scan.
- Lighthouse CI khi có stable demo URL.

## Exit criteria

- [x] Architecture decision được duyệt. Evidence: `../Specifications/foundation-architecture.md`, 2026-07-20.
- [x] Skeleton repository chạy trên dev store. Evidence: owner smoke-test confirmation, 2026-07-17.
- [x] CI và Theme Check hoạt động. Evidence: GitHub Actions `Theme CI` owner-confirmed PASS, 2026-07-20; Node 24 local-equivalent pass.
- [x] Tokens, conventions và PR Definition of Done đã khóa. Evidence: `../Specifications/foundation-architecture.md`, `theme/snippets/css-variables.liquid`, `theme/assets/critical.css`.
