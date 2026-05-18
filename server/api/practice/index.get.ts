import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";

const querySchema = z.object({
  youtubeId: z.string().min(1).max(20).optional(),
  completed: z.boolean().optional(),
});

export default defineProtectedEventHandler(async (event, session) => {
  const query = await getValidatedQuery(event, querySchema.parse);

  const userPracticeSessions = await db
    .select()
    .from(schema.practiceSession)
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        query.youtubeId ? eq(schema.practiceSession.videoId, query.youtubeId) : undefined,
        query.completed !== undefined
          ? eq(schema.practiceSession.completed, query.completed)
          : undefined,
      ),
    );

  return userPracticeSessions;
});
