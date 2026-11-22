<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MentorLagbe Client — Project Status

## Purpose

MentorLagbe is a role-based tuition marketplace client with public tuition
browsing, authentication, student and tutor workflows, admin management,
and one-time Stripe checkout for premium plans.

## Technology

- Next.js 16.4.5 with the App Router, React 19, TypeScript, and Tailwind CSS 4.
- shadcn/Base UI components, Lucide icons, and React Toastify notifications.
- Better Auth with MongoDB via `@better-auth/mongo-adapter`.
- An external REST API for tuition data, configured by
  `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:5000`).
- ImgBB is used by the authenticated image-upload route.
- Stripe Checkout handles one-time USD payments for tutor and student Pro plans.

## Current Application Structure

```text
app/
  (website)/                  # Public home, pricing and tuition routes
  (auth)/                     # Sign-in and sign-up pages
  dashboard/                  # Shared dashboard layout and role workspaces
  api/auth/[...all]/          # Better Auth handler
  api/upload-image/           # Authenticated ImgBB image upload
  api/checkout_sessions/      # Creates role-specific Stripe Checkout sessions
components/
  shared/                     # Navbar and footer
  ui/                         # Reusable shadcn/Base UI primitives
lib/
  actions/application.ts      # Application creation, listing and decisions
  actions/payments.ts         # Backend payment verification and listing
  actions/premium.ts          # Fetch current premium status
  actions/saved-tuitions.ts   # Save, list and remove bookmarks
  actions/tuitions.ts         # External tuition API client
  actions/uploadImage.ts      # Image upload helper
  actions/users.ts            # Admin user management
  auth.ts                     # Server-side Better Auth configuration
  auth-client.ts              # Typed client-side auth helpers
  data/tuition-options.ts     # Class-level and subject options
  data/pricing-plans.ts       # Shared pricing plan display data
  stripe.ts                   # Server-only Stripe client
  helpers/getCurrentUser.ts   # Server-side session lookup
  types/application.ts        # Application data and status types
  types/tuition.ts            # Tuition domain types
```

## Completed Work

### Public experience

- The home page UI is complete: banner, featured tuitions, pricing,
  how-it-works, and community sections.
- A responsive shared navbar and footer are available under
  `components/shared/`.
- The navbar handles loading, signed-in, and signed-out states. `/pricing`
  exists; `/about` does not yet have a corresponding page.

### Tuition browsing and details

- `/tuitions` reads search, subject, class level, mode, sort, and page values
  from the URL, then forwards them to the external API. The backend is expected
  to filter for approved, active listings and return paginated results.
- The browse UI has full-width search, filters, newest/oldest sorting, reset,
  reusable tuition cards, and pagination. It expects six results per page.
- `/tuitions/[id]` shows public tuition details; only signed-in users can
  fetch the mentor profile from `GET /tuitions/:id/mentor` with a JWT.
  The tutor's My Tuitions table links to approved, active listings only.
- Students can open the Apply Now dialog and submit a phone number, a batch
  time from the tuition's `classTimes`, and an optional learning note.
  Guests, tutors, and admins see a disabled button and notice.
- Before enabling Apply Now, the page checks the student's applications.
  An existing application displays **Already Applied**; a failed check keeps
  the button disabled. The reviews section and review button are placeholders.
- The details page itself does not enforce public visibility or ownership.
  The external detail API must enforce approved/active visibility and any
  authenticated owner-preview exception.

### Authentication

- Email/password sign-up and sign-in are implemented with Better Auth.
- Google sign-in is conditionally configured when `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` are supplied.
- Supported roles are `student`, `tutor`, and `admin`; each new account
  defaults to `student`.
- Sign-up offers student and tutor roles. Better Auth's server hook rejects
  privileged signup roles and blocks self-service role updates.
- Sign-out is implemented in the website navbar and dashboard sidebar.
- Server-side session access uses `getCurrentUser()`; the client uses the
  typed `authClient` exports in `lib/auth-client.ts`.

### Dashboard foundation

- `/dashboard` redirects users based on the role stored in their session:
  admin → `/dashboard/admin`, tutor → `/dashboard/tutor`, otherwise student
  → `/dashboard/student`.
- `app/dashboard/layout.tsx` provides the responsive header, off-canvas
  sidebar, role-specific navigation, profile link, and sign-out behavior.
- Role-specific navigation is implemented for student, tutor, and admin.
- The dashboard layout requires sign-in and role layouts check access.
  Protected external API requests use JWTs; the backend must enforce role
  and ownership checks independently of dashboard layouts.

### Tutor tuition flow

- Tutors can create a tuition at `/dashboard/tutor/post-tuition`.
- The form validates fees, days per week, image type/size, image URLs, and
  required tuition fields. Subjects change according to the selected class
  level.
- Tutors choose 1–7 days per week and one or more available batch times.
  The selected times are saved in `classTimes` for students to choose when
  applying.
- A new tuition is submitted with `pending` approval status and `isActive:
  true`.
- Banner images can be uploaded or provided as public URLs:
  - Upload accepts JPG, PNG, and WebP up to 5 MB.
  - `/api/upload-image` requires an authenticated session and uploads to
    ImgBB.
