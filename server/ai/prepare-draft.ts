import type { RawTrendItem } from "../collectors/types";
import { classifyTrendItem } from "./classify";
import type { DraftTrendPost } from "./types";
import { summarizeTrendItem } from "./summarize";
import { translateTrendTitle } from "./translate";
import { normalizePostCategory } from "../posts/categories";
import { normalizePostTags } from "../posts/tags";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-5-nano";
const OPENAI_TIMEOUT_MS = 45_000;

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
};

type GeneratedDraftPayload = {
  title?: string;
  excerpt?: string;
  aiSummary?: string;
  contentMarkdown?: string;
  category?: string;
  tags?: string[];
};

function getOpenAIKey() {
  return process.env.OPEN_AI_KEY ?? process.env.OPENAI_API_KEY;
}

function prepareFallbackDraftPost(item: RawTrendItem): DraftTrendPost {
  const classification = classifyTrendItem(item);
  const signalScore = Math.min(100, Math.max(0, item.score ?? 50));
  const summary = summarizeTrendItem(item);

  return {
    sourceItem: item,
    title: translateTrendTitle(item),
    excerpt: summary,
    aiSummary: summary,
    summary,
    contentMarkdown: summary,
    category: classification.category,
    tags: classification.tags,
    signalScore,
    status: "draft",
  };
}

function getRawContext(item: RawTrendItem) {
  return JSON.stringify(
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
  );
}

function extractResponseText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text;
  }

  return response.output?.flatMap((item) => item.content?.map((content) => content.text ?? "") ?? []).join("\n") ?? "";
}

function parseGeneratedDraft(text: string): GeneratedDraftPayload {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim()
    : trimmed;

  return JSON.parse(jsonText) as GeneratedDraftPayload;
}

function normalizeGeneratedDraft(item: RawTrendItem, generated: GeneratedDraftPayload): DraftTrendPost {
  const fallback = prepareFallbackDraftPost(item);
  const aiSummary = generated.aiSummary?.trim() || fallback.aiSummary;
  const contentMarkdown = generated.contentMarkdown?.trim() || aiSummary;
  const tags = normalizePostTags(generated.tags ?? []);

  return {
    sourceItem: item,
    title: generated.title?.trim() || fallback.title,
    excerpt: generated.excerpt?.trim() || fallback.excerpt,
    aiSummary,
    summary: aiSummary,
    contentMarkdown,
    category: normalizePostCategory(generated.category ?? fallback.category),
    tags: tags.length > 0 ? tags : fallback.tags,
    signalScore: fallback.signalScore,
    status: "draft",
  };
}

async function generateDraftWithOpenAI(item: RawTrendItem): Promise<DraftTrendPost> {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    return prepareFallbackDraftPost(item);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          {
            role: "system",
            content:
              "You create Korean tech blog draft posts from collected trend items. Return JSON only. Do not include markdown fences.",
          },
          {
            role: "user",
            content: [
              "아래 원본 수집 데이터를 기반으로 한국어 블로그 draft를 생성해.",
              "title: 한국어 제목. 고유명사/제품명은 원문 유지.",
              "excerpt: 카드에 들어갈 1~2문장 요약.",
              "aiSummary: 관리자 검수용 2~4문장 요약.",
              "contentMarkdown: 게시글 본문 Markdown. h2 섹션 2~3개, 핵심 포인트, 왜 중요한지 포함.",
              "category: 다음 중 하나만 사용: Agentic AI, Models, Infrastructure, Frontend, Mobile, RAG, Open Source, Developer Tools, Product, Security.",
              "tags: 다음 중 2~4개만 사용: Agents, Workflow, LLM, MCP, Tools, Protocol, React Native, Hermes, Runtime, AI SDK, Streaming, React, RAG, Vector DB, Rerank, Open Source, Local AI, Inference, Security, Product.",
              "",
              "반드시 이 JSON 형태만 반환:",
              "{\"title\":\"\",\"excerpt\":\"\",\"aiSummary\":\"\",\"contentMarkdown\":\"\",\"category\":\"Developer Tools\",\"tags\":[\"Tools\"]}",
              "",
              "원본 데이터:",
              getRawContext(item),
            ].join("\n"),
          },
        ],
        reasoning: {
          effort: "minimal",
        },
        text: {
          verbosity: "low",
        },
        max_output_tokens: 1800,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return prepareFallbackDraftPost(item);
    }

    const data = (await response.json()) as OpenAIResponse;
    const generated = parseGeneratedDraft(extractResponseText(data));

    return normalizeGeneratedDraft(item, generated);
  } catch {
    return prepareFallbackDraftPost(item);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function prepareDraftPost(item: RawTrendItem): Promise<DraftTrendPost> {
  return generateDraftWithOpenAI(item);
}
