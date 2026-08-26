# Contributing to Narrivelle

Narrivelle is a maintained commercial Shopify theme. Contributions are accepted only through the project's approved repository and review process; this document does not grant a license to distribute the theme or its demo assets.

## Before proposing a change

- State the merchant problem, affected routes and acceptance criteria.
- Check the current [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) and relevant Shopify platform guidance.
- Preserve Shopify ownership of checkout, payments, localization, customer accounts and other platform-managed flows.
- Do not add an app dependency, remote runtime, font, stock image, generated asset or third-party code without written provenance and redistribution rights.
- Do not include store credentials, customer data, private URLs, theme IDs or a demo store's exported settings in a contribution.

## Implementation standards

- Use OS 2.0 JSON templates, sections, blocks and settings that a merchant can understand in the Theme Editor.
- Keep Narrivelle and Still preset behavior intentional; test both whenever a shared component changes.
- Maintain responsive layout, keyboard operation, visible focus, reduced-motion behavior, localization and empty states.
- Add or update locale strings for every customer-facing string.
- Avoid hard-coded product handles, collection handles, image URLs, demo copy and commercial claims in reusable theme code.
- Keep changes focused. Do not reformat or replace unrelated files.

## Required verification

Run the applicable checks before requesting review:

```bash
# From theme/
shopify theme check --path .

# From the repository root, when available
node scripts/validate-theme.mjs
git diff --check
```

Then test the changed behavior in Shopify Preview/Theme Editor with real and empty data, at compact and desktop widths. Record any Shopify-owned state that cannot be reproduced locally rather than simulating it.

## Review and release

Every contribution is reviewed for functionality, design coherence, accessibility, performance, merchant clarity and asset provenance. A merged change is not release approval. The release owner completes the validation and evidence gates described in the theme README before packaging or submission.
