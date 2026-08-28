# Theme Store submission evidence

Use this record for the release candidate that will be submitted to the Shopify
Theme Store. An unchecked item is a submission blocker unless it is explicitly
marked **N/A** with a reason and reviewer approval.

## Release identity

| Field | Value |
| --- | --- |
| Theme | Narrivelle |
| Version | 1.0.0 |
| Release commit | `274bf38` (candidate; replace after the final release commit) |
| Package filename | `Narrivelle-1.0.0.zip` |
| Package SHA-256 | `bbb5f6da0f796d44e9b9c0af9614d949d4d16c8d063c1f394a887d985830477a` (candidate) |
| Package date | 2026-08-26 |
| Engineering owner | `TBD` |
| QA owner | `TBD` |
| Support owner | `TBD` |

## Local release checks

| Check | Result | Evidence / date |
| --- | --- | --- |
| `shopify theme check --path theme` | [x] Pass | 2026-08-26 — 99 files, 0 offenses |
| `node scripts/validate-theme.mjs` | [x] Pass | 2026-08-26 — 156 files validated |
| `git diff --check` | [x] Pass | 2026-08-26 |
| Package contains both preset listing templates | [x] Pass | 2026-08-26 |
| Package excludes `config/markets.json`, Sass, and `robots.txt.liquid` | [x] Pass | 2026-08-26 |
| Package tested on a fresh development store | [ ] Pending | |

## Public documentation and support

| Check | Result | Evidence / date |
| --- | --- | --- |
| Documentation URL works while logged out | [ ] Pending | https://amazinsolution.com/themes/narrivelle/docs/ |
| Support form works while logged out | [ ] Pending | https://amazinsolution.com/themes/narrivelle/support/ |
| Support confirmation / autoresponder received | [ ] Pending | |
| Support form captures store URL, theme version, issue details, and attachment | [ ] Pending | |
| Documentation covers setup, theme settings, sections, FAQ, troubleshooting, and updates | [ ] Pending | |
| Support policy commits to response within two business days | [ ] Pending | |

## Preset and demo parity

Complete every row for each preset. Record the final public storefront URL and
the matching clean-install test store URL.

| Check | Narrivelle | Still |
| --- | --- | --- |
| Final demo URL recorded | [ ] | [ ] |
| Demo theme ID and release commit match | [ ] | [ ] |
| Client transfer store confirmed; no developer preview restriction | [ ] | [ ] |
| Bogus Gateway or Shopify Payments test mode enabled; other methods disabled | [ ] | [ ] |
| No app-dependent or app-presented theme functionality | [ ] | [ ] |
| Authentic catalog, copy, policies, navigation, and media; no placeholders | [ ] | [ ] |
| Asset source and redistribution rights recorded | [ ] | [ ] |
| Install state matches demo layout, typography, palette, and section order | [ ] | [ ] |
| Fresh-store install has no demo-specific handles, metafields, URLs, or broken media | [ ] | [ ] |
| Listing screenshots and highlights captured from final demo | [ ] | [ ] |

