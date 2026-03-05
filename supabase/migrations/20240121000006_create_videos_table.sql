-- Create videos table
create table if not exists public.videos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  url text not null, -- YouTube URL or similar
  thumbnail_url text,
  category_id uuid references public.categories(id),
  service_id uuid references public.services(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.videos enable row level security;

-- Policies
create policy "Videos are viewable by all agency users" on public.videos
  for select using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
    )
  );

create policy "Admins can manage videos" on public.videos
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
