import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache';

const CACHE_TTL = 21600;

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', 
    password: process.env.WC_CONSUMER_SECRET || '', 
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    const { lang } = req.query;

    const cacheKey = 'ShippingData';

    try {

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
        const methodsResponse = await WooCommerceAPI.get(`/shipping/zones/${zone.id}/methods`);
        return {
          zoneName: zone.name,
          methods: methodsResponse.data
            .filter((method: any) => method.enabled)
            .map((method: any) => {
              const cost = method.title.toLowerCase() === 'kurier gls pobranie'
                ? 25 
                : Number(method.settings?.cost?.value);
              return {
                id: method.id,
                title: method.title,
                cost: isNaN(cost) ? 0 : cost,
                enabled: method.enabled,
              };
            }),
        };
      });

      const shippingData = await Promise.all(methodsPromises);

      // const polandShippingData = shippingData.filter((zone) =>
      //   zone.zoneName.toLowerCase().includes('polska') ||
      //   zone.zoneName.toLowerCase().includes('poland')
      // );

      // await setCache(cacheKey, polandShippingData, CACHE_TTL);
      await setCache(cacheKey, shippingData, CACHE_TTL);

      // return res.status(200).json(polandShippingData);
      return res.status(200).json(shippingData);
    } catch (error: any) {
      console.error('Error fetching shipping methods:', error.message || error);
      return res.status(500).json({ error: 'Failed to fetch shipping methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
