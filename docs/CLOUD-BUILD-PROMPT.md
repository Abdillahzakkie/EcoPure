# EcoPure Cleaning — cloud build prompt

Paste everything below the line into a fresh cloud session. It is self-contained:
it carries the design, every approved decision, the stack, and an ordered build
plan, so the agent needs no local files. If you can also push this repo (it holds
`docs/ARCHITECTURE.md`, the full spec), tell the agent to read it first.

---

You are building **EcoPure Cleaning**, the marketing, quoting, and booking
website for an eco-friendly cleaning company serving homes and offices. Build the
whole thing to the spec below. This is a greenfield Next.js project.

## House rules (follow exactly; they override defaults)

- **Branch + PR.** Work on a `feat/…` branch cut from the default branch's tip.
  Never commit to the default branch. Never use a git worktree. Open a PR at the
  end and let me merge. Atomic commits, subject `type(scope): present-tense
  sentence`. **No `Co-Authored-By` trailer.**
- **Docker backing services.** Run MongoDB in Docker. Reuse a shared Mongo on host
  port `27018` if one is up (`docker ps`); otherwise start one via
  `compose.yaml` with a pinned image and a named volume. Use database name
  `ecopure` locally. Point `.env.local` at it. Never assume a host-installed
  Mongo.
- **Tests clean up and never touch a real DB.** Unit/integration tests use a
  throwaway database (`mongodb-memory-server` or a per-run `ecopure-itest-*`
  name) dropped in `afterAll`/teardown even on failure. Playwright uses
  `ecopure-e2e`, dropped in global teardown. Verify the target name before
  writing.
- **Build the whole feature before you call it done**, test it (typecheck, unit,
  and Playwright on any user-facing surface), then push one branch and open one
  PR. Not a dribble of partial commits.
- **Prose and UI copy** follow Google's developer documentation style: lead with
  the point, active voice, present tense, second person. No "just", "simply",
  "easy", no filler, no figurative language. Conditions before instructions.
  Descriptive link text, never "click here". Inclusive terms.
- **Mockups first for UI.** Before building a screen, draw it in
  `design/mockups/` at phone (390×844) and desk (1280×800) widths using a
  `system.css` that mirrors the `--ep-*` tokens; then build the component to
  match. Keep the mockup and the code in sync in the same commit.
- **Run independent work in parallel**, but cap concurrency to fit memory (one
  dev server, one Playwright context, one DB seed at a time on a small box).
- Kill any dev server or background process you start when you finish.

## 1. What the site does

1. **Explain the offer**: home, six services, how it works, why EcoPure, reviews,
   FAQ, legal.
2. **Capture quote requests**: a visitor not ready to pick a time submits a
   free-quote request describing their space.
3. **Take booking requests**: a ready visitor picks a service, frequency, and one
   or more preferred time windows. The request is `pending`; the owner confirms or
   declines; the visitor is emailed either way. **No online payment** — the
   customer pays the cleaner after the visit.
4. **Owner admin**: manage quote and booking requests, set availability, and edit
   all marketing content without a deploy.

### Approved decisions (do not re-litigate)

- Multi-page marketing site (not a single landing page).
- Keep the EcoPure **light** look (warm off-white, brand green, sunny yellow) —
  see tokens below. Do not use a dark theme.
- **Request-then-confirm** booking (owner confirms; no instant/guaranteed slots).
- **No payment** anywhere. No Stripe, no Orders, no card data.
- **Guest booking** only: no customer accounts. A signed, time-limited link
  emailed to the customer lets them view, reschedule, or cancel that one booking.
- Full admin: requests inbox + availability management + **CMS** (edit services,
  reviews, FAQ, steps, reasons, gallery, legal, and site settings).
- A quote and a booking are **one `Booking` record** with a `kind` discriminator —
  one write path, one model, one inbox.

### Out of scope (do not build)

Online payment, customer accounts, instant confirmed booking, a separate backend
service.

## 2. Stack (pin these; match a sibling project `train-with-awad`)

Next.js 16 (App Router) · React 19 · TypeScript 5+ `strict` (alias `@/*` →
`./src/*`) · **styled-components v6** (no Tailwind, no `ThemeProvider`; tokens as
CSS custom properties) · axios + SWR (client reads/mutations) · **zod**
(validation, schema shared client/server) · **MongoDB + Mongoose** (Docker 27018
local, Atlas prod) · **Resend** (email) · **ImageKit** (owner-uploaded images) ·
**bcryptjs + jose** (admin auth: JWT httpOnly cookie; passkey via
`@simplewebauthn` optional later) · **jose** signed tokens (guest manage) ·
**Biome** (only linter/formatter: tabs, indentWidth 4, lineWidth 120, double
quotes, semicolons, trailing commas all, organizeImports on, `next`+`react`
domains) · **Vitest** + Testing Library · **Playwright** · **pnpm** · deploy on
Vercel.

