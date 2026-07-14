import { federation } from "@module-federation/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

let buildExitTimer: ReturnType<typeof setTimeout> | undefined;

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
      dts: false,
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
        "tanstack-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    tanstackStart(),
    react(),
    nitro(),
    {
      name: "tanstack-build-exit",
      apply: "build",
      // Nitro leaves a long-lived handle open during closeBundle. TanStack
      // Start writes client, SSR, and Nitro outputs, so wait until writes have
      // been quiet before exiting.
      writeBundle() {
        if (buildExitTimer) clearTimeout(buildExitTimer);
        buildExitTimer = setTimeout(() => process.exit(0), 1000);
      },
    },
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
