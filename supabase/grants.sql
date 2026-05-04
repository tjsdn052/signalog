grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;

grant select on public.profiles to authenticated;
grant select on public.posts to anon, authenticated;
grant select on public.tags to anon, authenticated;
grant select on public.post_tags to anon, authenticated;
