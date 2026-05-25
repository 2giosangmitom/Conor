<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: "default",
});

interface VideoSentence {
  id: string;
  videoId: string;
  sentenceIndex: number;
  startTime: number;
  endTime: number;
  text: string;
}

interface VideoInfo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: string;
  thumbnailUrl: string;
}

interface VideoDetailsForm {
  title: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  duration: number;
  thumbnailUrl: string;
}

const UInput = resolveComponent("UInput");
const UButton = resolveComponent("UButton");

const route = useRoute();
const youtubeId = computed(() => String(route.params.youtubeId ?? ""));
const toast = useToast();

const deleteModalOpen = ref(false);
const sentenceToDelete = ref<VideoSentence | null>(null);
const reindexModalOpen = ref(false);
const isReindexing = ref(false);
const savingIds = ref(new Set<string>());
const addFormOpen = ref(false);
const detailsSaving = ref(false);
const detailsOpen = ref(false);
const detailsDirty = ref(false);

const { data, refresh, status } = useFetch<{ video: VideoInfo; sentences: VideoSentence[] }>(
  () => `/api/admin/video/${youtubeId.value}/transcript`,
  { watch: [youtubeId] },
);

const video = computed(() => data.value?.video ?? null);

useSeoMeta({
  title: computed(() => `Chỉnh sửa transcript - ${video.value?.title ?? "NgheGo"}`),
});

const sentences = ref<VideoSentence[]>([]);
const originalMap = ref(new Map<string, VideoSentence>());

watch(
  () => data.value?.sentences,
  (val) => {
    if (val) {
      sentences.value = val.map((s) => ({ ...s }));
      originalMap.value = new Map(val.map((s) => [s.id, { ...s }]));
    }
  },
  { immediate: true },
);

const detailsForm = ref<VideoDetailsForm>({
  title: "",
  topic: "",
  level: "A1",
  duration: 0,
  thumbnailUrl: "",
});
const originalDetails = ref<VideoDetailsForm | null>(null);

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function normalizeDetails(info: VideoInfo): VideoDetailsForm {
  return {
    title: info.title,
    topic: info.topic,
    level: info.level as VideoDetailsForm["level"],
    duration: info.duration,
    thumbnailUrl: info.thumbnailUrl,
  };
}

watch(
  () => video.value,
  (val) => {
    if (!val) return;
    const normalized = normalizeDetails(val);
    detailsForm.value = { ...normalized };
    originalDetails.value = { ...normalized };
    detailsDirty.value = false;
  },
  { immediate: true },
);

watch(
  () => route.hash,
  (hash) => {
    if (hash === "#details") {
      detailsOpen.value = true;
    }
  },
  { immediate: true },
);

watch(
  detailsForm,
  (val) => {
    if (!val || !originalDetails.value) {
      detailsDirty.value = false;
      return;
    }
    const orig = originalDetails.value;
    detailsDirty.value =
      val.title !== orig.title ||
      val.topic !== orig.topic ||
      val.level !== orig.level ||
      val.duration !== orig.duration ||
      val.thumbnailUrl !== orig.thumbnailUrl;
  },
  { deep: true },
);

function discardDetails() {
  if (!originalDetails.value) return;
  detailsForm.value = { ...originalDetails.value };
  detailsDirty.value = false;
}

async function saveDetails() {
  if (!detailsForm.value) return;
  detailsSaving.value = true;
  try {
    const updated = await $fetch<VideoInfo>(`/api/admin/video/${youtubeId.value}`, {
      method: "PUT",
      body: detailsForm.value,
    });
    const normalized = normalizeDetails(updated);
    detailsForm.value = { ...normalized };
    originalDetails.value = { ...normalized };
    detailsDirty.value = false;
    toast.add({ title: "Đã lưu chi tiết", color: "success" });
    await refresh();
  } catch {
    toast.add({ title: "Lỗi khi lưu chi tiết", color: "error" });
  } finally {
    detailsSaving.value = false;
  }
}

const dirtyIds = computed(() => {
  const dirty = new Set<string>();
  for (const s of sentences.value) {
    const orig = originalMap.value.get(s.id);
    if (
      orig &&
      (orig.text !== s.text || orig.startTime !== s.startTime || orig.endTime !== s.endTime)
    ) {
      dirty.add(s.id);
    }
  }
  return dirty;
});

const totalDirty = computed(() => dirtyIds.value.size);

function formatMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "00:00.000";
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  const millis = ms % 1000;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

function discardChanges(sentence: VideoSentence) {
  const orig = originalMap.value.get(sentence.id);
  if (!orig) return;
  sentence.text = orig.text;
  sentence.startTime = orig.startTime;
  sentence.endTime = orig.endTime;
}

