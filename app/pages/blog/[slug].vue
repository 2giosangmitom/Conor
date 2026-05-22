<template>
  <UMain>
    <article class="prose max-w-none mx-auto py-12 px-4">
      <header class="mb-6">
        <h1 class="text-3xl font-bold mb-2">{{ post.title }}</h1>
        <p class="text-sm text-muted">{{ formatDate(post.date) }}</p>
      </header>

      <Content :document="post" />
    </article>
  </UMain>
</template>

<script setup lang="ts">
import { useAsyncData } from "#imports";
// queryContent is provided by @nuxt/content at runtime; declare to satisfy TS
declare const queryContent: any;
const route = useRoute();
const slug = String(route.params.slug || "");

const key = `blog-post-${slug}`;
const postAsync = await useAsyncData(key, () =>
  queryContent("blog")
    .where({ slug })
    .findOne()
    .then((r: any) => {
      if (r) return r;
      // fallback: try matching by filename/path
      return queryContent("blog")
        .where({ _path: `/blog/${slug}` })
        .findOne();
    }),
);

const postRaw = postAsync.data?.value as Record<string, any> | undefined;

if (!postRaw) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const post = postRaw;

function formatDate(iso?: string | number) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return String(iso);
  }
}
</script>
