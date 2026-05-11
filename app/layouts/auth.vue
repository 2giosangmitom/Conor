<template>
  <UContainer>
    <header class="flex items-center justify-end mt-4">
      <UColorModeSelect />
    </header>
    <main class="flex min-h-screen items-center justify-center px-4 py-12">
      <slot />
    </main>
  </UContainer>
</template>
