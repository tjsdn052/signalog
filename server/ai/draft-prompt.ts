import type { RawTrendItem } from "../collectors/types";
import { POST_CATEGORIES } from "../posts/categories";
import { POST_TAGS } from "../posts/tags";

export const DRAFT_SYSTEM_PROMPT =
  "You create Korean tech blog draft posts from collected trend items. Return only the requested structured fields.";

export function buildDraftPrompt(item: RawTrendItem) {
  return [
    "아래 원본 수집 데이터를 기반으로 한국어 블로그 draft를 생성해.",
    "title: 한국어 제목. 고유명사/제품명은 원문 유지.",
    "excerpt: 카드에 들어갈 1~2문장 요약.",
    "aiSummary: 관리자 검수용 2~4문장 요약.",
    "contentMarkdown: 게시글 본문 Markdown. h2 섹션 2~3개, 핵심 포인트, 왜 중요한지 포함.",
    `category: 다음 중 하나만 사용: ${POST_CATEGORIES.join(", ")}.`,
    `tags: 다음 중 2~4개만 사용: ${POST_TAGS.join(", ")}.`,
    "",
    "원본 데이터:",
    JSON.stringify(
      {
        source: item.source,
        sourceType: item.sourceType,
        url: item.url,
        title: item.title,
        excerpt: item.excerpt,
        rawPayload: item.rawPayload,
        publishedAt: item.publishedAt,
        score: item.score,
      },
      null,
      2,
    ),
  ].join("\n");
}
