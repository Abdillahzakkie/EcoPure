# Handoff — EcoPure Cleaning

The entry point for a fresh session. For the full design and conventions, read
`docs/ARCHITECTURE.md`; for the approved copy and build order, read
`docs/CLOUD-BUILD-PROMPT.md`; for the design system, see `design/`.

## What this is

The marketing, quoting, and booking site for an eco-friendly cleaning company,
built as one Next.js 16 App Router app: static-first marketing pages from an
editable CMS, a unified quote/booking request flow, guest self-service by signed
link, and a small admin (requests inbox, availability, CMS). Light theme; green
is the action colour, yellow is a highlight only. No payment anywhere — the
customer pays the cleaner after the visit.

## Run it locally

1. Start MongoDB. This repo ships a `compose.yaml` with a pinned `mongo:7.0` on
   host port `27018` and a named volume:

   ```bash
   docker compose up -d
   ```

   Reuse a shared Mongo already on `27018` if one is running. The app uses
   database `ecopure`.
2. Copy `.env.example` to `.env.local`. The defaults point Mongo at `27018` and
   use placeholder email, image, and signing keys, which make the app skip the
   real calls in development.
3. Install, seed, and run:

   ```bash
   pnpm install
   pnpm seed
   pnpm dev
   ```

   Open http://localhost:3000. The admin is at http://localhost:3000/admin
   (sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`).

With placeholder keys, email is logged instead of sent and image upload is
disabled. Production refuses to boot with placeholder keys (it fails closed).

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm ts.check` | `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | Biome check / format |
| `pnpm seed` | Seed CMS content, default availability, and the owner admin |
| `pnpm seed.admin` | Seed only the owner admin |
| `pnpm test` | Vitest unit and integration tests (throwaway DB) |
| `pnpm e2e` | Playwright end-to-end tests (throwaway `ecopure-e2e` DB) |

## Architecture at a glance

- **Marketing pages** (`src/app/(site)`) are static with on-demand ISR. They read
  CMS content through a cached, tagged layer (`src/server/content.ts`); an admin
  save calls `revalidateTag(contentTag(type), "max")` so the affected pages
  regenerate. A fresh database renders the approved copy from the typed seeds in
  `src/content`.
- **Requests** are one `Booking` model with a `kind` discriminator (`quote` or
  `booking`). `POST /api/bookings` validates the shared zod schema, writes the
  record, mints a signed manage token, and emails the owner and customer. A
  failed email never fails the request.
- **Guest manage** (`/booking/manage?token=…`) verifies the signed token
  (`src/server/services/tokens.ts`); the stored `manageTokenId` (jti) is checked
  so a cancelled booking's link is revoked.
- **Admin** (`src/app/(admin)`) is gated by `src/proxy.ts`. Auth is bcrypt + a
  jose JWT cookie, with **passkeys** (WebAuthn via `@simplewebauthn`) as an
  additive sign-in. Screens: requests inbox, booking actions
  (confirm/decline/complete), availability editor, CMS editor, account (passkeys).
- **Availability** rules (recurring windows + date exceptions) drive the booking
  form's slots through a pure, tested derivation
  (`src/server/services/availability.ts`).

## What still needs real credentials or content

Set these in `.env.local` (local) and the host's environment (production). Until
then the site runs with placeholders, failing closed in production.

- **`RESEND_API_KEY`** and **`EMAIL_FROM`** — real Resend key to send owner and
  customer email. With a placeholder, email is logged, not sent.
- **`OWNER_NOTIFY_EMAIL`** — where new request notices land.
- **`IMAGEKIT_URL_ENDPOINT` / `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY`** —
  real ImageKit keys to enable owner image upload. With placeholders, upload is
  disabled and the content editor accepts an image URL instead.
- **`JWT_SECRET`** — a strong random secret (`openssl rand -base64 48`) for admin
  sessions and guest tokens. Production refuses the placeholder.
- **`ADMIN_EMAIL` / `ADMIN_PASSWORD`** — the owner account the seed creates.
  Change the password after first sign-in.
- **`WEBAUTHN_RP_ID` / `WEBAUTHN_ORIGIN`** — set to the production registrable
  domain and origin for passkeys.
- **Content to replace**: the owner fills real contact details (phone, email,
  service area) in admin → Content → Settings; adds real reviews (the public page
  shows an empty state until then); replaces the FAQ and legal bracketed
  placeholders; and uploads real job photos for the gallery and before/after.

## Notable decisions and deviations

- **`email` is optional on `Booking`** so a phone-only quick quote from the hero
  can be captured. A booking (which is confirmed or declined by email) still
  requires an email, enforced by the request validator.
- **Next 16**: `revalidateTag` takes a cache-life profile; the app passes `"max"`.
  `allowedDevOrigins` is set so the dev server hydrates when opened on
  `127.0.0.1` (needed for the Playwright suite).
- The Next CLI prints a security-upgrade notice and stops `next dev`/`next build`
  on the first run, continuing on a retry; the Playwright webServer wraps the dev
  command in a short retry loop for this reason.
