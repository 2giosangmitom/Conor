<template>
  <UMain>
    <UPageSection description="Bài viết, hướng dẫn và thông báo từ đội ngũ">
      <template #title>
        <h1 class="text-3xl font-bold">Blog</h1>
      </template>

      <template #body>
        <div class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="post in posts"
            :key="post._path"
            :to="`/blog/${post.slug ?? (post._path || '').split('/').pop()}`"
            class="block"
          >
            <UPageCard variant="outline" class="h-full">
              <template #title>
                <div class="flex items-baseline justify-between gap-4">
                  <h2 class="text-lg font-medium">{{ post.title }}</h2>
                  <time class="text-sm text-muted">{{ formatDate(post.date) }}</time>
                </div>
              </template>
              <template #description>
                <p class="text-sm text-slate-700 line-clamp-3">
                  {{ post.description ?? post.excerpt }}
                </p>
              </template>
            </UPageCard>
          </NuxtLink>

          <div
            v-if="!posts || posts.length === 0"
            class="col-span-full text-center py-8 text-muted"
          >
            Chưa có bài viết nào. Hãy quay lại sau!
          </div>
        </div>
      </template>
    </UPageSection>
  </UMain>
</template>

<script setup lang="ts">
import { useAsyncData } from "#imports";
// queryContent is provided by @nuxt/content at runtime; declare to satisfy TS
declare const queryContent: any;

// Server-side fetch all posts in content/blog, newest first
const postsAsync = await useAsyncData("blog-posts", () =>
  queryContent("blog").sort({ by: "date", order: "desc" }).find(),
);

const posts = computed(() => (postsAsync.data?.value ?? []) as Record<string, any>[]);

function formatDate(iso?: string | number) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return String(iso);
  }
}
</script>
