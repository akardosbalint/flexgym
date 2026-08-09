# Flex Gym

Modern redesign of the Flex Gym Budapest website: public marketing pages
(Kezdőlap, Árak, Galéria, Edzőink, Kapcsolat) plus a member dashboard behind
login that shows the member's current membership, usage, and history, with a
renew/purchase flow.

Built with Next.js (App Router), TypeScript, Tailwind CSS 4, NextAuth
(Credentials) and Prisma/SQLite.

## Brand

- Dark ("ink") chrome for the header, footer and page heroes, with a subtle
  tiled dumbbell/badge watermark — white ("paper") rounded content cards for
  tables, forms and grids, echoing the original site's layout.
- Accent red (`--accent`) throughout, `Anton` for big display headings,
  `Oswald` for section headings, `Inter` for body text.
- All tokens live in `src/app/globals.css`; see `--ink-*` / `--paper-*` /
  `--accent*` custom properties and their Tailwind `@theme inline` mapping.

## GPass

The gym's real membership/access control runs on GPass. There is no GPass
API integration yet — the member dashboard reads from a local Prisma/SQLite
database seeded with realistic mock membership, check-in and purchase data,
so the UI and flows (viewing usage, renewing a membership) can be built and
demoed today. Swapping the mock data layer (`src/lib/dashboard-data.ts`,
`src/app/dashboard/berlet/actions.ts`) for real GPass API calls is the
natural next step once API access is available.

## Getting started

```bash
npm install
cp .env.example .env   # then edit AUTH_SECRET for anything beyond local dev
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open http://localhost:3000. Demo login: `demo@flexgym.hu` / `flexgym123`.

## Project structure

- `src/app/(site)/*` — public marketing pages, wrapped by `src/app/(site)/layout.tsx`.
- `src/app/dashboard/*` — authenticated member area, protected by `src/middleware.ts`.
- `src/app/api/*` — route handlers (NextAuth, registration, contact form).
- `src/lib/auth.ts` / `auth.config.ts` — NextAuth setup (config split so the
  Edge middleware doesn't need to bundle Prisma/bcrypt).
- `prisma/schema.prisma` — data model (`User`, `Membership`, `CheckIn`, `Purchase`).
- `prisma/seed.ts` — demo data seed script (`npm run db:seed`).

## Scripts

- `npm run dev` — start the dev server.
- `npm run build` / `npm run start` — production build and start.
- `npm run lint` — ESLint.
- `npm run db:seed` — reset and reseed the local SQLite database.
