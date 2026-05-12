import type { RawTrendItem } from "../collectors/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export function dedupeRawItems(items: RawTrendItem[]) {
  const seenUrls = new Set<string>();

  return items.filter((item) => {
    if (seenUrls.has(item.url)) {
      return false;
    }

    seenUrls.add(item.url);
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
