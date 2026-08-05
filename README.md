# SourceMetric

SourceMetric is a B2B supplier intelligence and vendor performance platform. It helps businesses find, evaluate, compare, and track suppliers using structured performance information rather than price alone, word of mouth, or generic star ratings.

## Product capabilities

- Searchable supplier directory with category, location, verification, and score filters
- SourceMetric Score and supplier performance breakdowns
- Supplier comparison and saved supplier networks
- Buyer evaluations restricted to manually verified companies
- Moderated public reviews with direct-business-relationship attestations
- Free buyer analytics, risk signals, scorecards, and network exports
- Free supplier profile claiming, company information, and media portfolios
- Role-based authentication, protected workspaces, and billing foundations
- Administrative company verification, review moderation, claim review, and supplier import foundations

## Technology

- Next.js 15 App Router and React 19
- TypeScript
- Supabase Authentication, Postgres, and Storage
- Stripe subscriptions and verified webhooks
- Vercel deployment configuration

## Local development

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Add the environment values listed below.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

## Required environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site address, such as `https://sourcemetric.example` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service role key |
| `ENABLE_PAID_CHECKOUT` | Keep `false` during the free launch period |
| `STRIPE_SECRET_KEY` | Server-only Stripe secret key reserved for future subscriptions |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret reserved for future subscriptions |
| `STRIPE_BUILDER_PRO_PRICE_ID` | Legacy price ID; not sold while checkout is disabled |
| `STRIPE_SUPPLIER_VERIFIED_PRICE_ID` | Future supplier price ID; not sold at launch |
| `STRIPE_SUPPLIER_PREMIUM_PRICE_ID` | Future supplier price ID; not sold at launch |

`GOOGLE_PLACES_API_KEY` is optional and only needed for the administrator supplier-import tool. Never expose server-only keys with a `NEXT_PUBLIC_` prefix.

## Launch access model

Buyer access is free with no credit card. Supplier participation, profile claiming, core company management, and basic buyer inquiry participation are also free. Stripe infrastructure remains in the repository for future optional supplier business tools, but every checkout route returns a disabled response unless `ENABLE_PAID_CHECKOUT=true`. Do not enable it until the corresponding product features and Stripe prices are approved for sale.

## Database

Apply `supabase/schema.sql`, then the files in `supabase/migrations` in filename order. Existing technical identifiers such as the `builder` role, `/builder` routes, and `builder_user_id` columns are intentionally retained for database and deployment compatibility. The product displays this role as **Business / Buyer**.

The company-verification migration is required before deploying the matching application code. It adds manual verification requests, verified-company status, relationship attestations, review moderation, and database policies that prevent unverified builder accounts from influencing supplier evaluations.

## Validation and deployment

Run `npm run typecheck` and `npm run build` before pushing. The included `vercel.json` uses `npm install` and the standard Next.js production build. See `DEPLOYMENT.md` for the release checklist.
