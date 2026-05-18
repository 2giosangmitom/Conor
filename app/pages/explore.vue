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

    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.2" blur="5px">
        <UPageSection
          id="all-videos"
          headline=""
          title="Tất cả Video"
          description="Lọc theo mức độ, thời lượng, chủ đề và tìm kiếm nhanh"
          :ui="{
            wrapper: 'text-left',
            headline: 'justify-start',
            title: 'text-left',
            description: 'text-left',
          }"
        >
          <template #body>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <UDropdownMenu :items="levelMenuItems" :content="{ align: 'start' }">
                  <UButton
                    variant="outline"
                    size="sm"
                    trailing-icon="lucide:chevron-down"
                    :label="selectedLevel ? `Level: ${selectedLevel}` : 'Level'"
                  />
                </UDropdownMenu>
                <UDropdownMenu :items="durationMenuItems" :content="{ align: 'start' }">
                  <UButton
                    variant="outline"
                    size="sm"
                    trailing-icon="lucide:chevron-down"
                    :label="selectedDuration ? `Thoi luong: ${selectedDuration}` : 'Thoi luong'"
                  />
                </UDropdownMenu>
                <UDropdownMenu :items="topicMenuItems" :content="{ align: 'start' }">
                  <UButton
                    variant="outline"
                    size="sm"
                    trailing-icon="lucide:chevron-down"
                    :label="selectedTopic ? `Chu de: ${selectedTopic}` : 'Chu de'"
                  />
                </UDropdownMenu>
              </div>
              <UInput
                v-model="searchQuery"
                placeholder="Tim kiem video"
                aria-label="Tim kiem video"
                leading-icon="lucide:search"
                class="w-full lg:w-72"
                size="lg"
              />
            </div>

            <div class="mt-6">
              <UiBlurReveal :duration="0.45" :stagger-delay="0.08" blur="6px">
                <div v-if="pagedVideos.length" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <UPageCard
                    v-for="video in pagedVideos"
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
                        </div>
                        <div>
                          <div class="flex items-center justify-between text-xs text-muted">
                            <span>Tiến độ</span>
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
                        label="Bắt đầu"
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
                  <UIcon name="lucide:search-x" class="size-6 text-muted" />
                  <div>
                    <p class="text-sm font-semibold">Không tìm thấy Video</p>
                    <p class="text-sm text-muted">Thử đổi bộ lọc hoặc từ khóa khác</p>
                  </div>
                  <UButton label="Xóa bộ lọc" size="sm" variant="outline" @click="clearFilters" />
                </div>
              </UiBlurReveal>
            </div>

            <div class="mt-6 flex flex-col items-center gap-3">
              <div class="text-sm text-muted">Trang {{ currentPage }} / {{ pageCount }}</div>
              <UPagination
                v-model:page="currentPage"
                :total="filteredVideos.length"
                :items-per-page="pageSize"
                size="lg"
                class="scale-110"
              />
            </div>
          </template>
        </UPageSection>
      </UiBlurReveal>
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

interface AllVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  topic: string;
  level: string;
  duration: string;
  progress: number;
}

