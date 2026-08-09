# Forge Gym

Forge Gym is a fictional gym: public marketing pages (Kezdőlap, Árak,
Galéria, Edzőink, Kapcsolat), a member dashboard (membership, usage
history, a personal QR check-in code), a staff-only admin app that scans
members in with a camera, and real Stripe-powered bankcard checkout for
buying/renewing a membership.

Built with Next.js (App Router), TypeScript, Tailwind CSS 4, NextAuth
(Credentials), Prisma/Postgres, and Stripe.

## How the pieces fit together

- **Members** register, see their membership/usage on `/dashboard`, and get
  a personal QR code there (`src/components/dashboard/member-qr-card.tsx`)
  that encodes an opaque per-user `checkInCode`.
- **Staff** (role `STAFF`) log in and use `/admin` — a camera-based QR
  scanner (`jsqr`) with a manual-code fallback — to check members in. Each
  scan hits `POST /api/admin/checkin`, which looks up the member by their
  `checkInCode`, records a `CheckIn`, and tells the staff member whether
  the membership is currently valid.
- **Payments** go through Stripe Checkout (test mode). Clicking a plan on
  `/dashboard/berlet` creates a Checkout Session and redirects to Stripe's
  hosted payment page (`src/app/dashboard/berlet/actions.ts`). The
  membership is only activated by the `checkout.session.completed` webhook
  (`src/app/api/webhooks/stripe/route.ts`) — never optimistically on
  redirect, since reaching Stripe isn't proof of a completed payment.
- **Wallets**: the dashboard's QR card also offers "Add to Google Wallet"
  and "Add to Apple Wallet" buttons (`/api/wallet/google`,
  `/api/wallet/apple`) so a member can save their check-in code to their
  phone for faster entry. Both build the pass server-side from the same
  `checkInCode` used on-page (`src/lib/google-wallet.ts`,
  `src/lib/apple-wallet.ts`) and redirect to `/dashboard?walletError=...`
  with a friendly banner if the corresponding integration isn't
  configured, instead of crashing.

## Brand

- Dark ("ink") chrome for the header, footer and page heroes, with a subtle
  tiled badge watermark — white ("paper") rounded content cards for
  tables, forms and grids.
- Accent red (`--accent`) throughout, `Anton` for big display headings,
  `Oswald` for section headings, `Inter` for body text.
- All tokens live in `src/app/globals.css`; see `--ink-*` / `--paper-*` /
  `--accent*` custom properties and their Tailwind `@theme inline` mapping.

## Getting started

You need a Postgres database (local, or a free-tier hosted one like Vercel
Postgres / Neon / Supabase) and a Stripe account (test mode is free).

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000.

- Demo member login: `demo@forgegym.hu` / `forgegym123`
- Demo staff login (admin / check-in scanner): `staff@forgegym.hu` / `forgegym123`

### Stripe test mode setup

1. Create a free Stripe account and switch to **test mode**.
2. Copy the test secret key from https://dashboard.stripe.com/test/apikeys
   into `STRIPE_SECRET_KEY`.
