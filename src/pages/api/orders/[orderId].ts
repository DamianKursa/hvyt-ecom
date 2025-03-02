import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, orderKey } = req.query;

  if (!orderId || !orderKey) {
    console.error('❌ Missing orderId or orderKey in request');
    return res.status(400).json({ error: 'Order ID and Order Key are required' });
  }


  // Ensure WooCommerce API credentials exist
  const API_URL = process.env.REST_API;
  const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  if (!API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('❌ WooCommerce API credentials are missing.');
    return res.status(500).json({ error: 'Internal server error: API credentials missing' });
  }

  try {
    // Fetch order from WooCommerce API
    const response = await axios.get(`${API_URL}/orders/${orderId}`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
    });

    const order = response.data;

    // 🔒 Validate order key
    if (order.order_key !== orderKey) {
      console.warn(`🚨 Unauthorized access attempt for order ${orderId}`);
      return res.status(403).json({ error: 'Unauthorized: Invalid Order Key' });
    }


    // Format the response data
    const formattedOrder = {
      id: order.id,
      status: order.status,
      payment_method: order.payment_method_title || 'N/A',
      total: order.total,
      currency: order.currency,
      created_at: order.date_created,
      shipping: {
        first_name: order.shipping?.first_name || '',
        last_name: order.shipping?.last_name || '',
        address: order.shipping?.address_1 || '',
        city: order.shipping?.city || '',
        postcode: order.shipping?.postcode || '',
        country: order.shipping?.country || '',  // add country if needed
        // You can also include additional shipping fields here if available
      },
      billing: {
        first_name: order.billing?.first_name || '',
        last_name: order.billing?.last_name || '',
        email: order.billing?.email || '',
        phone: order.billing?.phone || '',
        company: order.billing?.company || '',
        address: order.billing?.address_1 || '',
        city: order.billing?.city || '',
        postcode: order.billing?.postcode || '',
        country: order.billing?.country || '',
        // And any other fields you need
      },
      items: order.line_items.map((item: any) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.total).toFixed(2),
        image: item.image?.src || '/placeholder.jpg',
      })),
    };
    

    return res.status(200).json(formattedOrder);
  } catch (error: any) {
    console.error('❌ Error fetching order:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
}
