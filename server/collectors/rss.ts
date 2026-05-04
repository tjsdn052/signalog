import type { RawTrendItem } from "./types";

export async function collectRssItems(): Promise<RawTrendItem[]> {
  return [
    {
      source: "AI Engineering Weekly",
      sourceType: "rss",
      url: "https://example.com/agentic-ai-product-workflows",
      title: "Agentic AI workflows are becoming product infrastructure",
      excerpt: "Teams are moving from chat assistants to workflow agents that plan, execute, and verify tasks.",
      publishedAt: "2026-05-04",
      score: 91,
    },
  ];
}
