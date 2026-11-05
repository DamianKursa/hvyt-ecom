// lib/shipping.ts

import { ShippingCountry } from "@/types/checkout";
import { createApiClient } from "./http";

const CustomAPI = createApiClient({
  baseURL: process.env.REST_API_CUSTOM,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

export async function getShippingCountries(lang = 'pl'): Promise<ShippingCountry[]> {
  try {
    const response = await CustomAPI.get('/shipping/countries', {
      params: { lang },
    });
    const countries = (Array.isArray(response.data) ? response.data : []) as ShippingCountry[];

    return countries.sort((a, b) => a.name.localeCompare(b.name, lang));
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
  const countries = await getShippingCountries(lang);
  const match = countries.find(
    (country) => country.code.toUpperCase() === countryCode.toUpperCase(),
  );
  return match?.zoneId ?? null;
};
