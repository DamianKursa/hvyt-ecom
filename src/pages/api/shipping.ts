import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { deleteCache, getCache, setCache } from '../../lib/cache';
import { getShippingCountries } from '@/utils/api/shipping';

const CACHE_TTL = 86400;

const parseShippingCost = (value: unknown): number | null => {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * WCML manual class prices should be used as-is in the target currency.
 * When PHP mis-tags them as auto_converted, prefer cost_original on non-PL locales.
 */
const normalizeShippingClassCost = (shippingClass: any, lang: string) => {
  if (lang === 'pl') return shippingClass;

  const original = parseShippingCost(shippingClass.cost_original);
  if (original == null) return shippingClass;

  const priceSource = shippingClass.price_source;
  if (priceSource === 'manual_wcml' || priceSource === 'manual_wcml_only') {
    return { ...shippingClass, cost: shippingClass.cost_original };
  }

  const cost = parseShippingCost(shippingClass.cost);
  if (
    priceSource === 'auto_converted' &&
    cost != null &&
    original !== cost
  ) {
    return {
      ...shippingClass,
      cost: shippingClass.cost_original,
      price_source: 'manual_wcml',
    };
  }

  return shippingClass;
};

const mergeShippingClassCostsFromFallback = (
  methods: any[],
  fallbackMethods: any[] | null | undefined,
): any[] => {
  if (!fallbackMethods?.length) return methods;

  const fallbackByInstance = new Map(
    fallbackMethods.map((method) => [String(method.instance_id ?? method.id), method]),
  );

  return methods.map((method) => {
    const instanceId = String(method.instance_id ?? method.id);
    const fallbackMethod = fallbackByInstance.get(instanceId);
    if (!fallbackMethod?.shipping_classes?.length) return method;

    const fallbackBySlug = new Map<string, any>(
      fallbackMethod.shipping_classes.map((shippingClass: any) => [
        shippingClass.class_slug,
        shippingClass,
      ]),
    );

    const shipping_classes = (method.shipping_classes ?? []).map((shippingClass: any) => {
      if (shippingClass.cost != null && shippingClass.cost !== '') return shippingClass;

      const fallbackClass = fallbackBySlug.get(shippingClass.class_slug);
      if (!fallbackClass || fallbackClass.cost == null || fallbackClass.cost === '') {
        return shippingClass;
      }

      return {
        ...shippingClass,
        cost: fallbackClass.cost,
        cost_original: fallbackClass.cost_original,
        price_source: fallbackClass.price_source ?? 'fallback_pl',
      };
    });

    return { ...method, shipping_classes };
  });
};

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    const { lang, action = 'default' } = req.query;

    try {
      switch (action) {
        case 'fetchShippingCountries': {
            // if (req.method === 'GET') {
            //   return res.status(400).json({ error: 'Wrong method' });
            // }

            const cacheKey = `fetchShippingCountries:v3:${lang}`;
            const cached = await getCache(cacheKey);
            if (cached) return res.status(200).json(cached);
    
            const result = await getShippingCountries(lang as string);

            await setCache(cacheKey, result, CACHE_TTL);
            return res.status(200).json(result);
        }
        default: {
          const cacheKey = `ShippingData:v9:${lang}`;
          const cachedData = await getCache(cacheKey);
          if (cachedData) {
            return res.status(200).json(cachedData);
          }

          const langParam = typeof lang === 'string' ? lang : 'pl';
          const fallbackLang = langParam !== 'pl' ? 'pl' : null;

          const zonesResponse = await WooCommerceAPI.get('/shipping/zones');
          const zones = zonesResponse.data;

          if (!zones || zones.length === 0) {
            return res.status(404).json({ error: 'No shipping zones available' });
          }

          const methodsPromises = zones.map(async (zone: any) => {
            const [methodsResponse, fallbackMethodsResponse] = await Promise.all([
              CustomAPI.get(`/shipping/zones/${zone.id}/methods`, {
                params: { lang: langParam },
              }),
              fallbackLang
                ? CustomAPI.get(`/shipping/zones/${zone.id}/methods`, {
                    params: { lang: fallbackLang },
                  })
                : Promise.resolve(null),
            ]);

            const mergedMethods = mergeShippingClassCostsFromFallback(
              methodsResponse.data.methods,
              fallbackMethodsResponse?.data?.methods,
            );

            return {
              zoneId: Number(zone.id),
              zoneName: zone.name,
              methods: mergedMethods
                .filter((method: any) => method.enabled)
                .map((method: any) => ({
                  id: String(method.instance_id ?? method.id),
                  method_id: method.method_id,
                  title: method.title,
                  cost: method.cost ?? null,
                  enabled: method.enabled,
                  shipping_classes: (method.shipping_classes ?? []).map((shippingClass: any) =>
                    normalizeShippingClassCost(shippingClass, langParam),
                  ),
                })),
            };
          });

          const shippingData = await Promise.all(methodsPromises);

          await setCache(cacheKey, shippingData, CACHE_TTL);

          return res.status(200).json(shippingData);
        }
      }

    } catch (error: any) {
      console.error('Error fetching shipping methods:', error.message || error);
      return res.status(500).json({ error: 'Failed to fetch shipping methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
