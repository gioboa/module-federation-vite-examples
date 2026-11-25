// Server only. Imported lazily from load-remote.ts behind `import.meta.env.SSR`.
//
// The plugin's public `ssrEntryLoader` swaps the browser remote entry for the
// remote's SSR entry (`remoteEntry.ssr.js`) and rewrites its shared imports to
// the host's own copies of React.
import { createRequire } from "node:module";
import {
  createInstance,
  type ModuleFederation,
  type ModuleFederationRuntimePlugin,
} from "@module-federation/runtime";
import ssrEntryLoader from "@module-federation/vite/ssrEntryLoader";
import { remotes } from "./remotes";
import { shared } from "./shared";

const require = createRequire(import.meta.url);

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

export function createServerInstance(): ModuleFederation {
  return createInstance({
    name: "host",
    remotes,
    shared,
    plugins: [
      ssrEntryLoader({
        resolvedShared: resolveShared([
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react/jsx-dev-runtime",
          "@module-federation/runtime",
          "@module-federation/runtime-core",
          "@module-federation/sdk",
        ]),
      }) as ModuleFederationRuntimePlugin,
    ],
  });
}
