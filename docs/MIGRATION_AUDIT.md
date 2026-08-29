# SSAROMA migration audit

## Product and user flows

SSAROMA is a luxury fragrance house in Peshawar with two connected surfaces: an editorial brand site and a cash-on-delivery fragrance shop. Visitors discover the house, browse and filter fragrances, inspect fragrance notes and media, add items to a browser bag, and submit a COD order. Staff operate the same catalog through a protected dashboard and manage fulfillment, returns, finance, promotions, enquiries, taxonomy, and public brand settings.

## Existing public application

- `/` — editorial brand landing page with house story, visit ritual, featured fragrances, gallery, boutique CTA, and footer.
- `/products` — search, filters, sorting, grid/list views, media carousel, quick add, and cart drawer.
- `/products/:slug` — product metadata, gallery, notes, quantity, share/wishlist UI, related products, and buy/add-to-bag actions.
- `/checkout` — customer and delivery fields, order summary, delivery calculation, and a simulated COD confirmation.
- Global cart — stored only in localStorage and populated from a hardcoded product array.

## Existing dashboard

- `/secret/dashboard` — a single 3,000+ line client component containing login, overview metrics, orders, fulfillment, returns/refunds, finance, product catalog, media editor, and promotions.
- Login credentials are hardcoded in browser code.
- Products, orders, returns, promotions, charts, and metrics are seed constants.
- Mutations are saved to localStorage and never reach the storefront.
- Uploaded files use temporary blob URLs and disappear outside the current browser.
- Checkout never creates an order; dashboard orders therefore cannot originate from the public site.

## Migration decisions

- Preserve the cream/ink/gold brand system, typography, editorial motion, responsive layouts, and dashboard visual language.
- Replace TanStack Start/Vite routing with Next.js App Router and Server Components around focused client interaction islands.
- Use MongoDB for products, categories, collections, orders, promotions, returns, contacts, site settings, administrators, and rate-limit records.
- Use Cloudinary only from server routes. MongoDB stores secure URLs, public IDs, dimensions, formats, and media ordering.
- Keep the shopping bag device-local because it is intentionally temporary; validate every product, price, stock flag, promotion, and total again on the server at checkout.
- Retain returns because it was an intentional dashboard addition and is part of the COD workflow. Remove demo-reset behavior and fake charts.
- Add taxonomy, enquiries, and brand/settings management because those public concerns previously had no dashboard control.
- Add category and collection landing routes so managed taxonomy has a public purpose and crawlable SEO surface.

## Deployment constraint

The previous `.openai/hosting.json` targets OpenAI Sites/Cloudflare Workers. That runtime cannot use Mongoose's raw MongoDB TCP connection. The migrated application targets a Node.js Next.js host (for example Vercel), as required by the explicit Next.js and Mongoose architecture. The old hosting file is retained as project history and is not the production runtime contract.
