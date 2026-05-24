<script setup lang="ts">
import type { PageAnchor } from "@nuxt/ui";

const route = useRoute();
const slug = route.params.slug as string;

const { data: post } = await useAsyncData(`blog-${slug}`, async () => {
  const posts = await queryCollection("blog").all();
  return posts.find((item) => item.stem?.split("/").pop() === slug) ?? null;
});

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
});

// Reading time: ~200 words/min
const readingTime = computed(() => {
  const text = JSON.stringify(post.value?.body ?? "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
});

// Map TOC links for UPageAnchors
type TocLink = { id: string; text: string; depth: number; children?: TocLink[] };
function mapTocLinks(links: TocLink[]): PageAnchor[] {
  return links.map((l) => ({ label: l.text, to: `#${l.id}` }));
}
const tocLinks = computed<PageAnchor[]>(() => {
  const body = post.value?.body as { toc?: { links?: TocLink[] } } | undefined;
  return mapTocLinks(body?.toc?.links ?? []);
});

// Related posts: same first tag, exclude current
const { data: relatedPosts } = await useAsyncData(`related-${slug}`, async () => {
  const firstTag = post.value?.tags?.[0];
  if (!firstTag) return [];
  const all = await queryCollection("blog").all();
  return all
    .filter((p) => !p.draft && p.stem?.split("/").pop() !== slug && p.tags?.includes(firstTag))
    .slice(0, 2)
    .map((p) => ({ ...p, slug: p.stem?.split("/").pop() ?? "" }));
});

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Scroll-spy: track active heading via IntersectionObserver
const activeId = ref("");

// Scroll-to-top visibility
const showScrollTop = ref(false);

onMounted(() => {
  // Scroll-spy
  const headings = document.querySelectorAll<HTMLElement>("article h2, article h3");
  if (headings.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );
    headings.forEach((el) => observer.observe(el));
    onUnmounted(() => observer.disconnect());
  }

  // Show scroll-to-top after scrolling 300px
  const onScroll = () => {
    showScrollTop.value = window.scrollY > 300;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <UMain>
    <template v-if="post">
      <!-- Article header -->
      <div class="border-b border-default">
        <UContainer class="py-8 space-y-4">
          <UButton
            to="/blog"
            variant="ghost"
            icon="lucide:arrow-left"
            label="Quay lại Blog"
            color="neutral"
            size="sm"
          />

          <NuxtImg
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full max-h-72 object-cover rounded-xl"
            loading="eager"
          />

          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in post.tags" :key="tag" variant="soft">{{ tag }}</UBadge>
          </div>

          <h1 class="text-3xl font-bold sm:text-4xl">{{ post.title }}</h1>

          <div class="flex items-center gap-4 text-sm text-muted">
            <time>{{ formatDate(post.date) }}</time>
            <span class="flex items-center gap-1">
              <UIcon name="lucide:clock" class="size-4" />
              {{ readingTime }} phút đọc
            </span>
          </div>
        </UContainer>
      </div>

      <!-- Article body + TOC -->
      <UPage>
        <UPageBody>
          <article class="prose dark:prose-invert max-w-3xl mx-auto">
            <ContentRenderer :value="post" />
          </article>

          <!-- Related posts -->
          <template v-if="relatedPosts?.length">
            <USeparator class="my-10 max-w-3xl mx-auto" />
            <div class="space-y-4 max-w-3xl mx-auto">
              <h2 class="text-xl font-semibold">Bài viết liên quan</h2>
              <div class="grid gap-4 sm:grid-cols-2">
                <NuxtLink
                  v-for="related in relatedPosts"
                  :key="related.slug"
                  :to="`/blog/${related.slug}`"
                  class="block"
                >
                  <UPageCard variant="outline" spotlight spotlight-color="primary" class="h-full">
                    <template #title>
                      <div class="flex items-start justify-between gap-2">
                        <span class="font-semibold line-clamp-2">{{ related.title }}</span>
                        <time class="text-xs text-muted whitespace-nowrap shrink-0">
                          {{ formatDate(related.date) }}
                        </time>
                      </div>
                    </template>
                    <template #description>
                      <p class="text-sm text-muted line-clamp-2">{{ related.description }}</p>
                    </template>
                  </UPageCard>
                </NuxtLink>
              </div>
            </div>
          </template>
        </UPageBody>

        <template #right>
          <UPageAside v-if="tocLinks.length">
            <div class="space-y-3">
              <p class="text-sm font-semibold text-highlighted">Mục lục</p>
              <UPageAnchors :links="tocLinks">
                <template #link="{ link }">
                  <NuxtLink
                    :to="link.to"
                    class="block w-full rounded px-2 py-1 text-sm transition-colors"
                    :class="
                      activeId && link.to === `#${activeId}`
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted hover:text-default'
                    "
                  >
                    {{ link.label }}
                  </NuxtLink>
                </template>
              </UPageAnchors>
            </div>
          </UPageAside>
        </template>
      </UPage>
    </template>

    <!-- Scroll-to-top button -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <UButton
        v-if="showScrollTop"
        icon="lucide:arrow-up"
        color="neutral"
        variant="solid"
        size="lg"
        aria-label="Cuộn lên đầu trang"
        class="fixed bottom-6 right-6 z-50 shadow-lg rounded-full"
        @click="scrollToTop"
      />
    </Transition>
  </UMain>
</template>
