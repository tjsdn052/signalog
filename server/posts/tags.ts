export const POST_TAGS = [
  "Agents",
  "Workflow",
  "LLM",
  "MCP",
  "Tools",
  "Protocol",
  "React Native",
  "Hermes",
  "Runtime",
  "AI SDK",
  "Streaming",
  "React",
  "RAG",
  "Vector DB",
  "Rerank",
  "Open Source",
  "Local AI",
  "Inference",
  "Security",
  "Product",
] as const;

export type PostTag = (typeof POST_TAGS)[number];

export function isPostTag(tag: string): tag is PostTag {
  return POST_TAGS.includes(tag as PostTag);
}

export function normalizePostTags(tags: string[]): PostTag[] {
  return tags.filter(isPostTag);
}

export function normalizeTagName(tag: string) {
  return tag.trim().replace(/\s+/g, " ");
}

export function isValidTagName(tag: string) {
  const normalizedTag = normalizeTagName(tag);

  return normalizedTag.length >= 2 && normalizedTag.length <= 32;
}
