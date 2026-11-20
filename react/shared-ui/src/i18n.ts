// Translation registry shared by host, remotes and the design system.
// This package is a federated singleton, so every app sees the same Map.
// Each owner registers a loader for its own namespace; the host plugs
// `translationsBackend` into the single i18next instance, which then loads
// a namespace (for the current language) the first time it is used and
// reloads all used namespaces on changeLanguage.
type Resources = Record<string, string>;
type Loader = (lng: string) => Promise<Resources | { default: Resources }>;

const loaders = new Map<string, Loader>();

export function registerTranslations(ns: string, loader: Loader) {
  loaders.set(ns, loader);
}

export const translationsBackend = {
  type: "backend" as const,
  init() {},
  read(lng: string, ns: string, callback: (err: unknown, data?: Resources | false) => void) {
    const loader = loaders.get(ns);
    if (!loader) return callback(new Error(`no translations registered for "${ns}"`), false);
    loader(lng).then(
      (mod) => callback(null, "default" in mod ? (mod.default as Resources) : mod),
      (err) => callback(err, false)
    );
  },
};

const dsLocales: Record<string, () => Promise<{ default: Resources }>> = {
  en: () => import("./locales/en.js"),
  it: () => import("./locales/it.js"),
};

registerTranslations("ds", (lng) => (dsLocales[lng] ?? dsLocales.en)());
