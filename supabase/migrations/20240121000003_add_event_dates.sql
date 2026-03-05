-- Add start_date and end_date to events table
alter table public.events 
add column if not exists start_date timestamp with time zone,
add column if not exists end_date timestamp with time zone;

-- Update existing rows to have start_date same as created_at (as fallback)
update public.events set start_date = created_at where start_date is null;
