import type { RawTrendItem } from "../collectors/types";

export type DraftTrendPost = {
  sourceItem: RawTrendItem;
  title: string;
  excerpt: string;
  summary: string;
  category: string;
  tags: string[];
  signalScore: number;
  status: "draft";
};
