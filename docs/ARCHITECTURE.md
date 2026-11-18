# EcoPure Cleaning — architecture, design, and code style

This document defines how the EcoPure Cleaning site is built. It follows the
conventions already in use across the owner's projects: the marketing-plus-admin
shape and server conventions of `train-with-awad`, the frontend style of
`nitrate`, and the Docker rules that apply to every project. The visual design
comes from the approved `EcoPure Cleaning – Fresh and Friendly` artboard. Read
this before you plan a screen or write a line of code.

The audience is a developer building or extending the site. Where this document
and a feature plan disagree, keep the plan's exported interfaces and follow the
conventions here.

Status: **design, awaiting approval.** Nothing is built yet.

---

## 1. What the site is

EcoPure is the marketing, quoting, and booking site for an eco-friendly cleaning
company serving homes and offices. It has four jobs:

1. **Explain the offer** across content pages: home, services (six of them),
   how it works, why EcoPure, reviews, FAQ, and legal.
2. **Capture quote requests.** A visitor who is not ready to pick a time submits
   a free-quote request describing their space.
3. **Take booking requests.** A visitor who is ready picks a service, frequency,
   and one or more preferred time windows. The request arrives as `pending`; the
   owner confirms or declines, and the visitor is emailed either way. No payment
   is taken — the customer pays the cleaner after the visit.
4. **Let the owner run the business** from an admin area: manage quote and
   booking requests, set availability, and edit all marketing content without a
   deploy.

The public pages are content-heavy and low-traffic; most change rarely. The
genuinely dynamic surfaces are the request flow, the guest-manage flow, and the
admin. The architecture is sized to that: statically rendered marketing pages
backed by editable content, one public write path for requests, and a small
authenticated admin.

A quote and a booking are the **same record** with different completeness — see
section 8. This keeps one write path, one model, one inbox.

### Scope boundaries

In scope: the public marketing pages, the unified quote/booking request flow,
guest self-service management of a booking by signed link, owner-confirmed
scheduling against an availability model, admin management of requests and
availability, a CMS for marketing content, and the SEO and accessibility
baseline a public site needs.

Out of scope, and called out so nobody builds them by reflex:

- **Online payment.** Booking and quotes are free; the customer pays the cleaner
  directly. There is no Stripe, no card data, no `Order` model. If deposits are
  ever wanted, add them as a separate v2 behind hosted checkout.
- **Customer accounts.** A customer books as a guest and manages that booking
  through a signed, time-limited link emailed to them. No login, no password, no
  customer table.
- **Instant confirmed booking.** The model is request-then-confirm. The site
  never guarantees a slot at submit time; the owner confirms. This keeps the
  availability model loose and avoids overselling.
- **A separate backend service.** The write surface is a handful of endpoints in
  Next.js Route Handlers. A separate service would be infrastructure the site
  does not need.

---

## 2. Architecture

A single Next.js App Router application, deployed as one unit on Vercel.
Marketing pages are statically rendered from CMS content and regenerated
on-demand when the owner edits (ISR + tag revalidation — section 6). Route
Handlers carry the writes. One MongoDB database stores requests, availability,
content, and the admin user. Resend sends email; ImageKit hosts marketing
images.

```text
                           ┌──────────────────────────────────────────────┐
  Visitor ─── HTTPS ─────▶ │  Next.js App (App Router, one deploy, Vercel)  │
                           │                                                │
                           │  (site)   marketing pages ── ISR render ──┐    │
                           │  (site)   /book request form              │    │
                           │  (site)   /booking/manage (signed link)   │    │
                           │  (admin)  dashboard, availability, CMS     │    │
                           │                                     read ▼ │    │
                           │  app/api/bookings        ──┐   src/server/* │    │
                           │  app/api/availability     ─┼─▶ services ────┤    │
                           │  app/api/admin/*          ─┘   models       │    │
                           │  src/proxy.ts (admin auth gate)             │    │
                           └──────────────┬─────────────────────┬────────┘
                                          │                      │
             ┌────────────────────────────┼──────────┬──────────┼─────────────┐
             ▼                            ▼          ▼          ▼              ▼
       MongoDB (Docker 27018 /       Resend       ImageKit    jose          bcrypt
       Atlas in prod)                email        images      signed        admin
       bookings, availability,       owner +      (gallery,   tokens        password
       content, adminUser            customer     before/     (guest +      hash
                                      notices      after)      admin)
```

