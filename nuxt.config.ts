// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxthub/core",
    "workflow/nuxt",
    "@nuxt/hints",
    "@nuxt/a11y",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/scripts",
  ],
  hints: {
    features: {
      lazyLoad: false,
    },
  },
  hub: {
    db: {
      dialect: "postgresql",
      driver: "neon-http",
      applyMigrationsDuringBuild: process.env.NODE_ENV === "production",
    },
    cache: true,
    kv: true,
    blob: true,
  },
  ui: {
    experimental: {
      componentDetection: true,
    },
  },
});
