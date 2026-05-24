import {
  getInfo,
  validateVideoInfo,
  analyzeVideo,
  persistVideoIndex,
  emitLogEntry,
  closeLogStream,
} from "./steps";
import { VideoIndexingStepCode } from "../../../shared/types/video-indexing";
import { kv } from "@nuxthub/kv";

const INDEXING_KEY_PREFIX = "video-indexing:";

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
