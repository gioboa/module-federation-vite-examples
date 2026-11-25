import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  builder: {},
  // The ssr environment makes the plugin emit remoteEntry.ssr.js next to the
  // browser remoteEntry.js, which SSR hosts load through ssrEntryLoader.
  environments: {
    client: {
      build: { outDir: "dist" },
    },
    ssr: {
      build: {
        outDir: "dist",
        emptyOutDir: false,
        ssr: "./src/Note.tsx",
      },
    },
  },
  plugins: [
    federation({
      dts: false,
      name: "remote",
      filename: "remoteEntry.js",
      // mf-manifest.json lists the CSS files of every expose. The host reads it
      // during SSR to render the <link> tags, see host/app/mf/remote-styles.server.ts.
      manifest: true,
      exposes: {
        "./Note": "./src/Note",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
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