async function saveSentence(sentence: VideoSentence) {
  savingIds.value = new Set(savingIds.value).add(sentence.id);
  try {
    await $fetch(`/api/admin/video/${youtubeId.value}/transcript/${sentence.id}`, {
      method: "PUT",
      body: {
        text: sentence.text,
        startTime: sentence.startTime,
        endTime: sentence.endTime,
      },
    });
    originalMap.value.set(sentence.id, { ...sentence });
    toast.add({ title: "Đã lưu", color: "success" });
  } catch {
    toast.add({ title: "Lỗi khi lưu", color: "error" });
  } finally {
    const next = new Set(savingIds.value);
    next.delete(sentence.id);
    savingIds.value = next;
  }
}

async function saveAllDirty() {
  const dirty = sentences.value.filter((s) => dirtyIds.value.has(s.id));
  for (const s of dirty) {
    await saveSentence(s);
  }
}

function confirmDelete(sentence: VideoSentence) {
  sentenceToDelete.value = sentence;
  deleteModalOpen.value = true;
}

async function deleteSentence() {
  if (!sentenceToDelete.value) return;
  const target = sentenceToDelete.value;
  try {
    await $fetch(`/api/admin/video/${youtubeId.value}/transcript/${target.id}`, {
      method: "DELETE",
    });
    toast.add({ title: "Đã xóa", color: "success" });
    deleteModalOpen.value = false;
    sentenceToDelete.value = null;
    await refresh();
  } catch {
    toast.add({ title: "Lỗi khi xóa", color: "error" });
  }
}

async function reindexSentences() {
  isReindexing.value = true;
  try {
    await $fetch(`/api/admin/video/${youtubeId.value}/transcript/reindex`, {
      method: "POST",
    });
    toast.add({ title: "Đã đánh lại chỉ số", color: "success" });
    reindexModalOpen.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Lỗi khi đánh lại chỉ số", color: "error" });
  } finally {
    isReindexing.value = false;
  }
}

const newSentenceText = ref("");
const newSentenceStart = ref(0);
const newSentenceEnd = ref(0);
const isAdding = ref(false);

async function addSentence() {
  if (!newSentenceText.value.trim()) return;
  isAdding.value = true;
  try {
    await $fetch(`/api/admin/video/${youtubeId.value}/transcript`, {
      method: "POST",
      body: {
        text: newSentenceText.value.trim(),
        startTime: newSentenceStart.value,
        endTime: newSentenceEnd.value,
      },
    });
    toast.add({ title: "Đã thêm câu mới", color: "success" });
    newSentenceText.value = "";
    newSentenceStart.value = 0;
    newSentenceEnd.value = 0;
    addFormOpen.value = false;
    await refresh();
  } catch {
    toast.add({ title: "Lỗi khi thêm câu", color: "error" });
  } finally {
    isAdding.value = false;
  }
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === "s") {
    event.preventDefault();
    if (detailsOpen.value && detailsDirty.value) {
      saveDetails();
      return;
    }
    if (totalDirty.value > 0) saveAllDirty();
  }
  if (event.key === "Escape") {
    addFormOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeydown);
});

