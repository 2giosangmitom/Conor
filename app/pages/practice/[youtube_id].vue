<script setup lang="ts">
import Dexie, { type Table } from "dexie";
import { VideoIndexingStepCode, type VideoIndexingLog } from "~~/shared/types/video-indexing";
import { useSession } from "~/utils/auth";

definePageMeta({
  layout: "practice",
});

interface VideoInfo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  thumbnailUrl: string;
}

interface VideoSentence {
  id: string;
  videoId: string;
  sentenceIndex: number;
  startTime: number;
  endTime: number;
  text: string;
}

interface PracticeAttemptDraft {
  sentenceId: string;
  userText: string;
  accuracy: number;
  hintsUsed: number;
  timeTaken: number;
}

interface PracticeLocalSession {
  youtubeId: string;
  currentSentenceIndex: number;
  attempts: PracticeAttemptDraft[];
  updatedAt: string;
}

interface PracticeSessionResponse {
  practice_session: {
    id: string;
    currentSentenceIndex: number;
    completed: boolean;
    score: number;
    lastPracticedAt: string;
  };
  video: {
    youtubeId: string;
  };
}

interface PracticeSessionRecord {
  id: string;
  currentSentenceIndex: number;
  completed: boolean;
  score: number;
  lastPracticedAt: string;
}

type StepStatus = "pending" | "running" | "done" | "failed";

interface LoaderStep {
  id: string;
  label: string;
  status: StepStatus;
}

type AnswerStatus = "idle" | "checking" | "correct" | "incorrect";

const route = useRoute();
const { data: session } = await useSession(useFetch);

const youtubeId = computed(() => String(route.params.youtube_id ?? ""));
const isSignedIn = computed(() => Boolean(session.value?.user));

const runId = ref<string | null>(null);
const isIndexing = ref(false);
const isReady = ref(false);
const isFailed = ref(false);
const errorReason = ref<string | null>(null);
const connectionIssue = ref<string | null>(null);
const lastLog = ref<VideoIndexingLog | null>(null);
const hasTerminalFailure = ref(false);

const video = shallowRef<VideoInfo | null>(null);
const sentences = shallowRef<VideoSentence[]>([]);

const stepTemplate: LoaderStep[] = [
  { id: "fetchData", label: "Tải dữ liệu video", status: "pending" },
  { id: "checkDuration", label: "Kiểm tra độ dài", status: "pending" },
  { id: "checkLanguage", label: "Kiểm tra ngôn ngữ", status: "pending" },
  { id: "generateTranscript", label: "Tạo transcript", status: "pending" },
  { id: "analyzeVideo", label: "Phân tích nội dung", status: "pending" },
  { id: "persistVideo", label: "Lưu vào hệ thống", status: "pending" },
  { id: "complete", label: "Hoàn tất lập chỉ mục", status: "pending" },
];

const steps = ref<LoaderStep[]>(stepTemplate.map((step) => ({ ...step })));

const statusText: Record<StepStatus, string> = {
  pending: "Đang chờ",
  running: "Đang chạy",
  done: "Hoàn tất",
  failed: "Thất bại",
};

const statusColor: Record<StepStatus, string> = {
  pending: "text-muted",
  running: "text-primary",
  done: "text-success",
  failed: "text-error",
};

const statusIcon: Record<StepStatus, string> = {
  pending: "i-lucide-circle",
  running: "i-lucide-loader-circle",
  done: "i-lucide-check-circle-2",
  failed: "i-lucide-x-circle",
};

const eventSource = shallowRef<EventSource | null>(null);

const { data: fetchResponse, refresh: refreshVideo } = await useAsyncData(
  () => `video-${youtubeId.value}`,
  () => $fetch.raw(`/api/video/${youtubeId.value}`),
  { server: false, immediate: true, watch: [youtubeId] },
);

interface PlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
}

