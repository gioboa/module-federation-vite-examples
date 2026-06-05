import { federation, type ModuleFederationOptions } from "@module-federation/vite";
import {
  addTemplate,
  addVitePlugin,
  addComponent,
  defineNuxtModule,
  resolveAlias,
  useNuxt,
} from "@nuxt/kit";
import { cpSync, existsSync } from "node:fs";
import { relative, resolve } from "node:path";

interface ModuleOptions {
  base?: string;
  exposedDir?: string;
  config?: Partial<ModuleFederationOptions>;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@module-federation/nuxt",
    configKey: "moduleFederation",
  },
  defaults: {
    base: "/_mf",
    exposedDir: "~/components/exposed",
    config: {
      remotes: {},
      shared: {
        // TODO: confirm heuristic for versions - based on package.json
        vue: { singleton: true, requiredVersion: "3.5.29" },
        "vue-router": { singleton: true, requiredVersion: "4.6.4" },
      },
      exposes: {},
    },
  },
  setup(options) {
    const nuxt = useNuxt();

    const prefix = (options.base || "/_mf").replace(/^\/?/, "/");

    nuxt.options.routeRules ||= {};
    nuxt.options.routeRules[`${prefix}/**`] = {
      // CORS headers so the host app can fetch remoteEntry.js cross-origin
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    nuxt.options.nitro.devProxy ||= {};
    // TODO: fix target
    nuxt.options.nitro.devProxy[prefix!] = {
      target: "http://localhost:4174" + "/_nuxt",
    };

    const exposedDir = resolveAlias(
      options.exposedDir || "~/components/exposed",
      nuxt.options.alias
    ).replace(/\/?$/, "/");

    nuxt.hook("components:dirs", (dirs) => {
      dirs.unshift({
        path: exposedDir,
      });
    });

    // key: import
    const manifest: Record<string, string> = {};
    if (options.config?.remotes) {
      // TODO: iterate over manifest to find the components
      const components = ["Counter", "Widget"];
      addTemplate({
        filename: "remote-components.mjs",
        async getContents() {
          const exports = new Set<string>();
          for (const component of components) {
            exports.add(
              `
                export const ${component} = defineAsyncComponent({
                  loader: () => import("remote/${component}").then((m) => m.default || m),
                  suspensible: true,
                });
              `
            );
          }
          return `
            import { defineAsyncComponent } from "vue";
            ${Array.from(exports).join("\n")}
          `;
        },
      });
      for (const component of components) {
        addComponent({
          filePath: `#build/remote-components.mjs`,
          name: "Remote" + component,
          export: component,
        });
      }
      // TODO: generate types
    }

    const exposed: Record<string, string> = {};

    nuxt.hook("components:extend", (components) => {
      for (const c of components) {
        if (!c.filePath.startsWith(exposedDir)) continue;
        const name = `./${c.pascalName}`;
        exposed[name] = `./${relative(nuxt.options.rootDir, c.filePath)}`;
      }
    });

    // Nuxt only copies the _nuxt/ subfolder from dist/client/ to .output/public/.
    // The federation plugin emits remoteEntry.js at the output root (so its
    // relative imports like "./_nuxt/chunk.js" resolve correctly).
    // Copy it manually so it's served in production/preview.
    nuxt.hook("nitro:build:public-assets", (nitro) => {
      for (const file of ["remoteEntry.js", "remoteEntry.ssr.js", "mf-manifest.json"]) {
        const src = resolve(nitro.options.buildDir, `dist/client/${file}`);
        const dest = resolve(nitro.options.output.publicDir, prefix.replace(/^\//, ""), file);
        if (existsSync(src)) {
          cpSync(src, dest);
        }
      }
    });

    addVitePlugin(() =>
      federation({
        dts: false,
        name: "remote",
        filename: "remoteEntry.js",
        manifest: {
          fileName: "mf-manifest.json",
          // TODO:
          // additionalData({ stats }) {
          //   stats.metaData.custom = {
          //     owner: 'platform',
          //     commit: process.env.GIT_SHA,
          //     deployEnv: process.env.DEPLOY_ENV,
          //   };

          //   return stats;
          // },
        },
        ...options.config,
        exposes: {
          ...exposed,
          ...options.config?.exposes,
        },
      })
    );

    addVitePlugin({
      name: "module-federation:nuxt:config",
      config() {
        return {
          server: { cors: true },
        };
      },
    });
  },
});
