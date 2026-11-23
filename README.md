# MentorLagbe

**Find the right mentor, manage tuition, and learn with confidence.**

MentorLagbe is a tuition marketplace for students and tutors in Bangladesh. Students discover and apply to tuition batches, tutors manage listings and applicants, and administrators oversee the platform.

[Live demo](https://mentor-lagbe-client-one.vercel.app/) · [Client repository](https://github.com/imamrakib354/Mentor-Lagbe-Client) · [Server repository](https://github.com/imamrakib354/Mentor-Lagbe-Server)

![MentorLagbe homepage](./public/preview/HomePage.png)

## What you can do

- **Students:** Search and filter tuitions, apply to a batch, track applications, save listings, and review tuitions after acceptance.
- **Tutors:** Publish and manage tuition listings, choose batch times, and accept or reject applications.
- **Admins:** Manage users, moderate listings, and view recorded transactions.
- **Everyone:** Use responsive light and dark themes, edit their profile, and explore one-time Pro plans through Stripe Checkout.

Authentication uses email and password, with optional Google sign-in. New Google users choose a student or tutor role.

## Built with

Next.js App Router · React · TypeScript · Tailwind CSS · Base UI · Better Auth · MongoDB · Express · Stripe · ImgBB

This repository contains the Next.js client and its authentication, upload, and checkout routes. The separate Express server provides the marketplace API.

## Run locally

You will need Node.js, MongoDB, and both repositories. ImgBB, Google OAuth, and Stripe credentials are needed only for their respective features.

### 1. Clone and install

```bash
git clone https://github.com/imamrakib354/Mentor-Lagbe-Client.git
git clone https://github.com/imamrakib354/Mentor-Lagbe-Server.git
cd Mentor-Lagbe-Client
npm install
cd ../Mentor-Lagbe-Server
npm install
```

### 2. Configure the client

Create `Mentor-Lagbe-Client/.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_long_random_secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Required for image uploads
IMGBB_API_KEY=your_imgbb_api_key

# Optional Google sign-in
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Required for Stripe Checkout
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_STUDENT_PRICE_ID=price_your_student_one_time_price
STRIPE_TUTOR_PRICE_ID=price_your_tutor_one_time_price
APP_URL=http://localhost:3000
```

For Google sign-in, register `http://localhost:3000/api/auth/callback/google` as an authorized callback.

### 3. Configure the server

Create `Mentor-Lagbe-Server/.env`:

```env
DB_USER=your_mongodb_database_user
DB_PASSWORD=your_mongodb_database_password
BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_STUDENT_PRICE_ID=price_your_student_one_time_price
STRIPE_TUTOR_PRICE_ID=price_your_tutor_one_time_price
PORT=5000
```

Both projects must use the same MongoDB cluster and `MentorLagbeDB`. Stripe credentials and one-time USD **Price IDs** must use the same Stripe account and test/live mode in both projects.

### 4. Start both applications

In separate terminals:

```bash
# From Mentor-Lagbe-Server
node index.js
```

```bash
# From Mentor-Lagbe-Client
npm run dev
```

Open [localhost:3000](http://localhost:3000). Restart the relevant process after changing environment variables. The Express server loads `.env` from its working directory, so start it from the server directory.

For deployment, configure environment variables in **both** projects, set `BETTER_AUTH_URL` and `APP_URL` to the deployed client origin, and set `NEXT_PUBLIC_API_BASE_URL` to the deployed API. Add the deployed Google callback when using OAuth. Never commit credentials or expose server secrets to the browser.

## Project map

```text
app/
  (website)/      Public pages, tuition discovery and pricing
  (auth)/         Sign-in and sign-up
  dashboard/      Student, tutor, admin and profile workspaces
  api/            Authentication, image upload and checkout routes
components/       Shared features and UI primitives
lib/              API actions, authentication, data, helpers and types
public/           Images and project previews
```

The main entry points are `/tuitions`, `/pricing`, `/sign-in`, and the role-specific dashboards at `/dashboard/student`, `/dashboard/tutor`, and `/dashboard/admin`. The [server repository](https://github.com/imamrakib354/Mentor-Lagbe-Server) contains the Express API.

## Development commands

```bash
npm run dev        # Start the development server
npm run lint       # Run ESLint
npm run typecheck  # Check TypeScript
npm run build      # Create a production build
```

## Current limitations

- Pro activation requires the user to return to the payment success page for backend verification; webhook-based activation is not yet implemented.
- Free-plan limits are currently client-side checks. The backend must independently enforce authorization, ownership and production usage limits.
- Some advertised Pro benefits are previews. Automated tests are not yet available.

## Author

[Imam Hossain Rakib](https://github.com/imamrakib354)
