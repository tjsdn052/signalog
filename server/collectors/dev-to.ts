import type { RawTrendItem } from "./types";
import { normalizeSourceUrl } from "./url";

const DEV_TO_USER_AGENT = "SignalogTrendCollector/0.1";
const DEV_TO_PER_PAGE = 12;
const DEV_TO_TAGS = ["ai", "javascript", "typescript", "react", "webdev", "opensource"] as const;

type DevToArticle = {
  id?: number;
  title?: string;
  description?: string;
  url?: string;
  canonical_url?: string;
  published_at?: string;
  tag_list?: string[];
  comments_count?: number;
  public_reactions_count?: number;
  positive_reactions_count?: number;
  reading_time_minutes?: number;
  user?: {
    name?: string;
    username?: string;
  };
  organization?: {
    name?: string;
    username?: string;
  };
};

async function fetchDevToArticles(tag: string): Promise<DevToArticle[]> {
  const params = new URLSearchParams({
    tag,
    top: "7",
    per_page: String(DEV_TO_PER_PAGE),
  });
  const response = await fetch(`https://dev.to/api/articles?${params.toString()}`, {
    headers: {
      "User-Agent": DEV_TO_USER_AGENT,
      Accept: "application/json",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`DEV.to ${tag} returned ${response.status}`);
  }

  return response.json() as Promise<DevToArticle[]>;
}

function getArticleUrl(article: DevToArticle) {
  return normalizeSourceUrl(article.canonical_url || article.url || "");
}

function getSignalScore(article: DevToArticle) {
  const reactions = article.public_reactions_count ?? article.positive_reactions_count ?? 0;
  const comments = article.comments_count ?? 0;

  return reactions + comments * 3;
}

function toRawTrendItem(tag: string, article: DevToArticle): RawTrendItem | null {
  const url = getArticleUrl(article);
  const title = article.title?.trim();

  if (!url || !title) {
    return null;
  }

  return {
    source: `DEV Community #${tag}`,
    sourceType: "dev-to",
    url,
    title,
    excerpt: article.description?.trim() || undefined,
    rawPayload: {
      id: article.id,
      devToUrl: article.url,
      canonicalUrl: article.canonical_url,
      tags: article.tag_list,
      commentsCount: article.comments_count,
      reactionsCount: article.public_reactions_count ?? article.positive_reactions_count,
      readingTimeMinutes: article.reading_time_minutes,
      author: article.user,
      organization: article.organization,
    },
    publishedAt: article.published_at,
    score: getSignalScore(article),
  };
}

export async function collectDevToItems(): Promise<RawTrendItem[]> {
  const results = await Promise.allSettled(DEV_TO_TAGS.map(fetchDevToArticles));

  return results.flatMap((result, index) => {
    if (result.status !== "fulfilled") {
      return [];
    }

    const tag = DEV_TO_TAGS[index];

    return result.value
      .map((article) => toRawTrendItem(tag, article))
      .filter((item): item is RawTrendItem => Boolean(item));
  });
}
