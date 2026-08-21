# SSAroma Luxury Launch

Build a SINGLE-PAGE luxury perfume brand landing page for a fragrance boutique called “SSAroma”. This is only the brand/marketing landing page — do NOT build a store, dashboard, authentication, database, checkout, pricing table, SaaS UI, or admin area in this project.

PRIMARY GOAL
Make the visitor feel that SSAroma is a serious premium fragrance house/boutique with a beautiful physical shop experience. The page should feel cinematic, editorial, expensive, mature, fashion-forward and crafted — closer to a luxury perfume campaign or high-end fashion maison than a typical ecommerce or AI-generated landing page.

TECH / IMPLEMENTATION
- Use Lovable’s normal TypeScript/React stack with Tailwind.
- Use shadcn/ui only where genuinely useful; do NOT make the page look like shadcn cards/components.
- Install/use a lightweight animation library such as Framer Motion if needed.
- Smooth, restrained scroll-reveal animations only: opacity, translate, scale, image crop/reveal, subtle parallax. No excessive floating elements.
- Fully responsive and polished on desktop, tablet and mobile.
- Keep performance high; lazy-load below-fold media and respect prefers-reduced-motion.

BRAND DIRECTION
Palette:
- deep near-black: #090909
- warm cream / parchment: #F1E8D8
- muted champagne gold: #B7925A
- warm off-white: #FAF7F1
Gold must be used sparingly for tiny accents, rules, hover states and small labels — NOT as large gold gradients or shiny backgrounds.

Typography:
- Use a luxury editorial serif for display headings, preferably “Cormorant Garamond” or another elegant high-contrast serif from Google Fonts.
- Use a restrained modern sans-serif for navigation, labels and body copy, such as “Manrope” or “Inter”.
- Headings should feel like luxury fragrance editorial typography: large, confident, refined, with intentional line breaks and generous spacing.
- Avoid random font sizes and inconsistent hierarchy.

ABSOLUTE DESIGN RESTRICTIONS — IMPORTANT
Do NOT use:
- generic AI SaaS layout
- soft-board / dashboard aesthetics
- gradients of any kind
- glassmorphism / translucent glass cards
- frosted blur panels
- glowing effects
- neon effects
- big rounded cards
- pill-shaped containers everywhere
- excessive border-radius
- card grids for every section
- large soft box shadows
- floating dashboard-like panels
- colored feature-icon boxes
- blobs, waves, abstract mesh backgrounds
- fake analytics or app UI mockups
- excessive badges
- generic “three benefits in three cards” sections
- cluttered layouts
- overly playful startup visuals

The design should rely on composition, photography/video, negative space, typography, fine rules, contrast and motion — NOT decorative UI effects.

PAGE STRUCTURE

1. HEADER / NAVIGATION
- Minimal transparent/overlay navigation over the hero initially.
- Text logo: “SSAroma” styled elegantly, not a tech logo.
- Nav: Home, The House, Collection, Experience, Visit.
- Right-side CTA: “Explore Collection” with a refined underline/arrow treatment rather than a chunky button.
- On mobile use a minimal menu.
- Header can transition to a solid near-black or cream state on scroll, but keep it elegant.

2. HERO — FULL VIEWPORT CINEMATIC VIDEO
- Hero should fill roughly 100svh.
- Use a full-bleed cinematic background VIDEO showing luxury perfume/bottle/shop details. Source a tasteful royalty-free placeholder video suitable for a premium fragrance/cosmetics campaign if available; otherwise implement a clearly isolated video source constant with a beautiful fragrance/luxury fallback image so the client video can be swapped with one URL later.
- Video behavior: autoplay, muted, loop, playsInline.
- Add a subtle dark overlay only for readability; no gradient overlay.
- Main copy should be editorial and minimal, positioned with deliberate asymmetry rather than centered in a generic template.
- Eyebrow: “PESHAWAR · FINE FRAGRANCE BOUTIQUE”
- Main headline: “A scent becomes part of your presence.”
- Supporting line: “Discover fragrances chosen for character, depth and the moments they leave behind.”
- Primary CTA: “Discover the collection →”
- Secondary text link: “Experience SSAroma”
- Include a small elegant scroll indicator at the bottom.
- Add only subtle text entrance animation and very slight video scale/parallax on scroll.

