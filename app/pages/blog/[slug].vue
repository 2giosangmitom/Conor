<template>
  <UMain>
    <article v-if="post" class="prose dark:prose-invert max-w-3xl mx-auto py-12 px-4">
      <header class="mb-10">
        <h1 class="text-4xl font-bold mb-3">
          {{ post.title }}
        </h1>

        <p class="text-sm text-muted">
          {{ formatDate(post.date) }}
        </p>

        <!-- <p v-if="post.description" class="mt-4 text-lg text-muted">
          {{ post.description }}
        </p> -->
      </header>

      <ContentRenderer :value="post" />
    </article>
  </UMain>
</template>

<script setup lang="ts">
const route = useRoute();

const slug = route.params.slug as string;

const { data: post } = await useAsyncData(`blog-${slug}`, async () => {
  const posts = await queryCollection("blog").all();

  return posts.find((item: any) => {
    return item.stem?.split("/").pop() === slug;
  });
});

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
});

function formatDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>
