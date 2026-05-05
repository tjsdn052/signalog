import { isPostCategory } from "@/server/posts/categories";
import { isValidTagName, normalizeTagName } from "@/server/posts/tags";

export const MANUAL_POST_SOURCE_URL = "https://signalog.local/manual";

export function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${key} 값이 필요합니다.`);
  }

  return value.trim();
}

export function getOptionalUrl(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    return MANUAL_POST_SOURCE_URL;
  }

  try {
    return new URL(value.trim()).toString();
  } catch {
    throw new Error(`${key}는 올바른 URL이어야 합니다.`);
  }
}

export function getSignalScore(formData: FormData) {
  const signalScore = Number(getRequiredString(formData, "signalScore"));

  if (!Number.isFinite(signalScore) || signalScore < 0 || signalScore > 100) {
    throw new Error("Signal score는 0부터 100 사이여야 합니다.");
  }

  return signalScore;
}

export function getCategory(formData: FormData) {
  const category = getRequiredString(formData, "category");

  if (!isPostCategory(category)) {
    throw new Error("허용되지 않은 category입니다.");
  }

  return category;
}

export function getTags(formData: FormData) {
  const tags = formData.getAll("tags");
  const uniqueTags = new Set<string>();

  for (const tag of tags) {
    if (typeof tag !== "string") {
      throw new Error("허용되지 않은 tag입니다.");
    }

    const normalizedTag = normalizeTagName(tag);

    if (!isValidTagName(normalizedTag)) {
      throw new Error("태그는 2자 이상 32자 이하로 입력해야 합니다.");
    }

    uniqueTags.add(normalizedTag);
  }

  if (uniqueTags.size > 10) {
    throw new Error("태그는 최대 10개까지 선택할 수 있습니다.");
  }

  return Array.from(uniqueTags);
}
