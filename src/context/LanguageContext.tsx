/**
 * LanguageContext
 * Provides app-wide language state and language switching functionality
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Language, getCurrentLanguage, getI18nConfig, I18nConfig } from '@/utils/i18n/config';
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

/**
 * Check if we're in multi-domain mode
 */
const isMultiDomainMode = (): boolean => {
  if (typeof window === 'undefined') {
    const siteUrlEn = process.env.NEXT_PUBLIC_SITE_URL_EN || '';
    return siteUrlEn.includes('hvyt.eu') || siteUrlEn.includes('.eu');
  }
  const hostname = window.location.hostname;
  return hostname.includes('hvyt.eu') || hostname.endsWith('.eu');
};

/**
 * Set language cookie
 */
const setLanguageCookie = (lang: Language) => {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }
};

/**
 * Get language from cookie
 */
const getLanguageCookie = (): Language | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match ? (match[1] as Language) : null;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from cookie, router, or detection
    const cookieLang = getLanguageCookie();
    if (cookieLang) return cookieLang;
    return getCurrentLanguage();
  });

  // Update language when router locale changes
  useEffect(() => {
    const newLang = getCurrentLanguage();
    if (newLang !== language) {
      setLanguageState(newLang);
      setLanguageCookie(newLang);
    }
  }, [router.asPath, router.locale]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLanguageCookie(lang);
  };

  const config = getI18nConfig(language);
  const t = getTranslations(language);

  const getPath = (path: string, lang?: Language) => getLocalizedPath(path, lang || language);

  const switchLanguage = () => {
    const newLang = language === 'pl' ? 'en' : 'pl';
    setLanguage(newLang);

    // Navigate to the equivalent page in the new language
    const currentPath = router.asPath;
    const newPath = getLocalizedPath(currentPath, newLang);

    if (isMultiDomainMode()) {
      // Multi-domain mode: redirect to different domain
      const newDomain = newLang === 'en' 
        ? process.env.NEXT_PUBLIC_SITE_URL_EN || 'https://hvyt.eu'
        : process.env.NEXT_PUBLIC_SITE_URL_PL || 'https://hvyt.pl';
      window.location.href = `${newDomain}${newPath}`;
    } else {
      // Subdirectory mode: navigate within same domain
      console.log('lang switcher', newPath, newLang);
      
      router.push(newPath, newPath, { locale: newLang });
    }
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

/**
 * Hook to use language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
