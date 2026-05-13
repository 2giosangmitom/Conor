<!-- filepath: d:\Du_an\NgheGo\app\components\landing\HeroSection.vue -->
<template>
  <section
    class="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    style="background: #fdf7ff"
  >
    <!-- Background glow blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style="background: radial-gradient(circle, #10b981, transparent)"
      />
      <div
        class="absolute top-20 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style="background: radial-gradient(circle, #6750a4, transparent)"
      />
      <div
        class="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style="background: radial-gradient(circle, #10b981, transparent)"
      />
    </div>

    <UContainer :ui="{ base: 'max-w-7xl mx-auto relative' }">
      <div class="grid grid-cols-1 gap-12 lg:gap-16 items-center text-center">
        <div class="flex flex-col gap-6">
          <!-- Badge -->
          <div class="flex items-center justify-center">
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
          <h1
            class="text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight max-w-6xl mx-auto"
            style='
              font-family: "Plus Jakarta Sans&quot sans-serif color #1d1b20;
              letter-spacing -0.02em;
            '
          >
            Luyện nghe chép chính tả tiếng Anh từ video YouTube
            <span style="color: #10b981"> Miễn phí</span>,
            <span style="color: #10b981">Không cần đăng nhập</span>
          </h1>

          <!-- Subtitle -->
          <p
            class="text-lg leading-relaxed max-w-150 mx-auto"
            style='font-family: "Inter&quot sans-serif; color: #494551; line-height: 1.6'
          >
            Cải thiện listening, vocabulary và phản xạ tiếng Anh bằng video YouTube. Không cần giáo
            trình khô khan, chỉ cần nghe — hiểu — gõ lại.
          </p>

          <!-- Input + CTA -->
          <div class="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
            <UInput
              v-model="youtubeUrl"
              placeholder="Dán link YouTube vào đây..."
              :ui="{ base: 'rounded-2xl px-8 py-4 min-w-70' }"
              icon="i-lucide-youtube"
            />
            <UButton
              size="xl"
              label="Bắt đầu ngay"
              trailing-icon="i-lucide-arrow-right"
              :ui="{
                base: 'rounded-full font-semibold whitespace-nowrap px-8 py-4 transition-transform hover:scale-105 active:scale-95 shadow-lg',
              }"
              style="background: linear-gradient(135deg, #10b981, #059669); color white"
            />
          </div>

          <!-- Helper text -->
          <div class="flex items-center gap-2 mx-auto">
            <UIcon name="i-lucide-info" class="w-4 h-4 shrink-0" style="color: #10b981" />
            <span class="text-sm" style='color: #7a7582; font-family: "Inter&quot sans-serif'
              >Không cần tài khoản để bắt đầu học.</span
            >
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const youtubeUrl = ref("");
</script>
