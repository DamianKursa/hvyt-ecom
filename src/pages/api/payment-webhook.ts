import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, status } = req.body; // Payment gateway should send this data

    console.log('🔔 Payment Webhook Received:', { orderId, status });

    if (!orderId || !status) {
      return res.status(400).json({ error: 'Missing orderId or status' });
    }

    // Map Przelewy24 status to WooCommerce order status
    let wcStatus = 'on-hold';
    if (status === 'SUCCESS') wcStatus = 'completed';
    if (status === 'FAILURE') wcStatus = 'failed';

    // Update WooCommerce order status
    const response = await axios.put(
      `${process.env.REST_API}/orders/${orderId}`,
      { status: wcStatus },
      {
        auth: {
          username: process.env.WC_CONSUMER_KEY!,
          password: process.env.WC_CONSUMER_SECRET!,
        },
      }
    );

    console.log('✅ WooCommerce Order Updated:', response.data);

    return res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error: any) {
    console.error('❌ Error handling payment webhook:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to process payment update' });
  }
}
