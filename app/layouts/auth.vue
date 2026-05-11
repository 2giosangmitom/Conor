<template>
  <UContainer>
    <header class="flex items-center justify-between mt-4">
      <NuxtImg src="/images/logo-with-text.png" width="150" height="50" alt="Logo with text" />
      <UColorModeSelect />
    </header>
    <main class="flex justify-center mt-20">
      <slot />
    </main>
  </UContainer>
</template>
