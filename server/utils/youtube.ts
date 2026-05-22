import { fetchTranscript } from "youtube-transcript-plus";
import type { TranscriptResult } from "youtube-transcript-plus";

export async function getYouTubeVideoInfo(youtubeId: string): Promise<TranscriptResult> {
  return fetchTranscript(youtubeId, { lang: "en", videoDetails: true });
}
