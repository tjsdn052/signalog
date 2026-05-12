import OpenAI from "openai";

export const OPENAI_DRAFT_MODEL = "gpt-5-nano";
export const OPENAI_TIMEOUT_MS = 45_000;

export function getOpenAIKey() {
  return process.env.OPEN_AI_KEY ?? process.env.OPENAI_API_KEY;
}

export function hasOpenAIKey() {
  return Boolean(getOpenAIKey());
}

export function getOpenAIClient() {
  const apiKey = getOpenAIKey();

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    timeout: OPENAI_TIMEOUT_MS,
  });
}
