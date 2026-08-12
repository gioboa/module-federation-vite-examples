import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mf = {
  name: "remote",
  filename: "remoteEntry.js",
  exposes: {
    "./Widget": "./src/widget.tsx",
    "./Counter": "./src/counter.tsx",
  },
  remotes: {},
  shared: {
    react: { singleton: true },
    "react/": { singleton: true },
    "react-dom": { singleton: true },
    "react-dom/": { singleton: true },
  },
  dts: false,
};

export default defineConfig({
  builder: {},
  plugins: [federation(mf), react()],
  environments: {
    client: {
      build: { outDir: "dist/client" },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        ssr: "./src/widget.tsx",
      },
    },
  },
  build: {
    outDir: "dist/client",
    target: "chrome89",
    modulePreload: false,
    minify: false,
  },
  server: {
    cors: true,
    origin: "http://localhost:4174",
  },
  preview: {
    cors: true,
    host: "127.0.0.1",
    port: 4174,
    strictPort: true,
  },
});
