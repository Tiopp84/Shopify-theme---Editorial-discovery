# Theme motion implementation guide

Status: **ACTIVE IMPLEMENTATION REFERENCE — 2026-07-30**

This document records how motion is organised in the Narrivelle theme. It complements `motion-architecture.md`: that document defines the policy; this one maps the policy to actual files, controllers and storefront behaviour.

## 1. Experience role

Motion has three deliberate roles:

1. **Interface feedback** — communicate hover, focus, drawer, menu and header state without delaying a task.
2. **Orientation** — show where an overlay came from and preserve a shopper's place in the interface.
3. **Editorial rhythm** — give a campaign or story a measured reading sequence without hiding product information or taking control of scroll.

Motion is never required to reveal content, enable a purchase, communicate price/availability/error state, or make navigation work.

## 2. Technology and ownership

> **Homepage ownership — 2026-07-30:** AOS CSS plus the local one-time reveal controller own all standard homepage entrances. Pinned Visual Story is the deliberate exception: its heading-to-image mapping needs reversible scroll state, so its isolated controller uses self-hosted GSAP/ScrollTrigger on desktop and a native `requestAnimationFrame` reader for the two-column media state. No standard entrance may also receive a GSAP transform/opacity timeline. CSS sticky layout remains native; there is no JavaScript pinning or effect on commerce/overlay flows.

### AOS homepage implementation snapshot

This is the source of truth for homepage entrance motion.

| Concern | Implemented rule |
|---|---|
| Assets | Homepage loads self-hosted `aos-2.3.4.css`, local `aos-home.js`, and—only for the isolated Pinned Visual Story choreography—self-hosted GSAP Core/ScrollTrigger plus `home-reveal.js`. Collection and List collections load the same local AOS CSS plus `catalog-reveal.js`, which sets the required 400 ms AOS duration before its two-frame reveal. The AOS JavaScript bundle remains intentionally absent. |
| Hero | Image is visible on first paint for LCP. It makes only a 900 ms scale settle from 1.025 to 1.0; hero text enters with `fade-right` after two render frames. |
| Section lead | A section root carries `data-aos-section`. Except for the initially visible hero, a lead is considered only after scroll/resize, then runs once when it reaches the 60% viewport line (or the equivalent 40% line when entering from above). |
| Product/item phase | `data-aos-products` marks a card grid and `data-aos-product-item` marks an individual Shoppable Story row or card. These start only after their parent section lead and when the item/group itself reaches the trigger line. A grid marked `data-aos-sequence="row"` staggers each visible row from left to right; adding `data-aos-trigger="early"` starts card entrances at the 85% viewport line rather than the standard 60%, preventing an empty card footprint on compact screens. Pinned Story chapter motion is owned by its dedicated controller, not AOS. |
| Sequence | Eligible stages begin independently on their own trigger line. There is no page-wide queue, so a visible section never waits for another section's decorative entrance. Markers are removed after completion, therefore an animated target cannot replay until reload. |
| Fast scroll | Scroll velocity at or above `0.65 px/ms` uses a 350 ms reveal. |
| Timing | Standard duration is 400 ms (AOS-like); catch-up is 350 ms. Featured Edit, Collection List and Outfit Composition cards use independent `fade-up` stages with a 0–300 ms left-to-right stagger per visual row, in AOS-supported 100 ms steps. One `IntersectionObserver` reveals each catalog card once when it reaches the lower 18% trigger boundary; cards entering in the same visual row are ordered left-to-right with the same bounded delay. All fade vectors are 2 rem rather than AOS's 100 px default. |
| Theme Editor | `aos-home.js` and `catalog-reveal.js` unregister removed sections, targets and pending timers on `shopify:section:unload`; a loaded section is re-registered from clean state. Section-picker visual previews use `request.visual_preview_mode` to render card placeholders without AOS markers, so preview availability never depends on a runtime animation; section lead text retains its normal entrance marker. |
| Fallback | The head bootstrap enables the prepared state only when motion is allowed and releases it after three seconds if the controller fails. JavaScript blocked/failed and `prefers-reduced-motion: reduce` leave all content in final visible state. |
| Scope | Homepage standard entrances plus first-load card entrances on Collection and List collections. Search, predictive search, recommendations, cart, dialogs, product media, forms, prices, availability, focus and scrolling ownership are untouched. |

