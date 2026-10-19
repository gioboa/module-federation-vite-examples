# TanStack host and remote

Example UI showing a host page with remote widgets rendered into the same view.

Two hosts consume the same remote:

- `host` (port 4173) lists the remote statically in the plugin's `remotes` option.
- `dynamic-host` (port 4175) has no `remotes` in its config. It registers the remote at
  runtime with `registerRemotes` / `loadRemote`, on the server and on the client. See
  [Runtime remotes with SSR](#runtime-remotes-with-ssr).

## Getting started

From this directory:

```bash
pnpm build
pnpm preview
```

Open http://localhost:4173/ (static remotes) or http://localhost:4175/ (runtime remotes).

## UI

- **Host app card** — blue card with a star icon and a host-only counter.
- **Host SSR card** — blue card with copy that appears before hydration, then shows a clickable counter and a status badge.
- **Remote app card** — dark card with a cloud icon, the host theme label/colour, and a remote counter.
- **Remote SSR card** — dark card with pre-hydration copy, the host theme label/colour, a counter after hydration, and a status badge.
- **Status badges** — cards start as `SSR`, then switch to `Hydrated` after the page becomes interactive.
- **Counters** — each counter increments independently.

![screenshot](docs/screenshot.png)

## Runtime remotes with SSR

`dynamic-host` shows how to use `registerRemotes` / `loadRemote` when the remotes are not
known at build time. The Vite plugin only creates a server-side Module Federation instance
for remotes listed in `remotes`, so with none configured the global `loadRemote` throws
`RUNTIME-009` during SSR. The host therefore creates its own instance on the server:

- `src/mf/remotes.ts` holds the remote list used on both sides.
- `src/mf/server-instance.ts` (server only) calls `createInstance` from
  `@module-federation/runtime` with the plugin's public `@module-federation/vite/ssrEntryLoader`
  runtime plugin. The loader swaps the browser `remoteEntry.js` for the remote's
  `remoteEntry.ssr.js` and rewrites its shared imports to the host's own React, so hooks and
  context work across the boundary.
- `src/mf/load-remote.ts` is isomorphic: on the server it loads through that instance, on the
  client it calls the global `registerRemotes` / `loadRemote`, which work because the plugin
  initialised the browser runtime before the client entry ran (`hostInitInjectLocation: "entry"`).
  One cached promise per module id is shared by the route loader, `React.lazy` and the client
  entry, so hydration keeps the server-rendered HTML.

The two sides are deliberately asymmetric: the client keeps the plugin's instance so the remote
negotiates React through the plugin's share scope, while the server needs a hand-made instance
because the plugin only creates one for static `remotes`.

The remote must emit an SSR entry: `remote/vite.config.ts` adds an `ssr` environment so
`vite build` writes `remoteEntry.ssr.js` next to `remoteEntry.js`. Without it the runtime
falls back to fetching the browser entry in Node and the route fails with
`Failed to load Node.js entry for remote`. `manifest: true` is optional; the loader also finds the
entry by the `.ssr.js` convention.

### Dev mode

```bash
pnpm dev
```

Then open http://localhost:4175/ (or http://localhost:4173/ for the static host). In dev the
host's `ssrEntryLoader` evaluates the remote through Vite's `ModuleRunner` against the remote dev
server (Vite 8+). The remote therefore lists `@module-federation/runtime` in its own
`dependencies`: its SSR entry imports the runtime, and the remote dev server must be able to
resolve it. Without it the host logs
`Failed to load Node.js entry for remote ... vm.SourceTextModule is not a constructor`.

Both hosts set `optimizeDeps.noDiscovery: true` with an explicit `include` list. Without it, deps
discovered at request time trigger a re-optimization and the plugin's host init module keeps the
previous dep hash, so the browser gets `504 (Outdated Optimize Dep)` and the page never hydrates.
