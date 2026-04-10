import { federation } from "@module-federation/vite";
import { defineConfig, type PluginOption } from "vite";
import { dependencies } from "./package.json";

export default defineConfig(() => {
  return {
    plugins: [
      federation({
        dts: false,
        dev: {
          remoteHmr: true,
        },
        filename: "remoteEntry.js",
        name: "remote",
        exposes: {
          "./remote-app": "./src/remote-app.ts",
        },
        remotes: {},
        shared: {
          lit: { requiredVersion: dependencies.lit, singleton: true },
          "lit-html": { singleton: true },
        },
      }) as unknown as PluginOption,
    ],
  };
});
