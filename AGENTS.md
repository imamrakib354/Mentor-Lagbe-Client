<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MentorLagbe Client — Project Status

## Purpose

MentorLagbe is a role-based tuition marketplace client. It currently provides
the public landing page, tuition browsing and details, authentication, a
shared dashboard experience, and the first tutor tuition-management flow.

## Technology

- Next.js 16.4.5 with the App Router, React 19, TypeScript, and Tailwind CSS 4.
- shadcn/Base UI components, Lucide icons, and React Toastify notifications.
- Better Auth with MongoDB via `@better-auth/mongo-adapter`.
- An external REST API for tuition data, configured by
  `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:5000`).
- ImgBB is used by the authenticated image-upload route.

## Current Application Structure

```text
app/
  (website)/                  # Public site shell and home page
  (auth)/                     # Sign-in and sign-up pages
  tuitions/                   # Public browse page, cards and details route
  dashboard/                  # Shared dashboard layout and role workspaces
  api/auth/[...all]/          # Better Auth handler
  api/upload-image/           # Authenticated ImgBB image upload
components/
  shared/                     # Navbar and footer
  ui/                         # Reusable shadcn/Base UI primitives
lib/
  actions/tuitions.ts         # External tuition API client
  actions/uploadImage.ts      # Image upload helper
  auth.ts                     # Server-side Better Auth configuration
  auth-client.ts              # Typed client-side auth helpers
  data/tuition-options.ts     # Class-level and subject options
  helpers/getCurrentUser.ts   # Server-side session lookup
  types/tuition.ts            # Tuition domain types
```

## Completed Work

### Public experience

- The home page UI is complete: banner, featured tuitions, pricing,
  how-it-works, and community sections.
- A responsive shared navbar and footer are available under
  `components/shared/`.
- The navbar handles loading, signed-in, and signed-out states. The `/pricing`
  and `/about` links do not yet have corresponding pages.

### Tuition browsing and details

- `/tuitions` reads search, subject, class level, mode, sort, and page values
  from the URL, then forwards them to the external API. The backend is expected
  to filter for approved, active listings and return paginated results.
- The browse UI has full-width search, filters, newest/oldest sorting, reset,
  reusable tuition cards, and pagination. It expects six results per page.
- `/tuitions/[id]` fetches the tuition by ID and displays its banner,
  description, fee, tutor, and other details. The details link is also enabled
  in the tutor's My Tuitions table.
- The details client accepts either a tuition document or `{ tuition, tutor }`.
  With a tutor object, it can display the current profile image and optional
  education, experience, and expertise. Otherwise it falls back to the tutor
  name and email saved on the tuition; those values are not live profile data.
- The Apply Now button is enabled only for a signed-in student, but it has no
  action yet. Guests, tutors, and admins see a disabled button and notice.
  The reviews section and review button are placeholders.
- The details page itself does not enforce public visibility or ownership.
  The external detail API must enforce approved/active visibility and any
  authenticated owner-preview exception.

### Authentication

- Email/password sign-up and sign-in are implemented with Better Auth.
- Google sign-in is conditionally configured when `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` are supplied.
- Supported roles are `student`, `tutor`, and `admin`; each new account
  defaults to `student`.
- The current sign-up UI allows selecting all three roles. This is explicitly
  development-only and **must be restricted before deployment** so users
  cannot self-assign `admin`.
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
- The dashboard is currently a UI shell, not an authorization boundary.
  Individual role routes can be visited as previews and need server-side
  role guards before production.

### Tutor tuition flow

- Tutors can create a tuition at `/dashboard/tutor/post-tuition`.
- The form validates fees, days per week, image type/size, image URLs, and
  required tuition fields. Subjects change according to the selected class
  level.
- Tutors choose 1–7 days per week and one or more available batch times.
  The selected times are saved in `classTimes`; choosing a batch when applying
  is not implemented yet.
- A new tuition is submitted with `pending` approval status and `isActive:
  true`.
- Banner images can be uploaded or provided as public URLs:
  - Upload accepts JPG, PNG, and WebP up to 5 MB.
  - `/api/upload-image` requires an authenticated session and uploads to
    ImgBB.
- `/dashboard/tutor/my-tuitions` is intended to display the current tutor's
  listings and their statuses. **Known integration issue:** its
  `getTutorTuitions()` helper expects an array from `GET /tuitions`, but the
  new public endpoint returns a paginated object. It needs a separate,
  authorized tutor-listing endpoint to include all of the owner's statuses.
- The active-status switch only updates local UI state. View links to the
  details page; edit and delete remain disabled placeholders, with no
  update/delete API operations yet.

## Not Yet Implemented

- Public pricing and about routes.
- Tutor dashboard overview and applicant management.
- Student dashboard overview, applications, saved tuitions, and application
  workflow.
- Admin dashboard overview, user management, tuition approval/moderation, and
  transactions.
- User profile page, live tutor-profile backend response, and theme switching.
- Application form/submission, student-only server authorization, duplicate
  prevention, and reviews.
- Tuition edit, delete, persistent active-status updates, and server-side
  tutor-specific listing.
- Route guards and backend authorization for dashboard roles and tuition
  mutations.
- Automated tests and a project-specific README.

## Required Environment Variables

```bash
MONGODB_URI=
BETTER_AUTH_URL=
NEXT_PUBLIC_API_BASE_URL=     # Optional locally; defaults to http://localhost:5000
IMGBB_API_KEY=                # Required for uploaded tuition banners
GOOGLE_CLIENT_ID=             # Optional; enable Google sign-in with the secret
GOOGLE_CLIENT_SECRET=
```

Do not expose `IMGBB_API_KEY`, MongoDB credentials, or OAuth secrets to the
client. `NEXT_PUBLIC_API_BASE_URL` is intentionally public.

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
