import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { start } from "workflow/api";
import { handleIndexVideo } from "~~/server/workflows/video-indexing";

export default defineEventHandler(async (event) => {
  const youtubeId = getRouterParam(event, "youtube_id")!;
  const video = await db.select().from(schema.video).where(eq(schema.video.youtubeId, youtubeId));

  if (video.length === 0) {
    const run = await start(handleIndexVideo, [youtubeId]);
    return run;
  }

  return video[0];
});
