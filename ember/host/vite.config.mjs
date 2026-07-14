import { federation } from "@module-federation/vite";
import { ember } from "@nullvoxpopuli/ember-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    ember(),
    federation({
      dts: false,
      dev: { disableDynamicRemoteTypeHints: true },
      name: "host",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: "http://localhost:4174/remoteEntry.js",
          entryGlobalName: "remote",
          shareScope: "default",
        },
      },
      exposes: {},
      filename: "remoteEntry.js",
      shared: {},
    }),
  ],
  server: { port: 3000 },
  build: { target: "chrome89" },
});
