<template>
  <UMain class="relative overflow-hidden">
    <div class="relative z-10">
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero
          description="Tạm biệt sách giáo khoa nhàm chán. Đắm chìm vào nội dung thực tế, luyện nghe chép chính tả và theo dõi tiến bộ với phản hồi chi tiết để chinh phục Tiếng Anh."
        >
          <template #title>
            <span class="font-heading">Luyện nghe chép chính tả Tiếng Anh với các video bạn</span>
            <UiFlipWords
              :words="['yêu thích', 'đam mê', 'hứng thú']"
              :duration="3000"
              class="whitespace-nowrap font-heading"
            />
          </template>
          <template #links>
            <UFieldGroup class="w-full max-w-lg">
              <UInput
                v-model="videoUrl"
                placeholder="Dán link YouTube vào đây..."
                aria-label="Dán link YouTube vào đây"
                leading-icon="i-logos-youtube-icon"
                size="xl"
                class="flex-1"
                @keyup.enter="handleStart"
              />
              <UButton
                label="Bắt đầu học"
                trailing-icon="i-lucide-play"
                size="xl"
                color="primary"
                variant="solid"
                :disabled="!videoUrl"
                @click="handleStart"
              />
            </UFieldGroup>
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
