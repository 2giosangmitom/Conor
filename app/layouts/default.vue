<template>
  <UContainer>
    <header class="px-4 py-3">
      <div class="text-sm font-medium">Đầu trang</div>
    </header>
    <main class="flex-1 px-4 py-6">
      <slot />
    </main>
    <footer class="px-4 py-3">
      <div class="text-sm">Chân trang</div>
    </footer>
  </UContainer>
</template>