Implementation map:

```text
layout/theme.liquid
  ├─ index-only AOS CSS + first-paint fallback
  ├─ index-only aos-home.js
  └─ index-only GSAP Core → ScrollTrigger → home-reveal.js

sections
  ├─ editorial-hero: text stage + non-blocking media settle
  ├─ featured-edit / collection-list / outfit-composition: AOS lead stage → card stage
  ├─ material-craft: AOS image/text stage
  ├─ shoppable-story: lead stage → per-product-row stage
  └─ pinned-visual-story: GSAP intro/media/chapter choreography only

catalog templates
  ├─ collection: initial product-card `fade-up` only
  └─ list-collections: initial collection-card `fade-up` only
```

Record Shopify-preview and Theme Editor lifecycle evidence, desktop/mobile real-device smoothness, and Lighthouse/LCP evidence before closing the motion gate. The asset licence and removal path are tracked under `DEP-002` in `../Governance/asset-license-register.md`.

| Layer | Technology | Owner | Use it for | Do not use it for |
|---|---|---|---|---|
| Small UI state | Scoped CSS transitions | Component stylesheet | Hover/focus, disclosure, button and drawer visual state | Scroll choreography or layout changes |
| Header state | Passive scroll listener + `requestAnimationFrame` | `header-shell.js` | Sticky/compact header state | ScrollTrigger |
| Editorial entrance | AOS CSS + `aos-home.js` | Homepage section markup | A short one-time section or card-group entrance | Scroll choreography, commerce feedback or a second animation owner |
| Editorial choreography | GSAP timeline + ScrollTrigger | Section-specific code in `home-reveal.js` | A section whose visual sequence follows scroll progress | JavaScript pinning, parallax everywhere, or a global site runtime |
| Overlay semantics | Native dialog and component controller | Menu, search, cart and media controller | Focus trap, Escape and focus restoration | Animation-dependent accessibility |

**Desktop compact-header policy.** Header state follows sustained scroll intent, not the absolute page offset: 40 px of continuous downward travel compacts it; 96 px of continuous upward travel expands it; deltas of 2 px or less are ignored. Reversing direction resets the opposing counter. This prevents a compact/full loop at a shared `scrollY` threshold while retaining the compact design. A marked CSS-sticky region may temporarily hold the compact state, with a 16 px release buffer at its boundaries.

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
  ├─ AOS CSS + Narrivelle AOS vector overrides
  ├─ AOS first-paint fallback
  ├─ aos-home.js
  ├─ GSAP Core 3.13.0
  ├─ ScrollTrigger 3.13.0
  └─ home-reveal.js
       ├─ Pinned Visual Story desktop choreography controller
       ├─ Shopify section load/unload handling
       └─ breakpoint rebuild and ScrollTrigger refresh

layout/theme.liquid (all storefront routes)
  └─ overlay-motion.js
       └─ coordinates native-dialog enter/exit state only

section markup
  ├─ data-aos-section / data-aos*: standard AOS entrance boundaries
  ├─ data-aos-products / data-aos-product-item: dependent product stages
  ├─ data-home-reveal-chapter: Pinned Visual Story chapter target
  └─ data-motion="editorial-chapters": Pinned Visual Story choreography boundary
