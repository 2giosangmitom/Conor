import { getWritable } from "workflow";
import { getInfo, validateVideoInfo, analyzeVideo, persistVideoIndex } from "./steps";
import { VideoIndexingStepCode } from "../../../shared/types/video-indexing";
import { kv } from "@nuxthub/kv";

const STREAM_NAMESPACE = "logs";
const INDEXING_KEY_PREFIX = "video-indexing:";

export async function emitLogEntry(entry: Omit<VideoIndexingLog, "timestamp">): Promise<void> {
  "use step";
  const log: VideoIndexingLog = { ...entry, timestamp: new Date().toISOString() };
  const writable = getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE });
  const writer = writable.getWriter();
  try {
    await writer.write(log);
  } finally {
    writer.releaseLock();
  }
}

export async function closeLogStream(): Promise<void> {
  "use step";
  await getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }).close();
}

export async function clearIndexingKey(youtubeId: string): Promise<void> {
  "use step";
  await kv.del(`${INDEXING_KEY_PREFIX}${youtubeId}`);
}

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  const abort = async (reason: string) => {
    await emitLogEntry({ level: "error", code: VideoIndexingStepCode.IndexFailed, reason });
    await closeLogStream();
  };

  try {
    await emitLogEntry({ level: "info", code: VideoIndexingStepCode.IndexStart });

    const { info, transcript } = await getInfo(youtubeId);

    const validation = await validateVideoInfo(info);
    if (!validation.ok) {
      await abort(validation.reason);
      return null;
    }

    const analysis = await analyzeVideo(transcript, { title: info.title, tags: info.tags });
    const video = await persistVideoIndex({
      youtubeId,
      info,
      analysis,
      subtitles: transcript,
    });

    await emitLogEntry({ level: "info", code: VideoIndexingStepCode.IndexComplete });
    await closeLogStream();

    return video;
  } catch (error) {
    await emitLogEntry({
      level: "error",
      code: VideoIndexingStepCode.IndexFailed,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
    await closeLogStream();
    throw error;
  } finally {
    await clearIndexingKey(youtubeId);
  }
}
