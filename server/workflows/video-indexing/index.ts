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

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  try {
    await logIndexing({
      level: "info",
      step: "workflow",
      message: "Indexing started",
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
      step: "workflow",
      message: "Indexing completed",
    });
    await clearIndexingRun(youtubeId);
    await finalizeIndexing();

    return video;
  } catch (error) {
    await logIndexing({
      level: "error",
      step: "workflow",
      message: "Indexing failed",
    });
    await clearIndexingRun(youtubeId);
    await finalizeIndexing();
    throw new FatalError(error instanceof Error ? error.message : "Unknown error");
  }
}
