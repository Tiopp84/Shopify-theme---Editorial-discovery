# 06 — Quality, accessibility, performance và compatibility

## Test layers

1. Static: Theme Check, schema/locale và debug scan.
2. Component: states, keyboard, responsive, section lifecycle.
3. Flow: discovery, product, cart, checkout path.
4. Release: browsers, devices, Lighthouse và clean install.

## Accessibility

- [ ] Landmarks, heading order và skip link đúng.
- [ ] Button cho action, link cho navigation; focus luôn visible.
- [ ] Form có label, hint và error association.
- [ ] Drawer/modal có accessible name, focus trap, Escape, restore focus.
- [ ] Disclosure dùng `aria-expanded`/`aria-controls` đúng.
- [ ] Cart/product updates có live region thích hợp.
- [ ] Alt text, contrast WCAG AA, touch targets, zoom 200% đạt.
- [ ] Reduced motion; screen reader đọc price/variant/error có nghĩa.

Test keyboard-only và ít nhất VoiceOver hoặc NVDA cho core flow.

## Performance budget

Shopify gate hiện hành: trung bình ≥60 Performance và ≥90 Accessibility trên home/product/collection, desktop/mobile. Mục tiêu nội bộ: ≥75/95 và CLS <0.1.

- [ ] LCP image được ưu tiên đúng; media có dimensions/aspect ratio.
- [ ] Responsive images có widths/sizes; non-critical media lazy-load.
- [ ] Font từ Shopify, ít weights; không preload dư.
- [ ] Global CSS/JS tối thiểu; feature assets được gated.
- [ ] Không duplicate assets/listeners hoặc remote runtime.
- [ ] Không GIF/video trang trí nặng mặc định.

## Browser matrix

Xác nhận lại latest versions trước submission: Safari macOS/iOS, Chrome desktop/mobile, Firefox, Edge, Samsung Internet; smoke test purchase flows trong Instagram/Facebook/Pinterest webviews.

## Data matrix

- Một/nhiều variants, sold-out, unavailable combination, no image.
- Sale/unit price/multi-currency, selling plan, quantity rule/volume price.
- Gift card; image/video/external video/3D.
- Collection rỗng/lớn; search empty/multiple object types.
- Cart empty/discount/API error; long translations/localization.

## Theme Editor QA

Add/remove/reorder/duplicate section/block; select/deselect; rapid setting changes; section load/unload; missing resource; app blocks; save/reload. Không duplicate listener hoặc mất state.

## Evidence và exit

- [ ] Lưu Theme Check, Lighthouse URL/date, browser matrix, core-flow media và known issues.
- [ ] Không P0/P1; P2 có owner/quyết định.
- [ ] Đạt performance/accessibility và Theme Editor gates.
