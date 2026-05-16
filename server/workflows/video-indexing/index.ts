import {
  getInfo,
  checkDuration,
  checkLanguage,
  generateTranscript,
  analyzeVideo,
  persistVideoIndex,
  logIndexing,
  clearIndexingRun,
  finalizeIndexing,
} from "./steps";
import { FatalError } from "workflow";
import { VideoIndexingEventCode } from "~~/shared/types/video-indexing";

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  try {
    await logIndexing({
      level: "info",
      code: VideoIndexingEventCode.IndexingStarted,
    });
    const info = await getInfo(youtubeId);
    await checkDuration(info);
    await checkLanguage(info);
    const subtitles = await generateTranscript(info);
    const analysis = await analyzeVideo(subtitles, {
      title: info.title,
      tags: info.tags,
    });
    const video = await persistVideoIndex({
      youtubeId,
      info,
      analysis,
      subtitles,
    });
    await logIndexing({
      level: "info",
      code: VideoIndexingEventCode.IndexingCompleted,
    });
    await clearIndexingRun(youtubeId);
    await finalizeIndexing();

    return video;
  } catch (error) {
    await logIndexing({
      level: "error",
      code: VideoIndexingEventCode.IndexingFailed,
    });
    await clearIndexingRun(youtubeId);
    await finalizeIndexing();
    throw new FatalError(error instanceof Error ? error.message : "Unknown error");
  }
}
