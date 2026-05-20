<script setup lang="ts">
import type { PracticeLoaderProps as Props, PracticeLoaderEmits as Emits } from "~/types/practice";

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const statusText: Record<string, string> = {
  pending: "Đang chờ",
  running: "Đang chạy",
  done: "Hoàn tất",
  failed: "Thất bại",
};

const statusColor: Record<string, string> = {
  pending: "text-muted",
  running: "text-primary",
  done: "text-success",
  failed: "text-error",
};

const statusIcon: Record<string, string> = {
  pending: "i-lucide-circle",
  running: "i-lucide-loader-circle",
  done: "i-lucide-check-circle-2",
  failed: "i-lucide-x-circle",
};
</script>

<template>
  <UCard class="border-muted/40 backdrop-blur">
    <template #header>
      <div class="flex flex-col gap-2">
        <UBadge variant="soft" color="primary" class="w-fit"> Luyện tập với video YouTube </UBadge>
        <h1 class="text-2xl font-semibold">Chuẩn bị bài luyện tập</h1>
        <p class="text-sm text-muted">
          Video ID: <span class="font-medium text-foreground">{{ props.youtubeId }}</span>
        </p>
      </div>
    </template>

    <div class="space-y-6">
      <div class="flex flex-col gap-2" aria-live="polite">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-activity" class="size-4 text-primary" />
          <span>Trạng thái hiện tại: {{ props.currentStepLabel }}</span>
        </div>
        <div v-if="props.runId" class="text-xs text-muted">Run ID: {{ props.runId }}</div>
      </div>

      <div class="space-y-3">
        <div
          v-for="step in props.steps"
          :key="step.id"
          class="flex items-center justify-between rounded-lg border border-muted/40 bg-background/70 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="statusIcon[step.status]"
              class="size-5"
              :class="[statusColor[step.status], step.status === 'running' ? 'animate-spin' : '']"
            />
            <span class="text-sm font-medium">{{ step.label }}</span>
          </div>
          <UBadge variant="soft" size="sm" :color="step.status === 'failed' ? 'error' : 'primary'">
            {{ statusText[step.status] }}
          </UBadge>
        </div>
      </div>

      <UAlert
        v-if="props.isFailed"
        title="Không thể lập chỉ mục video"
        color="error"
        icon="i-lucide-triangle-alert"
      >
        <template #description>
          <span>Lý do: {{ props.errorReason }}</span>
        </template>
      </UAlert>

      <UAlert
        v-if="props.connectionIssue"
        title="Kết nối bị gián đoạn"
        color="warning"
        icon="i-lucide-wifi-off"
      >
        <template #description>
          <span>{{ props.connectionIssue }}</span>
        </template>
      </UAlert>

      <div class="flex flex-wrap gap-3">
        <UButton
          v-if="props.isFailed || props.connectionIssue"
          color="primary"
          variant="solid"
          @click="emit('retry')"
        >
          Thử lại
        </UButton>
        <UButton to="/" variant="ghost">Quay về trang chủ</UButton>
      </div>
    </div>
  </UCard>
</template>
