import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  builder: {},
  // The ssr environment makes the plugin emit remoteEntry.ssr.js next to the
  // browser remoteEntry.js, which SSR hosts load through ssrEntryLoader.
  environments: {
    client: {
      build: { outDir: "dist/client" },
    },
    ssr: {
      build: {
        outDir: "dist/server",
        ssr: "./src/components/Widget.tsx",
      },
    },
  },
  plugins: [
    federation({
      dts: false,
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./Widget": "./src/components/Widget",
        "./Counter": "./src/components/Counter",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "tanstack-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    react(),
  ],
  build: {
    outDir: "dist/client",
    target: "chrome89",
  },
  server: {
    port: 4174,
    cors: true,
    origin: "http://localhost:4174",
  },
  preview: {
    port: 4174,
    cors: true,
  },
});
