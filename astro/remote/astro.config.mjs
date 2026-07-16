import { defineConfig } from "astro/config";
import { moduleFederation } from "@module-federation/astro";

const federation = moduleFederation({
  name: "astro_remote",
  manifest: true,
  exposes: { "./components/RemoteCard": "./src/components/RemoteCard.astro" },
});

const federationIntegration = {
  name: "astro-remote-federation",
  hooks: {
    "astro:config:setup": (context) => {
      // Keep federation for builds/previews; Astro 7 dev uses Vite's
      // Environment API, which the current federation plugin does not support.
      if (context.command === "dev") return;
      return federation.hooks["astro:config:setup"](context);
    },
  },
};

export default defineConfig({
  devToolbar: { enabled: false },
  server: { port: 4174, strictPort: true },
  preview: { port: 4174, strictPort: true },
  vite: { server: { origin: "http://localhost:4174" } },
  integrations: [federationIntegration],
});
