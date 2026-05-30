// i18n.js — react-i18next bridge for Amanat.

import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from './locales/en/translation.json';
import ur from './locales/ur/translation.json';

if (!i18next.isInitialized) {
  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ur: { translation: ur },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    });
}

window.i18next = i18next;
window.AMANAT_I18N = { en, ur };

window.setAmanatLanguage = async function setAmanatLanguage(language = 'en') {
  const next = language === 'ur' ? 'ur' : 'en';
  await i18next.changeLanguage(next);
  document.documentElement.lang = next;
  document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr';
  window.dispatchEvent(new CustomEvent('amanat:languagechange', { detail: next }));
};

window.useI18n = function useI18n() {
  const { t } = useTranslation();
  return t;
};
