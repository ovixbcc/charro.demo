-- Chaatro: saved forms (teacher applications, contact messages, institution applications)
-- Additive only; safe to run more than once. Does NOT touch profiles/orders.
-- RLS is ON with NO policies: the browser cannot read or write these tables.
-- Only the server (service role key, in /api/forms) can insert; admins read them in the Supabase dashboard.

create table if not exists public.teacher_applications (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  full_name text not null,
  phone text not null,
  email text not null,
  district text,
  institution text,
  dept text,
  status text,
  year text,
  subjects text[] not null default '{}',
  programs text[] not null default '{}',
  formats text[] not null default '{}',
  experience_years numeric(4,1),
  video_url text,
  bio text,
  referral text,
  files jsonb not null default '[]'::jsonb,   -- [{key, path, name, size}] paths inside private bucket "form-files"
  user_id uuid references auth.users (id) on delete set null,
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  topic text,
  message text not null,
  user_id uuid references auth.users (id) on delete set null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.institution_applications (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  name text not null,
  type text,
  est_students integer,
  address text,
  contact_person text not null,
  designation text,
  phone text not null,
  email text not null,
  requirements text,
  files jsonb not null default '[]'::jsonb,
  user_id uuid references auth.users (id) on delete set null,
  review_status text not null default 'pending' check (review_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.teacher_applications enable row level security;
alter table public.contact_messages enable row level security;
alter table public.institution_applications enable row level security;
-- (intentionally no policies)

-- Private bucket for CVs / ID documents / photos / logos (5 MB per file, no public access)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('form-files', 'form-files', false, 5242880,
        array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png'])
on conflict (id) do nothing;
