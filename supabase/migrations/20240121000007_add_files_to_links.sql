-- Add file support to links table
alter table public.links 
add column if not exists file_url text,
add column if not exists file_type text;

-- Make url column optional since a link can now be just a file
alter table public.links 
alter column url drop not null;
