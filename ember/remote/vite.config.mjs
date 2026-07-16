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
      filename: "remoteEntry.js",
      name: "remote",
      exposes: {
        "./mount": "./app/mount.ts",
      },
      remotes: {},
      shared: {},
    }),
  ],
  server: { port: 3000 },
  build: { target: "chrome89" },
});
