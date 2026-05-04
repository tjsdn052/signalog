import type { RawTrendItem } from "./types";

export async function collectHackerNewsItems(): Promise<RawTrendItem[]> {
  return [
    {
      source: "Hacker News",
      sourceType: "hacker-news",
      url: "https://example.com/local-first-ai-discussion",
      title: "Local-first AI is becoming a practical product pattern",
      excerpt: "Developers discuss privacy, latency, and cost tradeoffs around local inference.",
      publishedAt: "2026-05-04",
      score: 78,
    },
  ];
}