const PLAYER_STATE_PLAYING = 1;
const PLAYER_STATE_PAUSED = 2;

const playerRef = ref<{ player?: PlayerLike } | null>(null);
const canPlay = ref(false);
const activeSentenceIndex = ref(0);
const answerInput = ref("");
const currentWords = ref<string[]>([]);
const answerWords = ref<string[]>([]);
const answerStatus = ref<AnswerStatus>("idle");
const hintCount = ref(0);
const attemptStart = ref<number | null>(null);
const replayCount = ref(0);
const isPlayingSegment = ref(false);
const resumeModalOpen = ref(false);
const hasResumeCandidate = ref(false);
const pendingResumeIndex = ref(0);
const pendingResumeDate = ref<string | null>(null);
const sessionId = ref<string | null>(null);
const sessionScore = ref(0);

class PracticeDb extends Dexie {
  sessions!: Table<PracticeLocalSession, string>;

  constructor() {
    super("nghego-practice");
    this.version(1).stores({
      sessions: "youtubeId",
    });
  }
}

const practiceDb = new PracticeDb();

const currentSentence = computed(() => sentences.value[activeSentenceIndex.value]);
const totalSentences = computed(() => sentences.value.length);
const completedCount = computed(() => Math.min(activeSentenceIndex.value, totalSentences.value));
const accuracy = computed(() => {
  if (completedCount.value === 0) return 0;
  return Math.round(sessionScore.value / completedCount.value);
});
const progressPercent = computed(() => {
  if (totalSentences.value === 0) return 0;
  return Math.round((completedCount.value / totalSentences.value) * 100);
});
const progressValue = computed(() => {
  const value = progressPercent.value;
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
});

const formattedTimeRange = computed(() => {
  if (!currentSentence.value) return "";
  return `${formatMs(currentSentence.value.startTime)} - ${formatMs(currentSentence.value.endTime)}`;
});

const wordCount = computed(() => currentWords.value.length);
const matchedWordCount = computed(() => {
  if (currentWords.value.length === 0) return 0;
  let matches = 0;
  currentWords.value.forEach((word, index) => {
    if (answerWords.value[index] === word) {
      matches += 1;
    }
  });
  return matches;
});

const showLoader = computed(() => isIndexing.value || isFailed.value || connectionIssue.value);
const showPractice = computed(
  () => isReady.value && Boolean(video.value) && sentences.value.length > 0,
);

function formatMs(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function resetLoader() {
  steps.value = stepTemplate.map((step) => ({ ...step }));
  runId.value = null;
  isIndexing.value = false;
  isReady.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  connectionIssue.value = null;
  lastLog.value = null;
}

function stopStream() {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
}

function markStepStatus(stepId: string, status: StepStatus) {
  const step = steps.value.find((item) => item.id === stepId);
  if (!step) return;
  step.status = status;
}

function markPreviousDone(stepId: string) {
  const index = steps.value.findIndex((item) => item.id === stepId);
  if (index < 0) return;
  for (let i = 0; i < index; i += 1) {
    if (steps.value[i]) {
      steps.value[i]!.status = "done";
    }
  }
}

function handleLogEntry(entry: VideoIndexingLog) {
  lastLog.value = entry;
  connectionIssue.value = null;

  const startMap: Record<string, string> = {
    [VideoIndexingStepCode.FetchDataStart]: "fetchData",
    [VideoIndexingStepCode.CheckDurationStart]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageStart]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptStart]: "generateTranscript",
    [VideoIndexingStepCode.AnalyzeVideoStart]: "analyzeVideo",
    [VideoIndexingStepCode.PersistVideoStart]: "persistVideo",
  };

  const completeMap: Record<string, string> = {
    [VideoIndexingStepCode.FetchDataComplete]: "fetchData",
    [VideoIndexingStepCode.CheckDurationComplete]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageComplete]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptComplete]: "generateTranscript",
    [VideoIndexingStepCode.AnalyzeVideoComplete]: "analyzeVideo",
    [VideoIndexingStepCode.PersistVideoComplete]: "persistVideo",
    [VideoIndexingStepCode.IndexComplete]: "complete",
  };

  const failedMap: Record<string, string> = {
    [VideoIndexingStepCode.CheckDurationFailed]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageFailed]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptFailed]: "generateTranscript",
    [VideoIndexingStepCode.IndexFailed]: "complete",
  };

  const startStep = startMap[entry.code];
  if (startStep) {
    markPreviousDone(startStep);
    markStepStatus(startStep, "running");
  }

  const completeStep = completeMap[entry.code];
  if (completeStep) {
    markPreviousDone(completeStep);
    markStepStatus(completeStep, "done");
  }

  const failedStep = failedMap[entry.code];
  if (failedStep) {
    markPreviousDone(failedStep);
    markStepStatus(failedStep, "failed");
    isFailed.value = true;
    isIndexing.value = false;
    hasTerminalFailure.value = true;
    errorReason.value = entry.reason ?? "Lỗi không xác định";
    stopStream();
  }
}

