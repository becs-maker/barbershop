import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationAM from './locales/am.json';
import translationOM from './locales/om.json';
import translationTI from './locales/ti.json';
import translationEN from './locales/en.json';

const resources = {
  am: { translation: translationAM },
  om: { translation: translationOM },
  ti: { translation: translationTI },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'am', // Amharic as default
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
