"use client";

import { useEffect, useRef } from "react";

type IslandShell = {
  version: 1;
  hydrate: (element: Element, props?: Record<string, unknown>) => Promise<unknown>;
};

type IslandModule = {
  __mf_island?: IslandShell;
};

// @ts-expect-error Module Federation provides this virtual module.
const islandModulePromise = import("island/Counter") as Promise<IslandModule>;

export default function RemoteIslandClient({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    void islandModulePromise.then((module) => {
      const shell = module.__mf_island;
      if (!shell) throw new Error("island/Counter did not expose a client island capability");
      return shell.hydrate(element);
    });
  }, []);

  return <div ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
