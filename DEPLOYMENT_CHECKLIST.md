# TradeStak V1 Release Checklist

- [ ] Run `supabase/schema.sql` on a new Supabase project.
- [ ] Run `supabase/seed.sql` if you want starter marketplace records.
- [ ] Set the Supabase Site URL and confirmation/reset redirect URLs.
- [ ] Configure custom SMTP and test confirmation plus password-reset emails.
- [ ] Create the $99/month Stripe recurring price in **test mode** first.
- [ ] Configure Stripe Customer Portal.
- [ ] Register and test the webhook events listed in README.md.
- [ ] Add all Vercel environment variables.
- [ ] Sign up the owner account and promote it to admin using the SQL comment in schema.sql.
- [ ] Test builder signup, supplier signup, login, logout, password reset, and role denial.
- [ ] Test supplier search, claim submission, admin approval, and profile editing.
- [ ] Test Builder Free's 5-save limit and Builder Pro unlock.
- [ ] Complete a Stripe test payment, verify webhook state, open Billing Portal, and cancel.
- [ ] Replace Terms and Privacy placeholders with attorney-reviewed documents.
- [ ] Confirm your supplier-data provider license before importing or publishing records.
- [ ] Switch Stripe keys/webhook from test mode to live mode only after every test passes.
