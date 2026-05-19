<template>
  <div class="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950">
    <AppHeader />
    <UMain class="relative min-h-[calc(100vh-4rem)]">
      <div class="pointer-events-none absolute inset-0 opacity-60">
        <div class="absolute -left-24 top-20 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div class="absolute right-0 top-64 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <div class="relative">
        <slot />
      </div>
    </UMain>
  </div>
</template>
