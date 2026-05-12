import type { RawTrendItem } from "../collectors/types";
import { POST_CATEGORIES } from "../posts/categories";
import { POST_TAGS } from "../posts/tags";

export const DRAFT_SYSTEM_PROMPT = `
You are an editor for a Korean tech blog.
Create a Korean draft post from collected trend data.

Rules:
- Use only the provided source data.
- Do not invent facts, numbers, opinions, or technical details not present in the source.
- Keep product names, company names, library names, and technical terms in their original form when appropriate.
- Write in natural Korean for developers and tech-interested readers.
- Return only the requested structured fields.
`.trim();

export function buildDraftPrompt(item: RawTrendItem) {
  return [
    "아래 원본 수집 데이터를 기반으로 한국어 기술 블로그 draft를 생성해.",
    "",
    "작성 규칙:",
    "- 원본 데이터에 있는 내용만 사용해.",
    "- 원문에 없는 사실, 수치, 배경 설명은 추가하지 마.",
    "- 확실하지 않은 내용은 단정하지 말고 신중하게 표현해.",
    "- 고유명사, 제품명, 라이브러리명, 프레임워크명은 가능한 한 원문 표기를 유지해.",
    "- 번역투보다 자연스러운 한국어 블로그 문체로 작성해.",
    "- 단순 요약이 아니라, 개발자가 왜 관심 가질 만한 이슈인지 드러나게 작성해.",
    "- 댓글/반응 데이터가 포함되어 있다면, 댓글을 그대로 나열하지 말고 주요 분위기와 대표 의견을 자연스럽게 본문에 녹여.",
    "- 원본이 부족하면 내용을 억지로 늘리지 말고 짧고 명확하게 작성해.",
    "",
    "반환 필드:",
    "- title: 한국어 제목. 고유명사/제품명은 원문 유지.",
    "- excerpt: 카드에 들어갈 1~2문장 요약. Markdown 사용 말고 서술형으로 요약",
    "- aiSummary: 빠르게 훑어보기 위한 3~5문장 요약. Markdown 사용 말고 서술형으로 요약",
    "- contentMarkdown: 게시글 본문 Markdown.",
    "- category: 지정된 카테고리 중 하나.",
    "- tags: 지정된 태그 중 1~5개.",
    "",
    "contentMarkdown 작성 기준:",
    "- h2 섹션 2~3개를 사용해.",
    "- 첫 문단에서 이 이슈가 무엇인지 간단히 설명해.",
    "- 핵심 내용, 기술적 의미, 개발자가 주목할 점을 자연스럽게 연결해.",
    "- 섹션 제목은 형식적인 '핵심 포인트', '왜 중요한가'만 반복하지 말고 내용에 맞게 작성해.",
    "- Markdown에는 불필요한 인사말, 출처 목록, 면책 문구를 넣지 마.",
    "",
    `category: 다음 중 하나만 사용: ${POST_CATEGORIES.join(", ")}.`,
    `tags: 다음 중 1~5개만 사용: ${POST_TAGS.join(", ")}.`,
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
