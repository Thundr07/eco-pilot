-- City metrics for dashboard
create table if not exists public.citydata (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  co2 numeric not null,
  aqi numeric not null,
  water_stress numeric not null,
  green_cover numeric not null,
  inserted_at timestamp with time zone default now()
);

-- Per-city industry baseline metrics for comparison
create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  name text not null,
  co2 numeric not null,
  water numeric not null,
  energy numeric not null,
  inserted_at timestamp with time zone default now()
);
create index if not exists idx_industries_city on public.industries(city);

-- EcoChat persistence
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);
create index if not exists idx_chat_history_user_created on public.chat_history(user_id, created_at desc);

-- Seed sample data
insert into public.citydata (city, co2, aqi, water_stress, green_cover)
values
  ('Chennai', 145.0, 78, 0.62, 18.5),
  ('Nagpur', 82.0, 65, 0.48, 22.0),
  ('Bengaluru', 110.0, 72, 0.55, 33.0)
on conflict do nothing;

insert into public.industries (city, name, co2, water, energy)
values
  ('Nagpur', 'Solar', 25, 30, 40),
  ('Nagpur', 'Cement', 115, 90, 140),
  ('Chennai', 'Textile', 95, 120, 130),
  ('Chennai', 'Electronics', 70, 60, 90)
on conflict do nothing;
