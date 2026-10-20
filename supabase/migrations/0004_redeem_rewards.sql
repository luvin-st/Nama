-- Feature 6: rewards and redemption.
-- Vouchers are created only by redeem_reward() and marked used only by use_voucher().

alter table public.redemptions
  add column if not exists used_at timestamptz,
  add column if not exists used_by uuid references public.profiles (id);

-- Nobody writes vouchers directly; the functions below do it safely.
revoke insert, update, delete on public.redemptions from authenticated, anon;

-- Random code like NAMA-7KQ4-X2PB (no 0/O/1/I, so it's easy to read out).
create or replace function public.new_voucher_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  bytes bytea := uuid_send(gen_random_uuid());
  out text := '';
begin
  for i in 0..7 loop
    out := out || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return 'NAMA-' || substr(out, 1, 4) || '-' || substr(out, 5, 4);
end;
$$;

create or replace function public.redeem_reward(p_reward uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  r public.rewards;
  balance integer;
  new_id uuid;
begin
  if uid is null then
    raise exception 'NOT_SIGNED_IN';
  end if;

  -- Lock this resident's row so two quick taps can't spend the same points twice.
  perform 1 from public.profiles where id = uid for update;

  select * into r from public.rewards where id = p_reward and active;
  if not found then
    raise exception 'NO_REWARD';
  end if;

  select 50
       + coalesce((select sum(points) from public.deposits where user_id = uid and status = 'verified'), 0)
       - coalesce((select sum(points_spent) from public.redemptions where user_id = uid), 0)
    into balance;

  if balance < r.points_cost then
    raise exception 'NOT_ENOUGH:%', r.points_cost - balance;
  end if;

  loop
    begin
      insert into public.redemptions (user_id, reward_id, code, points_spent)
      values (uid, r.id, public.new_voucher_code(), r.points_cost)
      returning id into new_id;
      exit;
    exception when unique_violation then
      -- Same code drawn twice (very unlikely): try another.
    end;
  end loop;

  return new_id;
end;
$$;

create or replace function public.use_voucher(p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v public.redemptions;
begin
  if not public.is_staff() then
    raise exception 'NOT_STAFF';
  end if;

  select * into v from public.redemptions where code = upper(btrim(p_code)) for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if v.user_id = auth.uid() then
    raise exception 'OWN_VOUCHER';
  end if;
  if v.used_at is not null then
    raise exception 'ALREADY_USED';
  end if;

  update public.redemptions set used_at = now(), used_by = auth.uid() where id = v.id;
end;
$$;

revoke all on function public.new_voucher_code() from public, anon, authenticated;
revoke all on function public.redeem_reward(uuid) from public, anon;
revoke all on function public.use_voucher(text) from public, anon;
grant execute on function public.redeem_reward(uuid) to authenticated;
grant execute on function public.use_voucher(text) to authenticated;
