-- Company verification and trusted review controls.
alter table public.profiles
  add column if not exists company_verification_status text not null default 'unverified'
    check (company_verification_status in ('unverified','pending','verified','rejected')),
  add column if not exists company_verified_at timestamptz,
  add column if not exists company_verified_by uuid references auth.users(id),
  add column if not exists legal_company_name text,
  add column if not exists business_website text,
  add column if not exists business_phone text,
  add column if not exists company_registration_number text;

create table if not exists public.company_verification_requests(
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  account_role public.user_role not null,
  legal_company_name text not null,
  business_website text,
  work_email text not null,
  business_phone text not null,
  registration_number text,
  supporting_details text,
  email_domain text,
  website_domain text,
  domain_match boolean not null default false,
  status text not null default 'pending' check(status in ('pending','approved','rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists company_verification_one_pending
  on public.company_verification_requests(requester_user_id) where status='pending';
create index if not exists company_verification_status_idx
  on public.company_verification_requests(status,created_at desc);

alter table public.company_verification_requests enable row level security;
drop policy if exists verification_requests_self_read on public.company_verification_requests;
create policy verification_requests_self_read on public.company_verification_requests
  for select to authenticated
  using(requester_user_id=(select auth.uid()) or public.is_role('admin'));
drop policy if exists verification_requests_self_insert on public.company_verification_requests;
revoke insert,update,delete on public.company_verification_requests from authenticated;
grant select on public.company_verification_requests to authenticated;

alter table public.evaluations
  add column if not exists relationship_attested boolean not null default false,
  add column if not exists relationship_context text;

alter table public.reviews
  add column if not exists moderation_status text not null default 'pending'
    check(moderation_status in ('pending','approved','rejected')),
  add column if not exists reviewer_company_name text;

alter table public.reviews
  alter column verified set default false,
  alter column is_public set default false;

update public.reviews
set verified=false,is_public=false,moderation_status='pending'
where moderation_status='pending';

drop policy if exists evaluations_read_authenticated on public.evaluations;
create policy evaluations_read_authorized on public.evaluations
  for select to authenticated
  using(
    builder_user_id=(select auth.uid())
    or public.is_role('admin')
    or exists(
      select 1 from public.supplier_profiles s
      where s.id=supplier_profile_id and s.owner_id=(select auth.uid())
    )
  );

drop policy if exists evaluations_builder_insert on public.evaluations;
create policy evaluations_builder_insert on public.evaluations
  for insert to authenticated
  with check(
    builder_user_id=(select auth.uid())
    and relationship_attested=true
    and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified')
  );
drop policy if exists evaluations_builder_update on public.evaluations;
create policy evaluations_builder_update on public.evaluations
  for update to authenticated
  using(builder_user_id=(select auth.uid()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified'))
  with check(builder_user_id=(select auth.uid()) and relationship_attested=true and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified'));

drop policy if exists reviews_builder_insert on public.reviews;
create policy reviews_builder_insert on public.reviews
  for insert to authenticated
  with check(
    builder_user_id=(select auth.uid())
    and verified=false
    and is_public=false
    and moderation_status='pending'
    and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified')
  );
drop policy if exists reviews_builder_update on public.reviews;
create policy reviews_builder_update on public.reviews
  for update to authenticated
  using(builder_user_id=(select auth.uid()) and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified'))
  with check(builder_user_id=(select auth.uid()) and verified=false and is_public=false and moderation_status='pending' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='builder' and p.company_verification_status='verified'));

drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select
  using(
    (is_public=true and verified=true and moderation_status='approved')
    or builder_user_id=(select auth.uid())
    or public.is_role('admin')
  );

revoke update(company_verification_status,company_verified_at,company_verified_by,legal_company_name,business_website,business_phone,company_registration_number) on public.profiles from authenticated;
