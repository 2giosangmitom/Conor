<template>
  <UApp>
    <a
      href="#main-content"
      class="skip-link"
    >
      Bỏ qua điều hướng
    </a>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  title: "NgheGo",
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - NgheGo` : "NgheGo"),
  htmlAttrs: { lang: "vi" },
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
});
</script>