Audit note — 2026-08-26: Shopify CLI confirmed that the configured live demo
themes are `Narrivelle Demo` (#166425362682) and `Still` (#200338505809). Their
remote home-page section sequences exactly match their corresponding listing
templates. This confirms structural parity only; visual parity, content rights,
payment mode, and clean-install behavior remain pending.

Clean-install note — 2026-08-26: the Narrivelle preset was installed as Draft
theme #163688939778 on `narrivelle-clean-test`, and the Still preset as Draft
theme #153052184737 on `still-clean-test`. Both Theme Editor home-page previews
rendered their expected listing section sequence without a visible Liquid error.
The hero illustration is the expected media placeholder for a clean install;
demo images do not transfer with a Theme Store preset. Full route and commerce
verification remains pending.

Theme Editor note — 2026-08-26: Narrivelle clean-test home page passed the
section lifecycle smoke test: Custom Liquid could be added, configured,
duplicated, reordered, removed, saved, and cleared after browser refresh. Test
product and Featured product block lifecycles separately before marking the full
Theme Editor matrix row as pass.

Storefront note — 2026-08-26: Narrivelle clean-test header baseline passed on
desktop and mobile, including keyboard/overlay interaction. The apparent footer
occlusion in the Theme Editor was Shopify's Draft toolbar; the standalone
storefront preview showed the footer, country selector, payment icons, and
copyright without content being covered.

Header stress-test note — 2026-08-27: Narrivelle clean-test passed a long,
three-level navigation test after the header hover bridge and active-dropdown
stacking fixes. The test covered entering level two and level three through
their offset gaps, closing outside the menu, and preventing wrapped top-level
menu text from painting over an open panel. Retest the same case in Still after
the shared header file is deployed.

Product QA note — 2026-08-27: Narrivelle clean-test passed variant selection,
sale/sold-out/unavailable states, quantity changes, add-to-cart, and cart-drawer
line updates/removal. Visual evidence also confirms the portrait gallery zoom
keeps its `2 / 3` counter and next/previous controls visible, the selling-plan
selector renders, and the gift-card recipient fields reveal and submit
correctly. Unit price, pickup availability, and payment terms remain pending
or require an approved N/A based on the test-store configuration.

Selling-plan completion note — 2026-08-28: Narrivelle clean-test passed valid
variant-and-selling-plan selection, plan/discount propagation to cart, and the
Quick add safeguard: products with selling plans do not expose Quick add, so
customers select their purchase option on the product page. The remaining
product checks are unit price, pickup availability, and payment terms, or an
approved N/A for each unavailable Shopify test configuration.

Collection and search QA note — 2026-08-28: Narrivelle clean-test passed
collection filter drawer interaction, filtering, price range, sorting,
pagination, clear filters, long titles, and mixed image ratios. Search results,
empty results, long search terms, search filtering/sorting where enabled, and
Shopify predictive-search presentation also passed.

Content-page QA note — 2026-08-28: Narrivelle clean-test passed the previously
completed contact, FAQ, blog/article, 404, password-page where enabled, and
gift-card storefront checks. Retest the same routes in Still before preset
parity sign-off.

Customer-and-markets QA note — 2026-08-28: Narrivelle clean-test passed
signed-out account access. Country selection updates currency correctly through
Shopify's localization form. No additional language is published in this test
store, so language switching is N/A. The country change retains the primary
URL because this store has no market-specific domain or subfolder configured;
this is expected Shopify Markets behavior, not a theme redirect issue.

Theme Editor QA note — 2026-08-28: Narrivelle clean-test passed section/block
add, configure, duplicate, reorder, remove, save, and refresh persistence
checks without a stale preview or console error. Retest in Still before preset
parity sign-off.

## Functional QA matrix

Run in the storefront and Theme Editor using Shopify testing assets. For each
pass, record URL, browser/device, tester, date, and an issue link when failed.

| Area | Required scenarios | Narrivelle | Still |
| --- | --- | --- | --- |
| Header | Long store name; portrait/landscape/transparent logo; 1–3 level and long navigation; mobile; keyboard | [ ] | [ ] |
| Home page | Reordered/duplicated sections; long copy; collection list; newsletter success/error; all included media/motion | [ ] | [ ] |
| Product | Sale, sold out, unavailable option, variant media, swatches, quantity, unit price, selling plan, pickup, payment terms, accelerated checkout, gift-card recipient | [ ] | [ ] |
| Collection and search | Filters, sorting, price range, pagination, empty states, long product titles, varied image ratios | [ ] | [ ] |
| Cart | Drawer/page, quantities, remove, discount, unit price, selling plan, errors, empty cart, checkout handoff | [ ] | [ ] |
| Content pages | Blog/article/comments, contact form, FAQ, 404, password, gift card | [x] Pass — 2026-08-28 | [ ] |
| Customer and markets | Signed in/out account component; country and language selector where enabled | [x] Pass — 2026-08-28; language N/A | [ ] |
| Theme Editor lifecycle | Add, remove, reorder, duplicate and configure sections/blocks; no stale preview or console error | [x] Pass — 2026-08-28 | [ ] |
| JavaScript-off baseline | Navigation and product form remain usable | [ ] | [ ] |

## Accessibility, performance, and compatibility

Run Lighthouse without browser extensions, while logged out, using actual
content. Run each URL at least three times and record the median.

| Template | Device | Performance | Accessibility | Evidence URL / date |
| --- | --- | ---: | ---: | --- |
| Home | Mobile | | >90 Pass | Narrivelle + Still — 2026-08-28 |
| Home | Desktop | | >90 Pass | Narrivelle + Still — 2026-08-28 |
| Product | Mobile | | >90 Pass | Narrivelle + Still — 2026-08-28 |
| Product | Desktop | | >90 Pass | Narrivelle + Still — 2026-08-28 |
| Collection | Mobile | | >90 Pass | Narrivelle + Still — 2026-08-28 |
| Collection | Desktop | | >90 Pass | Narrivelle + Still — 2026-08-28 |

Acceptance: average Performance >= 60 and Accessibility >= 90 for each device
group. Also record keyboard navigation, visible focus, contrast, 200% zoom,
reduced motion, screen-reader smoke tests, and touch targets.

| Compatibility check | Result | Evidence / date |
| --- | --- | --- |
| Safari (latest two) | [ ] | |
| Chrome (latest three) | [ ] | |
| Firefox (latest three) | [ ] | |
| Edge (latest two) | [ ] | |
| Mobile Safari, Chrome Mobile, Samsung Internet | [ ] | |
| Instagram, Facebook, and Pinterest webview browse-to-checkout path | [ ] | |

## Submission sign-off

| Role | Name | Decision | Date | Evidence |
| --- | --- | --- | --- | --- |
| Product | `TBD` | Pending | | |
| Design | `TBD` | Pending | | |
| Engineering | `TBD` | Pending | | |
| QA | `TBD` | Pending | | |
| Support | `TBD` | Pending | | |

Final decision: **DO NOT SUBMIT** until every required row is pass or an
approved N/A with evidence.
