-- SourceMetric V1: free B2B supplier network, verified scoring, and private introductions.
-- Production was confirmed empty immediately before this coordinated early-stage migration.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter type public.user_role rename value 'builder' to 'business';
alter table public.saved_suppliers rename column builder_user_id to business_user_id;
alter table public.evaluations rename column builder_user_id to business_user_id;
alter table public.reviews rename column builder_user_id to business_user_id;

alter table public.supplier_profiles
  add column if not exists categories text[] not null default '{}',
  add column if not exists capabilities text[] not null default '{}',
  add column if not exists reliability_score integer check (reliability_score between 0 and 100),
  add column if not exists value_score integer check (value_score between 0 and 100),
  add column if not exists would_work_again_percent integer check (would_work_again_percent between 0 and 100);

alter table public.evaluations
  add column if not exists reliability integer check (reliability between 1 and 100),
  add column if not exists value integer check (value between 1 and 100),
  add column if not exists would_work_again boolean,
  add column if not exists relationship_length text,
  add column if not exists goods_services text,
  add column if not exists relationship_ongoing boolean not null default false,
  add column if not exists relationship_verification_status text not null default 'pending'
    check (relationship_verification_status in ('unverified','pending','verified','rejected'));

update public.evaluations set reliability=delivery, value=quality where reliability is null or value is null;
alter table public.evaluations alter column reliability set not null;
alter table public.evaluations alter column value set not null;
alter table public.evaluations alter column would_work_again set not null;

alter table public.reviews drop constraint if exists reviews_moderation_status_check;
alter table public.reviews add constraint reviews_moderation_status_check check (moderation_status in ('pending','approved','rejected','disputed'));
alter table public.reviews add column if not exists supplier_response text;
alter table public.reviews add column if not exists supplier_responded_at timestamptz;

