# Narrivelle

Narrivelle is an editorial Shopify OS 2.0 fashion theme. It is built around restrained typography, product-led storytelling, and flexible merchandising for fashion, accessories, and lifestyle stores.

The release includes two curated presets:

- **Narrivelle** — warm, tactile and editorial.
- **Still** — quieter, product-study focused and neutral.

Both presets use the same codebase. Their storefront composition and defaults live in `/listings` and are applied when the theme is pushed with the matching Shopify CLI listing.

## Requirements

- A Shopify store with permission to manage themes.
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) 3.x or newer.
- Node.js only if you run repository validation scripts from the project root.

## Local development

Run commands from this `theme` directory.

```bash
shopify auth login
shopify theme dev
```

The default development store is configured in `shopify.theme.toml`. To preview a particular demo preset and its store data:

```bash
# Narrivelle demo
shopify theme dev -e narrivelle_demo --listing narrivelle --open

# Still demo
shopify theme dev -e still_demo --listing still --open
```

Use real store content when reviewing product, collection, blog, search, cart, customer and localization flows. A local development theme only mirrors the store selected by the command.

## Presets and demo environments

| Preset | CLI listing | Demo environment | Purpose |
| --- | --- | --- | --- |
| Narrivelle | `narrivelle` | `narrivelle_demo` | Primary editorial fashion demo |
| Still | `still` | `still_demo` | Alternate quiet/product-study demo |

The environment store and theme IDs are deliberately kept in `shopify.theme.toml`, which is excluded from a submission package. Do not copy one store's Theme Editor configuration into the other: each demo has its own products, media, navigation and preset setup.

## Safe demo-store deployment

First stop any active `shopify theme dev` session for the same store. For normal code updates, push only the changed files so store-specific Theme Editor configuration remains intact:

```bash
# Example: push the blog/article update to Narrivelle
shopify theme push -e narrivelle_demo \
  --only sections/blog.liquid \
  --only sections/article.liquid \
  --only locales/en.default.json

# Apply the same code update to Still
shopify theme push -e still_demo \
  --only sections/blog.liquid \
  --only sections/article.liquid \
  --only locales/en.default.json
```

Use a full preset push only when intentionally changing the preset/template configuration:

```bash
shopify theme push -e narrivelle_demo --listing narrivelle --strict
shopify theme push -e still_demo --listing still --strict
```

`config/settings_data.json` and `templates/*.json` can overwrite settings saved in the Theme Editor. Do not include them in a routine code push after a demo store has been merchandised. Make a deliberate backup/pull of the relevant store configuration before any full push.

## Merchant configuration required for the demos

Code alone does not make either demo complete. Configure the following in each Shopify admin and verify it on the storefront:

- Products with complete variants, prices, inventory, media, alt text and color swatches.
- Collections with intentional product membership and landscape collection-banner images.
- Main and footer menus, including real destinations for Catalog, About, Contact and Journal.
- About page, homepage sections and preset-specific media selected in Theme Editor.
- A Journal blog with at least three authored articles, cover images, inline content images and comment settings tested.
- Markets/currency configuration. Keep the country selector where it is useful; enable the language selector only when translated content is available.
- Store policies, contact details, shipping/returns configuration and other merchant-owned content.

Do not use fake reviews, inventory, discounts, ratings, policies, payment claims or shipping promises in a demo.

## Validation

Run these checks before every demo update and before packaging:

```bash
# From this directory
shopify theme check --path .

# From the repository root, when the script is available
node scripts/validate-theme.mjs

# From the repository root: inspect whitespace/patch errors
git diff --check
```

Theme Check and static validation do not prove Shopify-native functionality. Manually test the relevant flow on both demo stores after changes, especially mobile navigation, collection/search filters, product variants and media, cart/checkout handoff, localization, customer account states, blog comments, empty states, keyboard operation and reduced motion.

## Submission package

Create the archive from a clean release commit, not from an arbitrary local worktree:

```bash
shopify theme package --path .
```

Before submitting the resulting ZIP, complete and record a release gate outside the distributable theme package. In particular, verify:

- Current [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) and the [theme test checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist).
- Two complete, independently reviewable demo stores with parity to their listed presets.
- Originality/provenance and redistribution rights for every image, font, icon, dependency and listing asset.
- Public documentation, support contact/form, support SLA, changelog/release notes and accurate listing metadata/screenshots.
- Fresh-store install, Theme Editor lifecycle, browser/mobile coverage, accessibility/performance evidence and all Shopify-native commerce states required by the checklist.
- Release metadata in `config/settings_schema.json`: final theme name, version, author, and real public documentation/support URLs. Do not submit placeholder URLs.

Keep the internal gap register and live-evidence record outside the distributable theme package. A successful package command or Theme Check result is not submission approval.

## Project structure

```text
theme/
├── assets/                 # CSS, JavaScript, fonts and self-hosted media assets
├── blocks/                 # Reusable theme blocks
├── config/                 # Theme settings schema and defaults
├── layout/                 # Storefront document layout
├── listings/               # Narrivelle and Still preset template configurations
├── locales/                # Storefront translations
├── sections/               # Theme Editor sections
├── snippets/               # Reusable Liquid fragments
└── templates/              # JSON and Liquid route templates
```

## Licensing and attribution

The project inherits the Shopify Skeleton Theme license in [LICENSE.md](./LICENSE.md). Included open-source components are listed in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). Keep the complete asset/dependency provenance record outside the distributable package before release. Do not add a commercial, generated or stock asset to the theme or a listing without recording its usage and redistribution rights.

## Support

Before public distribution, replace the Theme Editor documentation and support URLs with owned, publicly accessible Narrivelle destinations. The support route must state the supported theme version, expected response time and the information needed to reproduce an issue.
