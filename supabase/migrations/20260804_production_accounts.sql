-- Production account onboarding and removal of seeded demonstration records.
delete from public.supplier_profiles where source_name='SourceMetric Seed' or external_id like 'seed-%';

alter table public.reviews alter column verified set default false;
create policy reviews_builder_update on public.reviews for update using(builder_user_id=auth.uid() and public.is_role('builder')) with check(builder_user_id=auth.uid() and public.is_role('builder'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  account_role public.user_role;
  company text;
  company_slug text;
begin
  account_role:=case when new.raw_user_meta_data->>'role'='supplier' then 'supplier'::public.user_role else 'builder'::public.user_role end;
  company:=coalesce(nullif(trim(new.raw_user_meta_data->>'company_name'),''),'New SourceMetric Company');

  insert into public.profiles(id,email,role,company_name,full_name)
  values(new.id,new.email,account_role,company,nullif(trim(new.raw_user_meta_data->>'full_name'),''));

  if account_role='supplier' then
    company_slug:=trim(both '-' from regexp_replace(lower(company),'[^a-z0-9]+','-','g'))||'-'||left(replace(new.id::text,'-',''),8);
    insert into public.supplier_profiles(owner_id,name,slug,claimed,verified,is_public,source_name,external_id)
    values(new.id,company,company_slug,true,false,true,'Supplier signup',new.id::text);
  end if;
  return new;
end;
$$;

-- Backfill supplier accounts that were created before this migration.
insert into public.supplier_profiles(owner_id,name,slug,claimed,verified,is_public,source_name,external_id)
select p.id,coalesce(nullif(trim(p.company_name),''),'New SourceMetric Company'),trim(both '-' from regexp_replace(lower(coalesce(nullif(trim(p.company_name),''),'new-sourcemetric-company')),'[^a-z0-9]+','-','g'))||'-'||left(replace(p.id::text,'-',''),8),true,false,true,'Supplier signup',p.id::text
from public.profiles p
where p.role='supplier' and not exists(select 1 from public.supplier_profiles s where s.owner_id=p.id)
on conflict do nothing;
