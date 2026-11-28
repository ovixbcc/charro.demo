-- Phase 1: roles. Additive and safe to run twice. Existing rows/data are not changed.

-- 1) allow the 'institution' role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student','teacher','admin','institution'));

-- 2) admin staff level (only meaningful when role = 'admin')
alter table public.profiles add column if not exists admin_level text;
alter table public.profiles drop constraint if exists profiles_admin_level_check;
alter table public.profiles add constraint profiles_admin_level_check
  check (admin_level is null or admin_level in ('super','accounts','academic','dev'));

-- 3) nobody can change role / admin_level from the browser. Requests coming from the website (anon key or a logged-in user)
--    run as the database roles 'anon' / 'authenticated'; the server's service-role key and the Supabase SQL Editor do not.
--    (Deliberately NOT security definer: inside a definer function current_user would be the owner and the check would never fire.)
create or replace function public.protect_profile_roles() returns trigger
language plpgsql set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.admin_level is distinct from old.admin_level)
     and current_user in ('anon', 'authenticated') then
    raise exception 'role and admin_level can only be changed by an administrator in Supabase';
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_roles on public.profiles;
create trigger protect_profile_roles before update on public.profiles
  for each row execute function public.protect_profile_roles();

-- HOW TO MAKE YOURSELF THE ADMIN (run separately, once, after logging in to the site with Google at least once):
--   update public.profiles set role = 'admin', admin_level = 'super' where email = 'YOUR-GOOGLE-EMAIL';
