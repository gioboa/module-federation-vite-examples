import { federation } from "@module-federation/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

let buildExitTimer: ReturnType<typeof setTimeout> | undefined;
let buildStartedAt: number | undefined;

export default defineConfig({
  nitro: {
    // Keep these as Node externals in the Nitro SSR bundle so the server-side
    // Module Federation instance, the remote SSR entry and the host all share
    // one copy of React and of the MF runtime. `@module-federation/vite` stays
    // external so `ssrEntryLoader` resolves shared packages from this output.
    traceDeps: [
      "react",
      "react-dom",
      "tanstack-shared",
      "@module-federation/runtime",
      "@module-federation/runtime-core",
      "@module-federation/sdk",
      "@module-federation/vite",
    ],
  },
  plugins: [
    federation({
      dts: false,
      name: "dynamic-host",
      hostInitInjectLocation: "entry",
      // No `remotes` here: they are registered at runtime, see src/mf/remotes.ts.
      // The plugin still provides the shared scope and initialises the browser
      // runtime, so the global `registerRemotes` / `loadRemote` work on the client.
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
      // Start writes client, SSR, and Nitro outputs; Nitro writes
      // .output/nitro.json last, so exit once this build has produced it.
      buildStart() {
        buildStartedAt ??= Date.now();
      },
      writeBundle() {
        if (buildExitTimer) clearTimeout(buildExitTimer);
        const waitForNitro = () => {
          buildExitTimer = setTimeout(() => {
            const nitroJson = resolve(".output/nitro.json");
            if (existsSync(nitroJson) && statSync(nitroJson).mtimeMs >= (buildStartedAt ?? 0)) {
              process.exit(0);
            }
            waitForNitro();
          }, 1000);
        };
        waitForNitro();
      },
    },
  ],
  optimizeDeps: {
    // Pre-bundle everything the plugin's host init pulls in, and do not discover
    // more at request time: a mid-session re-optimization changes the dep hash
    // that the cached host init module still references, so the browser gets
    // "504 Outdated Optimize Dep" and the page never hydrates.
    noDiscovery: true,
    include: [
      "@module-federation/runtime",
      "@module-federation/runtime/helpers",
      "@tanstack/react-router > @tanstack/react-store",
      "react",
      "react-dom",
      "react-dom/client",
      "react-dom/profiling",
      "react/compiler-runtime",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "tanstack-shared",
    ],
  },
  ssr: {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
  build: {
    target: "chrome89",
  },
  server: {
    port: 4175,
  },
});
