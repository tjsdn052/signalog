create extension if not exists pgcrypto;

create type public.source_type as enum ('rss', 'github', 'hacker-news');
create type public.raw_item_status as enum ('collected', 'drafted', 'discarded');
create type public.post_status as enum ('draft', 'published', 'archived');
create type public.ai_task_type as enum ('summarize', 'translate', 'classify', 'prepare-draft');
create type public.run_status as enum ('running', 'completed', 'failed');

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.source_type not null,
  url text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, type)
);

create table public.collection_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  status public.run_status not null default 'running',
  collected_at timestamptz not null default now(),
  raw_count integer not null default 0,
  draft_count integer not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);

create table public.raw_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  collection_run_id uuid references public.collection_runs(id) on delete set null,
  source_name text not null,
  source_type public.source_type not null,
  url text not null unique,
  title text not null,
  excerpt text,
  published_at timestamptz,
  score integer,
  status public.raw_item_status not null default 'collected',
  collected_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  raw_item_id uuid references public.raw_items(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  summary text not null,
  source_url text not null,
  category text not null,
  signal_score integer not null default 0,
  status public.post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  raw_item_id uuid references public.raw_items(id) on delete set null,
  post_id uuid references public.posts(id) on delete set null,
  task public.ai_task_type not null,
  model text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric(12, 6),
  status public.run_status not null default 'completed',
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.sources enable row level security;
alter table public.collection_runs enable row level security;
alter table public.raw_items enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.ai_runs enable row level security;

create policy "Published posts are readable" on public.posts
  for select
  using (status = 'published');

create policy "Tags are readable" on public.tags
  for select
  using (true);

create policy "Post tags are readable for published posts" on public.post_tags
  for select
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_tags.post_id
        and posts.status = 'published'
    )
  );
