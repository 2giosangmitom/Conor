import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { and, eq } from "drizzle-orm";
import { defineProtectedEventHandler } from "~~/server/utils/auth";
import type { H3Event } from "h3";
import type { auth } from "~~/server/utils/auth";

const bodySchema = z.object({
  youtubeId: z.string().min(1).max(20),
  currentSentenceIndex: z.number().int().min(0),
  completed: z.boolean().optional(),
  score: z.number().int().min(0).optional(),
});

type SessionPayload = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;

export default defineProtectedEventHandler(async (event: H3Event, session: SessionPayload) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const [videoRow] = await db
    .select({ id: schema.video.id })
    .from(schema.video)
    .where(eq(schema.video.youtubeId, body.youtubeId))
    .limit(1);

  if (!videoRow) {
    throw createError({ statusCode: 404, statusMessage: "VIDEO_NOT_FOUND" });
  }

  const [existingSession] = await db
    .select()
    .from(schema.practiceSession)
    .where(
      and(
        eq(schema.practiceSession.userId, session.user.id),
        eq(schema.practiceSession.videoId, videoRow.id),
        eq(schema.practiceSession.completed, false),
      ),
    )
    .limit(1);

  if (!existingSession) {
    const [created] = await db
      .insert(schema.practiceSession)
      .values({
        userId: session.user.id,
        videoId: videoRow.id,
        currentSentenceIndex: body.currentSentenceIndex,
        completed: body.completed ?? false,
        score: body.score ?? 0,
        lastPracticedAt: new Date(),
      })
      .returning();

    if (!created) {
      throw createError({ statusCode: 500, statusMessage: "PRACTICE_SESSION_CREATION_FAILED" });
    }

    setResponseStatus(event, 201);
    return created;
  }

  const [updated] = await db
    .update(schema.practiceSession)
    .set({
      currentSentenceIndex: body.currentSentenceIndex,
      completed: body.completed ?? existingSession.completed,
      score: body.score ?? existingSession.score,
      lastPracticedAt: new Date(),
    })
    .where(eq(schema.practiceSession.id, existingSession.id))
    .returning();

  if (!updated) {
    throw createError({ statusCode: 500, statusMessage: "PRACTICE_SESSION_UPDATE_FAILED" });
  }

  return updated;
});
