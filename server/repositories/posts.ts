import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabasePublic } from "@/lib/supabase/public";
import type { SignalPost } from "@/app/lib/posts";
import type { DraftTrendPost } from "../ai/types";
import { createSlug } from "../utils/slug";

export type AdminPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  signalScore: number;
  status: string;
  sourceUrl: string;
  createdAt: string;
};

export type PublishedPost = {
  id: string;
  slug: string;
};

export type PublishedPostList = {
  posts: SignalPost[];
  total: number;
};

type SaveDraftPostInput = {
  draft: DraftTrendPost;
  rawItemId: string;
};

type PublishedPostRow = {
  slug: string;
  title: string;
  excerpt: string;
  summary: string;
  source_url: string;
  category: string;
  signal_score: number;
  published_at: string | null;
  created_at: string;
  post_tags?: Array<{
    tags?: {
      name?: string | null;
    } | null;
  }>;
};

async function upsertTag(name: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tags")
    .upsert(
      {
        name,
        slug: createSlug(name),
      },
      {
        onConflict: "name",
      },
    )
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

export async function saveDraftPost(input: SaveDraftPostInput) {
  const supabase = getSupabaseAdmin();
  const slug = createSlug(input.draft.title);
  const { data, error } = await supabase
    .from("posts")
    .upsert(
      {
        raw_item_id: input.rawItemId,
        slug,
        title: input.draft.title,
        excerpt: input.draft.excerpt,
        summary: input.draft.summary,
        source_url: input.draft.sourceItem.url,
        category: input.draft.category,
        signal_score: input.draft.signalScore,
        status: "draft",
      },
      {
        onConflict: "slug",
      },
    )
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  const postId = data.id as string;
  const tagIds = await Promise.all(input.draft.tags.map((tag) => upsertTag(tag)));

  if (tagIds.length > 0) {
    const { error: tagError } = await supabase
      .from("post_tags")
      .upsert(tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId })));

    if (tagError) {
      throw tagError;
    }
  }

  return postId;
}

export async function listAdminPosts(status = "draft"): Promise<AdminPostListItem[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, category, signal_score, status, source_url, created_at")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((post) => ({
    id: post.id as string,
    slug: post.slug as string,
    title: post.title as string,
    excerpt: post.excerpt as string,
    category: post.category as string,
    signalScore: post.signal_score as number,
    status: post.status as string,
    sourceUrl: post.source_url as string,
    createdAt: post.created_at as string,
  }));
}

export async function publishPost(postId: string): Promise<PublishedPost> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: now,
      updated_at: now,
    })
    .eq("id", postId)
    .eq("status", "draft")
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id as string,
    slug: data.slug as string,
  };
}

function getSourceName(sourceUrl: string) {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "원문";
  }
}

function getReadingMinutes(post: Pick<PublishedPostRow, "excerpt" | "summary">) {
  const characters = `${post.excerpt} ${post.summary}`.length;
  return Math.max(3, Math.ceil(characters / 450));
}

function formatPublishedDate(post: Pick<PublishedPostRow, "published_at" | "created_at">) {
  return (post.published_at ?? post.created_at).slice(0, 10);
}

function mapPublishedPost(post: PublishedPostRow): SignalPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    summary: post.summary,
    source: getSourceName(post.source_url),
    sourceUrl: post.source_url,
    publishedAt: formatPublishedDate(post),
    readingMinutes: getReadingMinutes(post),
    category: post.category,
    tags: (post.post_tags ?? [])
      .map((postTag) => postTag.tags?.name)
      .filter((tag): tag is string => Boolean(tag)),
    signalScore: post.signal_score,
    body: [post.summary],
  };
}

function getPublishedPostSelect() {
  return `
    slug,
    title,
    excerpt,
    summary,
    source_url,
    category,
    signal_score,
    published_at,
    created_at,
    post_tags (
      tags (
        name
      )
    )
  `;
}

export async function listPublishedPosts({
  limit,
  offset = 0,
}: {
  limit: number;
  offset?: number;
}): Promise<PublishedPostList> {
  const supabase = getSupabasePublic();
  const { data, error, count } = await supabase
    .from("posts")
    .select(getPublishedPostSelect(), { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return {
    posts: ((data ?? []) as unknown as PublishedPostRow[]).map(mapPublishedPost),
    total: count ?? 0,
  };
}

export async function listFeaturedPublishedPosts(limit: number): Promise<SignalPost[]> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("posts")
    .select(getPublishedPostSelect())
    .eq("status", "published")
    .order("signal_score", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as PublishedPostRow[]).map(mapPublishedPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<SignalPost | null> {
  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("posts")
    .select(getPublishedPostSelect())
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapPublishedPost(data as unknown as PublishedPostRow) : null;
}
