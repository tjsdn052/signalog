import type { RawTrendItem } from "../collectors/types";
import { classifyTrendItem } from "./classify";
import type { DraftTrendPost } from "./types";
import { summarizeTrendItem } from "./summarize";
import { translateTrendTitle } from "./translate";

export function prepareFallbackDraftPost(item: RawTrendItem): DraftTrendPost {
  const classification = classifyTrendItem(item);
  const signalScore = Math.min(100, Math.max(0, item.score ?? 50));
  const summary = summarizeTrendItem(item);

  return {
    sourceItem: item,
    title: translateTrendTitle(item),
    excerpt: summary,
    aiSummary: summary,
    summary,
    contentMarkdown: summary,
    category: classification.category,
    tags: classification.tags,
    signalScore,
    status: "draft",
  };
}
