import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
  sentenceId: z.string().uuid(),
});

const bodySchema = z.object({
  text: z.string().min(1).optional(),
  startTime: z.number().int().min(0).optional(),
  endTime: z.number().int().min(0).optional(),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId, sentenceId } = await getValidatedRouterParams(event, paramSchema.parse);
  const body = await readValidatedBody(event, bodySchema.parse);

  const [video] = await db
    .select({ id: schema.video.id })
    .from(schema.video)
    .where(eq(schema.video.youtubeId, youtubeId))
    .limit(1);

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  const [existing] = await db
    .select()
    .from(schema.videoTranscriptSentence)
    .where(eq(schema.videoTranscriptSentence.id, sentenceId))
    .limit(1);

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: "Sentence not found" });
  }

  const [updated] = await db
    .update(schema.videoTranscriptSentence)
    .set({
      ...(body.text !== undefined ? { text: body.text } : {}),
      ...(body.startTime !== undefined ? { startTime: body.startTime } : {}),
      ...(body.endTime !== undefined ? { endTime: body.endTime } : {}),
    })
    .where(eq(schema.videoTranscriptSentence.id, sentenceId))
    .returning();

  return updated;
});
