import { registerTranslations } from "@mf-vite-example/shared-ui";
import i18n from "i18next";

// The remote never owns the i18next instance: it only registers its
// namespace. useTranslation("remote") suspends until it is loaded.
// Standalone init lives in main.tsx, which only runs outside the host.
registerTranslations("remote", (lng) => import(`./locales/${lng}.json`));

// Debug hook: the e2e test checks host and remote hold the same instance.
(window as any).__remoteI18n = i18n;
