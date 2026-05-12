import { POST_CATEGORIES } from "../posts/categories";
import { POST_TAGS } from "../posts/tags";

export type GeneratedDraftPayload = {
  title: string;
  excerpt: string;
  aiSummary: string;
  contentMarkdown: string;
  category: string;
  tags: string[];
};

export const DRAFT_TEXT_FORMAT = {
  type: "json_schema",
  name: "signalog_draft_post",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "excerpt", "aiSummary", "contentMarkdown", "category", "tags"],
    properties: {
      title: {
        type: "string",
        minLength: 1,
      },
      excerpt: {
        type: "string",
        minLength: 1,
      },
      aiSummary: {
        type: "string",
        minLength: 1,
      },
      contentMarkdown: {
        type: "string",
        minLength: 1,
      },
      category: {
        type: "string",
        enum: POST_CATEGORIES,
      },
      tags: {
        type: "array",
        minItems: 2,
        maxItems: 4,
        items: {
          type: "string",
          enum: POST_TAGS,
        },
      },
    },
  },
} as const;

export function parseGeneratedDraft(text: string): GeneratedDraftPayload {
  return JSON.parse(text) as GeneratedDraftPayload;
}
