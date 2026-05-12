alter table public.raw_items
add column if not exists raw_payload jsonb;

alter table public.posts
add column if not exists ai_summary text;

update public.posts
set ai_summary = summary
where ai_summary is null;
