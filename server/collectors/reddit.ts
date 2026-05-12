import type { RawTrendItem } from "./types";

const SUBREDDITS = ["LocalLLaMA", "programming", "reactjs", "nextjs", "MachineLearning"] as const;
const REDDIT_USER_AGENT = "SignalogTrendCollector/0.1";
const REDDIT_POST_LIMIT = 10;
const MAX_EXCERPT_LENGTH = 240;
const MAX_COMMENT_COUNT = 5;
const MAX_COMMENT_LENGTH = 180;

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

type RedditComment = {
  body?: string;
  score?: number;
  stickied?: boolean;
  author?: string;
};

type RedditCommentListing = Array<{
  data?: {
    children?: Array<{
      kind?: string;
      data?: RedditComment;
    }>;
  };
}>;

function getRedditPostUrl(post: RedditPost) {
  if (post.permalink) {
    return `https://www.reddit.com${post.permalink}`;
  }

  return post.url ?? "";
}

function normalizeText(text?: string) {
  return text?.replace(/\s+/g, " ").trim();
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function getPostText(post: RedditPost) {
  const text = normalizeText(post.selftext);

  if (!text || ["[deleted]", "[removed]"].includes(text.toLowerCase())) {
    return undefined;
  }

  return truncateText(text, MAX_EXCERPT_LENGTH);
}

function isCollectableComment(comment: RedditComment) {
  const body = normalizeText(comment.body);

  if (!body || comment.stickied) {
    return false;
  }

  return !["[deleted]", "[removed]"].includes(body.toLowerCase());
}

function getCommentText(comment: RedditComment) {
  const body = normalizeText(comment.body);

  if (!body) {
    return "";
  }

  const score = typeof comment.score === "number" ? ` (${comment.score}점)` : "";

  return `- ${truncateText(body, MAX_COMMENT_LENGTH)}${score}`;
}

function getExcerpt(post: RedditPost, comments: RedditComment[]) {
  const postText = getPostText(post);
  const commentText = comments.map(getCommentText).filter(Boolean);

  if (!postText && commentText.length === 0) {
    return undefined;
  }

  return [
    postText ? `본문: ${postText}` : undefined,
    commentText.length > 0 ? `상위 댓글:\n${commentText.join("\n")}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");
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

async function collectTopComments(post: RedditPost): Promise<RedditComment[]> {
  const permalink = post.permalink;

  if (!permalink || (post.num_comments ?? 0) <= 0) {
    return [];
  }

  const response = await fetch(`https://www.reddit.com${permalink}.json?limit=${MAX_COMMENT_COUNT}&depth=1&sort=top`, {
    headers: {
      "User-Agent": REDDIT_USER_AGENT,
      Accept: "application/json",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    return [];
  }

  const listing = (await response.json()) as RedditCommentListing;
  const comments = listing[1]?.data?.children ?? [];

  return comments
    .filter((child) => child.kind === "t1")
    .map((child) => child.data)
    .filter((comment): comment is RedditComment => Boolean(comment))
    .filter(isCollectableComment)
    .slice(0, MAX_COMMENT_COUNT);
}

async function toRawTrendItem(subreddit: string, post: RedditPost): Promise<RawTrendItem> {
  const comments = await collectTopComments(post);

  return {
    source: `Reddit r/${subreddit}`,
    sourceType: "reddit",
    url: getRedditPostUrl(post),
    title: post.title?.trim() ?? "",
    excerpt: getExcerpt(post, comments),
    publishedAt: getPublishedAt(post),
    score: getSignalScore(post),
  };
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
  const posts = (listing.data?.children ?? [])
    .map((child) => child.data)
    .filter((post): post is RedditPost => Boolean(post))
    .filter(isCollectablePost);
  const results = await Promise.allSettled(posts.map((post) => toRawTrendItem(subreddit, post)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

export async function collectRedditItems(): Promise<RawTrendItem[]> {
  const results = await Promise.allSettled(SUBREDDITS.map((subreddit) => collectSubredditHotItems(subreddit)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}
