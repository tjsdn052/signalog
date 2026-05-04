export type RawTrendItem = {
  source: string;
  sourceType: "rss" | "github" | "hacker-news";
  url: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  score?: number;
};

export type TrendCollector = () => Promise<RawTrendItem[]>;
