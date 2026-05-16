export enum VideoIndexingEventCode {
  IndexingStarted = "indexing_started",
  FetchingMetadata = "fetching_metadata",
  CheckingDuration = "checking_duration",
  CheckingLanguage = "checking_language",
  GeneratingTranscript = "generating_transcript",
  AnalyzingVideo = "analyzing_video",
  PersistingVideo = "persisting_video",
  PersistedVideo = "persisted_video",
  IndexingCompleted = "indexing_completed",
  IndexingFailed = "indexing_failed",
}

export interface VideoIndexingLog {
  level: "info" | "error";
  code: VideoIndexingEventCode;
  timestamp: string;
}
