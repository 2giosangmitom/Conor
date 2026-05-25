import { db, schema } from "@nuxthub/db";
import { asc, countDistinct, eq } from "drizzle-orm";
import { start, getRun } from "workflow/api";
import { kv } from "@nuxthub/kv";
import { handleIndexVideo } from "~~/server/workflows/video-indexing";
import { z } from "zod";

const paramSchema = z.object({
  youtube_id: z.string().min(1).max(20),
});

// Redis key prefix
const INDEXING_KEY_PREFIX = "video-indexing:";

export default defineEventHandler(async (event) => {
  const { youtube_id: youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);

  // Check if video is already indexed
  const rows = await db
    .select()
    .from(schema.video)
    .innerJoin(
      schema.videoTranscriptSentence,
      eq(schema.video.id, schema.videoTranscriptSentence.videoId),
    )
    .where(eq(schema.video.youtubeId, youtubeId))
    .orderBy(asc(schema.videoTranscriptSentence.sentenceIndex));

  const firstRow = rows[0];

  // Return video if found with transcript sentences, ensuring it's fully indexed
  if (firstRow) {
    const [learnedResult] = await db
      .select({ learnedCount: countDistinct(schema.practiceSession.userId) })
      .from(schema.practiceSession)
      .where(eq(schema.practiceSession.videoId, firstRow.video.id));

    const sentences = rows.map((row) => row.video_transcript_sentence);
    setResponseStatus(event, 200);
    return {
      video: {
        ...firstRow.video,
        learnedCount: learnedResult?.learnedCount ?? 0,
      },
      sentences,
    };
  }

  // Video not indexed, check if there's an ongoing indexing run for this YouTube ID
  const existingRunId = await kv.get<string>(`${INDEXING_KEY_PREFIX}${youtubeId}`);

  if (existingRunId) {
    const run = getRun(existingRunId);
    if (await run.exists) {
      setResponseStatus(event, 202);
      return { code: "VIDEO_NOT_INDEXED", runId: existingRunId };
    }
    // Cleanup stale run ID
    await kv.del(`${INDEXING_KEY_PREFIX}${youtubeId}`);
  }

  // Start a new workflow run
  const run = await start(handleIndexVideo, [youtubeId]);
  const runId = run.runId;

  // Store youtubeId -> runId mapping
  await kv.set(`${INDEXING_KEY_PREFIX}${youtubeId}`, runId, { ttl: 60 * 60 });

  setResponseStatus(event, 202);
  return { code: "VIDEO_NOT_INDEXED", runId };
});
