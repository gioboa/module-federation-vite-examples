import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./Widget": "./src/components/Widget",
        "./Counter": "./src/components/Counter",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "tanstack-ssr-shared": { singleton: true, requiredVersion: "0.0.0" },
      },
    }),
    react(),
  ],
  build: {
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
