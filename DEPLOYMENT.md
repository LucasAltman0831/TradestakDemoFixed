# SourceMetric deployment checklist

## 1. Connect the repository

1. Push the approved commit to GitHub.
2. In Vercel, import the GitHub repository or open the existing SourceMetric project.
3. Keep the framework preset set to **Next.js**.
4. Leave the root directory at the repository root.

## 2. Add environment variables

In Vercel, open **Project Settings → Environment Variables** and add every required value from `.env.example`. Add secrets to Production, Preview, and Development only where they are genuinely needed. Set `NEXT_PUBLIC_SITE_URL` to the final public SourceMetric address for Production.

Set `ENABLE_PAID_CHECKOUT=false` for the launch deployment. Buyer access and supplier participation are free; the Stripe variables are retained only for future optional supplier business tools.

## 3. Prepare Supabase

1. Run `supabase/schema.sql` and all migrations in filename order in the Supabase SQL editor.
2. Confirm email/password authentication is enabled.
3. Add the production domain and callback URLs to the Supabase authentication URL configuration.
4. Confirm the `company-media` storage bucket and its access policies exist.
5. Confirm `20260805_company_verification.sql` completed successfully before deploying the verification UI.
6. Verify that new Business / Buyer accounts begin with `company_verification_status = unverified`.
7. Never put the service-role key in browser code or a public repository.

## 4. Keep Stripe checkout disabled at launch

1. Confirm `ENABLE_PAID_CHECKOUT` is set to `false` in Vercel.
2. Do not advertise or sell a paid plan during the free network-building period.
3. Retain Stripe test-mode credentials only if the dormant integration is being tested internally.
4. Before enabling future supplier subscriptions, create the approved prices, verify every promised entitlement, test checkout and cancellation, and confirm paid status cannot affect SourceMetric Score or organic ranking.

## 5. Deploy and verify

1. Trigger a Vercel deployment from the latest commit.
2. Confirm the build finishes successfully.
3. Test the homepage, supplier directory, a supplier profile, pricing, sign-up, login, password reset, and logout.
4. Create one Business / Buyer account and one Supplier account, then confirm each reaches only its own workspace.
5. Submit one builder and one supplier company-verification request, then approve them from **Admin → Trust review**.
6. Confirm an unverified builder cannot submit an evaluation, while an approved builder can submit one only after attesting to direct business experience.
7. Confirm a written review remains private until an administrator approves it from **Admin → Trust review**.
8. Test supplier save, evaluation, comparison, profile claim, media upload, and admin claim review.
9. Confirm checkout endpoints report that paid subscriptions are unavailable during the free launch period.
10. Check desktop and mobile navigation and confirm there is no horizontal overflow.

## 6. Before public launch

- Replace the temporary Vercel address with the final SourceMetric domain.
- Update `NEXT_PUBLIC_SITE_URL` after the domain is connected and redeploy.
- Have the Privacy Policy and Terms reviewed by qualified counsel.
- Remove test accounts and any fictional records from the production database.
- Keep demo or illustrative data explicitly labeled and separate from real supplier data.
- Confirm backups, error monitoring, and a support contact process.