3. For local webhook delivery, install the [Stripe CLI](https://docs.stripe.com/stripe-cli)
   and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`.
4. Buy a plan on `/dashboard/berlet` and pay with a
   [Stripe test card](https://docs.stripe.com/testing) (e.g.
   `4242 4242 4242 4242`, any future expiry, any CVC). The membership
   activates once the webhook fires.

Without `STRIPE_SECRET_KEY` set, the rest of the site still works — only
starting a checkout fails, gracefully, with an on-page error message.

### Google Wallet setup

1. Create a Google Wallet API issuer account:
   https://pay.google.com/business/console (free).
2. In that project, create a service account and download its JSON key.
3. Fill in `.env`:
   - `GOOGLE_WALLET_ISSUER_ID` — shown in the Business Console.
   - `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL` — the service account's `client_email`.
   - `GOOGLE_WALLET_PRIVATE_KEY` — the key's `private_key` field, with real
     newlines replaced by `\n`.
4. Click "Hozzáadás Google Wallethez" on `/dashboard`. This builds and
   signs a save-to-wallet JWT (`src/lib/google-wallet.ts`) — no live call
   to Google is needed for this flow, so it works as soon as the three
   env vars above are set.

### Apple Wallet setup

Apple Wallet passes need a **paid Apple Developer Program membership**
(there's no free tier for this), so this is the one integration that
can't be turned on without that:

1. Create a Pass Type ID: https://developer.apple.com/account/resources/identifiers/list/passTypeId,
   then generate and download its signing certificate.
2. Fill in `.env`: `APPLE_TEAM_ID`, `APPLE_PASS_TYPE_ID`, `APPLE_WWDR_CERT`
   (Apple's WWDR intermediate certificate), `APPLE_SIGNER_CERT` /
   `APPLE_SIGNER_KEY` (from the Pass Type ID certificate), and
   `APPLE_SIGNER_KEY_PASSPHRASE` if the key has one — all as PEM text with
   real newlines replaced by `\n`.
3. Add real brand icons at `public/wallet/icon.png` (29×29),
   `public/wallet/icon@2x.png` (58×58) and `public/wallet/logo.png` — see
   `public/wallet/README.md`.
4. Click "Hozzáadás Apple Wallethez" on `/dashboard` to download a
   `.pkpass` file (`src/lib/apple-wallet.ts`).

Without these set, both wallet buttons still render — clicking them just
redirects back to the dashboard with an on-page message instead of
crashing.

## Deploying (Vercel)

1. Create a Postgres database (Vercel Postgres, Neon, Supabase, ...) and copy
   its connection string.
2. In the Vercel project, set the environment variables from `.env.example`:
   `DATABASE_URL`, `AUTH_SECRET` (generate with `npx auth secret`),
   `AUTH_TRUSTED_HOST=true`, `STRIPE_SECRET_KEY`, and optionally the
   Google/Apple Wallet variables described above.
3. In the Stripe dashboard, add a webhook endpoint pointing at
   `https://<your-domain>/api/webhooks/stripe` listening for
   `checkout.session.completed`, and put its signing secret in
   `STRIPE_WEBHOOK_SECRET`.
4. Run `npx prisma migrate deploy` against that database once (locally, with
   `DATABASE_URL` pointed at it) to create the tables, then optionally
   `npm run db:seed` for demo data.
5. Deploy. `npm install` triggers `prisma generate` automatically via the
   `postinstall` script.

## Project structure

- `src/app/(site)/*` — public marketing pages, wrapped by `src/app/(site)/layout.tsx`.
- `src/app/dashboard/*` — authenticated member area, protected by `src/middleware.ts`.
- `src/app/admin/*` — staff-only check-in scanner, protected by role in `src/middleware.ts`.
- `src/app/api/*` — route handlers (NextAuth, registration, contact form,
  admin check-in, Stripe webhook).
- `src/lib/auth.ts` / `auth.config.ts` — NextAuth setup (config split so the
  Edge middleware doesn't need to bundle Prisma/bcrypt).
- `src/lib/qr-checkin.ts` — QR content encode/decode for the check-in code.
- `src/lib/membership-plans.ts` — shared plan → duration/entries mapping
  used by both the checkout action and the Stripe webhook.
- `src/lib/google-wallet.ts` / `src/lib/apple-wallet.ts` — build the
  "Add to Google/Apple Wallet" pass for a member's check-in code.
- `prisma/schema.prisma` — data model (`User` incl. `role`/`checkInCode`,
  `Membership`, `CheckIn` incl. `scannedById`, `Purchase` incl.
  `stripeSessionId`).
- `prisma/seed.ts` — demo data seed script (`npm run db:seed`): one member,
  one staff account, membership history, check-ins, purchases.

## Scripts

- `npm run dev` — start the dev server.
- `npm run build` / `npm run start` — production build and start.
- `npm run lint` — ESLint.
- `npm run db:seed` — reset and reseed the database with demo data.
