# React Router host and remote

React Router framework mode (SSR) host that loads a remote at runtime. No federation plugin on
the host: it creates its own Module Federation instances, one per side.

## Getting started

From this directory:

```bash
pnpm build
pnpm preview
```

Open http://localhost:4173/

## Remote CSS during SSR, owned by the host

The remote imports its CSS the usual way and knows nothing about where it is deployed:

```tsx
// remote/src/Note.tsx
import "./styles.css";
```

The SSR remote entry carries no CSS, and in the browser the remote entry only injects its
stylesheets once its JS has loaded, so without help the server HTML is unstyled until hydration.
The host closes that gap with information the remote already publishes:

- `remote/vite.config.ts` sets `manifest: true`, so `mf-manifest.json` is written next to
  `remoteEntry.js`. Its `exposes[].assets.css` lists the content-hashed CSS files of every
  expose, relative to the remote entry.
- `host/app/mf/remote-styles.server.ts` fetches that manifest and resolves each CSS file against
  the remote entry URL, the one URL the host has to know anyway.
- `host/app/root.tsx` returns the hrefs from its loader and renders them as
  `<link rel="stylesheet">` in `<head>`.

All URL logic (base URL, CDN, where the remote is mounted) lives in the host, in one function.
The remote needs no `?url` import, no `<link>` in its components and no
`experimental.renderBuiltUrl`.

In the browser the remote entry resolves the same files with
`new URL(file, import.meta.url)` and skips any stylesheet whose `<link>` already exists, so the
host's link is reused and nothing is loaded twice. The hrefs must be absolute for that match; a
relative one still works but adds a second `<link>` for the same URL.

If the manifest cannot be fetched the page still renders, and the CSS arrives when the remote's
JS loads.

In dev (`pnpm dev`) Vite injects CSS from JS and the dev manifest lists none, so the `<link>` is
only rendered for built remotes.

## Runtime remotes with SSR

- `host/app/mf/remotes.ts` holds the remote list used on both sides.
- `host/app/mf/server-instance.ts` (server only) calls `createInstance` with the plugin's public
  `@module-federation/vite/ssrEntryLoader`, which swaps `remoteEntry.js` for the remote's
  `remoteEntry.ssr.js` and rewrites its shared imports to the host's own React.
- `host/app/mf/load-remote.ts` is isomorphic and caches one promise per module id, so the server
  render and the hydrating client resolve the same module.

The remote emits its SSR entry through the `ssr` environment in `remote/vite.config.ts`.
