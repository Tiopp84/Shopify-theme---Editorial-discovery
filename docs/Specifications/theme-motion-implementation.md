# Theme motion implementation guide

Status: **ACTIVE IMPLEMENTATION REFERENCE — 2026-07-29**

This document records how motion is organised in the Narrivelle theme. It complements `motion-architecture.md`: that document defines the policy; this one maps the policy to actual files, controllers and storefront behaviour.

## 1. Experience role

Motion has three deliberate roles:

1. **Interface feedback** — communicate hover, focus, drawer, menu and header state without delaying a task.
2. **Orientation** — show where an overlay came from and preserve a shopper's place in the interface.
3. **Editorial rhythm** — give a campaign or story a measured reading sequence without hiding product information or taking control of scroll.

Motion is never required to reveal content, enable a purchase, communicate price/availability/error state, or make navigation work.

## 2. Technology and ownership

| Layer | Technology | Owner | Use it for | Do not use it for |
|---|---|---|---|---|
| Small UI state | Scoped CSS transitions | Component stylesheet | Hover/focus, disclosure, button and drawer visual state | Scroll choreography or layout changes |
| Header state | Passive scroll listener + `requestAnimationFrame` | `header-shell.js` | Sticky/compact header state | ScrollTrigger |
| Editorial entrance | GSAP timeline + one viewport trigger | `home-reveal.js` | A short one-time section or card-group entrance | Commerce feedback or every catalog card |
| Editorial choreography | GSAP timeline + ScrollTrigger | Section-specific code in `home-reveal.js` | A section whose visual sequence follows scroll progress | JavaScript pinning, parallax everywhere, or a global site runtime |
| Overlay semantics | Native dialog and component controller | Menu, search, cart and media controller | Focus trap, Escape and focus restoration | Animation-dependent accessibility |

GSAP Core and ScrollTrigger are self-hosted, pinned at 3.13.0, and are loaded only on the home template. Their licence and removal path are recorded in `../Governance/asset-license-register.md` and `../Governance/source-provenance-and-licenses.md`.

## 3. Non-negotiable behaviour

- Server-rendered Liquid is the complete usable baseline.
- With JavaScript blocked, a failed motion asset, or `prefers-reduced-motion: reduce`, all content is immediately visible.
- Animate only `opacity` and `transform` by default. Do not animate layout, pointer targets, prices, availability, validation or live-region content.
- The mobile default is a short, one-time reveal. Scroll-scrub choreography is desktop-only unless a real-device review explicitly approves a touch treatment.
- Every controller must be idempotent and clean up timelines, triggers, observers and listeners on `shopify:section:unload`.
- Motion must not move focus, trap scroll, or make a link/button unavailable while it animates.

## 4. Runtime organisation

```text
layout/theme.liquid (home only)
  ├─ bootstrap class: home-reveal-pending
  ├─ GSAP Core 3.13.0
  ├─ ScrollTrigger 3.13.0
  └─ home-reveal.js
       ├─ generic one-time reveal controller
       ├─ desktop editorial choreography controller
       ├─ Shopify section load/unload handling
       └─ breakpoint rebuild and ScrollTrigger refresh

layout/theme.liquid (all storefront routes)
  └─ overlay-motion.js
       └─ coordinates native-dialog enter/exit state only

critical.css
  └─ temporary first-paint concealment, only when motion is allowed

section markup
  ├─ data-home-reveal: a short section entrance
  ├─ data-home-reveal-group: a bounded card/row stagger
  ├─ data-home-reveal-chapter: a story chapter target
  └─ data-motion="editorial-chapters": an approved choreography boundary
```

The inline bootstrap has a 2.5-second failsafe. If GSAP or ScrollTrigger cannot load, `homeRevealBoot.release()` removes the temporary concealment. Do not add a new selector to the pending CSS unless the controller will always release it.

## 5. Homepage inventory

| Surface | Current treatment | Trigger/model | Mobile and reduced motion | Merchant control |
|---|---|---|---|---|
| Editorial hero | Text and media entrance | Plays once after controller hydration | Final state immediately for reduced motion | No motion setting; section remains readable without it |
| Featured edit | Header entrance; product card group stagger | One viewport entry per bounded group | One-time reveal only | No motion setting |
| Pinned visual story | Intro entrance plus chapter choreography; sticky media gently scales from 1.045 to 1 | One GSAP timeline, scrubbed from story-layout entry to exit; CSS owns sticky positioning | Chapters use ordinary one-time reveal; no scrub | `Enable editorial scroll motion` checkbox, enabled by default |
| Material & craft | Bounded image/text entrance | One viewport entry | One-time reveal only | No motion setting |
| Shoppable story | Introduction entrance; product-row stagger | One viewport entry per bounded group | One-time reveal only | No motion setting |
| Outfit composition | Lead entrance; product-card group stagger | One viewport entry per bounded group | One-time reveal only | No motion setting |