```

The AOS bootstrap has a 3-second failsafe. If its controller cannot load, it removes the prepared AOS class and all marked content renders in its final state. GSAP has no first-paint concealment dependency.

## 5. Homepage inventory

| Surface | Current treatment | Trigger/model | Mobile and reduced motion | Merchant control |
|---|---|---|---|---|
| Editorial hero | AOS text entrance; CSS-only image settle | Hero queues after two render frames | Final state immediately for reduced motion | No motion setting; section remains readable without it |
| Featured edit | AOS header entrance; bounded product-card stagger | Independent section and grid trigger | One-time reveal only | No motion setting |
| Pinned visual story | Intro entrance plus chapter choreography; sticky media gently scales from 1.045 to 1 | One GSAP timeline, scrubbed from story-layout entry to exit; CSS owns sticky positioning | Chapters use ordinary one-time reveal; no scrub | Master motion checkbox plus independent image-flip and chapter-wheel toggles |
| Material & craft | AOS image/text entrance; picker preview omits AOS markers | Independent section trigger | One-time reveal only | No motion setting |
| Shoppable story | AOS introduction entrance; per-product-row stages | Independent section/item triggers | One-time reveal only | No motion setting |
| Outfit composition | AOS lead entrance; bounded product-card stagger | Independent section and grid trigger | One-time reveal only | No motion setting |

### Announcement bar

`announcement-bar.liquid` is composed from independently editable Announcement blocks (text plus optional link). It offers exactly two motion treatments: **Slide and fade**, a horizontal carousel track where the active block leaves left while the next block enters from the right and both cross-fade, and **Continuously scroll right to left**. Both use a 1–20 speed slider that appears only for the selected treatment. Slide and fade maps that range to 900–210 ms so even its fastest setting retains a perceptible carousel travel. The former uses a small local controller so only the visible message is focusable; at the final-to-first handoff it reorders the existing track while transition is disabled, preserving the active block's exact visual position before continuing to move left. The latter uses a local sizing helper to clone only as much of the merchant-authored sequence as the viewport needs for a balanced seamless loop; its upper range reaches a 2-second full sequence duration.

- A linked announcement uses an end arrow rather than underlining the message; the arrow shifts slightly on hover or keyboard focus.
- Background colour, text colour, text size and bar height are direct Theme Editor settings. The height is a minimum, so longer stationary fallback copy can still wrap without being clipped.
- Continuous scrolling repeats the merchant-authored block sequence only to create a seamless loop; it does not fabricate a configurable repeat count. A larger responsive gap separates each authored block, and the group-end dot supplies the separator across each clone boundary. The sizing helper measures the primary sequence and adds only enough inert visual clones to cover the viewport plus the next sequence, so short/long text and different block counts retain even gaps. Every primary-sequence link remains clickable, while visual clones are hidden from assistive technology and keyboard navigation.
- Slide-and-fade pauses during hover or keyboard focus, moves the departing message left and the next message in from the right. Reduced motion and JavaScript failure keep only the first announcement visible and accessible. The continuous marquee also pauses on hover/focus; reduced motion shows only the first stationary announcement.

### Footer panel transition

`footer-panel.js` provides a small native scroll treatment for the optional footer setting **Enable page panel transition into footer**. The footer is fixed behind the page at the bottom of the viewport, while a same-height spacer after `main` supplies the reveal travel. One `requestAnimationFrame`-scheduled scroll reader maps the main panel's bottom edge across that spacer to scoped CSS properties.

- Scrolling down through the spacer moves the main panel up and reveals the fixed footer. Scrolling back up from the footer moves that panel down over it, like a window closing.
- The panel adds a responsive 3.5–6.5 rem lower safe space before its footer reveal, so the final storefront content does not sit against the footer edge.
- The panel has no extra transform; natural scrolling alone moves it over the fixed footer. Its lower corners follow a short midpoint pulse: they grow to 32 px only in the middle of the overlap, then return to zero before the footer is fully revealed. Its contents are clipped only during that pulse, so the panel is square at both ends of the interaction.
- As the panel covers the footer, the footer remains opaque but dims and softens by up to 1.5 px of blur, then shifts down by at most 20 px. It returns to its full visual clarity and resting position as the panel reveals it; no panel shadow is used.
- Only `transform`, `filter` and `border-radius` change; document flow, links and footer content remain unchanged. `will-change` is present only while the progress is active.
- JavaScript failure, the merchant setting being off and `prefers-reduced-motion` preserve the ordinary static footer.

### Pinned visual story choreography

The `pinned-visual-story` section is the current editorial showcase because it already has a long-form image-and-chapter layout. Its image is CSS-sticky whenever the section is in its explicit two-column layout (`≥48rem`); the additional GSAP chapter choreography remains desktop-only (`≥64rem`).

```text
Desktop scroll

