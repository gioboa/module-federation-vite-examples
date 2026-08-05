import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mf = {
  name: "island",
  filename: "remoteEntry.js",
  exposes: {
    "./Counter": "./src/counter.tsx",
  },
  experiments: { ssrMode: "ISLAND" as const },
  // This remote deliberately owns React 18 while the vinext host uses React 19.
  shared: {},
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
        ssr: "./src/counter.tsx",
      },
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist/client",
    target: "chrome89",
    modulePreload: false,
    minify: false,
  },
  server: {
    cors: true,
    origin: "http://localhost:4175",
  },
  preview: {
    cors: true,
    host: "127.0.0.1",
    port: 4175,
    strictPort: true,
  },
});
