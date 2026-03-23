import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { deleteCache, getCache, setCache } from '../../lib/cache';
import { getShippingCountries } from '@/utils/api/shipping';

const CACHE_TTL = 86400;

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

            const cacheKey = `fetchShippingCountries:${lang}`;
            const cached = await getCache(cacheKey);
            if (cached) return res.status(200).json(cached);
    
            const result = await getShippingCountries(lang as string);

            await setCache(cacheKey, result, CACHE_TTL);
            return res.status(200).json(result);
        }
        default: {
          const cacheKey = `ShippingData:${lang}`;
          const cachedData = await getCache(cacheKey);
          if (cachedData) {
            return res.status(200).json(cachedData);
          }

          const zonesResponse = await WooCommerceAPI.get('/shipping/zones');
          const zones = zonesResponse.data;

          if (!zones || zones.length === 0) {
            return res.status(404).json({ error: 'No shipping zones available' });
          }

          const methodsPromises = zones.map(async (zone: any) => {
            const methodsResponse = await CustomAPI.get(`/shipping/zones/${zone.id}/methods`, {
              params: {lang: lang}
            });
            
            return {
              zoneId: zone.id,
              zoneName: zone.name,
              methods: methodsResponse.data.methods
                .filter((method: any) => method.enabled)
                // .map((method: any) => {
                //   const cost = method.title.toLowerCase() === 'kurier gls pobranie'
                //     ? 25 
                //     // : Number(method.settings?.cost?.value);
                //     : Number(method?.cost);
                //   return {
                //     id: method.id,
                //     title: method.title,
                //     cost: isNaN(cost) ? 0 : cost,
                //     enabled: method.enabled,
                //     shipping_classes: method.shipping_classes || [],
                //   };
                // }),
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
