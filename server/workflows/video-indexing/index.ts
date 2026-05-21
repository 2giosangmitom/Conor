import {
  getInfo,
  validateVideoInfo,
  generateTranscript,
  analyzeVideo,
  persistVideoIndex,
  closeLogStream,
  emitLogEntry,
  clearIndexingKey,
} from "./steps";
import { VideoIndexingStepCode } from "../../../shared/types/video-indexing";

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  const abort = async (reason: string) => {
    await emitLogEntry({ level: "error", code: VideoIndexingStepCode.IndexFailed, reason });
    await closeLogStream();
  };

  try {
    await emitLogEntry({ level: "info", code: VideoIndexingStepCode.IndexStart });

    const info = await getInfo(youtubeId);

    const validation = await validateVideoInfo(info);
    if (!validation.ok) {
      await abort(validation.reason);
      return null;
    }

    const transcriptResult = await generateTranscript(info);
    if (typeof transcriptResult === "string") {
      await abort(transcriptResult);
      return null;
    }

    const analysis = await analyzeVideo(transcriptResult, { title: info.title, tags: info.tags });
    const video = await persistVideoIndex({
      youtubeId,
      info,
      analysis,
      subtitles: transcriptResult,
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