Mongoose: never use the deprecated `new` option on `findOneAndUpdate` /
`findByIdAndUpdate`; use `returnDocument: "after" | "before"`.

## 3. Design system — the EcoPure light theme (from the approved artboard)

Token prefix `--ep-`. Declare in `createGlobalStyle` in `src/styles/global.ts`;
consume with `var(--ep-brand)`. Mirror the same values in
`design/mockups/system.css`. JS-read values go in `src/styles/colors.ts` as
`UPPER_SNAKE`.

```
--ep-bg:           #FAF9F5   /* warm off-white page ground */
--ep-surface:      #FFFFFF   /* cards */
--ep-surface-mint: #EAF6EE   /* tinted section bands */
--ep-surface-soft: #F2FAF5
--ep-line:         #D5E8DC   /* hairlines, borders */
--ep-text:         #0F3D26   /* deep green ink */
--ep-muted:        #3E5A4A   /* secondary text */
--ep-brand:        #037B40   /* THE action colour: buttons, links, CTA */
--ep-brand-strong: #0F3D26
--ep-brand-ink:    #FFFFFF   /* text on brand green */
--ep-accent:       #FFC93C   /* sunny HIGHLIGHT: badges, pills — never a 2nd button */
--ep-accent-soft:  #FFE9A8
--ep-accent-ink:   #12301F   /* text on yellow */
--ep-radius-sm: 12px  --ep-radius-md: 16px  --ep-radius-card: 22px  --ep-radius-pill: 999px
```

Typography: **Outfit** (600) for display/headings, **DM Sans** for body/UI, both
via `next/font`. Body 16px, hints 14px, nothing readable below 14px.

