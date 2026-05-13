// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap",
        },
      ],
    },
  },
  modules: [
    "@nuxthub/core",
    "@nuxt/hints",
    "@nuxt/a11y",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
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
