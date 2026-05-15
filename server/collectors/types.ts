export type RawTrendItem = {
  source: string;
  sourceType: "rss" | "github" | "hacker-news" | "reddit" | "dev-to";
  url: string;
  title: string;
  excerpt?: string;
  rawPayload?: Record<string, unknown>;
  publishedAt?: string;
  score?: number;
};

export type TrendCollector = () => Promise<RawTrendItem[]>;
