import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, eq, inArray } from "drizzle-orm";

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

  const sessionIds = userPracticeSessions.map((s) => s.practice_session.id);
  const attempts =
    sessionIds.length > 0
      ? await db
          .select({
            transcriptSentenceId: schema.practiceAttempt.transcriptSentenceId,
            accuracy: schema.practiceAttempt.accuracy,
          })
          .from(schema.practiceAttempt)
          .where(inArray(schema.practiceAttempt.practiceSessionId, sessionIds))
      : [];

  return userPracticeSessions.map((s) => ({
    ...s,
    attempts,
  }));
});
