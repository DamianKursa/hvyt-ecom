/**
 * i18n Configuration
 * Centralized language and URL management (domain-based)
 */

import {
  getDefaultLanguage,
  getLanguageFromHostname,
  getSiteUrlForLanguage,
} from './domains';

export type Language = 'pl' | 'en';

export interface I18nConfig {
  language: Language;
  siteUrl: string;
  apiUrl: string;
  currency: string;
  currencySymbol: string;
}

/**
 * Get current language from hostname (domain-based i18n).
 * Optional hostname for server/middleware; falls back to NEXT_PUBLIC_DEFAULT_LOCALE.
 */
export const getCurrentLanguage = (hostname?: string): Language => {
  if (hostname) {
    const fromDomain = getLanguageFromHostname(hostname);
    if (fromDomain) return fromDomain;
    return getDefaultLanguage();
  }

  if (typeof window !== 'undefined') {
    const fromDomain = getLanguageFromHostname(window.location.hostname);
    if (fromDomain) return fromDomain;
  }

  return getDefaultLanguage();
};

/**
 * Get site URL for a language (full origin, e.g. https://hvyt.pl).
 */
export const getSiteUrl = (lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  return getSiteUrlForLanguage(currentLang);
};

/**
 * Get API URL for current language
 */
export const getApiUrl = (): string => {
  const baseUrl = process.env.WORDPRESS_API_URL || 'https://hvyt.pl';
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
    apiUrl: getApiUrl(),
    currency: currency.code,
    currencySymbol: currency.symbol,
  };
};
