-- Login portal + Nama staff side (run after 0006 and 0007). Safe to run more than once.
-- * People now log in. Each account is either a restaurant member (Rania's Kitchen for now)
--   or Nama staff. Staff accounts need the staff code below.
-- * The restaurant functions only work for logged-in restaurant members (staff may read
--   the dashboard). Logged-out visitors can no longer read or change anything.
-- * Nama staff see today's route and record each collection (weight, grade A/B/C).
--
-- CHANGE THE STAFF CODE before running if you want a different one (line marked below).

-- ---------- Who is who ----------

create table if not exists public.kitchen_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  kind text not null check (kind in ('restaurant', 'staff')),
  company text not null check (char_length(company) between 1 and 80),
  joined_at timestamptz not null default now()
);

create table if not exists public.kitchen_staff_code (
  id smallint primary key default 1 check (id = 1),
  code text not null check (char_length(code) between 6 and 40)
);

insert into public.kitchen_staff_code (id, code)
values (1, 'NAMA-STAFF-2026') -- <- the staff code
on conflict (id) do update set code = excluded.code;

alter table public.kitchen_members enable row level security;
alter table public.kitchen_staff_code enable row level security;
revoke all on public.kitchen_members, public.kitchen_staff_code from anon, authenticated;

-- ---------- Pickups made by Nama staff ----------

alter table public.kitchen_pickups
  add column if not exists branch_id smallint references public.kitchen_branches (id),
  add column if not exists reason text check (reason is null or char_length(reason) between 3 and 200);

-- ---------- Helpers ----------

-- The logged-in person's side: 'restaurant', 'staff', or null.
create or replace function public.kitchen_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select kind from public.kitchen_members where user_id = auth.uid();
$$;

-- Stops the calling function unless the logged-in person is one of the given kinds.
create or replace function public.kitchen_require(p_kinds text[])
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.kitchen_members where user_id = auth.uid() and kind = any (p_kinds)
  ) then
    raise exception 'NOT_ALLOWED';
  end if;
end;
$$;

-- Checked on the staff sign-up form before the account is made, so a wrong code doesn't
-- leave an account behind. Wrong guesses are slowed down.
create or replace function public.kitchen_check_staff_code(p_code text)
returns boolean
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  good boolean := p_code is not null
    and upper(trim(p_code)) = upper((select code from public.kitchen_staff_code where id = 1));
begin
  if not good then
    perform pg_sleep(0.5);
  end if;
  return good;
end;
$$;

-- Called right after sign-up (or at the first login). Records which side the account is on.
-- An account keeps its side: calling again returns the side it already has.
create or replace function public.kitchen_join(p_kind text, p_company text, p_code text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  current_kind text;
  clean_company text := nullif(trim(coalesce(p_company, '')), '');
begin
  if uid is null then
    raise exception 'NOT_SIGNED_IN';
  end if;
  select kind into current_kind from public.kitchen_members where user_id = uid;
  if current_kind is not null then
    return current_kind;
  end if;

  if p_kind = 'staff' then
    if p_code is null or upper(trim(p_code)) <> upper((select code from public.kitchen_staff_code where id = 1)) then
      raise exception 'BAD_CODE';
    end if;
    clean_company := 'Nama';
  elsif p_kind = 'restaurant' then
    if clean_company is null or char_length(clean_company) > 80 then
      raise exception 'BAD_COMPANY';
    end if;
  else
    raise exception 'BAD_KIND';
  end if;

  insert into public.kitchen_members (user_id, kind, company) values (uid, p_kind, clean_company);
  return p_kind;
end;
$$;

-- ---------- Restaurant functions, now for members only ----------

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
      'openRequest', (select max(requested_at) from public.kitchen_pickup_requests)
    )
    from public.kitchen_settings s
    where s.id = 1
  );
end;
$$;

create or replace function public.kitchen_log_bin(p_branch_id integer, p_waste_type text, p_weight_kg numeric)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id bigint;
begin
  perform public.kitchen_require(array['restaurant']);
  if not exists (select 1 from public.kitchen_branches where id = p_branch_id) then
    raise exception 'BAD_BRANCH';
  end if;
  if p_waste_type is null or p_waste_type not in ('prep', 'spoilage', 'plate') then
    raise exception 'BAD_TYPE';
  end if;
  if p_weight_kg is null or p_weight_kg < 0.1 or p_weight_kg > 60 then
    raise exception 'BAD_WEIGHT';
  end if;
  if (select count(*) from public.kitchen_bin_logs where not is_sample and logged_at > now() - interval '1 hour') >= 60 then
    raise exception 'TOO_MANY';
  end if;

  insert into public.kitchen_bin_logs (branch_id, waste_type, weight_kg)
  values (p_branch_id, p_waste_type, round(p_weight_kg, 1))
  returning id into new_id;
  return new_id;
