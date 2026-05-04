create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, email)
select id, coalesce(email, '')
from auth.users
on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;

create policy "Users can read their own profile" on public.profiles
  for select
  using (id = auth.uid());

grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant execute on function public.handle_new_user_profile() to service_role;

-- 관리자 계정 이메일로 바꾼 뒤 실행하세요.
-- update public.profiles
-- set role = 'admin',
--     updated_at = now()
-- where email = 'admin@example.com';
