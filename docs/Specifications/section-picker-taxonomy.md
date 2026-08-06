# Section picker taxonomy and placement governance

Status: **PROPOSED REFACTOR STANDARD — 2026-07-31**

## Purpose

This specification makes the Theme Editor's **Add section** picker an intentional merchant interface. It defines:

- the difference between picker categories, Shopify section groups, and placement policy;
- the vocabulary and categories used by Narrivelle;
- the ownership boundary for sections, Theme Blocks, snippets, and global settings;
- a safe migration path for the existing section inventory.

It is a refactor standard, not a requirement to imitate another theme's visual design or source code. The reference pattern is a small, searchable picker that helps a merchant identify the customer outcome they want to add.

## Platform model

Three separate Shopify concepts must never be conflated.

| Concept | Shopify mechanism | What the merchant sees | What it controls |
|---|---|---|---|
| Picker category | `presets[].category` | Collapsible heading in **Add section** | Only organization and discoverability in the picker |
| Placement policy | `enabled_on` or `disabled_on` in a section schema | Which contexts offer the section | The templates and section groups where it may be added |
| Section group | A JSON file in `sections/`, rendered by `{% sections '…' %}` | Header or footer composition in the editor | A persistent layout region whose sections can be added, reordered, or removed |

`category` must not be used as a substitute for `enabled_on`. For example, a section categorized as `Products & collections` may still be allowed only on the home page. Conversely, the header is a true Shopify section group, not a picker category.

Narrivelle keeps section groups limited to `header` and `footer`. The header and footer groups are global layout composition surfaces; page content remains owned by JSON templates. This follows the platform's normal section-group model and prevents a generic page-builder hierarchy from spreading into the shell.

## Merchant-facing taxonomy

The picker uses outcome-oriented names. Categories must be understandable without knowing Liquid, a template name, or an internal feature codename.

| Category key | English label | Merchant job | Included section types |
|---|---|---|---|
| `campaign_editorial` | Campaign & editorial | Lead with a campaign, story, material, or visual point of view | Editorial Hero, Pinned Visual Story, Material Craft, Editorial Details, Scrolling Text |
| `shop_the_story` | Shop the story | Connect an editorial idea to independent product decisions | Shoppable Hero, Shoppable Story, Outfit Composition |
| `products_collections` | Products & collections | Surface products, collections, or related merchandising | Featured Edit, Collection List, Product Recommendations |
| `content` | Content | Add reading, information, or flexible editorial content | Custom Section, Related Stories when it is ever independently addable |
| `forms_utility` | Forms & utility | Add a customer task or small utility message | Contact Form, Email sign up, FAQ, Announcement Bar where that context is permitted |
| `layout` | Layout | Compose simple content intentionally, without exposing commerce or shell capabilities | Group and its explicitly allowed child blocks only |

### Categories that are deliberately absent

- **Banners** is not a Narrivelle category. A campaign image, video, or text band is categorized by the merchant outcome, not its visual format.
- **Apps** is Shopify's app surface, not a theme-owned category. Theme sections must not simulate it.
- **Header**, **Footer**, **Product template**, **Collection template**, **Cart**, **Search**, **Blog**, **Article**, **404**, **Password**, and **Gift card** are template- or group-owned compositions. They do not receive presets merely to make them appear in a picker.
- **Demo** is prohibited in production. `hello-world.liquid` is development-only inventory and must be removed before release rather than exposed to merchants.

## Naming rules

### Section and preset names

- The section schema `name` and every preset `name` use a schema locale key: `t:general.editorial_hero`, never a hard-coded merchant label.
- The label names the merchant-recognizable outcome, not the implementation: `Editorial hero`, not `editorial-hero`; `Product recommendations`, not `recommendations-api`.
- Keep the visible label concise; Shopify limits schema section/block names to 25 characters.
- A section normally has one preset. Create a second preset only when it represents a durable, named starting composition with different defaults—not a toggle that is already a section setting.
- A preset may set defaults and default blocks. It must not silently create product choices, fake content, or a customer-facing claim that cannot be supported by clean-install data.

### Category labels

