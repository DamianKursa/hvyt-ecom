import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

// TypeScript interface for order data
interface OrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company?: string;
    vat_number?: string;
    address_1: string;
    address_2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  shipping_lines: {
    method_id: string;
    method_title: string;
    total: string;
  }[];
  line_items: {
    product_id: number;
    variation_id?: number;
    quantity: number;
    subtotal: string;
    total: string;
    meta_data?: { key: string; value: string }[];
  }[];
  customer_note?: string;
  customer_id?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderData: OrderData = req.body;



  // Validate required fields
  if (!orderData.payment_method || !orderData.billing || !orderData.shipping || !orderData.shipping_lines || !orderData.line_items) {
  
    return res.status(400).json({ error: 'Missing required order data' });
  }

  // Validate customer ID
  if (orderData.customer_id) {
    try {
      const customerResponse = await WooCommerceAPI.get(`/customers/${orderData.customer_id}`);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or non-existent customer_id' });
    }
  } else {
    console.warn('⚠️ No customer_id provided. This order will be processed as a guest.');
  }

  try {
    const response = await WooCommerceAPI.post('/orders', orderData);

    const createdOrder = response.data;

    res.status(200).json({
      id: createdOrder.id,
      order_key: createdOrder.order_key, // 🔹 Include `order_key` for guest users
      payment_url: createdOrder.payment_url || null,
      status: createdOrder.status,
      total: createdOrder.total,
      currency: createdOrder.currency,
      customer_id: createdOrder.customer_id || null,
    });
  } catch (err: unknown) {
    const error = err as AxiosError;


    res.status(500).json({
      error: 'Failed to create order',
      details: error.response?.data || error.message,
    });
  }
}
