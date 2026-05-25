import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";
import { defineProtectedEventHandler } from "~~/server/utils/auth";
import { z } from "zod";

const bodySchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

// Create or reset practice session (one session per video)
export default defineProtectedEventHandler(async (event, session) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const [video] = await db
    .select()
    .from(schema.video)
    .where(eq(schema.video.youtubeId, body.youtubeId))
    .limit(1);

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "VIDEO_NOT_FOUND" });
  }

  const videoId = video.id;

  // Look for existing session for this user + video
  const [existing] = await db
    .select()
    .from(schema.practiceSession)
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        eq(schema.practiceSession.videoId, videoId),
      ),
    )
    .limit(1);

  if (existing) {
    // Reset existing session: delete attempts, reset fields
    await db
      .delete(schema.practiceAttempt)
      .where(eq(schema.practiceAttempt.practiceSessionId, existing.id));

    const [updated] = await db
      .update(schema.practiceSession)
      .set({
        currentSentenceIndex: 0,
        completed: false,
        score: 0,
        lastPracticedAt: new Date(),
      })
      .where(eq(schema.practiceSession.id, existing.id))
      .returning();

    if (!updated) {
      throw createError({ statusCode: 500, statusMessage: "PRACTICE_SESSION_RESET_FAILED" });
    }

    return updated;
  }

  // No existing session — create new
  const [created] = await db
    .insert(schema.practiceSession)
    .values({
      userId: session.user.id,
      videoId,
      lastPracticedAt: new Date(),
    })
    .returning();

  if (!created) {
    throw createError({ statusCode: 500, statusMessage: "PRACTICE_SESSION_CREATION_FAILED" });
  }

  setResponseStatus(event, 201);
  return created;
});
