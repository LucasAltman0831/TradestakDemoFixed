# TradeStak beta deployment

## 1. Connect GitHub

1. Push the approved production-beta commit and tag to the TradeStak GitHub repository.
2. Confirm the default branch contains no environment files, logs, build output, or source artwork.
3. Require a successful Vercel build before merging future changes.

## 2. Prepare Supabase

1. Create separate demo/staging and production projects.
2. Run `supabase/schema.sql` in each project.
3. Run `supabase/seed.sql` only in the demo project.
4. Add the Vercel production and preview callback URLs to Supabase Auth URL configuration.
5. Create the first admin account normally, then promote its `profiles.role` to `admin` using the documented SQL comment.
6. Verify row-level security is enabled on every public table.

## 3. Prepare Stripe

1. Create the Builder Pro, Supplier Verified, and Supplier Premium recurring prices in Stripe test mode.
2. Record each price ID for the matching environment variable.
3. After the first Vercel deployment, create a webhook endpoint at `https://YOUR_DOMAIN/api/stripe/webhook`.
4. Subscribe it to `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed`.
5. Add the resulting signing secret to Vercel.
6. Repeat with live-mode products and keys only after beta checkout tests pass.

## 4. Connect Vercel

1. Import the GitHub repository into Vercel as a Next.js project.
2. Keep the repository root as the root directory.
3. Vercel automatically detects the committed pnpm lockfile and runs `npm run build`.
4. Add all required variables from `.env.example` separately for Preview and Production.
5. Set `NEXT_PUBLIC_APP_MODE=demo` for an investor demo and `production` for the real beta.
6. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS origin for each environment.

## 5. Deploy

1. Trigger a Preview deployment first.
2. Confirm the build log contains no type or route errors.
3. Test the preview checklist below.
4. Promote the tested deployment to Production; do not rebuild with different source code.

## 6. Production smoke test

- Home, marketplace, pricing, privacy, terms, login, and signup load on desktop and mobile.
- Unknown routes show the branded 404 state.
- Builder signup redirects only to the builder dashboard.
- Supplier signup redirects only to the supplier dashboard.
- Cross-role and admin access redirect to unauthorized.
- Login, logout, password reset, and session refresh work.
- Production marketplace does not show bundled demo suppliers.
- Supplier claim submission appears in admin review and updates claim status.
- Stripe test checkout returns to billing, webhooks update the subscription, and the portal opens.
- Response headers include `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.
- Browser console and Vercel runtime logs contain no secrets or unhandled errors.

## 7. Rollback

If the production smoke test fails, use Vercel to promote the previous healthy deployment. Do not delete customer, claim, or subscription records as part of rollback.

## Known beta gate

The marketplace and dashboard visuals began as demonstration experiences. Public demo supplier fallback is disabled in production mode, but production launch still requires verifying each dashboard query against the live Supabase project and deciding which empty-state workflows are acceptable for the first beta cohort.