function startStream(id: string) {
  stopStream();
  if (!id) return;

  const source = new EventSource(`/api/workflow/${id}`);
  eventSource.value = source;

  source.addEventListener("log", (event) => {
    try {
      const payload = JSON.parse((event as MessageEvent).data) as VideoIndexingLog;
      handleLogEntry(payload);
    } catch {
      connectionIssue.value = "Không đọc được dữ liệu từ máy chủ.";
    }
  });

  source.addEventListener("done", async () => {
    stopStream();
    isIndexing.value = false;
    if (hasTerminalFailure.value) return;
    await refreshVideo();
  });

  source.addEventListener("error", () => {
    if (hasTerminalFailure.value) return;
    connectionIssue.value = "Mất kết nối tới tiến trình xử lý.";
  });
}

function setReadyState(payload: { video: VideoInfo; sentences: VideoSentence[] }) {
  video.value = payload.video;
  sentences.value = payload.sentences;
  isReady.value = true;
  isIndexing.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  stopStream();
}

function setIndexingState(payload: { runId: string }) {
  isIndexing.value = true;
  isReady.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  runId.value = payload.runId;
  startStream(payload.runId);
}

function setFailedState(message: string) {
  isFailed.value = true;
  isReady.value = false;
  isIndexing.value = false;
  hasTerminalFailure.value = true;
  errorReason.value = message;
  stopStream();
}

async function retryIndexing() {
  resetLoader();
  await refreshVideo();
}

async function loadResumeCandidate() {
  if (!video.value) return;
  if (isSignedIn.value) {
    const response = await $fetch<PracticeSessionResponse[]>(
      `/api/practice/${video.value.youtubeId}`,
      {
        query: { lastest: true },
      },
    ).catch(() => []);

    const latest = response[0];
    if (latest?.practice_session && !latest.practice_session.completed) {
      hasResumeCandidate.value = true;
      pendingResumeIndex.value = latest.practice_session.currentSentenceIndex;
      pendingResumeDate.value = latest.practice_session.lastPracticedAt;
      sessionId.value = latest.practice_session.id;
      sessionScore.value = latest.practice_session.score;
      resumeModalOpen.value = true;
      return;
    }
  } else {
    const localSession = await practiceDb.sessions.get(video.value.youtubeId);
    if (localSession) {
      hasResumeCandidate.value = true;
      pendingResumeIndex.value = localSession.currentSentenceIndex;
      pendingResumeDate.value = localSession.updatedAt;
      resumeModalOpen.value = true;
      return;
    }
  }

  await startNewSession();
}

