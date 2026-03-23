// lib/shipping.ts

import { ShippingCountry, ShippingMethodWithoutClasses } from "@/types/checkout";
import axios from "axios"

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


export async function getShippingCountries(lang = 'pl'): Promise<ShippingCountry[]> {
  // 1. Pobierz wszystkie strefy wysyłki
  try {
      const zonesResponse = await WooCommerceAPI.get('/shipping/zones');
      const zones = zonesResponse.data;

        if (!zones || zones.length === 0) {
            console.log('No shipping zones available');
            return zones;
          }
          
        // 2. Dla każdej strefy pobierz lokalizacje i metody równolegle
        const zonesData = await Promise.all(
            zones.map(async (zone: any) => { 
            const [locations, methods] = await Promise.all([
                WooCommerceAPI.get(`/shipping/zones/${zone.id}/locations`),
                CustomAPI.get(`/shipping/zones/${zone.id}/methods`, {params: {lang: lang}})
            ])
            return { zone, locations: locations.data, methods: methods.data.methods }
            })
        );

        // 3. Pobierz pełną listę krajów (nazwy) z WC Data API
        const allCountriesResponse = await WooCommerceAPI.get('/data/countries');
        const allCountries: { code: string; name: string }[] = allCountriesResponse.data;
        const countryMap = Object.fromEntries(allCountries.map(c => [c.code, c.name]));

        // 4. Rozwiń lokalizacje na pojedyncze kraje
        const result: ShippingCountry[] = []

        for (const { zone, locations, methods } of zonesData) {
            // Pomiń strefę "Pozostałe lokalizacje" (id=0) jeśli nie chcesz jej pokazywać
            if (zone.id === 0) continue

            const activeMethods: ShippingMethodWithoutClasses[] = methods
            
            .filter((m: any) => m.enabled)
            .map((m: any) => ({
                id:       m.instance_id,
                title:    m.title,
                cost:     m?.cost ?? '0',
                cost_original: m?.cost_original?? '0',
                currency: m?.currency || 'PLN',
            }))

            for (const location of locations) {
                if (location.type === 'country') {
                    result.push({
                    code:     location.code,
                    name:     countryMap[location.code] ?? location.code,
                    zoneId:   zone.id,
                    zoneName: zone.name,
                    methods:  activeMethods,
                    })
                }

                // Obsługa kontynentów (type === 'continent') — rozwiń na kraje
                if (location.type === 'continent') {
                    const continentCountries = await WooCommerceAPI.get(`/data/continents/${location.code.toLowerCase()}`)
                    for (const country of continentCountries.data.countries ?? []) {
                    result.push({
                        code:     country.code,
                        name:     countryMap[country.code] ?? country.code,
                        zoneId:   zone.id,
                        zoneName: zone.name,
                        methods:  activeMethods,
                    })
                    }
                }
            }
        }

    // Posortuj alfabetycznie po nazwie
    return result.sort((a, b) => a.name.localeCompare(b.name, lang))        
    
  } catch (error) {
    console.error('Error fetching shipping countries:', error);
    throw error;
  }
  
}