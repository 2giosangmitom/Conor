<script setup lang="ts">
import { VideoIndexingStepCode, type VideoIndexingLog } from "~~/shared/types/video-indexing";

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

type StepStatus = "pending" | "running" | "done" | "failed";

interface LoaderStep {
  id: string;
  label: string;
  status: StepStatus;
}

const route = useRoute();

const youtubeId = computed(() => String(route.params.youtube_id ?? ""));

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
  () => youtubeId.value,
  () => {
    resetLoader();
  },
);

onBeforeUnmount(() => {
  stopStream();
});

const currentStepLabel = computed(() => {
  const running = steps.value.find((step) => step.status === "running");
  if (running) return running.label;
  if (isFailed.value) return "Đã dừng do lỗi";
  if (isReady.value) return "Sẵn sàng luyện tập";
  return "Đang chờ tiến trình";
});

const showLoader = computed(() => isIndexing.value || isFailed.value || connectionIssue.value);
</script>

<template>
  <UMain>
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <UCard class="border-muted/40 backdrop-blur">
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

          <div v-if="showLoader" class="space-y-6">
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

          <div v-else-if="isReady" class="space-y-6">
            <UAlert title="Video đã sẵn sàng" color="success" icon="i-lucide-check-circle-2">
              <template #description>
                <span>Chúng tôi đã chuẩn bị xong bài luyện tập cho bạn.</span>
              </template>
            </UAlert>

            <div class="flex flex-col gap-4 rounded-lg border border-muted/40 bg-background/70 p-4">
              <div class="flex items-start gap-4">
                <NuxtImg
                  v-if="video?.thumbnailUrl"
                  :src="video.thumbnailUrl"
                  :alt="video.title"
                  class="h-20 w-32 rounded-md object-cover"
                />
                <div class="space-y-1">
                  <h2 class="text-lg font-semibold">{{ video?.title }}</h2>
                  <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <UBadge variant="soft" size="sm">{{ video?.topic }}</UBadge>
                    <UBadge variant="outline" size="sm">{{ video?.level }}</UBadge>
                    <span>{{ sentences.length }} câu thoại</span>
                  </div>
                </div>
              </div>

              <UButton color="primary" variant="solid" size="lg"> Bắt đầu luyện tập </UButton>
            </div>
          </div>

          <div v-else class="space-y-4">
            <USkeleton class="h-5 w-40" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-3/4" />
          </div>
        </UCard>
      </div>
    </div>
  </UMain>
</template>
