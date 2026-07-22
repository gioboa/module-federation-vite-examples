import { federation } from "@module-federation/vite";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    federation({
      dts: true,
      dev: { disableDynamicRemoteTypeHints: true, remoteHmr: true },
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./remote-app": "./app/page.tsx",
        "./Widget": "./app/widget.tsx",
        "./Counter": "./app/counter-ssr.tsx",
      },
      remotes: {},
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