3. EDITORIAL BRAND STATEMENT
- Warm cream background.
- Large serif statement occupying generous space, not inside a card.
- Copy: “Fragrance is remembered before it is understood.”
- Short supporting paragraph about helping customers find a signature scent through a curated in-store experience.
- Use thin gold/black rules and small uppercase labels.

4. SIGNATURE COLLECTION / PRODUCT TEASER
- Not a conventional ecommerce grid.
- Create an editorial collection showcase with 3 large fragrance entries using sophisticated perfume product imagery/placeholders.
- Each entry should have a large image, perfume name, scent family, and “View fragrance” link.
- Suggested names: “Noir Oud”, “Velvet Amber”, “Santal Reserve”.
- Layout can alternate large/small image proportions or horizontal editorial compositions.
- Hover should be restrained: image scale 1.02–1.04, underline/arrow movement.
- Include a text CTA that points conceptually to products.ssAroma.com: “Explore all fragrances →”. Use a normal href that can be changed later.

5. THE SSAroma EXPERIENCE
- Near-black section with cream typography.
- Split-screen editorial composition: large shop/interior image or short looping video on one side, text on the other.
- Heading: “More than a shelf of bottles.”
- Copy about visiting the shop, comparing notes, testing fragrances and receiving personal guidance.
- Add three simple text lines separated by hairline rules, NOT cards:
  “Curated selection”
  “Guided discovery”
  “A considered in-store experience”
- Scroll reveal should feel cinematic but subtle.

6. VISUAL STORY / SHOP GALLERY
- Full-width sequence of 2–4 strong shop/fragrance images with editorial cropping.
- Avoid masonry-card UI. Think fashion magazine spread.
- One image can extend edge-to-edge; another can be narrower with lots of whitespace.
- Add a short pull quote: “Find the fragrance people remember you by.”

7. FINAL CTA
- Warm cream background with a strong centered or asymmetric serif headline:
  “Your signature is waiting.”
- Small copy: “Explore the collection online or experience SSAroma in person.”
- Two elegant text/button treatments: “Shop fragrances” and “Visit SSAroma”.
- Buttons must be sharp/minimally rounded, not pills.

8. FOOTER
- Deep black.
- SSAroma wordmark.
- Small nav links: Collection, Instagram, WhatsApp, Visit, Contact.
- Add placeholder address/phone clearly marked in code constants so they can be replaced later.
- Include “© SSAroma”.

IMAGE / VIDEO ART DIRECTION
Use temporary visuals that feel genuinely premium: dark perfume glass, amber liquid, brushed metal, warm cream stone, black lacquer, intimate boutique lighting, shelf details and fragrance close-ups. Do NOT use generic startup imagery. Avoid random flowers unless extremely restrained and editorial.

MICRO-INTERACTIONS
- Fine underline animations on navigation/links.
- Very subtle image zoom on hover.
- Section entrance animations triggered once.
- A small parallax effect on one or two hero/gallery images only.
- Smooth anchor scrolling.
- No distracting cursor follower, particles, spinning blobs, or constant floating animations.

COPY STYLE
Keep copy sparse, premium, confident and human. Avoid generic AI marketing language such as “elevate your journey”, “redefine luxury”, “unlock”, “seamless”, “crafted for you”, or long feature descriptions.

QUALITY BAR
Before finishing, inspect the entire page at desktop and mobile widths. Fix spacing, text wrapping, contrast, image crops, nav behavior, section rhythm, and any signs of generic AI design. The finished landing page should look presentation-ready for a real fragrance shop client, not like a template demo.

Do not ask me questions. Make the best complete first version now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6c8c9d06-c020-4b1a-a1bb-ed864b11f1fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
