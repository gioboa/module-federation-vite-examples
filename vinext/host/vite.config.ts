import { federation } from "@module-federation/vite";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    federation({
      dts: true,
      dev: { disableDynamicRemoteTypeHints: true, remoteHmr: true },
      name: "host",
      hostInitInjectLocation: "entry",
      remotes: {
        remote: {
          type: "module",
          name: "remote",
          entry: `http://localhost:4174/remoteEntry.js`,
          entryGlobalName: "remote",
          shareScope: "default",
        },
        island: {
          type: "module",
          name: "island",
          entry: `http://localhost:4175/remoteEntry.js`,
          entryGlobalName: "island",
          shareScope: "default",
        },
      },
      exposes: {},
      filename: "remoteEntry.js",
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
      },
    }),
    vinext(),
  ],
});
