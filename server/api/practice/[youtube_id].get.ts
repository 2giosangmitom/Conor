import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, desc, eq } from "drizzle-orm";
import { defineProtectedEventHandler } from "~~/server/utils/auth";

const paramsSchema = z.object({
  youtube_id: z.string().min(1).max(20),
});

export default defineProtectedEventHandler(async (event, session) => {
  const params = await getValidatedRouterParams(event, paramsSchema.parse);

  const [result] = await db
    .select()
    .from(schema.practiceSession)
    .innerJoin(schema.video, eq(schema.practiceSession.videoId, schema.video.id))
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        eq(schema.video.youtubeId, params.youtube_id),
      ),
    )
    .limit(1);

  if (!result) {
    return null;
  }

  const attempts = await db
    .select({
      transcriptSentenceId: schema.practiceAttempt.transcriptSentenceId,
      accuracy: schema.practiceAttempt.accuracy,
      hintsUsed: schema.practiceAttempt.hintsUsed,
    })
    .from(schema.practiceAttempt)
    .where(eq(schema.practiceAttempt.practiceSessionId, result.practice_session.id))
    .orderBy(desc(schema.practiceAttempt.createdAt));

  return {
    ...result,
    attempts,
  };
});