- `/dashboard/tutor/my-tuitions` fetches the current tutor's listings and
  their statuses using `GET /tuitions/tutor/:tutorId`.
- Tutors can edit selected tuition details, delete listings, and update active
  status via the external API. Deletion uses a confirmation dialog.
- Before submitting, the client checks existing tutor listings. At two or more,
  it fetches premium status and redirects non-premium tutors to pricing.

### Student applications

- `lib/actions/application.ts` posts applications to `POST /applications` and
  fetches a student's list from `GET /applications/student/:applicantId`.
  Submission shows success or error toast notifications; a duplicate response
  from the API is displayed to the student.
- Each application stores the applicant and tuition IDs, contact and schedule
  details, `pending` status, creation date, and a snapshot of the tuition and
  tutor information used by the dashboard.
- The external backend is expected to enforce a unique index on
  `{ tuitionId, applicantId }` and return HTTP 409 for duplicates.
- `/dashboard/student/my-applications` displays tuition, tutor name and email,
  monthly fee, application date, status, and a details link. Search and status
  filters operate on the fetched student's application list.
- Students can cancel pending applications and save or remove tuition
  bookmarks. Tutors can view applicants and accept or reject applications.
- Before opening Apply Now, the client checks `counts.all`. At five or more
  applications it fetches premium status and redirects non-premium students
  to pricing.

### Pricing, payments and administration

- The home pricing section and `/pricing` use shared plan data. Tutor Pro is
  $15 and Student Pro is $10, each a one-time payment in USD. Checkout is
  enabled only for the signed-in user's matching student or tutor role.
- `/api/checkout_sessions` creates a Stripe session in `payment` mode using
  the role's configured Price ID. Checkout cancellation returns to
  `/pricing?canceled=1`.
- `/pricing/success` retrieves the session from Stripe, checks ownership and
  paid status, shows receipt details, and calls the external
  `POST /payments/checkout-verify`. A failed backend confirmation does not
  claim premium activation and allows retry by refreshing.
- The external backend is expected to verify Stripe payment, record it
  idempotently, and update the user's `premium` field. The client checks
  `GET /users/:id/premium` rather than relying on the auth session.
- `/dashboard/admin/transactions` checks for an admin session, fetches
  `GET /payments`, and displays transactions with all/paid/pending/failed
  filters. The verification flow discussed so far records paid transactions;
  other statuses require backend support.
- Admin user management and tuition moderation, plus tutor applicant
  management and student saved tuitions, are implemented in the client.
- Free-plan limits are frontend checks only, not backend enforcement.
  Current-record counts decrease when records are deleted. A user can bypass
  these checks by calling the external API directly.

## Not Yet Implemented

- Public about route.
- Tutor, student, and admin dashboard overviews.
- User profile page, live tutor-profile backend response, and theme switching.
- Student-only server authorization and reviews.
- Complete route guards, backend authentication and authorization, and
  server-side premium-limit enforcement.
- Stripe webhook-based payment recording and activation when a customer does
  not return to the success page; pending/failed transaction recording.
- Several advertised premium benefits remain previews; do not assume badges,
  priority placement or support features are implemented.
- Automated tests and a project-specific README.

## Required Environment Variables

```bash
MONGODB_URI=
BETTER_AUTH_URL=
NEXT_PUBLIC_API_BASE_URL=     # Optional locally; defaults to http://localhost:5000
IMGBB_API_KEY=                # Required for uploaded tuition banners
GOOGLE_CLIENT_ID=             # Optional; enable Google sign-in with the secret
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=            # Server only; Stripe test/live secret key
STRIPE_STUDENT_PRICE_ID=      # One-time USD Stripe Price ID
STRIPE_TUTOR_PRICE_ID=        # One-time USD Stripe Price ID
APP_URL=                      # Checkout return origin; defaults to http://localhost:3000
```

Do not expose `IMGBB_API_KEY`, `STRIPE_SECRET_KEY`, MongoDB credentials, or
OAuth secrets to the client. `NEXT_PUBLIC_API_BASE_URL` is intentionally public.
The external backend also needs its own Stripe configuration for verification.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run format
```

## Implementation Notes for Future Work

- Preserve the existing App Router route groups: `(website)`, `(auth)`, and
  `dashboard`.
- Keep browser-interactive pages/components as client components; use
  `getCurrentUser()` for server-side session reads.
- Add authorization checks on the server/API, not only in client UI.
- Keep tuition data consistent with `TuitionFormData` and `Tuition` in
  `lib/types/tuition.ts`.
- Prefer adding API methods to `lib/actions/tuitions.ts` rather than issuing
  ad hoc fetches from components.
- Image uploads use the separate `lib/actions/uploadImage.ts` helper. Exported
  functions, data, and types in `lib/actions`, `lib/data`, `lib/helpers`, and
  `lib/types` have short explanatory comments; keep them current.
- Before working on Next.js code, read the relevant documentation in
  `node_modules/next/dist/docs/`, as required by the generated rule above.