### Request shapes

- **A content page** (`/`, `/services`, `/services/[slug]`, `/faq`, …) is
  rendered statically from the CMS content in MongoDB, cached as HTML, and
  regenerated when the owner saves an edit (on-demand revalidation by tag). No
  per-request database read on the hot path.
- **A quote or booking request** is a `POST /api/bookings`: validate, write one
  `Booking` document, email the owner and the customer, return 200. This is the
  one piece of interactivity on the public site.
- **A guest manage action** is `GET /booking/manage?token=…` to view, and
  `PATCH /api/bookings/[id]` (token-authorised) to reschedule or cancel. The
  token is signed and time-limited; it scopes access to exactly one booking.
- **An admin action** posts to `/api/admin/*` behind the `src/proxy.ts` auth
  gate: confirm, decline, or complete a request; edit availability; edit
  content. A content save triggers revalidation of the affected pages.

### Why this shape

- **Static-first with on-demand ISR** gives the best performance and SEO for
  pages whose content changes rarely, while still letting the owner edit without
  a deploy. The database stays off the path of the pages people read.
- **Route Handlers over a separate service** keep the whole site in one repo,
  one deploy, one language. The write surface is too small to justify a service
  boundary.
- **Request-then-confirm, no payment** matches how a cleaning business actually
  quotes: price and duration vary by property, so a human confirms. It removes
  payments, PCI scope, and overselling from the build.

---

## 3. Tech stack

Pinned to the versions `train-with-awad` runs, so this checkout matches the
others. Match these in `package.json`; do not reach for a newer major without a
reason.

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 App Router, React 19 | Same as `train-with-awad`. |
| Language | TypeScript 5+, `strict` | Path alias `@/*` → `./src/*`. |
| Styling | styled-components v6 | No Tailwind. SWC transform on (section 7). |
| Data fetching (client) | axios + SWR | Request form, availability lookup, admin screens. |
| Validation | zod | One schema per request body, shared with the client. |
| Database | MongoDB via Mongoose | Shared Docker container, host port `27018`; Atlas in prod. |
| Email | Resend | Owner notice, customer confirmation, status changes. |
| Images | ImageKit | Owner-uploaded gallery, before/after, review avatars. |
| Admin auth | bcryptjs + jose (JWT cookie) | Single owner; passkey (`@simplewebauthn`) available as an upgrade. |
| Guest tokens | jose (signed, time-limited) | Scopes manage access to one booking. |
| Lint and format | Biome | Tabs, width 4, line 120, double quotes, semicolons. |
| Unit tests | Vitest + Testing Library | Throwaway DB per run (section 12). |
| E2E | Playwright | Route smoke, request happy path, guest manage, admin login. |
| Package manager | pnpm | Matches `train-with-awad`. |

Do not add a dependency for something the platform or an installed package
already does. A few lines beat a new entry in `package.json`.

---

## 4. Folder structure

The `train-with-awad` layout, with a `src/server` for writes and the CMS, and a
`src/content` holding only the **seed defaults and types** for CMS content (the
live copy lives in the database).

