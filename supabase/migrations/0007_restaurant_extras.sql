-- Restaurant demo extras for the pitch (run after 0006). Safe to run more than once.
-- * Pickups record a contamination grade and who collected them.
-- * The dashboard also returns what was logged today: total kg, and which of each
--   branch's 3 bins (prep scraps, spoilage, plate leftovers) have been logged.

alter table public.kitchen_pickups
  add column if not exists grade text check (grade in ('A', 'B', 'C')),
  add column if not exists collected_by text check (collected_by is null or char_length(collected_by) between 1 and 60);

-- Sample pickups: graded by the collector at the kerb. "Licensed partner" until a real collector is signed.
update public.kitchen_pickups p
set grade = v.grade, collected_by = 'Licensed partner'
from (values (61.0, 'A'), (58.5, 'A'), (64.2, 'B'), (55.8, 'A'), (60.4, 'A')) as v(kg, grade)
where p.is_sample and p.collected_kg = v.kg;

-- Start of today in Dubai time.
create or replace function public.dubai_day_start()
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select date_trunc('day', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai';
$$;

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
  ),
  today_logs as (
    select * from month_logs where logged_at >= public.dubai_day_start()
  )
  select jsonb_build_object(
    'restaurant', s.restaurant,
    'aedPerKg', s.aed_per_kg,
    'nextPickup', s.next_pickup,
    'tip', s.tip,
    'branches', (select coalesce(jsonb_agg(jsonb_build_object(
                     'id', b.id, 'name', b.name, 'location', b.location,
                     'monthKg', coalesce((select sum(weight_kg) from month_logs m where m.branch_id = b.id), 0),
                     'binsToday', (select count(distinct t.waste_type) from today_logs t where t.branch_id = b.id)
                   ) order by b.id), '[]')
                 from public.kitchen_branches b),
    'byType', (select coalesce(jsonb_object_agg(t.waste_type, t.kg), '{}')
               from (select waste_type, sum(weight_kg) as kg from month_logs group by waste_type) t),
    'logCount', (select count(*) from month_logs),
    'todayKg', (select coalesce(sum(weight_kg), 0) from today_logs),
    'recentLogs', (select coalesce(jsonb_agg(r order by r."loggedAt" desc), '[]') from (
                     select m.id, m.branch, m.waste_type as "wasteType", m.weight_kg as "weightKg", m.logged_at as "loggedAt"
                     from month_logs m order by m.logged_at desc limit 5) r),
    'pickups', (select coalesce(jsonb_agg(p order by p."collectedAt" desc), '[]') from (
                  select id, collected_kg as "collectedKg", collected_at as "collectedAt",
                         grade, collected_by as "collectedBy"
                  from public.kitchen_pickups order by collected_at desc limit 6) p),
    'openRequest', (select max(requested_at) from public.kitchen_pickup_requests)
  )
  from public.kitchen_settings s
  where s.id = 1;
$$;

revoke all on function public.kitchen_dashboard() from public;
grant execute on function public.kitchen_dashboard() to anon, authenticated;