async function startNewSession() {
  resumeModalOpen.value = false;
  hasResumeCandidate.value = false;
  pendingResumeIndex.value = 0;
  pendingResumeDate.value = null;

  if (isSignedIn.value) {
    const sessionRecord = await $fetch<PracticeSessionRecord>("/api/practice", {
      method: "POST",
      body: { youtubeId: youtubeId.value },
    });
    sessionId.value = sessionRecord.id;
    sessionScore.value = sessionRecord.score;
  } else if (video.value) {
    await practiceDb.sessions.delete(video.value.youtubeId);
    await practiceDb.sessions.put({
      youtubeId: video.value.youtubeId,
      currentSentenceIndex: 0,
      attempts: [],
      updatedAt: new Date().toISOString(),
    });
  }

  activeSentenceIndex.value = 0;
  answerInput.value = "";
  hintCount.value = 0;
  answerStatus.value = "idle";
  replayCount.value = 0;
  attemptStart.value = Date.now();
  canPlay.value = true;
  await playSegment();
}

async function resumeSession() {
  resumeModalOpen.value = false;
  if (hasResumeCandidate.value) {
    activeSentenceIndex.value = Math.min(pendingResumeIndex.value, totalSentences.value - 1);
  }

  if (!isSignedIn.value && video.value) {
    const localSession = await practiceDb.sessions.get(video.value.youtubeId);
    if (localSession?.attempts) {
      const attempt = localSession.attempts.find(
        (item) => item.sentenceId === currentSentence.value?.id,
      );
      if (attempt) {
        answerInput.value = attempt.userText;
      }
      if (localSession.currentSentenceIndex !== undefined) {
        activeSentenceIndex.value = Math.min(
          localSession.currentSentenceIndex,
          totalSentences.value - 1,
        );
      }
    }
  } else {
    await persistProgress();
  }

  attemptStart.value = Date.now();
  canPlay.value = true;
  await playSegment();
}

async function saveLocalProgress() {
  if (!video.value) return;
  const session = (await practiceDb.sessions.get(video.value.youtubeId)) ?? {
    youtubeId: video.value.youtubeId,
    currentSentenceIndex: activeSentenceIndex.value,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };

  session.currentSentenceIndex = activeSentenceIndex.value;
  session.updatedAt = new Date().toISOString();
  await practiceDb.sessions.put(session);
}

async function saveAttemptLocal(attempt: PracticeAttemptDraft) {
  if (!video.value) return;
  const session = (await practiceDb.sessions.get(video.value.youtubeId)) ?? {
    youtubeId: video.value.youtubeId,
    currentSentenceIndex: activeSentenceIndex.value,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = session.attempts.findIndex(
    (item) => item.sentenceId === attempt.sentenceId,
  );
  if (existingIndex >= 0) {
    session.attempts[existingIndex] = attempt;
  } else {
    session.attempts.push(attempt);
  }

  session.currentSentenceIndex = activeSentenceIndex.value;
  session.updatedAt = new Date().toISOString();
  await practiceDb.sessions.put(session);
}

async function persistProgress() {
  if (isSignedIn.value) {
    const response = await $fetch<PracticeSessionRecord>("/api/practice/progress", {
      method: "POST",
      body: {
        youtubeId: youtubeId.value,
        currentSentenceIndex: activeSentenceIndex.value,
        completed: activeSentenceIndex.value >= totalSentences.value - 1,
        score: sessionScore.value,
      },
    });
    sessionId.value = response.id;
    sessionScore.value = response.score;
  } else {
    await saveLocalProgress();
  }
}

async function persistAttempt(accuracyValue: number, userText: string) {
  if (!currentSentence.value) return;
  const attempt: PracticeAttemptDraft = {
    sentenceId: currentSentence.value.id,
    userText,
    accuracy: accuracyValue,
    hintsUsed: hintCount.value,
    timeTaken: attemptStart.value
      ? Math.max(0, Math.round((Date.now() - attemptStart.value) / 1000))
      : 0,
  };

  if (isSignedIn.value && sessionId.value) {
    await $fetch("/api/practice/attempt", {
      method: "POST",
      body: {
        practiceSessionId: sessionId.value,
        transcriptSentenceId: currentSentence.value.id,
        expectedText: currentSentence.value.text,
        userText,
        accuracy: accuracyValue,
        hintsUsed: hintCount.value,
        timeTaken: attempt.timeTaken,
      },
    });
  } else {
    await saveAttemptLocal(attempt);
  }
}

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]/g, "");
}

