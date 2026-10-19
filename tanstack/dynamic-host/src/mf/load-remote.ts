import { loadRemote, registerRemotes } from "@module-federation/runtime";
import type { ComponentType } from "react";
import { remotes } from "./remotes";

export type RemoteComponentModule = { default: ComponentType };

// One promise per module id, shared by the route loader, React.lazy and the
// client entry, so the server and the hydrating client resolve the same module.
const cache = new Map<string, Promise<RemoteComponentModule>>();
let clientRemotesRegistered = false;

async function load(id: string): Promise<RemoteComponentModule> {
  let module: RemoteComponentModule | null;
  if (import.meta.env.SSR) {
    // Server: no plugin-created instance exists, use our own.
    const { getServerInstance } = await import("./server-instance");
    module = await getServerInstance().loadRemote<RemoteComponentModule>(id);
  } else {
    // Client: the Vite plugin initialised the global instance before this entry
    // ran (hostInitInjectLocation: "entry"), so the global API is usable here.
    // Registering at module top level would run before that initialisation.
    if (!clientRemotesRegistered) {
      registerRemotes(remotes);
      clientRemotesRegistered = true;
    }
    module = await loadRemote<RemoteComponentModule>(id);
  }
  if (!module) throw new Error(`Remote module "${id}" could not be loaded`);
  return module;
}

export function loadRemoteModule(id: string): Promise<RemoteComponentModule> {
  let promise = cache.get(id);
  if (!promise) {
    promise = load(id);
    promise.catch(() => cache.delete(id));
    cache.set(id, promise);
  }
  return promise;
}
