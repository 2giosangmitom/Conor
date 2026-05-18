import {
  getInfo,
  checkDuration,
  checkLanguage,
  generateTranscript,
  analyzeVideo,
  persistVideoIndex,
  clearWorkflowState,
  finalizeIndexing,
  logIndexStart,
  logIndexComplete,
  logIndexFailed,
} from "./steps";
import { getWorkflowMetadata } from "workflow";

export async function handleIndexVideo(youtubeId: string) {
  "use workflow";

  const { workflowRunId } = getWorkflowMetadata();

  const abort = async (reason: string) => {
    await logIndexFailed(reason);
    await clearWorkflowState(youtubeId, workflowRunId);
    await finalizeIndexing();
  };

  try {
    await logIndexStart();

    const info = await getInfo(youtubeId);

    const durationError = await checkDuration(info);
    if (durationError) {
      await abort(durationError);
      return null;
    }

    const languageError = await checkLanguage(info);
    if (languageError) {
      await abort(languageError);
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

    await logIndexComplete();
    await clearWorkflowState(youtubeId, workflowRunId);
    await finalizeIndexing();

    return video;
  } catch (error) {
    await logIndexFailed(error instanceof Error ? error.message : "Unknown error");
    await clearWorkflowState(youtubeId, workflowRunId);
    await finalizeIndexing();
    throw error;
  }
}
