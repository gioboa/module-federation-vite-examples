import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  nitro: {
    // Keep react/react-dom as Node externals in the Nitro SSR bundle so all
    // server-side code shares the same require() module instance via Node's
    // CJS module cache. Without this, Nitro bundles React inline and the
    // remote's react instance diverges, breaking hooks and context.
    traceDeps: [
      "react",
      "react-dom",
      "@module-federation/runtime",
      "@module-federation/runtime-core",
      "@module-federation/sdk",
    ],
  },
  plugins: [
    federation({
      name: "host",
      hostInitInjectLocation: "entry",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/remoteEntry.js",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "tanstack-ssr-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    tanstackStart(),
    react(),
    nitro(),
  ],
  ssr: {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
  build: {
    target: "chrome89",
  },
  server: {
    port: 4173,
  },
});
