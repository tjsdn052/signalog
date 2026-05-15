import type { RawTrendItem } from "./types";
import { normalizeSourceUrl } from "./url";

const HACKER_NEWS_API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const HACKER_NEWS_ITEM_LIMIT = 30;
const HACKER_NEWS_COMMENT_LIMIT = 5;
const MAX_TEXT_LENGTH = 700;
const MAX_COMMENT_LENGTH = 180;

type HackerNewsItem = {
  id?: number;
  by?: string;
  time?: number;
  type?: string;
  title?: string;
  text?: string;
  url?: string;
  score?: number;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
};

function stripHtml(value?: string) {
  return value
    ?.replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

async function fetchHackerNewsJson<T>(path: string): Promise<T> {
  const response = await fetch(`${HACKER_NEWS_API_BASE_URL}${path}`, {
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`Hacker News ${path} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchItem(id: number) {
  return fetchHackerNewsJson<HackerNewsItem | null>(`/item/${id}.json`);
}

function getPublishedAt(item: HackerNewsItem) {
  return item.time ? new Date(item.time * 1000).toISOString() : undefined;
}

function isCollectableStory(item: HackerNewsItem | null): item is HackerNewsItem {
  return Boolean(item?.id && item.type === "story" && item.title && !item.deleted && !item.dead);
}

function getStoryUrl(item: HackerNewsItem) {
  return normalizeSourceUrl(item.url || `https://news.ycombinator.com/item?id=${item.id}`);
}

function getHackerNewsDiscussionUrl(item: HackerNewsItem) {
  return `https://news.ycombinator.com/item?id=${item.id}`;
}

async function collectTopComments(item: HackerNewsItem) {
  const commentIds = item.kids?.slice(0, HACKER_NEWS_COMMENT_LIMIT) ?? [];
  const results = await Promise.allSettled(commentIds.map(fetchItem));

  return results
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
    .filter((comment): comment is HackerNewsItem => Boolean(comment && !comment.deleted && !comment.dead && comment.text))
    .map((comment) => {
      const text = stripHtml(comment.text) ?? "";
      return `- ${truncateText(text, MAX_COMMENT_LENGTH)}`;
    });
}

function getSignalScore(item: HackerNewsItem) {
  return (item.score ?? 0) + (item.descendants ?? 0) * 2;
}

async function toRawTrendItem(item: HackerNewsItem): Promise<RawTrendItem> {
  const comments = await collectTopComments(item);
  const storyText = stripHtml(item.text);
  const excerpt = [
    storyText ? `본문: ${truncateText(storyText, MAX_TEXT_LENGTH)}` : undefined,
    comments.length > 0 ? `상위 댓글:\n${comments.join("\n")}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    source: "Hacker News",
    sourceType: "hacker-news",
    url: getStoryUrl(item),
    title: stripHtml(item.title) ?? "",
    excerpt: excerpt || undefined,
    rawPayload: {
      id: item.id,
      author: item.by,
      discussionUrl: getHackerNewsDiscussionUrl(item),
      score: item.score,
      commentsCount: item.descendants,
      comments,
    },
    publishedAt: getPublishedAt(item),
    score: getSignalScore(item),
  };
}

export async function collectHackerNewsItems(): Promise<RawTrendItem[]> {
  const storyIds = await fetchHackerNewsJson<number[]>("/topstories.json");
  const results = await Promise.allSettled(storyIds.slice(0, HACKER_NEWS_ITEM_LIMIT).map(fetchItem));
  const items = results
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []))
    .filter(isCollectableStory);
  const rawItems = await Promise.allSettled(items.map(toRawTrendItem));

  return rawItems.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}
