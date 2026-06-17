/**
 * useI18n Hook
 * Main hook for internationalization (domain-based, synced with LanguageContext + router.locale)
 */

import { useRouter } from 'next/router';
import { useMemo, useContext } from 'react';
import LanguageContext from '@/context/LanguageContext';
import {
  getCurrentLanguage,
  getI18nConfig,
  Language,
  I18nConfig,
} from '@/utils/i18n/config';
import { getTranslations, Translations } from '@/utils/i18n/translations';
import { getLocalizedPath } from '@/utils/i18n/routing';

export interface UseI18nReturn {
  language: Language;
  config: I18nConfig;
  t: Translations;
  getPath: (path: string, lang?: Language) => string;
  isEn: boolean;
  isPl: boolean;
  switchLanguage?: () => void;
}

export const useI18n = (): UseI18nReturn => {
  const context = useContext(LanguageContext);
  const router = useRouter();

  const fallbackLanguage = useMemo((): Language => {
    if (router.locale === 'pl' || router.locale === 'en') {
      return router.locale;
    }

    if (typeof window !== 'undefined') {
      return getCurrentLanguage(window.location.hostname);
    }

    return getCurrentLanguage();
  }, [router.locale]);

  const fallbackConfig = useMemo(() => getI18nConfig(fallbackLanguage), [fallbackLanguage]);
  const fallbackT = useMemo(() => getTranslations(fallbackLanguage), [fallbackLanguage]);

  const fallbackGetPath = (path: string, targetLang?: Language) =>
    getLocalizedPath(path, targetLang || fallbackLanguage);

  if (context) {
    return {
      language: context.language,
      t: context.t,
      config: context.config,
      getPath: context.getPath,
      isEn: context.language === 'en',
      isPl: context.language === 'pl',
      switchLanguage: context.switchLanguage,
    };
  }

  return {
    language: fallbackLanguage,
    config: fallbackConfig,
    t: fallbackT,
    getPath: fallbackGetPath,
    isEn: fallbackLanguage === 'en',
    isPl: fallbackLanguage === 'pl',
    switchLanguage: undefined,
  };
};
