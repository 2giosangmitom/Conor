import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";
import { defineProtectedEventHandler } from "~~/server/utils/auth";

const querySchema = z.object({
  youtubeId: z.string().min(1).max(20).optional(),
  completed: z.boolean().optional(),
});

export default defineProtectedEventHandler(async (event, session) => {
  const query = await getValidatedQuery(event, querySchema.parse);

  const conditions = [eq(schema.practiceSession.userId, session.user.id)];

  if (query.youtubeId) {
    conditions.push(eq(schema.video.youtubeId, query.youtubeId));
  }

  if (query.completed !== undefined) {
    conditions.push(eq(schema.practiceSession.completed, query.completed));
  }

  const userPracticeSessions = await db
    .select()
    .from(schema.practiceSession)
    .innerJoin(schema.video, eq(schema.practiceSession.videoId, schema.video.id))
    .where(and(...conditions));

  return userPracticeSessions;
});