Rules: green is the only action colour (one primary action per screen — "Book a
clean"); yellow is decoration only. 44px minimum touch targets, visible focus
rings, WCAG AA contrast (verify `--ep-muted` on `--ep-bg` and on mint, and brand
text on white). `prefers-reduced-motion` disables non-essential animation. Money
renders as money. Status is a word plus a colour, never colour alone. Every screen
has a real empty state and a real failure state with a human-written reason and a
recovery button. No internal vocabulary (webhook, Route Handler, zod…) in rendered
text.

Recurring components (build once, compose per page): `Section`, `Card`,
`ServiceCard`, `Stat`, `Step`, `Quote`, `Accordion` (FAQ), `BeforeAfter` (drag
slider), `StatusPill`, `Button`, `Field`.

## 4. Pages and routes

Public, in route group `(site)` with `Header`/`Footer`:

- `/` — Home. Compose the full landing: sticky header nav (Our work, Services, How
  it works, Why EcoPure, FAQ, phone, **Book/Free quote** button) → hero with a
  compact request form → before/after slider → 6-service grid → gallery → 4-step
  how-it-works → why-EcoPure (4 reasons) → reviews → FAQ accordion → final CTA →
  footer.
- `/services` — services index; `/services/[slug]` — one of `home-cleaning`,
  `office-cleaning`, `deep-cleaning`, `end-of-tenancy`, `move-in-cleaning`,
  `one-off` (`generateStaticParams` from CMS).
- `/how-it-works`, `/why-ecopure`, `/reviews`, `/faq`.
- `/book` — the full quote/booking request form (primary CTA target).
- `/booking/manage?token=…` — guest view/reschedule/cancel, token-gated.
- `/privacy`, `/terms`.

Admin, in route group `(admin)`, gated by `src/proxy.ts`:

- `/admin/login`, `/admin` (requests inbox), `/admin/bookings/[id]`,
  `/admin/availability`, `/admin/content`.

API Route Handlers:

- `POST /api/bookings`, `PATCH /api/bookings/[id]` (guest token or admin session).
- `GET /api/availability` (derived open windows for the form).
- `POST|DELETE /api/admin/session`, `PATCH /api/admin/bookings/[id]`,
  CRUD `/api/admin/availability`, CRUD `/api/admin/content/[type]` (writes +
  `revalidateTag`).

Rendering: marketing pages are static with on-demand ISR — read CMS content
through a cached, tagged data layer; an admin content save calls `revalidateTag`
for that type so pages regenerate. No per-request DB read on the marketing hot
path. Every page sets `metadata`; home and service pages add `LocalBusiness` /
`Service` JSON-LD. `sitemap.ts` + `robots.ts` from CMS + static routes.

## 5. Verbatim marketing copy (seed content — use exactly)

**Hero.** H1 "Spotless spaces, naturally." Sub: "EcoPure brings careful,
eco-friendly cleaning to your home or workplace. Flexible visits, friendly teams
and a free quote in minutes." CTAs: "Get a free quote", "See our services".
Bullets: "Free, no-obligation quote" · "One-off or regular visits" ·
"Eco-friendly products".

**Hero form.** Title "Get your free quote", "Tell us a little about your space. We
reply quickly." Toggle Home/Office. Fields: Your name · Phone or email · Postcode ·
How often? Button "Request my free quote". Fine print "No payment needed. No
obligation." Success: "Thank you!" / "We have your request and will be in touch
shortly with your free quote." + "Send another request".

**Before/after.** Eyebrow "OUR WORK". H2 "See the difference we make". "Drag the
slider to compare before and after on recent jobs." Labels BEFORE / AFTER. Note
"Sample illustrations. Replace with your own job photos."

**Services.** Eyebrow "OUR SERVICES". H2 "Cleaning for every kind of space". Intro
"From a weekly home refresh to a full office routine, every visit uses
eco-friendly products and a careful, consistent approach." Six cards, each with
"Get a quote":
- Home cleaning — "Weekly, fortnightly or monthly visits that keep your home
  fresh, tidy and welcoming."
- Office cleaning — "Reliable out-of-hours or daytime cleaning that gives your
  team a healthier place to work."
- Deep cleaning — "A top-to-bottom reset for kitchens, bathrooms and the corners
  that regular cleans skip."
- End of tenancy — "A thorough clean to help you hand back the keys with
  confidence."
- Move-in cleaning — "Start fresh in a new place, cleaned and ready before the
  boxes arrive."
- One-off and occasional — "Spring cleans, party clean-ups or a single visit when
  you simply need a hand."

**Gallery.** Eyebrow "SEE THE SPARKLE". H2 "Every room, left feeling brand new".
Cards: Living spaces — "Fresh, tidy rooms that feel good to come home to." ·
Streak-free shine — "Glass, mirrors and surfaces left sparkling clean." · Gentle
on the planet — "Eco-friendly products and thoughtful routines."

**How it works.** Eyebrow "HOW IT WORKS". H2 "Fresh and simple in four steps". 1
Request a quote — "Share your space and how often you would like us." 2 Choose your
time — "Pick a day and time slot that fits around your routine." 3 We clean,
eco-style — "Our team arrives with eco-friendly products and gets to work." 4 Enjoy
the fresh space — "Relax in a clean place and rebook in a couple of clicks."

**Why EcoPure.** Eyebrow "WHY ECOPURE". H2 "Good for your space. Good for the
planet." Intro "We believe a deep clean should not cost the earth. That is why
every visit is built around gentler products and thoughtful habits." Reasons:
Eco-friendly products — "Kinder to your family, your colleagues and the
environment." · Flexible scheduling — "One-off, weekly, fortnightly or monthly,
whatever suits you." · Friendly, reliable teams — "People who turn up on time and
take pride in the details." · Clear, honest quotes — "Know what you will pay
before we start. No surprises."

**Reviews.** Eyebrow "REVIEWS". H2 "What our customers say". No real reviews
exist yet — render a visible empty state ("Reviews from real customers appear here.
Add the first from the admin.") until the owner adds one. Do not ship the
placeholder quotes as if real.

**FAQ.** Eyebrow "FAQ". H2 "Questions, answered". Accordion of Q/A items, seeded
from CMS (write 5–6 plain starter Q/As about services, areas, products,
scheduling, and quotes).

**Final CTA.** H2 "Ready for a fresher space?" "Get your free quote today and let
EcoPure take care of the rest." Button "Get a free quote".

**Footer.** Tagline "Eco-friendly cleaning for homes and offices." Columns:
SERVICES (Home, Office, Deep, End of tenancy) · COMPANY (How it works, Why
EcoPure, FAQ) · CONTACT ([YOUR PHONE], [YOUR EMAIL], [YOUR SERVICE AREA] — site
settings, editable in admin). "© 2026 EcoPure Cleaning. All rights reserved." ·
Privacy · Terms. Keep contact details as editable settings with clear placeholder
text until the owner fills them.

## 6. Data model (MongoDB, four collections)

- **Booking** (quote or booking): `kind` "quote"|"booking", `name`, `email`,
  `phone?`, `propertyType` "home"|"office", `serviceSlug`, `frequency`
  "one-off"|"weekly"|"fortnightly"|"monthly", `postcode`, `address?`, `notes?`,
  `preferredSlots?` [{`date`, `window` "morning"|"afternoon"|"evening"}],
  `status` "pending"|"confirmed"|"declined"|"completed"|"cancelled",
  `confirmedSlot?`, `priceNote?`, `manageToken` (signed; store jti for revoke),
  `statusHistory` [{status, at, by}], `source?`, timestamps.
- **AvailabilityRule**: `kind` "recurring"|"exception", `weekday?` 0–6, `window?`,
  `date?`, `open` bool, `capacity?`. Drives the booking form's slot options.
- **Content** (CMS): `type`
  "service"|"review"|"faq"|"step"|"reason"|"gallery"|"settings"|"legal", `slug`
  (unique within type; "singleton" for settings), `data` (validated per type by a
  zod schema), `order?`, `updatedAt`. Seeded from typed defaults in `src/content`.
- **AdminUser**: `email` (unique), `passwordHash` (bcrypt), `passkeys?`,
  timestamps. Seeded by `scripts/seed-admin`.

## 7. Flows

- **Request**: form validates (shared zod) → `POST /api/bookings` → write
  `Booking` pending, mint `manageToken`, email owner + customer (manage link) →
  200 → "Thank you" state. A failed email does not fail the request; log it.
- **Guest manage**: `/booking/manage?token=…` verifies token, shows status
  (word+colour) and, while pending/confirmed, Reschedule and Cancel →
  `PATCH /api/bookings/[id]` re-verifies token, updates, appends history, emails
  owner. Cancel revokes the token.
- **Admin**: login (bcrypt + JWT cookie, `src/proxy.ts` gate) → inbox
  newest-first with status pills and filters → confirm (optional price note +
  exact time) / decline / complete, each emailing the customer → availability
  editor → content editor (save validates, writes, `revalidateTag`).

## 8. Folder structure

```
src/
  app/
    (site)/ page.tsx services/ services/[slug]/ how-it-works/ why-ecopure/
            reviews/ faq/ book/ booking/manage/ privacy/ terms/  (+ layout.tsx)
    (admin)/ admin/login/ admin/ admin/bookings/[id]/ admin/availability/ admin/content/
    api/ bookings/route.ts bookings/[id]/route.ts availability/route.ts
         admin/session/route.ts admin/bookings/[id]/route.ts
         admin/availability/route.ts admin/content/[type]/route.ts
    layout.tsx sitemap.ts robots.ts not-found.tsx
  components/ Button/ Card/ Field/ Section/ Stat/ Step/ Quote/ Accordion/
              BeforeAfter/ ServiceCard/ StatusPill/ index.ts
  layouts/ SiteShell Header Footer AdminShell
  libs/ <Name>Wrapper/ (page-level feature components with client state)
  hooks/ Bookings/ Availability/ Admin/ index.ts
  constants/ api.ts fetcher.ts index.ts
  content/ services.ts reviews.ts faq.ts steps.ts reasons.ts settings.ts index.ts
  server/ db/ models/ services/ validators/ config/
  proxy.ts
  types/ styles/ (colors.ts global.ts motion.ts index.ts)
design/ DIRECTION.md EASE.md mockups/ (system.css, sheets, overflow+ease checks)
docs/ ARCHITECTURE.md HANDOFF.md
```

Thin `page.tsx` renders one wrapper (or composes sections directly for a pure
static page). Component = `index.tsx` + `styled.tsx`; default export for
components, named `Styled`-suffixed exports in `styled.tsx`; transient `$props`;
`I`/`T` type prefixes. Route Handlers stay thin: parse → service → response.
Config read once in `src/server/config`, validated at boot, fail closed (prod
refuses placeholder keys; dev logs email instead of sending and disables upload).

## 9. Build order

1. Scaffold the Next.js 16 app, Biome, TS strict, styled-components SSR registry,
   `compose.yaml` for Mongo, `.env.example`/`.env.local`, `src/server/config`.
2. `src/styles` tokens + `design/mockups/system.css` mirror; `design/DIRECTION.md`
   and `design/EASE.md`; the base component kit (Button, Card, Field, Section,
   Section components).
3. Mockups for every screen (phone + desk) with overflow/ease checks, then build
   the marketing pages against them from CMS content (seeded).
4. Models, validators, services, and the request flow (`/book` + hero form +
   `POST /api/bookings` + emails + success state).
5. Availability model + `GET /api/availability` + the booking slot picker.
6. Guest manage flow (signed token, `/booking/manage`, `PATCH`).
7. Admin: auth + `src/proxy.ts` gate, inbox, booking actions, availability editor,
   CMS editor with `revalidateTag`.
8. SEO (metadata, JSON-LD, sitemap, robots), accessibility pass, images via
   ImageKit/`next/image`.
9. Tests: Vitest (validators, services, token/auth, availability) + Playwright
   (route smoke, request happy path, guest manage, admin confirm), throwaway DBs.
10. `HANDOFF.md`, one branch, one PR.

Confirm the plan and the branch name back to me, then build it in full, test it,
and open the PR.
