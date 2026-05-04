import type { RawTrendItem } from "../collectors/types";
import { normalizePostCategory } from "../posts/categories";
import { normalizePostTags } from "../posts/tags";

export function classifyTrendItem(item: RawTrendItem) {
  const text = `${item.title} ${item.excerpt ?? ""}`.toLowerCase();

  if (text.includes("agent")) {
    return {
      category: normalizePostCategory("Agentic AI"),
      tags: normalizePostTags(["Agents", "Workflow", "LLM"]),
    };
  }

  if (text.includes("local")) {
    return {
      category: normalizePostCategory("Models"),
      tags: normalizePostTags(["Local AI", "Inference", "Open Source"]),
    };
  }

  return {
    category: normalizePostCategory("Infrastructure"),
    tags: normalizePostTags(["Tools", "Product"]),
  };
}
