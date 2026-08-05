create table public.profile_media(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  supplier_profile_id uuid references public.supplier_profiles(id) on delete cascade,
  kind text not null check(kind in ('logo','project','trade')),
  storage_path text not null unique,
  public_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.profile_media enable row level security;
create policy profile_media_public_read on public.profile_media for select using(true);
create policy profile_media_owner_insert on public.profile_media for insert with check(
  owner_id=auth.uid()
  and (
    supplier_profile_id is null
    or exists(select 1 from public.supplier_profiles where id=supplier_profile_id and owner_id=auth.uid())
  )
);
create policy profile_media_owner_delete on public.profile_media for delete using(owner_id=auth.uid());
create index profile_media_owner_idx on public.profile_media(owner_id,created_at desc);
create index profile_media_supplier_idx on public.profile_media(supplier_profile_id,created_at desc);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('company-media','company-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create policy company_media_public_read on storage.objects for select using(bucket_id='company-media');
create policy company_media_owner_insert on storage.objects for insert to authenticated with check(bucket_id='company-media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy company_media_owner_delete on storage.objects for delete to authenticated using(bucket_id='company-media' and (storage.foldername(name))[1]=auth.uid()::text);
