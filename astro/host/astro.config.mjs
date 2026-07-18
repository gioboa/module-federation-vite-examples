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

const federationIntegration = {
  name: "astro-host-federation",
  hooks: {
    "astro:config:setup": (context) => {
      if (context.command === "dev" || context.command === "build") {
        // The federation Vite plugin is not compatible with Astro 7's dev
        // Environment API or static SSR prerendering yet, so use the local
        // remote source in those modes.
        context.updateConfig({
          vite: {
            resolve: {
              alias: [
                {
                  find: "astro_remote/components/RemoteCard",
                  replacement: new URL("../remote/src/components/RemoteCard.astro", import.meta.url)
                    .pathname,
                },
              ],
            },
          },
        });
        return;
      }

      return federationWithoutPageBootstrap.hooks["astro:config:setup"](context);
    },
  },
};

export default defineConfig({
  devToolbar: { enabled: false },
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  integrations: [federationIntegration],
});
