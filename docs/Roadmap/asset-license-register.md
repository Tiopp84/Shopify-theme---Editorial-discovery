# Asset and dependency license register

Mọi dependency, font, icon, image, video, audio và creative asset phải được thêm vào bảng **trước khi** merge vào production/demo.

| ID | Asset/dependency | Loại | Nguồn | Version/date | License/usage rights | Proof location | Redistribution allowed | Demo only | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| BASE-001 | Shopify Skeleton Theme | Source baseline | Official Shopify source via `shopify theme init` | TBD at import | Review source license at import | TBD | TBD after review | No | Engineering | PENDING IMPORT |
| FONT-001 | Shopify/system font stack | Font | Shopify platform/browser | Platform | Platform/system use | Official docs | Yes within platform use | No | Design | APPROVED BASELINE |
| ICON-001 | Narrivelle original SVG icons | Icons | Original project work | Per commit | Original/proprietary | Git history | Yes in theme package | No | Design | PLANNED |

Status allowed: `PROPOSED`, `IN REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`, `PENDING IMPORT`.

Không dùng asset có status khác `APPROVED` trong release candidate.

