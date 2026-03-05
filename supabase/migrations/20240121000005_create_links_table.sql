-- Create links table
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  category text, -- e.g., 'SNS', 'Official', 'Partner'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.links enable row level security;

-- Policies
-- Select: Admin & Agent & Guest
create policy "Links are viewable by all agency users" on public.links
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
    )
  );

-- Insert/Update/Delete: Admin only
create policy "Admins can insert links" on public.links
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can update links" on public.links
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can delete links" on public.links
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
