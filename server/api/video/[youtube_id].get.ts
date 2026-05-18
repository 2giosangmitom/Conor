import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { start, getRun } from "workflow/api";
import { kv } from "@nuxthub/kv";
import { handleIndexVideo } from "~~/server/workflows/video-indexing";
import { workflowStateKey } from "~~/server/workflows/video-indexing/steps";
import { z } from "zod";
import type { WorkflowState } from "~~/shared/types/video-indexing";

const paramSchema = z.object({
  youtube_id: z.string().min(1).max(20),
});

// Maps youtubeId → active runId so we can reuse an in-progress run
const INDEXING_KEY_PREFIX = "video-indexing:";

export default defineEventHandler(async (event) => {
  const { youtube_id: youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);

  const [video] = await db.select().from(schema.video).where(eq(schema.video.youtubeId, youtubeId));

  if (video) {
    return { video };
  }

  // Video not indexed — check for an existing in-progress run
  const existingRunId = await kv.get<string>(`${INDEXING_KEY_PREFIX}${youtubeId}`);

  if (existingRunId) {
    const run = getRun(existingRunId);
    if (await run.exists) {
      setResponseStatus(event, 202);
      return { code: "VIDEO_NOT_INDEXED", runId: existingRunId };
    }
    // Stale pointer — clean up
    await kv.del(`${INDEXING_KEY_PREFIX}${youtubeId}`);
  }

  // Start a new workflow run
  const run = await start(handleIndexVideo, [youtubeId]);
  const runId = run.runId;

  // Store youtubeId → runId mapping (for deduplication on re-request)
  await kv.set(`${INDEXING_KEY_PREFIX}${youtubeId}`, runId, { ttl: 60 * 60 });

  // Initialise the workflow state in Redis for history replay
  const state: WorkflowState = { runId, youtubeId };
  await kv.set(workflowStateKey(runId), state, { ttl: 60 * 60 });

  setResponseStatus(event, 202);
  return { code: "VIDEO_NOT_INDEXED", runId };
});
