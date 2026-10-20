-- Nama' database schema, version 1.
-- Run once in Supabase: SQL Editor → New query → paste this file → Run.

-- ---------------------------------------------------------------
-- Reference data: buildings and their bins
-- ---------------------------------------------------------------
create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  pickup_day text not null,
  bin_spot text not null,
  created_at timestamptz not null default now()
);

create table public.bins (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings (id) on delete cascade,
  code text not null unique check (code ~ '^NAMA-[A-Z][0-9]{2}$'),
  label text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- People
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  building_id uuid references public.buildings (id) on delete set null,
  flat text check (flat ~ '^[0-9]{1,6}$'),
  role text not null default 'resident' check (role in ('resident', 'staff')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Activity
-- ---------------------------------------------------------------
create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  bin_id uuid not null references public.bins (id),
  weight_kg numeric(5, 2) check (weight_kg is null or (weight_kg > 0 and weight_kg <= 50)),
  points integer not null default 0 check (points >= 0),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references public.profiles (id)
);
create index deposits_user_idx on public.deposits (user_id, created_at desc);
create index deposits_status_idx on public.deposits (status, created_at);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  partner text not null,
  category text not null check (category in ('Grocery', 'Bakery', 'Cafés')),
  points_cost integer not null check (points_cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (title, partner)
);

create table public.redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  reward_id uuid not null references public.rewards (id),
  code text not null unique,
  points_spent integer not null check (points_spent > 0),
  created_at timestamptz not null default now()
);
create index redemptions_user_idx on public.redemptions (user_id, created_at desc);

-- ---------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'staff'
  );
$$;

-- Create a profile automatically when someone signs up.
-- Name, building and flat come from the sign-up form (auth user metadata).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  b_id uuid;
begin
  if (meta ->> 'building_id') ~* '^[0-9a-f-]{36}$' then
    b_id := (meta ->> 'building_id')::uuid;
  end if;

  insert into public.profiles (id, name, building_id, flat)
  values (
    new.id,
    coalesce(nullif(trim(meta ->> 'name'), ''), 'Resident'),
    b_id,
    nullif(meta ->> 'flat', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------
alter table public.buildings enable row level security;
alter table public.bins enable row level security;
alter table public.profiles enable row level security;
alter table public.deposits enable row level security;
alter table public.rewards enable row level security;
alter table public.redemptions enable row level security;

-- Buildings are listed on the sign-up form, before anyone is logged in.
create policy "Anyone can read buildings" on public.buildings
  for select to anon, authenticated using (true);

create policy "Members can read bins" on public.bins
  for select to authenticated using (true);

create policy "Members can read active rewards" on public.rewards
  for select to authenticated using (active or public.is_staff());

-- Profiles: you see and edit your own; staff can see everyone.
create policy "Read own profile" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_staff());

create policy "Update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Residents can never change their own role.
revoke update on public.profiles from authenticated;
grant update (name, building_id, flat) on public.profiles to authenticated;

-- Deposits: residents create pending ones for themselves; only staff verify.
create policy "Read own deposits" on public.deposits
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

create policy "Create own pending deposit" on public.deposits
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and weight_kg is null
    and points = 0
    and verified_at is null
    and verified_by is null
  );

create policy "Staff update deposits" on public.deposits
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- Redemptions: residents read their own. Creating one happens through a
-- database function added in Feature 6, so points are checked safely.
create policy "Read own redemptions" on public.redemptions
  for select to authenticated using (user_id = auth.uid() or public.is_staff());
