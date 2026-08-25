# Narrivelle and Still — preset art direction specification

Status: **DRAFT FOR OWNER APPROVAL**

Last updated: 2026-08-18
Applies to: Theme Store demo stores, preset listing templates, listing screenshots and highlight media.

## 1. Purpose and source precedence

This specification defines two distinct merchant-facing art directions for the Narrivelle theme family. It turns the approved product brief and visual-token direction into instructions that can be built, merchandised, tested and submitted to the Shopify Theme Store.

It is not permission to make cosmetic changes without preserving commerce, accessibility and Shopify compatibility.

When documents conflict, use this order:

1. Shopify Theme Store requirements and review feedback.
2. This preset specification for preset-specific direction.
3. `visual-design-tokens.md` for shared visual-system decisions.
4. `product-brief.md` and `design-principles-and-prototype-criteria.md` for product and UX intent.
5. Existing theme implementation, only where it does not conflict with the documents above.

## 2. Theme family: Quiet Modern Wardrobe

### Core proposition

Narrivelle is an editorial-commerce theme for independent apparel and lifestyle brands. It makes campaign context useful: a shopper can move from an image, collection or outfit narrative to a valid product decision without losing clarity about price, variant, availability or checkout.

The family should feel **composed, modern, practical and quiet**. It is not maximalist luxury, a generic lifestyle moodboard, or a stripped-down basic shop. Editorial expression earns its space only when it helps a customer understand a collection, material, fit or styling context.

### Non-negotiable shared principles

- Product title, current price, availability and next valid action are more prominent than decoration.
- Every editorial module has a clear product or collection destination; image-only hotspots are not the sole path to purchase.
- A multi-variant product never silently adds a default variant.
- The cart begins with line-item and checkout information; it does not begin with promotion, editorial copy or implied bundles.
- Mobile is a deliberate composition, not a compressed desktop layout.
- Motion explains hierarchy or state change and respects reduced-motion preferences.
- Empty, unavailable, loading, error and long-content states are designed rather than treated as exceptions.

### Shared merchant and demo model

Both presets are for **Apparel** and use a realistic demo catalogue of **20–30 products**. This is sufficient to demonstrate filtering, variants, sale and sold-out states while remaining feasible to art-direct completely.

Every demo store should include:

- 3–4 collections with purposeful names and complete collection imagery/copy;
- at least one product with multiple colour and size variants;
- at least one sale product and one sold-out product or variant;
- a gift card product;
- authentic product descriptions, fit/material/care/delivery content; and
- a coherent menu, search, cart and policy/contact paths.

The presets share capability parity. A module omitted from one homepage remains available in the Theme Editor; omission is a composition choice, not a removed feature.

## 3. Preset architecture at a glance

| Dimension | Narrivelle — The Issue | Still — The Edit |
| --- | --- | --- |
| Merchant archetype | Campaign-led fashion label with seasonal stories | Capsule, studio or essentials label with concise collection |
| Primary job | Turn campaign imagery into product discovery | Make a tightly edited catalogue feel assured and easy to buy |
| Catalogue | 20–30 products | 20–30 products |
| Homepage density | Layered, chapter-based | Sparse, product-led |
| Visual rhythm | Controlled changes of media, surface and type | Whitespace, dividers and a stable grid |
| Editorial role | Narrative is a primary route into shopping | Narrative is supporting evidence for product/material |
| Hero | Full-bleed campaign statement | Quiet product or silhouette statement |
| Default homepage sections | 9 | 5 |
| Motion | Restrained chapter reveal | Near-static; interaction feedback only |
| Product-card priority | Campaign context followed by quick product decision | Product recognition and decision first |

## 4. Shared visual system

### 4.1 Colour roles

Colour is semantic. The interface must not introduce arbitrary secondary accents, and colour alone must never indicate selection, availability, sale or error.

