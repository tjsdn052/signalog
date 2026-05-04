import { collectGithubTrendingItems } from "../collectors/github-trending";
import { collectHackerNewsItems } from "../collectors/hacker-news";
import { collectRssItems } from "../collectors/rss";
import type { RawTrendItem } from "../collectors/types";
import { prepareDraftPost } from "../ai/prepare-draft";
import type { DraftTrendPost } from "../ai/types";
import { dedupeRawItems } from "../repositories/raw-items";

export type CollectTrendsResult = {
  runId: string;
  collectedAt: string;
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

  return {
    runId,
    collectedAt,
    rawCount: rawItems.length,
    draftCount: draftPosts.length,
    rawItems,
    draftPosts,
  };
}
