import type { RawTrendItem } from "../collectors/types";
import { getOpenAIClient, OPENAI_DRAFT_MODEL } from "./openai-client";

const MAX_LLM_CANDIDATE_POOL = 30;

type CandidateSelectionPayload = {
  selectedUrls: string[];
};

const CANDIDATE_SELECTION_FORMAT = {
  type: "json_schema",
  name: "signalog_candidate_selection",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["selectedUrls"],
    properties: {
      selectedUrls: {
        type: "array",
        minItems: 0,
        maxItems: 10,
        items: {
          type: "string",
        },
      },
    },
  },
} as const;

const CANDIDATE_SELECTION_SYSTEM_PROMPT = `
You are a senior editor for a Korean developer trend blog.
Select source items that are worth turning into draft posts.
Return only URLs from the provided candidates.
`.trim();

function buildCandidateSelectionPrompt(items: RawTrendItem[], limit: number) {
  return [
    "아래 수집 후보 중 Signalog draft로 만들 가치가 높은 원문을 골라.",
    "",
    "선정 기준:",
    "- 개발자/AI/오픈소스/프론트엔드/인프라 트렌드와 직접 관련이 있을 것.",
    "- 단순 홍보, 얕은 튜토리얼, 반복 뉴스, 맥락이 부족한 글은 제외.",
    "- 댓글/반응/README/본문 맥락이 있으면 기술적 논점이 분명한 것을 우선.",
    "- 같은 주제라면 더 원문성이 높고 정보량이 큰 소스를 우선.",
    "- 최대 " + limit + "개만 선택.",
    "",
    "후보:",
    JSON.stringify(
      items.map((item) => ({
        source: item.source,
        sourceType: item.sourceType,
        url: item.url,
        title: item.title,
        excerpt: item.excerpt,
        score: item.score,
        publishedAt: item.publishedAt,
        rawPayload: item.rawPayload,
      })),
      null,
      2,
    ),
  ].join("\n");
}

function parseCandidateSelection(text: string): CandidateSelectionPayload {
  return JSON.parse(text) as CandidateSelectionPayload;
}

export async function selectDraftCandidatesWithAI(items: RawTrendItem[], limit: number) {
  const fallbackCandidates = items.slice(0, limit);
  const openai = getOpenAIClient();

  if (!openai || items.length === 0) {
    return fallbackCandidates;
  }

  const candidatePool = items.slice(0, Math.max(limit, MAX_LLM_CANDIDATE_POOL));

  try {
    const response = await openai.responses.create({
      model: OPENAI_DRAFT_MODEL,
      input: [
        {
          role: "system",
          content: CANDIDATE_SELECTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildCandidateSelectionPrompt(candidatePool, limit),
        },
      ],
      reasoning: {
        effort: "minimal",
      },
      text: {
        format: CANDIDATE_SELECTION_FORMAT,
        verbosity: "low",
      },
      max_output_tokens: 900,
    });
    const selected = parseCandidateSelection(response.output_text);
    const selectedUrls = new Set(selected.selectedUrls);
    const selectedCandidates = candidatePool.filter((item) => selectedUrls.has(item.url)).slice(0, limit);

    return selectedCandidates.length > 0 ? selectedCandidates : fallbackCandidates;
  } catch {
    return fallbackCandidates;
  }
}
