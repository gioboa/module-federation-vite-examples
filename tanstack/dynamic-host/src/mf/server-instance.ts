// Server only. Imported lazily from load-remote.ts behind `import.meta.env.SSR`.
//
// Nothing creates a Module Federation instance on the server when the host has
// no static `remotes`, so the global `loadRemote` throws RUNTIME-009 there.
// This module creates one with the plugin's public `ssrEntryLoader`, which
// swaps the browser remote entry for the remote's SSR entry (`remoteEntry.ssr.js`)
// and rewrites its shared imports to the host's own copies of React.
import { createRequire } from "node:module";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as tanstackShared from "tanstack-shared";
import {
  createInstance,
  type ModuleFederation,
  type ModuleFederationRuntimePlugin,
} from "@module-federation/runtime";
import ssrEntryLoader from "@module-federation/vite/ssrEntryLoader";
import { remotes } from "./remotes";

const require = createRequire(import.meta.url);

// Absolute paths of the packages the remote SSR entry imports as bare
// specifiers. The loader rewrites them to these files so the remote renders
// with the same React instance as the host (hooks and context keep working).
function resolveShared(specifiers: string[]): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const specifier of specifiers) {
    try {
      resolved[specifier] = require.resolve(specifier);
    } catch {
      // Not installed on the server: the loader leaves the specifier untouched.
    }
  }
  return resolved;
}

let instance: ModuleFederation | undefined;

export function getServerInstance(): ModuleFederation {
  instance ??= createInstance({
    name: "dynamic-host",
    remotes,
    shared: {
      react: {
        version: React.version,
        lib: () => React,
        shareConfig: { singleton: true, requiredVersion: "^19.0.0" },
      },
      "react-dom": {
        version: ReactDOM.version,
        lib: () => ReactDOM,
        shareConfig: { singleton: true, requiredVersion: "^19.0.0" },
      },
      "tanstack-shared": {
        version: "0.0.0",
        lib: () => tanstackShared,
        shareConfig: { singleton: true, requiredVersion: "0.0.0" },
      },
    },
    plugins: [
      // The loader's loadEntry hook is typed loosely in @module-federation/vite,
      // so widen it to the runtime plugin type the instance expects.
      ssrEntryLoader({
        resolvedShared: resolveShared([
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "tanstack-shared",
          "@module-federation/runtime",
          "@module-federation/runtime-core",
          "@module-federation/sdk",
        ]),
      }) as ModuleFederationRuntimePlugin,
    ],
  });
  return instance;
}
