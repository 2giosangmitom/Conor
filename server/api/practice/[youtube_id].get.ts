import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";

const paramsSchema = z.object({
  youtube_id: z.string().min(1).max(20),
  lastest: z.boolean().optional(),
});

export default defineProtectedEventHandler(async (event, session) => {
  const params = await getValidatedRouterParams(event, paramsSchema.parse);

  const userPracticeSessions = await db
    .select()
    .from(schema.practiceSession)
    .innerJoin(schema.video, eq(schema.practiceSession.videoId, schema.video.id))
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        eq(schema.video.youtubeId, params.youtube_id),
        params.lastest ? eq(schema.practiceSession.completed, false) : undefined,
      ),
    );

  return userPracticeSessions;
});