```text
src/
  app/
    (site)/                        Public pages, with layout.tsx (Header, Footer)
      page.tsx                     Home (the full landing composition)
      services/page.tsx            Services index
      services/[slug]/page.tsx     One service (generateStaticParams from CMS)
      how-it-works/page.tsx
      why-ecopure/page.tsx
      reviews/page.tsx
      faq/page.tsx
      book/page.tsx                Quote/booking request form (primary CTA target)
      booking/manage/page.tsx      Guest view/reschedule/cancel via signed token
      privacy/page.tsx
      terms/page.tsx
    (admin)/
      admin/login/page.tsx
      admin/page.tsx               Dashboard: requests inbox
      admin/bookings/[id]/page.tsx
      admin/availability/page.tsx
      admin/content/page.tsx       CMS: services, reviews, FAQ, gallery, settings
    api/
      bookings/route.ts            POST a quote/booking request
      bookings/[id]/route.ts       PATCH reschedule/cancel (token or admin)
      availability/route.ts        GET derived open windows for the form
      admin/session/route.ts       POST login, DELETE logout
      admin/bookings/[id]/route.ts PATCH confirm/decline/complete
      admin/availability/route.ts  CRUD availability rules and exceptions
      admin/content/[type]/route.ts CRUD a content collection; triggers revalidate
    layout.tsx                     Root: fonts (Outfit, DM Sans), GlobalStyle, metadata
    sitemap.ts                     From CMS services and static routes
    robots.ts
    not-found.tsx
  components/                      Reusable UI, one PascalCase folder each
    Button/ Card/ Field/ Section/ Stat/ Step/ Quote/ Accordion/ BeforeAfter/
    ServiceCard/ StatusPill/ index.ts   (barrel, named exports, alphabetical)
  layouts/                         SiteShell, Header, Footer, AdminShell
  libs/                            Page-level feature components: <Name>Wrapper/
  hooks/                           SWR hooks by resource: Bookings/ Availability/ Admin/
  constants/                       api.ts (axios), fetcher.ts (SWR), index.ts
  content/                         CMS seed defaults + types (services, reviews, faq, settings)
  server/
    db/                            Mongoose connection (cached)
    models/                        Booking, AvailabilityRule, Content, AdminUser
    services/                      bookings.ts, availability.ts, content.ts, email.ts, auth.ts, tokens.ts
    validators/                    zod schemas shared with the client
    config/                        env read once, validated at boot, fail closed
  proxy.ts                         Admin auth gate (Next 16 middleware)
  types/                           Shared types, barrel index.ts
  styles/                          colors.ts, global.ts, motion.ts, index.ts
```

A route's `page.tsx` renders the matching wrapper from `src/libs` and nothing
else. A pure-static content page may render sections directly from components and
CMS content instead of a wrapper — a wrapper earns its place when there is client
state (the request form, the availability picker, the admin screens), not before.

---

## 5. Routing and pages

| Route | Rendering | Data |
| --- | --- | --- |
| `/` | Static (ISR) | CMS: services, reviews, faq, gallery, settings |
| `/services` | Static (ISR) | CMS: services |
| `/services/[slug]` | Static (ISR, `generateStaticParams` from CMS) | one service |
| `/how-it-works` | Static (ISR) | CMS: steps, settings |
| `/why-ecopure` | Static (ISR) | CMS: reasons, settings |
| `/reviews` | Static (ISR) | CMS: reviews |
| `/faq` | Static (ISR) | CMS: faq |
| `/book` | Static shell, client form | `GET /api/availability`, posts `/api/bookings` |
| `/booking/manage` | Dynamic, token-gated | one booking by signed token |
| `/privacy`, `/terms` | Static (ISR) | CMS: legal |
| `/admin/*` | Dynamic, auth-gated | bookings, availability, content |

- Every public page sets its own `metadata` (title, description, Open Graph). The
  home and service pages add JSON-LD (`LocalBusiness`, `Service`) for search.
- **The one primary action is "Book a clean"**, pointing at `/book`. "Get a free
  quote" is the same form reached with the quote intent — the softer path for an
  undecided visitor. Treat booking as the conversion goal; every page points at
  it.
- The home page keeps the drawn in-page anchor nav (Our work, Services, How it
  works, Why EcoPure, FAQ) as plain anchors to sections on `/`. The header's
  "Book"/"Free quote" button is the router navigation.

