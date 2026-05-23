<template>
  <div>
    <AppHeader />
    <main id="main-content" tabindex="-1" class="min-h-[calc(100vh-var(--ui-header-height))]">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
