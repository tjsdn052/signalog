# Supabase Setup

Signalog MVP uses Supabase for collected raw items, AI draft posts, tags, and run logs.

## Required Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
COLLECT_JOB_SECRET=
```

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only key used by collection jobs. Never expose this to client components.
- `COLLECT_JOB_SECRET`: Optional bearer token for `/api/jobs/collect`.

## Schema

Run `supabase/schema.sql` in the Supabase SQL editor.

The initial schema includes:

- `sources`
- `collection_runs`
- `raw_items`
- `posts`
- `tags`
- `post_tags`
- `ai_runs`

Rows are written with the service role key from the server job. Public reads are limited to `published` posts and related tags.
