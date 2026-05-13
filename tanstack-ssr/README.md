# TanStack Start + Module Federation SSR

Full server-side rendering with `@module-federation/vite` and TanStack Start (Nitro). Remote components are rendered on the server — no `ClientOnly` wrapper needed.

## Getting started

From this directory:

```bash
pnpm build
pnpm preview
```

Open your browser at http://localhost:4173/

## What this demonstrates

- **Remote SSR** — both `Widget` and `Counter` components are server-rendered. Disable JavaScript and reload: the components appear immediately with no loading state.
- **Shared context singleton** — `ThemeContext` is provided by the host and consumed by both remote components. Both render with the host's theme colour during SSR and after hydration.
- **Hydration badge** — each component shows `ssr` in the initial HTML, then flips to `hydrated` once client-side JavaScript takes over.
- **Multiple exposes** — the remote exposes two components (`./Widget`, `./Counter`), both server-rendered.

## How it works

`@module-federation/vite` emits a `remoteEntry.server.js` alongside the browser entry during the remote's build. On the host, `ssrEntryLoader` (a MF runtime plugin auto-injected by `@module-federation/vite`) intercepts the `loadEntry` lifecycle hook on the server. It fetches the remote's SSR entry over HTTP, rewrites bare specifier imports to `file://` paths, writes temp `.mjs` files to disk, and loads them via Node's native ESM `import()`. This avoids any `--experimental-network-imports` flag.

For Nitro-based hosts, `nitro: { traceDeps: ['react', 'react-dom'] }` in `vite.config.ts` externalises React from Nitro's SSR bundle so all server-side code shares the same CJS React instance via Node's module cache.

## Shared context across the MF boundary

The `shared/` package exports `ThemeContext` — a React context that both host and remote consume. To make context work correctly during SSR, two things are required:

### 1. Compiled JS entry

The shared package's `main` must point to a compiled `.js` file, not TypeScript source. `ssrEntryLoader` loads the remote's SSR entry by writing temp `.mjs` files and importing them natively via Node's ESM loader. For context to be the same object on both sides, both must import from the same physical `.js` file — Node's module cache guarantees identity by file path. If `main` points to `.ts`, Node can't execute it and `ssrEntryLoader` falls back to the default context value.

```json
// shared/package.json
{
  "main": "./dist/shared.js", // ✓ compiled JS — Node can execute this
  "types": "./shared.ts" // TypeScript types still served from source
}
```

The `build.mjs` script compiles `shared.ts` to `dist/shared.js` using esbuild. The `tanstack-ssr:build` script runs this before building host and remote.

### 2. Declared as MF singleton

Both host and remote must declare the shared package as a singleton in their MF `shared` config:

```ts
federation({
  shared: {
    "tanstack-ssr-shared": { singleton: true, requiredVersion: "0.0.0" },
  },
});
```

`ssrEntryLoader` receives the list of shared package names from the Vite plugin at build time and resolves their absolute paths from the MF plugin's own installed location — making this package-manager-agnostic (npm, pnpm, Yarn v4). Both the host's Nitro bundle and the remote's SSR temp files then import from the same physical path, giving them the same `ThemeContext` object reference.

### SSR vs client behaviour

During SSR the host renders with `<ThemeContext.Provider value={hostTheme}>`. The remote components use `useContext(ThemeContext)` and receive the host's theme because both sides share the same module instance. After hydration the browser's MF share scope takes over — the singleton guarantee ensures context updates propagate normally on the client too.
