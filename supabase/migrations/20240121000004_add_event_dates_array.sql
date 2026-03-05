-- Add event_dates array column
alter table public.events 
add column if not exists event_dates date[];

-- Migrate existing start_date to event_dates (as a single entry array)
update public.events 
set event_dates = array[start_date::date] 
where start_date is not null and event_dates is null;
