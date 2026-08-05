# SourceMetric deployment checklist

## 1. Connect the repository

1. Push the approved commit to GitHub.
2. In Vercel, import the GitHub repository or open the existing SourceMetric project.
3. Keep the framework preset set to **Next.js**.
4. Leave the root directory at the repository root.

## 2. Add environment variables

In Vercel, open **Project Settings → Environment Variables** and add every required value from `.env.example`. Add secrets to Production, Preview, and Development only where they are genuinely needed. Set `NEXT_PUBLIC_SITE_URL` to the final public SourceMetric address for Production.

The legacy key name `STRIPE_BUILDER_PRO_PRICE_ID` powers the visible **Business Pro** plan and is intentionally unchanged so existing Stripe configuration keeps working.

## 3. Prepare Supabase

1. Run `supabase/schema.sql` and all migrations in filename order in the Supabase SQL editor.
2. Confirm email/password authentication is enabled.
3. Add the production domain and callback URLs to the Supabase authentication URL configuration.
4. Confirm the `company-media` storage bucket and its access policies exist.
5. Never put the service-role key in browser code or a public repository.

## 4. Prepare Stripe

1. Create or confirm the Business Pro, Supplier Growth, and Supplier Premium prices.
2. Add the price IDs to Vercel using the existing environment-variable names.
3. Create a webhook endpoint at `https://YOUR-DOMAIN/api/stripe/webhook`.
4. Subscribe it to checkout completion, subscription create/update/delete, and failed invoice events.
5. Store the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.
6. Use Stripe test mode until checkout, billing, cancellation, and failed-payment handling are verified.

## 5. Deploy and verify

1. Trigger a Vercel deployment from the latest commit.
2. Confirm the build finishes successfully.
3. Test the homepage, supplier directory, a supplier profile, pricing, sign-up, login, password reset, and logout.
4. Create one Business / Buyer account and one Supplier account, then confirm each reaches only its own workspace.
5. Test supplier save, evaluation, comparison, profile claim, media upload, and admin claim review.
6. Complete test-mode Stripe checkout for each paid plan and verify the billing page updates.
7. Check desktop and mobile navigation and confirm there is no horizontal overflow.

## 6. Before public launch

- Replace the temporary Vercel address with the final SourceMetric domain.
- Update `NEXT_PUBLIC_SITE_URL` after the domain is connected and redeploy.
- Have the Privacy Policy and Terms reviewed by qualified counsel.
- Remove test accounts and any fictional records from the production database.
- Keep demo or illustrative data explicitly labeled and separate from real supplier data.
- Confirm backups, error monitoring, and a support contact process.
