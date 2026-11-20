import { translationsBackend } from "@mf-vite-example/shared-ui";
import i18n from "i18next";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next";
import "./i18n";
import App from "./App";

// Standalone only (this file never runs inside the host): nobody else owns
// the i18next instance here, so init it with the same setup as the host.
i18n
  .use(translationsBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "it"],
    ns: ["remote"],
    defaultNS: "remote",
    interpolation: { escapeValue: false },
  });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback="loading...">
      <App />
    </Suspense>
  </React.StrictMode>
);
