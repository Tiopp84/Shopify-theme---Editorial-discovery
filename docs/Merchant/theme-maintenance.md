# Theme maintenance and updates

## Work safely

Before changing settings, apps, Custom Liquid, or theme code, duplicate the current published theme. Name the duplicate with the date and purpose, for example `Narrivelle — 2026-08-11 — navigation test`.

Use the duplicate for changes and preview it before publishing. Keep a short change record: who changed what, why, and which pages were checked.

## Updating Narrivelle

When a new version is available:

1. Read the release notes and any update instructions.
2. Duplicate the currently published theme.
3. Install the new version as an unpublished copy.
4. Reapply only required merchant settings, menus, app blocks, and Custom Liquid after checking compatibility.
5. Test Home, Collection, Product, Cart, Search, Content pages, Header, Footer, and mobile navigation.
6. Publish only after the copy passes your own content and purchase-flow review.

Avoid copying an entire old `settings_data.json` file into an update. It can carry obsolete settings, demo references, or incompatible section data.

## Apps and custom code

Apps and Custom Liquid are outside the theme's standard update path. Before updating, record every app block and every Custom Liquid insertion with screenshots and source code. Re-test them after the update.

Do not edit checkout, payment, customer account, pickup, or provider-owned output. If a custom change causes a defect, remove it from a duplicate theme to confirm whether the issue remains in unmodified Narrivelle.

## Troubleshooting sequence

1. Confirm the problem on the current published theme and on an unmodified duplicate.
2. Record the store URL, theme version, affected URL, browser/device, expected behavior, actual behavior, and steps to reproduce.
3. Disable only the most recent Custom Liquid or app block on the duplicate, then test again.
4. Capture screenshots or a short recording.
5. Submit the complete record through the public support form when available.

## Content quality review

After updating products, menus, or sections, check:

- Long titles and long menu labels
- Products without images and products with multiple variants
- Sale and sold-out products
- Empty collection/search states
- Desktop, tablet, and mobile widths
- Keyboard focus and reduced-motion behavior

## Version notes

The Theme Editor metadata identifies this release as Narrivelle 1.0.0 by AmazinPro. The public documentation URL and support URL will be added once the public documentation/support service is live.
