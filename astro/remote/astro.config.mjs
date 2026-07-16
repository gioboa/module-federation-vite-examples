import { defineConfig } from "astro/config";
import { moduleFederation } from "@module-federation/astro";

export default defineConfig({
  devToolbar: { enabled: false },
  server: { port: 4174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  vite: { server: { origin: "http://localhost:4174" } },
  integrations: [
    moduleFederation({
      name: "astro_remote",
      manifest: true,
      exposes: { "./components/RemoteCard": "./src/components/RemoteCard.astro" },
    }),
  ],
});
