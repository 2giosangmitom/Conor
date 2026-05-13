<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 border-b border-white/20"
    style="background: rgba(253, 247, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
  >
    <UContainer :ui="{ base: 'max-w-7xl' }">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl" style="color: #10B981; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style="background: linear-gradient(135deg, #10B981, #059669);">
            N
          </div>
          NgheGo
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <UButton
            v-for="item in navItems"
            :key="item.label"
            :to="item.to"
            variant="ghost"
            color="neutral"
            size="sm"
            :label="item.label"
          />
        </nav>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <UButton
            to="/signin"
            variant="ghost"
            color="neutral"
            size="sm"
            label="Đăng nhập"
          />
          <UButton
            to="/signup"
            size="sm"
            label="Đăng ký"
            :ui="{ base: 'rounded-full px-5 font-semibold' }"
            style="background: linear-gradient(135deg, #10B981, #059669); color: white;"
          />
        </div>

        <!-- Mobile Hamburger -->
        <UButton
          class="md:hidden"
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          size="sm"
          @click="mobileOpen = true"
        />
      </div>
    </UContainer>

    <!-- Mobile Slideover (controlled via v-model:open) -->
    <USlideover v-model:open="mobileOpen" side="right" title="NgheGo">
      <template #body>
        <div class="flex flex-col gap-2">
          <nav class="flex flex-col gap-1">
            <UButton
              v-for="item in navItems"
              :key="item.label"
              :to="item.to"
              variant="ghost"
              color="neutral"
              :label="item.label"
              class="justify-start"
              @click="mobileOpen = false"
            />
          </nav>
          <USeparator class="my-2" />
          <UButton
            to="/signin"
            variant="outline"
            color="neutral"
            label="Đăng nhập"
            class="w-full"
            @click="mobileOpen = false"
          />
          <UButton
            to="/signup"
            label="Đăng ký"
            class="w-full rounded-full"
            style="background: linear-gradient(135deg, #10B981, #059669); color: white;"
            @click="mobileOpen = false"
          />
        </div>
      </template>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

const navItems = [
  { label: 'Khám phá', to: '#explore' },
  { label: 'Tính năng', to: '#features' },
  { label: 'Cách hoạt động', to: '#how-it-works' },
  { label: 'FAQ', to: '#faq' },
]
</script>
