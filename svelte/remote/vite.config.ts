import { federation } from "@module-federation/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    federation({
      dts: false,
      dev: { disableDynamicRemoteTypeHints: true, remoteHmr: true },
      filename: "remoteEntry.js",
      manifest: true,
      name: "remote",
      exposes: {
        "./Widget": "./src/lib/mountWidget.ts",
        "./Counter": "./src/lib/mountCounter.ts",
      },
      remotes: {},
    }),
    sveltekit(),
  ],
  server: {
    port: 4174,
    cors: true,
    origin: "http://localhost:4174",
  },
  preview: {
    port: 4174,
    cors: true,
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
});
