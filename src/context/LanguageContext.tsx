/**
 * LanguageContext
 * Domain-based language state (hvyt.pl / hvyt.eu) with language switching across domains.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Language, getCurrentLanguage, getI18nConfig, I18nConfig } from '@/utils/i18n/config';
import { getSiteUrlForLanguage } from '@/utils/i18n/domains';
import { getLocalizedPath } from '@/utils/i18n/routing';
import { getTranslations, Translations } from '@/utils/i18n/translations';

interface LanguageContextType {
  language: Language;
  config: I18nConfig;
  t: Translations;
  setLanguage: (lang: Language) => void;
  getPath: (path: string, lang?: Language) => string;
  isEn: boolean;
  isPl: boolean;
  switchLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const setLanguageCookie = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }
};

const getLanguageCookie = (): Language | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match?.[1] === 'pl' || match?.[1] === 'en' ? (match[1] as Language) : null;
};

const resolveLanguage = (routerLocale?: string): Language => {
  if (routerLocale === 'pl' || routerLocale === 'en') {
    return routerLocale;
  }

  if (typeof window !== 'undefined') {
    const fromDomain = getCurrentLanguage(window.location.hostname);
    return fromDomain;
  }

  const cookieLang = getLanguageCookie();
  if (cookieLang) return cookieLang;

  return getCurrentLanguage();
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(() => resolveLanguage(router.locale));

  useEffect(() => {
    const nextLang = resolveLanguage(router.locale);
    setLanguageState(nextLang);
    setLanguageCookie(nextLang);
  }, [router.locale, router.asPath]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageCookie(lang);
  };

  const config = getI18nConfig(language);
  const t = getTranslations(language);
  const getPath = (path: string, lang?: Language) => getLocalizedPath(path, lang || language);

  const switchLanguage = () => {
    const newLang: Language = language === 'pl' ? 'en' : 'pl';
    setLanguage(newLang);

    const currentPath = router.asPath.split('?')[0];
    const newPath = getLocalizedPath(currentPath, newLang);
    const newDomain = getSiteUrlForLanguage(newLang);
    const query = router.asPath.includes('?') ? router.asPath.slice(router.asPath.indexOf('?')) : '';

    window.location.href = `${newDomain}${newPath}${query}`;
  };

  const value: LanguageContextType = {
    language,
    config,
    t,
    setLanguage,
    getPath,
    isEn: language === 'en',
    isPl: language === 'pl',
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
