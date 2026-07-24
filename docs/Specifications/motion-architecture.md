# Motion architecture

Status: **MANDATORY WHEN MOTION IS IMPLEMENTED — 2026-07-24**

Motion exists to clarify hierarchy, orientation, and editorial storytelling. It must never delay navigation, obscure commerce feedback, or become the only way to understand a control.

## Technology decision

- CSS transitions and Web APIs are the default for UI state: hover/focus feedback, dialogs, menus, sticky-header state, and simple scroll state.
- GSAP is an optional, local motion runtime for editorial sequences that genuinely require a coordinated timeline, stagger, or scroll choreography.
- ScrollTrigger is optional and is loaded only by a section that needs scroll choreography. It is not a global dependency and is not used for header behavior or every product card.
- GSAP assets are self-hosted in `theme/assets/` at a pinned version. A public CDN is not a production dependency.
- A section must stay fully visible and usable before JavaScript loads. Motion is progressive enhancement, not a render prerequisite.

## Loading and ownership

1. Do not include GSAP or ScrollTrigger in `layout/theme.liquid` by default.
2. Load GSAP Core only on templates/sections that declare an approved editorial motion treatment. Load ScrollTrigger only in addition to Core where that section requires it.
3. Keep one small motion adapter/controller asset. Sections declare intent through scoped `data-motion-*` attributes; they do not scatter ad-hoc global `gsap` calls.
4. One section instance owns its timelines, observers, and triggers. Its controller exposes idempotent `init(section)` and `destroy(section)` behavior.
5. In Shopify Theme Editor, initialize on section load and destroy on section unload. Use `gsap.context()` and `context.revert()`; kill every owned ScrollTrigger and disconnect every observer/listener.

## Performance rules

- Animate only `transform` and `opacity` by default. Any `filter`, `clip-path`, layout property, or continuous parallax requires device testing and an explicit reason.
- Prefer one section timeline to many independent per-element triggers. Do not create a ScrollTrigger for each card in a collection grid.
- Use `IntersectionObserver` to defer off-screen reveal setup; ScrollTrigger is reserved for effects whose progress must track scrolling.
- Header visibility and scrolled appearance use a passive scroll listener scheduled through `requestAnimationFrame` plus CSS classes, not ScrollTrigger.
- Do not hide initial content while waiting for GSAP. The no-JavaScript/default state is the final readable layout.
- Keep motion short and purposeful: micro-feedback roughly 120–200 ms; editorial entrance roughly 300–600 ms. Avoid long mandatory sequences and autoplay loops.

## Accessibility and commerce safety

- Respect `prefers-reduced-motion: reduce` before creating a timeline or trigger. Render the final state immediately and avoid decorative motion.
- Do not animate focus movement, validation, price/variant/cart updates, loading/error announcements, or the availability of an actionable control.
- Native dialog semantics, Escape, focus restoration, form submission, and direct URLs must work independently of motion.
- Motion must not cause layout shift that moves a pointer target or keyboard focus target during interaction.

## Acceptance checklist

- [ ] The treatment has a documented purpose and is not the sole differentiator for a component.
- [ ] The section is complete and usable with JavaScript disabled, GSAP blocked, and reduced motion enabled.
- [ ] GSAP Core and optional ScrollTrigger are loaded only where used; no remote runtime is introduced.
- [ ] All timelines, triggers, observers, and listeners are cleaned up on Theme Editor unload/reload.
- [ ] Mobile 320/375 px and a mid-range touch device have no visible jank or interaction delay.
- [ ] Keyboard, focus, dialogs, direct navigation, and async commerce flows pass before and after the section is animated.
- [ ] The pinned source, version, license, notice, bundle impact, and removal path are recorded in Governance before shipping.