- The category value is a direct canonical label, for example `Campaign & editorial`. Shopify's preset schema documents category as a string and the Theme Editor does not resolve a schema-locale `t:` reference in this field.
- One canonical category label is used verbatim throughout the theme. Do not create near-duplicates such as `Product`, `Products`, `Shop`, and `Commerce`.
- Category order in the editor is controlled by Shopify. The theme therefore optimizes clarity of labels rather than relying on a visual order to communicate hierarchy.

## Ownership and configuration rules

### Sections

A section owns one coherent merchant outcome, its responsive composition, and the settings needed to make that outcome meaningful. Its schema is ordered as follows where applicable:

1. **Content** — Shopify resource, heading, body, media, CTA, or form copy.
2. **Layout** — a small number of outcome-relevant choices such as image ratio, content position, or card density.
3. **Style** — the inherited color scheme and an established visual treatment only when it changes hierarchy or context.

Do not expose controls that ask merchants to tune implementation values: arbitrary pixels, animation duration/easing, z-index, CSS class names, raw breakpoints, or individual colors that duplicate the global color-scheme system.

Every setting must pass all four questions:

1. Does it represent a real merchant decision?
2. Is its effect visible and understandable in the editor preview?
3. Does it preserve the three responsive compositions: compact, tablet, desktop?
4. Does its default work with real, missing, and long data?

If any answer is no, remove the setting or make the decision part of the section's fixed design contract.

### Theme Blocks

Use a Theme Block only when the merchant benefits from adding, removing, or reordering a reusable item within a parent section. Parent section schemas use explicit block allowlists; generic `@theme` is not permitted on commerce or shell surfaces.

Blocks stay scoped to their owner:

- Product detail blocks are Product-owned and are allowed only by `product.liquid`.
- Footer menu and newsletter blocks are Footer-owned and are allowed only by `footer.liquid`.
- Story-product and outfit-item are external Theme Blocks, each allowlisted only by its respective editorial section. Their product presentation is implemented by the shared `product-card` snippet rather than by a generic merchant-facing product block.

Blocks have their own picker categories only when the block picker contains enough distinct merchant choices to benefit from grouping. Block categories do not replace the parent section's allowlist.

### Snippets and global settings

Snippets are implementation primitives invisible to merchants. They must not gain a schema as an indirect way to create another merchant interface.

Global settings own system-wide decisions: typography, color schemes, and other truly shared behavior. A section can choose an existing scheme or role; it may not recreate background, foreground, accent, border, typography, or spacing controls locally unless a documented product contract requires a unique exception.

## Placement rules

Every public Liquid section declares exactly one `enabled_on` or `disabled_on` policy. Narrivelle defaults to the narrower `enabled_on` rule.

### Singleton shell sections

Use this pattern for a global shell surface that must always have one canonical place in a section group, such as Announcement bar. The merchant edits its settings and blocks in the Header group, but should not create a second instance through **Add section**.

- Declare the section's placement narrowly, for example `"enabled_on": { "groups": ["header"] }`.
- Set `"limit": 1` in the section schema to prevent a duplicate while the canonical instance exists.
- Do not declare `presets`. Shopify only exposes sections with a preset in **Add section**; a section without a preset can be included by code in a JSON section group but cannot be added again through the editor.
- Add exactly one canonical instance to the appropriate group JSON, using canonical hyphenated IDs for the section and its blocks. Include generic, locale-safe default blocks only—never store data.
- Provide a visibility checkbox such as **Enable announcement**. This is the merchant control for hiding the surface; do not treat deletion as a normal visibility setting.

Example for `sections/header-group.json`:

```json
{
  "sections": {
    "announcement-bar": {
      "type": "announcement-bar",
      "blocks": {
        "announcement-1": {
          "type": "announcement",
          "settings": { "text": "Complimentary delivery over $150" }
        }
      },
      "block_order": ["announcement-1"],
      "settings": {}
    }
  },
  "order": ["announcement-bar"]
}
```

| Surface | Allowed placement | Notes |
|---|---|---|
| Header | `groups: ["header"]` | Header and its canonical Announcement Bar only. |
| Footer | `groups: ["footer"]` | Footer only. |
| Home editorial | `templates: ["index"]` | Campaign & editorial, Shop the story, home merchandising sections, and a separately addable Announcement Bar. |
| Product | `templates: ["product"]` | Product main and product recommendations only. |
| Collection | `templates: ["collection"]` | Collection discovery owns its context; do not add generic product sections to it. |
| Content templates | Their owning template only | Page, contact, FAQ, blog, article, and related stories remain narrow so the picker cannot create an incoherent template. |
| Recovery templates | Their owning template only | Cart, search, 404, password, and gift card keep their native recovery/task ownership. |
| 404 recovery discovery | `templates: ["404"]` | `Featured edit` and `Collection list` are the only addable exception. They appear below the fixed 404 recovery action and give the shopper an optional path back to real catalog content. |

