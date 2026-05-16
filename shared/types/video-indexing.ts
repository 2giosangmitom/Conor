export const VideoIndexingEventCode = {
  IndexingStarted: "indexing_started",
  FetchingMetadata: "fetching_metadata",
  CheckingDuration: "checking_duration",
  CheckingLanguage: "checking_language",
  GeneratingTranscript: "generating_transcript",
  AnalyzingVideo: "analyzing_video",
  PersistingVideo: "persisting_video",
  PersistedVideo: "persisted_video",
  IndexingCompleted: "indexing_completed",
  IndexingFailed: "indexing_failed",
} as const;

export type VideoIndexingEventCode =
  (typeof VideoIndexingEventCode)[keyof typeof VideoIndexingEventCode];

export interface VideoIndexingLog {
  level: "info" | "error";
  code: VideoIndexingEventCode;
  timestamp: string;
}
