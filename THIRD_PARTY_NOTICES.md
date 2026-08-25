# Third-Party Notices

Narrivelle includes the approved, self-hosted third-party components listed below. No third-party runtime is loaded from a remote CDN.

## Shopify Skeleton Theme

- Source: https://github.com/Shopify/skeleton-theme.git
- Imported revision: `a4f32d393b9eadf6c4403318ca39116832e5d1df`
- Import date: 2026-07-17
- License and required notice: `theme/LICENSE.md`

The license permits use, modification and distribution for themes that integrate or interoperate with Shopify and, when applicable, distribution through the Shopify Theme Store. The copyright and permission notice must remain in copies or substantial portions.

See `docs/Governance/source-provenance-and-licenses.md` and `docs/Governance/asset-license-register.md`.

Do not add third-party code or assets to this file without also recording approval and proof in the asset/license register.

## Phosphor Icons

- Source: `https://github.com/phosphor-icons/core`
- Version: `v2.0.8` (`d42782b2abe747d904b971ccab48b182a1455f86`)
- Files: the 20 self-hosted `theme/assets/phosphor-*.svg` Regular-weight icons used only by Editorial details.
- License: MIT License, Copyright (c) 2023 Phosphor Icons. The full copyright and permission notice from the upstream `LICENSE` applies to these files.
- Usage: local SVG files are used only as CSS masks; no icon font, package, JavaScript, CDN, or remote asset request is added.
- Removal path: remove `theme/assets/phosphor-*.svg`, the Editorial details mask reference, and the associated register/notice entries.

## GSAP Core and ScrollTrigger

- Source: `https://www.npmjs.com/package/gsap`
- Version: `3.13.0`
- Files: `theme/assets/gsap-3.13.0.min.js`, `theme/assets/scroll-trigger-3.13.0.min.js`
- License: GSAP Standard “No Charge” License, `https://gsap.com/community/standard-license/`
- Usage: GSAP Core and ScrollTrigger are loaded only on the index template for one-time, viewport-triggered homepage section reveals. They do not pin or scrub scrolling. No CDN runtime is used.
- Removal path: remove the two self-hosted assets and their register entries.

## AOS

- Source: `https://www.npmjs.com/package/aos`
- Version: `2.3.4`
- Files: `theme/assets/aos-2.3.4.css`
- License: MIT License, Copyright (c) 2015 Michał Sajnóg. The required full notice is included below and the upstream license is available at `https://github.com/michalsnik/aos/blob/v2/LICENSE`.
- Usage: self-hosted CSS supports one-time viewport reveals on index, collection and list-collections templates. Theme-owned scripts add the reveal state only when reduced motion is not requested; they do not scrub or pin scrolling.
- Removal path: remove the self-hosted CSS asset, `aos-home.js`, `catalog-reveal.js`, the related layout tags and this register entry.

### AOS MIT License

Copyright (c) 2015 Michał Sajnóg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