function splitWords(text: string) {
  if (!text) return [];
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .split(" ")
    .filter((word) => word.length > 0);
}

function calculateAccuracy(expected: string, actual: string) {
  if (!expected) return 0;
  const expectedWords = expected.split(" ");
  const actualWords = actual.split(" ");
  let matchCount = 0;

  expectedWords.forEach((word, index) => {
    if (actualWords[index] === word) {
      matchCount += 1;
    }
  });

  return Math.round((matchCount / expectedWords.length) * 100);
}

async function checkAnswer() {
  if (!currentSentence.value) return;
  answerStatus.value = "checking";
  const expected = normalizeText(currentSentence.value.text);
  const actual = normalizeText(answerInput.value);
  const accuracyValue = calculateAccuracy(expected, actual);
  if (!Number.isFinite(accuracyValue)) {
    answerStatus.value = "incorrect";
    return;
  }
  sessionScore.value += accuracyValue;
  answerStatus.value = accuracyValue >= 90 ? "correct" : "incorrect";
  await persistAttempt(accuracyValue, answerInput.value);
  await persistProgress();
}

async function moveToSentence(index: number) {
  const safeIndex = Math.min(Math.max(index, 0), totalSentences.value - 1);
  activeSentenceIndex.value = safeIndex;
  answerInput.value = "";
  answerWords.value = [];
  answerStatus.value = "idle";
  hintCount.value = 0;
  replayCount.value = 0;
  attemptStart.value = Date.now();
  canPlay.value = true;
  await persistProgress();
  await playSegment();
}

async function nextSentence() {
  if (activeSentenceIndex.value >= totalSentences.value - 1) return;
  await moveToSentence(activeSentenceIndex.value + 1);
}

async function prevSentence() {
  if (activeSentenceIndex.value <= 0) return;
  await moveToSentence(activeSentenceIndex.value - 1);
}

async function replaySentence() {
  replayCount.value = 0;
  await playSegment();
}

async function playSegment() {
  if (!currentSentence.value) return;
  if (!canPlay.value) return;
  const player = playerRef.value?.player;
  if (!player) return;
  isPlayingSegment.value = true;
  player.seekTo(currentSentence.value.startTime / 1000, true);
  player.playVideo();
}

function handlePlayerState(event: { data: number }) {
  if (!currentSentence.value) return;
  if (event.data === PLAYER_STATE_PLAYING) {
    return;
  }

  if (event.data === PLAYER_STATE_PAUSED && isPlayingSegment.value) {
    return;
  }
}

async function handleTimeUpdate() {
  if (!currentSentence.value) return;
  const player = playerRef.value?.player;
  if (!player) return;
  if (!isPlayingSegment.value) return;
  const currentTime = player.getCurrentTime();
  const endTime = currentSentence.value.endTime / 1000;
  if (currentTime < endTime) return;

  if (replayCount.value < 2) {
    replayCount.value += 1;
    player.seekTo(currentSentence.value.startTime / 1000, true);
    player.playVideo();
  } else {
    replayCount.value = 2;
    player.pauseVideo();
    isPlayingSegment.value = false;
  }
}

function handlePlayerReady() {
  if (canPlay.value) {
    void playSegment();
  }
}

function getAttemptStatus(index: number) {
  if (index < activeSentenceIndex.value) return "done";
  if (index === activeSentenceIndex.value) return "current";
  return "pending";
}

