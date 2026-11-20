-- Restaurant demo: NAMA for Rania's Kitchen (made-up restaurant group, real Dubai areas).
-- No login: anyone with the link can log a bin, request a pickup, see the owner report
-- and reset the demo. So the tables are locked and the app only uses the functions below,
-- which check every input. Sample rows (is_sample = true) are never deleted by the app.
-- Safe to run more than once.

create table if not exists public.kitchen_settings (
  id smallint primary key default 1 check (id = 1),
  restaurant text not null,
  aed_per_kg numeric(6,2) not null check (aed_per_kg > 0),
  next_pickup text not null,
  tip text not null
);

create table if not exists public.kitchen_branches (
  id smallint primary key,
  name text not null unique,
  location text not null
);

create table if not exists public.kitchen_bin_logs (
  id bigint generated always as identity primary key,
  branch_id smallint not null references public.kitchen_branches (id),
  waste_type text not null check (waste_type in ('prep', 'spoilage', 'plate')),
  weight_kg numeric(5,1) not null check (weight_kg > 0 and weight_kg <= 60),
  logged_at timestamptz not null default now(),
  is_sample boolean not null default false
);
create index if not exists kitchen_bin_logs_logged_at on public.kitchen_bin_logs (logged_at);

create table if not exists public.kitchen_pickups (
  id bigint generated always as identity primary key,
  collected_kg numeric(6,1) not null check (collected_kg > 0),
  collected_at timestamptz not null,
  is_sample boolean not null default false
);

create table if not exists public.kitchen_pickup_requests (
  id bigint generated always as identity primary key,
  requested_at timestamptz not null default now()
);

-- Lock the tables: no direct reads or writes from the app, only through the functions.
alter table public.kitchen_settings enable row level security;
alter table public.kitchen_branches enable row level security;
alter table public.kitchen_bin_logs enable row level security;
alter table public.kitchen_pickups enable row level security;
alter table public.kitchen_pickup_requests enable row level security;
revoke all on public.kitchen_settings, public.kitchen_branches, public.kitchen_bin_logs,
  public.kitchen_pickups, public.kitchen_pickup_requests from anon, authenticated;

-- ---------- Sample data ----------

insert into public.kitchen_settings (id, restaurant, aed_per_kg, next_pickup, tip)
values (1, 'Rania''s Kitchen', 20, 'Thursday, 7 to 9 am', 'Cut tomato order at Marina by 15%')
on conflict (id) do update set
  restaurant = excluded.restaurant, aed_per_kg = excluded.aed_per_kg,
  next_pickup = excluded.next_pickup, tip = excluded.tip;

insert into public.kitchen_branches (id, name, location) values
  (1, 'Marina', 'Marina Walk, Dubai Marina'),
  (2, 'JLT', 'Cluster D, Jumeirah Lake Towers'),
  (3, 'Al Barsha', 'Al Barsha 1, near Mall of the Emirates')
on conflict (id) do update set name = excluded.name, location = excluded.location;

-- 15 bin logs this month: 374 kg x AED 20 = AED 7,480.
-- Spoilage 168.3 kg (45%), prep 130.9 kg (35%), plate 74.8 kg (20%).
-- Marina 150.4 kg, JLT 101.2 kg, Al Barsha 122.4 kg.
-- Dated from the 1st of the current month (Dubai time), so the report is always "this month".
delete from public.kitchen_bin_logs where is_sample;
insert into public.kitchen_bin_logs (branch_id, waste_type, weight_kg, logged_at, is_sample)
select v.branch_id, v.waste_type, v.weight_kg,
       public.dubai_month_start() + make_interval(days => v.day_no, hours => v.hour_no), true
from (values
  (1, 'spoilage', 41.2, 0, 22), (2, 'prep',     18.1, 1, 15), (3, 'spoilage', 25.3, 2, 23),
  (1, 'prep',     22.9, 3, 16), (2, 'spoilage', 19.6, 4, 22), (3, 'prep',     24.0, 5, 15),
  (1, 'plate',    27.3, 6, 23), (3, 'plate',    26.0, 7, 22), (2, 'plate',    21.5, 8, 23),
  (1, 'spoilage', 37.3, 9, 22), (2, 'prep',     20.6, 10, 16), (3, 'spoilage', 23.5, 11, 22),
  (1, 'prep',     21.7, 12, 15), (2, 'spoilage', 21.4, 13, 23), (3, 'prep',     23.6, 14, 16)
) as v(branch_id, waste_type, weight_kg, day_no, hour_no);

