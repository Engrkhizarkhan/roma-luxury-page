# SSAROMA Boutique

Production Next.js storefront and operations dashboard for SSAROMA, a fragrance house in Peshawar.

## Stack

- Next.js 16 App Router and React 19
- MongoDB with Mongoose
- Cloudinary media storage
- Signed, HTTP-only administrator sessions
- Zod request validation and Tailwind CSS 4

## Local setup

1. Copy `.env.example` to `.env.local` and provide MongoDB, Cloudinary, administrator, and authentication values. Generate `AUTH_SECRET` with at least 32 random bytes.
2. Install dependencies with `npm install`.
3. Run `npm run db:seed` once to migrate the original nine-product catalog and brand media into MongoDB and Cloudinary.
4. Start the application with `npm run dev`.

The public storefront is available at `/`; the protected dashboard is at `/admin`. The first successful login creates the configured administrator in MongoDB with a bcrypt-hashed password.

## Verification

```sh
npm test
npm run typecheck
npm run lint
npm audit --omit=dev
npm run build
npm run audit:db
npm start
```

The application requires a Node.js Next.js host with network access to MongoDB. The prior OpenAI Sites/Cloudflare metadata is retained for project history, but that runtime cannot provide Mongoose's MongoDB TCP connection.

See [`docs/MIGRATION_AUDIT.md`](docs/MIGRATION_AUDIT.md) for the original frontend audit and migration decisions.

For launch, read the current [`production audit`](docs/PRODUCTION_AUDIT.md) and follow the complete [`ssaroma.pk` VPS/Nginx deployment guide`](docs/DEPLOYMENT.md).
