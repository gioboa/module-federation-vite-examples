# SvelteKit + Module Federation

Host and remote SvelteKit apps using `@module-federation/vite`, with the same card layout as the `nuxt/` and `tanstack/` examples.

```bash
pnpm svelte:dev      # from repo root
pnpm svelte:build
pnpm svelte:preview
```

Open http://localhost:4173

## Layout

- **Host card** + **Host SSR component** (server-rendered)
- Federated **Widget** and **Counter** remotes (client-mounted after hydration)

## SSR note

The host shell is server-rendered (`prerender` only — no `ssr: false`). Remotes load via `remoteEntry.js` in `onMount` because virtual `remote/*` imports are stubbed under SvelteKit SSR.
