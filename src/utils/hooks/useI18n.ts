/**
 * useI18n Hook
 * Main hook for internationalization
 */

import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { 
  getCurrentLanguage, 
  getI18nConfig, 
  Language,
  I18nConfig 
} from '@/utils/i18n/config';
import { getTranslations, FooterTranslations } from '@/utils/i18n/translations';
import { getLocalizedPath } from '@/utils/i18n/routing';

export interface UseI18nReturn {
  language: Language;
  config: I18nConfig;
  t: FooterTranslations;
  getPath: (path: string, lang?: Language) => string;
  isEn: boolean;
  isPl: boolean;
}

export const useI18n = (): UseI18nReturn => {
  const router = useRouter();
  
  // Detect language from router or environment
  const language = useMemo(() => {
    // Check window.location.pathname first (most reliable for language detection)
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/en') || pathname === '/en') {
        return 'en';
      }
      
      // Check hostname (for multi-domain mode)
      const hostname = window.location.hostname;
      if (hostname.includes('hvyt.eu') || hostname.includes('.eu')) {
        return 'en';
      }
    }
    
    // Fallback to router
    if (router.pathname.startsWith('/en') || router.asPath.startsWith('/en')) {
      return 'en';
    }
    
    // Fallback to environment or default
    return getCurrentLanguage();
  }, [router.locale]);
  
  const config = useMemo(() => getI18nConfig(language), [language]);
  const t = useMemo(() => getTranslations(language), [language]);
  
  const getPath = (path: string, targetLang?: Language) => getLocalizedPath(path, targetLang);
  
  return {
    language,
    config,
    t,
    getPath,
    isEn: language === 'en',
    isPl: language === 'pl',
  };
};

