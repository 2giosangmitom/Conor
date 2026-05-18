<template>
  <UMain>
    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero
          description="Khám phá kho bài học đa dạng, luyện nghe và chép chính tả với hàng ngàn video YouTube được tuyển chọn."
        >
          <template #title>
            <span class="flex flex-col items-center gap-4">
              <UBadge class="tracking-normal" variant="soft" icon="lucide:compass">
                Khám phá bài học
              </UBadge>
              <ClientOnly>
                <UiAuroraText :colors="auroraColors">
                  Học tiếng Anh, Chép chính tả qua YouTube
                </UiAuroraText>
                <template #fallback>
                  <span class="text-4xl font-bold sm:text-5xl lg:text-6xl">
                    Học tiếng Anh, Chép chính tả qua YouTube
                  </span>
                </template>
              </ClientOnly>
            </span>
          </template>
        </UPageHero>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <div class="bg-muted">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.2" blur="5px">
          <UPageSection
            id="recently-watched"
            headline=""
            title="Video đã xem gần đây nhất"
            description="Tiếp tục bài tập từ nơi bạn đã dừng lại"
            :ui="{
              wrapper: 'text-left',
              headline: 'justify-start',
              title: 'text-left',
              description: 'text-left',
            }"
          >
            <template #body>
              <UiBlurReveal :duration="0.45" :stagger-delay="0.08" blur="6px">
                <div v-if="hasRecent" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <UPageCard
                    v-for="video in recentlyWatched"
                    :key="video.youtubeId"
                    variant="outline"
                    class="group h-full"
                  >
                    <template #leading>
                      <div class="overflow-hidden rounded-lg bg-muted">
                        <img
                          :src="video.thumbnailUrl"
                          :alt="video.title"
                          class="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                    </template>
                    <template #title>
                      <span class="line-clamp-2">{{ video.title }}</span>
                    </template>
                    <template #description>
                      <div class="flex min-h-24 flex-col gap-4">
                        <div class="flex flex-wrap items-center gap-2">
                          <UBadge variant="soft">{{ video.topic }}</UBadge>
                          <UBadge variant="soft">{{ video.level }}</UBadge>
                          <UBadge variant="soft">{{ video.duration }}</UBadge>
                          <span class="text-xs text-muted">{{ video.lastWatchedAt }}</span>
                        </div>
                        <div>
                          <div class="flex items-center justify-between text-xs text-muted">
                            <span>Tien do</span>
                            <span>{{ video.progress }}%</span>
                          </div>
                          <div class="mt-2 h-2 rounded-full bg-muted">
                            <div
                              class="h-2 rounded-full bg-primary transition-all"
                              :style="{ width: `${video.progress}%` }"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                    <template #footer>
                      <UButton
                        :to="`/practice/${video.youtubeId}`"
                        label="Tiep tuc"
                        trailing-icon="lucide:arrow-right"
                        size="sm"
                        color="primary"
                        variant="solid"
                      />
                    </template>
                  </UPageCard>
                </div>
                <div
                  v-else
                  class="flex flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-muted px-6 py-10 text-left"
                >
                  <UIcon name="lucide:history" class="size-6 text-muted" />
                  <div>
                    <p class="text-sm font-semibold">Chua co video nao gan day</p>
                    <p class="text-sm text-muted">Bat dau luyen tap de xem lai lich su o day</p>
                  </div>
                  <UButton to="/" label="Dan link YouTube" size="sm" variant="outline" />
                </div>
              </UiBlurReveal>
            </template>
          </UPageSection>
        </UiBlurReveal>
      </div>
    </ClientOnly>
  </UMain>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const auroraColors = computed(() => {
  return colorMode.value === "dark"
    ? [
        "var(--color-primary-100)",
        "var(--color-primary-200)",
        "var(--color-primary-300)",
        "var(--color-primary-400)",
      ]
    : [
        "var(--color-primary-300)",
        "var(--color-primary-500)",
        "var(--color-primary-700)",
        "var(--color-primary-900)",
      ];
});

interface RecentVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  topic: string;
  level: string;
  duration: string;
  lastWatchedAt: string;
  progress: number;
}

const recentlyWatched = ref<RecentVideo[]>([
  {
    youtubeId: "9bZkp7q19f0",
    title: "British Accent Listening Practice | Everyday Conversations",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    topic: "Conversation",
    level: "B1",
    duration: "12:45",
    lastWatchedAt: "2 gio truoc",
    progress: 64,
  },
  {
    youtubeId: "kXYiU_JCYtU",
    title: "IELTS Listening Tips: Note-Taking That Works",
    thumbnailUrl: "https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg",
    topic: "IELTS",
    level: "B2",
    duration: "18:10",
    lastWatchedAt: "Hom qua",
    progress: 42,
  },
  {
    youtubeId: "hTWKbfoikeg",
    title: "American News Listening | Short Headlines",
    thumbnailUrl: "https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg",
    topic: "News",
    level: "A2",
    duration: "09:32",
    lastWatchedAt: "3 ngay truoc",
    progress: 78,
  },
]);

const hasRecent = computed(() => recentlyWatched.value.length > 0);
</script>
