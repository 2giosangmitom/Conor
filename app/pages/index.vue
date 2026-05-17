<template>
  <UMain class="relative overflow-hidden">
    <div class="relative z-10">
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero
          description="Tạm biệt sách giáo khoa nhàm chán. Đắm chìm vào nội dung thực tế, luyện nghe chép chính tả và theo dõi tiến bộ với phản hồi chi tiết để chinh phục Tiếng Anh."
        >
          <template #title>
            <div class="flex flex-col items-center gap-4">
              <UBadge class="tracking-normal" variant="soft" icon="lucide:badge-check">
                Không cần đăng nhập
              </UBadge>
              <span class="font-heading">Luyện nghe chép chính tả Tiếng Anh với các video bạn</span>
              <UiFlipWords
                :words="['yêu thích', 'đam mê', 'hứng thú']"
                :duration="3000"
                class="whitespace-nowrap font-heading"
              />
            </div>
          </template>
          <template #links>
            <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row">
              <UInput
                v-model="videoUrl"
                placeholder="https://www.youtube.com/watch?v=example"
                aria-label="Dán link YouTube vào đây"
                leading-icon="simple-icons:youtube"
                class="min-w-md"
                size="xl"
                @keyup.enter="handleStart"
              />
              <UButton
                label="Bắt đầu"
                trailing-icon="i-lucide-play"
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
    </div>
  </UMain>
</template>

<script setup lang="ts">
const videoUrl = ref("");

function handleStart() {
  if (!videoUrl.value) return;
  navigateTo({
    path: "/learn",
    query: { url: videoUrl.value },
  });
}
</script>
