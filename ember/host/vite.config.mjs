import { federation } from "@module-federation/vite";
import { ember } from "@nullvoxpopuli/ember-vite";
import { defineConfig } from "vite";
import { dependencies } from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
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
      shared: {
        "@glimmer/component": {
          requiredVersion: dependencies["@glimmer/component"],
          singleton: true,
        },
      },
    }),
    ember(),
  ],
  server: { port: 3000 },
  build: { target: "chrome89" },
});
