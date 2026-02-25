/**
 * URL routing and path localization
 * Maps Polish slugs to English slugs and vice versa
 */

import { Language } from './config';
import { getCurrentLanguage } from './config';

/**
 * Slug mapping: Polish → English
 */
const slugMap: Record<string, { pl: string; en: string }> = {
  // Categories
  'uchwyty-meblowe': { pl: 'uchwyty-meblowe', en: 'handles' },
  'klamki': { pl: 'klamki', en: 'door-handles' },
  'wieszaki': { pl: 'wieszaki', en: 'wall-hooks' },
  'galki': { pl: 'galki', en: 'knobs' },
  'meble': { pl: 'meble', en: 'furniture' },
  
  // Pages
  'o-nas': { pl: 'o-nas', en: 'about-us' },
  'kontakt': { pl: 'kontakt', en: 'contact' },
  'wspolpraca': { pl: 'wspolpraca', en: 'cooperation' },
  'dostawa': { pl: 'dostawa', en: 'delivery' },
  'zwroty-i-reklamacje': { pl: 'zwroty-i-reklamacje', en: 'returns' },
  'regulamin': { pl: 'regulamin', en: 'terms' },
  'polityka-prywatnosci': { pl: 'polityka-prywatnosci', en: 'privacy-policy' },
  'produkty': { pl: 'produkty', en: 'products' },
  'produkt': { pl: 'produkt', en: 'product' },
  'kolekcje': { pl: 'kolekcje', en: 'collections' },
  'blog': { pl: 'blog', en: 'blog' },
  'koszyk': { pl: 'koszyk', en: 'cart' },
  'moje-konto': { pl: 'moje-konto', en: 'my-account' },
  'moje-konto/moje-zamowienia': { pl: 'moje-konto/moje-zamowienia', en: 'my-account/my-orders' },
  'moje-konto/kupione-produkty': { pl: 'moje-konto/kupione-produkty', en: 'my-account/bought-products' },
  'moje-konto/moje-dane': { pl: 'moje-konto/moje-dane', en: 'my-account/account-details' },
  'moje-konto/moje-adresy': { pl: 'moje-konto/moje-adresy', en: 'my-account/my-addresses' },
  'moje-konto/dane-do-faktury': { pl: 'moje-konto/dane-do-faktury', en: 'my-account/billing-data' },
  'ulubione': { pl: 'ulubione', en: 'wishlist' },
  'dziekujemy': { pl: 'dziekujemy', en: 'thank-you' },
  'logowanie': { pl: 'logowanie', en: 'login' },
  'zamowienie-otrzymane': { pl: 'zamowienie-otrzymane', en: 'order-received' },
};

/**
 * Reverse slug mapping: English → Polish (for finding PL slug from EN slug)
 */
const reverseSlugMap: Record<string, string> = {};
Object.keys(slugMap).forEach((key) => {
  const mapping = slugMap[key];
  reverseSlugMap[mapping.en] = key;
});

/**
 * Category slug mapping: PL ↔ EN for category pages
 * Used primarily for server-side rendering and API calls
 */
export const categorySlugMapping: Record<string, { pl: string; en: string }> = {
  'uchwyty-meblowe': { pl: 'uchwyty-meblowe', en: 'handles' },
  'handles': { pl: 'uchwyty-meblowe', en: 'handles' },
  'klamki': { pl: 'klamki', en: 'door-handles' },
  'door-handles': { pl: 'klamki', en: 'door-handles' },
  'wieszaki': { pl: 'wieszaki', en: 'wall-hooks' },
  'wall-hooks': { pl: 'wieszaki', en: 'wall-hooks' },
  'galki': { pl: 'galki', en: 'knobs' },
  'knobs': { pl: 'galki', en: 'knobs' },
  'meble': { pl: 'meble', en: 'furniture' },
  'furniture': { pl: 'meble', en: 'furniture' },
  'sale': { pl: 'sale', en: 'sale' },
};

/**
 * Get Polish slug from any slug (PL or EN)
 * Used for fetching data from WooCommerce which uses Polish slugs
 */
export const getPolishCategorySlug = (slug: string): string => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.pl : slug;
};

/**
 * Get English slug from any slug (PL or EN)
 */
export const getEnglishCategorySlug = (slug: string): string => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.en : slug;
};

/**
 * Check if a slug is an English category slug
 */
export const isEnglishCategorySlug = (slug: string): boolean => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.en === slug && mapping.pl !== slug : false;
};

/**
 * Get localized category slug based on language
 */
export const getLocalizedCategorySlug = (slug: string, lang: Language): string => {
  const mapping = categorySlugMapping[slug];
  if (!mapping) return slug;
  return lang === 'en' ? mapping.en : mapping.pl;
};

/**
 * Check if we're in multi-domain mode (production: hvyt.pl / hvyt.eu)
 * vs subdirectory mode (staging: staging.hvyt.pl / staging.hvyt.pl/en)
 */
