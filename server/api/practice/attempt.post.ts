import { z } from "zod";
import { db, schema } from "@nuxthub/db";
import { defineProtectedEventHandler } from "~~/server/utils/auth";
import type { H3Event } from "h3";

const bodySchema = z.object({
  practiceSessionId: z.string().min(1),
  transcriptSentenceId: z.string().min(1),
  expectedText: z.string().min(1),
  userText: z.string().min(1),
  accuracy: z.number().int().min(0).max(100),
  hintsUsed: z.number().int().min(0).optional(),
  timeTaken: z.number().int().min(0).optional(),
});

export default defineProtectedEventHandler(async (event: H3Event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const [attempt] = await db
    .insert(schema.practiceAttempt)
    .values({
      practiceSessionId: body.practiceSessionId,
      transcriptSentenceId: body.transcriptSentenceId,
      expectedText: body.expectedText,
      userText: body.userText,
      accuracy: body.accuracy,
      hintsUsed: body.hintsUsed ?? 0,
      timeTaken: body.timeTaken ?? 0,
    })
    .returning();

  if (!attempt) {
    throw createError({ statusCode: 500, statusMessage: "PRACTICE_ATTEMPT_CREATION_FAILED" });
  }

  setResponseStatus(event, 201);
  return attempt;
});