Template-owned main sections without a preset stay in their template JSON. A preset is for an addable composition, not evidence that every section should be addable everywhere.

## Current inventory mapping

This table is the migration target. `Picker` means the section has an addable preset after refactor; `Fixed` means it remains template/group-owned and should not appear in the Add section picker.

| Current file | Target merchant label | Category | Placement | Picker | Refactor note |
|---|---|---|---|---|---|
| `announcement-bar.liquid` | Announcement bar | Forms & utility | Header group, Home body | Header: No; Home: Yes | The canonical Header-group instance remains global. The same section type has a Home-only preset for a separate in-flow announcement body section; it does not affect the Header instance. |
| `header.liquid` | Header | — | Header group | Fixed | Shell owner. |
| `footer.liquid` | Footer | — | Footer group | Fixed | Shell owner. |
| `editorial-hero.liquid` | Editorial hero | Campaign & editorial | Home | Yes | First refactor; reduce local presentation controls to meaningful art-direction choices. |
| `pinned-visual-story.liquid` | Pinned visual story | Campaign & editorial | Home | Yes | Preserve documented desktop-only choreography/fallback. |
| `material-craft.liquid` | Material craft | Campaign & editorial | Home | Yes | Remains an optional editorial module. |
| `editorial-details.liquid` | Editorial details | Campaign & editorial | Home | Yes | A 2–4 item material, proportion, care or delivery note. The section selects image or icon treatment for the complete set; it does not duplicate PDP confidence blocks. |
| `scrolling-text.liquid` | Scrolling text | Campaign & editorial | Home | Yes | A restrained in-flow motion band for short editorial messages and optional links; it is unrelated to the fixed Header-owned Announcement bar. |
| `shoppable-hero.liquid` | Shoppable hero | Shop the story | Home | Yes | Full-bleed campaign media with product-linked hotspot blocks; hotspots must lead to a product page, never imply a variant-safe add. |
| `shoppable-story.liquid` | Shoppable story | Shop the story | Home | Yes | Retain the explicit external `story-product` Theme Block allowlist. |
| `outfit-composition.liquid` | Outfit composition | Shop the story | Home | Yes | Allowlist the external, movable `outfit-item` Theme Block; retain independent item state and never represent a bundle. |
| `featured-edit.liquid` | Featured edit | Products & collections | Home, 404 | Yes | Collection-based merchandising; optional 404 recovery discovery below the fixed recovery action. |
| `collections.liquid` | Collections | — | List collections | No | Fixed template owner; always renders the store's collection inventory. |
| `collection-list.liquid` | Collection list | Products & collections | Home, 404 | Yes | Explicit `collection-card` Theme Block allowlist; optional 404 recovery discovery, never substitutes for the all-collections template. |
| `product-recommendations.liquid` | Product recommendations | Products & collections | Product | Yes | Product-context-only recommendation surface. |
| `related-stories.liquid` | Related stories | Content | Article | No | Fixed article continuation, not a generic product/content grid. |
| `page.liquid` | Page | — | Page | Fixed | Template reading composition. |
| `contact-form.liquid` | Contact form | Forms & utility | Home, Page templates | Yes | Native Shopify contact form; one instance per template. The `page.contact` template retains its canonical instance, while Home and other Page templates may add it intentionally. |
| `email-signup.liquid` | Email sign up | Forms & utility | All JSON templates | Yes | Native Shopify customer form; one addable instance per template. It shares the `newsletter` customer tag with the Footer-owned newsletter block, but is a separate campaign/signup placement. |
| `faq.liquid` | FAQ | Forms & utility | Page/FAQ template | No | Fixed information composition. |
| `blog.liquid` | Blog | — | Blog | Fixed | Blog archive owner. |
| `article.liquid` | Article | — | Article | Fixed | Article reading owner. |
| `collection-header.liquid` | Collection header | — | Collection | Fixed | Owns collection image/banner and title presentation only. |
| `collection-product-grid.liquid` | Collection product grid | — | Collection | Fixed | Owns collection description, product grid, facets, sorting, pagination and AJAX discovery boundary. |
| `product.liquid` | Product information | — | Product | Fixed | Product blocks own rearrangeable detail content. |
| `cart.liquid` | Cart | — | Cart | Fixed | Native cart task owner. |
| `cart-drawer.liquid` | Cart drawer | — | Global runtime surface | Fixed | Not a merchant-added page section. |
| `search.liquid` | Search | — | Search | Fixed | Search task owner. |
| `predictive-search.liquid` | Predictive search | — | Global enhancement surface | Fixed | Controlled by header/search flow. |
| `404.liquid` | 404 page | — | 404 | Fixed | Recovery owner. |
| `password.liquid` | Password page | — | Password | Fixed | Native password owner. |
| `hello-world.liquid` | — | — | — | Remove | Development artifact; never ship or categorize. |

