-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Food entries table
create table food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  name text not null,
  calories real,
  protein real,
  timestamp bigint not null,
  created_at timestamptz default now()
);

-- Weights table
create table weights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null unique,
  weight real not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Enable Row Level Security
alter table food_entries enable row level security;
alter table weights enable row level security;

-- Policies: users can only see/modify their own data
create policy "Users can view own entries" on food_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert own entries" on food_entries
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own entries" on food_entries
  for delete using (auth.uid() = user_id);

create policy "Users can view own weights" on weights
  for select using (auth.uid() = user_id);

create policy "Users can insert own weights" on weights
  for insert with check (auth.uid() = user_id);

create policy "Users can update own weights" on weights
  for update using (auth.uid() = user_id);

-- Indexes for fast lookups
create index idx_food_entries_user_date on food_entries(user_id, date);
create index idx_weights_user_date on weights(user_id, date);
