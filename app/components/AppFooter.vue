<script setup lang="ts">
import type { FooterColumn } from "@nuxt/ui";

const columns: FooterColumn[] = [
  {
    label: "Sản phẩm",
    children: [
      {
        label: "Khám phá",
        to: "/explore",
      },
      {
        label: "Tính năng",
        to: "#features",
      },
      {
        label: "Cách sử dụng",
        to: "#how-to-use",
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
    ],
  },
];
</script>

<template>
  <USeparator class="h-px"><AppLogo size="sm" /></USeparator>

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns
          :columns="columns"
          :ui="{
            right: 'flex items-start xl:justify-end',
            root: 'xl:grid-cols-3',
            link: 'w-fit',
          }"
        >
          <template #right>
            <AppLogo with-text />
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        &copy; {{ new Date().getFullYear() }} NgheGo. All rights reserved.
      </p>
    </template>

    <template #right>
      <UButton
        to="https://github.com/2giosangmitom/NgheGo"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="NgheGo on GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
