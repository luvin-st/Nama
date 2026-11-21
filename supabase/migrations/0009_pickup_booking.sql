-- Restaurants choose the pickup day and time (run after 0008). Safe to run more than once.
-- * A booking is one day (today to 6 days ahead, Dubai time) and one of 4 time slots.
--   It covers all branches (one route). Booking again replaces it; it can be cancelled.
-- * The dashboard and the staff route also return the booking.
-- * kitchen_request_pickup() stays, so the app keeps working until the new version is live.

alter table public.kitchen_pickup_requests
  add column if not exists pickup_day date,
  add column if not exists slot text check (slot is null or slot in ('morning', 'midday', 'afternoon', 'night'));

-- When each slot starts (hour of the day, Dubai time).
create or replace function public.kitchen_slot_start(p_slot text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_slot when 'morning' then 7 when 'midday' then 11 when 'afternoon' then 15 when 'night' then 22 end;
$$;

create or replace function public.kitchen_book_pickup(p_day date, p_slot text)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  dubai_now timestamp := now() at time zone 'Asia/Dubai';
  created timestamptz;
begin
  perform public.kitchen_require(array['restaurant']);
  if p_slot is null or public.kitchen_slot_start(p_slot) is null then
    raise exception 'BAD_SLOT';
  end if;
  if p_day is null or p_day < dubai_now::date or p_day > dubai_now::date + 6 then
    raise exception 'BAD_DAY';
  end if;
  if p_day = dubai_now::date and extract(hour from dubai_now) >= public.kitchen_slot_start(p_slot) then
    raise exception 'SLOT_STARTED';
  end if;

  delete from public.kitchen_pickup_requests where true;
  insert into public.kitchen_pickup_requests (pickup_day, slot) values (p_day, p_slot)
  returning requested_at into created;
  return created;
end;
$$;

create or replace function public.kitchen_cancel_pickup()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.kitchen_require(array['restaurant']);
  delete from public.kitchen_pickup_requests where true;
end;
$$;

create or replace function public.kitchen_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.kitchen_require(array['restaurant', 'staff']);
  return (
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
                    select pk.id, pk.collected_kg as "collectedKg", pk.collected_at as "collectedAt",
                           pk.grade, pk.collected_by as "collectedBy", b.name as branch
                    from public.kitchen_pickups pk
                    left join public.kitchen_branches b on b.id = pk.branch_id
                    order by pk.collected_at desc limit 6) p),
      'openRequest', (select max(requested_at) from public.kitchen_pickup_requests),
      'booking', (select jsonb_build_object('day', r.pickup_day, 'slot', r.slot, 'requestedAt', r.requested_at)
                      from public.kitchen_pickup_requests r where r.pickup_day is not null
                      order by r.requested_at desc limit 1)
    )
    from public.kitchen_settings s
    where s.id = 1
  );
end;
$$;

create or replace function public.kitchen_staff_route()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  perform public.kitchen_require(array['staff']);
  return (
    with today_logs as (
      select * from public.kitchen_bin_logs where logged_at >= public.dubai_day_start()
    ),
    today_pickups as (
      select distinct on (branch_id) * from public.kitchen_pickups
      where branch_id is not null and collected_at >= public.dubai_day_start()
      order by branch_id, collected_at desc
    )
    select jsonb_build_object(
      'restaurant', s.restaurant,
      'nextPickup', s.next_pickup,
      'openRequest', (select max(requested_at) from public.kitchen_pickup_requests),
      'booking', (select jsonb_build_object('day', r.pickup_day, 'slot', r.slot, 'requestedAt', r.requested_at)
                      from public.kitchen_pickup_requests r where r.pickup_day is not null
                      order by r.requested_at desc limit 1),
      'stops', (select coalesce(jsonb_agg(jsonb_build_object(
                    'branchId', b.id, 'name', b.name, 'location', b.location,
                    'todayKg', coalesce((select sum(weight_kg) from today_logs t where t.branch_id = b.id), 0),
                    'byType', (select coalesce(jsonb_object_agg(x.waste_type, x.kg), '{}') from (
                                 select waste_type, sum(weight_kg) as kg from today_logs t
                                 where t.branch_id = b.id group by waste_type) x),
                    'collected', (select jsonb_build_object('kg', p.collected_kg, 'grade', p.grade, 'at', p.collected_at)
                                  from today_pickups p where p.branch_id = b.id)
                  ) order by b.id), '[]')
                from public.kitchen_branches b),
      'collected', (select coalesce(jsonb_agg(c order by c."collectedAt" desc), '[]') from (
                      select pk.id, pk.collected_kg as "collectedKg", pk.collected_at as "collectedAt",
                             pk.grade, pk.reason, pk.collected_by as "collectedBy", b.name as branch
                      from public.kitchen_pickups pk
                      left join public.kitchen_branches b on b.id = pk.branch_id
                      order by pk.collected_at desc limit 12) c)
    )
    from public.kitchen_settings s
    where s.id = 1
  );
end;
$$;

revoke all on function public.kitchen_slot_start(text) from public, anon, authenticated;
revoke all on function public.kitchen_book_pickup(date, text) from public, anon, authenticated;
revoke all on function public.kitchen_cancel_pickup() from public, anon, authenticated;
grant execute on function public.kitchen_book_pickup(date, text) to authenticated;
grant execute on function public.kitchen_cancel_pickup() to authenticated;
