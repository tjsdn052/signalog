export type RawTrendItem = {
  source: string;
  sourceType: "rss" | "github" | "hacker-news" | "reddit";
  url: string;
  title: string;
  excerpt?: string;
  rawPayload?: Record<string, unknown>;
  publishedAt?: string;
  score?: number;
};

export type TrendCollector = () => Promise<RawTrendItem[]>;
