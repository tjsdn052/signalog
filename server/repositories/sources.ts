import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { RawTrendItem } from "../collectors/types";

export async function upsertSource(item: RawTrendItem) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("sources")
    .upsert(
      {
        name: item.source,
        type: item.sourceType,
        enabled: true,
      },
      {
        onConflict: "name,type",
      },
    )
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}