---

## 6. Design patterns

Reach for these. Each exists in `train-with-awad` or `nitrate` already — reuse
the pattern, do not reinvent it.

- **Thin page, feature wrapper.** Routing lives in `app/`; a `page.tsx` renders
  one wrapper from `src/libs`. Feature logic and client state live in the wrapper.
- **Component = `index.tsx` + `styled.tsx`.** Components, wrappers, layouts, and
  hooks use a default export; `styled.tsx` uses named exports only. The
  `components/index.ts` barrel re-exports defaults by name, alphabetically.
- **Styled suffix and transient props.** Every styled component is named with a
  `Styled` suffix; style-only props are transient `$props`. Interfaces are
  prefixed `I`, type aliases `T`.
- **Server/client boundary kept low.** Content pages are server components. A
  component carries `"use client"` only when it needs browser APIs or state — the
  request form, the before/after slider, the FAQ accordion, the admin screens.
  `styled.tsx` files are client, matching the reference.
- **One axios instance, SWR for reads.** `src/constants/api.ts` builds one cached
  axios instance; `fetcher.ts` wraps it for SWR. Hooks in `src/hooks/<Resource>/`
  wrap `useSWR`; mutations use the same instance. No second fetch helper.
- **Validation at the boundary, shared schema.** A zod schema in
  `src/server/validators` defines each request body. The Route Handler parses
  before touching the database; the client form imports the same schema. A
  malformed body is a 400, never a silent default.
- **Service layer over models.** Route Handlers stay thin: parse, call a service,
  map the result to a response. Business logic lives in `src/server/services`;
  models are Mongoose schemas and nothing else.
- **Config in one place, fail closed.** Every environment variable is read once
  in `src/server/config`, validated with zod at module load. A missing database
  URL, email key, or admin secret is a boot error. Production refuses to boot with
  placeholder keys.
- **Content read cached, writes revalidate.** Public pages read CMS content
  through a cached, tagged data layer (`unstable_cache`/`cacheTag` by content
  type). An admin save writes the document and calls `revalidateTag` for that
  type, so the affected static pages regenerate on-demand. Reads are never on the
  per-request hot path.
- **Errors wrapped and logged, never swallowed.** When a handler maps an error to
  a generic HTTP message, it logs the underlying error first. A caught error that
  is neither handled nor rethrown is a bug.

---

## 7. Design system and styling

The full visual rules are in `design/DIRECTION.md`; the machine-checked ease
rules are in `design/EASE.md`. This section is the token contract the built app
reads. Where `design/mockups/system.css` and `src/styles/global.ts` disagree,
`global.ts` wins and `system.css` is the bug.

### Tokens as CSS custom properties, prefix `--ep-`

No styled-components `ThemeProvider`. Declare design tokens as CSS custom
properties in the `createGlobalStyle` block in `src/styles/global.ts`, and
consume them with `var(--ep-brand)`. Server components read them too. Every token
is prefixed `--ep-`. This is the `nitrate` `--nt-` system under an EcoPure prefix.

```ts
// src/styles/global.ts — the EcoPure light theme, from the approved artboard
:root {
  --ep-bg:            #FAF9F5;   /* warm off-white page ground */
  --ep-surface:       #FFFFFF;   /* cards */
  --ep-surface-mint:  #EAF6EE;   /* tinted section bands */
  --ep-surface-soft:  #F2FAF5;
  --ep-line:          #D5E8DC;   /* hairlines, card borders */
  --ep-text:          #0F3D26;   /* deep green ink */
  --ep-muted:         #3E5A4A;   /* secondary text */
  --ep-brand:         #037B40;   /* primary action, links */
  --ep-brand-strong:  #0F3D26;
  --ep-brand-ink:     #FFFFFF;   /* text on brand green */
  --ep-accent:        #FFC93C;   /* sunny highlight, badges */
  --ep-accent-soft:   #FFE9A8;
  --ep-accent-ink:    #12301F;   /* text on yellow */
  --ep-radius-sm:   12px;
  --ep-radius-md:   16px;
  --ep-radius-card: 22px;
  --ep-radius-pill: 999px;
  /* spacing, type scale, shadows, durations … */
}
```

