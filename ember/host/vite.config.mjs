import { federation } from "@module-federation/vite";
import { ember } from "@embroider/vite";
import babel from "@rollup/plugin-babel";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    babel({ babelHelpers: "runtime", extensions: [".js", ".ts", ".gjs", ".gts"] }),
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
