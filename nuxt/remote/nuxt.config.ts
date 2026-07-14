import { federation } from "@module-federation/vite";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // Only the host needs a DevTools bridge while both apps run together.
  // Enabling it in both apps makes them compete for port 24678.
  devtools: { enabled: false },
  modules: ["@pinia/nuxt"],

  experimental: {
    buildCache: false,
  },

  // CORS headers so the host app can fetch remoteEntry.js cross-origin
  routeRules: {
    "/**": { headers: { "Access-Control-Allow-Origin": "*" } },
  },

  hooks: {
    // Nuxt only copies the _nuxt/ subfolder from dist/client/ to .output/public/.
    // The federation plugin emits remoteEntry.js at the output root (so its
    // relative imports like "./_nuxt/chunk.js" resolve correctly).
    // Copy it manually so it's served in production/preview.
    "nitro:build:public-assets"(nitro) {
      for (const file of ["remoteEntry.js", "remoteEntry.ssr.js", "mf-manifest.json"]) {
        const src = resolve(nitro.options.buildDir, `dist/client/${file}`);
        const dest = resolve(nitro.options.output.publicDir, file);
        if (existsSync(src)) cpSync(src, dest);
      }
    },
  },

  vite: {
    server: {
      cors: true,
      // The host runs alongside this app during development. Give the
      // remote its own HMR socket instead of competing for Vite's default.
      hmr: { port: 24679 },
    },
    plugins: [
      federation({
        dts: false,
        name: "remote",
        filename: "remoteEntry.js",
        exposes: {
          "./remote-app": "./app/app.vue",
          "./Widget": "./app/components/Widget.vue",
          "./Counter": "./app/components/CounterSsr.vue",
        },
        remotes: {},
        manifest: true,
        shared: {
          vue: { singleton: true, requiredVersion: "3.5.29" },
          "vue-router": { singleton: true, requiredVersion: "4.6.4" },
        },
      }) as any,
    ],
  },
});
