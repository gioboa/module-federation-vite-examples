// Remotes are registered at runtime on both the server and the client.
// In a real app this list comes from configuration (e.g. a loader).
export type Remote = { name: string; entry: string; type: "module" };

export const remotes: Remote[] = [
  {
    name: "remote",
    entry: "http://localhost:4174/remoteEntry.js",
    type: "module",
  },
];