| Token role | Value | Shared use |
| --- | ---: | --- |
| Paper | `#F5F3EE` | Default page surface and reversed text on Ink |
| Panel 01 | `#EBE7DD` | Soft adjacent chapter/surface |
| Panel 02 | `#E1DBCC` | Stronger tonal separation and quiet groupings |
| Panel 03 | `#D6CFBC` | Selected neutral surface or intentional emphasis |
| Ink | `#242119` | Primary text, primary action, strong rule and icon |
| Moss | `#5C6A4B` | Link, focus emphasis and editorial marker only |
| Moss tint | `#E4E8DC` | Low-emphasis selected or supportive surface |
| Sale semantic | `#A33F2B` | Current sale price/error-adjacent commerce information; always pair with text/icon/strikethrough context |
| Sale tint | `#F7BEBE` | Sale badge background; text remains Ink |

Global colour settings should resolve to these roles:

| Theme setting | Target value |
| --- | ---: |
| Background | Paper `#F5F3EE` |
| Foreground | Ink `#242119` |
| Border/divider | Panel 02 `#E1DBCC` |
| Interactive colour | Moss `#5C6A4B` |
| Interactive background | Moss tint `#E4E8DC` |
| Header background | Paper `#F5F3EE` |
| Header/navigation | Ink `#242119` |
| Announcement and footer background | Ink `#242119` |
| Announcement and footer text | Paper `#F5F3EE` |
| Primary button | Ink background / Paper text |

#### Preset application

**Narrivelle** uses the tonal panels to mark narrative chapters: Paper hero or media field → Panel 01 story → Paper product edit → Panel 02 material or composition. Use Ink surfaces sparingly, primarily for outfit composition or a decisive final CTA.

**Still** stays predominantly Paper with selective Panel 01 grouping. It should not alternate backgrounds merely to simulate depth. A divider, spacing change or image ratio can establish hierarchy without another panel.

### 4.2 Typography

There are two type roles, never two competing voices:

| Role | Preferred family | Fallback | Use | Do not use for |
| --- | --- | --- | --- | --- |
| Campaign serif | Instrument Serif Italic | System serif | Hero, campaign headline, story chapter, considered closing statement | Navigation, filter, product title, prices, form labels, cart, variant controls |
| Commerce sans | Inter | Work Sans then system sans-serif | Navigation, body, labels, product names, controls, filters, price and error copy | Large decorative campaign display |

No remote font runtime may be introduced. The final families must be selected through Shopify `font_picker` settings or be otherwise recorded in the asset licence register.

#### Type scale and hierarchy

The exact CSS implementation may use `clamp()` and existing heading-size controls, but rendered values should remain within these ranges:

| Role | Desktop target | Mobile target | Line-height | Tracking | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| Campaign display, large | 64–88 px | 40–56 px | 0.95–1.05 | -0.02em to 0 | One dominant display heading per viewport |
| Campaign display, medium | 44–60 px | 32–42 px | 1.0–1.1 | -0.01em to 0 | Story/chapter title |
| Commerce section heading | 28–38 px | 24–30 px | 1.1–1.2 | 0 | Sans; not oversized by default |
| Product title | 14–16 px | 14–16 px | 1.25–1.4 | 0 | Maximum two lines in dense grid |
| Body | 16–17 px | 16–17 px | 1.45–1.6 | 0–0.01em | Comfortable long copy |
| Label / eyebrow / button | 11–12 px | 11–12 px | 1.2 | 0.06–0.10em | Uppercase only for short labels |
| Price | 14–16 px | 14–16 px | 1.2–1.3 | 0 | Tabular figures required |

#### Preset application

**Narrivelle:** campaign italic can appear in the hero and one story heading within a viewport. Commerce sans immediately takes over for cards, price and actions. The contrast between these roles is the editorial rhythm.

**Still:** campaign italic is limited to the hero or one material statement. It must not be repeated on collection, product and newsletter headings. The commerce sans carries the composition.

### 4.3 Controls, cards and form language

- Primary action: Ink fill, Paper text, 44px minimum hit area, concise uppercase label.
- Secondary action: Paper or transparent fill, 1px Ink border, Ink text.
- Text link: Moss or Ink with a visible underline/underline-offset treatment; links must not rely on colour alone.
- Inputs: Paper surface, 1px neutral border, Ink text, 44px minimum height, no pill radius. Errors receive text and icon/state treatment, not red alone.
- Size/variant selector: compact outlined controls; selected uses Ink/Paper; unavailable retains an explicit label/pattern and cannot be chosen.
- Swatches: 32–36px target, visible selected ring and accessible colour/option name.
- Product card: image first; title and price compact but readable; badge and variant actions never cover the only useful image area.
- Dividers establish cadence. Avoid enclosing every card in a heavy bordered box.

