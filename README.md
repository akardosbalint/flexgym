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
- **Payments** go through Stripe Checkout, using real Stripe Products/Prices
  (`src/lib/membership-plans.ts`) — not amounts computed on the fly. The
  **Alkalmi belépő** is a one-time payment (`mode: "payment"`); **Havi**,
  **Negyedéves** and **Éves** bérlet are real auto-renewing subscriptions
  (`mode: "subscription"`), billed by Stripe every month/quarter/year until
  canceled. Clicking a plan on `/dashboard/berlet` creates the right kind of
  Checkout Session and redirects to Stripe's hosted payment page
  (`src/app/dashboard/berlet/actions.ts`). The membership is only
  activated/renewed by webhooks (`src/app/api/webhooks/stripe/route.ts`) —
  never optimistically on redirect, since reaching Stripe isn't proof of a
  completed payment. Members manage or cancel an active subscription
  through the Stripe-hosted Billing Portal (`manageSubscription()` server
  action) — no custom cancellation UI to build or secure.
- **Wallets**: the dashboard's QR card also offers "Add to Google Wallet"
  and "Add to Apple Wallet" buttons (`/api/wallet/google`,
  `/api/wallet/apple`) so a member can save their check-in code to their
  phone for faster entry. Both build the pass server-side from the same
  `checkInCode` used on-page (`src/lib/google-wallet.ts`,
  `src/lib/apple-wallet.ts`) and redirect to `/dashboard?walletError=...`
  with a friendly banner if the corresponding integration isn't
  configured, instead of crashing.
- **Email** (password reset links, contact form submissions) sends through a
  Google Workspace mailbox via SMTP if `GOOGLE_WORKSPACE_EMAIL` /
  `GOOGLE_WORKSPACE_APP_PASSWORD` are set (`src/lib/email.ts`); otherwise it
  logs the content to the server console instead, so both flows still work
  without a real mailbox configured.
