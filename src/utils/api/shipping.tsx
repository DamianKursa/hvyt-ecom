// lib/shipping.ts

import { ShippingCountry, ShippingMethodWithoutClasses } from "@/types/checkout";
import axios from "axios";

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const CustomAPI = axios.create({
  baseURL: process.env.REST_API_CUSTOM,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

const mapActiveMethods = (
  methods: Array<{
    enabled?: boolean;
    instance_id: number;
    title: string;
    cost?: string | number;
    cost_original?: string | number;
    currency?: string;
  }>,
): ShippingMethodWithoutClasses[] =>
  methods
    .filter((method) => method.enabled)
    .map((method) => ({
      id: method.instance_id,
      title: method.title,
      cost: method?.cost ?? '0',
      cost_original: method?.cost_original ?? '0',
      currency: method?.currency || 'PLN',
    }));

const expandLocationCountryCodes = async (
  locations: Array<{ type: string; code: string }>,
): Promise<string[]> => {
  const codes: string[] = [];

  for (const location of locations) {
    if (location.type === 'country') {
      codes.push(location.code);
      continue;
    }

    if (location.type === 'continent') {
      const continentCountries = await WooCommerceAPI.get(
        `/data/continents/${location.code.toLowerCase()}`,
      );

      for (const country of continentCountries.data.countries ?? []) {
        codes.push(country.code);
      }
    }
  }

  return codes;
};

/**
 * Map each country to a shipping zone.
 * Later zones in WooCommerce order overwrite earlier ones (specific tiers override broad regions).
 */
const buildCountryZoneMap = async (
  lang: string,
): Promise<Map<string, Omit<ShippingCountry, 'code' | 'name'>>> => {
  const zonesResponse = await WooCommerceAPI.get('/shipping/zones');
  const zones = zonesResponse.data ?? [];
  const countryZoneMap = new Map<string, Omit<ShippingCountry, 'code' | 'name'>>();

  for (const zone of zones) {
    if (Number(zone.id) === 0) continue;

    const [locationsResponse, methodsResponse] = await Promise.all([
      WooCommerceAPI.get(`/shipping/zones/${zone.id}/locations`),
      CustomAPI.get(`/shipping/zones/${zone.id}/methods`, { params: { lang } }),
    ]);

    const activeMethods = mapActiveMethods(methodsResponse.data.methods ?? []);
    const countryCodes = await expandLocationCountryCodes(locationsResponse.data ?? []);
    const zoneEntry = {
      zoneId: Number(zone.id),
      zoneName: zone.name,
      methods: activeMethods,
    };

    for (const code of countryCodes) {
      countryZoneMap.set(code.toUpperCase(), zoneEntry);
    }
  }

  return countryZoneMap;
};

export async function getShippingCountries(lang = 'pl'): Promise<ShippingCountry[]> {
  try {
    const [countryZoneMap, allCountriesResponse] = await Promise.all([
      buildCountryZoneMap(lang),
      WooCommerceAPI.get('/data/countries', { params: { lang } }),
    ]);

    const countryMap = Object.fromEntries(
      (allCountriesResponse.data as { code: string; name: string }[]).map((country) => [
        country.code,
        country.name,
      ]),
    );

    const result = Array.from(countryZoneMap.entries()).map(([code, zone]) => ({
      code,
      name: countryMap[code] ?? code,
      ...zone,
    }));

    return result.sort((a, b) => a.name.localeCompare(b.name, lang));
  } catch (error) {
    console.error('Error fetching shipping countries:', error);
    throw error;
  }
}

/**
 * Resolve WooCommerce shipping zone for a country code.
 */
export const getShippingZoneIdForCountry = async (
  countryCode: string,
  lang = 'pl',
): Promise<number | null> => {
  const map = await buildCountryZoneMap(lang);
  return map.get(countryCode.toUpperCase())?.zoneId ?? null;
};
