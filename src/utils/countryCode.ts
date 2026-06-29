export type CountryLookup = { code: string; name: string };

const LEGACY_COUNTRY_NAMES: Record<string, string> = {
  polska: 'PL',
  poland: 'PL',
};

const displayNamesCache: Partial<Record<string, Intl.DisplayNames>> = {};

const getDisplayNames = (locale: string): Intl.DisplayNames | null => {
  const lang = locale === 'en' ? 'en' : 'pl';
  if (!displayNamesCache[lang]) {
    try {
      displayNamesCache[lang] = new Intl.DisplayNames([lang], {
        type: 'region',
      } as Intl.DisplayNamesOptions);
    } catch {
      return null;
    }
  }
  return displayNamesCache[lang] ?? null;
};

/** Localized country label for UI (ISO code stays in form state / orders). */
export const getCountryDisplayName = (
  code: string,
  locale: string = 'pl',
  fallback?: string,
): string => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return fallback ?? '';

  const displayNames = getDisplayNames(locale);
  const localized = displayNames?.of(normalized);
  if (localized && localized !== normalized) {
    return localized;
  }

  return fallback ?? normalized;
};

const findCountryCodeByDisplayName = (name: string): string => {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return '';

  for (const lang of ['pl', 'en'] as const) {
    const displayNames = getDisplayNames(lang);
    if (!displayNames) continue;

    let regionCodes: string[] = [];
    try {
      regionCodes = (Intl as typeof Intl & {
        supportedValuesOf: (key: 'region') => string[];
      }).supportedValuesOf('region').filter((c) => c.length === 2);
    } catch {
      return '';
    }

    for (const code of regionCodes) {
      const label = displayNames.of(code);
      if (label?.toLowerCase() === normalized) {
        return code.toUpperCase();
      }
    }
  }

  return '';
};

export const isCountryCode = (value: string): boolean =>
  /^[A-Za-z]{2}$/.test(value.trim());

/**
 * Resolve a country name or code to an ISO 3166-1 alpha-2 code.
 * WooCommerce and Baselinker require codes (e.g. "DE"), not full names.
 */
export const resolveCountryCode = (
  country: string | undefined | null,
  countries: CountryLookup[] = [],
): string => {
  const trimmed = (country ?? '').trim();
  if (!trimmed) return 'PL';

  if (isCountryCode(trimmed)) {
    return trimmed.toUpperCase();
  }

  const fromList = countries.find(
    (c) =>
      c.name.toLowerCase() === trimmed.toLowerCase() ||
      c.code.toLowerCase() === trimmed.toLowerCase(),
  );
  if (fromList) return fromList.code.toUpperCase();

  const fromLegacy = LEGACY_COUNTRY_NAMES[trimmed.toLowerCase()];
  if (fromLegacy) return fromLegacy;

  const fromIntl = findCountryCodeByDisplayName(trimmed);
  if (fromIntl) return fromIntl;

  return '';
};

export const isPolandCountryCode = (code: string): boolean =>
  code.trim().toUpperCase() === 'PL';

/** Keep the last zone mapping per country (matches later WC zones overriding earlier ones). */
export const dedupeShippingCountriesByCode = <
  T extends CountryLookup & { zoneId?: number },
>(
  countries: T[],
): T[] => {
  const byCode = new Map<string, T>();

  for (const country of countries) {
    const code = country.code.trim().toUpperCase();
    if (!code) continue;
    byCode.set(code, country);
  }

  return Array.from(byCode.values());
};

/** EN storefront ships internationally only — hide Poland from country selectors. */
export const filterCountriesForLocale = <T extends CountryLookup>(
  countries: T[],
  locale: string,
): T[] => {
  if (locale !== 'en') return countries;
  return countries.filter((country) => !isPolandCountryCode(country.code));
};

export const EMPTY_COUNTRY_CODE = '';

export const isCountrySelected = (
  countryCode: string | undefined | null,
): boolean => Boolean(countryCode?.trim());

export const getInitialCheckoutCountryCode = (locale: string): string =>
  locale === 'en' ? EMPTY_COUNTRY_CODE : 'PL';

export const getDefaultCountryCode = (
  locale: string,
  countries: CountryLookup[] = [],
): string => {
  if (locale === 'en') {
    return filterCountriesForLocale(countries, 'en')[0]?.code.toUpperCase() ?? '';
  }
  return 'PL';
};

/** Build checkout country options with labels in the active storefront language. */
export const localizeCountryList = <T extends CountryLookup>(
  countries: T[],
  locale: string = 'pl',
): T[] => {
  const lang = locale === 'en' ? 'en' : 'pl';

  return filterCountriesForLocale(
    countries
      .map((country) => ({
        ...country,
        name: getCountryDisplayName(country.code, lang, country.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, lang)),
    locale,
  );
};