## 5. Narrivelle — The Issue

### 5.1 Positioning

Narrivelle is for a fashion brand with a real campaign point of view. The homepage is organised like a small journal issue: a thesis, a sequence of chapters and specific purchase destinations. It should make a collection feel authored without slowing down a shopper who already knows what they want.

Keywords: **considered, directional, tactile, lived-in, editorial, composed**.

Avoid: glossy aspirational luxury clichés, maximal collage, constant animation, image-only shopping, or a homepage that repeats the same giant-heading/large-image pattern.

### 5.2 Image direction

- Use 3–6 campaign/editorial images plus two material-detail images, in addition to product imagery.
- Show movement, proportion, texture, garment construction and believable lived context.
- Hero desktop: landscape image with intentional text-safe area; hero mobile: separately art-directed portrait crop.
- Chapter images may crop closer: a sleeve, garment texture, movement or footwear is valid when it explains the collection.
- Product images remain accurate enough to judge colour, silhouette and material; editorial grading must not obscure the product.
- Do not embed marketing claims, UI controls or faux CTAs into imagery.

### 5.3 Homepage sequence

| Order | Existing section | Job | Direction |
| ---: | --- | --- | --- |
| 1 | Editorial hero | State the collection thesis | 85vh desktop / 75vh mobile; campaign type; one clear destination |
| 2 | Scrolling text | Create an edition marker | Two short factual/editorial phrases; no urgent promotion or unreadable speed |
| 3 | Collection list | Enter the catalogue deliberately | Four collection entry points with different, useful taxonomy |
| 4 | Shoppable story | Translate story into products | Three product references; clear product destination; no ambiguous hotspot-only interaction |
| 5 | Featured edit | Serve intent-led shopping | Four product cards; stable 4:5 imagery and compact commerce metadata |
| 6 | Pinned visual story | Add numbered narrative rhythm | Four chapters; each chapter has a distinct fact or styling context |
| 7 | Material craft | Demonstrate reason to believe | Two detail images and a concise material/finish statement |
| 8 | Outfit composition | Show styling without a false bundle | Three independent products, valid variants and availability state |
| 9 | Email signup | Continue the editorial relationship | Dispatch language, not artificial exclusivity |

### 5.4 Collection, product and cart expression

- Collection intro is a brief thesis above a stable commerce toolbar. It must never alter result count, filter state or reading order.
- Product cards may reveal a safe quick-add path progressively, but keyboard and touch require an equivalent explicit route.
- PDP confidence content is organised in decision order: colour/size → fit → material/care → delivery/returns. A campaign title never displaces price or add action.
- Cart remains deliberately plain relative to the homepage: selected variant, quantity, line price, discounts, subtotal and checkout lead.

### 5.5 Motion

- AOS reveal may use short opacity/translation transitions for chapter entry.
- Do not animate on every card, do not delay primary CTA visibility, and do not couple scrolling to a forced narrative state.
- Reduced-motion must remove non-essential transform and reveal choreography while leaving all content visible.

## 6. Still — The Edit

### 6.1 Positioning

Still is for a concise but complete collection whose products need room to be inspected. It behaves like a quiet retail gallery: visual hierarchy is produced through whitespace, proportion and a disciplined grid, not through a lack of content or functionality.

Keywords: **calm, exact, assured, spare, tactile, direct**.

Avoid: empty-template appearance, generic Scandinavian clichés, faint/low-contrast text, microscopic controls, or hiding normal commerce features because the interface is “minimal”.

### 6.2 Image direction

- Use one hero image plus one or two material/detail images, alongside complete product photography for 20–30 products.
- Hero imagery favours a single silhouette, object or quiet scene; it should be readable without a busy campaign set.
- Keep product-card ratios and lighting consistent across the catalogue.
- Material imagery is evidence: seam, knit, fabric, fastening, finish or fit. It is not decorative filler.
- Prefer clean crops with visual breathing room. Do not use arbitrary blank space that creates a broken layout on mobile.