Story introduction enters once
  → CSS keeps the story image sticky
  → each chapter heading crosses the image midpoint
  → the matching image changes with a short AOS-style 3D flip/fade
  → chapters follow a shallow horizontal arc: the centred chapter is fully clear and gains an accent badge/rule, while neighbours recede
  → image visuals settle from 1.045 scale to 1.0
```

The chapter arc uses only transform and opacity, keeps document flow and links unchanged, and clears when keyboard focus enters a chapter. It uses no JavaScript pin, no filter/clip-path animation and no looping motion. On mobile and with reduced motion, chapters remain static and fully legible.

#### Pinned Story implementation contract

**Purpose.** Each Story chapter owns an image. In a two-column layout, the sticky image must always identify the chapter whose **heading midpoint** is nearest the sticky-image midpoint. The active chapter receives the strongest visual emphasis, so the relationship remains understandable without relying on the image transition alone.

**Ownership and boundaries.** `pinned-visual-story.liquid` renders all images and owns the CSS state. `home-reveal.js` is the only runtime that changes the Pinned Story image/chapter state. AOS may reveal the section introduction, but it must not receive `data-aos`/`data-aos-item` on a Pinned Story chapter; otherwise AOS, GSAP and the wheel state can compete for transform or opacity.

```text
Liquid blocks
  └─ one image + one chapter heading per story
      └─ CSS sticky media stage at ≥48rem
          └─ one requestAnimationFrame scroll reader
              ├─ measures media bounds once
              ├─ measures each heading bounds once
              ├─ chooses the active image with hysteresis
              └─ optionally writes chapter wheel CSS variables
