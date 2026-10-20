-- Feature 7: Impact tab.
-- Shared numbers come only from these functions, which return totals and short names,
-- never anyone's individual drops, email or flat. Only verified drops count.

alter table public.profiles
  add column if not exists show_on_leaderboard boolean not null default true;

-- Residents may change their own leaderboard choice (as well as name, building, flat).
grant update (show_on_leaderboard) on public.profiles to authenticated;

-- "Layla Hassan" -> "Layla H.", "Shaden" -> "Shaden"
create or replace function public.short_name(full_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when array_length(parts, 1) > 1 then parts[1] || ' ' || upper(left(parts[array_length(parts, 1)], 1)) || '.'
    else coalesce(parts[1], 'Resident')
  end
  from (select regexp_split_to_array(btrim(coalesce(full_name, '')), '\s+') as parts) p;
$$;

-- Start of this month in Dubai time.
create or replace function public.dubai_month_start()
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select date_trunc('month', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai';
$$;

-- Your own totals (runs with your permissions, so you only ever see your own rows).
create or replace function public.get_my_impact()
returns table (total_kg numeric, verified_drops integer, rewards_redeemed integer)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce((select sum(weight_kg) from public.deposits where user_id = auth.uid() and status = 'verified'), 0),
    (select count(*) from public.deposits where user_id = auth.uid() and status = 'verified')::integer,
    (select count(*) from public.redemptions where user_id = auth.uid())::integer;
$$;

-- Your building's totals.
create or replace function public.get_building_impact()
returns table (building_name text, month_kg numeric, total_kg numeric, residents integer, active_this_month integer)
language sql
stable
security definer
set search_path = ''
as $$
  with me as (select building_id from public.profiles where id = auth.uid()),
  drops as (
    select d.user_id, d.weight_kg, d.created_at
    from public.deposits d
    join public.bins b on b.id = d.bin_id
    where d.status = 'verified' and b.building_id = (select building_id from me)
  )
  select
    bl.name,
    coalesce((select sum(weight_kg) from drops where created_at >= public.dubai_month_start()), 0),
    coalesce((select sum(weight_kg) from drops), 0),
    (select count(*) from public.profiles where building_id = bl.id)::integer,
    (select count(distinct user_id) from drops where created_at >= public.dubai_month_start())::integer
  from public.buildings bl
  where bl.id = (select building_id from me);
$$;

-- All buildings, fairest first: kg per resident this month.
create or replace function public.get_building_ranking()
returns table (building_name text, residents integer, month_kg numeric, kg_per_resident numeric, is_mine boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with month_kg as (
    select b.building_id, sum(d.weight_kg) as kg
    from public.deposits d
    join public.bins b on b.id = d.bin_id
    where d.status = 'verified' and d.created_at >= public.dubai_month_start()
    group by b.building_id
  ),
  people as (
    select building_id, count(*) as n from public.profiles where building_id is not null group by building_id
  )
  select
    bl.name,
    coalesce(p.n, 0)::integer,
    coalesce(m.kg, 0),
    round(coalesce(m.kg, 0) / greatest(coalesce(p.n, 0), 1), 2),
    bl.id = (select building_id from public.profiles where id = auth.uid())
  from public.buildings bl
  left join month_kg m on m.building_id = bl.id
  left join people p on p.building_id = bl.id
  order by 4 desc, bl.name;
$$;

-- Top 10 neighbours in your building this month, plus your own row.
-- People who opted out are hidden from others; you always see yourself.
create or replace function public.get_neighbour_leaderboard()
returns table (rank integer, display_name text, month_kg numeric, is_me boolean, hidden boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with me as (select id, building_id from public.profiles where id = auth.uid()),
  totals as (
    select p.id, p.name, p.show_on_leaderboard,
           coalesce(sum(d.weight_kg) filter (where d.status = 'verified' and d.created_at >= public.dubai_month_start()), 0) as kg
    from public.profiles p
    left join public.deposits d on d.user_id = p.id
    where p.building_id = (select building_id from me)
    group by p.id
  ),
  visible as (
    select * from totals where id = (select id from me) or (show_on_leaderboard and kg > 0)
  ),
  ranked as (
    select rank() over (order by kg desc)::integer as rk, public.short_name(name) as nm, kg,
           id = (select id from me) as mine, not show_on_leaderboard as off
    from visible
  )
  select rk, nm, kg, mine, off
  from (select *, row_number() over (order by kg desc, nm) as pos from ranked) r
  where pos <= 10 or mine
  order by kg desc, nm;
$$;

revoke all on function public.get_building_impact() from public, anon;
revoke all on function public.get_building_ranking() from public, anon;
revoke all on function public.get_neighbour_leaderboard() from public, anon;
revoke all on function public.get_my_impact() from public, anon;
grant execute on function public.get_building_impact() to authenticated;
grant execute on function public.get_building_ranking() to authenticated;
grant execute on function public.get_neighbour_leaderboard() to authenticated;
grant execute on function public.get_my_impact() to authenticated;
