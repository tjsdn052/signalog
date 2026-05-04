# Supabase Setup

Signalog MVP uses Supabase for collected raw items, AI draft posts, tags, and run logs.

## Required Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
COLLECT_JOB_SECRET=
```

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Browser-safe anon key for Supabase Auth.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only key used by collection jobs. Never expose this to client components.
- `COLLECT_JOB_SECRET`: Optional bearer token for `/api/jobs/collect`.

## Schema

Run `supabase/schema.sql` in the Supabase SQL editor.

If the project was created with "Automatically expose new tables and functions" disabled, run `supabase/grants.sql` after the schema. This grants the server `service_role` permission to write collection data while keeping public reads limited by RLS policies.

The initial schema includes:

- `sources`
- `collection_runs`
- `raw_items`
- `posts`
- `tags`
- `post_tags`
- `ai_runs`

Rows are written with the service role key from the server job. Public reads are limited to `published` posts and related tags.
