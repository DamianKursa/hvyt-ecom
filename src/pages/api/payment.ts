import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache'; 

const CACHE_TTL = 86400; 

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, 
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', 
    password: process.env.WC_CONSUMER_SECRET || '', 
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cacheKey = 'payment_methods';

      let cachedPaymentMethods = await getCache(cacheKey);
      if (cachedPaymentMethods) {
        return res.status(200).json(cachedPaymentMethods);
      }
      
      const paymentResponse = await WooCommerceAPI.get('/payment_gateways');
      const paymentMethods = paymentResponse.data;

      if (!paymentMethods || paymentMethods.length === 0) {
        return res.status(404).json({ error: 'No payment methods available' });
      }


      const enabledMethods = paymentMethods.filter((method: any) => method.enabled);

      await setCache(cacheKey, enabledMethods, CACHE_TTL);

      return res.status(200).json(enabledMethods);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error.message || error);
      return res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
