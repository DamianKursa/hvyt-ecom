/**
 * useI18n Hook
 * Main hook for internationalization
 * 
 * Zintegrowany z LanguageContext - używa kontekstu jako głównego źródła,
 * z fallback do własnej logiki dla kompatybilności wstecznej.
 */

import { useRouter } from 'next/router';
import { useMemo, useContext } from 'react';
import LanguageContext from '@/context/LanguageContext';
import { 
  getCurrentLanguage, 
  getI18nConfig, 
  Language,
  I18nConfig 
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
  switchLanguage?: () => void; // Opcjonalna funkcja z kontekstu
}

export const useI18n = (): UseI18nReturn => {
  // === WSZYSTKIE HOOKI WYWOŁANE BEZWARUNKOWO NA POCZĄTKU ===
  const context = useContext(LanguageContext);
  const router = useRouter();
  
  // Fallback language detection (używane gdy kontekst nie istnieje)
  const fallbackLanguage = useMemo(() => {
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
  }, [router.locale, router.pathname, router.asPath]);
  
  const fallbackConfig = useMemo(() => getI18nConfig(fallbackLanguage), [fallbackLanguage]);
  const fallbackT = useMemo(() => getTranslations(fallbackLanguage), [fallbackLanguage]);
  
  const fallbackGetPath = (path: string, targetLang?: Language) => 
    getLocalizedPath(path, targetLang || fallbackLanguage);
  
  // === LOGIKA WARUNKOWA PO WYWOŁANIU HOOKÓW ===
  
  // Jeśli kontekst istnieje, użyj go jako głównego źródła
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
  
  // Fallback - zachowaj całą obecną logikę dla kompatybilności
  // (dla przypadków gdy kontekst nie jest dostępny)
  return {
    language: fallbackLanguage,
    config: fallbackConfig,
    t: fallbackT,
    getPath: fallbackGetPath,
    isEn: fallbackLanguage === 'en',
    isPl: fallbackLanguage === 'pl',
    switchLanguage: undefined, // Brak switchLanguage w fallback mode
  };
};
