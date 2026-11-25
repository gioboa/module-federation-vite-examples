import { createInstance, type ModuleFederation } from "@module-federation/runtime";
import type { ComponentType } from "react";
import { remotes } from "./remotes";
import { shared } from "./shared";

export type RemoteComponentModule = { default: ComponentType };

let instance: Promise<ModuleFederation> | undefined;

function getInstance(): Promise<ModuleFederation> {
  instance ??= import.meta.env.SSR
    ? import("./server-instance").then((m) => m.createServerInstance())
    : Promise.resolve(createInstance({ name: "host", remotes, shared }));
  return instance;
}

// One promise per module id, so the server render and the hydrating client
// resolve the same module.
const cache = new Map<string, Promise<RemoteComponentModule>>();

export function loadRemoteModule(id: string): Promise<RemoteComponentModule> {
  let promise = cache.get(id);
  if (!promise) {
    promise = getInstance()
      .then((mf) => mf.loadRemote<RemoteComponentModule>(id))
      .then((module) => {
        if (!module) throw new Error(`Remote module "${id}" could not be loaded`);
        return module;
      });
    promise.catch(() => cache.delete(id));
    cache.set(id, promise);
  }
  return promise;
}
