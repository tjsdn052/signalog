import type { RawTrendItem } from "../collectors/types";
import { normalizePostCategory } from "../posts/categories";

export function classifyTrendItem(item: RawTrendItem) {
  const text = `${item.title} ${item.excerpt ?? ""}`.toLowerCase();

  if (text.includes("agent")) {
    return {
      category: normalizePostCategory("Agentic AI"),
      tags: ["Agents", "Workflow", "LLM"],
    };
  }

  if (text.includes("local")) {
    return {
      category: normalizePostCategory("Models"),
      tags: ["Local AI", "Inference", "Open Source"],
    };
  }

  return {
    category: normalizePostCategory("Infrastructure"),
    tags: ["AI", "Tools", "Product"],
  };
}
