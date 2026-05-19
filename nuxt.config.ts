// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
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
    "@nuxt/test-utils/module",
    "@nuxt/scripts",
    "motion-v/nuxt",
  ],
  hints: {
    features: {
      htmlValidate: false,
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
  vite: {
    optimizeDeps: {
      include: ["@inspira-ui/plugins", "better-auth/vue", "dexie"],
    },
  },
  typescript: {
    tsConfig: {
      include: ["test/unit/*.ts"],
    },
  },
});
