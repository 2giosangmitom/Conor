<template>
  <section class="py-16" style="background: #f8f2fa;">
    <UContainer :ui="{ base: 'max-w-7xl' }">
      <div class="flex flex-col items-center gap-8">

        <!-- Trusted by text + avatars -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <UAvatarGroup size="md" :max="5">
            <UAvatar
              v-for="avatar in avatars"
              :key="avatar.alt"
              :src="avatar.src"
              :alt="avatar.alt"
              :ui="{ base: 'ring-2 ring-white' }"
            />
          </UAvatarGroup>
          <div class="text-center sm:text-left">
            <p class="font-semibold text-sm" style="color: #1d1b20; font-family: 'Plus Jakarta Sans', sans-serif;">Được tin dùng bởi hàng ngàn người học</p>
            <div class="flex items-center gap-1 justify-center sm:justify-start mt-0.5">
              <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-3.5 h-3.5" style="color: #f59e0b;" />
              <span class="text-xs ml-1" style="color: #7a7582; font-family: 'Inter', sans-serif;">4.9/5 từ người học</span>
            </div>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex flex-col items-center gap-1 p-6 rounded-3xl text-center transition-transform hover:-translate-y-1"
            style="background: white; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04);"
          >
            <span class="text-4xl font-bold" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #10B981;">{{ stat.value }}</span>
            <span class="text-sm font-medium" style="color: #494551; font-family: 'Inter', sans-serif;">{{ stat.label }}</span>
          </div>
        </div>

        <!-- Community join badge -->
        <div class="flex items-center gap-3 px-5 py-3 rounded-full" style="background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          <div class="w-2 h-2 rounded-full animate-pulse" style="background: #10B981;"></div>
          <span class="text-sm font-medium" style="color: #494551; font-family: 'Inter', sans-serif;">
            <span class="font-bold" style="color: #10B981;">+1K</span> người đã tham gia cộng đồng tuần này
          </span>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const avatars = [
  { src: 'https://i.pravatar.cc/40?img=1', alt: 'User 1' },
  { src: 'https://i.pravatar.cc/40?img=2', alt: 'User 2' },
  { src: 'https://i.pravatar.cc/40?img=3', alt: 'User 3' },
  { src: 'https://i.pravatar.cc/40?img=4', alt: 'User 4' },
  { src: 'https://i.pravatar.cc/40?img=5', alt: 'User 5' },
  { src: 'https://i.pravatar.cc/40?img=6', alt: 'User 6' },
]

const stats = [
  { value: '10K+', label: 'Lượt luyện tập' },
  { value: '3K+', label: 'Người học mỗi ngày' },
  { value: '500K+', label: 'Từ đã gõ' },
]
</script>