### `colors.ts`: only what JavaScript must read

`src/styles/colors.ts` exports only the few values JavaScript reads at runtime
(Next's `themeColor` metadata, a component prop that applies before any
stylesheet) as `UPPER_SNAKE` constants. `global.ts` interpolates the same
constants where it declares the matching tokens, so CSS and JS stay one source.

### Two colours, one of them an action

The brand green is the **only action colour** — `.btn.pri`, links, the booking
CTA. The sunny yellow is a **highlight**, never a second button: badges, the
"free quote" pill, a step marker, an underline. One primary action per screen
stays true because only green acts. (This is where EcoPure differs from
`train-with-awad`'s single-accent rule: the warmth of the brand needs the yellow,
but it is decoration, not a competing priority.)

### Typography

Display and headings: **Outfit** (600). Body and UI: **DM Sans**. Load both
through `next/font` in the root layout. Body text is 16px, hints 14px; nothing
readable renders below 14px.

### Motion, SSR registry, accessibility

- `src/styles/motion.ts` holds keyframes and the `prefers-reduced-motion` branch.
- `src/components/StyledComponentsRegistry` uses `ServerStyleSheet`,
  `useServerInsertedHTML`, and `StyleSheetManager`, wired into the root layout;
  `next.config.ts` sets `compiler.styledComponents` with `ssr: true`.
- Every interactive control clears a 44px target on coarse pointers. Text meets
  WCAG AA against the surface it sits on (verify `--ep-muted` on `--ep-bg` and on
  `--ep-surface-mint`; verify `--ep-brand` text on white). Focus-visible rings on
  every control. The request form labels every field and announces errors.
  `prefers-reduced-motion` disables the before/after auto-hint and non-essential
  animation.

### Recurring layout units

