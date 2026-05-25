import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { defineAdminEventHandler } from "~~/server/utils/admin";

const paramSchema = z.object({
  youtubeId: z.string().min(1).max(20),
});

const bodySchema = z.object({
  title: z.string().trim().min(1).max(300),
  topic: z.string().trim().min(1).max(100),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  duration: z.number().int().min(1),
  thumbnailUrl: z.string().trim().min(1).max(500),
});

export default defineAdminEventHandler(async (event) => {
  const { youtubeId } = await getValidatedRouterParams(event, paramSchema.parse);
  const body = await readValidatedBody(event, bodySchema.parse);

  const [video] = await db
    .update(schema.video)
    .set({
      title: body.title,
      topic: body.topic,
      level: body.level,
      duration: body.duration,
      thumbnailUrl: body.thumbnailUrl,
    })
    .where(eq(schema.video.youtubeId, youtubeId))
    .returning();

  if (!video) {
    throw createError({ statusCode: 404, statusMessage: "Video not found" });
  }

  return video;
});
