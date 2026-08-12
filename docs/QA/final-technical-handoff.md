# Final technical handoff

Status: **TECHNICAL HANDOFF READY / NOT SUBMISSION READY — 2026-08-11**

This document records the repository handoff point after implementation QA and hosted Lighthouse QA. It is a technical delivery record, not a Shopify Theme Store submission claim. Shopify-owned/provider-dependent validation remains deferred until a qualified demo or client-transfer store exists.

## Handoff snapshot

| Item | Recorded state |
|---|---|
| Branch / revision | `feat/update-style` at `c6def51` (`QA`) |
| Working tree at handoff | Clean; `HEAD` matches `origin/feat/update-style` |
| Theme metadata | Name `Narrivelle`, author `AmazinPro`, version `1.0.0`; professional trademark clearance and owner-provided public documentation/support destinations remain required for public listing |
| Theme implementation | GAP-01 through GAP-10 are implementation-complete for the available development-store fixtures |
| Static QA | 2026-08-11: validator 151 files / 206 storefront keys / 523 schema keys; Theme Check 95 files, zero offenses; JavaScript syntax checks and `git diff --check` passed |
| Lighthouse QA | Closed on Development Theme `#190375493996`; representative Mobile Slow 4G routes met the owner baseline and CLS was 0 |
| Package | Valid 149-file / 1,038,712-byte technical archive produced; it excludes credentials, `markets.json`, `.git` and `node_modules` |
| Release readiness | **NOT READY** |

The authoritative detailed records are [`../Roadmap/current-step.md`](../Roadmap/current-step.md) and [`../Specifications/theme-store-submission-gap-register.md`](../Specifications/theme-store-submission-gap-register.md).

## What is included

- Shopify-native PDP accelerated checkout, pickup availability, payment terms and Follow on Shop surfaces. The theme supplies placement and progressive enhancement only; Shopify remains the owner of payment, eligibility, pickup, account and checkout data.
- Search facets, three-level navigation, Custom Liquid insertion, Featured product app blocks, Gift Card QR and the tax-inclusive Cart notice.
- Locale-backed storefront and schema copy, explicit section/block placement governance, and the Compact `<48rem`, Tablet `48–63.99rem`, Desktop `≥64rem` layout contract.
- Existing QA runbooks, provenance/licensing records and Theme Store gap register.

## Explicitly deferred — do not mark PASS

These cannot be honestly verified with the current store and are outside this handoff's completion claim:

| Area | Deferred evidence |
|---|---|
| Provider and Shopify-native flows | Accelerated-checkout handoff, Shop Pay Installments eligibility and disclosure, Follow on Shop eligibility, full pickup state matrix, Apple Wallet and issued/expired Gift Card states |
| Product/cart fixtures | Tracked deny-oversell inventory, selling plans, rich-media matrix and qualified provider data |
| Browser and accessibility | Current browser/social-webview matrix, screen-reader core flows and final reduced-motion/device evidence |
| Fresh install / editor | Fresh-store ZIP installation and complete Theme Editor lifecycle on a clean store |
| Commercial submission | Trademark clearance, release metadata, two parity presets, `/listings/`, licensed demo assets, public documentation/support and demo-store review |

Lighthouse does not replace any of these rows. Shopify must remain the source of truth for every provider-native response and account/checkout flow.

## Re-open procedure

1. Start from this branch and preserve unrelated worktree changes.
2. Provision a qualified demo/client-transfer store with legitimate provider, inventory, pickup, Gift Card and media fixtures; do not fake Shopify states.
3. Execute the relevant rows in the gap register and existing QA runbooks at Compact, Tablet and Desktop widths. Record PASS, FAIL or NOT EVIDENCED with route, fixture, viewport and reproduction evidence.
4. Re-run after any source change:

   ```sh
   node scripts/validate-theme.mjs
   shopify theme check --path theme --fail-level error --no-color
   git diff --check
   ```

   Run JavaScript syntax checks whenever JavaScript changes.

5. Update the gap register and `current-step.md` only from recorded evidence. Begin commercial packaging only once the hardening gate and commercial prerequisites are demonstrably complete.

## Current operating decision

Treat the repository as a maintenance/handoff baseline. Do not add generic marketing popups or other net-new storefront features without a merchant problem, acceptance criteria, localization/placement contract, and a review of interaction, performance and support impact.
