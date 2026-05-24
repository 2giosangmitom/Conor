<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useSeoMeta({
  title: "Quản trị - NgheGo",
});

interface VideoRow {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: string;
  thumbnailUrl: string;
}

interface VideoIndexResponse {
  videos: VideoRow[];
  total: number;
}

const searchQuery = ref("");

const { data: videoResponse, status } = useFetch<VideoIndexResponse>("/api/video", {
  query: { sort: "newest", limit: 50 },
});

const videos = computed(() => videoResponse.value?.videos ?? []);

const filteredVideos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return videos.value;
  return videos.value.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.topic.toLowerCase().includes(q) ||
      v.level.toLowerCase().includes(q),
  );
});

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6">
    <h1 class="sr-only">Quản trị</h1>
    <UPageSection
      title="Quản trị"
      description="Danh sách video. Chọn một video để chỉnh sửa transcript."
      :ui="{ wrapper: 'text-left', title: 'text-left', description: 'text-left' }"
    >
      <template #body>
        <div class="mb-4 flex items-center justify-between">
          <UInput
            v-model="searchQuery"
            placeholder="Tìm kiếm video..."
            leading-icon="lucide:search"
            class="w-full max-w-sm"
          />
        </div>

        <div v-if="status === 'pending'" class="space-y-2">
          <USkeleton v-for="i in 5" :key="i" class="h-12 w-full" />
        </div>

        <div v-else-if="filteredVideos.length === 0" class="py-12 text-center text-muted">
          Không tìm thấy video nào.
        </div>

        <div v-else class="overflow-x-auto rounded-lg border border-muted">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-muted bg-muted/50">
              <tr>
                <th class="px-4 py-3 font-medium">Video</th>
                <th class="px-4 py-3 font-medium">Level</th>
                <th class="px-4 py-3 font-medium">Chủ đề</th>
                <th class="px-4 py-3 font-medium">Thời lượng</th>
                <th class="px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muted">
              <tr v-for="video in filteredVideos" :key="video.id" class="hover:bg-muted/30">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <NuxtImg
                      :src="video.thumbnailUrl"
                      alt=""
                      role="presentation"
                      class="h-10 w-16 rounded object-cover"
                    />
                    <span class="line-clamp-2 max-w-md font-medium">{{ video.title }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <UBadge variant="soft">{{ video.level }}</UBadge>
                </td>
                <td class="px-4 py-3 text-muted">{{ video.topic }}</td>
                <td class="px-4 py-3 text-muted">{{ formatDuration(video.duration) }}</td>
                <td class="px-4 py-3">
                  <UButton
                    :to="`/admin/video/${video.youtubeId}`"
                    size="sm"
                    color="primary"
                    variant="solid"
                    icon="lucide:pencil"
                  >
                    Chỉnh sửa transcript
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </UPageSection>
  </div>
</template>
