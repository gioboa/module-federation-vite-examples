# React host and remote

## Getting started

From this directory execute:

- pnpm preview

Open your browser at http://localhost:4173/ to see the amazing result

![screenshot](docs/screenshot.png)

## i18n across host, remote and design system

Host, remote and `shared-ui` (the design system) each own their own translations, under their own i18next namespace (`host`, `remote`, `ds`). They all use one i18next instance:

- `i18next` and `react-i18next` are shared as `singleton` in both federation configs. Without `react-i18next` the remote can't see the host's instance.
- `shared-ui/src/i18n.ts` holds a registry where each owner registers a loader for its namespace (`registerTranslations(ns, lng => import(...))`), plus `translationsBackend`, which reads from that registry.
- Only the host calls `i18n.init()` (`host/src/i18n.ts`). The remote only registers its namespace (`remote/src/i18n.ts`); its standalone `init` lives in `remote/src/main.tsx`, which never runs inside the host.
- Namespaces load lazily on first `useTranslation(ns)`, which suspends. `changeLanguage` in the host reloads every namespace in use and re-renders host, remote and design system.
