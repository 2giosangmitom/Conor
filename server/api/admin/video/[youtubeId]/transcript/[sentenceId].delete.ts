import { db, schema } from "@nuxthub/db";
import { and, asc, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
  sentenceId: z.string().uuid(),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId, sentenceId } = await getValidatedRouterParams(event, paramSchema.parse);

  const [video] = await db
    .select({ id: schema.video.id })
    .from(schema.video)
    .where(eq(schema.video.youtubeId, youtubeId))
    .limit(1);

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  const [deleted] = await db
    .delete(schema.videoTranscriptSentence)
    .where(eq(schema.videoTranscriptSentence.id, sentenceId))
    .returning();

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "Sentence not found" });
  }

  const { sentenceIndex: oldIndex } = deleted;

  const laterSentences = await db
    .select({
      id: schema.videoTranscriptSentence.id,
      sentenceIndex: schema.videoTranscriptSentence.sentenceIndex,
    })
    .from(schema.videoTranscriptSentence)
    .where(
      and(
        eq(schema.videoTranscriptSentence.videoId, video.id),
        gt(schema.videoTranscriptSentence.sentenceIndex, oldIndex),
      ),
    )
    .orderBy(asc(schema.videoTranscriptSentence.sentenceIndex));

  for (const s of laterSentences) {
    await db
      .update(schema.videoTranscriptSentence)
      .set({ sentenceIndex: s.sentenceIndex - 1 })
      .where(eq(schema.videoTranscriptSentence.id, s.id));
  }

  return { success: true };
});