const isMultiDomainMode = (): boolean => {
  if (typeof window === 'undefined') {
    // Server-side: check environment variables
    const siteUrlEn = process.env.NEXT_PUBLIC_SITE_URL_EN || '';
    return siteUrlEn.includes('hvyt.eu') || siteUrlEn.includes('.eu');
  }
  
  // Client-side: check hostname
  const hostname = window.location.hostname;
  return hostname.includes('hvyt.eu') || hostname.includes('.eu');
};

/**
 * Get localized path for a given route
 */
export const getLocalizedPath = (
  path: string,
  lang?: Language
): string => {
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';
  const isMultiDomain = isMultiDomainMode();
  
  // Remove leading slash and /en prefix for processing
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Remove query params and hash
  cleanPath = cleanPath.split('?')[0].split('#')[0];
  
  // Remove /en prefix if present
  if (cleanPath.startsWith('en/')) {
    cleanPath = cleanPath.replace('en/', '');
  } else if (cleanPath === 'en') {
    cleanPath = '';
  }
  
  // Handle root path
  if (cleanPath === '' || cleanPath === '/') {
    if (isMultiDomain) {
      return '/';
    } else {
      return isEn ? '/en' : '/';
    }
  }
  
  // Handle category routes: /kategoria/slug or /category/slug
  if (cleanPath.startsWith('kategoria/') || cleanPath.startsWith('category/')) {
    const isCategoryRoute = cleanPath.startsWith('category/');
    const slug = cleanPath.replace('kategoria/', '').replace('category/', '');
    
    // Find mapping: if EN slug, find PL equivalent; if PL slug, find EN equivalent
    const mapped = slugMap[slug] || (isCategoryRoute && reverseSlugMap[slug] ? slugMap[reverseSlugMap[slug]] : null);
    
    if (mapped) {
      if (isMultiDomain) {
        return isEn ? `/category/${mapped.en}` : `/kategoria/${mapped.pl}`;
      } else {
        return isEn ? `/en/category/${mapped.en}` : `/kategoria/${mapped.pl}`;
      }
    }
    
    // Fallback: keep original slug
    if (isMultiDomain) {
      return isEn ? `/category/${slug}` : `/kategoria/${slug}`;
    } else {
      return isEn ? `/en/category/${slug}` : `/kategoria/${slug}`;
    }
  }
  
  // Handle product routes: /produkt/slug or /product/slug
  if (cleanPath.startsWith('produkt/') || cleanPath.startsWith('product/')) {
    const productSlug = cleanPath.replace('produkt/', '').replace('product/', '');
    
    if (isMultiDomain) {
      return isEn ? `/product/${productSlug}` : `/produkt/${productSlug}`;
    } else {
      return isEn ? `/en/product/${productSlug}` : `/produkt/${productSlug}`;
    }
  }  
  
  // Handle regular pages
  let mapped = slugMap[cleanPath];
  if (!mapped && reverseSlugMap[cleanPath]) {
    mapped = slugMap[reverseSlugMap[cleanPath]];
  }

  if (mapped) {
    if (isMultiDomain) {
      return isEn ? `/${mapped.en}` : `/${mapped.pl}`;
    } else {
      return isEn ? `/en/${mapped.en}` : `/${mapped.pl}`;
    }
  }
  
  // If path already has language prefix, return as is
  if (cleanPath.startsWith('en/')) {
    return `/${cleanPath}`;
  }
  
  // Default: add language prefix for EN only in subdirectory mode
  if (isMultiDomain) {
    return isEn ? `/${cleanPath}` : `/${cleanPath}`;
  } else {
    return isEn ? `/en/${cleanPath}` : `/${cleanPath}`;
  }
};

/**
 * Get category slug for current language
 */
export const getCategorySlug = (
  categoryKey: string,
  lang?: Language
): string => {
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';
  
  const categorySlugMap: Record<string, { pl: string; en: string }> = {
    Uchwyty: { pl: 'uchwyty-meblowe', en: 'handles' },
    Klamki: { pl: 'klamki', en: 'door-handles' },
    Wieszaki: { pl: 'wieszaki', en: 'wall-hooks' },
    Gałki: { pl: 'galki', en: 'knobs' },
  };
  
  const mapped = categorySlugMap[categoryKey];
  if (!mapped) return '';
  
  return isEn ? mapped.en : mapped.pl;
};

/**
 * Get category path (full URL path)
 */
export const getCategoryPath = (
  categoryKey: string,
  lang?: Language
): string => {
  const slug = getCategorySlug(categoryKey, lang);
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';
  const isMultiDomain = isMultiDomainMode();
  
  if (isMultiDomain) {
    // Multi-domain: no /en prefix
    return isEn ? `/category/${slug}` : `/kategoria/${slug}`;
  } else {
    // Subdirectory: add /en prefix for EN
    return isEn ? `/en/category/${slug}` : `/kategoria/${slug}`;
  }
};

