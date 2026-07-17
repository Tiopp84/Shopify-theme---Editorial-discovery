# Asset and dependency license register

Mọi dependency, font, icon, image, video, audio và creative asset phải được thêm vào bảng **trước khi** merge vào production/demo.

| ID | Asset/dependency | Loại | Nguồn | Version/date | License/usage rights | Proof location | Redistribution allowed | Demo only | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| BASE-001 | Shopify Skeleton Theme | Source baseline | `https://github.com/Shopify/skeleton-theme.git` | `a4f32d393b9eadf6c4403318ca39116832e5d1df`, 2026-07-17 | Shopify license: use for themes integrating with Shopify and distribution via Shopify Theme Store; notice must remain | `theme/LICENSE.md` | Yes for approved Shopify use | No | Engineering | APPROVED |
| FONT-001 | Shopify/system font stack | Font | Shopify platform/browser | Platform | Platform/system use | Official docs | Yes within platform use | No | Design | APPROVED BASELINE |
| ICON-001 | Narrivelle original SVG icons | Icons | Original project work | Per commit | Original/proprietary | Git history | Yes in theme package | No | Design | PLANNED |

Status allowed: `PROPOSED`, `IN REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`, `PENDING IMPORT`.

Không dùng asset có status khác `APPROVED` trong release candidate.