### Pinned visual story choreography

The `pinned-visual-story` section is the current editorial showcase because it already has a long-form image-and-chapter layout.

```text
Desktop scroll

Story introduction enters once
  → CSS keeps the story image sticky
  → chapter 01 content fades/translates into its final reading position
  → chapter 02 enters as the reader progresses
  → chapter 03 enters as the reader progresses
  → image settles from 1.045 scale to 1.0
```

The sequence deliberately does not fade prior chapters away. A shopper can pause and read all preceding copy, while the newest chapter receives the motion emphasis. It uses no JavaScript pin, no filter/clip-path animation and no looping motion.

## 6. Dialog, modal and drawer motion

Native dialogs use the shared `data-overlay-motion` pattern in `critical.css` plus the small `overlay-motion.js` coordinator. The coordinator adds `data-overlay-visible` two animation frames after a native dialog opens, so the initial and final CSS states are reliably painted in Shopify preview and browsers that do not fully animate native-dialog display changes. It delays a script-initiated `close()` by 220 ms only to let the exit finish; native dialog semantics, focus and Escape behaviour remain the source of truth.

| Surface | Entrance | Backdrop | Notes |
|---|---|---|---|
| Header menu | Slide from the left on desktop; fade-up sheet on mobile | Fade | Existing header-scoped CSS handles its responsive direction |
| Header search | Slide from the right on desktop; fade-up sheet on mobile | Fade | Existing header-scoped CSS handles its responsive direction |
| Cart drawer | Slide from the right on desktop; fade-up sheet on mobile | Fade | Cart mutations/loading/error state are never animated |
| Collection facets | Desktop drawer slides from the left; mobile sheet fades up | Fade | URL/form state and focus restoration remain controller-owned |
| Quick add | Centered modal fades up slightly | Fade | Product choices and add errors remain immediately usable |
| Product media and size guide | Centered modal fades up slightly | Fade | Gallery controls and native dialog focus behaviour are unchanged |

The pattern animates only panel opacity/transform and backdrop colour. It uses `display`/`overlay` discrete transitions when supported so closing can animate; browsers without that support still open and close the native dialog immediately. Reduced motion disables these transitions.

Implementation boundary:

- Markup: `theme/sections/pinned-visual-story.liquid`
- Controller: `theme/assets/home-reveal.js`
- First-paint fallback: `theme/assets/critical.css`
- Runtime loading: `theme/layout/theme.liquid`

## 7. Adding motion to a new section

Before implementation, document the customer purpose, target viewport, fallback, trigger range and cleanup plan in the section contract or review record.

1. Start with no motion and confirm the section is complete, readable and keyboard-safe.
2. Prefer a CSS transition for local state. Use GSAP only for a coordinated sequence.
3. Add a scoped `data-motion-*` declaration only to the owning section; never attach a generic animation attribute to product-card, form or cart markup.
4. Create one section-owned controller/timeline. Use `gsap.context()` and keep a reference for teardown.
5. Use `ScrollTrigger` only when animation progress genuinely follows scroll. A one-time reveal should use one simple viewport trigger instead.
6. Provide a merchant-facing On/Off control only when it conveys a clear creative decision. Do not expose duration, easing, pixel offsets or trigger coordinates in the Theme Editor.
7. Test JavaScript disabled/blocked, reduced motion, desktop, 375 px, 320 px, keyboard navigation, zoom 200%, section duplicate/reorder/load/unload and rapid Theme Editor setting changes.

## 8. Performance limits and review checklist

- A section may own one timeline and a small bounded number of targets; do not create a ScrollTrigger for every product card.
- Use `will-change` only while a timeline is actively running, then clear it.
- Recalculate ScrollTrigger only after relevant section lifecycle events or breakpoint changes; schedule refresh through `requestAnimationFrame`.
- Do not preload or globally load a motion library for routes that do not use it.
- Before release, record bundle impact, real-device smoothness and Lighthouse results for home desktop/mobile.

For every new motion treatment, record: purpose, owner, changed files, test viewports, reduced-motion result, Theme Editor result, performance result and removal path in `Roadmap/current-step.md`.
