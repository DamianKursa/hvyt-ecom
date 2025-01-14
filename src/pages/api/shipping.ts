import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Create the WooCommerce REST API client
const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const zonesResponse = await WooCommerceAPI.get('/shipping/zones');

      const zones = zonesResponse.data;
      

      if (!zones || zones.length === 0) {
        return res.status(404).json({ error: 'No shipping zones available' });
      }

      const methodsPromises = zones.map(async (zone: any) => {
        const methodsResponse = await WooCommerceAPI.get(
          `/shipping/zones/${zone.id}/methods`
        );

        return {
          zoneName: zone.name,
          methods: methodsResponse.data
          .filter((method: any) => method.enabled)
          .map((method: any) => {
            const cost =
              method.title.toLowerCase() === 'kurier gls pobranie'
                ? 25 // Fallback to 25 if cost is missing or 0
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

      // Filter zones for Poland
      const polandShippingData = shippingData.filter((zone) =>
        zone.zoneName.toLowerCase().includes('polska') ||
        zone.zoneName.toLowerCase().includes('poland')
      );

      return res.status(200).json(polandShippingData);
    } catch (error: any) {
      console.error('Error fetching shipping methods:', error.message || error);
      
      return res.status(500).json({ error: 'Failed to fetch shipping methods' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
