import { defineConfig } from "astro/config";
import { moduleFederation } from "@module-federation/astro";

const federation = moduleFederation({
  name: "astro_host",
  remotes: {
    astro_remote: "astro_remote@http://localhost:4174/mf-manifest.json",
  },
  ssr: { localRemotes: { astro_remote: "../remote" } },
});

// Astro's page bootstrap is already server-rendered for this static demo.
// Skipping the package's automatic page injection avoids its unresolved
// `astro:scripts/page.js?mf-entry-bootstrap` production-build path.
const federationWithoutPageBootstrap = {
  ...federation,
  hooks: {
    ...federation.hooks,
    "astro:config:setup": (context) =>
      federation.hooks["astro:config:setup"]({
        ...context,
        injectScript: () => {},
      }),
  },
};

export default defineConfig({
  devToolbar: { enabled: false },
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  integrations: [federationWithoutPageBootstrap],
});
