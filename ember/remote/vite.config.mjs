import { federation } from "@module-federation/vite";
import { ember } from "@nullvoxpopuli/ember-vite";
import { defineConfig } from "vite";
import { dependencies } from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    federation({
      dts: false,
      dev: { disableDynamicRemoteTypeHints: true },
      filename: "remoteEntry.js",
      name: "remote",
      exposes: {
        "./remote-app": "./app/federated-app.ts",
      },
      remotes: {},
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
