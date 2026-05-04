import { getSupabaseAdmin } from "@/lib/supabase/admin";

type CreateCollectionRunInput = {
  runKey: string;
  collectedAt: string;
};

type CompleteCollectionRunInput = {
  id: string;
  rawCount: number;
  draftCount: number;
};

export async function createCollectionRun(input: CreateCollectionRunInput) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("collection_runs")
    .insert({
      run_key: input.runKey,
      collected_at: input.collectedAt,
      status: "running",
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

export async function completeCollectionRun(input: CompleteCollectionRunInput) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("collection_runs")
    .update({
      raw_count: input.rawCount,
      draft_count: input.draftCount,
      status: "completed",
    })
    .eq("id", input.id);

  if (error) {
    throw error;
  }
}

export async function failCollectionRun(id: string, errorMessage: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("collection_runs")
    .update({
      status: "failed",
      error_message: errorMessage,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}
