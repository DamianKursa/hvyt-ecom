/**
 * URL routing and path localization
 * Maps Polish slugs to English slugs and vice versa.
 * Paths are domain-scoped (no /en prefix) — language comes from hostname.
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
  'wieszaki': { pl: 'wieszaki', en: 'hooks' },
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
 */
export const categorySlugMapping: Record<string, { pl: string; en: string }> = {
  'uchwyty-meblowe': { pl: 'uchwyty-meblowe', en: 'handles' },
  'handles': { pl: 'uchwyty-meblowe', en: 'handles' },
  'klamki': { pl: 'klamki', en: 'door-handles' },
  'door-handles': { pl: 'klamki', en: 'door-handles' },
  'wieszaki': { pl: 'wieszaki', en: 'hooks' },
  'hooks': { pl: 'wieszaki', en: 'hooks' },
  'galki': { pl: 'galki', en: 'knobs' },
  'knobs': { pl: 'galki', en: 'knobs' },
  'meble': { pl: 'meble', en: 'furniture' },
  'furniture': { pl: 'meble', en: 'furniture' },
  'sale': { pl: 'sale', en: 'sale' },
};

export const getPolishCategorySlug = (slug: string): string => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.pl : slug;
};

export const getEnglishCategorySlug = (slug: string): string => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.en : slug;
};

export const isEnglishCategorySlug = (slug: string): boolean => {
  const mapping = categorySlugMapping[slug];
  return mapping ? mapping.en === slug && mapping.pl !== slug : false;
};

export const getLocalizedCategorySlug = (slug: string, lang: Language): string => {
  const mapping = categorySlugMapping[slug];
  if (!mapping) return slug;
  return lang === 'en' ? mapping.en : mapping.pl;
};

/** Strip legacy /en prefix from paths (subdirectory mode migration). */
const stripLegacyEnPrefix = (path: string): string => {
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  cleanPath = cleanPath.split('?')[0].split('#')[0];

  if (cleanPath.startsWith('en/')) {
    cleanPath = cleanPath.replace(/^en\//, '');
  } else if (cleanPath === 'en') {
    cleanPath = '';
  }

  return cleanPath;
};

/**
 * Get localized path for a given route (domain-scoped, no locale prefix in URL).
 */
export const getLocalizedPath = (path: string, lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';

  const cleanPath = stripLegacyEnPrefix(path);

  if (cleanPath === '' || cleanPath === '/') {
    return '/';
  }

  if (cleanPath.startsWith('kategoria/') || cleanPath.startsWith('category/')) {
    const isCategoryRoute = cleanPath.startsWith('category/');
    const slug = cleanPath.replace('kategoria/', '').replace('category/', '');
    const mapped =
      slugMap[slug] ||
      (isCategoryRoute && reverseSlugMap[slug] ? slugMap[reverseSlugMap[slug]] : null);

    if (mapped) {
      return isEn ? `/category/${mapped.en}` : `/kategoria/${mapped.pl}`;
    }

    return isEn ? `/category/${slug}` : `/kategoria/${slug}`;
  }

  if (cleanPath.startsWith('produkt/') || cleanPath.startsWith('product/')) {
    const productSlug = cleanPath.replace('produkt/', '').replace('product/', '');
    return isEn ? `/product/${productSlug}` : `/produkt/${productSlug}`;
  }

  let mapped = slugMap[cleanPath];
  if (!mapped && reverseSlugMap[cleanPath]) {
    mapped = slugMap[reverseSlugMap[cleanPath]];
  }

  if (mapped) {
    return isEn ? `/${mapped.en}` : `/${mapped.pl}`;
  }

  return `/${cleanPath}`;
};

export const getCategorySlug = (categoryKey: string, lang?: Language): string => {
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';

  const categorySlugMap: Record<string, { pl: string; en: string }> = {
    Uchwyty: { pl: 'uchwyty-meblowe', en: 'handles' },
    Klamki: { pl: 'klamki', en: 'door-handles' },
    Wieszaki: { pl: 'wieszaki', en: 'hooks' },
    Gałki: { pl: 'galki', en: 'knobs' },
  };

  const mapped = categorySlugMap[categoryKey];
  if (!mapped) return '';

  return isEn ? mapped.en : mapped.pl;
};

export const getCategoryPath = (categoryKey: string, lang?: Language): string => {
  const slug = getCategorySlug(categoryKey, lang);
  const currentLang = lang || getCurrentLanguage();
  const isEn = currentLang === 'en';

  return isEn ? `/category/${slug}` : `/kategoria/${slug}`;
};

const FULL_WIDTH_PAGE_PATHNAMES = [
  '/',
  '/o-nas',
  '/hvyt-objects',
  '/blog',
  '/kolekcje',
] as const;

const FULL_WIDTH_AS_PATH_PREFIXES = [
  '/about-us',
  '/collections',
  '/category/',
  '/product/',
] as const;

const getFullWidthCategorySlugs = (): string[] => {
  const slugs = new Set<string>();

  Object.values(categorySlugMapping).forEach((mapping) => {
    slugs.add(mapping.pl);
    slugs.add(mapping.en);
  });

  slugs.add('produkt');
  slugs.add('product');

  return Array.from(slugs);
};

/** Whether the page should use full-width hero layout (no container margin). */
export const isFullWidthHeroRoute = (pathname: string, asPath: string): boolean => {
  if (FULL_WIDTH_PAGE_PATHNAMES.includes(pathname as (typeof FULL_WIDTH_PAGE_PATHNAMES)[number])) {
    return true;
  }

  if (
    pathname.startsWith('/kategoria') ||
    pathname.startsWith('/kolekcje') ||
    pathname.startsWith('/produkt')
  ) {
    return true;
  }

  const cleanAsPath = asPath.split('?')[0].split('#')[0];

  if (
    FULL_WIDTH_AS_PATH_PREFIXES.some(
      (prefix) => cleanAsPath === prefix.replace(/\/$/, '') || cleanAsPath.startsWith(prefix),
    )
  ) {
    return true;
  }

  return getFullWidthCategorySlugs().some((slug) => cleanAsPath.includes(`/${slug}`));
};