- **Analytics** (Vercel Analytics, and GA4 if `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  is set) only loads after a visitor opts into the "statisztikai cookie-k"
  category in the cookie banner (`src/components/cookie-banner.tsx`,
  `src/lib/cookie-consent.ts`) — never before, and never for the
  "necessary only" choice.
- **Privacy self-service**: a signed-in member can download every record
  tied to their account (`GET /api/account/export`) or permanently delete
  their account, password-confirmed (`POST /api/account/delete`), from
  `/dashboard/profil` — the GDPR data-portability and erasure rights.

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

Only `DATABASE_URL` and `AUTH_SECRET` are required to run the site locally —
Stripe, Google Workspace email, the wallets, and analytics all degrade gracefully (see
below) when their env vars are unset.

Open http://localhost:3000.

- Demo member login: `demo@forgegym.hu` / `forgegym123`
- Demo staff login (admin / check-in scanner): `staff@forgegym.hu` / `forgegym123`

### Stripe setup

The four plans in `src/lib/membership-plans.ts` reference real Stripe Price
IDs (`price_...` — these aren't secret, they're safe to keep in source,
unlike the API key). If you ever change the products in Stripe, update the
`priceId`/`priceHuf`/`kind` fields there to match.

1. Create a Stripe account. Test mode is free and fully separate from live
   mode — use it for all local/staging work.
2. Copy the secret key from https://dashboard.stripe.com/test/apikeys into
   `STRIPE_SECRET_KEY`.
3. In the Stripe dashboard, turn on the **Customer Portal** (Settings →
   Billing → Customer portal → Activate) — required for the "Előfizetés
   kezelése" (manage subscription) button, which redirects members to a
   Stripe-hosted page to cancel/resume or update their card.
4. For local webhook delivery, install the [Stripe CLI](https://docs.stripe.com/stripe-cli)
   and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   It prints a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`. The
   CLI forwards **all** event types while running, which is enough locally.
5. Buy a plan on `/dashboard/berlet` and pay with a
   [Stripe test card](https://docs.stripe.com/testing) (e.g.
   `4242 4242 4242 4242`, any future expiry, any CVC). One-time (Alkalmi) or
   the first payment of a subscription both activate the membership once
   the `checkout.session.completed` webhook fires.
6. To see a renewal locally without waiting a real month/quarter/year, use
   the Stripe CLI or dashboard to advance a test clock, or trigger
   `stripe trigger invoice.paid` against a subscribed test customer.

Without `STRIPE_SECRET_KEY` set, the rest of the site still works — only
starting a checkout (or opening the billing portal) fails, gracefully,
with an on-page error message.

**Once deployed**, the webhook endpoint in the Stripe dashboard (Developers
→ Webhooks) needs these event types selected — the CLI's `stripe listen`
forwards everything, but a real endpoint only receives what you pick:
`checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`,
`customer.subscription.deleted`.

### Google Workspace email setup

Password-reset links and contact-form messages send through a Google
Workspace mailbox over SMTP:

1. In the Workspace account that should send mail (e.g. `no-reply@forgegym.hu`),
   turn on 2-Step Verification: https://myaccount.google.com/security
   (if the org blocks this, a Workspace admin needs to allow it under
   Admin console → Security → 2-Step Verification).
2. Create an app password for that account:
   https://myaccount.google.com/apppasswords — pick "Mail" as the app.
3. Fill in `.env`:
   - `GOOGLE_WORKSPACE_EMAIL` — the full mailbox address.
   - `GOOGLE_WORKSPACE_APP_PASSWORD` — the 16-character app password
     (remove the spaces Google displays it with).
4. Submit the contact form on `/kapcsolat`, or request a password reset on
   `/elfelejtett-jelszo` — the email should arrive from that mailbox.

Without these set, both flows still work — the email content is logged to
the server console instead of sent, so nothing crashes or silently drops
the message.

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

### Security headers & rate limiting

`next.config.ts` sets a Content-Security-Policy plus HSTS/X-Frame-Options/
X-Content-Type-Options/Referrer-Policy/Permissions-Policy on every response,
and drops the `X-Powered-By` header. `src/lib/rate-limit.ts` is a small
in-memory sliding-window limiter applied to `register`, `forgot-password`,
`contact`, `account/delete`, and the NextAuth credentials `authorize()`
callback — good enough for a single instance; swap for a shared store (e.g.
Upstash Redis) if this ever runs across multiple serverless instances.

### SEO

`src/app/robots.ts` and `src/app/sitemap.ts` are generated from
`NEXT_PUBLIC_SITE_URL` (set this once deployed — see `.env.example`). The
root layout sets `metadataBase`, a title template, Open Graph/Twitter tags,
and `LocalBusiness`/`WebSite` JSON-LD; `src/app/opengraph-image.tsx`
generates the share-preview image with `next/og` (no image asset needed).
Every public page has its own `title`/`description`; `/dashboard` and
`/admin` are marked `noindex`.

### Analytics setup (optional)

- **Vercel Analytics** works with zero config once deployed on Vercel.
- **GA4**: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env`.

Either way, nothing loads until a visitor accepts the "statisztikai
cookie-k" category in the cookie banner — see `src/components/
consented-analytics.tsx`. `src/lib/analytics-events.ts` exposes a small
`trackEvent()` helper used for conversions like `register_completed`.

## Testing

```bash
npm test        # Vitest unit tests (src/**/*.test.ts)
npm run lint     # ESLint
npx tsc --noEmit # Type check
```

`.github/workflows/ci.yml` runs all three plus `npm run build` on every
pull request; `.github/dependabot.yml` keeps dependencies patched weekly.

## Deploying (Vercel)

1. Create a Postgres database (Vercel Postgres, Neon, Supabase, ...) and copy
   its connection string.
2. In the Vercel project, set the environment variables from `.env.example`:
   `DATABASE_URL`, `AUTH_SECRET` (generate with `npx auth secret`),
   `AUTH_TRUSTED_HOST=true`, `NEXT_PUBLIC_SITE_URL` (the real domain, for
   the sitemap/canonical/OG tags), `STRIPE_SECRET_KEY`, and optionally
   `GOOGLE_WORKSPACE_EMAIL` / `GOOGLE_WORKSPACE_APP_PASSWORD`,
   `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and the Google/Apple Wallet variables
   described above.
3. In the Stripe dashboard, add a webhook endpoint pointing at
   `https://<your-domain>/api/webhooks/stripe` listening for
   `checkout.session.completed`, `invoice.paid`,
   `customer.subscription.updated`, and `customer.subscription.deleted`
   (needed for subscription renewals/cancellations, not just the initial
   payment), and put its signing secret in `STRIPE_WEBHOOK_SECRET`. Also
   activate the Customer Portal (Settings → Billing → Customer portal) so
   the "Előfizetés kezelése" button works.
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
- `src/lib/membership-plans.ts` — the 4 plans (name, Stripe Price ID,
  price, one-time/recurring, duration/entries), the single source of truth
  used by the pricing pages, the checkout action, and the Stripe webhook.
- `src/lib/google-wallet.ts` / `src/lib/apple-wallet.ts` — build the
  "Add to Google/Apple Wallet" pass for a member's check-in code.
- `src/lib/email.ts` — Google Workspace SMTP (Nodemailer) wrapper with a console-log fallback.
- `src/lib/rate-limit.ts` — in-memory rate limiter used by the auth/contact/
  account-deletion routes.
- `src/lib/cookie-consent.ts` / `src/components/cookie-banner.tsx` —
  granular ("necessary" vs "statisztikai") cookie consent, re-openable any
  time via the footer's "Cookie beállítások" link.
- `src/app/api/account/export`, `src/app/api/account/delete` — GDPR
  data-portability and erasure self-service routes.
- `prisma/schema.prisma` — data model (`User` incl. `role`/`checkInCode`/
  `stripeCustomerId`, `Membership` incl. `stripeSubscriptionId`/
  `cancelAtPeriodEnd`, `CheckIn` incl. `scannedById`, `Purchase` incl.
  `stripeSessionId`/`stripeInvoiceId`).
- `prisma/seed.ts` — demo data seed script (`npm run db:seed`): one member,
  one staff account, membership history, check-ins, purchases.

## Scripts

- `npm run dev` — start the dev server.
- `npm run build` / `npm run start` — production build and start.
- `npm run lint` — ESLint.
- `npm test` — Vitest unit tests.
- `npm run db:seed` — reset and reseed the database with demo data.
