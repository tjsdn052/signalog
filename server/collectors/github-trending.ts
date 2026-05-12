import type { RawTrendItem } from "./types";

const TRENDING_LANGUAGES = ["", "typescript", "javascript", "python", "rust"] as const;
const GITHUB_TRENDING_USER_AGENT = "SignalogTrendCollector/0.1";
const MAX_ITEMS_PER_LANGUAGE = 10;
const MAX_README_LENGTH = 700;

type GitHubReadmeResponse = {
  content?: string;
  encoding?: string;
};

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

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

function cleanMarkdown(value: string) {
  return decodeHtmlEntities(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>\n]*(?:>|$)/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_`|~\\[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeBase64(value: string) {
  return Buffer.from(value.replace(/\n/g, ""), "base64").toString("utf8");
}

async function fetchReadmeExcerpt(repoPath: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
      headers: {
        "User-Agent": GITHUB_TRENDING_USER_AGENT,
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 0,
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const readme = (await response.json()) as GitHubReadmeResponse;

    if (readme.encoding !== "base64" || !readme.content) {
      return undefined;
    }

    const cleanedReadme = cleanMarkdown(decodeBase64(readme.content));

    return cleanedReadme ? truncateText(cleanedReadme, MAX_README_LENGTH) : undefined;
  } catch {
    return undefined;
  }
}

function combineGithubContext(description?: string, readmeExcerpt?: string) {
  return [
    description ? `설명: ${description}` : undefined,
    readmeExcerpt ? `README 요약 원문: ${readmeExcerpt}` : undefined,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function parseRepoItems(html: string, language: string): Array<Omit<RawTrendItem, "excerpt"> & { description?: string }> {
  const articles = html.match(/<article[\s\S]*?<\/article>/g) ?? [];

  return articles.slice(0, MAX_ITEMS_PER_LANGUAGE).flatMap((articleHtml) => {
    const repoMatch = articleHtml.match(/<h2[\s\S]*?<a[^>]+href="\/([^"]+)"[\s\S]*?<\/a>[\s\S]*?<\/h2>/);

    if (!repoMatch) {
      return [];
    }

    const repoPath = repoMatch[1].replace(/\s+/g, "");
    const title = repoPath.replace("/", " / ");
    const descriptionMatch = articleHtml.match(/<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    const description = descriptionMatch ? stripHtml(descriptionMatch[1]) : undefined;
    const starsToday = parseStarsToday(articleHtml);

    return [
      {
        source: `GitHub Trending ${getLanguageLabel(language)}`,
        sourceType: "github",
        url: `https://github.com/${repoPath}`,
        title,
        description,
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

  const items = parseRepoItems(await response.text(), language);
  const results = await Promise.allSettled(
    items.map(async (item) => {
      const repoPath = item.url.replace("https://github.com/", "");
      const readmeExcerpt = await fetchReadmeExcerpt(repoPath);
      const excerpt = combineGithubContext(item.description, readmeExcerpt);

      return {
        source: item.source,
        sourceType: item.sourceType,
        url: item.url,
        title: item.title,
        publishedAt: item.publishedAt,
        score: item.score,
        excerpt: excerpt || item.description,
        rawPayload: {
          repoPath,
          description: item.description,
          readmeExcerpt,
          starsToday: item.score,
        },
      };
    }),
  );

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

export async function collectGithubTrendingItems(): Promise<RawTrendItem[]> {
  const results = await Promise.allSettled(TRENDING_LANGUAGES.map((language) => collectTrendingLanguage(language)));

  return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}
