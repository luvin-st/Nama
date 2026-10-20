-- Feature 5: staff verification.
-- Drops can only be changed through verify_deposit() and reject_deposit().
-- Points are always worked out here (20 per kg), never typed in by hand.

alter table public.deposits
  add column if not exists reject_reason text
  check (reject_reason is null or char_length(reject_reason) between 1 and 120);

-- Nobody edits drops directly any more, staff included.
drop policy if exists "Staff update deposits" on public.deposits;
revoke update on public.deposits from authenticated, anon;

create or replace function public.verify_deposit(p_id uuid, p_weight numeric)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deposits;
  pts integer;
begin
  if not public.is_staff() then
    raise exception 'NOT_STAFF';
  end if;
  if p_weight is null or p_weight < 0.05 or p_weight > 50 then
    raise exception 'BAD_WEIGHT';
  end if;

  select * into d from public.deposits where id = p_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if d.user_id = auth.uid() then
    raise exception 'OWN_DROP';
  end if;
  if d.status <> 'pending' then
    raise exception 'NOT_PENDING';
  end if;

  pts := round(round(p_weight, 2) * 20)::integer;

  update public.deposits
     set status = 'verified',
         weight_kg = round(p_weight, 2),
         points = pts,
         verified_at = now(),
         verified_by = auth.uid(),
         reject_reason = null
   where id = p_id;

  return pts;
end;
$$;

create or replace function public.reject_deposit(p_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.deposits;
  reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if not public.is_staff() then
    raise exception 'NOT_STAFF';
  end if;
  if reason is null or char_length(reason) > 120 then
    raise exception 'BAD_REASON';
  end if;

  select * into d from public.deposits where id = p_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if d.user_id = auth.uid() then
    raise exception 'OWN_DROP';
  end if;
  if d.status <> 'pending' then
    raise exception 'NOT_PENDING';
  end if;

  update public.deposits
     set status = 'rejected',
         points = 0,
         verified_at = now(),
         verified_by = auth.uid(),
         reject_reason = reason
   where id = p_id;
end;
$$;

revoke all on function public.verify_deposit(uuid, numeric) from public, anon;
revoke all on function public.reject_deposit(uuid, text) from public, anon;
grant execute on function public.verify_deposit(uuid, numeric) to authenticated;
grant execute on function public.reject_deposit(uuid, text) to authenticated;