const allVideos = ref<AllVideo[]>([
  {
    youtubeId: "T7aZr7X1v8Y",
    title: "Daily English Listening | Morning Routine Dialogues",
    thumbnailUrl: "https://i.ytimg.com/vi/T7aZr7X1v8Y/hqdefault.jpg",
    topic: "Conversation",
    level: "A2",
    duration: "08:20",
    progress: 22,
  },
  {
    youtubeId: "X2a3b9c4d5e",
    title: "Business English: Meeting Phrases You Need",
    thumbnailUrl: "https://i.ytimg.com/vi/X2a3b9c4d5e/hqdefault.jpg",
    topic: "Business",
    level: "B1",
    duration: "14:05",
    progress: 48,
  },
  {
    youtubeId: "Y9k8m2n3p4q",
    title: "IELTS Listening Practice Test 1",
    thumbnailUrl: "https://i.ytimg.com/vi/Y9k8m2n3p4q/hqdefault.jpg",
    topic: "IELTS",
    level: "B2",
    duration: "19:40",
    progress: 67,
  },
  {
    youtubeId: "Z1l2m3n4o5p",
    title: "English News Headlines | Short Listening",
    thumbnailUrl: "https://i.ytimg.com/vi/Z1l2m3n4o5p/hqdefault.jpg",
    topic: "News",
    level: "A2",
    duration: "06:55",
    progress: 35,
  },
  {
    youtubeId: "K4l5m6n7o8p",
    title: "Travel English: Airport Announcements",
    thumbnailUrl: "https://i.ytimg.com/vi/K4l5m6n7o8p/hqdefault.jpg",
    topic: "Travel",
    level: "B1",
    duration: "11:10",
    progress: 54,
  },
  {
    youtubeId: "H7i8j9k0l1m",
    title: "Movie Clips Listening | Everyday Phrases",
    thumbnailUrl: "https://i.ytimg.com/vi/H7i8j9k0l1m/hqdefault.jpg",
    topic: "Entertainment",
    level: "B2",
    duration: "10:30",
    progress: 15,
  },
  {
    youtubeId: "Q2w3e4r5t6y",
    title: "Beginner Listening: Simple Questions",
    thumbnailUrl: "https://i.ytimg.com/vi/Q2w3e4r5t6y/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "07:25",
    progress: 80,
  },
  {
    youtubeId: "U8i9o0p1a2s",
    title: "Tech Talk: AI and Daily Life",
    thumbnailUrl: "https://i.ytimg.com/vi/U8i9o0p1a2s/hqdefault.jpg",
    topic: "Technology",
    level: "B2",
    duration: "15:50",
    progress: 5,
  },
  {
    youtubeId: "J3k4l5m6n7o",
    title: "Office Small Talk | Natural Conversations",
    thumbnailUrl: "https://i.ytimg.com/vi/J3k4l5m6n7o/hqdefault.jpg",
    topic: "Business",
    level: "B1",
    duration: "09:18",
    progress: 60,
  },
  {
    youtubeId: "M8n9o0p1q2w",
    title: "IELTS Listening Practice Test 2",
    thumbnailUrl: "https://i.ytimg.com/vi/M8n9o0p1q2w/hqdefault.jpg",
    topic: "IELTS",
    level: "C1",
    duration: "20:05",
    progress: 38,
  },
  {
    youtubeId: "R4t5y6u7i8o",
    title: "English Songs | Lyric Listening",
    thumbnailUrl: "https://i.ytimg.com/vi/R4t5y6u7i8o/hqdefault.jpg",
    topic: "Entertainment",
    level: "B1",
    duration: "13:30",
    progress: 72,
  },
  {
    youtubeId: "C7v8b9n0m1k",
    title: "Customer Service Calls | Listening",
    thumbnailUrl: "https://i.ytimg.com/vi/C7v8b9n0m1k/hqdefault.jpg",
    topic: "Business",
    level: "B2",
    duration: "16:25",
    progress: 44,
  },
  {
    youtubeId: "B2n3m4v5c6x",
    title: "Travel Stories | British Accent",
    thumbnailUrl: "https://i.ytimg.com/vi/B2n3m4v5c6x/hqdefault.jpg",
    topic: "Travel",
    level: "B2",
    duration: "12:05",
    progress: 27,
  },
  {
    youtubeId: "L1p2o3i4u5y",
    title: "News Report | World Events",
    thumbnailUrl: "https://i.ytimg.com/vi/L1p2o3i4u5y/hqdefault.jpg",
    topic: "News",
    level: "C1",
    duration: "17:40",
    progress: 12,
  },
  {
    youtubeId: "S6d7f8g9h0j",
    title: "Everyday English | Shopping Dialogues",
    thumbnailUrl: "https://i.ytimg.com/vi/S6d7f8g9h0j/hqdefault.jpg",
    topic: "Conversation",
    level: "A2",
    duration: "09:55",
    progress: 56,
  },
  {
    youtubeId: "V5b6n7m8k9l",
    title: "Beginner Listening: Classroom Instructions",
    thumbnailUrl: "https://i.ytimg.com/vi/V5b6n7m8k9l/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "05:40",
    progress: 90,
  },
  {
    youtubeId: "P0o9i8u7y6t",
    title: "Tech News | Weekly Recap",
    thumbnailUrl: "https://i.ytimg.com/vi/P0o9i8u7y6t/hqdefault.jpg",
    topic: "Technology",
    level: "B1",
    duration: "14:55",
    progress: 33,
  },
  {
    youtubeId: "N2m3b4v5c6x",
    title: "Tourism English | Hotel Check-in",
    thumbnailUrl: "https://i.ytimg.com/vi/N2m3b4v5c6x/hqdefault.jpg",
    topic: "Travel",
    level: "A2",
    duration: "10:15",
    progress: 41,
  },
  {
    youtubeId: "G1h2j3k4l5m",
    title: "Daily English Listening | Ordering Food",
    thumbnailUrl: "https://i.ytimg.com/vi/G1h2j3k4l5m/hqdefault.jpg",
    topic: "Conversation",
    level: "A1",
    duration: "06:40",
    progress: 18,
  },
  {
    youtubeId: "F6g7h8j9k0l",
    title: "Business Email Listening | Formal Tone",
    thumbnailUrl: "https://i.ytimg.com/vi/F6g7h8j9k0l/hqdefault.jpg",
    topic: "Business",
    level: "B1",
    duration: "12:20",
    progress: 52,
  },
  {
    youtubeId: "D2e3f4g5h6i",
    title: "IELTS Listening Test 3 | Section 1",
    thumbnailUrl: "https://i.ytimg.com/vi/D2e3f4g5h6i/hqdefault.jpg",
    topic: "IELTS",
    level: "B2",
    duration: "18:15",
    progress: 31,
  },
  {
    youtubeId: "A7s8d9f0g1h",
    title: "Tech News | Mobile Updates",
    thumbnailUrl: "https://i.ytimg.com/vi/A7s8d9f0g1h/hqdefault.jpg",
    topic: "Technology",
    level: "B1",
    duration: "13:05",
    progress: 64,
  },
  {
    youtubeId: "Q9w8e7r6t5y",
    title: "News Briefing | Global Headlines",
    thumbnailUrl: "https://i.ytimg.com/vi/Q9w8e7r6t5y/hqdefault.jpg",
    topic: "News",
    level: "B2",
    duration: "16:10",
    progress: 27,
  },
  {
    youtubeId: "P8o7i6u5y4t",
    title: "Travel English | Asking for Directions",
    thumbnailUrl: "https://i.ytimg.com/vi/P8o7i6u5y4t/hqdefault.jpg",
    topic: "Travel",
    level: "A2",
    duration: "08:45",
    progress: 73,
  },
  {
    youtubeId: "L4k3j2h1g0f",
    title: "Entertainment News | Movie Buzz",
    thumbnailUrl: "https://i.ytimg.com/vi/L4k3j2h1g0f/hqdefault.jpg",
    topic: "Entertainment",
    level: "B1",
    duration: "11:55",
    progress: 40,
  },
  {
    youtubeId: "S1a2m3p4l5e",
    title: "Beginner Listening | Family Vocabulary",
    thumbnailUrl: "https://i.ytimg.com/vi/S1a2m3p4l5e/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "05:30",
    progress: 86,
  },
  {
    youtubeId: "T2e3s4t5u6v",
    title: "Conversation Practice | At the Cafe",
    thumbnailUrl: "https://i.ytimg.com/vi/T2e3s4t5u6v/hqdefault.jpg",
    topic: "Conversation",
    level: "A2",
    duration: "09:10",
    progress: 58,
  },
  {
    youtubeId: "N7b8m9v0c1x",
    title: "Office Listening | Project Updates",
    thumbnailUrl: "https://i.ytimg.com/vi/N7b8m9v0c1x/hqdefault.jpg",
    topic: "Business",
    level: "B2",
    duration: "14:35",
    progress: 22,
  },
  {
    youtubeId: "K9l8m7n6b5v",
    title: "IELTS Listening Test 4 | Section 2",
    thumbnailUrl: "https://i.ytimg.com/vi/K9l8m7n6b5v/hqdefault.jpg",
    topic: "IELTS",
    level: "C1",
    duration: "21:05",
    progress: 49,
  },
  {
    youtubeId: "J1h2g3f4d5s",
    title: "Tech Talk | AI at Work",
    thumbnailUrl: "https://i.ytimg.com/vi/J1h2g3f4d5s/hqdefault.jpg",
    topic: "Technology",
    level: "B2",
    duration: "17:20",
    progress: 12,
  },
  {
    youtubeId: "Z9x8c7v6b5n",
    title: "News Interview | Climate Report",
    thumbnailUrl: "https://i.ytimg.com/vi/Z9x8c7v6b5n/hqdefault.jpg",
    topic: "News",
    level: "C1",
    duration: "19:15",
    progress: 6,
  },
  {
    youtubeId: "W2e3r4t5y6u",
    title: "Travel English | Hotel Requests",
    thumbnailUrl: "https://i.ytimg.com/vi/W2e3r4t5y6u/hqdefault.jpg",
    topic: "Travel",
    level: "B1",
    duration: "12:50",
    progress: 37,
  },
  {
    youtubeId: "E1n2t3e4r5t",
    title: "Entertainment Talk | Music Trends",
    thumbnailUrl: "https://i.ytimg.com/vi/E1n2t3e4r5t/hqdefault.jpg",
    topic: "Entertainment",
    level: "B1",
    duration: "13:25",
    progress: 29,
  },
  {
    youtubeId: "B4a5s6i7c8s",
    title: "Beginner Listening | Classroom Phrases",
    thumbnailUrl: "https://i.ytimg.com/vi/B4a5s6i7c8s/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "06:05",
    progress: 91,
  },
  {
    youtubeId: "C1o2n3v4e5r",
    title: "Conversation Practice | Weekend Plans",
    thumbnailUrl: "https://i.ytimg.com/vi/C1o2n3v4e5r/hqdefault.jpg",
    topic: "Conversation",
    level: "B1",
    duration: "10:55",
    progress: 46,
  },
  {
    youtubeId: "M1e2d3i4a5x",
    title: "Business Listening | Client Feedback",
    thumbnailUrl: "https://i.ytimg.com/vi/M1e2d3i4a5x/hqdefault.jpg",
    topic: "Business",
    level: "B2",
    duration: "15:10",
    progress: 51,
  },
  {
    youtubeId: "I1e2l3t4s5x",
    title: "IELTS Listening Test 5 | Section 3",
    thumbnailUrl: "https://i.ytimg.com/vi/I1e2l3t4s5x/hqdefault.jpg",
    topic: "IELTS",
    level: "C1",
    duration: "22:30",
    progress: 33,
  },
  {
    youtubeId: "T9e8c7h6u5p",
    title: "Tech News | Startup Stories",
    thumbnailUrl: "https://i.ytimg.com/vi/T9e8c7h6u5p/hqdefault.jpg",
    topic: "Technology",
    level: "B1",
    duration: "14:00",
    progress: 24,
  },
  {
    youtubeId: "N3e4w5s6x7y",
    title: "News Report | Economic Update",
    thumbnailUrl: "https://i.ytimg.com/vi/N3e4w5s6x7y/hqdefault.jpg",
    topic: "News",
    level: "B2",
    duration: "16:45",
    progress: 19,
  },
  {
    youtubeId: "R1t2r3a4v5l",
    title: "Travel English | Train Station",
    thumbnailUrl: "https://i.ytimg.com/vi/R1t2r3a4v5l/hqdefault.jpg",
    topic: "Travel",
    level: "A2",
    duration: "09:35",
    progress: 62,
  },
  {
    youtubeId: "S2h3o4w5b6z",
    title: "Entertainment News | TV Highlights",
    thumbnailUrl: "https://i.ytimg.com/vi/S2h3o4w5b6z/hqdefault.jpg",
    topic: "Entertainment",
    level: "B2",
    duration: "12:15",
    progress: 44,
  },
  {
    youtubeId: "B1a2s3i4c5s",
    title: "Beginner Listening | Daily Schedule",
    thumbnailUrl: "https://i.ytimg.com/vi/B1a2s3i4c5s/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "07:10",
    progress: 77,
  },
  {
    youtubeId: "C7h8a9t0g1p",
    title: "Conversation Practice | Phone Calls",
    thumbnailUrl: "https://i.ytimg.com/vi/C7h8a9t0g1p/hqdefault.jpg",
    topic: "Conversation",
    level: "B2",
    duration: "11:45",
    progress: 57,
  },
  {
    youtubeId: "B3u4s5i6n7s",
    title: "Business Listening | Sales Pitch",
    thumbnailUrl: "https://i.ytimg.com/vi/B3u4s5i6n7s/hqdefault.jpg",
    topic: "Business",
    level: "C1",
    duration: "18:35",
    progress: 14,
  },
  {
    youtubeId: "I7e6l5t4s3q",
    title: "IELTS Listening Test 6 | Section 4",
    thumbnailUrl: "https://i.ytimg.com/vi/I7e6l5t4s3q/hqdefault.jpg",
    topic: "IELTS",
    level: "C1",
    duration: "23:10",
    progress: 26,
  },
  {
    youtubeId: "T3e4c5h6g7x",
    title: "Tech Talk | Future of Work",
    thumbnailUrl: "https://i.ytimg.com/vi/T3e4c5h6g7x/hqdefault.jpg",
    topic: "Technology",
    level: "B2",
    duration: "17:55",
    progress: 9,
  },
  {
    youtubeId: "N8e7w6s5t4p",
    title: "News Briefing | Sports Update",
    thumbnailUrl: "https://i.ytimg.com/vi/N8e7w6s5t4p/hqdefault.jpg",
    topic: "News",
    level: "B1",
    duration: "13:40",
    progress: 36,
  },
  {
    youtubeId: "T5r4a3v2e1l",
    title: "Travel English | Checking In",
    thumbnailUrl: "https://i.ytimg.com/vi/T5r4a3v2e1l/hqdefault.jpg",
    topic: "Travel",
    level: "A2",
    duration: "08:05",
    progress: 68,
  },
  {
    youtubeId: "E9n8t7m6u5s",
    title: "Entertainment News | Film Reviews",
    thumbnailUrl: "https://i.ytimg.com/vi/E9n8t7m6u5s/hqdefault.jpg",
    topic: "Entertainment",
    level: "B1",
    duration: "12:40",
    progress: 53,
  },
  {
    youtubeId: "B9a8s7i6c5s",
    title: "Beginner Listening | Numbers and Time",
    thumbnailUrl: "https://i.ytimg.com/vi/B9a8s7i6c5s/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "05:55",
    progress: 88,
  },
  {
    youtubeId: "C2o3n4v5e6r",
    title: "Conversation Practice | Daily Updates",
    thumbnailUrl: "https://i.ytimg.com/vi/C2o3n4v5e6r/hqdefault.jpg",
    topic: "Conversation",
    level: "A2",
    duration: "09:50",
    progress: 61,
  },
  {
    youtubeId: "B5u6s7i8n9s",
    title: "Business Listening | Presentation Skills",
    thumbnailUrl: "https://i.ytimg.com/vi/B5u6s7i8n9s/hqdefault.jpg",
    topic: "Business",
    level: "B2",
    duration: "16:30",
    progress: 39,
  },
  {
    youtubeId: "I5e4l3t2s1p",
    title: "IELTS Listening Test 7 | Section 1",
    thumbnailUrl: "https://i.ytimg.com/vi/I5e4l3t2s1p/hqdefault.jpg",
    topic: "IELTS",
    level: "B2",
    duration: "19:25",
    progress: 47,
  },
  {
    youtubeId: "T6e5c4h3g2n",
    title: "Tech News | Product Launch",
    thumbnailUrl: "https://i.ytimg.com/vi/T6e5c4h3g2n/hqdefault.jpg",
    topic: "Technology",
    level: "B1",
    duration: "14:20",
    progress: 21,
  },
  {
    youtubeId: "N6e5w4s3u2p",
    title: "News Report | Health Update",
    thumbnailUrl: "https://i.ytimg.com/vi/N6e5w4s3u2p/hqdefault.jpg",
    topic: "News",
    level: "B2",
    duration: "15:35",
    progress: 32,
  },
  {
    youtubeId: "T8r7a6v5e4l",
    title: "Travel English | Booking Tickets",
    thumbnailUrl: "https://i.ytimg.com/vi/T8r7a6v5e4l/hqdefault.jpg",
    topic: "Travel",
    level: "A2",
    duration: "10:05",
    progress: 59,
  },
  {
    youtubeId: "E6n5t4m3u2s",
    title: "Entertainment Talk | Series Recap",
    thumbnailUrl: "https://i.ytimg.com/vi/E6n5t4m3u2s/hqdefault.jpg",
    topic: "Entertainment",
    level: "B2",
    duration: "13:50",
    progress: 42,
  },
  {
    youtubeId: "B8a7s6i5c4s",
    title: "Beginner Listening | Colors and Shapes",
    thumbnailUrl: "https://i.ytimg.com/vi/B8a7s6i5c4s/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "06:15",
    progress: 95,
  },
  {
    youtubeId: "C3o4n5v6e7r",
    title: "Conversation Practice | Weekend Trips",
    thumbnailUrl: "https://i.ytimg.com/vi/C3o4n5v6e7r/hqdefault.jpg",
    topic: "Conversation",
    level: "B1",
    duration: "11:20",
    progress: 50,
  },
  {
    youtubeId: "B6u7s8i9n0s",
    title: "Business Listening | Negotiation Tips",
    thumbnailUrl: "https://i.ytimg.com/vi/B6u7s8i9n0s/hqdefault.jpg",
    topic: "Business",
    level: "C1",
    duration: "20:10",
    progress: 28,
  },
  {
    youtubeId: "I9e8l7t6s5r",
    title: "IELTS Listening Test 8 | Section 2",
    thumbnailUrl: "https://i.ytimg.com/vi/I9e8l7t6s5r/hqdefault.jpg",
    topic: "IELTS",
    level: "C1",
    duration: "22:45",
    progress: 34,
  },
  {
    youtubeId: "T1e2c3h4g5n",
    title: "Tech Talk | Cloud Basics",
    thumbnailUrl: "https://i.ytimg.com/vi/T1e2c3h4g5n/hqdefault.jpg",
    topic: "Technology",
    level: "B2",
    duration: "16:05",
    progress: 11,
  },
  {
    youtubeId: "N4e3w2s1u0p",
    title: "News Briefing | Local Stories",
    thumbnailUrl: "https://i.ytimg.com/vi/N4e3w2s1u0p/hqdefault.jpg",
    topic: "News",
    level: "B1",
    duration: "12:25",
    progress: 45,
  },
  {
    youtubeId: "T4r5a6v7e8l",
    title: "Travel English | City Guide",
    thumbnailUrl: "https://i.ytimg.com/vi/T4r5a6v7e8l/hqdefault.jpg",
    topic: "Travel",
    level: "B1",
    duration: "13:15",
    progress: 63,
  },
  {
    youtubeId: "E2n3t4m5u6s",
    title: "Entertainment Talk | Award Night",
    thumbnailUrl: "https://i.ytimg.com/vi/E2n3t4m5u6s/hqdefault.jpg",
    topic: "Entertainment",
    level: "B2",
    duration: "14:10",
    progress: 38,
  },
  {
    youtubeId: "B7a6s5i4c3s",
    title: "Beginner Listening | Weather Vocabulary",
    thumbnailUrl: "https://i.ytimg.com/vi/B7a6s5i4c3s/hqdefault.jpg",
    topic: "Basics",
    level: "A1",
    duration: "06:50",
    progress: 83,
  },
  {
    youtubeId: "C4o5n6v7e8r",
    title: "Conversation Practice | At the Market",
    thumbnailUrl: "https://i.ytimg.com/vi/C4o5n6v7e8r/hqdefault.jpg",
    topic: "Conversation",
    level: "A2",
    duration: "10:40",
    progress: 55,
  },
]);

