import { registerTranslations, translationsBackend } from "@mf-vite-example/shared-ui";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// The host owns the single i18next instance (shared as a singleton with the
// remotes). It only registers its own namespace; remotes and the design
// system register theirs, and the backend loads each one on first use.
registerTranslations("host", (lng) => import(`./locales/${lng}.json`));

i18n
  .use(translationsBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    ns: ["host"],
    defaultNS: "host",
    interpolation: { escapeValue: false },
  });

export default i18n;

// Debug hook: the e2e test checks host and remote hold the same instance.
(window as any).__hostI18n = i18n;
