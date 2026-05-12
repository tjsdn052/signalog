import type { RawTrendItem } from "../collectors/types";
import type { DraftTrendPost } from "./types";
import { normalizePostCategory } from "../posts/categories";
import { normalizePostTags } from "../posts/tags";
import { getOpenAIClient, OPENAI_DRAFT_MODEL } from "./openai-client";
import { prepareFallbackDraftPost } from "./draft-fallback";
import { buildDraftPrompt, DRAFT_SYSTEM_PROMPT } from "./draft-prompt";
import { DRAFT_TEXT_FORMAT, parseGeneratedDraft, type GeneratedDraftPayload } from "./draft-schema";

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
  const openai = getOpenAIClient();

  if (!openai) {
    return prepareFallbackDraftPost(item);
  }

  try {
    const response = await openai.responses.create({
      model: OPENAI_DRAFT_MODEL,
      input: [
        {
          role: "system",
          content: DRAFT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildDraftPrompt(item),
        },
      ],
      reasoning: {
        effort: "minimal",
      },
      text: {
        format: DRAFT_TEXT_FORMAT,
        verbosity: "low",
      },
      max_output_tokens: 1800,
    });
    const generated = parseGeneratedDraft(response.output_text);

    return normalizeGeneratedDraft(item, generated);
  } catch {
    return prepareFallbackDraftPost(item);
  }
}

export async function prepareDraftPost(item: RawTrendItem): Promise<DraftTrendPost> {
  return generateDraftWithOpenAI(item);
}
