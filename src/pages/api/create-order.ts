import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API, // WooCommerce REST API base URL
  auth: {
    username: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || '', // Consumer Key from WooCommerce
    password: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || '', // Consumer Secret from WooCommerce
  },
});

// TypeScript interface for the expected order data
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
    variation_id?: number; // Include variation ID if applicable
    quantity: number;
    subtotal: string;
    total: string;
    meta_data?: {
      key: string;
      value: string;
    }[];
  }[];
  customer_note?: string;
  customer_id?: number; // Include customer ID for logged-in users
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderData: OrderData = req.body;

  console.log('Received order data from frontend:');
  console.log(JSON.stringify(orderData, null, 2)); // Log order data for debugging

  // Validate required fields
  if (
    !orderData.payment_method ||
    !orderData.billing ||
    !orderData.shipping ||
    !orderData.shipping_lines ||
    !orderData.line_items
  ) {
    console.error('Missing required order data');
    return res.status(400).json({ error: 'Missing required order data' });
  }

  // Debugging: Validate customer ID
  if (orderData.customer_id) {
    try {
      console.log(`Validating customer ID: ${orderData.customer_id}`);
      const customerResponse = await WooCommerceAPI.get(`/customers/${orderData.customer_id}`);
      console.log('Customer validation successful:', customerResponse.data);
    } catch (error) {
      console.error('Error validating customer_id:', error);
      return res.status(400).json({ error: 'Invalid or non-existent customer_id' });
    }
  } else {
    console.warn('No customer_id provided. This order will be processed as a guest.');
  }

  try {
    // Create the order in WooCommerce
    console.log('Sending order data to WooCommerce API...');
    const response = await WooCommerceAPI.post('/orders', orderData);

    console.log('Order successfully created in WooCommerce:');
    console.log(JSON.stringify(response.data, null, 2)); // Log WooCommerce response for debugging

    res.status(200).json(response.data);
  } catch (err: unknown) {
    const error = err as AxiosError;

    console.error('Error creating order in WooCommerce:');
    console.error(error.response?.data || error.message);

    // Send a detailed error response
    res.status(500).json({
      error: 'Failed to create order',
      details: error.response?.data || error.message,
    });
  }
}
