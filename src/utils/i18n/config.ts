/**
 * i18n Configuration
 * Centralized language and URL management
 */

export type Language = 'pl' | 'en';

export interface I18nConfig {
  language: Language;
  siteUrl: string;
  apiUrl: string;
  currency: string;
  currencySymbol: string;
}

/**
 * Get current language from environment or URL
 */
export const getCurrentLanguage = (): Language => {
  // Server-side: check environment variable
  if (typeof window === 'undefined') {
    const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Language;
    return defaultLang || 'pl';
  }

  // Client-side: check URL path or hostname
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;

  // Subdirectory mode: staging.hvyt.pl/en
  if (pathname.startsWith('/en')) {
    return 'en';
  }

  // Multi-domain mode: hvyt.eu
  if (hostname.includes('hvyt.eu') || hostname.includes('.eu')) {
    return 'en';
  }

  // Default: PL
  return 'pl';
};

/**
 * Get site URL for current language
 */
export const getSiteUrl = (lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  
  if (currentLang === 'en') {
    return process.env.NEXT_PUBLIC_SITE_URL_EN || 
           process.env.NEXT_PUBLIC_SITE_URL || 
           'https://hvyt.eu';
  }
  
  return process.env.NEXT_PUBLIC_SITE_URL_PL || 
         process.env.NEXT_PUBLIC_SITE_URL || 
         'https://hvyt.pl';
};

/**
 * Get API URL for current language
 */
export const getApiUrl = (lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  const baseUrl = process.env.WORDPRESS_API_URL || 'https://wp.hvyt.pl';
  
  // Subdirectory mode: staging.hvyt.pl/en/wp-json/...
  if (currentLang === 'en' && baseUrl.includes('staging')) {
    return `${baseUrl}/en/wp-json/wc/v3`;
  }
  
  // Multi-domain mode: same API, different language param
  return `${baseUrl}/wp-json/wc/v3`;
};

/**
 * Get currency for current language
 */
export const getCurrency = (lang?: Language): { code: string; symbol: string } => {
  const currentLang = lang || getCurrentLanguage();
  
  if (currentLang === 'en') {
    return { code: 'EUR', symbol: '€' };
  }
  
  return { code: 'PLN', symbol: 'zł' };
};

/**
 * Get complete i18n configuration
 */
export const getI18nConfig = (lang?: Language): I18nConfig => {
  const currentLang = lang || getCurrentLanguage();
  const currency = getCurrency(currentLang);
  
  return {
    language: currentLang,
    siteUrl: getSiteUrl(currentLang),
    apiUrl: getApiUrl(currentLang),
    currency: currency.code,
    currencySymbol: currency.symbol,
  };
};