const currentStepLabel = computed(() => {
  const running = steps.value.find((step) => step.status === "running");
  if (running) return running.label;
  if (isFailed.value) return "Đã dừng do lỗi";
  if (isReady.value) return "Sẵn sàng luyện tập";
  return "Đang chờ tiến trình";
});

watch(
  () => fetchResponse.value,
  (response) => {
    if (!response) return;
    if (response.status === 200) {
      const payload = response._data as { video: VideoInfo; sentences: VideoSentence[] };
      setReadyState(payload);
      return;
    }
    if (response.status === 202) {
      const payload = response._data as { runId: string };
      if (hasTerminalFailure.value) return;
      setIndexingState(payload);
      return;
    }
    setFailedState("Không thể tải thông tin video.");
  },
  { immediate: true },
);

watch(
  () => isReady.value,
  async (ready) => {
    if (!ready) return;
    await loadResumeCandidate();
  },
);

watch(
  () => currentSentence.value?.text,
  (value) => {
    currentWords.value = value ? splitWords(value) : [];
    answerWords.value = splitWords(answerInput.value);
  },
  { immediate: true },
);

watch(
  () => answerInput.value,
  (value) => {
    answerWords.value = splitWords(value);
  },
);

watch(
  () => currentSentence.value,
  () => {
    replayCount.value = 0;
    attemptStart.value = Date.now();
  },
);

watch(
  () => youtubeId.value,
  () => {
    resetLoader();
  },
);

const intervalId = ref<number | null>(null);

onMounted(() => {
  intervalId.value = window.setInterval(() => {
    void handleTimeUpdate();
  }, 300);
});

onBeforeUnmount(() => {
  stopStream();
  if (intervalId.value !== null) {
    window.clearInterval(intervalId.value);
  }
});
</script>

