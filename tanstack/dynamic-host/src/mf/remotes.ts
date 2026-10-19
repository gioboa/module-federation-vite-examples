// Remotes are not known to the Vite plugin: this list is registered at runtime
// on both the server (own instance + ssrEntryLoader) and the client (global API).
export const remotes = [
  {
    name: "remote",
    entry: "http://localhost:4174/remoteEntry.js",
    type: "module" as const,
  },
];
