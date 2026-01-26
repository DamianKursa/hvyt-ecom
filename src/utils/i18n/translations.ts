/**
 * Translations module
 * Re-eksportuje tłumaczenia z osobnych plików lokalizacyjnych
 * 
 * Struktura katalogów:
 * /locales/pl.ts - polskie tłumaczenia (źródło typu Translations)
 * /locales/en.ts - angielskie tłumaczenia
 */

import { pl } from './locales/pl';
import { en } from './locales/en';
import type { Translations } from './locales/pl';
import { Language } from './config';

// Re-eksport typu dla innych modułów
export type { Translations };

// Obiekt tłumaczeń indeksowany językiem
export const translations: Record<Language, Translations> = {
  pl,
  en,
};

/**
 * Pobiera tłumaczenia dla danego języka
 * @param lang - kod języka ('pl' | 'en')
 * @returns obiekt tłumaczeń
 */
export const getTranslations = (lang: Language): Translations => {
  return translations[lang] || translations.pl;
};
