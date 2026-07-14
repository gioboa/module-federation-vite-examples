import { federation } from "@module-federation/vite";
import { ember } from "@nullvoxpopuli/ember-vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    ember(),
    federation({
      dts: false,
      dev: { disableDynamicRemoteTypeHints: true },
      filename: "remoteEntry.js",
      name: "remote",
      exposes: {
        "./remote-app": "./app/federated-app.ts",
      },
      remotes: {},
      shared: {},
    }),
  ],
  server: { port: 3000 },
  build: { target: "chrome89" },
});
