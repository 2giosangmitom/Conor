<template>
  <section class="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28" style="background: #fdf7ff;">
    <!-- Background glow blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style="background: radial-gradient(circle, #10B981, transparent);"></div>
      <div class="absolute top-20 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl" style="background: radial-gradient(circle, #6750a4, transparent);"></div>
      <div class="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl" style="background: radial-gradient(circle, #10B981, transparent);"></div>
    </div>

    <UContainer :ui="{ base: 'max-w-7xl relative' }">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <!-- LEFT: Content -->
        <div class="flex flex-col gap-6">
          <!-- Badge -->
          <div class="flex">
            <UBadge
              color="success"
              variant="soft"
              size="md"
              :ui="{ base: 'rounded-full px-4 py-1.5 font-medium gap-2' }"
            >
              <UIcon name="i-lucide-check-circle" class="w-4 h-4" />
              100% Miễn phí Luyện nghe Tiếng Anh
            </UBadge>
          </div>

          <!-- Heading -->
          <h1 class="text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1d1b20; letter-spacing: -0.02em;">
            Luyện nghe chép chính tả tiếng Anh từ video YouTube
            <span style="color: #10B981;"> Miễn phí</span>, không cần đăng nhập
          </h1>

          <!-- Subtitle -->
          <p class="text-lg leading-relaxed" style="font-family: 'Inter', sans-serif; color: #494551; line-height: 1.6;">
            Cải thiện listening, vocabulary và phản xạ tiếng Anh bằng video thực tế từ YouTube. Không cần giáo trình khô khan, chỉ cần nghe — hiểu — gõ lại.
          </p>

          <!-- Input + CTA -->
          <div class="flex flex-col sm:flex-row gap-3 max-w-lg">
            <UInput
              v-model="youtubeUrl"
              placeholder="Dán link YouTube vào đây..."
              size="xl"
              :ui="{ base: 'flex-1 rounded-2xl', root: 'flex-1' }"
              icon="i-lucide-youtube"
            />
            <UButton
              size="xl"
              label="Bắt đầu ngay"
              trailing-icon="i-lucide-arrow-right"
              :ui="{ base: 'rounded-full font-semibold whitespace-nowrap px-6' }"
              style="background: linear-gradient(135deg, #10B981, #059669); color: white;"
            />
          </div>

          <!-- Helper text -->
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4 flex-shrink-0" style="color: #10B981;" />
            <span class="text-sm" style="color: #7a7582; font-family: 'Inter', sans-serif;">Không cần tài khoản để bắt đầu học.</span>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mt-2">
            <UBadge
              v-for="tag in tags"
              :key="tag"
              variant="soft"
              color="neutral"
              size="sm"
              :label="tag"
              :ui="{ base: 'rounded-full px-3 py-1' }"
            />
          </div>
        </div>

        <!-- RIGHT: Mockup UI -->
        <div class="relative flex justify-center lg:justify-end">
          <!-- Outer glow -->
          <div class="absolute inset-0 rounded-3xl blur-2xl opacity-20" style="background: linear-gradient(135deg, #10B981, #6750a4);"></div>

          <UCard
            :ui="{
              base: 'relative w-full max-w-md',
              body: 'p-0',
              root: 'rounded-3xl shadow-2xl border border-white/60',
            }"
            style="background: rgba(255,255,255,0.92); backdrop-filter: blur(20px);"
          >
            <!-- Video Player Mock -->
            <div class="relative rounded-t-3xl overflow-hidden" style="background: #1d1b20; aspect-ratio: 16/9;">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style="background: rgba(16,185,129,0.9);">
                  <UIcon name="i-lucide-play" class="w-7 h-7 text-white ml-1" />
                </div>
              </div>
              <!-- Progress bar -->
              <div class="absolute bottom-0 left-0 right-0 h-1" style="background: rgba(255,255,255,0.2);">
                <div class="h-full w-2/5 rounded-full" style="background: linear-gradient(90deg, #10B981, #059669);"></div>
              </div>
              <!-- Duration badge -->
              <div class="absolute top-3 right-3">
                <UBadge color="neutral" variant="solid" size="xs" label="12:45" :ui="{ base: 'rounded-lg bg-black/70 text-white' }" />
              </div>
            </div>

            <!-- Transcript area -->
            <div class="p-5 flex flex-col gap-4">
              <!-- Active transcript line -->
              <div class="rounded-xl p-3" style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2);">
                <p class="text-sm font-medium mb-2" style="color: #059669; font-family: 'Inter', sans-serif;">Đang nghe...</p>
                <p class="text-sm leading-relaxed" style="color: #1d1b20; font-family: 'Inter', sans-serif;">
                  "How to improve your English speaking <span class="px-1 rounded" style="background: rgba(16,185,129,0.2); color: #059669;">fast</span>?"
                </p>
              </div>

              <!-- Typing input mock -->
              <div class="flex gap-2 items-center">
                <div class="flex-1 rounded-xl border px-3 py-2.5 text-sm" style="border-color: #10B981; background: white; color: #1d1b20; font-family: 'Inter', sans-serif;">
                  How to improve your English...
                  <span class="inline-block w-0.5 h-4 ml-0.5 animate-pulse align-middle" style="background: #10B981;"></span>
                </div>
                <UButton size="sm" icon="i-lucide-check" :ui="{ base: 'rounded-xl' }" style="background: #10B981; color: white;" />
              </div>

              <!-- Stats row -->
              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-xl p-3 text-center" style="background: #f8f2fa;">
                  <p class="text-lg font-bold" style="color: #10B981; font-family: 'Plus Jakarta Sans', sans-serif;">98%</p>
                  <p class="text-xs" style="color: #7a7582; font-family: 'Inter', sans-serif;">Accuracy</p>
                </div>
                <div class="rounded-xl p-3 text-center" style="background: #f8f2fa;">
                  <p class="text-lg font-bold" style="color: #6750a4; font-family: 'Plus Jakarta Sans', sans-serif;">🔥 7</p>
                  <p class="text-xs" style="color: #7a7582; font-family: 'Inter', sans-serif;">Day streak</p>
                </div>
                <div class="rounded-xl p-3 text-center" style="background: #f8f2fa;">
                  <p class="text-lg font-bold" style="color: #1d1b20; font-family: 'Plus Jakarta Sans', sans-serif;">42</p>
                  <p class="text-xs" style="color: #7a7582; font-family: 'Inter', sans-serif;">Words typed</p>
                </div>
              </div>

              <!-- Progress bar -->
              <div>
                <div class="flex justify-between text-xs mb-1.5" style="color: #7a7582; font-family: 'Inter', sans-serif;">
                  <span>Tiến độ bài học</span>
                  <span style="color: #10B981;">40%</span>
                </div>
                <div class="h-2 rounded-full" style="background: #e6e0e9;">
                  <div class="h-full w-2/5 rounded-full" style="background: linear-gradient(90deg, #10B981, #059669);"></div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const youtubeUrl = ref('')

const tags = [
  'Listening', 'Dictation', 'Vocabulary', 'YouTube', 'Free'
]
</script>
