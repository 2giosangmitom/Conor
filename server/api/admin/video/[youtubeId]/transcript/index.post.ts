import { db, schema } from "@nuxthub/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

const bodySchema = z.object({
  text: z.string().min(1),
  startTime: z.number().int().min(0),
  endTime: z.number().int().min(0),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);
  const body = await readValidatedBody(event, bodySchema.parse);

  const [video] = await db
    .select({ id: schema.video.id })
    .from(schema.video)
    .where(eq(schema.video.youtubeId, youtubeId))
    .limit(1);

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  const [maxResult] = await db
    .select({
      maxIndex: sql<number>`COALESCE(MAX(${schema.videoTranscriptSentence.sentenceIndex}), -1)`,
    })
    .from(schema.videoTranscriptSentence)
    .where(eq(schema.videoTranscriptSentence.videoId, video.id));

  const nextIndex = (maxResult?.maxIndex ?? -1) + 1;

  const [sentence] = await db
    .insert(schema.videoTranscriptSentence)
    .values({
      videoId: video.id,
      sentenceIndex: nextIndex,
      text: body.text,
      startTime: body.startTime,
      endTime: body.endTime,
    })
    .returning();

  setResponseStatus(event, 201);
  return sentence;
});
