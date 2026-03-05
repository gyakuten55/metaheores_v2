-- Add file support to videos table
alter table public.videos 
add column if not exists file_url text,
add column if not exists file_type text;

-- Make url column optional since a video can now be an uploaded file
alter table public.videos 
alter column url drop not null;
