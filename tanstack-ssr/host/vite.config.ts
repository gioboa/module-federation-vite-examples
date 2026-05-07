import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { nitro } from "nitro/vite";
import type { Plugin } from "vite";

// TanStack Start's bundle scanner assumes exactly one isEntry chunk.
// MF emits additional entry chunks (hostInit, remoteEntry, virtualExposes)
// that are not the real app entry. Mark them as non-entry so the scanner
// skips them. This is built into @module-federation/vite PR #692 and can
// be removed once that fix lands in a published release.
function mfNormalizeEntryChunks(): Plugin {
  return {
    name: "mf:normalize-entry-chunks",
    enforce: "pre",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk" || !chunk.isEntry) continue;
        const facadeId = chunk.facadeModuleId ?? "";
        if (
          facadeId.includes("__mf__virtual") ||
          facadeId.startsWith("virtual:mf-") ||
          facadeId.startsWith("\0virtual:mf-")
        ) {
          (chunk as { isEntry: boolean }).isEntry = false;
        }
      }
    },
  };
}

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
    mfNormalizeEntryChunks(),
    federation({
      name: "host",
      hostInitInjectLocation: "entry",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:5174/remoteEntry.js",
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
    port: 3000,
  },
});
