import type { RawTrendItem } from "./types";

const TRENDING_LANGUAGES = ["", "typescript", "javascript", "python", "rust"] as const;
const GITHUB_TRENDING_USER_AGENT = "SignalogTrendCollector/0.1";
const MAX_ITEMS_PER_LANGUAGE = 10;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function getTrendingUrl(language: string) {
  const languagePath = language ? `/${language}` : "";

  return `https://github.com/trending${languagePath}?since=daily`;
}

function getLanguageLabel(language: string) {
  return language ? language[0].toUpperCase() + language.slice(1) : "Overall";
}

function parseStarsToday(articleHtml: string) {
  const starsTodayMatch = articleHtml.match(/([\d,]+)\s+stars?\s+today/i);

  if (!starsTodayMatch) {
    return 0;
  }

  return Number(starsTodayMatch[1].replace(/,/g, ""));
}

function parseRepoItems(html: string, language: string): RawTrendItem[] {
  const articles = html.match(/<article[\s\S]*?<\/article>/g) ?? [];

  return articles.slice(0, MAX_ITEMS_PER_LANGUAGE).flatMap((articleHtml) => {
    const repoMatch = articleHtml.match(/<h2[\s\S]*?<a[^>]+href="\/([^"]+)"[\s\S]*?<\/a>[\s\S]*?<\/h2>/);

    if (!repoMatch) {
      return [];
    }

    const repoPath = repoMatch[1].replace(/\s+/g, "");
    const title = repoPath.replace("/", " / ");
    const descriptionMatch = articleHtml.match(/<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    const excerpt = descriptionMatch ? stripHtml(descriptionMatch[1]) : undefined;
    const starsToday = parseStarsToday(articleHtml);

    return [
      {
        source: `GitHub Trending ${getLanguageLabel(language)}`,
        sourceType: "github",
        url: `https://github.com/${repoPath}`,
        title,
        excerpt,
        publishedAt: new Date().toISOString(),
        score: starsToday,
      },
    ];
  });
}

async function collectTrendingLanguage(language: string): Promise<RawTrendItem[]> {
  const response = await fetch(getTrendingUrl(language), {
    headers: {
      "User-Agent": GITHUB_TRENDING_USER_AGENT,
      Accept: "text/html",
    },
    next: {
      revalidate: 0,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub Trending ${language || "overall"} returned ${response.status}`);
  }

  return parseRepoItems(await response.text(), language);
}

export async function collectGithubTrendingItems(): Promise<RawTrendItem[]> {
  const results = await Promise.allSettled(TRENDING_LANGUAGES.map((language) => collectTrendingLanguage(language)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}
