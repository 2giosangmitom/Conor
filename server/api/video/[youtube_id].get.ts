import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { start, getRun } from "workflow/api";
import { kv } from "@nuxthub/kv";
import { handleIndexVideo } from "~~/server/workflows/video-indexing";
import { z } from "zod";

const INDEXING_KEY_PREFIX = "video-indexing:";
const STREAM_NAMESPACE = "logs";

const paramSchema = z.object({
  youtube_id: z.string().min(1).max(20),
});

export default defineEventHandler(async (event) => {
  const { youtube_id: youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);

  const video = await db.select().from(schema.video).where(eq(schema.video.youtubeId, youtubeId));

  if (video.length === 0) {
    const existingRunId = await kv.get<string>(`${INDEXING_KEY_PREFIX}${youtubeId}`);

    const eventStream = createEventStream(event);

    const streamToSse = async (stream: ReadableStream<VideoIndexingLog>) => {
      const reader = stream.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          await eventStream.push({
            event: "log",
            data: JSON.stringify(value),
          });
        }
        const [indexedVideo] = await db
          .select()
          .from(schema.video)
          .where(eq(schema.video.youtubeId, youtubeId));
        await eventStream.push({
          event: "result",
          data: JSON.stringify(indexedVideo ?? null),
        });
      } finally {
        reader.releaseLock();
        await eventStream.close();
      }
    };

    if (existingRunId) {
      const run = getRun(existingRunId);
      if (await run.exists) {
        void streamToSse(run.getReadable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }));
        eventStream.onClosed(async () => {
          await eventStream.close();
        });
        return eventStream.send();
      }

      await kv.del(`${INDEXING_KEY_PREFIX}${youtubeId}`);
    }

    const run = await start(handleIndexVideo, [youtubeId]);
    await kv.set(`${INDEXING_KEY_PREFIX}${youtubeId}`, run.runId, { ttl: 60 * 60 });

    void streamToSse(run.getReadable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }));
    eventStream.onClosed(async () => {
      await eventStream.close();
    });
    return eventStream.send();
  }

  return video[0];
});
