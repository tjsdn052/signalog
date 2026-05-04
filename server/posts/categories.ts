export const POST_CATEGORIES = [
  "Agentic AI",
  "Models",
  "Infrastructure",
  "Frontend",
  "Mobile",
  "RAG",
  "Open Source",
  "Developer Tools",
  "Product",
  "Security",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export function isPostCategory(category: string): category is PostCategory {
  return POST_CATEGORIES.includes(category as PostCategory);
}

export function normalizePostCategory(category: string): PostCategory {
  return isPostCategory(category) ? category : "Developer Tools";
}