### 6.3 Homepage sequence

| Order | Existing section | Job | Direction |
| ---: | --- | --- | --- |
| 1 | Editorial hero | State the point of view | 70vh desktop / 70vh mobile; brief copy; one direct destination |
| 2 | Collection list | Explain the catalogue | Three columns; maximum three or four meaningful routes; 24px grid gap |
| 3 | Featured edit | Put purchasable product first | Three columns, one row by default; second hover image off by default for visual calm |
| 4 | Material craft | Give product confidence before PDP | One concise proof point; right-positioned image; no extended story chapter |
| 5 | Email signup | Close softly | Useful dispatch/restock language; no pressure or novelty gimmick |

The default Still homepage does not use scrolling text, shoppable story, pinned visual story or outfit composition. Those capabilities stay available to merchants; they should be introduced only when the merchant has content that warrants them.

### 6.4 Collection, product and cart expression

- Collection pages lead with category, result tools and the product grid. Intro copy should be no more than one or two useful sentences.
- Product cards are visually stable: an image, concise title, current price and a clear options/add path. Do not add hover-only editorial labels.
- PDP brings image, product title, price, choices and fit/material evidence into the first decision area. The product is the story.
- Cart uses the same behavioural design as Narrivelle, with no default editorial cross-sell competing with checkout.

### 6.5 Motion

- Still is effectively static in reading flow.
- Use animation only for controls changing state: drawer open/close, quantity update, validation and selected variant feedback.
- Do not add reveal motion merely because the page has whitespace.

## 7. Layout and responsive rules

### Shared grid

- Desktop: a disciplined 12-column conceptual grid within the existing theme container.
- Tablet: preserve hierarchy; do not simply scale down desktop asymmetry.
- Mobile: one reading sequence and a 4-column conceptual grid; content must not create orphaned empty columns.
- Spacing base: 8px. Approved major rhythm: 8 / 16 / 24 / 40 / 64px.
- Major chapter separation: 64px desktop, 40–48px mobile.

### Preset-specific composition

| Rule | Narrivelle | Still |
| --- | --- | --- |
| Desktop image/media rhythm | May vary intentionally across chapters | Stable ratios and edges are preferred |
| Text width | Narrow campaign text measure on media | Short, factual copy with generous whitespace |
| Mobile hero | Separate editorial overlay composition | Clear title/destination; avoid layered copy |
| Product-grid rhythm | Four-card editorial edit, then story/composition interruption | Three-card stable edit; no interruption by default |
| Surface changes | Used to signal chapter | Used only for functional grouping |

Test both presets at 320px, 375px, 768×1024px, 820×1180px, 1024×768px and 1440px. Include long product names, missing media, keyboard focus, 200% zoom and reduced motion.

## 8. Technical implementation contract

### 8.1 What is already represented in the theme

The current listing templates provide the correct structural distinction:

- `theme/listings/narrivelle/templates/index.json`: hero, scrolling text, collection list, shoppable story, featured edit, pinned story, material craft, outfit composition and newsletter.
- `theme/listings/still/templates/index.json`: hero, collection list, featured edit, material craft and newsletter.

These files intentionally configure composition only. They do not contain demo imagery or full demo-store data.

### 8.2 Global-settings contract

Preset-level global values belong in `theme/config/settings_data.json` under its `presets` object, not under `theme/listings/`. Shopify applies the presentational values for the selected theme style from this object; the `/listings/<preset-name>/` directory supplies preset-specific template and optional section-group configuration.

`settings_data.json` must keep an explicit `Narrivelle` and `Still` preset. Resource-owning data, including product and collection selections, menus, pages, images and demo-store copy, does not become portable merely by adding a global setting and must be configured in the matching demo store.

Recommended v1.0 approach:

1. Keep one shared global colour and typography foundation: Paper/Ink/Moss, Instrument Serif and Inter, sharp controls, compact product titles and clear commerce states.
2. Encode that foundation in `current`, `presets.Narrivelle` and `presets.Still` so a preset does not depend on an implicit schema default.
3. Keep the only v1 global distinction intentional and small: Narrivelle enables a second product-card image; Still disables it for a stable, quieter product grid.
4. Create the remaining distinction with section order, local section settings, image treatment, content and density. Do not make Still a separate dark theme or assign a wholly different global font system.

If a future direction requires preset-specific global palettes, typography or header behaviour, that is a code/architecture change. It must be scoped, implemented, regression-tested and checked for install/demo parity before use.

### 8.3 Current token reconciliation gate

`theme/config/settings_schema.json` defaults to Instrument Serif / Inter and the shared Paper/Ink/Moss colour foundation. Section-specific visual settings remain available for art direction within each preset.

The global defaults and this document are the shared source of truth. Before demo parity QA, verify the configured values in each demo store still match these defaults unless an approved section-specific treatment intentionally overrides them.

### 8.4 Shopify and quality requirements

- Each preset needs its own complete, functioning demo store and its own listing page.
- The installed preset layout, colour and typography must match its corresponding demo. Demo images do not transfer on installation.
- Use only authentic copy and assets with recorded commercial rights, copyright ownership and releases where needed.
- Demo checkout uses Bogus Gateway or Shopify Payments test mode, with other checkout methods disabled.
- Do not depend on apps, embedded fake UI in images, external font runtimes or affiliate links to make a preset appear more capable than the theme itself.
- Keep all existing accessibility requirements: visible focus, semantic landmarks, labelled controls, reduced motion, keyboard/equivalent touch behavior and error/live-region handling.

## 9. Content voice

| Surface | Narrivelle | Still |
| --- | --- | --- |
| Hero eyebrow | Edition/collection marker: `Spring study 01` | Category/point-of-view marker: `Essentials, refined` |
| Hero heading | A considered thesis, 5–10 words | A quiet, direct promise, 4–8 words |
| Body copy | Sensory but factual; one or two sentences | Functional and exact; one sentence where possible |
| CTA | `Explore the collection`, `See the composition` | `Shop the edit`, `View all pieces` |
| Material copy | Explains handfeel, finish, construction or proportion | Explains the product fact that improves confidence |
| Newsletter | Editorial dispatches/new studies | New arrivals, restocks and occasional notes |

Never use fake urgency, false scarcity, superlatives without evidence, generic Lorem Ipsum or text baked into imagery.

## 10. Asset and demo checklist

### Narrivelle

- [ ] 20–30 products, complete variants and metadata.
- [ ] 3–4 collections with useful taxonomy.
- [ ] Desktop hero landscape and separately art-directed mobile portrait.
- [ ] 3–6 campaign/story images.
- [ ] Two material/detail images.
- [ ] Three outfit items with independent, valid product references.
- [ ] Sale, sold-out, gift-card, multiple-variant and rich-media states represented.

### Still

- [ ] 20–30 products, complete variants and metadata.
- [ ] 3–4 collections with useful taxonomy.
- [ ] Desktop hero landscape and separately art-directed mobile portrait.
- [ ] One or two material/detail images.
- [ ] Stable, consistent product-photo ratio and lighting.
- [ ] Sale, sold-out, gift-card, multiple-variant and rich-media states represented.

### Evidence for both presets

- [ ] Every imported asset has a row in `docs/Governance/asset-license-register.md`.
- [ ] Test checkout uses the required test payment configuration.
- [ ] Desktop and mobile homepage screenshots are captured only after parity QA.
- [ ] Listing highlights are genuine captures of delivered built-in features.
- [ ] Demo-store URL, reviewer test credentials and feature-test instructions are recorded for submission.

## 11. Acceptance decision

The art direction is ready for implementation only when the owner confirms:

1. Narrivelle is the campaign-led **The Issue** direction.
2. Still is the product-led **The Edit** direction.
3. Both demos use 20–30 products and 3–4 collections.
4. Both presets share Paper/Ink/Moss and campaign-serif/commerce-sans foundations.
5. The global token reconciliation approach in section 8.3.

Once approved, the next work should be a narrowly scoped global-token alignment plan, followed by demo-store configuration and asset ingestion. No commercial demo asset should be imported before its rights record is complete.
