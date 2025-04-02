import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getCache, setCache } from '../../lib/cache'; // Adjust path as necessary

const CACHE_TTL = 86400; // 24 hours in seconds

// Create the WooCommerce REST API client
const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cacheKey = 'payment_methods';
      // Check if cached payment methods exist
      let cachedPaymentMethods = await getCache(cacheKey);
      if (cachedPaymentMethods) {
        return res.status(200).json(cachedPaymentMethods);
      }
      
      // Fetch payment methods from WooCommerce
      const paymentResponse = await WooCommerceAPI.get('/payment_gateways');
      const paymentMethods = paymentResponse.data;

      if (!paymentMethods || paymentMethods.length === 0) {
        return res.status(404).json({ error: 'No payment methods available' });
      }

      // Filter enabled payment methods
      const enabledMethods = paymentMethods.filter((method: any) => method.enabled);

      // Cache the enabled methods for 24 hours
      await setCache(cacheKey, enabledMethods, CACHE_TTL);

      return res.status(200).json(enabledMethods);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error.message || error);
      return res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
