<script setup lang="ts">
const colorMode = useColorMode();

const auroraColors = computed(() => {
  return colorMode.value === "dark"
    ? [
        "var(--color-primary-100)",
        "var(--color-primary-200)",
        "var(--color-primary-300)",
        "var(--color-primary-400)",
      ]
    : [
        "var(--color-primary-300)",
        "var(--color-primary-500)",
        "var(--color-primary-700)",
        "var(--color-primary-900)",
      ];
});

useSeoMeta({
  title: "Blog",
  description: "Bài viết, hướng dẫn và thông báo từ đội ngũ NgheGo",
});

const { data: posts } = await useAsyncData("blog-posts", () => queryCollection("blog").all());

const postsArr = computed(() =>
  (posts.value ?? [])
    .filter((p) => !p.draft)
    .map((p) => ({ ...p, slug: p.stem?.split("/").pop() ?? "" }))
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()),
);

const featuredPost = computed(() => postsArr.value[0] ?? null);
const otherPosts = computed(() => postsArr.value.slice(1));

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>

<template>
  <UMain>
    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero description="Bài viết, hướng dẫn và thông báo từ đội ngũ NgheGo">
          <template #title>
            <span class="flex flex-col items-center gap-4">
              <UBadge class="tracking-normal" variant="soft" icon="lucide:compass">
                Khám phá bài học
              </UBadge>
              <ClientOnly>
                <UiAuroraText :colors="auroraColors"> Bài viết &amp; Cập nhật </UiAuroraText>
                <template #fallback>
                  <span class="text-4xl font-bold sm:text-5xl lg:text-6xl">
                    Bài viết &amp; Cập nhật
                  </span>
                </template>
              </ClientOnly>
            </span>
          </template>
        </UPageHero>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <div class="bg-muted">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
          <UPageSection>
            <template #body>
              <div v-if="postsArr.length" class="space-y-8">
                <!-- Featured post -->
                <NuxtLink :to="`/blog/${featuredPost!.slug}`" class="block">
                  <UPageCard
                    variant="outline"
                    spotlight
                    spotlight-color="primary"
                    orientation="horizontal"
                    :reverse="false"
                    class="group"
                  >
                    <template v-if="featuredPost!.image" #default>
                      <NuxtImg
                        :src="featuredPost!.image"
                        :alt="featuredPost!.title"
                        class="w-full h-56 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </template>
                    <template #title>
                      <div class="flex items-start justify-between gap-4">
                        <span class="text-xl font-bold line-clamp-2">{{
                          featuredPost!.title
                        }}</span>
                        <time class="text-sm text-muted whitespace-nowrap shrink-0">
                          {{ formatDate(featuredPost!.date) }}
                        </time>
                      </div>
                    </template>
                    <template #description>
                      <p class="text-muted line-clamp-3">{{ featuredPost!.description }}</p>
                      <div v-if="featuredPost!.tags?.length" class="flex flex-wrap gap-2 mt-3">
                        <UBadge
                          v-for="tag in featuredPost!.tags"
                          :key="tag"
                          variant="soft"
                          size="sm"
                          >{{ tag }}</UBadge
                        >
                      </div>
                    </template>
                  </UPageCard>
                </NuxtLink>

                <!-- Other posts grid -->
                <div v-if="otherPosts.length" class="grid gap-6 sm:grid-cols-2">
                  <NuxtLink
                    v-for="post in otherPosts"
                    :key="post.slug"
                    :to="`/blog/${post.slug}`"
                    class="block"
                  >
                    <UPageCard variant="outline" spotlight spotlight-color="primary" class="h-full">
                      <template v-if="post.image" #header>
                        <NuxtImg
                          :src="post.image"
                          :alt="post.title"
                          class="w-full h-40 object-cover rounded-t-lg"
                          loading="lazy"
                        />
                      </template>
                      <template #title>
                        <div class="flex items-start justify-between gap-2">
                          <span class="font-semibold line-clamp-2">{{ post.title }}</span>
                          <time class="text-xs text-muted whitespace-nowrap shrink-0">
                            {{ formatDate(post.date) }}
                          </time>
                        </div>
                      </template>
                      <template #description>
                        <p class="text-sm text-muted line-clamp-3">{{ post.description }}</p>
                        <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mt-2">
                          <UBadge v-for="tag in post.tags" :key="tag" variant="soft" size="xs">{{
                            tag
                          }}</UBadge>
                        </div>
                      </template>
                    </UPageCard>
                  </NuxtLink>
                </div>
              </div>

              <div v-else class="py-16 text-center text-muted">Chưa có bài viết nào.</div>
            </template>
          </UPageSection>
        </UiBlurReveal>
      </div>
    </ClientOnly>
  </UMain>
</template>
