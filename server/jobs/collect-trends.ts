import { collectGithubTrendingItems } from "../collectors/github-trending";
import { collectHackerNewsItems } from "../collectors/hacker-news";
import { collectRedditItems } from "../collectors/reddit";
import { collectDevToItems } from "../collectors/dev-to";
import type { RawTrendItem } from "../collectors/types";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { prepareDraftPost } from "../ai/prepare-draft";
import { selectDraftCandidatesWithAI } from "../ai/select-candidates";
import type { DraftTrendPost } from "../ai/types";
import { persistCollection } from "../repositories/collection-storage";
import { dedupeRawItems } from "../repositories/raw-items";
import { listExistingPostSourceStatuses } from "../repositories/posts";
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
  const results = await Promise.allSettled([
    collectRedditItems(),
    collectGithubTrendingItems(),
    collectHackerNewsItems(),
    collectDevToItems(),
  ]);

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

function rankRawItems(items: RawTrendItem[]) {
  return [...items].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

async function getDraftCandidates(items: RawTrendItem[], canPersist: boolean) {
  if (!canPersist) {
    return items.slice(0, MAX_DRAFT_POSTS_PER_RUN);
  }

  const existingPostStatuses = await listExistingPostSourceStatuses(items.map((item) => item.url));
  const publishedSourceUrls = new Set(
    existingPostStatuses.filter((post) => post.status === "published").map((post) => post.sourceUrl),
  );

  const newOrDraftItems = items.filter((item) => !publishedSourceUrls.has(item.url));

  return selectDraftCandidatesWithAI(newOrDraftItems, MAX_DRAFT_POSTS_PER_RUN);
}

export async function collectTrends(): Promise<CollectTrendsResult> {
  const collectedAt = new Date().toISOString();
  const runId = `collect-${Date.now()}`;
  const rawItems = rankRawItems(dedupeRawItems(await collectRawTrendItems()));
  const canPersist = isSupabaseAdminConfigured();
  const draftCandidates = await getDraftCandidates(rawItems, canPersist);
  const draftPosts = await mapWithConcurrency(draftCandidates, DRAFT_GENERATION_CONCURRENCY, prepareDraftPost);
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
