<template>
  <UApp>
    <UButton
      href="#main-content"
      color="primary"
      variant="solid"
      size="md"
      class="sr-only-focusable"
    >
      Bỏ qua điều hướng
    </UButton>
    <NuxtAnnouncer />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right, #00dc82 0%, #34cdfe 50%, #0047e1 100%)"
      :height="3"
      :duration="2000"
      :throttle="200"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { origin } = useRequestURL();

useHead({
  title: "Conor",
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Conor` : "Conor"),
  htmlAttrs: { lang: "vi" },
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "canonical", href: origin },
  ],
});

useSeoMeta({
  description:
    "Conor - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí với AI transcription chính xác, phản hồi tức thì.",

  ogType: "website",
  ogSiteName: "Conor",
  ogTitle: "Conor",
  ogDescription:
    "Conor - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí với AI transcription chính xác.",
  ogImage: `${origin}/images/logo.svg`,
  ogUrl: origin,
  ogLocale: "vi_VN",

  twitterCard: "summary_large_image",
  twitterTitle: "Conor",
  twitterDescription:
    "Conor - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí.",
  twitterImage: `${origin}/images/logo.svg`,

  robots: "index, follow",
});
</script>
