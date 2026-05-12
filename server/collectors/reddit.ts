import type { RawTrendItem } from "./types";

const SUBREDDITS = ["LocalLLaMA", "programming", "reactjs", "nextjs", "MachineLearning"] as const;
const REDDIT_USER_AGENT = "SignalogTrendCollector/0.1";
const REDDIT_POST_LIMIT = 10;
const MAX_EXCERPT_LENGTH = 240;

type RedditListing = {
  data?: {
    children?: Array<{
      data?: RedditPost;
    }>;
  };
};

type RedditPost = {
  title?: string;
  url?: string;
  permalink?: string;
  selftext?: string;
  created_utc?: number;
  score?: number;
  num_comments?: number;
  stickied?: boolean;
  over_18?: boolean;
  removed_by_category?: string | null;
};

function getRedditPostUrl(post: RedditPost) {
  if (post.permalink) {
    return `https://www.reddit.com${post.permalink}`;
  }

  return post.url ?? "";
}

function getExcerpt(post: RedditPost) {
  const text = post.selftext?.replace(/\s+/g, " ").trim();

  if (!text) {
    return undefined;
  }

  return text.length > MAX_EXCERPT_LENGTH ? `${text.slice(0, MAX_EXCERPT_LENGTH).trim()}...` : text;
}

function getPublishedAt(post: RedditPost) {
  if (!post.created_utc) {
    return undefined;
  }

  return new Date(post.created_utc * 1000).toISOString();
}

function getSignalScore(post: RedditPost) {
  const upvotes = post.score ?? 0;
  const comments = post.num_comments ?? 0;

  return upvotes + comments * 3;
}

function isCollectablePost(post: RedditPost) {
  const title = post.title?.trim();
  const url = getRedditPostUrl(post);

  if (!title || !url) {
    return false;
  }

  if (post.stickied || post.over_18 || post.removed_by_category) {
    return false;
  }

  return !["[deleted]", "[removed]"].includes(title.toLowerCase());
}

async function collectSubredditHotItems(subreddit: string): Promise<RawTrendItem[]> {
  const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${REDDIT_POST_LIMIT}`, {
    headers: {
      "User-Agent": REDDIT_USER_AGENT,
      Accept: "application/json",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit ${subreddit} returned ${response.status}`);
  }

  const listing = (await response.json()) as RedditListing;

  return (listing.data?.children ?? [])
    .map((child) => child.data)
    .filter((post): post is RedditPost => Boolean(post))
    .filter(isCollectablePost)
    .map((post) => ({
      source: `Reddit r/${subreddit}`,
      sourceType: "reddit",
      url: getRedditPostUrl(post),
      title: post.title?.trim() ?? "",
      excerpt: getExcerpt(post),
      publishedAt: getPublishedAt(post),
      score: getSignalScore(post),
    }));
}

export async function collectRedditItems(): Promise<RawTrendItem[]> {
  const results = await Promise.allSettled(SUBREDDITS.map((subreddit) => collectSubredditHotItems(subreddit)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}
