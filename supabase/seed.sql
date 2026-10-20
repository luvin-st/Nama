-- Nama' pilot settings. Run after 0001_init.sql (SQL Editor → New query → Run).
-- Rename buildings, bin spots, pickup days and rewards to match your real pilot.
-- Safe to run more than once.

insert into public.buildings (name, pickup_day, bin_spot) values
  ('Tower A', 'Wednesday', 'Car park level'),
  ('Tower B', 'Thursday', 'Ground floor'),
  ('Palm Residence', 'Saturday', 'Lobby entrance')
on conflict (name) do update
  set pickup_day = excluded.pickup_day, bin_spot = excluded.bin_spot;

insert into public.bins (building_id, code, label)
select b.id, v.code, v.label
from (values
  ('Tower A', 'NAMA-A01', 'Bin 01'),
  ('Tower B', 'NAMA-B02', 'Bin 02'),
  ('Palm Residence', 'NAMA-P01', 'Bin 01')
) as v (building, code, label)
join public.buildings b on b.name = v.building
on conflict (code) do nothing;

insert into public.rewards (title, partner, category, points_cost) values
  ('Free coffee', 'Corner café', 'Cafés', 300),
  ('Free loaf of bread', 'Neighbourhood bakery', 'Bakery', 400),
  ('15% off fruit and veg', 'Local greengrocer', 'Grocery', 600),
  ('AED 10 off groceries', 'Partner supermarket', 'Grocery', 1000),
  ('AED 25 bakery voucher', 'Neighbourhood bakery', 'Bakery', 1400)
on conflict (title, partner) do update
  set category = excluded.category, points_cost = excluded.points_cost;
