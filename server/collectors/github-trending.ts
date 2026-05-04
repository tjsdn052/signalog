import type { RawTrendItem } from "./types";

export async function collectGithubTrendingItems(): Promise<RawTrendItem[]> {
  return [
    {
      source: "GitHub Trending",
      sourceType: "github",
      url: "https://example.com/open-source-agent-runtime",
      title: "Open source agent runtimes gain traction",
      excerpt: "Agent runtime projects are adding tool calls, memory, and evaluation primitives.",
      publishedAt: "2026-05-04",
      score: 84,
    },
  ];
}
