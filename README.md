# Module Federation Vite Examples

[![E2E Tests](https://github.com/gioboa/module-federation-vite-examples/actions/workflows/e2e.yml/badge.svg?branch=main)](https://github.com/gioboa/module-federation-vite-examples/actions/workflows/e2e.yml)

A collection of Module Federation examples built with Vite, used to test new [@module-federation/vite](https://github.com/module-federation/vite) PRs and releases.

## Examples

| Example                | Host            | Remote            | Framework                   |
| ---------------------- | --------------- | ----------------- | --------------------------- |
| [Alpine](./alpine)     | `alpine-host`   | `alpine-remote`   | Alpine.js                   |
| [Angular](./angular)   | `angular-host`  | `angular-remote`  | Angular                     |
| [Astro](./astro)       | `astro-host`    | `astro-remote`    | Astro 7                     |
| [Ember](./ember)       | `ember-host`    | `ember-remote`    | Ember 7                     |
| [Lit](./lit)           | `lit-host`      | `lit-remote`      | Lit                         |
| [Nuxt](./nuxt)         | `nuxt-host`     | `nuxt-remote`     | Nuxt 4                      |
| [Preact](./preact)     | `preact-host`   | `preact-remote`   | Preact 10                   |
| [React](./react)       | `react-host`    | `react-remote`    | React 19                    |
| [Solid](./solid)       | `solid-host`    | `solid-remote`    | Solid                       |
| [Svelte](./svelte)     | `svelte-host`   | `svelte-remote`   | Svelte 5                    |
| [TanStack](./tanstack) | `tanstack-host` | `tanstack-remote` | TanStack Router + React 19  |
| [Vinext](./vinext)     | `vinext-host`   | `vinext-remote`   | Vinext + Next 16 + React 19 |
| [Vue](./vue)           | `vue-host`      | `vue-remote`      | Vue 3                       |

Each example follows a **host/remote** architecture with shared dependencies.

## E2E tests run against

- Vite 7
- Vite 8

## Getting Started

```bash
# Install dependencies
pnpm install

# Run examples
pnpm alpine:dev
pnpm angular:dev
pnpm astro:dev
pnpm ember:dev
pnpm lit:dev
pnpm react:dev
pnpm preact:dev
pnpm solid:dev
pnpm vue:dev
pnpm svelte:dev
pnpm tanstack:dev
pnpm nuxt:dev
pnpm vinext:dev
```

## E2E Tests

Tests are powered by [Playwright](https://playwright.dev/).

```bash
# Run tests (defaults to React example)
pnpm exec playwright test

# Run tests for Vue example
PLAYWRIGHT_TEST_COMMAND="pnpm vue:preview" pnpm exec playwright test
```

## Testing a PR

Update the `@module-federation/vite` version in `pnpm-workspace.yaml` catalog:

```yaml
catalog:
  "@module-federation/vite": "https://pkg.pr.new/@module-federation/vite@<PR_NUMBER>"
```

Then reinstall and run the examples.
