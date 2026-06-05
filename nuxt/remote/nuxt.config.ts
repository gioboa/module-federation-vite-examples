// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@module-federation/nuxt"],
  moduleFederation: {
    config: {
      exposes: {
        "./remote-app": "./app/app.vue",
      },
    },
  },
});
