<script setup lang="ts">
import type { FooterColumnLink, FooterColumn } from "@nuxt/ui";

const columns = computed<FooterColumn<FooterColumnLink>[]>(() => [
  {
    label: "Sản phẩm",
    children: [
      {
        label: "Tính năng",
        to: "/#features",
      },
      {
        label: "Cách sử dụng",
        to: "/#how-to-use",
      },
    ],
  },
  {
    label: "Công ty",
    children: [
      {
        label: "Về chúng tôi",
        to: "/about",
      },
      {
        label: "Đội ngũ",
        to: "/team",
      },
      {
        label: "Blog",
        to: "/blog",
      },
    ],
  },
]);
</script>

<template>
  <UFooter class="bg-muted">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <div class="flex items-center gap-2">
              <span
                aria-hidden="true"
                class="size-6 bg-current"
                :style="{
                  WebkitMask: 'url(/images/logo.svg) no-repeat center / contain',
                  mask: 'url(/images/logo.svg) no-repeat center / contain',
                }"
              />
              <span class="text-sm font-semibold">NgheGo</span>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">&copy; {{ new Date().getFullYear() }} NgheGo</p>
    </template>

    <template #right>
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/nghengo"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
  </UFooter>
</template>
