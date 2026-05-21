import { getRun } from "workflow/api";
import { z } from "zod";

const paramSchema = z.object({
  run_id: z.string().min(1),
});

const STREAM_NAMESPACE = "logs";

export default defineEventHandler(async (event) => {
  const { run_id: runId } = await getValidatedRouterParams(event, paramSchema.parse);

  const run = getRun(runId);
  if (!(await run.exists)) {
    throw createError({ statusCode: 410, message: "Workflow run has already completed" });
  }

  const eventStream = createEventStream(event);

  const stream = async () => {
    const reader = run.getReadable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }).getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        await eventStream.push({ event: "log", data: JSON.stringify(value) });
      }
    } finally {
      reader.releaseLock();
    }
    await eventStream.push({ event: "done", data: "{}" });
    await eventStream.close();
  };

  eventStream.onClosed(async () => {
    await eventStream.close();
  });

  void stream();

  return eventStream.send();
});
