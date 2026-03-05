-- Users table extension (Profiles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('admin', 'agency_admin', 'agency_member', 'guest')),
  agency_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Content table for portal
create table public.agency_content (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  url text,
  description text,
  access_level text[], -- Array of roles allowed to view
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.agency_content enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for Content
create policy "Content viewable by allowed roles" on public.agency_content
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = any(agency_content.access_level)
    )
    or
    access_level @> ARRAY['guest']::text[] -- Guests can always see guest content
  );
