import { getSupabaseAdmin } from "@/lib/supabase/admin";
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

type SaveDraftPostInput = {
  draft: DraftTrendPost;
  rawItemId: string;
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
