import { db, schema } from "@nuxthub/db";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);

  const rows = await db
    .select()
    .from(schema.video)
    .leftJoin(
      schema.videoTranscriptSentence,
      eq(schema.video.id, schema.videoTranscriptSentence.videoId),
    )
    .where(eq(schema.video.youtubeId, youtubeId))
    .orderBy(asc(schema.videoTranscriptSentence.sentenceIndex));

  if (!rows.length) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  const video = rows[0]!.video;
  const sentences = rows
    .map((row) => row.video_transcript_sentence)
    .filter((s): s is NonNullable<typeof s> => s !== null);

  return { video, sentences };
});
