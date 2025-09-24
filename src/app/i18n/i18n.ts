"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import es from "../locales/es.json";

const resources = {
  en,
  es,
};


if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    defaultNS: "home",
    ns: ["home", "footer", "about-me", "shutdown", "login", "music-player", "work", "education"],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    debug: false,
  });
}


export default i18n;
