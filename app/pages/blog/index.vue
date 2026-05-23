<template>
  <UMain>
    <UPageSection title="Blog" description="Bài viết, hướng dẫn và thông báo từ đội ngũ">
      <template #body>
        <div v-if="postsArr.length" class="grid gap-6 sm:grid-cols-2">
          <NuxtLink
            v-for="post in postsArr"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="block"
          >
            <UPageCard variant="outline" class="h-full hover:border-primary transition-colors">
              <template #title>
                <div class="flex items-start justify-between gap-4">
                  <h2 class="text-lg font-semibold line-clamp-2">
                    {{ post.title }}
                  </h2>

                  <time v-if="post.date" class="text-sm text-muted whitespace-nowrap">
                    {{ formatDate(post.date) }}
                  </time>
                </div>
              </template>

              <template #description>
                <p class="text-sm text-muted line-clamp-3">
                  {{ post.description }}
                </p>
              </template>
            </UPageCard>
          </NuxtLink>
        </div>

        <div v-else class="py-16 text-center text-muted">Chưa có bài viết nào.</div>
      </template>
    </UPageSection>
  </UMain>
</template>

<script setup lang="ts">
interface BlogPost {
  stem?: string;
  title?: string;
  date?: string;
  description?: string;
}

const { data: posts } = await useAsyncData("blog-posts", async () => {
  return await queryCollection("blog").all();
});

const postsArr = computed(() => {
  return (posts.value ?? [])
    .map((post: BlogPost) => ({
      ...post,

      slug: post.stem?.split("/").pop() ?? "",
    }))

    .sort((a, b) => {
      const dateA = new Date(a.date ?? 0).getTime();
      const dateB = new Date(b.date ?? 0).getTime();

      return dateB - dateA;
    });
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
