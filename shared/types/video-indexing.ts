export const VideoIndexingStepCode = {
  // Workflow lifecycle
  IndexStart: "INDEX_START",
  IndexComplete: "INDEX_COMPLETE",
  IndexFailed: "INDEX_FAILED",
  // Steps
  FetchDataStart: "FETCH_DATA_START",
  FetchDataComplete: "FETCH_DATA_COMPLETE",
  CheckDurationStart: "CHECK_DURATION_START",
  CheckDurationComplete: "CHECK_DURATION_COMPLETE",
  CheckDurationFailed: "CHECK_DURATION_FAILED",
  CheckLanguageStart: "CHECK_LANGUAGE_START",
  CheckLanguageComplete: "CHECK_LANGUAGE_COMPLETE",
  CheckLanguageFailed: "CHECK_LANGUAGE_FAILED",
  GenerateTranscriptStart: "GENERATE_TRANSCRIPT_START",
  GenerateTranscriptComplete: "GENERATE_TRANSCRIPT_COMPLETE",
  GenerateTranscriptFailed: "GENERATE_TRANSCRIPT_FAILED",
  AnalyzeVideoStart: "ANALYZE_VIDEO_START",
  AnalyzeVideoComplete: "ANALYZE_VIDEO_COMPLETE",
  PersistVideoStart: "PERSIST_VIDEO_START",
  PersistVideoComplete: "PERSIST_VIDEO_COMPLETE",
} as const;

export type VideoIndexingStepCode =
  (typeof VideoIndexingStepCode)[keyof typeof VideoIndexingStepCode];

export interface VideoIndexingLog {
  level: "info" | "error";
  code: VideoIndexingStepCode;
  timestamp: string;
  reason?: string;
}
