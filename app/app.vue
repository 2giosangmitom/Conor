<template>
  <UApp>
    <a href="#main-content" class="skip-link"> Bỏ qua điều hướng </a>
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
  title: "NgheGo",
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - NgheGo` : "NgheGo"),
  htmlAttrs: { lang: "vi" },
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "canonical", href: origin },
  ],
});

useSeoMeta({
  description:
    "NgheGo - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí với AI transcription chính xác, phản hồi tức thì.",

  ogType: "website",
  ogSiteName: "NgheGo",
  ogTitle: "NgheGo",
  ogDescription:
    "NgheGo - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí với AI transcription chính xác.",
  ogImage: `${origin}/images/logo.svg`,
  ogUrl: origin,
  ogLocale: "vi_VN",

  twitterCard: "summary_large_image",
  twitterTitle: "NgheGo",
  twitterDescription:
    "NgheGo - Luyện nghe chép chính tả tiếng Anh với video YouTube. Cải thiện kỹ năng nghe tiếng Anh miễn phí.",
  twitterImage: `${origin}/images/logo.svg`,

  robots: "index, follow",
});
</script>