The artboard's repeating blocks are components, composed per page, never
reinvented: `Section`, `Card`, `ServiceCard`, `Stat`, `Step` (the numbered "how
it works"), `Quote` (review), `Accordion` (FAQ), `BeforeAfter` (the drag slider),
`StatusPill` (booking status, word + colour).

---

## 8. Data layer

One MongoDB instance, reused from the shared Docker container on host port
`27018` with EcoPure's own database name, `ecopure`, locally; MongoDB Atlas in
production. Connection settings come from env, validated at boot, matching the
running container exactly. Never assume a host-installed Mongo.

Four collections:

```ts
// src/server/models/Booking.ts
// A quote or booking request. A quote has no preferred slot; a booking does.
{
  kind: "quote" | "booking",
  name: string,
  email: string,
  phone?: string,
  propertyType: "home" | "office",
  serviceSlug: string,                 // one of the six services
  frequency: "one-off" | "weekly" | "fortnightly" | "monthly",
  postcode: string,
  address?: string,
  notes?: string,
  preferredSlots?: { date: string; window: "morning" | "afternoon" | "evening" }[],
  status: "pending" | "confirmed" | "declined" | "completed" | "cancelled",
  confirmedSlot?: { date: string; window: string; startTime?: string },
  priceNote?: string,                  // the quote the owner wrote back
  manageToken: string,                 // signed, time-limited; guest access to this record
  statusHistory: { status: string; at: Date; by: "owner" | "customer" | "system" }[],
  source?: string,                     // which page the request came from
  createdAt: Date,
  updatedAt: Date,
}

// src/server/models/AvailabilityRule.ts
// Recurring open windows, plus date exceptions. Drives the form's slot options.
{
  kind: "recurring" | "exception",
  weekday?: 0..6,                      // recurring: which day
  window?: "morning" | "afternoon" | "evening",
  date?: string,                       // exception: a specific date
  open: boolean,                       // exception can close an otherwise-open day
  capacity?: number,                   // soft cap on requests per window
}

// src/server/models/Content.ts
// CMS content, one document per (type, slug). Seeded from src/content defaults.
{
  type: "service" | "review" | "faq" | "step" | "reason" | "gallery" | "settings" | "legal",
  slug: string,                        // unique within type; "singleton" for settings
  data: Record<string, unknown>,       // shape validated per type by a zod schema
  order?: number,
  updatedAt: Date,
}

// src/server/models/AdminUser.ts
// The owner. One or a few. Seeded by scripts/seed-admin.
{
  email: string,                       // unique index
  passwordHash: string,                // bcrypt
  passkeys?: unknown[],                // optional WebAuthn credentials (upgrade path)
  createdAt: Date,
}
```

- The Mongoose connection is cached across hot reloads (the reference pattern).
- `Booking.manageToken` is a signed JWT (jose), not a lookup secret stored in the
  clear; the stored field is its id/jti so a token can be revoked on cancel.
- Marketing content is in `Content`, seeded from typed defaults in `src/content`
  so a fresh database renders the approved copy before anyone edits. The seed is
  the source of truth for shape; the database is the source of truth for live
  copy. Never ship sample numbers or fake reviews as if they were real — the
  artboard's review placeholders stay as a visible empty state until a real
  review exists.

### Mongoose rule

Never use the deprecated `new` option on `findOneAndUpdate` /
`findByIdAndUpdate`. Use `returnDocument: "after"` or `"before"`.

---

## 9. The dynamic flows

### Quote or booking request

1. The form (a client wrapper on `/book`, and a compact version in the home hero)
   validates against the shared zod schema. For a booking it loads open windows
   from `GET /api/availability` and lets the visitor pick one or more preferred
   slots; for a quote it skips the slot step.
2. `POST /api/bookings` re-validates, calls `bookings.create`, which writes one
   `Booking` (`status: "pending"`), mints a `manageToken`, and triggers
   `email.notifyOwner` and `email.confirmToCustomer` (with the manage link).
3. The handler returns 200; the form shows the drawn "Thank you" success state. A
   failed email does not fail the request — the record is saved and the email
   error is logged.

### Guest manage

1. The customer's email link opens `/booking/manage?token=…`.
2. The page verifies the token (jose), loads the one booking, and shows its
   status (word + colour), details, and — while `pending` or `confirmed` —
   **Reschedule** and **Cancel**.
3. `PATCH /api/bookings/[id]` re-verifies the token, applies the change, appends
   to `statusHistory`, and emails the owner. A cancelled booking's token is
   revoked.

### Owner confirm and run

1. The owner signs in at `/admin/login` (`POST /api/admin/session`): email +
   password (bcrypt), an httpOnly JWT cookie (jose). `src/proxy.ts` gates every
   `/admin` route and `/api/admin/*` handler.
2. The dashboard lists requests newest-first with status pills and filters. On a
   request the owner **confirms** (optionally writing a price note and exact
   time), **declines**, or marks **completed**. Each transition emails the
   customer and appends to `statusHistory`.
3. **Availability**: the owner sets recurring open windows per weekday and adds
   date exceptions. The booking form reads the derived open windows.
4. **Content**: the owner edits services, reviews, FAQ, steps, reasons, gallery,
   legal, and site settings (phone, email, service area, hero copy). A save
   validates against the type's zod schema, writes the `Content` document, and
   calls `revalidateTag` so the public pages regenerate.

No flow takes payment. Price is a human note on the confirmation, not a charge.

---

## 10. Content model: CMS over typed seeds

Marketing copy lives in the `Content` collection, editable from the admin, and is
**seeded** from typed modules in `src/content` so a fresh database renders the
approved artboard copy. Each content type has:

- a TypeScript interface and a zod schema (shape and validation, one source),
- a default array in `src/content/<type>.ts` used by `scripts/seed`,
- a cached, tagged read used by the public pages,
- an admin editor on `/admin/content` that writes the document and revalidates.

```ts
// src/content/services.ts — seed + type; live copy lives in Content documents
export interface IService {
  slug: string;              // home-cleaning, office-cleaning, deep-cleaning,
                             // end-of-tenancy, move-in-cleaning, one-off
  title: string;
  blurb: string;
  body?: string;             // the /services/[slug] long copy
  icon?: string;
}

export const SERVICES_SEED: IService[] = [
  { slug: "home-cleaning",  title: "Home cleaning",  blurb: "Weekly, fortnightly or monthly visits that keep your home fresh." },
  { slug: "office-cleaning", title: "Office cleaning", blurb: "Reliable out-of-hours or daytime cleaning for a healthier workplace." },
  // deep-cleaning, end-of-tenancy, move-in-cleaning, one-off …
];
```

`sitemap.ts` and `generateStaticParams` read services from the cached content
layer, so adding a service flows through the build. Where a page needs data the
content does not have, add the field, derive it, or show an honest empty state.

---

## 11. Code style

- `strict` TypeScript. No implicit `any` in app code. Interfaces prefixed `I`,
  type aliases `T`. Styled props are transient `$props`.
- Components, wrappers, layouts, hooks: default export. Styled components and
  content modules: named exports. Barrels re-export by name, alphabetically.
- Path alias `@/*` for every intra-`src` import; no deep relative chains.
- **Biome** is the only linter and formatter — no ESLint, no Prettier. Tabs,
  `indentWidth: 4`, `lineWidth: 120`, double quotes, semicolons always, trailing
  commas all, `organizeImports: on`, the `next` and `react` domains. Scripts:
  `dev`, `build`, `start`, `lint`, `format`, `ts.check`, `test`, `e2e`, `seed`.
- **Prose** — comments, README, commit messages, PR descriptions, error strings,
  UI copy — follows Google's developer documentation style: lead with the point,
  second person, active voice, present tense. No "just", "simply", "easy", no
  filler, no figurative language, no `currently`/`new`. Conditions before
  instructions. Inclusive terms (`allowlist`, `primary`/`replica`). Sentence-case
  headings, serial commas, code font for anything typed.

---

## 12. Testing

- **Unit (Vitest + Testing Library).** Cover the booking validator, the booking
  service (create, status transitions, token mint/verify), the availability
  derivation, the content zod schemas, the admin auth (hash, verify, JWT), and
  the guest-token sign/verify. Test behaviour, not implementation. Table-driven
  where one function has several cases.
- **A test never touches a real or development database.** Spin up a throwaway
  Mongo (`mongodb-memory-server` or a per-run database named `ecopure-itest-*`),
  point the suite at it, and drop it in `afterAll`/`t.Cleanup` so it is removed
  even on failure. Verify the target name before writing. Clean up any leaked
  `*-itest-*` databases and fix the root cause.
- **E2E (Playwright).** Smoke every public route for a 200 and its heading;
  submit a quote and a booking request against a throwaway `ecopure-e2e` database
  and assert the success state; open a guest manage link and cancel; sign in to
  the admin and confirm a request. Run one Playwright context at a time — it is
  memory-heavy. Drop the database in global teardown.
- New non-trivial logic ships with at least one test. Missing teardown is a bug.

---

## 13. SEO, performance, and operations

- **SEO.** Per-page `metadata`, `sitemap.ts` and `robots.ts`, `LocalBusiness` and
  `Service` JSON-LD on home and service pages, semantic headings, descriptive
  link text. A local cleaning business lives on local search; treat SEO as a
  feature.
- **Performance.** Static generation with on-demand ISR keeps pages fast. Serve
  images through `next/image` with explicit dimensions and ImageKit
  `remotePatterns`; keep the client bundle small by holding the server/client
  boundary low. Target a green Core Web Vitals pass. The before/after slider and
  FAQ accordion are the only interactive marketing widgets — lazy and small.
- **Config and secrets.** All configuration from env, validated at boot. Local
  development uses `.env.local` with non-secret defaults; real secrets (database
  URL, Resend key, ImageKit keys, admin and token secrets) are never committed.
  With placeholder keys, email is logged instead of sent and image upload is
  disabled. Production fails closed on placeholders.
- **Observability.** Log server-side errors with context on every Route Handler.
  Each booking status transition logs its id and new status so a missed email is
  traceable.
- **Deploy.** One build, one deploy unit on Vercel. Local backing services run in
  Docker, reusing the shared Mongo; prod points at Atlas through env. Kill any dev
  server or background process you start when you finish.

---

## 14. Git and delivery

- Branch for every change (`feat/…`, `fix/…`, `chore/…`) cut from the tip of the
  default branch. Never commit to the default branch; never use a worktree. Merge
  through a pull request and let the owner review.
- Atomic commits: one coherent change each, subject `type(scope): present-tense
  sentence`, for example `feat(book): record a quote or booking request`. No
  `Co-Authored-By` trailer.
- Keep a `HANDOFF.md` current as the entry point for a fresh session.

---

## 15. Approaches considered

The stack and most conventions are inherited from `train-with-awad`, so the open
architecture choice was **how CMS-editable marketing content reaches the page**,
given the owner wants to edit without a deploy.

- **A — DB-backed content, static render with on-demand ISR (chosen).** Pages are
  cached HTML read from a tagged content layer; an admin save revalidates the
  affected tag. Fast and SEO-strong like a static site, editable like a CMS. Cost:
  the revalidation wiring and a cache-tag discipline.
- **B — Fully dynamic SSR.** Every page reads the database per request. Simplest
  cache story, always fresh, but slower, heavier on the database, and weaker Core
  Web Vitals for pages that change monthly.
- **C — Hardcoded typed modules (the reference's way).** Fastest and simplest,
  but there is no CMS — editing means a code change and a deploy. Rejected because
  the owner chose admin-editable content.

Chosen: **A**. It keeps the static-first performance the marketing pages want
while delivering the CMS the owner asked for. The typed seeds from C are kept as
the content shape and first-run defaults (section 10), so A gets C's type safety.

## 16. Conventions at a glance

| Decision | Rule |
| --- | --- |
| App shape | One Next.js App Router app, static-first with ISR, small admin. |
| Routing | `app/` is routes only; a `page.tsx` renders one `src/libs` wrapper. |
| Component | `index.tsx` + `styled.tsx`; default export; `Styled` suffix; `$` transient props. |
| Styling | styled-components v6, no Tailwind, no `ThemeProvider`. |
| Tokens | CSS custom properties, `--ep-` prefix, in `global.ts`; JS-read values in `colors.ts`. |
| Theme | Light warm-off-white; green is the action colour, yellow is highlight only. |
| Data (client) | One axios instance + SWR fetcher; no second fetch helper. |
| Content | CMS in `Content`, seeded from typed `src/content` defaults; ISR revalidation. |
| Database | Shared Docker Mongo on `27018` (`ecopure`), Atlas in prod; four collections. |
| Requests | One `Booking` model unifies quote and booking; request-then-confirm; no payment. |
| Guest manage | Signed, time-limited token scopes access to one booking. |
| Admin auth | bcrypt + JWT cookie via jose, gated in `src/proxy.ts`; passkey optional. |
| Validation | zod at the boundary, schema shared with the client, fail closed. |
| Lint/format | Biome only; tabs, width 4, line 120, double quotes, semicolons. |
| Tests | Vitest + Playwright; throwaway DB dropped in teardown; never a real DB. |
| Prose | Google developer documentation style, everywhere. |
| Git | Branch + PR, atomic commits, no worktree, no co-author trailer. |
| Deferred | Online payment, customer accounts, instant booking, a separate service. |
