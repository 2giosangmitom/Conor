import { db, schema } from "@nuxthub/db";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);

  const [video] = await db
    .select({ id: schema.video.id })
    .from(schema.video)
    .where(eq(schema.video.youtubeId, youtubeId))
    .limit(1);

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  const sentences = await db
    .select({
      id: schema.videoTranscriptSentence.id,
      sentenceIndex: schema.videoTranscriptSentence.sentenceIndex,
    })
    .from(schema.videoTranscriptSentence)
    .where(eq(schema.videoTranscriptSentence.videoId, video.id))
    .orderBy(asc(schema.videoTranscriptSentence.sentenceIndex));

  if (!sentences.length) {
    return { success: true, count: 0 };
  }

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i]!.sentenceIndex === i) continue;

    await db
      .update(schema.videoTranscriptSentence)
      .set({ sentenceIndex: i })
      .where(eq(schema.videoTranscriptSentence.id, sentences[i]!.id));
  }

  return { success: true, count: sentences.length };
});