const searchQuery = ref("");
const selectedLevel = ref<string | null>(null);
const selectedDuration = ref<string | null>(null);
const selectedTopic = ref<string | null>(null);
const pageIndex = ref(0);
const pageSize = 8;

const levelMenuItems = computed(() => [
  { label: "Tat ca", onSelect: () => (selectedLevel.value = null) },
  { label: "A1", onSelect: () => (selectedLevel.value = "A1") },
  { label: "A2", onSelect: () => (selectedLevel.value = "A2") },
  { label: "B1", onSelect: () => (selectedLevel.value = "B1") },
  { label: "B2", onSelect: () => (selectedLevel.value = "B2") },
  { label: "C1", onSelect: () => (selectedLevel.value = "C1") },
]);

const durationMenuItems = computed(() => [
  { label: "Tat ca", onSelect: () => (selectedDuration.value = null) },
  { label: "Duoi 10 phut", onSelect: () => (selectedDuration.value = "short") },
  { label: "10-15 phut", onSelect: () => (selectedDuration.value = "medium") },
  { label: "Tren 15 phut", onSelect: () => (selectedDuration.value = "long") },
]);

const topicMenuItems = computed(() => [
  { label: "Tat ca", onSelect: () => (selectedTopic.value = null) },
  { label: "Conversation", onSelect: () => (selectedTopic.value = "Conversation") },
  { label: "Business", onSelect: () => (selectedTopic.value = "Business") },
  { label: "IELTS", onSelect: () => (selectedTopic.value = "IELTS") },
  { label: "News", onSelect: () => (selectedTopic.value = "News") },
  { label: "Travel", onSelect: () => (selectedTopic.value = "Travel") },
  { label: "Entertainment", onSelect: () => (selectedTopic.value = "Entertainment") },
  { label: "Basics", onSelect: () => (selectedTopic.value = "Basics") },
  { label: "Technology", onSelect: () => (selectedTopic.value = "Technology") },
]);

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase());

