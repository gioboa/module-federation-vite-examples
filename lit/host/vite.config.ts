import { federation } from "@module-federation/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  plugins: [
    federation({
      dts: false,
      dev: {
        remoteHmr: true,
      },
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
        lit: { singleton: true },
        "lit-html": { singleton: true },
      },
    }),
  ],
}));
