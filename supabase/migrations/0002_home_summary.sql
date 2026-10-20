-- Nama' Feature 3: numbers for the Home screen.
-- Run once in Supabase: SQL Editor → New query → paste this file → Run.

-- Points balance, weekly streak, this month's kg and pending drops for the signed-in resident.
-- security invoker: runs with the caller's permissions, so Row Level Security still applies.
create or replace function public.get_my_summary()
returns table (points integer, streak_weeks integer, month_kg numeric, pending_count integer)
language sql
stable
security invoker
set search_path = ''
as $$
  with
  me as (select auth.uid() as uid),
  mine as (
    select d.* from public.deposits d where d.user_id = (select uid from me)
  ),
  earned as (
    select coalesce(sum(points), 0) as p from mine where status = 'verified'
  ),
  spent as (
    select coalesce(sum(r.points_spent), 0) as s
    from public.redemptions r where r.user_id = (select uid from me)
  ),
  month_total as (
    select coalesce(sum(weight_kg), 0) as kg
    from mine
    where status = 'verified'
      and created_at >= (date_trunc('month', now() at time zone 'Asia/Dubai') at time zone 'Asia/Dubai')
  ),
  -- Weeks (Monday start, Dubai time) with at least one drop that wasn't rejected.
  weeks as (
    select distinct date_trunc('week', created_at at time zone 'Asia/Dubai')::date as wk
    from mine where status <> 'rejected'
  ),
  this_week as (
    select date_trunc('week', now() at time zone 'Asia/Dubai')::date as wk
  ),
  -- The streak survives until this week is over, so count from last week if needed.
  anchor as (
    select case
      when exists (select 1 from weeks where wk = (select wk from this_week)) then (select wk from this_week)
      else (select wk from this_week) - 7
    end as wk
  ),
  ranked as (
    select wk, row_number() over (order by wk desc) as rn
    from weeks where wk <= (select wk from anchor)
  ),
  streak as (
    select count(*) as n from ranked
    where wk = (select wk from anchor) - ((rn - 1) * 7)::integer
  )
  select
    (50 + (select p from earned) - (select s from spent))::integer as points,
    (select n from streak)::integer as streak_weeks,
    (select kg from month_total) as month_kg,
    (select count(*) from mine where status = 'pending')::integer as pending_count;
$$;

grant execute on function public.get_my_summary() to authenticated;