```

**Merchant controls.** The controls are intentionally named by visible effect, not implementation detail.

| Setting | Result when enabled | Result when disabled |
|---|---|---|
| `Enable image flip transition` | The active image uses a reversible AOS-style `rotateY`/opacity transition. | Images still map to the active chapter, but switch immediately. |
| `Enable chapter wheel effect` | Chapters follow the shallow arc; the centred chapter receives full opacity, accent badge/rule and heading colour. | Chapters remain in normal, fully readable flow without arc or active styling. |

**Theme Editor organisation.** The section groups settings as Content → Layout → Motion → Style. Content provides eyebrow, heading, heading size and alignment; alignment changes text inside the intro frame only. Layout provides the left/center/right position of that whole intro frame, image width and image height sliders, media side, plus a **Story chapters** group. That group controls the shared chapter index visibility, chapter heading size, text size and left/center/right alignment for every chapter. Width adjusts the desktop/tablet media-to-text grid ratio; height directly sets the sticky stage. Mobile keeps its in-flow portrait chapter media. The former vertical-spacing control is intentionally absent.

**Geometry and breakpoints.** The sticky media stage is active only from `48rem` upward, including either image-left or image-right two-column layout. JavaScript measures the actual media height with `ResizeObserver` and inserts a top/bottom chapter spacer equal to half that height. This lets the first and final headings travel through the media midpoint. Below `48rem`, the stage is hidden and each chapter renders its own image in document flow; no scroll reader is installed.

**Sticky navigation context.** A sticky section that should not make the desktop header bar oscillate declares `data-header-scroll-policy="hold-compact-header"` on its boundary and `data-header-scroll-target` on the CSS-sticky item. On desktop header layouts, `header-shell.js` verifies that target is genuinely pinned at its computed sticky offset and that its section has not reached the release edge. During that interval, the compact header bar remains the sole header state; minor reverse-scroll corrections cannot expand it. Leaving the sticky phase while scrolling upward restores the full header immediately, while leaving downward preserves the compact bar. This contract is DOM/CSS based, so it remains active when the independent visual effects are disabled or `prefers-reduced-motion` is enabled.

**Image transition.** The active image transition is deliberately moderate: `rotateY(10deg)`, `scale(.98)`, and a 460 ms opacity/transform transition. The prior and next image remain stacked in the same media box, so no layout or `display` change can flash the panel. `will-change` is applied only during the 500 ms transition window. The controller marks the immediately previous and next images as eager and calls `decode()` opportunistically, limiting preloading to adjacent stories rather than all chapter assets.

**Wheel treatment.** On every scheduled frame, the controller derives a normalized distance between each heading centre and the media centre. It writes only three custom properties per chapter: opacity, scale and a maximum 38 px horizontal arc offset. The curve reverses when media is on the right. The current chapter uses an accent number badge, heading colour and rule; `:focus-within` overrides the muted/translated visual state so links remain easy to use by keyboard. The former bounce treatment was removed because it added motion at the same moment as the image change and made slow scrolling feel less stable.

**Known risks and resolved safeguards.**

| Risk or observed issue | Safeguard / resolution |
|---|---|
| A single section-level image made all stories appear to share media. | Image picker belongs to each chapter block; the obsolete parent image setting is removed. |
| Scroll state was coded but never ran in preview. | Homepage explicitly loads GSAP → ScrollTrigger → `home-reveal.js` after `aos-home.js`. Script order is required. |
| Tablet kept the first image because desktop-only GSAP was the only swap path. | The native media-state reader runs from `48rem`; GSAP remains desktop-only for the additional chapter entrance choreography. |
| Image changed at an arbitrary timeline position or the article centre. | The trigger is the measured `h3` midpoint against the measured sticky-media midpoint. |
| First/final heading could not reach the image midpoint. | Dynamic half-media-height spacers are rendered before and after the chapter list. |
| Trackpad jitter near a chapter boundary caused rapid image switching. | A 28 px hysteresis requires the proposed heading to be materially nearer before it replaces the active image. |
| Strong/fast flip felt like a visual flash. | The flip was reduced to 10°, scale to `.98`, duration increased to 460 ms, and adjacent media is decoded ahead of use. |
| Wheel, AOS and GSAP all tried to animate a chapter. | Pinned Story chapters no longer participate in AOS item reveals; the section controller is the sole state owner. |
| A redundant master motion setting obscured which visible effect would be disabled. | The section always keeps its content-to-image mapping; only the independent flip and chapter-wheel controls govern their respective visual effects. |
| Small upward corrections inside sticky content expanded the compact desktop header and made it jump. | The header owns a reusable sticky navigation context; it holds the compact header only while the marked target is actually CSS-sticky, independently of motion scripts. |
| Theme Editor reload/reorder leaked state or listeners. | The controller stores cleanup in a map and removes scroll/resize listeners, `ResizeObserver`, timers, classes and inline variables on `shopify:section:unload`. |

**Performance budget and review.** The reader is passive-scroll plus one `requestAnimationFrame`; it performs one media rect read and one rect read per heading, then writes compositor-friendly opacity/transform values. It does not animate layout, blur, filters, clip paths or commerce UI. Keep the section to a small editorial set (the intended range is 3–6 chapters); if a future design permits many more, replace per-frame DOM measurement with a bounded observer/progress strategy and profile again. Before approving a release, verify slow and fast scroll, resize across 48/64rem, image-left/right, one and six chapters, reduced motion, blocked JavaScript, and Theme Editor add/remove/reorder lifecycle.

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