const filteredVideos = computed(() => {
  return allVideos.value.filter((video) => {
    if (selectedLevel.value && video.level !== selectedLevel.value) return false;

    if (selectedDuration.value) {
      const [minutes] = video.duration.split(":");
      const durationMinutes = Number(minutes);

      if (selectedDuration.value === "short" && durationMinutes >= 10) return false;
      if (selectedDuration.value === "medium" && (durationMinutes < 10 || durationMinutes > 15))
        return false;
      if (selectedDuration.value === "long" && durationMinutes <= 15) return false;
    }

    if (selectedTopic.value && video.topic !== selectedTopic.value) return false;

    if (normalizedQuery.value) {
      const haystack = `${video.title} ${video.topic}`.toLowerCase();
      if (!haystack.includes(normalizedQuery.value)) return false;
    }

    return true;
  });
});

const pageCount = computed(() => Math.max(1, Math.ceil(filteredVideos.value.length / pageSize)));
const currentPage = computed({
  get: () => Math.min(pageCount.value, pageIndex.value + 1),
  set: (value) => {
    const safePage = Math.min(Math.max(1, Math.floor(value)), pageCount.value);
    pageIndex.value = safePage - 1;
  },
});

const pagedVideos = computed(() => {
  const start = pageIndex.value * pageSize;
  return filteredVideos.value.slice(start, start + pageSize);
});

function clearFilters() {
  selectedLevel.value = null;
  selectedDuration.value = null;
  selectedTopic.value = null;
  searchQuery.value = "";
  pageIndex.value = 0;
}

watch([selectedLevel, selectedDuration, selectedTopic, searchQuery], () => {
  pageIndex.value = 0;
});
</script>
