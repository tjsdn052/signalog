import type { RawTrendItem } from "../collectors/types";

export function dedupeRawItems(items: RawTrendItem[]) {
  const seenUrls = new Set<string>();

  return items.filter((item) => {
    if (seenUrls.has(item.url)) {
      return false;
    }

    seenUrls.add(item.url);
    return true;
  });
}
