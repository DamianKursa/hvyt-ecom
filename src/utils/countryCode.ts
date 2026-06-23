export type CountryLookup = { code: string; name: string };

const LEGACY_COUNTRY_NAMES: Record<string, string> = {
  polska: 'PL',
  poland: 'PL',
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

  return '';
};