-- Past pickups, newest first in the app. Dated back from today so they always look recent.
delete from public.kitchen_pickups where is_sample;
insert into public.kitchen_pickups (collected_kg, collected_at, is_sample)
select v.kg, date_trunc('day', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai'
             - make_interval(days => v.days_ago) + interval '8 hours', true
from (values (61.0, 2), (58.5, 5), (64.2, 9), (55.8, 12), (60.4, 16)) as v(kg, days_ago);

-- ---------- Functions the app calls ----------

-- Everything the three screens need in one call, as JSON.
create or replace function public.kitchen_dashboard()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with month_logs as (
    select l.*, b.name as branch
    from public.kitchen_bin_logs l
    join public.kitchen_branches b on b.id = l.branch_id
    where l.logged_at >= public.dubai_month_start()
  )
  select jsonb_build_object(
    'restaurant', s.restaurant,
    'aedPerKg', s.aed_per_kg,
    'nextPickup', s.next_pickup,
    'tip', s.tip,
    'branches', (select coalesce(jsonb_agg(jsonb_build_object('id', b.id, 'name', b.name, 'location', b.location,
                   'monthKg', coalesce((select sum(weight_kg) from month_logs m where m.branch_id = b.id), 0)) order by b.id), '[]')
                 from public.kitchen_branches b),
    'byType', (select coalesce(jsonb_object_agg(t.waste_type, t.kg), '{}')
               from (select waste_type, sum(weight_kg) as kg from month_logs group by waste_type) t),
    'logCount', (select count(*) from month_logs),
    'recentLogs', (select coalesce(jsonb_agg(r order by r."loggedAt" desc), '[]') from (
                     select m.id, m.branch, m.waste_type as "wasteType", m.weight_kg as "weightKg", m.logged_at as "loggedAt"
                     from month_logs m order by m.logged_at desc limit 5) r),
    'pickups', (select coalesce(jsonb_agg(p order by p."collectedAt" desc), '[]') from (
                  select id, collected_kg as "collectedKg", collected_at as "collectedAt"
                  from public.kitchen_pickups order by collected_at desc limit 6) p),
    'openRequest', (select max(requested_at) from public.kitchen_pickup_requests)
  )
  from public.kitchen_settings s
  where s.id = 1;
$$;

-- Kitchen staff log one bin. Returns the new log's id.
drop function if exists public.kitchen_log_bin(smallint, text, numeric);
create or replace function public.kitchen_log_bin(p_branch_id integer, p_waste_type text, p_weight_kg numeric)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id bigint;
begin
  if not exists (select 1 from public.kitchen_branches where id = p_branch_id) then
    raise exception 'BAD_BRANCH';
  end if;
  if p_waste_type is null or p_waste_type not in ('prep', 'spoilage', 'plate') then
    raise exception 'BAD_TYPE';
  end if;
  if p_weight_kg is null or p_weight_kg < 0.1 or p_weight_kg > 60 then
    raise exception 'BAD_WEIGHT';
  end if;
  -- Stops one person flooding the shared demo from the QR code.
  if (select count(*) from public.kitchen_bin_logs where not is_sample and logged_at > now() - interval '1 hour') >= 60 then
    raise exception 'TOO_MANY';
  end if;

  insert into public.kitchen_bin_logs (branch_id, waste_type, weight_kg)
  values (p_branch_id, p_waste_type, round(p_weight_kg, 1))
  returning id into new_id;
  return new_id;
end;
$$;

-- "Bins full: request pickup". Only one open request at a time.
create or replace function public.kitchen_request_pickup()
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing timestamptz;
  created timestamptz;
begin
  select max(requested_at) into existing from public.kitchen_pickup_requests;
  if existing is not null then
    return existing;
  end if;
  insert into public.kitchen_pickup_requests default values returning requested_at into created;
  return created;
end;
$$;

-- Puts the demo back to the 15 sample logs (AED 7,480) with no open pickup request.
create or replace function public.kitchen_reset_demo()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.kitchen_bin_logs where not is_sample;
  delete from public.kitchen_pickups where not is_sample;
  delete from public.kitchen_pickup_requests where true;
$$;

revoke all on function public.kitchen_dashboard() from public;
revoke all on function public.kitchen_log_bin(integer, text, numeric) from public;
revoke all on function public.kitchen_request_pickup() from public;
revoke all on function public.kitchen_reset_demo() from public;
grant execute on function public.kitchen_dashboard() to anon, authenticated;
grant execute on function public.kitchen_log_bin(integer, text, numeric) to anon, authenticated;
grant execute on function public.kitchen_request_pickup() to anon, authenticated;
grant execute on function public.kitchen_reset_demo() to anon, authenticated;