create table if not exists public.review_reports(
  id uuid primary key default gen_random_uuid(), review_id uuid not null references public.reviews(id) on delete cascade,
  reporter_user_id uuid not null references auth.users(id) on delete cascade, reason text not null,
  details text, status text not null default 'pending' check(status in ('pending','resolved','dismissed')),
  created_at timestamptz not null default now(), unique(review_id,reporter_user_id)
);
create table if not exists public.profile_corrections(
  id uuid primary key default gen_random_uuid(), supplier_profile_id uuid not null references public.supplier_profiles(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete cascade, details text not null,
  status text not null default 'pending' check(status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.moderation_audit_log(
  id bigint generated always as identity primary key, actor_user_id uuid references auth.users(id),
  entity_type text not null, entity_id uuid not null, action text not null, notes text,
  previous_state jsonb, new_state jsonb, created_at timestamptz not null default now()
);
create table if not exists public.inquiries(
  id uuid primary key default gen_random_uuid(), business_user_id uuid not null references auth.users(id) on delete cascade,
  supplier_profile_id uuid not null references public.supplier_profiles(id) on delete cascade,
  subject text not null check(char_length(subject) between 3 and 160), message text not null check(char_length(message) between 10 and 5000),
  category text, approximate_need text, timeline text, preferred_contact_method text,
  status text not null default 'new' check(status in ('new','viewed','responded','closed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.messages(
  id uuid primary key default gen_random_uuid(), inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  message text not null check(char_length(message) between 1 and 5000), read_at timestamptz,
  created_at timestamptz not null default now(), check(sender_user_id<>recipient_user_id)
);
create table if not exists public.meeting_requests(
  id uuid primary key default gen_random_uuid(), inquiry_id uuid references public.inquiries(id) on delete cascade,
  business_user_id uuid not null references auth.users(id) on delete cascade,
  supplier_profile_id uuid not null references public.supplier_profiles(id) on delete cascade,
  proposed_at timestamptz not null, time_zone text not null,
  meeting_type text not null check(meeting_type in ('phone','video','in_person','other')),
  message text, status text not null default 'pending' check(status in ('pending','accepted','declined','reschedule_requested','cancelled','completed')),
  alternate_proposed_at timestamptz, response_message text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.review_reports enable row level security;
alter table public.profile_corrections enable row level security;
alter table public.moderation_audit_log enable row level security;
alter table public.inquiries enable row level security;
alter table public.messages enable row level security;
alter table public.meeting_requests enable row level security;

do $$ declare r record; begin for r in select tablename,policyname from pg_policies where schemaname='public' loop execute format('drop policy if exists %I on public.%I',r.policyname,r.tablename); end loop; end $$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists evaluations_refresh_scores on public.evaluations;
drop function if exists public.handle_new_user();
drop function if exists public.refresh_supplier_scores();
drop function if exists public.is_role(public.user_role);

create or replace function private.is_role(check_role public.user_role) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.profiles where id=(select auth.uid()) and role=check_role)
$$;
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,email,role,company_name,full_name)
  values(new.id,new.email,case when new.raw_user_meta_data->>'role'='supplier' then 'supplier'::public.user_role else 'business'::public.user_role end,
    new.raw_user_meta_data->>'company_name',new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create or replace function private.refresh_supplier_scores() returns trigger
language plpgsql security definer set search_path='' as $$
declare target uuid:=coalesce(new.supplier_profile_id,old.supplier_profile_id);
begin
  update public.supplier_profiles s set
    quality_score=x.quality, reliability_score=x.reliability, delivery_score=x.delivery,
    communication_score=x.communication, value_score=x.value,
    score=case when x.n>=3 then round((x.quality+x.reliability+x.delivery+x.communication+x.value)/5.0) else null end,
    review_count=x.n, would_work_again_percent=case when x.n>=3 then round(100.0*x.work_again/x.n) else null end, updated_at=now()
  from (select supplier_profile_id,round(avg(quality))::int quality,round(avg(reliability))::int reliability,
    round(avg(delivery))::int delivery,round(avg(communication))::int communication,round(avg(value))::int value,
    count(*)::int n,count(*) filter(where would_work_again)::int work_again
    from public.evaluations e join public.reviews r on r.evaluation_id=e.id
    where e.supplier_profile_id=target and e.relationship_verification_status='verified'
      and r.verified and r.is_public and r.moderation_status='approved' group by e.supplier_profile_id) x
  where s.id=x.supplier_profile_id;
  if not found then update public.supplier_profiles set score=null,quality_score=null,reliability_score=null,delivery_score=null,
    communication_score=null,value_score=null,would_work_again_percent=null,review_count=0,updated_at=now() where id=target; end if;
  return coalesce(new,old);
end $$;
revoke all on all functions in schema private from public,anon,authenticated;
grant usage on schema private to anon,authenticated;
grant execute on function private.is_role(public.user_role) to anon,authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
create trigger evaluations_refresh_scores after insert or update or delete on public.evaluations for each row execute function private.refresh_supplier_scores();
create trigger reviews_refresh_scores after insert or update or delete on public.reviews for each row execute function private.refresh_supplier_scores();

create policy profiles_self_select on public.profiles for select to authenticated using(id=(select auth.uid()) or (select private.is_role('admin')));
create policy profiles_self_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy suppliers_public_select on public.supplier_profiles for select to anon,authenticated using(is_public or owner_id=(select auth.uid()) or (select private.is_role('admin')));
create policy suppliers_owner_update on public.supplier_profiles for update to authenticated using(owner_id=(select auth.uid()) and (select private.is_role('supplier'))) with check(owner_id=(select auth.uid()) and (select private.is_role('supplier')));
create policy claims_participant_select on public.supplier_claims for select to authenticated using(claimant_user_id=(select auth.uid()) or (select private.is_role('admin')));
create policy claims_supplier_insert on public.supplier_claims for insert to authenticated with check(claimant_user_id=(select auth.uid()) and (select private.is_role('supplier')) and status='pending');
create policy saved_business_all on public.saved_suppliers for all to authenticated using(business_user_id=(select auth.uid()) and (select private.is_role('business'))) with check(business_user_id=(select auth.uid()) and (select private.is_role('business')));
create policy evaluations_participant_select on public.evaluations for select to authenticated using(business_user_id=(select auth.uid()) or (select private.is_role('admin')) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())));
create policy evaluations_business_insert on public.evaluations for insert to authenticated with check(business_user_id=(select auth.uid()) and relationship_attested and relationship_verification_status='pending' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='business' and p.company_verification_status='verified'));
create policy reviews_public_select on public.reviews for select to anon,authenticated using((is_public and verified and moderation_status='approved') or business_user_id=(select auth.uid()) or (select private.is_role('admin')) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())));
create policy reviews_business_insert on public.reviews for insert to authenticated with check(business_user_id=(select auth.uid()) and not verified and not is_public and moderation_status='pending');
create policy notifications_self_select on public.notifications for select to authenticated using(user_id=(select auth.uid()));
create policy notifications_self_update on public.notifications for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy media_public_select on public.profile_media for select to anon,authenticated using(true);
create policy media_owner_insert on public.profile_media for insert to authenticated with check(owner_id=(select auth.uid()));
create policy media_owner_delete on public.profile_media for delete to authenticated using(owner_id=(select auth.uid()));
create policy verification_self_select on public.company_verification_requests for select to authenticated using(requester_user_id=(select auth.uid()) or (select private.is_role('admin')));
create policy review_reports_self_select on public.review_reports for select to authenticated using(reporter_user_id=(select auth.uid()) or (select private.is_role('admin')));
create policy review_reports_self_insert on public.review_reports for insert to authenticated with check(reporter_user_id=(select auth.uid()) and status='pending');
create policy corrections_self_select on public.profile_corrections for select to authenticated using(requester_user_id=(select auth.uid()) or (select private.is_role('admin')));
create policy corrections_self_insert on public.profile_corrections for insert to authenticated with check(requester_user_id=(select auth.uid()) and status='pending');
create policy audit_admin_select on public.moderation_audit_log for select to authenticated using((select private.is_role('admin')));
create policy inquiries_participant_select on public.inquiries for select to authenticated using(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())) or (select private.is_role('admin')));
create policy inquiries_business_insert on public.inquiries for insert to authenticated with check(business_user_id=(select auth.uid()) and (select private.is_role('business')) and status='new');
create policy inquiries_participant_update on public.inquiries for update to authenticated using(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid()))) with check(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())));
create policy messages_participant_select on public.messages for select to authenticated using(sender_user_id=(select auth.uid()) or recipient_user_id=(select auth.uid()) or (select private.is_role('admin')));
create policy messages_participant_insert on public.messages for insert to authenticated with check(sender_user_id=(select auth.uid()) and exists(select 1 from public.inquiries i join public.supplier_profiles s on s.id=i.supplier_profile_id where i.id=inquiry_id and (i.business_user_id=(select auth.uid()) or s.owner_id=(select auth.uid())) and recipient_user_id in (i.business_user_id,s.owner_id)));
create policy messages_recipient_update on public.messages for update to authenticated using(recipient_user_id=(select auth.uid())) with check(recipient_user_id=(select auth.uid()));
create policy meetings_participant_select on public.meeting_requests for select to authenticated using(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())) or (select private.is_role('admin')));
create policy meetings_business_insert on public.meeting_requests for insert to authenticated with check(business_user_id=(select auth.uid()) and (select private.is_role('business')) and status='pending');
create policy meetings_participant_update on public.meeting_requests for update to authenticated using(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid()))) with check(business_user_id=(select auth.uid()) or exists(select 1 from public.supplier_profiles s where s.id=supplier_profile_id and s.owner_id=(select auth.uid())));

