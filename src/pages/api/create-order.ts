import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

const WooCommerceAPI = axios.create({
  baseURL: process.env.REST_API,
  auth: {
    username: process.env.WC_CONSUMER_KEY || '',
    password: process.env.WC_CONSUMER_SECRET || '',
  },
});

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

const PAYMENT_METHOD_TITLES: Record<string, string> = {
  bacs: 'Faktura proforma',
  pay_by_paynow_pl_pbl: 'paynow.pl - Online payments',
  pay_by_paynow_pl_paywall: 'paynow.pl - Online payments',
  przelewy24: 'Przelewy24',
  'p24-online-payments': 'Przelewy24',
  stripe: 'Stripe',
  cod: 'Za pobraniem',
};

const resolvePaymentMethodTitle = (
  paymentMethod: string,
  fallbackTitle?: string,
): string => PAYMENT_METHOD_TITLES[paymentMethod] || fallbackTitle || paymentMethod;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const orderData: OrderData = req.body;

  if (!orderData.payment_method || !orderData.billing || !orderData.shipping || !orderData.shipping_lines || !orderData.line_items) {

    return res.status(400).json({ error: 'Missing required order data' });
  }

  const paymentMethod = String(orderData.payment_method).trim();
  // Never accept fuzzy "bacs" ids (e.g. stripe_bacs_debit) as proforma.
  if (paymentMethod !== 'bacs' && paymentMethod.toLowerCase().includes('bacs')) {
    return res.status(400).json({
      error: 'Invalid payment method',
      details: `Unsupported payment method id: ${paymentMethod}`,
    });
  }

  const payload = {
    ...orderData,
    payment_method: paymentMethod,
    payment_method_title: resolvePaymentMethodTitle(
      paymentMethod,
      orderData.payment_method_title,
    ),
  };

  if (orderData.customer_id) {
    try {
      await WooCommerceAPI.get(`/customers/${orderData.customer_id}`);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or non-existent customer_id' });
    }
  } else {
    console.warn('⚠️ No customer_id provided. This order will be processed as a guest.');
  }

  try {
    console.info('🧾 Creating order with payment:', {
      payment_method: payload.payment_method,
      payment_method_title: payload.payment_method_title,
    });

    const response = await WooCommerceAPI.post('/orders', payload);

    let createdOrder = response.data;

    // Woo (or a plugin) sometimes rewrites the gateway — correct it when mismatched.
    if (
      createdOrder?.id &&
      String(createdOrder.payment_method || '') !== paymentMethod
    ) {
      console.error('❌ Payment method mismatch after create:', {
        requested: paymentMethod,
        saved: createdOrder.payment_method,
        savedTitle: createdOrder.payment_method_title,
        orderId: createdOrder.id,
      });

      try {
        const fixResponse = await WooCommerceAPI.put(`/orders/${createdOrder.id}`, {
          payment_method: paymentMethod,
          payment_method_title: resolvePaymentMethodTitle(
            paymentMethod,
            payload.payment_method_title,
          ),
        });
        createdOrder = fixResponse.data;
        console.info('✅ Payment method corrected on order', createdOrder.id);
      } catch (fixError: any) {
        console.error(
          '❌ Failed to correct payment method:',
          fixError?.response?.data || fixError?.message || fixError,
        );
      }
    }

    res.status(200).json({
      id: createdOrder.id,
      order_key: createdOrder.order_key,
      payment_url: createdOrder.payment_url || null,
      payment_method: createdOrder.payment_method || paymentMethod,
      payment_method_title: createdOrder.payment_method_title || payload.payment_method_title,
      status: createdOrder.status,
      total: createdOrder.total,
      currency: createdOrder.currency,
      customer_id: createdOrder.customer_id || null,
    });
  } catch (err: unknown) {
    const error = err as AxiosError<any>;
    const status = error.response?.status || 500;
    const data = error.response?.data;
    console.error('❌ Woo create order failed:', { status, data, message: error.message });
    res.status(500).json({
      error: 'Failed to create order',
      details: data || error.message,
    });
  }
}
