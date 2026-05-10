<template>
  <UApp>
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
});
</script>
