import { federation } from "@module-federation/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    federation({
      dts: false,
      dev: { remoteHmr: true },
      name: "host",
      hostInitInjectLocation: "html",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/mf-manifest.json",
          entryGlobalName: "remote",
          shareScope: "default",
        },
      },
      exposes: {},
      filename: "remoteEntry.js",
    }),
    sveltekit(),
  ],
  optimizeDeps: {
    exclude: ["fsevents"],
  },
});
