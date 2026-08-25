# Collections, product cards, and search

## Collection setup in Shopify admin

Create products and collections in Shopify admin before styling their presentation. Collection title, description, image, product membership, availability, price, vendor, product type, and filter values are Shopify data.

To configure filters, use Shopify's Search & Discovery configuration for the store. Narrivelle renders the filters, sort options, active filters, and URLs returned by Shopify; it does not invent filter values or query the catalog in the browser.

## Collection template

The collection template uses a **Collection header** and **Collection product grid**.

### Collection header

Choose whether to show the collection image and title, then configure image height, title position/alignment, overlay strength, and text color. If an image is unavailable, ensure the title and description still make the collection understandable.

### Collection product grid

Configure desktop/mobile columns, products per page, product image ratio, variant summary, quick view, collection description, and the desktop Sidebar or Drawer filter layout. Filtering, sorting, and product count can each be enabled or disabled.

Use a sensible products-per-page value and test filtering, sorting, pagination, empty results, long product titles, sale products, sold-out products, and products without media.

## All-products and collection-list pages

- **All products header** controls eyebrow, heading, intro, and alignment for the all-products collection template.
- **List collections** shows the store's collection inventory. Its settings control heading, intro, excluded collections, alignment, desktop items per row, and grid spacing.
- **Collection list** is an addable home-page/404 section with collection-card blocks. Each card selects a collection, an optional title override, and a focal point.

## Product-card guidance

Global Product cards settings control image fit, vendor, badges, second image on hover, title typography/line count, and price typography. Section-level grids can additionally choose the image ratio and product columns.

Use complete product titles and accessible product imagery in Shopify. Do not rely on a hover image or badge as the only way to understand a product.

## Search

The global **Search behavior** setting chooses the search page or drawer. **Predictive search content** chooses Products only or Products + content for suggestions.

The Search template controls desktop/mobile grid columns, image ratio, filter layout, filtering, and sorting. Search filters are only useful after Shopify admin has configured eligible filters and a search returns products. Standard search remains a normal Shopify GET URL, so customers can bookmark, share, and open results without JavaScript.

## Search page suggestions

The search page may show Shopify predictive product suggestions separately from the standard search results. It does not replace the normal results page or filter query.

## Quality checklist

- Collection and search titles/descriptions remain useful without images.
- Filter values come from Shopify admin, not manual copy.
- Results work with filtering disabled and with JavaScript unavailable.
- Sidebar and Drawer layouts are checked at Compact, Tablet, and Desktop widths.
- Pagination and browser Back/Forward preserve the expected Shopify result URL.
