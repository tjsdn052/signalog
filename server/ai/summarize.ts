import type { RawTrendItem } from "../collectors/types";

export function summarizeTrendItem(item: RawTrendItem) {
  return item.excerpt ?? `${item.title} 흐름을 기술 트렌드 관점에서 검토할 필요가 있습니다.`;
}
