import RemoteIslandClient from "./remote-island-client";

type IslandShell = {
  version: 1;
  renderToHtml: (props?: Record<string, unknown>) => Promise<string>;
};

type IslandModule = {
  __mf_island?: IslandShell;
};

export async function RemoteIsland() {
  // @ts-expect-error Module Federation provides this virtual module.
  const module = (await import("island/Counter")) as IslandModule;
  const shell = module.__mf_island;
  if (!shell) throw new Error("island/Counter did not expose an SSR island capability");

  return <RemoteIslandClient html={await shell.renderToHtml()} />;
}
