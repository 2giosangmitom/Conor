import { useColorMode } from "@vueuse/core"; import { computed } from "vue";

<template>
  <section class="py-20" style="background: linear-gradient(135deg, #e6f9f3 0%, #ffffff 100%)">
    <UContainer :ui="{ base: 'w-full' }">
      <div
        class="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center border border-white/20"
      >
        <div class="relative z-10 flex flex-col items-center gap-6">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            style='font-family: "Plus Jakarta Sans&quot sans-serif'
          >
            Bắt đầu luyện Listening ngay hôm nay
          </h2>

          <UButton
            size="xl"
            label="Bắt đầu ngay"
            trailing-icon="i-lucide-arrow-right"
            :ui="{
              base: 'rounded-full font-semibold whitespace-nowrap px-8 py-4 transition-transform hover:scale-105 active:scale-95 shadow-lg',
            }"
            style="background: linear-gradient(135deg, #10b981, #059669); color white"
          />

          <p class="text-sm text-gray-600 font-medium" style='font-family: "Inter&quot sans-serif'>
            Hơn 10,000 người đã thay đổi cách họ học tiếng Anh. Đến lượt bạn!
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
