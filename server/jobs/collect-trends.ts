import { collectGithubTrendingItems } from "../collectors/github-trending";
import { collectRedditItems } from "../collectors/reddit";
import type { RawTrendItem } from "../collectors/types";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { prepareDraftPost } from "../ai/prepare-draft";
import type { DraftTrendPost } from "../ai/types";
import { persistCollection } from "../repositories/collection-storage";
import { dedupeRawItems } from "../repositories/raw-items";
import { mapWithConcurrency } from "../utils/concurrency";

const MAX_DRAFT_POSTS_PER_RUN = 10;
const DRAFT_GENERATION_CONCURRENCY = 3;

export type CollectTrendsResult = {
  runId: string;
  collectedAt: string;
  persisted: boolean;
  collectionRunId?: string;
  rawCount: number;
  draftCount: number;
  rawItems: RawTrendItem[];
  draftPosts: DraftTrendPost[];
};

async function collectRawTrendItems() {
  const results = await Promise.allSettled([collectRedditItems(), collectGithubTrendingItems()]);

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function rankRawItems(items: RawTrendItem[]) {
  return [...items].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

export async function collectTrends(): Promise<CollectTrendsResult> {
  const collectedAt = new Date().toISOString();
  const runId = `collect-${Date.now()}`;
  const rawItems = rankRawItems(dedupeRawItems(await collectRawTrendItems()));
  const draftCandidates = rawItems.slice(0, MAX_DRAFT_POSTS_PER_RUN);
  const draftPosts = await mapWithConcurrency(draftCandidates, DRAFT_GENERATION_CONCURRENCY, prepareDraftPost);
  const canPersist = isSupabaseAdminConfigured();
  const collectionRunId = canPersist
    ? await persistCollection({
        runKey: runId,
        collectedAt,
        rawItems,
        draftPosts,
      })
    : undefined;

  return {
    runId,
    collectedAt,
    persisted: canPersist,
    collectionRunId,
    rawCount: rawItems.length,
    draftCount: draftPosts.length,
    rawItems,
    draftPosts,
  };
}
