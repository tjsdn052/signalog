import type { RawTrendItem } from "../collectors/types";

export function classifyTrendItem(item: RawTrendItem) {
  const text = `${item.title} ${item.excerpt ?? ""}`.toLowerCase();

  if (text.includes("agent")) {
    return {
      category: "Agentic AI",
      tags: ["Agents", "Workflow", "LLM"],
    };
  }

  if (text.includes("local")) {
    return {
      category: "Models",
      tags: ["Local AI", "Inference", "Open Source"],
    };
  }

  return {
    category: "Infrastructure",
    tags: ["AI", "Tools", "Product"],
  };
}
