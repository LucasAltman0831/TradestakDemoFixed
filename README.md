# TradeStak

TradeStak is the reputation intelligence network for construction builders and suppliers. Builders discover and evaluate partners using verified performance signals; suppliers claim their profiles, manage reputation, and become easier to discover.

## Product areas

- Premium marketing homepage and pricing experience
- Builder supplier-network workspace
- Supplier reputation and growth workspace
- Searchable construction supplier marketplace
- Role-based Supabase authentication
- Stripe subscription checkout, billing portal, and verified webhooks
- Supplier claiming and admin review workflows
- Responsive TradeStak design system

## Technology

Next.js 15 App Router, React 19, TypeScript, Supabase Auth/Postgres with row-level security, Stripe Billing, CSS Modules, and Vercel.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Run `npm run typecheck` and `npm run build` before proposing changes.

## Environment modes

TradeStak uses live Supabase records in every environment. The application does not bundle demonstration suppliers, reviews, or account activity.

## Environment variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical origin used for redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase browser key; protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin database operations and webhooks |
| `STRIPE_SECRET_KEY` | Server only | Stripe API access |
| `STRIPE_WEBHOOK_SECRET` | Server only | Stripe webhook signature verification |
| `STRIPE_BUILDER_PRO_PRICE_ID` | Server only | Builder Pro recurring price |
| `STRIPE_SUPPLIER_VERIFIED_PRICE_ID` | Server only | Supplier Verified recurring price |
| `STRIPE_SUPPLIER_PREMIUM_PRICE_ID` | Server only | Supplier Premium recurring price |

Copy `.env.example`; never commit `.env.local`. No Stripe secret or Supabase service-role key may use a `NEXT_PUBLIC_` prefix.

## Database setup

Run `supabase/schema.sql` in a new Supabase project, then use `supabase/seed.sql` only for a demo environment. The schema covers profiles, suppliers, claims, saved suppliers, evaluations, reviews, notifications, subscriptions, and processed webhook events.

To provision demo logins, load the demo-only variables into your shell and run `npm run seed:demo`. The script refuses to run when app mode is `production`.

## Deployment

The intended host is Vercel. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for environment setup, Stripe webhook registration, database preparation, deployment, and smoke testing.

## Security model

- Auth sessions use Supabase SSR cookies.
- Builder, supplier, and admin routes enforce roles.
- Row-level security protects user-owned database records.
- Subscription mutations run only on the server.
- Stripe webhooks verify the raw payload signature and de-duplicate events.
- Security headers deny framing, MIME sniffing, and unused browser capabilities.
