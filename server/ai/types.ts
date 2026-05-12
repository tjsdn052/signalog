import type { RawTrendItem } from "../collectors/types";

export type DraftTrendPost = {
  sourceItem: RawTrendItem;
  title: string;
  excerpt: string;
  aiSummary: string;
  summary: string;
  contentMarkdown: string;
  category: string;
  tags: string[];
  signalScore: number;
  status: "draft";
};
