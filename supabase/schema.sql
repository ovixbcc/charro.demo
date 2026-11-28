-- Chaatro: Supabase schema (additive only; safe to run more than once)

-- 1) Profiles: one row per logged-in user (filled automatically on sign-up)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
          new.email,
          new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Orders / payments (EPS). Written only by the server (service role).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  txn text unique,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text,
  customer_phone text,
  customer_email text,
  product text,
  amount numeric(12,2) not null,
  currency text not null default 'BDT',
  gateway text not null default 'eps',
  sandbox boolean not null default true,
  status text not null default 'PENDING' check (status in ('PENDING','SUCCESS','FAILED','CANCEL','UNKNOWN')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

-- 3) Row Level Security
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id and role = 'student');
drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders for select to authenticated using (auth.uid() = user_id);
-- (no insert/update policies on orders: only the server's service-role key can write)

-- 4) Storage: public-read bucket for course/teacher images, uploads only into the user's own folder
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media own upload" on storage.objects;
create policy "media own upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media own delete" on storage.objects;
create policy "media own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
