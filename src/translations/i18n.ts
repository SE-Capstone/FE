import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { en } from './en';

export const defaultNS = 'common';

const ns = [...Object.keys(en)];

export const resources = {
  en,
} as const;

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // debug: true,
    fallbackLng: 'en',
    lng: 'en',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    ns,
    defaultNS,
    resources,
  });

export type TLanguage = keyof typeof resources;

export const changeAppLanguage = (language: TLanguage) => {
  i18n.changeLanguage(language);
};

export default i18n;