Gift card is a Liquid template and therefore has no Theme Editor section picker under the current platform exception; its native balance and redemption experience remains template-owned.

## Schema pattern

An addable Narrivelle section follows this shape. It is illustrative; the actual locale keys must exist before the section schema references them.

```liquid
{% schema %}
{
  "name": "t:general.editorial_hero",
  "enabled_on": { "templates": ["index"] },
  "settings": [
    { "type": "header", "content": "t:general.content" }
  ],
  "presets": [
    {
      "name": "t:general.editorial_hero",
      "category": "Campaign & editorial"
    }
  ]
}
{% endschema %}
```

A template-owned section retains its placement policy but omits `presets`. Do not add an empty preset merely to make the picker look complete.

## Implementation and migration sequence

1. Maintain the six canonical category labels exactly as written in this document.
2. For an addable section being refactored, add `category` to each intentional preset. Do not mass-edit categories before its settings and placement are reviewed.
3. Keep the section `type`/filename stable when an existing template instance must survive. Preset category changes do not require a type migration.
4. For every existing setting, decide: **keep** (meaningful decision), **rename** (unclear label), **merge** (two controls express one decision), **move global** (system-level), or **remove** (implementation tuning). Document a compatibility strategy before deleting a persisted setting.
5. Preserve valid default JSON/template instances. If an obsolete setting is removed, Liquid must no longer depend on it and existing saved data must degrade to the new default without a broken layout.
6. Validate locale keys, JSON schemas, section placement, Theme Check, and `git diff --check`. The repository validator must recursively inspect every `t:` reference in section and Theme Block schemas, not only Liquid's `| t` calls. Then verify Add section grouping, search, add/remove/reorder/duplicate/save/reload, long copy, missing resources, and the compact/tablet/desktop contract in Shopify preview.
7. Record evidence in `docs/Roadmap/current-step.md` only after the relevant checks pass.

## Review checklist for every section refactor

- [ ] The section has one merchant outcome and a clear owner template/group.
- [ ] Its preset is present only when the merchant can intentionally add the section.
- [ ] The preset uses exactly one canonical picker category.
- [ ] `enabled_on` or `disabled_on` is explicit and narrow.
- [ ] Every customer-facing schema string uses a locale key.
- [ ] Settings are ordered Content → Layout → Style and are meaningful, visible decisions.
- [ ] Every range default is on an allowed step: `min + (n × step)`, and lies inside its declared range.
- [ ] No arbitrary px/animation/CSS implementation controls are exposed.
- [ ] Blocks are explicit, owner-scoped, and have safe defaults.
- [ ] Missing data, long copy, compact, tablet, desktop, keyboard, reduced motion, and Theme Editor lifecycle are covered by the component contract.
- [ ] Static validation and Shopify preview evidence are recorded before the section is marked complete.

## References

- Shopify, [Section schema: presets and categories](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)
- Shopify, [Section groups](https://shopify.dev/docs/storefronts/themes/architecture/section-groups)
- Shopify, [Theme architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- Local product direction: [`../Discovery/product-brief.md`](../Discovery/product-brief.md)
- Local foundation rules: [`foundation-architecture.md`](foundation-architecture.md)
- Local interaction rules: [`interaction-architecture-standard.md`](interaction-architecture-standard.md)
