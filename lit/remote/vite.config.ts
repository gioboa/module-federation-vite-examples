import { federation } from "@module-federation/vite";
import { defineConfig } from "vite";

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
          lit: { singleton: true },
          "lit-html": { singleton: true },
        },
      }),
    ],
  };
});
