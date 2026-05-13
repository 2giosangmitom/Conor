<template>
  <section id="explore" class="py-20" style="background: #fdf7ff;">
    <UContainer :ui="{ base: 'max-w-7xl' }">

      <!-- Section header -->
      <div class="flex items-end justify-between mb-10">
        <div>
          <h2 class="text-3xl font-semibold mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1d1b20;">
            Video đang thịnh hành
          </h2>
          <p class="text-base" style="color: #7a7582; font-family: 'Inter', sans-serif;">
            Những bài luyện tập phổ biến nhất tuần này
          </p>
        </div>
        <UButton
          variant="ghost"
          color="success"
          label="Xem tất cả"
          trailing-icon="i-lucide-chevron-right"
          size="sm"
          :ui="{ base: 'font-medium' }"
        />
      </div>

      <!-- Video Cards Grid / Carousel -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard
          v-for="video in videos"
          :key="video.title"
          :ui="{
            root: 'rounded-3xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group',
            body: 'p-0',
          }"
          style="box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04);"
        >
          <!-- Thumbnail -->
          <div class="relative overflow-hidden" style="aspect-ratio: 16/9; background: #1d1b20;">
            <img
              :src="video.thumbnail"
              :alt="video.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <!-- Level badge -->
            <div class="absolute top-3 left-3">
              <UBadge
                :color="levelColor(video.level)"
                variant="solid"
                size="xs"
                :label="video.level"
                :ui="{ base: 'rounded-lg font-semibold' }"
              />
            </div>
            <!-- Duration -->
            <div class="absolute bottom-3 right-3">
              <UBadge
                color="neutral"
                variant="solid"
                size="xs"
                :label="video.duration"
                :ui="{ base: 'rounded-lg bg-black/70 text-white' }"
              />
            </div>
            <!-- Play button -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(16,185,129,0.9);">
                <UIcon name="i-lucide-play" class="w-5 h-5 text-white ml-0.5" />
              </div>
            </div>
          </div>

          <!-- Card content -->
          <div class="p-5">
            <h3 class="font-semibold text-base mb-3 line-clamp-2 leading-snug" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1d1b20;">
              {{ video.title }}
            </h3>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-globe" class="w-3.5 h-3.5" style="color: #7a7582;" />
                <span class="text-xs" style="color: #7a7582; font-family: 'Inter', sans-serif;">Accent: {{ video.accent }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-users" class="w-3.5 h-3.5" style="color: #7a7582;" />
                <span class="text-xs" style="color: #7a7582; font-family: 'Inter', sans-serif;">{{ video.learners }} learners</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

    </UContainer>
  </section>
</template>

<script setup lang="ts">
const videos = [
  {
    title: 'How to improve your English speaking fast?',
    level: 'Intermediate',
    duration: '12:45',
    accent: 'US',
    learners: '1.2k',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=640&q=80',
  },
  {
    title: 'Business English: Navigating Complex Meetings',
    level: 'Advanced',
    duration: '18:30',
    accent: 'UK',
    learners: '850',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&q=80',
  },
  {
    title: 'Basic Conversation Phrases for Travelers',
    level: 'Beginner',
    duration: '08:12',
    accent: 'AU',
    learners: '2.5k',
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=640&q=80',
  },
]

function levelColor(level: string) {
  if (level === 'Beginner') return 'success'
  if (level === 'Intermediate') return 'warning'
  if (level === 'Advanced') return 'error'
  return 'neutral'
}
</script>
