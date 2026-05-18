import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";
import { defineProtectedEventHandler } from "~~/server/utils/auth";
import { z } from "zod";

const bodySchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

// Create new practice session
export default defineProtectedEventHandler(async (event, session) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const video = await db
    .select()
    .from(schema.video)
    .where(eq(schema.video.youtubeId, body.youtubeId))
    .limit(1);

  if (video.length === 0 || !video[0]) {
    throw createError({ statusCode: 404, statusMessage: "VIDEO_NOT_FOUND" });
  }

  const videoId = video[0].id;

  // Mark last practice session as finished
  await db
    .update(schema.practiceSession)
    .set({
      completed: true,
    })
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        eq(schema.practiceSession.videoId, videoId),
        eq(schema.practiceSession.completed, false),
      ),
    );

  // Create new practice session
  const newSession = (
    await db
      .insert(schema.practiceSession)
      .values({
        userId: session.user.id,
        videoId: videoId,
        lastPracticedAt: new Date(),
      })
      .returning()
  )[0]!;

  return newSession;
});