const columns: TableColumn<VideoSentence>[] = [
  {
    accessorKey: "sentenceIndex",
    header: "#",
    meta: {
      class: {
        th: "w-12 text-center text-xs font-medium text-muted",
        td: "text-center font-mono text-xs text-muted",
      },
    },
    cell: ({ row }) => String(row.getValue("sentenceIndex")),
  },
  {
    accessorKey: "startTime",
    header: "Bắt đầu",
    meta: {
      class: {
        th: "text-xs font-medium text-muted",
        td: "p-0",
      },
    },
    cell: ({ row }) =>
      h("div", { class: "px-3 py-2 min-w-[110px]" }, [
        h(UInput, {
          modelValue: row.original.startTime,
          "onUpdate:modelValue": (val: number) => {
            row.original.startTime = Number(val);
          },
          type: "number",
          size: "xs",
          placeholder: "ms",
        }),
        h(
          "p",
          { class: "mt-0.5 truncate font-mono text-[10px] text-muted" },
          formatMs(row.original.startTime),
        ),
      ]),
  },
  {
    accessorKey: "endTime",
    header: "Kết thúc",
    meta: {
      class: {
        th: "text-xs font-medium text-muted",
        td: "p-0",
      },
    },
    cell: ({ row }) =>
      h("div", { class: "px-3 py-2 min-w-[110px]" }, [
        h(UInput, {
          modelValue: row.original.endTime,
          "onUpdate:modelValue": (val: number) => {
            row.original.endTime = Number(val);
          },
          type: "number",
          size: "xs",
          placeholder: "ms",
        }),
        h(
          "p",
          { class: "mt-0.5 truncate font-mono text-[10px] text-muted" },
          formatMs(row.original.endTime),
        ),
      ]),
  },
  {
    accessorKey: "text",
    header: "Nội dung",
    meta: {
      class: {
        th: "text-xs font-medium text-muted",
        td: "max-w-md p-0",
      },
    },
    cell: ({ row }) => {
      return h("div", { class: "px-3 py-2" }, [
        h("textarea", {
          value: row.original.text,
          class:
            "min-h-[2lh] w-full resize-none overflow-hidden rounded-md border-0 bg-transparent px-2 py-1 text-sm leading-relaxed outline-none ring-1 ring-inset ring-muted transition focus:ring-2 focus:ring-primary",
          rows: 1,
          onInput: (e: Event) => {
            const el = e.target as HTMLTextAreaElement;
            row.original.text = el.value;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          },
          onFocus: (e: Event) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          },
        }),
      ]);
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    enableHiding: false,
    meta: {
      class: {
        th: "w-28 text-xs font-medium text-muted",
        td: "p-0",
      },
    },
    cell: ({ row }) => {
      const isDirty = dirtyIds.value.has(row.original.id);
      const isSaving = savingIds.value.has(row.original.id);

      const buttons: ReturnType<typeof h>[] = [];

      if (isDirty) {
        buttons.push(
          h(UButton, {
            size: "xs",
            color: "primary",
            variant: "solid",
            icon: "lucide:check",
            loading: isSaving,
            onClick: () => saveSentence(row.original),
          }),
          h(UButton, {
            size: "xs",
            color: "neutral",
            variant: "ghost",
            icon: "lucide:undo-2",
            title: "Hoàn tác",
            onClick: () => discardChanges(row.original),
          }),
        );
      }

      buttons.push(
        h(UButton, {
          size: "xs",
          color: "error",
          variant: "ghost",
          icon: "lucide:trash-2",
          title: "Xóa",
          onClick: () => confirmDelete(row.original),
        }),
      );

      return h("div", { class: "flex items-center gap-1 px-3 py-2" }, buttons);
    },
  },
];

interface TableMetaValue {
  class?: {
    tr?: string | ((row: { original: VideoSentence }) => string);
  };
}

const meta = computed(
  (): TableMetaValue => ({
    class: {
      tr: (row: { original: VideoSentence }) => {
        const base = "transition-colors duration-150";
        const highlight = dirtyIds.value.has(row.original.id)
          ? "bg-warning/5 hover:bg-warning/10"
          : "hover:bg-muted/30";
        return `${base} ${highlight}`;
      },
    },
  }),
);
</script>

