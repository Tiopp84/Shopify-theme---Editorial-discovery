# Header, announcement bar, and footer

The header and footer are global section groups. A change here applies throughout the storefront. Open **Customize**, then select **Header** or **Footer** in the left sidebar.

## Header

The Header controls the logo, primary navigation, customer account entry, localization controls, and sticky navigation behavior.

### Setup order

1. In **Content → Menus**, build the primary menu in Shopify admin. Narrivelle supports one, two, and three menu levels.
2. In Header settings, select the menu and keep **Enable navigation** on.
3. Upload a logo, then set separate desktop and mobile logo widths.
4. Choose the desktop logo and menu positions, then check the complete header at desktop and mobile widths.
5. Enable sticky/compact navigation only after testing it with the actual menu labels.

### Header settings

| Setting | Use |
|---|---|
| Logo / logo widths | Select a logo and set its desktop and mobile display widths. Use a transparent, high-resolution file. |
| Menu | Select the Shopify menu used by the header. If no menu is selected, the store's `main-menu` fallback is used where available. |
| Customer account menu | Select the menu used by Shopify's native customer-account surface. Shopify owns sign-in/account behavior. |
| Enable navigation | Shows or hides the menu navigation. |
| Enable dropdown hover | Allows desktop menu disclosure on hover; keyboard controls remain available. |
| Desktop logo/menu position | Set left or centre alignment for the desktop composition. |
| Header height | Sets the regular desktop header height. |
| Enable compact navigation / compact header height | Controls the smaller sticky desktop navigation treatment. |
| Show account | Shows Shopify's native account entry point. |
| Show localization | Shows Shopify country/language controls when store configuration makes them available. |
| Sticky header | Keeps the header available as customers scroll. |

### Navigation guidance

Keep menu labels short and make every level a useful destination. For a menu item with grandchildren, the parent and its children should still lead somewhere meaningful. Test long labels, keyboard navigation, Escape, mobile menu closing, and the Back button after changing menus.

## Announcement bar

The Announcement bar lives in the Header group and uses editable Announcement blocks.

- Add an Announcement block for each message.
- Set its text and optional destination link.
- Turn **Show announcement** off to hide the bar without deleting blocks.
- Choose **Slide and fade** or **Continuously scroll right to left**, then adjust the corresponding speed.
- Set bar height and text size conservatively so the header remains usable on compact screens.

Use one concise message per block. A linked announcement should lead to a real destination; do not use an announcement for fake urgency, stock, or countdown claims.

## Footer

The Footer is built from editable blocks. Add, remove, or reorder only the following blocks:

| Block | Use |
|---|---|
| Footer brand | Optional logo, logo width, and brand description. |
| Footer menu | Heading and a Shopify menu. An unassigned menu does not reserve a storefront column. |
| Newsletter | Newsletter heading and optional supporting copy. Shopify handles the submitted customer email. |
| Footer legal | Heading and a Shopify menu for policies or legal links. |
| Follow on Shop and social | Social heading/links and Shopify's native Follow on Shop button when eligible. |

Footer settings also control spacing, copyright, country selector, language selector, payment icons, and the desktop footer-panel transition. Country/language, payment icons, and Follow on Shop only display when Shopify provides the relevant data or eligibility.

## Review checklist

- Logo is legible on its background and does not crop.
- Menu has useful one-, two-, and three-level paths.
- Account, localization, and cart controls remain reachable.
- Footer menus have no empty headings or empty columns.
- Newsletter consent/copy follows your privacy policy.
- Header and footer work at Compact, Tablet, and Desktop widths.
