<template>
  <UMain class="relative overflow-hidden">
    <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
      <UPageHero
        description="Làm chủ kỹ năng nghe và chính tả với nội dung YouTube yêu thích của bạn. Luyện tập tiếng Anh đời thực với độ chính xác cao."
      >
        <template #title>
          <div class="flex flex-col items-center gap-4">
            <UBadge class="tracking-normal" variant="soft" icon="lucide:badge-check">
              Hoàn toàn miễn phí
            </UBadge>
            <ClientOnly>
              <UiAuroraText :colors="auroraColors">
                Luyện nghe chép chính tả Tiếng Anh với video bạn yêu thích
              </UiAuroraText>
            </ClientOnly>
          </div>
        </template>

        <template #links>
          <div class="flex flex-col items-center gap-2 sm:flex-row">
            <UInput
              v-model="videoUrl"
              placeholder="https://www.youtube.com/watch?v=example"
              aria-label="Dán link YouTube vào đây"
              leading-icon="openmoji:youtube"
              class="lg:min-w-md"
              size="xl"
              @keyup.enter="handleStart"
            />
            <UButton
              label="Bắt đầu"
              trailing-icon="lucide:play"
              size="xl"
              color="primary"
              variant="solid"
              :disabled="!videoUrl"
              @click="handleStart"
            />
          </div>
        </template>
      </UPageHero>
    </UiBlurReveal>

    <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
      <UPageSection
        id="stats"
        title="Được tin tưởng bởi cộng đồng người học"
        description="Tham gia cùng hàng trăm người học đang cải thiện kỹ năng nghe tiếng Anh mỗi ngày"
      >
        <template #body>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <UPageCard
              v-for="stat in stats"
              :key="stat.label"
              variant="outline"
              spotlight
              spotlight-color="primary"
              class="group"
              :ui="{ wrapper: 'items-center text-center', leading: 'mb-3' }"
            >
              <template #leading>
                <div
                  class="size-10 rounded-lg flex items-center justify-center"
                  :class="stat.bgColor"
                >
                  <UIcon :name="stat.icon" :class="stat.color" class="size-5" />
                </div>
              </template>
              <template #title>
                <div class="flex items-center justify-center gap-1">
                  <ClientOnly>
                    <UiNumberTicker
                      :value="stat.value"
                      :decimal-places="0"
                      class="text-2xl font-bold"
                    />
                  </ClientOnly>
                  <span class="text-2xl font-bold">+</span>
                </div>
              </template>
              <template #description>
                {{ stat.label }}
              </template>
            </UPageCard>
          </div>
        </template>
      </UPageSection>
    </UiBlurReveal>
  </UMain>
</template>

<script setup lang="ts">
const videoUrl = ref("");
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

interface Stat {
  icon: string;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

const stats: Stat[] = [
  {
    icon: "lucide:users",
    value: 500,
    label: "Người dùng",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:video",
    value: 100,
    label: "Video",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:clock-check",
    value: 200,
    label: "Thành viên hoạt động mỗi ngày",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

function handleStart() {
  if (!videoUrl.value) return;

  const youtubeId = new URL(videoUrl.value).searchParams.get("v");

  navigateTo({
    path: `/practice/${youtubeId}`,
  });
}
</script>