<template>
  <div>
    <div class="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <UCard v-if="showLoader" class="border-muted/40 backdrop-blur">
        <template #header>
          <div class="flex flex-col gap-2">
            <UBadge variant="soft" color="primary" class="w-fit">
              Luyện tập với video YouTube
            </UBadge>
            <h1 class="text-2xl font-semibold">Chuẩn bị bài luyện tập</h1>
            <p class="text-sm text-muted">
              Video ID: <span class="font-medium text-foreground">{{ youtubeId }}</span>
            </p>
          </div>
        </template>

        <div class="space-y-6">
          <div class="flex flex-col gap-2" aria-live="polite">
            <div class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-activity" class="size-4 text-primary" />
              <span>Trạng thái hiện tại: {{ currentStepLabel }}</span>
            </div>
            <div v-if="runId" class="text-xs text-muted">Run ID: {{ runId }}</div>
          </div>

          <div class="space-y-3">
            <div
              v-for="step in steps"
              :key="step.id"
              class="flex items-center justify-between rounded-lg border border-muted/40 bg-background/70 px-4 py-3"
            >
              <div class="flex items-center gap-3">
                <UIcon
                  :name="statusIcon[step.status]"
                  class="size-5"
                  :class="[
                    statusColor[step.status],
                    step.status === 'running' ? 'animate-spin' : '',
                  ]"
                />
                <span class="text-sm font-medium">{{ step.label }}</span>
              </div>
              <UBadge
                variant="soft"
                size="sm"
                :color="step.status === 'failed' ? 'error' : 'primary'"
              >
                {{ statusText[step.status] }}
              </UBadge>
            </div>
          </div>

          <UAlert
            v-if="isFailed"
            title="Không thể lập chỉ mục video"
            color="error"
            icon="i-lucide-triangle-alert"
          >
            <template #description>
              <span>Lý do: {{ errorReason }}</span>
            </template>
          </UAlert>

          <UAlert
            v-if="connectionIssue"
            title="Kết nối bị gián đoạn"
            color="warning"
            icon="i-lucide-wifi-off"
          >
            <template #description>
              <span>{{ connectionIssue }}</span>
            </template>
          </UAlert>

          <div class="flex flex-wrap gap-3">
            <UButton
              v-if="isFailed || connectionIssue"
              color="primary"
              variant="solid"
              @click="retryIndexing"
            >
              Thử lại
            </UButton>
            <UButton to="/" variant="ghost">Quay về trang chủ</UButton>
          </div>
        </div>
      </UCard>

      <div v-else-if="showPractice" class="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div class="space-y-6">
          <UCard class="border-muted/40 bg-background/80">
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted">Video</p>
                  <h1 class="text-xl font-semibold">{{ video?.title }}</h1>
                  <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <UBadge variant="soft" color="primary">{{ video?.topic }}</UBadge>
                    <span>Segment {{ activeSentenceIndex + 1 }} / {{ totalSentences }}</span>
                    <span>{{ formattedTimeRange }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <UBadge variant="outline">{{ wordCount }} từ</UBadge>
                  <UBadge variant="soft" color="success">
                    Đúng {{ matchedWordCount }}/{{ wordCount }}
                  </UBadge>
                </div>
              </div>
            </template>

            <div class="relative aspect-video overflow-hidden rounded-lg border border-muted/40">
              <ScriptYouTubePlayer
                ref="playerRef"
                :video-id="youtubeId"
                :player-options="{ host: 'https://www.youtube-nocookie.com' }"
                class="absolute inset-0"
                @ready="handlePlayerReady"
                @state-change="handlePlayerState"
              >
                <template #awaitingLoad>
                  <div class="flex h-full w-full items-center justify-center bg-muted/40">
                    <div class="text-center">
                      <UIcon name="i-lucide-play" class="mx-auto size-10 text-muted" />
                      <p class="mt-2 text-sm text-muted">Nhấn để tải video</p>
                    </div>
                  </div>
                </template>
                <template #loading>
                  <div class="flex h-full w-full items-center justify-center bg-muted/40">
                    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
                  </div>
                </template>
              </ScriptYouTubePlayer>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div class="text-sm text-muted">
                Lặp lại {{ replayCount + 1 }}/3 · Accuracy {{ accuracy }}%
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <UButton
                  variant="soft"
                  color="neutral"
                  icon="i-lucide-chevron-left"
                  :disabled="activeSentenceIndex === 0"
                  @click="prevSentence"
                >
                  Prev
                </UButton>
                <UButton
                  variant="soft"
                  color="primary"
                  icon="i-lucide-repeat"
                  @click="replaySentence"
                >
                  Replay
                </UButton>
                <UButton
                  variant="soft"
                  color="neutral"
                  trailing-icon="i-lucide-chevron-right"
                  :disabled="activeSentenceIndex >= totalSentences - 1"
                  @click="nextSentence"
                >
                  Next
                </UButton>
              </div>
            </div>
          </UCard>

          <UCard class="border-muted/40 bg-background/80">
            <template #header>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-wide text-muted">Type what you hear</p>
                  <h2 class="text-lg font-semibold">Nhập câu bạn nghe được</h2>
                </div>
                <UBadge
                  variant="soft"
                  :color="
                    answerStatus === 'correct'
                      ? 'success'
                      : answerStatus === 'incorrect'
                        ? 'error'
                        : 'primary'
                  "
                >
                  {{
                    answerStatus === "correct"
                      ? "Chính xác"
                      : answerStatus === "incorrect"
                        ? "Chưa đúng"
                        : "Đang luyện"
                  }}
                </UBadge>
              </div>
            </template>

            <div class="space-y-4">
              <UTextarea
                v-model="answerInput"
                placeholder="Nghe đoạn này rồi nhập lại nội dung..."
                :rows="4"
              />
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-xs text-muted">
                  <UIcon name="i-lucide-headphones" class="size-4" />
                  <span>Segment {{ activeSentenceIndex + 1 }}</span>
                  <span>•</span>
                  <span>{{ matchedWordCount }}/{{ wordCount }} từ đúng</span>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-lightbulb"
                    @click="hintCount += 1"
                  >
                    Hint
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-skip-forward"
                    @click="nextSentence"
                  >
                    Skip
                  </UButton>
                  <UButton
                    color="primary"
                    :loading="answerStatus === 'checking'"
                    @click="checkAnswer"
                  >
                    Check answer
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard class="border-muted/40 bg-background/80">
            <template #header>
              <h3 class="text-lg font-semibold">Session stats</h3>
            </template>
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-lg border border-muted/40 p-3 text-center">
                <p class="text-xs text-muted">Accuracy</p>
                <p class="text-lg font-semibold">{{ accuracy }}%</p>
              </div>
              <div class="rounded-lg border border-muted/40 p-3 text-center">
                <p class="text-xs text-muted">Done</p>
                <p class="text-lg font-semibold">{{ completedCount }}</p>
              </div>
              <div class="rounded-lg border border-muted/40 p-3 text-center">
                <p class="text-xs text-muted">Total</p>
                <p class="text-lg font-semibold">{{ totalSentences }}</p>
              </div>
            </div>
            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-xs text-muted">
                <span>Progress</span>
                <span>{{ progressPercent }}%</span>
              </div>
              <UProgress :model-value="progressValue" :max="100" animation="swing" size="sm" />
            </div>
          </UCard>

          <UCard class="border-muted/40 bg-background/80">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Segments</h3>
                <UBadge variant="soft" color="primary">{{ totalSentences }} total</UBadge>
              </div>
            </template>
            <div class="space-y-2 max-h-[460px] overflow-auto">
              <button
                v-for="sentence in sentences"
                :key="sentence.id"
                type="button"
                class="flex w-full items-center justify-between gap-3 rounded-lg border border-muted/40 px-3 py-2 text-left transition"
                :class="[
                  getAttemptStatus(sentence.sentenceIndex) === 'current'
                    ? 'bg-primary/10 border-primary/40'
                    : getAttemptStatus(sentence.sentenceIndex) === 'done'
                      ? 'bg-success/10 border-success/30'
                      : 'bg-background/60',
                ]"
                @click="moveToSentence(sentence.sentenceIndex)"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="size-2 rounded-full"
                    :class="[
                      getAttemptStatus(sentence.sentenceIndex) === 'current'
                        ? 'bg-primary'
                        : getAttemptStatus(sentence.sentenceIndex) === 'done'
                          ? 'bg-success'
                          : 'bg-muted',
                    ]"
                  />
                  <span class="text-sm">Segment {{ sentence.sentenceIndex + 1 }}</span>
                </div>
                <span class="text-xs text-muted">
                  {{ formatMs(sentence.startTime) }}
                </span>
              </button>
            </div>
          </UCard>
        </div>
      </div>
      <UCard v-else class="border-muted/40 backdrop-blur">
        <div class="space-y-3">
          <USkeleton class="h-6 w-1/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </UCard>
    </div>

    <UModal v-model:open="resumeModalOpen" title="Tiếp tục luyện tập?">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted">
            Bạn đang có phiên luyện tập chưa hoàn tất. Bạn muốn tiếp tục hay bắt đầu mới?
          </p>
          <div class="rounded-lg border border-muted/40 bg-muted/40 p-3 text-sm">
            <div class="flex items-center justify-between">
              <span>Segment gần nhất</span>
              <span class="font-semibold">{{ pendingResumeIndex + 1 }}</span>
            </div>
            <div v-if="pendingResumeDate" class="mt-2 text-xs text-muted">
              Lần cuối: {{ new Date(pendingResumeDate).toLocaleString() }}
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton color="primary" variant="solid" @click="resumeSession">Tiếp tục</UButton>
            <UButton variant="ghost" @click="startNewSession">Bắt đầu mới</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
