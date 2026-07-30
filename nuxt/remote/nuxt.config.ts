// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // Only the host needs a DevTools bridge while both apps run together.
  // Enabling it in both apps makes them compete for port 24678.
  devtools: { enabled: false },
  modules: ["@module-federation/nuxt"],

  experimental: {
    buildCache: false,
  },

  routeRules: {
    "/remoteEntry.js": { headers: { "Access-Control-Allow-Origin": "*" } },
  },

  moduleFederation: {
    config: {
      name: "remote",
      filename: "remoteEntry.js",
      remotes: {},
      manifest: true,
      shared: {
        vue: { singleton: true, requiredVersion: "3.5.29" },
        "vue-router": { singleton: true, requiredVersion: "4.6.4" },
      },
    },
  },

  vite: {
    server: {
      // The host runs alongside this app during development. Give the
      // remote its own HMR socket instead of competing for Vite's default.
      hmr: { port: 24679 },
    },
  },
});