<template>
  <div class="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6">
    <!-- Top bar -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <UButton to="/admin" variant="ghost" color="neutral" icon="lucide:arrow-left" size="sm">
        Quay lại
      </UButton>
      <div class="flex items-center gap-2">
        <UBadge v-if="totalDirty > 0" color="warning" variant="solid" size="sm">
          {{ totalDirty }} thay đổi chưa lưu
        </UBadge>
        <UButton
          v-if="totalDirty > 0"
          size="xs"
          color="primary"
          variant="solid"
          icon="lucide:save-all"
          @click="saveAllDirty"
        >
          Lưu tất cả (⌘S)
        </UButton>
        <UButton
          size="xs"
          color="neutral"
          variant="outline"
          icon="lucide:list-ordered"
          @click="reindexModalOpen = true"
        >
          Đánh lại chỉ số
        </UButton>
      </div>
    </div>

    <!-- Loading state -->
    <template v-if="status === 'pending'">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <USkeleton class="h-14 w-24 rounded-lg" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-5 w-1/2" />
            <USkeleton class="h-4 w-1/3" />
          </div>
        </div>
        <USkeleton class="h-64 w-full rounded-lg" />
      </div>
    </template>

    <template v-else-if="video">
      <!-- Video header -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <NuxtImg
          :src="video.thumbnailUrl"
          alt="Thumbnail"
          class="h-14 w-24 shrink-0 rounded-lg object-cover shadow-xs"
        />
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-lg font-bold leading-tight">{{ video.title }}</h1>
          <p class="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <UBadge variant="soft" size="sm">{{ video.level }}</UBadge>
            <span>{{ video.topic }}</span>
            <span class="text-muted/50">·</span>
            <span class="font-mono text-xs">{{ video.youtubeId }}</span>
          </p>
        </div>
      </div>

      <!-- Video details edit -->
      <div id="details" class="mb-6 scroll-mt-24">
        <UCard>
          <template #header>
            <button
              class="flex w-full items-center justify-between gap-3 text-left"
              type="button"
              @click="detailsOpen = !detailsOpen"
            >
              <div>
                <p class="text-sm font-semibold">Chi tiết video</p>
                <p class="text-xs text-muted">Cập nhật tiêu đề, chủ đề, level, thời lượng.</p>
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="detailsDirty" size="xs" color="warning" variant="soft">
                  Chưa lưu
                </UBadge>
                <UIcon
                  :name="detailsOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  class="size-4 text-muted"
                />
              </div>
            </button>
          </template>

          <div v-if="detailsOpen" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UInput v-model="detailsForm.title" label="Tiêu đề" placeholder="Nhập tiêu đề" />
              <UInput v-model="detailsForm.topic" label="Chủ đề" placeholder="Ví dụ: Du lịch" />
              <USelectMenu
                v-model="detailsForm.level"
                label="Level"
                :options="levelOptions"
                placeholder="Chọn level"
              />
              <UInput
                v-model.number="detailsForm.duration"
                label="Thời lượng (giây)"
                type="number"
                min="1"
                placeholder="300"
              />
            </div>
            <UInput
              v-model="detailsForm.thumbnailUrl"
              label="Thumbnail URL"
              placeholder="https://..."
            />
            <div class="flex flex-wrap items-center justify-between gap-3">
              <p class="text-xs text-muted">Nhấn ⌘S để lưu khi đang mở phần chi tiết.</p>
              <div class="flex items-center gap-2">
                <UButton
                  variant="outline"
                  color="neutral"
                  :disabled="!detailsDirty"
                  @click="discardDetails"
                >
                  Hoàn tác
                </UButton>
                <UButton
                  color="primary"
                  :loading="detailsSaving"
                  :disabled="!detailsDirty"
                  @click="saveDetails"
                >
                  Lưu chi tiết
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Add sentence toggle -->
      <div class="mb-5">
        <UButton
          v-if="!addFormOpen"
          variant="outline"
          size="sm"
          icon="lucide:plus"
          @click="addFormOpen = true"
        >
          Thêm câu mới
        </UButton>
        <UCard v-else>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Thêm câu mới</span>
              <UButton
                size="xs"
                color="neutral"
                variant="ghost"
                icon="lucide:x"
                @click="addFormOpen = false"
              />
            </div>
          </template>
          <div class="space-y-3">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <UInput
                  v-model.number="newSentenceStart"
                  type="number"
                  placeholder="Start time (ms)"
                  label="Start (ms)"
                />
                <p v-if="newSentenceStart > 0" class="mt-0.5 font-mono text-[10px] text-muted">
                  {{ formatMs(newSentenceStart) }}
                </p>
              </div>
              <div>
                <UInput
                  v-model.number="newSentenceEnd"
                  type="number"
                  placeholder="End time (ms)"
                  label="End (ms)"
                />
                <p v-if="newSentenceEnd > 0" class="mt-0.5 font-mono text-[10px] text-muted">
                  {{ formatMs(newSentenceEnd) }}
                </p>
              </div>
            </div>
            <UTextarea v-model="newSentenceText" placeholder="Nội dung câu..." :rows="2" />
            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="addFormOpen = false">Hủy</UButton>
              <UButton
                :loading="isAdding"
                :disabled="!newSentenceText.trim()"
                color="primary"
                @click="addSentence"
              >
                Thêm
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- UTable -->
      <UTable
        :data="sentences"
        :columns="columns"
        :meta="meta"
        :loading="status === 'idle'"
        class="w-full"
      >
        <template #empty>
          <div class="flex flex-col items-center gap-3 py-16 text-muted">
            <UIcon name="lucide:file-text" class="size-10" />
            <p class="text-sm">Video chưa có transcript nào.</p>
          </div>
        </template>
      </UTable>
    </template>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="deleteModalOpen" title="Xác nhận xóa">
      <template #body>
        <p class="text-sm text-muted">
          Bạn có chắc muốn xóa câu
          <span class="font-medium text-foreground">#{{ sentenceToDelete?.sentenceIndex }}</span
          >? Các câu phía sau sẽ được đánh lại chỉ số tự động.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="deleteModalOpen = false">Hủy</UButton>
          <UButton color="error" @click="deleteSentence">Xóa</UButton>
        </div>
      </template>
    </UModal>

    <!-- Re-index confirmation modal -->
    <UModal v-model:open="reindexModalOpen" title="Xác nhận đánh lại chỉ số">
      <template #body>
        <p class="text-sm text-muted">
          Tất cả các câu sẽ được đánh lại chỉ số từ 0 đến {{ sentences.length - 1 }} theo thứ tự
          hiện tại. Hành động này không thể hoàn tác.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="reindexModalOpen = false">Hủy</UButton>
          <UButton color="primary" :loading="isReindexing" @click="reindexSentences">
            Đánh lại
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
