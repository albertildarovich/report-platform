import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Импорт переводов
import enCommon from './en/common.json';
import ruCommon from './ru/common.json';

// Типы для переводов
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof enCommon;
    };
  }
}

export const resources = {
  en: {
    common: enCommon,
  },
  ru: {
    common: ruCommon,
  },
} as const;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    resources,
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;