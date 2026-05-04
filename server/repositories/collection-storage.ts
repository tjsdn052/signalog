import type { DraftTrendPost } from "../ai/types";
import type { RawTrendItem } from "../collectors/types";
import { completeCollectionRun, createCollectionRun, failCollectionRun } from "./collection-runs";
import { saveDraftPost } from "./posts";
import { saveRawItem } from "./raw-items";
import { upsertSource } from "./sources";

type PersistCollectionInput = {
  runKey: string;
  collectedAt: string;
  rawItems: RawTrendItem[];
  draftPosts: DraftTrendPost[];
};

export async function persistCollection(input: PersistCollectionInput) {
  const collectionRunId = await createCollectionRun({
    runKey: input.runKey,
    collectedAt: input.collectedAt,
  });

  try {
    for (const draft of input.draftPosts) {
      const sourceId = await upsertSource(draft.sourceItem);
      const rawItemId = await saveRawItem({
        item: draft.sourceItem,
        sourceId,
        collectionRunId,
      });

      await saveDraftPost({
        draft,
        rawItemId,
      });
    }

    await completeCollectionRun({
      id: collectionRunId,
      rawCount: input.rawItems.length,
      draftCount: input.draftPosts.length,
    });

    return collectionRunId;
  } catch (error) {
    await failCollectionRun(collectionRunId, error instanceof Error ? error.message : "Unknown collection persistence error");
    throw error;
  }
}
