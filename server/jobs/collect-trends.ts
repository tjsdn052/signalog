import { collectGithubTrendingItems } from "../collectors/github-trending";
import { collectHackerNewsItems } from "../collectors/hacker-news";
import { collectRssItems } from "../collectors/rss";
import type { RawTrendItem } from "../collectors/types";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { prepareDraftPost } from "../ai/prepare-draft";
import type { DraftTrendPost } from "../ai/types";
import { persistCollection } from "../repositories/collection-storage";
import { dedupeRawItems } from "../repositories/raw-items";

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

export async function collectTrends(): Promise<CollectTrendsResult> {
  const collectedAt = new Date().toISOString();
  const runId = `collect-${Date.now()}`;
  const rawItems = dedupeRawItems([
    ...(await collectRssItems()),
    ...(await collectGithubTrendingItems()),
    ...(await collectHackerNewsItems()),
  ]);
  const draftPosts = rawItems.map((item) => prepareDraftPost(item));
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