end;
$$;

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
  perform public.kitchen_require(array['restaurant']);
  select max(requested_at) into existing from public.kitchen_pickup_requests;
  if existing is not null then
    return existing;
  end if;
  insert into public.kitchen_pickup_requests default values returning requested_at into created;
  return created;
end;
$$;

-- Back to the 15 sample logs (AED 7,480): also removes pickups Nama staff recorded.
create or replace function public.kitchen_reset_demo()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.kitchen_require(array['restaurant']);
  delete from public.kitchen_bin_logs where not is_sample;
  delete from public.kitchen_pickups where not is_sample;
  delete from public.kitchen_pickup_requests where true;
end;
$$;

-- ---------- Nama staff functions ----------

-- Today's route: one stop per branch with what the kitchen logged today, whether it has
-- been collected today, the open pickup request, and the latest collections.
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

-- Nama staff record one collection at a branch: truck-scale weight and contamination grade.
-- Grade C (mixed) needs a reason. When every branch has been collected since the open
-- pickup request, the request is closed. Returns the new pickup's id.
create or replace function public.kitchen_collect(p_branch_id integer, p_kg numeric, p_grade text, p_reason text)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id bigint;
  clean_reason text := nullif(trim(coalesce(p_reason, '')), '');
  requested timestamptz;
begin
  perform public.kitchen_require(array['staff']);
  if not exists (select 1 from public.kitchen_branches where id = p_branch_id) then
    raise exception 'BAD_BRANCH';
  end if;
  if p_kg is null or p_kg < 0.1 or p_kg > 500 then
    raise exception 'BAD_WEIGHT';
  end if;
  if p_grade is null or p_grade not in ('A', 'B', 'C') then
    raise exception 'BAD_GRADE';
  end if;
  if p_grade = 'C' and (clean_reason is null or char_length(clean_reason) < 3) then
    raise exception 'NEED_REASON';
  end if;
  if clean_reason is not null and char_length(clean_reason) > 200 then
    raise exception 'BAD_REASON';
  end if;
  if exists (select 1 from public.kitchen_pickups
             where branch_id = p_branch_id and collected_at >= public.dubai_day_start()) then
    raise exception 'ALREADY_COLLECTED';
  end if;

  insert into public.kitchen_pickups (collected_kg, collected_at, grade, collected_by, branch_id, reason)
  values (round(p_kg, 1), now(), p_grade, 'Nama staff', p_branch_id,
          case when clean_reason is not null and char_length(clean_reason) >= 3 then clean_reason end)
  returning id into new_id;

  select min(requested_at) into requested from public.kitchen_pickup_requests;
  if requested is not null and not exists (
    select 1 from public.kitchen_branches b
    where not exists (select 1 from public.kitchen_pickups p
                      where p.branch_id = b.id and p.collected_at >= requested)
  ) then
    delete from public.kitchen_pickup_requests where true;
  end if;
  return new_id;
end;
$$;

-- ---------- Who may call what ----------
-- Supabase gives new functions to everyone by default, so take that away first.

revoke all on function public.kitchen_my_role() from public, anon, authenticated;
revoke all on function public.kitchen_require(text[]) from public, anon, authenticated;
revoke all on function public.kitchen_check_staff_code(text) from public, anon, authenticated;
revoke all on function public.kitchen_join(text, text, text) from public, anon, authenticated;
revoke all on function public.kitchen_dashboard() from public, anon, authenticated;
revoke all on function public.kitchen_log_bin(integer, text, numeric) from public, anon, authenticated;
revoke all on function public.kitchen_request_pickup() from public, anon, authenticated;
revoke all on function public.kitchen_reset_demo() from public, anon, authenticated;
revoke all on function public.kitchen_staff_route() from public, anon, authenticated;
revoke all on function public.kitchen_collect(integer, numeric, text, text) from public, anon, authenticated;

grant execute on function public.kitchen_my_role() to authenticated;
grant execute on function public.kitchen_check_staff_code(text) to anon, authenticated;
grant execute on function public.kitchen_join(text, text, text) to authenticated;
grant execute on function public.kitchen_dashboard() to authenticated;
grant execute on function public.kitchen_log_bin(integer, text, numeric) to authenticated;
grant execute on function public.kitchen_request_pickup() to authenticated;
grant execute on function public.kitchen_reset_demo() to authenticated;
grant execute on function public.kitchen_staff_route() to authenticated;
grant execute on function public.kitchen_collect(integer, numeric, text, text) to authenticated;
