# Preset and listing asset manifest

## Purpose

This is the release-control manifest for the two Shopify Theme Store presets. It records the visual direction, required listing assets, and the evidence needed before an asset can enter either public demo store or the listing package. The files in `theme/listings/` intentionally contain configuration only: Shopify does not transfer demo-store imagery to a merchant installation.

No row marked **PENDING** may be represented as approved, licensed, or ready for Theme Store submission.

## Preset overview

| Preset | Positioning | Demo catalogue | Listing template | Readiness |
| --- | --- | --- | --- | --- |
| Narrivelle | High-end editorial campaign; immersive visual discovery and shoppable storytelling | Apparel, 11–100+ products | `theme/listings/narrivelle/templates/index.json` | Structure ready; demo and assets pending |
| Still | Minimal, quiet product discovery; concise collection and low-density composition | Apparel, 2–10 products | `theme/listings/still/templates/index.json` | Structure ready; demo and assets pending |

Both presets expose the same theme capabilities. Their homepage composition is deliberately different; this is a visual-direction decision, not a feature restriction.

## Asset register — Narrivelle

| Asset group | Minimum scope | Intended use | Required evidence before import | Status |
| --- | --- | --- | --- | --- |
| Hero media | 1 desktop landscape + 1 mobile portrait | Homepage hero and preset thumbnail direction | Source URL/file ID, creator/copyright holder, commercial redistribution licence, model/property releases where applicable | PENDING |
| Campaign/editorial media | 3–6 images | Shoppable story, pinned chapters and outfit composition | Same evidence; record crop/derivative permission | PENDING |
| Product catalogue media | 11–100+ products with complete product data | Product cards, collection pages, search and product demo flows | Product/photo ownership or commercial licence, product copy approval, price/inventory accuracy | PENDING |
| Material/detail media | 2 images | Material craft section | Same evidence as hero media | PENDING |
| Listing screenshots | Desktop 2000 × 2496 px and mobile 750 × 1334 px | Shopify listing gallery | Captured from the final demo store; show real configured content, not editor placeholders | PENDING |
| Listing highlights | 3 images, 1600 × 1200 px | Shopify listing highlights | Captured from final demo store; claims must match delivered features | PENDING |

## Asset register — Still

| Asset group | Minimum scope | Intended use | Required evidence before import | Status |
| --- | --- | --- | --- | --- |
| Hero media | 1 desktop landscape + 1 mobile portrait | Homepage hero and preset thumbnail direction | Source URL/file ID, creator/copyright holder, commercial redistribution licence, model/property releases where applicable | PENDING |
| Product catalogue media | 2–10 products with complete product data | Product cards, collection pages, search and product demo flows | Product/photo ownership or commercial licence, product copy approval, price/inventory accuracy | PENDING |
| Material/detail media | 1–2 images | Material craft section | Same evidence as hero media | PENDING |
| Listing screenshots | Desktop 2000 × 2496 px and mobile 750 × 1334 px | Shopify listing gallery | Captured from the final demo store; show real configured content, not editor placeholders | PENDING |
| Listing highlights | 3 images, 1600 × 1200 px | Shopify listing highlights | Captured from final demo store; claims must match delivered features | PENDING |

## Per-asset intake record

Create one row in `docs/Governance/asset-license-register.md` for every imported commercial asset, with:

- exact source URL or immutable source-file ID;
- asset filename, derivative/crop details and each location used;
- copyright owner/creator and licence text or purchase receipt;
- commercial redistribution confirmation for Theme Store demo/listing use;
- model, property, logo and trademark releases when relevant;
- reviewer, approval date and any expiry or attribution obligation.

## Submission gates

1. Configure a separate, fully working demo store for each preset from its listing template.
2. Replace every visual placeholder with an approved asset and record it in the licence register.
3. Verify the installation state of each preset has the same layout, colour and typography as its matching demo store.
4. Capture the final screenshot/highlight set only after the demo parity check passes.
5. Recheck `Narrivelle` and `Still` against trademark, domain and Theme Store naming conflicts immediately before the first public upload.