revoke all on public.subscriptions,public.processed_webhook_events from anon,authenticated;
grant select on public.supplier_profiles,public.reviews,public.profile_media to anon,authenticated;
grant select on public.profiles,public.supplier_claims,public.saved_suppliers,public.evaluations,public.notifications,public.company_verification_requests,public.review_reports,public.profile_corrections,public.inquiries,public.messages,public.meeting_requests to authenticated;
grant insert on public.supplier_claims,public.saved_suppliers,public.evaluations,public.reviews,public.profile_media,public.review_reports,public.profile_corrections,public.inquiries,public.messages,public.meeting_requests to authenticated;
grant delete on public.saved_suppliers,public.profile_media to authenticated;
revoke insert,delete on public.profiles from authenticated;
revoke update on public.profiles,public.supplier_profiles,public.reviews,public.evaluations,public.notifications,public.inquiries,public.messages,public.meeting_requests from authenticated;
grant update(full_name,company_name,legal_company_name,business_website,business_phone,company_registration_number) on public.profiles to authenticated;
grant update(name,slug,trade_category,categories,capabilities,city,state,website,phone,description,service_area,is_public) on public.supplier_profiles to authenticated;
grant update(read_at) on public.notifications to authenticated;
grant update(read_at) on public.messages to authenticated;
grant update(status) on public.inquiries to authenticated;
grant update(status,alternate_proposed_at,response_message,updated_at) on public.meeting_requests to authenticated;

create index if not exists profiles_company_verified_by_idx on public.profiles(company_verified_by);
create index if not exists company_verification_reviewed_by_idx on public.company_verification_requests(reviewed_by);
create index if not exists evaluations_business_user_idx on public.evaluations(business_user_id);
create index if not exists reviews_business_user_idx on public.reviews(business_user_id);
create index if not exists saved_supplier_idx on public.saved_suppliers(supplier_profile_id);
create index if not exists claims_claimant_idx on public.supplier_claims(claimant_user_id);
create index if not exists claims_reviewed_by_idx on public.supplier_claims(reviewed_by);
create index if not exists inquiries_business_idx on public.inquiries(business_user_id,created_at desc);
create index if not exists inquiries_supplier_idx on public.inquiries(supplier_profile_id,created_at desc);
create index if not exists messages_inquiry_idx on public.messages(inquiry_id,created_at);
create index if not exists meetings_business_idx on public.meeting_requests(business_user_id,created_at desc);
create index if not exists meetings_supplier_idx on public.meeting_requests(supplier_profile_id,created_at desc);
