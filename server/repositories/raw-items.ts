import type { RawTrendItem } from "../collectors/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeSourceUrl } from "../collectors/url";

export function dedupeRawItems(items: RawTrendItem[]) {
  const seenUrls = new Set<string>();

  return items.filter((item) => {
    const normalizedUrl = normalizeSourceUrl(item.url);

    if (seenUrls.has(normalizedUrl)) {
      return false;
    }

    item.url = normalizedUrl;
    seenUrls.add(normalizedUrl);
    return true;
  });
}

type SaveRawItemInput = {
  item: RawTrendItem;
  sourceId: string;
  collectionRunId: string;
};

export async function saveRawItem(input: SaveRawItemInput) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("raw_items")
    .upsert(
      {
        source_id: input.sourceId,
        collection_run_id: input.collectionRunId,
        source_name: input.item.source,
        source_type: input.item.sourceType,
        url: input.item.url,
        title: input.item.title,
        excerpt: input.item.excerpt,
        raw_payload: input.item.rawPayload ?? null,
        published_at: input.item.publishedAt,
        score: input.item.score,
        status: "drafted",
      },
      {
        onConflict: "url",
      },
    )
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}
